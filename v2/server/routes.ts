import { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { userInsertSchema, userUpdateSchema, moduleInsertSchema, quizInsertSchema, quizQuestionInsertSchema, quizOptionInsertSchema, dictionaryTermInsertSchema, tradeAgreementInsertSchema, dailyChallengeInsertSchema } from '../shared/schema';
import { storage } from './storage';

/**
 * Type for authenticated request with user ID in session
 */
interface AuthenticatedRequest extends Request {
  session: Request['session'] & {
    userId?: number;
    userRole?: 'admin' | 'editor' | 'premium' | 'basic';
  };
}

/**
 * Authentication middleware to restrict access to authenticated users
 */
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: { message: 'Authentication required', status: 401 } });
  }
  next();
}

/**
 * Authorization middleware to restrict access to users with specific roles
 */
function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.session.userRole || !roles.includes(req.session.userRole)) {
      return res.status(403).json({ error: { message: 'Insufficient permissions', status: 403 } });
    }
    next();
  };
}

/**
 * Register all API routes for the v2 platform
 */
export async function registerRoutes(app: Express) {
  // Health check route
  app.get('/v2/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Register authentication routes
  registerAuthRoutes(app);
  
  // Register module routes
  registerModuleRoutes(app);
  
  // Register quiz routes
  registerQuizRoutes(app);
  
  // Register dictionary routes
  registerDictionaryRoutes(app);
  
  // Register trade agreement routes
  registerTradeAgreementRoutes(app);
  
  // Register daily challenge routes
  registerChallengeRoutes(app);
  
  // Register progress tracking routes
  registerProgressRoutes(app);
  
  // Register badge routes
  registerBadgeRoutes(app);
  
  // Register feature flag routes
  registerFeatureFlagRoutes(app);
  
  // Register email subscription routes
  registerEmailSubscriptionRoutes(app);
}

/**
 * Register authentication routes
 */
function registerAuthRoutes(app: Express) {
  // Register a new user
  app.post('/v2/api/auth/register', async (req: Request, res: Response) => {
    try {
      // Validate input
      const userData = userInsertSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ error: { message: 'Email already registered', status: 409 } });
      }
      
      // Hash password if provided
      let insertData = userData;
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        insertData = { ...userData, password: hashedPassword };
      }
      
      // Create user
      const user = await storage.createUser(insertData);
      
      // Log user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: { message: 'Failed to log in after registration', status: 500 } });
        }
        
        // Set session data
        (req as AuthenticatedRequest).session.userId = user.id;
        (req as AuthenticatedRequest).session.userRole = user.role;
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json({ user: userWithoutPassword });
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid user data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to register user', status: 500 } });
    }
  });
  
  // Login with email and password
  app.post('/v2/api/auth/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ error: { message: info?.message || 'Authentication failed', status: 401 } });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        
        // Set session data
        (req as AuthenticatedRequest).session.userId = user.id;
        (req as AuthenticatedRequest).session.userRole = user.role;
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });
  
  // Logout
  app.post('/v2/api/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: { message: 'Failed to log out', status: 500 } });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  // Get current user
  app.get('/v2/api/auth/me', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: { message: 'Not authenticated', status: 401 } });
    }
    
    try {
      const user = await storage.getUser((req.user as any).id);
      if (!user) {
        return res.status(404).json({ error: { message: 'User not found', status: 404 } });
      }
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: { message: 'Failed to fetch user data', status: 500 } });
    }
  });
  
  // Google OAuth login initiation
  app.get('/v2/api/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  // Google OAuth callback
  app.get('/v2/api/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/v2/login?auth=failed',
      successRedirect: '/v2/dashboard'
    })
  );
  
  // Update user profile
  app.patch('/v2/api/auth/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userData = userUpdateSchema.parse(req.body);
      const userId = req.session.userId;
      
      // Hash password if provided
      let updateData = userData;
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        updateData = { ...userData, password: hashedPassword };
      }
      
      // Update user
      const user = await storage.updateUser(userId!, updateData);
      
      if (!user) {
        return res.status(404).json({ error: { message: 'User not found', status: 404 } });
      }
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Profile update error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid user data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to update profile', status: 500 } });
    }
  });
}

/**
 * Register module routes
 */
function registerModuleRoutes(app: Express) {
  // Get all modules (with optional filtering)
  app.get('/v2/api/modules', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const published = req.query.published === 'true';
      
      // Only return published modules for non-admin/editor users
      let publishedFilter = published;
      if (req.isAuthenticated()) {
        const userRole = (req as AuthenticatedRequest).session.userRole;
        if (userRole === 'admin' || userRole === 'editor') {
          publishedFilter = req.query.published === 'true' ? true : undefined;
        } else {
          publishedFilter = true;
        }
      } else {
        publishedFilter = true;
      }
      
      const modules = await storage.getModules({ 
        category, 
        published: publishedFilter 
      });
      
      // Calculate categories and total counts
      const categories = [...new Set(modules.map(m => m.category))];
      const totalModules = modules.length;
      
      res.json({ 
        modules,
        categories,
        totalModules
      });
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ error: { message: 'Failed to fetch modules', status: 500 } });
    }
  });
  
  // Get module by ID
  app.get('/v2/api/modules/:id', async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id, 10);
      const module = await storage.getModuleById(moduleId);
      
      if (!module) {
        return res.status(404).json({ error: { message: 'Module not found', status: 404 } });
      }
      
      // Check if user can access unpublished module
      if (!module.published) {
        if (!req.isAuthenticated()) {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
        
        const userRole = (req as AuthenticatedRequest).session.userRole;
        if (userRole !== 'admin' && userRole !== 'editor') {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
      }
      
      res.json({ module });
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ error: { message: 'Failed to fetch module', status: 500 } });
    }
  });
  
  // Get module by slug
  app.get('/v2/api/modules/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const module = await storage.getModuleBySlug(slug);
      
      if (!module) {
        return res.status(404).json({ error: { message: 'Module not found', status: 404 } });
      }
      
      // Check if user can access unpublished module
      if (!module.published) {
        if (!req.isAuthenticated()) {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
        
        const userRole = (req as AuthenticatedRequest).session.userRole;
        if (userRole !== 'admin' && userRole !== 'editor') {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
      }
      
      res.json({ module });
    } catch (error) {
      console.error('Error fetching module by slug:', error);
      res.status(500).json({ error: { message: 'Failed to fetch module', status: 500 } });
    }
  });
  
  // Create a new module (admin/editor only)
  app.post('/v2/api/modules', requireAuth, requireRole(['admin', 'editor']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const moduleData = moduleInsertSchema.parse(req.body);
      
      // Set author ID to current user
      const userId = req.session.userId;
      
      const module = await storage.createModule({
        ...moduleData,
        authorId: userId,
        estimatedMinutes: moduleData.estimatedMinutes || 15,
      });
      
      res.status(201).json({ module });
    } catch (error) {
      console.error('Error creating module:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid module data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to create module', status: 500 } });
    }
  });
  
  // Update a module (admin/editor only)
  app.patch('/v2/api/modules/:id', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id, 10);
      const moduleData = moduleInsertSchema.partial().parse(req.body);
      
      const module = await storage.updateModule(moduleId, moduleData);
      
      if (!module) {
        return res.status(404).json({ error: { message: 'Module not found', status: 404 } });
      }
      
      res.json({ module });
    } catch (error) {
      console.error('Error updating module:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid module data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to update module', status: 500 } });
    }
  });
}

/**
 * Register quiz routes
 */
function registerQuizRoutes(app: Express) {
  // Get all quizzes (with optional filtering)
  app.get('/v2/api/quizzes', async (req: Request, res: Response) => {
    try {
      const moduleId = req.query.moduleId ? parseInt(req.query.moduleId as string, 10) : undefined;
      const published = req.query.published === 'true';
      
      // Only return published quizzes for non-admin/editor users
      let publishedFilter = published;
      if (req.isAuthenticated()) {
        const userRole = (req as AuthenticatedRequest).session.userRole;
        if (userRole === 'admin' || userRole === 'editor') {
          publishedFilter = req.query.published === 'true' ? true : undefined;
        } else {
          publishedFilter = true;
        }
      } else {
        publishedFilter = true;
      }
      
      const quizzes = await storage.getQuizzes({ 
        moduleId, 
        published: publishedFilter 
      });
      
      res.json({ quizzes });
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ error: { message: 'Failed to fetch quizzes', status: 500 } });
    }
  });
  
  // Get quiz by ID
  app.get('/v2/api/quizzes/:id', async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id, 10);
      const quiz = await storage.getQuizById(quizId);
      
      if (!quiz) {
        return res.status(404).json({ error: { message: 'Quiz not found', status: 404 } });
      }
      
      // Check if user can access unpublished quiz
      if (!quiz.published) {
        if (!req.isAuthenticated()) {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
        
        const userRole = (req as AuthenticatedRequest).session.userRole;
        if (userRole !== 'admin' && userRole !== 'editor') {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
      }
      
      // Get questions for the quiz
      const questions = await storage.getQuizQuestions(quizId);
      
      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.id);
          return {
            ...question,
            options
          };
        })
      );
      
      res.json({ 
        quiz,
        questions: questionsWithOptions
      });
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ error: { message: 'Failed to fetch quiz', status: 500 } });
    }
  });
  
  // Get quiz by slug
  app.get('/v2/api/quizzes/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const quiz = await storage.getQuizBySlug(slug);
      
      if (!quiz) {
        return res.status(404).json({ error: { message: 'Quiz not found', status: 404 } });
      }
      
      // Check if user can access unpublished quiz
      if (!quiz.published) {
        if (!req.isAuthenticated()) {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
        
        const userRole = (req as AuthenticatedRequest).session.userRole;
        if (userRole !== 'admin' && userRole !== 'editor') {
          return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
        }
      }
      
      // Get questions for the quiz
      const questions = await storage.getQuizQuestions(quiz.id);
      
      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.id);
          return {
            ...question,
            options
          };
        })
      );
      
      res.json({ 
        quiz,
        questions: questionsWithOptions
      });
    } catch (error) {
      console.error('Error fetching quiz by slug:', error);
      res.status(500).json({ error: { message: 'Failed to fetch quiz', status: 500 } });
    }
  });
  
  // Submit quiz answers
  app.post('/v2/api/quizzes/:id/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.id, 10);
      const userId = req.session.userId!;
      const answers = req.body.answers as { questionId: number; selectedOptionId: number }[];
      
      // Validate quiz exists
      const quiz = await storage.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: { message: 'Quiz not found', status: 404 } });
      }
      
      // Get questions for the quiz
      const questions = await storage.getQuizQuestions(quizId);
      
      // Calculate score
      let score = 0;
      const responses: Record<number, { 
        questionId: number; 
        selectedOptionId: number; 
        isCorrect: boolean;
        correctOptionId?: number;
      }> = {};
      
      await Promise.all(
        answers.map(async (answer) => {
          const question = questions.find(q => q.id === answer.questionId);
          if (!question) return;
          
          // Get options for the question
          const options = await storage.getQuizOptions(question.id);
          const selectedOption = options.find(o => o.id === answer.selectedOptionId);
          const correctOption = options.find(o => o.isCorrect);
          
          const isCorrect = selectedOption?.isCorrect || false;
          if (isCorrect) {
            score += question.points;
          }
          
          responses[question.id] = {
            questionId: question.id,
            selectedOptionId: answer.selectedOptionId,
            isCorrect,
            correctOptionId: correctOption?.id,
          };
        })
      );
      
      // Calculate percentage
      const maxScore = questions.reduce((total, q) => total + q.points, 0);
      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      const passed = percentage >= quiz.passingScore;
      
      // Get existing progress or create new
      let progress = await storage.getUserQuizProgress(userId, quizId);
      
      if (progress) {
        // Update existing progress
        progress = await storage.updateUserQuizProgress(userId, quizId, {
          score: percentage,
          attempts: progress.attempts + 1,
          completed: passed,
          lastAttemptAt: new Date(),
          responses: responses,
        });
      } else {
        // Create new progress
        progress = await storage.createUserQuizProgress({
          userId,
          quizId,
          score: percentage,
          attempts: 1,
          completed: passed,
          lastAttemptAt: new Date(),
          responses: responses,
        });
      }
      
      res.json({
        score: percentage,
        maxScore,
        passed,
        attempts: progress.attempts,
        responses
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: { message: 'Failed to submit quiz', status: 500 } });
    }
  });
}

/**
 * Register dictionary routes
 */
function registerDictionaryRoutes(app: Express) {
  // Get all dictionary terms (with optional filtering)
  app.get('/v2/api/dictionary', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const searchQuery = req.query.search as string | undefined;
      
      const terms = await storage.getDictionaryTerms({ 
        category,
        searchQuery 
      });
      
      // Calculate categories
      const categories = [...new Set(terms.map(t => t.category))];
      
      res.json({ 
        terms,
        categories,
        total: terms.length
      });
    } catch (error) {
      console.error('Error fetching dictionary terms:', error);
      res.status(500).json({ error: { message: 'Failed to fetch dictionary terms', status: 500 } });
    }
  });
  
  // Get term by ID
  app.get('/v2/api/dictionary/:id', async (req: Request, res: Response) => {
    try {
      const termId = parseInt(req.params.id, 10);
      const term = await storage.getDictionaryTermById(termId);
      
      if (!term) {
        return res.status(404).json({ error: { message: 'Term not found', status: 404 } });
      }
      
      // Increment view count
      await storage.incrementDictionaryTermViewCount(termId);
      
      res.json({ term });
    } catch (error) {
      console.error('Error fetching dictionary term:', error);
      res.status(500).json({ error: { message: 'Failed to fetch dictionary term', status: 500 } });
    }
  });
  
  // Get term by slug
  app.get('/v2/api/dictionary/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const term = await storage.getDictionaryTermBySlug(slug);
      
      if (!term) {
        return res.status(404).json({ error: { message: 'Term not found', status: 404 } });
      }
      
      // Increment view count
      await storage.incrementDictionaryTermViewCount(term.id);
      
      res.json({ term });
    } catch (error) {
      console.error('Error fetching dictionary term by slug:', error);
      res.status(500).json({ error: { message: 'Failed to fetch dictionary term', status: 500 } });
    }
  });
  
  // Create a new dictionary term (admin/editor only)
  app.post('/v2/api/dictionary', requireAuth, requireRole(['admin', 'editor']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const termData = dictionaryTermInsertSchema.parse(req.body);
      
      // Set author ID to current user
      const userId = req.session.userId;
      
      const term = await storage.createDictionaryTerm({
        ...termData,
        authorId: userId,
        viewCount: 0
      });
      
      res.status(201).json({ term });
    } catch (error) {
      console.error('Error creating dictionary term:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid term data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to create dictionary term', status: 500 } });
    }
  });
  
  // Update a dictionary term (admin/editor only)
  app.patch('/v2/api/dictionary/:id', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
    try {
      const termId = parseInt(req.params.id, 10);
      const termData = dictionaryTermInsertSchema.partial().parse(req.body);
      
      const term = await storage.updateDictionaryTerm(termId, termData);
      
      if (!term) {
        return res.status(404).json({ error: { message: 'Term not found', status: 404 } });
      }
      
      res.json({ term });
    } catch (error) {
      console.error('Error updating dictionary term:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid term data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to update dictionary term', status: 500 } });
    }
  });
}

/**
 * Register trade agreement routes
 */
function registerTradeAgreementRoutes(app: Express) {
  // Get all trade agreements (with optional filtering)
  app.get('/v2/api/agreements', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as "active" | "expired" | "proposed" | "renegotiating" | undefined;
      const searchQuery = req.query.search as string | undefined;
      
      const agreements = await storage.getTradeAgreements({ 
        status,
        searchQuery 
      });
      
      // Calculate statistics
      const totalActive = agreements.filter(a => a.status === 'active').length;
      const totalExpired = agreements.filter(a => a.status === 'expired').length;
      const totalProposed = agreements.filter(a => a.status === 'proposed').length;
      const totalRenegotiating = agreements.filter(a => a.status === 'renegotiating').length;
      
      res.json({ 
        agreements,
        stats: {
          totalActive,
          totalExpired,
          totalProposed,
          totalRenegotiating,
          total: agreements.length
        }
      });
    } catch (error) {
      console.error('Error fetching trade agreements:', error);
      res.status(500).json({ error: { message: 'Failed to fetch trade agreements', status: 500 } });
    }
  });
  
  // Get agreement by ID
  app.get('/v2/api/agreements/:id', async (req: Request, res: Response) => {
    try {
      const agreementId = parseInt(req.params.id, 10);
      const agreement = await storage.getTradeAgreementById(agreementId);
      
      if (!agreement) {
        return res.status(404).json({ error: { message: 'Agreement not found', status: 404 } });
      }
      
      res.json({ agreement });
    } catch (error) {
      console.error('Error fetching trade agreement:', error);
      res.status(500).json({ error: { message: 'Failed to fetch trade agreement', status: 500 } });
    }
  });
  
  // Get agreement by slug
  app.get('/v2/api/agreements/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const agreement = await storage.getTradeAgreementBySlug(slug);
      
      if (!agreement) {
        return res.status(404).json({ error: { message: 'Agreement not found', status: 404 } });
      }
      
      res.json({ agreement });
    } catch (error) {
      console.error('Error fetching trade agreement by slug:', error);
      res.status(500).json({ error: { message: 'Failed to fetch trade agreement', status: 500 } });
    }
  });
  
  // Create a new trade agreement (admin/editor only)
  app.post('/v2/api/agreements', requireAuth, requireRole(['admin', 'editor']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const agreementData = tradeAgreementInsertSchema.parse(req.body);
      
      // Set author ID to current user
      const userId = req.session.userId;
      
      const agreement = await storage.createTradeAgreement({
        ...agreementData,
        authorId: userId,
      });
      
      res.status(201).json({ agreement });
    } catch (error) {
      console.error('Error creating trade agreement:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid agreement data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to create trade agreement', status: 500 } });
    }
  });
  
  // Update a trade agreement (admin/editor only)
  app.patch('/v2/api/agreements/:id', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
    try {
      const agreementId = parseInt(req.params.id, 10);
      const agreementData = tradeAgreementInsertSchema.partial().parse(req.body);
      
      const agreement = await storage.updateTradeAgreement(agreementId, agreementData);
      
      if (!agreement) {
        return res.status(404).json({ error: { message: 'Agreement not found', status: 404 } });
      }
      
      res.json({ agreement });
    } catch (error) {
      console.error('Error updating trade agreement:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid agreement data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to update trade agreement', status: 500 } });
    }
  });
}

/**
 * Register daily challenge routes
 */
function registerChallengeRoutes(app: Express) {
  // Get today's challenge
  app.get('/v2/api/challenges/today', async (req: Request, res: Response) => {
    try {
      const today = new Date();
      const challenge = await storage.getDailyChallenge(today);
      
      if (!challenge) {
        return res.status(404).json({ error: { message: 'No challenge available for today', status: 404 } });
      }
      
      // Check if user has completed the challenge
      let completed = false;
      if (req.isAuthenticated()) {
        const userId = (req.user as any).id;
        const completion = await storage.getChallengeCompletion(userId, challenge.id);
        completed = !!completion;
      }
      
      res.json({ 
        challenge,
        completed
      });
    } catch (error) {
      console.error('Error fetching today\'s challenge:', error);
      res.status(500).json({ error: { message: 'Failed to fetch daily challenge', status: 500 } });
    }
  });
  
  // Get all daily challenges (admin/editor only)
  app.get('/v2/api/challenges', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getDailyChallenges();
      res.json({ challenges });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: { message: 'Failed to fetch challenges', status: 500 } });
    }
  });
  
  // Complete a daily challenge
  app.post('/v2/api/challenges/:id/complete', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const challengeId = parseInt(req.params.id, 10);
      const userId = req.session.userId!;
      
      // Validate challenge exists
      const challenge = await storage.getDailyChallenge();
      if (!challenge || challenge.id !== challengeId) {
        return res.status(404).json({ error: { message: 'Challenge not found or not active today', status: 404 } });
      }
      
      // Check if already completed
      const existingCompletion = await storage.getChallengeCompletion(userId, challengeId);
      if (existingCompletion) {
        return res.status(409).json({ error: { message: 'Challenge already completed', status: 409 } });
      }
      
      // Create completion record
      const completion = await storage.createChallengeCompletion({
        userId,
        challengeId,
        completedAt: new Date(),
        pointsEarned: challenge.points,
      });
      
      res.status(201).json({ 
        completion,
        pointsEarned: challenge.points
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      res.status(500).json({ error: { message: 'Failed to complete challenge', status: 500 } });
    }
  });
  
  // Create a new daily challenge (admin/editor only)
  app.post('/v2/api/challenges', requireAuth, requireRole(['admin', 'editor']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const challengeData = dailyChallengeInsertSchema.parse(req.body);
      
      // Set author ID to current user
      const userId = req.session.userId;
      
      const challenge = await storage.createDailyChallenge({
        ...challengeData,
        authorId: userId,
      });
      
      res.status(201).json({ challenge });
    } catch (error) {
      console.error('Error creating daily challenge:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Invalid challenge data', details: error.errors, status: 400 } });
      }
      res.status(500).json({ error: { message: 'Failed to create daily challenge', status: 500 } });
    }
  });
}

/**
 * Register user progress tracking routes
 */
function registerProgressRoutes(app: Express) {
  // Get user's module progress
  app.get('/v2/api/progress/modules', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.session.userId!;
      const progress = await storage.getUserModuleProgressByUser(userId);
      
      res.json({ progress });
    } catch (error) {
      console.error('Error fetching module progress:', error);
      res.status(500).json({ error: { message: 'Failed to fetch module progress', status: 500 } });
    }
  });
  
  // Get user's quiz progress
  app.get('/v2/api/progress/quizzes', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.session.userId!;
      const progress = await storage.getUserQuizProgressByUser(userId);
      
      res.json({ progress });
    } catch (error) {
      console.error('Error fetching quiz progress:', error);
      res.status(500).json({ error: { message: 'Failed to fetch quiz progress', status: 500 } });
    }
  });
  
  // Update a module's progress
  app.post('/v2/api/progress/modules/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id, 10);
      const userId = req.session.userId!;
      
      const { 
        status, 
        progress: progressValue, 
        currentSection, 
        completed 
      } = req.body;
      
      // Validate module exists
      const module = await storage.getModuleById(moduleId);
      if (!module) {
        return res.status(404).json({ error: { message: 'Module not found', status: 404 } });
      }
      
      // Get existing progress or create new
      let progress = await storage.getUserModuleProgress(userId, moduleId);
      
      const now = new Date();
      if (progress) {
        // Update existing progress
        const updateData: any = {
          lastAccessedAt: now,
        };
        
        if (status) updateData.status = status;
        if (progressValue !== undefined) updateData.progress = progressValue;
        if (currentSection !== undefined) updateData.currentSection = currentSection;
        
        // Mark as completed if specified
        if (completed) {
          updateData.status = 'completed';
          updateData.completedAt = now;
          updateData.progress = 100;
        }
        
        progress = await storage.updateUserModuleProgress(userId, moduleId, updateData);
      } else {
        // Create new progress
        const insertData: any = {
          userId,
          moduleId,
          lastAccessedAt: now,
          startedAt: now,
          status: status || 'in_progress',
          progress: progressValue || 0,
          currentSection: currentSection || 0,
        };
        
        // Mark as completed if specified
        if (completed) {
          insertData.status = 'completed';
          insertData.completedAt = now;
          insertData.progress = 100;
        }
        
        progress = await storage.createUserModuleProgress(insertData);
      }
      
      res.json({ progress });
    } catch (error) {
      console.error('Error updating module progress:', error);
      res.status(500).json({ error: { message: 'Failed to update module progress', status: 500 } });
    }
  });
  
  // Get user's certificates
  app.get('/v2/api/certificates', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.session.userId!;
      const certificates = await storage.getUserCertificates(userId);
      
      res.json({ certificates });
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ error: { message: 'Failed to fetch certificates', status: 500 } });
    }
  });
  
  // Generate a certificate for a category
  app.post('/v2/api/certificates/category/:category', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.session.userId!;
      const category = req.params.category;
      
      // Get all modules for the category
      const modules = await storage.getModules({ category, published: true });
      if (modules.length === 0) {
        return res.status(404).json({ error: { message: 'No modules found for category', status: 404 } });
      }
      
      // Check user's progress for each module
      const progress = await storage.getUserModuleProgressByUser(userId);
      const categoryProgress = progress.filter(p => 
        modules.some(m => m.id === p.moduleId)
      );
      
      // Check if all modules are completed
      const allCompleted = modules.every(module => 
        categoryProgress.some(p => 
          p.moduleId === module.id && p.status === 'completed'
        )
      );
      
      if (!allCompleted) {
        return res.status(400).json({ 
          error: { 
            message: 'Not all modules in this category are completed', 
            status: 400,
            completedCount: categoryProgress.filter(p => p.status === 'completed').length,
            totalCount: modules.length
          } 
        });
      }
      
      // Generate certificate
      const verificationCode = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);
      
      const certificate = await storage.createCertificate({
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Certificate`,
        userId,
        verificationCode,
        issuedAt: new Date(),
        imageUrl: `/certificates/${category.toLowerCase()}.png`,
      });
      
      res.status(201).json({ certificate });
    } catch (error) {
      console.error('Error generating certificate:', error);
      res.status(500).json({ error: { message: 'Failed to generate certificate', status: 500 } });
    }
  });
}

/**
 * Register badge routes
 */
function registerBadgeRoutes(app: Express) {
  // Get all badges
  app.get('/v2/api/badges', async (req: Request, res: Response) => {
    try {
      const badges = await storage.getBadges();
      res.json({ badges });
    } catch (error) {
      console.error('Error fetching badges:', error);
      res.status(500).json({ error: { message: 'Failed to fetch badges', status: 500 } });
    }
  });
  
  // Get user's badges
  app.get('/v2/api/user/badges', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.session.userId!;
      const userBadges = await storage.getUserBadges(userId);
      
      // Get badge details for each user badge
      const badgesWithDetails = await Promise.all(
        userBadges.map(async (userBadge) => {
          const badge = await storage.getBadgeById(userBadge.badgeId);
          return {
            ...userBadge,
            badge
          };
        })
      );
      
      res.json({ badges: badgesWithDetails });
    } catch (error) {
      console.error('Error fetching user badges:', error);
      res.status(500).json({ error: { message: 'Failed to fetch user badges', status: 500 } });
    }
  });
  
  // Award a badge to a user (admin/editor only)
  app.post('/v2/api/badges/:id/award/:userId', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
    try {
      const badgeId = parseInt(req.params.id, 10);
      const userId = parseInt(req.params.userId, 10);
      
      // Validate badge exists
      const badge = await storage.getBadgeById(badgeId);
      if (!badge) {
        return res.status(404).json({ error: { message: 'Badge not found', status: 404 } });
      }
      
      // Validate user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: { message: 'User not found', status: 404 } });
      }
      
      // Check if user already has the badge
      const existingBadge = await storage.getUserBadge(userId, badgeId);
      if (existingBadge) {
        return res.status(409).json({ error: { message: 'User already has this badge', status: 409 } });
      }
      
      // Award badge
      const userBadge = await storage.awardBadge({
        userId,
        badgeId,
        awardedAt: new Date(),
      });
      
      res.status(201).json({ userBadge });
    } catch (error) {
      console.error('Error awarding badge:', error);
      res.status(500).json({ error: { message: 'Failed to award badge', status: 500 } });
    }
  });
}

/**
 * Register feature flag routes
 */
function registerFeatureFlagRoutes(app: Express) {
  // Get all feature flags
  app.get('/v2/api/feature-flags', async (req: Request, res: Response) => {
    try {
      // Admin/editors see all flags, others see only user-relevant flags
      let flags = await storage.getFeatureFlags();
      
      if (req.isAuthenticated()) {
        const userRole = (req as AuthenticatedRequest).session.userRole;
        if (userRole !== 'admin' && userRole !== 'editor') {
          flags = flags.filter(flag => !flag.name.startsWith('admin'));
        }
      } else {
        flags = flags.filter(flag => !flag.name.startsWith('admin'));
      }
      
      res.json({ flags });
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      res.status(500).json({ error: { message: 'Failed to fetch feature flags', status: 500 } });
    }
  });
  
  // Get a specific feature flag
  app.get('/v2/api/feature-flags/:name', async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      
      // Check if the flag is an admin flag and user is not admin/editor
      if (name.startsWith('admin') && (!req.isAuthenticated() || 
          ((req as AuthenticatedRequest).session.userRole !== 'admin' && 
           (req as AuthenticatedRequest).session.userRole !== 'editor'))) {
        return res.status(403).json({ error: { message: 'Access denied', status: 403 } });
      }
      
      const flag = await storage.getFeatureFlag(name);
      
      if (!flag) {
        return res.status(404).json({ error: { message: 'Feature flag not found', status: 404 } });
      }
      
      // Check if user has access to this feature
      let isEnabled = flag.isEnabled;
      if (req.isAuthenticated()) {
        const userRole = (req as AuthenticatedRequest).session.userRole;
        const featureAccess = await storage.getFeatureAccess(name, userRole!);
        if (featureAccess) {
          isEnabled = featureAccess.isEnabled;
        }
      }
      
      // For anonymous users, premium features are disabled
      if (!req.isAuthenticated() && name.startsWith('premium')) {
        isEnabled = false;
      }
      
      res.json({ 
        flag,
        isEnabled
      });
    } catch (error) {
      console.error('Error fetching feature flag:', error);
      res.status(500).json({ error: { message: 'Failed to fetch feature flag', status: 500 } });
    }
  });
  
  // Update a feature flag (admin only)
  app.patch('/v2/api/feature-flags/:name', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const { isEnabled } = req.body;
      
      if (typeof isEnabled !== 'boolean') {
        return res.status(400).json({ error: { message: 'isEnabled must be a boolean value', status: 400 } });
      }
      
      const flag = await storage.updateFeatureFlag(name, isEnabled);
      
      if (!flag) {
        return res.status(404).json({ error: { message: 'Feature flag not found', status: 404 } });
      }
      
      res.json({ flag });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      res.status(500).json({ error: { message: 'Failed to update feature flag', status: 500 } });
    }
  });
}

/**
 * Register email subscription routes
 */
function registerEmailSubscriptionRoutes(app: Express) {
  // Subscribe to emails
  app.post('/v2/api/subscribe', async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: { message: 'Valid email is required', status: 400 } });
      }
      
      // Check if already subscribed
      const existingSubscriber = await storage.getEmailSubscriber(email);
      
      if (existingSubscriber) {
        if (existingSubscriber.status === 'subscribed') {
          return res.status(200).json({ message: 'Already subscribed', status: 'already_subscribed' });
        } else {
          // Re-subscribe
          const subscriber = await storage.updateEmailSubscriberStatus(email, 'subscribed');
          return res.json({ subscriber, status: 'resubscribed' });
        }
      }
      
      // Create new subscriber
      const subscriber = await storage.createEmailSubscriber({
        email,
        status: 'subscribed',
        subscribedAt: new Date(),
      });
      
      res.status(201).json({ subscriber, status: 'subscribed' });
    } catch (error) {
      console.error('Error subscribing to emails:', error);
      res.status(500).json({ error: { message: 'Failed to subscribe', status: 500 } });
    }
  });
  
  // Unsubscribe from emails
  app.post('/v2/api/unsubscribe', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: { message: 'Valid email is required', status: 400 } });
      }
      
      // Check if subscribed
      const existingSubscriber = await storage.getEmailSubscriber(email);
      
      if (!existingSubscriber) {
        return res.status(404).json({ error: { message: 'Email not found in subscribers list', status: 404 } });
      }
      
      // Update status
      const subscriber = await storage.updateEmailSubscriberStatus(email, 'unsubscribed');
      
      res.json({ subscriber, status: 'unsubscribed' });
    } catch (error) {
      console.error('Error unsubscribing from emails:', error);
      res.status(500).json({ error: { message: 'Failed to unsubscribe', status: 500 } });
    }
  });
}