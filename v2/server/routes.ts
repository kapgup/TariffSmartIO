import { Express, Request, Response } from 'express';
import { storage } from './storage';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { dictionaryTerms, emailSubscriptionSchema, insertDictionaryTermSchema, insertModuleSchema, insertUserSchema, moduleCreateSchema, userLoginSchema, userRegistrationSchema } from '../shared/schema';

/**
 * Register all API routes for the v2 platform
 */
export async function registerRoutes(app: Express) {
  // HEALTH CHECK
  app.get('/v2/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', version: '2.0.0', timestamp: new Date().toISOString() });
  });

  // AUTH ROUTES
  registerAuthRoutes(app);

  // MODULES ROUTES
  registerModuleRoutes(app);

  // QUIZ ROUTES 
  registerQuizRoutes(app);

  // DICTIONARY ROUTES
  registerDictionaryRoutes(app);

  // TRADE AGREEMENT ROUTES
  registerTradeAgreementRoutes(app);

  // DAILY CHALLENGE ROUTES
  registerChallengeRoutes(app);

  // USER PROGRESS ROUTES
  registerProgressRoutes(app);

  // BADGE ROUTES
  registerBadgeRoutes(app);

  // FEATURE FLAG ROUTES
  registerFeatureFlagRoutes(app);

  // EMAIL SUBSCRIPTION ROUTES
  registerEmailSubscriptionRoutes(app);

  console.log('All v2 API routes registered');
}

/**
 * Register authentication routes
 */
function registerAuthRoutes(app: Express) {
  // Register a new user
  app.post('/v2/api/auth/register', async (req: Request, res: Response) => {
    try {
      const validatedData = userRegistrationSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this email already exists'
        });
      }
      
      const newUser = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        passwordHash: validatedData.passwordHash, // In production, hash the password
        role: 'basic', // Default role for new users
      });
      
      // Create session
      if (req.session) {
        req.session.userId = newUser.id;
        req.session.userRole = newUser.role;
      }
      
      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Registration error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not register user'
      });
    }
  });

  // Login
  app.post('/v2/api/auth/login', async (req: Request, res: Response) => {
    try {
      const validatedData = userLoginSchema.parse(req.body);
      const user = await storage.getUserByEmail(validatedData.email);
      
      if (!user || user.passwordHash !== validatedData.password) { // In production, compare hashed passwords
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid email or password'
        });
      }
      
      // Create session
      if (req.session) {
        req.session.userId = user.id;
        req.session.userRole = user.role;
      }
      
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Login error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not authenticate user'
      });
    }
  });

  // Logout
  app.post('/v2/api/auth/logout', (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((error) => {
        if (error) {
          console.error('Session destruction error:', error);
          return res.status(500).json({
            error: 'Internal server error',
            message: 'Could not log out'
          });
        }
        
        res.clearCookie('connect.sid');
        return res.status(200).json({
          message: 'Logout successful'
        });
      });
    } else {
      return res.status(200).json({
        message: 'Logout successful (no session found)'
      });
    }
  });

  // Get current user
  app.get('/v2/api/auth/me', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource'
      });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        // Session exists but user doesn't - clear session
        req.session.destroy(() => {});
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid session'
        });
      }
      
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve user information'
      });
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
      
      const modules = await storage.getModules({ category, published });
      
      // Get distinct categories for filtering
      const moduleCategories = Array.from(new Set(modules.map(module => module.category)));
      
      return res.status(200).json({
        modules,
        categories: moduleCategories,
        totalModules: modules.length
      });
    } catch (error) {
      console.error('Get modules error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve modules'
      });
    }
  });

  // Get module by ID
  app.get('/v2/api/modules/:id', async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id);
      
      if (isNaN(moduleId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Module ID must be a number'
        });
      }
      
      const module = await storage.getModuleById(moduleId);
      
      if (!module) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Module not found'
        });
      }
      
      // Also get associated quizzes
      const quizzes = await storage.getQuizzes({ moduleId });
      
      return res.status(200).json({
        module,
        quizzes
      });
    } catch (error) {
      console.error('Get module error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve module'
      });
    }
  });

  // Get module by slug
  app.get('/v2/api/modules/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      
      const module = await storage.getModuleBySlug(slug);
      
      if (!module) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Module not found'
        });
      }
      
      // Also get associated quizzes
      const quizzes = await storage.getQuizzes({ moduleId: module.id });
      
      return res.status(200).json({
        module,
        quizzes
      });
    } catch (error) {
      console.error('Get module by slug error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve module'
      });
    }
  });

  // Create a new module (admin only)
  app.post('/v2/api/modules', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId || req.session.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to create modules'
      });
    }
    
    try {
      const validatedData = moduleCreateSchema.parse(req.body);
      
      const newModule = await storage.createModule({
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        category: validatedData.category,
        difficulty: validatedData.difficulty,
        authorId: req.session.userId,
        content: validatedData.content,
        estimatedMinutes: validatedData.estimatedMinutes,
        published: validatedData.published || false,
        tags: validatedData.tags || []
      });
      
      return res.status(201).json({
        message: 'Module created successfully',
        module: newModule
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Create module error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not create module'
      });
    }
  });

  // Update a module (admin only)
  app.patch('/v2/api/modules/:id', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId || req.session.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update modules'
      });
    }
    
    try {
      const moduleId = parseInt(req.params.id);
      
      if (isNaN(moduleId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Module ID must be a number'
        });
      }
      
      const validatedData = insertModuleSchema.partial().parse(req.body);
      
      const updatedModule = await storage.updateModule(moduleId, validatedData);
      
      if (!updatedModule) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Module not found'
        });
      }
      
      return res.status(200).json({
        message: 'Module updated successfully',
        module: updatedModule
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Update module error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not update module'
      });
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
      const moduleId = req.query.moduleId ? parseInt(req.query.moduleId as string) : undefined;
      const published = req.query.published === 'true';
      
      const quizzes = await storage.getQuizzes({ moduleId, published });
      
      return res.status(200).json({
        quizzes,
        totalQuizzes: quizzes.length
      });
    } catch (error) {
      console.error('Get quizzes error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve quizzes'
      });
    }
  });

  // Get quiz by ID with questions and options
  app.get('/v2/api/quizzes/:id', async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      
      if (isNaN(quizId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Quiz ID must be a number'
        });
      }
      
      const quiz = await storage.getQuizById(quizId);
      
      if (!quiz) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Quiz not found'
        });
      }
      
      // Get questions for this quiz
      const questions = await storage.getQuizQuestions(quizId);
      
      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.id);
          return { ...question, options };
        })
      );
      
      return res.status(200).json({
        quiz,
        questions: questionsWithOptions
      });
    } catch (error) {
      console.error('Get quiz error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve quiz'
      });
    }
  });

  // Get quiz by slug
  app.get('/v2/api/quizzes/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      
      const quiz = await storage.getQuizBySlug(slug);
      
      if (!quiz) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Quiz not found'
        });
      }
      
      // Get questions for this quiz
      const questions = await storage.getQuizQuestions(quiz.id);
      
      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.id);
          return { ...question, options };
        })
      );
      
      return res.status(200).json({
        quiz,
        questions: questionsWithOptions
      });
    } catch (error) {
      console.error('Get quiz by slug error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve quiz'
      });
    }
  });

  // Submit quiz answers
  app.post('/v2/api/quizzes/:id/submit', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to submit quiz answers'
      });
    }
    
    try {
      const quizId = parseInt(req.params.id);
      
      if (isNaN(quizId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Quiz ID must be a number'
        });
      }
      
      const quiz = await storage.getQuizById(quizId);
      
      if (!quiz) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Quiz not found'
        });
      }
      
      const { answers, timeSpent } = req.body;
      
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({
          error: 'Invalid submission',
          message: 'Answers must be provided as an array'
        });
      }
      
      // Get questions for this quiz
      const questions = await storage.getQuizQuestions(quizId);
      
      // Get options for each question to determine correct answers
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.id);
          return { ...question, options };
        })
      );
      
      // Calculate score
      let score = 0;
      let correctAnswers = 0;
      
      answers.forEach((answer: { questionId: number, selectedOptionId: number }) => {
        const question = questionsWithOptions.find(q => q.id === answer.questionId);
        
        if (question) {
          const correctOption = question.options.find(o => o.isCorrect);
          
          if (correctOption && correctOption.id === answer.selectedOptionId) {
            correctAnswers++;
          }
        }
      });
      
      if (questions.length > 0) {
        score = (correctAnswers / questions.length) * 100;
      }
      
      const passed = score >= (quiz.passingScore || 70);
      
      // Save user's quiz progress
      const existingProgress = await storage.getUserQuizProgress(req.session.userId, quizId);
      
      if (existingProgress) {
        // Update existing progress
        await storage.updateUserQuizProgress(req.session.userId, quizId, {
          score,
          passed,
          attempts: existingProgress.attempts + 1,
          answers: answers,
          completedAt: new Date(),
          timeSpent: timeSpent || null
        });
      } else {
        // Create new progress record
        await storage.createUserQuizProgress({
          userId: req.session.userId,
          quizId,
          score,
          passed,
          attempts: 1,
          answers: answers,
          completedAt: new Date(),
          timeSpent: timeSpent || null
        });
      }
      
      return res.status(200).json({
        score,
        passed,
        correctAnswers,
        totalQuestions: questions.length
      });
    } catch (error) {
      console.error('Submit quiz error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not process quiz submission'
      });
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
      
      const terms = await storage.getDictionaryTerms({ category, searchQuery });
      
      // Get distinct categories for filtering
      const termCategories = Array.from(new Set(terms.map(term => term.category)));
      
      return res.status(200).json({
        terms,
        categories: termCategories,
        totalTerms: terms.length
      });
    } catch (error) {
      console.error('Get dictionary terms error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve dictionary terms'
      });
    }
  });

  // Get dictionary term by ID
  app.get('/v2/api/dictionary/:id', async (req: Request, res: Response) => {
    try {
      const termId = parseInt(req.params.id);
      
      if (isNaN(termId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Term ID must be a number'
        });
      }
      
      const term = await storage.getDictionaryTermById(termId);
      
      if (!term) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Dictionary term not found'
        });
      }
      
      // Increment view count
      const updatedTerm = await storage.incrementDictionaryTermViewCount(termId);
      
      return res.status(200).json({
        term: updatedTerm || term
      });
    } catch (error) {
      console.error('Get dictionary term error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve dictionary term'
      });
    }
  });

  // Get dictionary term by slug
  app.get('/v2/api/dictionary/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      
      const term = await storage.getDictionaryTermBySlug(slug);
      
      if (!term) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Dictionary term not found'
        });
      }
      
      // Increment view count
      const updatedTerm = await storage.incrementDictionaryTermViewCount(term.id);
      
      return res.status(200).json({
        term: updatedTerm || term
      });
    } catch (error) {
      console.error('Get dictionary term by slug error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve dictionary term'
      });
    }
  });

  // Create a new dictionary term (admin only)
  app.post('/v2/api/dictionary', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId || req.session.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to create dictionary terms'
      });
    }
    
    try {
      const validatedData = insertDictionaryTermSchema.parse(req.body);
      
      const newTerm = await storage.createDictionaryTerm({
        ...validatedData,
        authorId: req.session.userId,
        viewCount: 0
      });
      
      return res.status(201).json({
        message: 'Dictionary term created successfully',
        term: newTerm
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Create dictionary term error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not create dictionary term'
      });
    }
  });

  // Update a dictionary term (admin only)
  app.patch('/v2/api/dictionary/:id', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId || req.session.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update dictionary terms'
      });
    }
    
    try {
      const termId = parseInt(req.params.id);
      
      if (isNaN(termId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Term ID must be a number'
        });
      }
      
      const validatedData = insertDictionaryTermSchema.partial().parse(req.body);
      
      const updatedTerm = await storage.updateDictionaryTerm(termId, validatedData);
      
      if (!updatedTerm) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Dictionary term not found'
        });
      }
      
      return res.status(200).json({
        message: 'Dictionary term updated successfully',
        term: updatedTerm
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Update dictionary term error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not update dictionary term'
      });
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
      const status = req.query.status as string | undefined;
      const searchQuery = req.query.search as string | undefined;
      
      const agreements = await storage.getTradeAgreements({ status, searchQuery });
      
      return res.status(200).json({
        agreements,
        totalAgreements: agreements.length
      });
    } catch (error) {
      console.error('Get trade agreements error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve trade agreements'
      });
    }
  });

  // Get trade agreement by ID
  app.get('/v2/api/agreements/:id', async (req: Request, res: Response) => {
    try {
      const agreementId = parseInt(req.params.id);
      
      if (isNaN(agreementId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Agreement ID must be a number'
        });
      }
      
      const agreement = await storage.getTradeAgreementById(agreementId);
      
      if (!agreement) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Trade agreement not found'
        });
      }
      
      return res.status(200).json({
        agreement
      });
    } catch (error) {
      console.error('Get trade agreement error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve trade agreement'
      });
    }
  });

  // Get trade agreement by slug
  app.get('/v2/api/agreements/slug/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      
      const agreement = await storage.getTradeAgreementBySlug(slug);
      
      if (!agreement) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Trade agreement not found'
        });
      }
      
      return res.status(200).json({
        agreement
      });
    } catch (error) {
      console.error('Get trade agreement by slug error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve trade agreement'
      });
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
        return res.status(404).json({
          error: 'Not found',
          message: 'No challenge available for today'
        });
      }
      
      // Check if authenticated user has completed this challenge
      let completed = false;
      
      if (req.session && req.session.userId) {
        const completion = await storage.getChallengeCompletion(req.session.userId, challenge.id);
        completed = !!completion;
      }
      
      return res.status(200).json({
        challenge,
        completed
      });
    } catch (error) {
      console.error('Get today\'s challenge error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve today\'s challenge'
      });
    }
  });

  // Get all daily challenges
  app.get('/v2/api/challenges', async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getDailyChallenges();
      
      // Get completion status for authenticated user
      let userCompletions: Record<number, boolean> = {};
      
      if (req.session && req.session.userId) {
        const completions = await storage.getUserChallengeCompletions(req.session.userId);
        userCompletions = completions.reduce((acc, completion) => {
          acc[completion.challengeId] = true;
          return acc;
        }, {} as Record<number, boolean>);
      }
      
      return res.status(200).json({
        challenges,
        userCompletions
      });
    } catch (error) {
      console.error('Get challenges error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve challenges'
      });
    }
  });

  // Complete a challenge
  app.post('/v2/api/challenges/:id/complete', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to complete challenges'
      });
    }
    
    try {
      const challengeId = parseInt(req.params.id);
      
      if (isNaN(challengeId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Challenge ID must be a number'
        });
      }
      
      const challenge = await storage.getDailyChallenge();
      
      if (!challenge || challenge.id !== challengeId) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Challenge not found or not available today'
        });
      }
      
      // Check if already completed
      const existingCompletion = await storage.getChallengeCompletion(req.session.userId, challengeId);
      
      if (existingCompletion) {
        return res.status(409).json({
          error: 'Already completed',
          message: 'You have already completed this challenge'
        });
      }
      
      // Create completion record
      const completion = await storage.createChallengeCompletion({
        userId: req.session.userId,
        challengeId,
        completedAt: new Date()
      });
      
      return res.status(201).json({
        message: 'Challenge completed successfully',
        completion,
        points: challenge.points || 10
      });
    } catch (error) {
      console.error('Complete challenge error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not complete challenge'
      });
    }
  });
}

/**
 * Register user progress routes
 */
function registerProgressRoutes(app: Express) {
  // Get user's progress for all modules
  app.get('/v2/api/progress/modules', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access your progress'
      });
    }
    
    try {
      const progress = await storage.getUserModuleProgressByUser(req.session.userId);
      
      return res.status(200).json({
        moduleProgress: progress
      });
    } catch (error) {
      console.error('Get module progress error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve module progress'
      });
    }
  });

  // Get user's progress for all quizzes
  app.get('/v2/api/progress/quizzes', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access your progress'
      });
    }
    
    try {
      const progress = await storage.getUserQuizProgressByUser(req.session.userId);
      
      return res.status(200).json({
        quizProgress: progress
      });
    } catch (error) {
      console.error('Get quiz progress error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve quiz progress'
      });
    }
  });

  // Update module progress
  app.post('/v2/api/progress/modules/:id', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to update progress'
      });
    }
    
    try {
      const moduleId = parseInt(req.params.id);
      
      if (isNaN(moduleId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Module ID must be a number'
        });
      }
      
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({
          error: 'Invalid progress',
          message: 'Progress must be a number between 0 and 100'
        });
      }
      
      // Check if module exists
      const module = await storage.getModuleById(moduleId);
      
      if (!module) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Module not found'
        });
      }
      
      // Check if progress record exists
      const existingProgress = await storage.getUserModuleProgress(req.session.userId, moduleId);
      
      let moduleProgress;
      
      if (existingProgress) {
        // Update existing progress
        moduleProgress = await storage.updateUserModuleProgress(req.session.userId, moduleId, {
          progress,
          completedAt: progress === 100 ? new Date() : existingProgress.completedAt,
          lastAccessedAt: new Date()
        });
      } else {
        // Create new progress record
        moduleProgress = await storage.createUserModuleProgress({
          userId: req.session.userId,
          moduleId,
          progress,
          completedAt: progress === 100 ? new Date() : null,
          lastAccessedAt: new Date()
        });
      }
      
      return res.status(200).json({
        message: 'Progress updated successfully',
        moduleProgress
      });
    } catch (error) {
      console.error('Update module progress error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not update module progress'
      });
    }
  });

  // Get user certificates
  app.get('/v2/api/certificates', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access your certificates'
      });
    }
    
    try {
      const certificates = await storage.getUserCertificates(req.session.userId);
      
      return res.status(200).json({
        certificates
      });
    } catch (error) {
      console.error('Get certificates error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve certificates'
      });
    }
  });

  // Generate certificate (after completing all modules in a category)
  app.post('/v2/api/certificates/category/:category', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to generate certificates'
      });
    }
    
    try {
      const category = req.params.category;
      
      // Get all modules in this category
      const modules = await storage.getModules({ category, published: true });
      
      if (modules.length === 0) {
        return res.status(404).json({
          error: 'Not found',
          message: 'No modules found in this category'
        });
      }
      
      // Check if user has completed all modules
      const moduleIds = modules.map(module => module.id);
      const userProgress = await storage.getUserModuleProgressByUser(req.session.userId);
      
      const completedModuleIds = userProgress
        .filter(progress => progress.progress === 100 && progress.completedAt !== null)
        .map(progress => progress.moduleId);
      
      const allModulesCompleted = moduleIds.every(id => completedModuleIds.includes(id));
      
      if (!allModulesCompleted) {
        return res.status(400).json({
          error: 'Incomplete',
          message: 'You must complete all modules in this category to receive a certificate'
        });
      }
      
      // Create certificate
      const certificate = await storage.createCertificate({
        userId: req.session.userId,
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Expert`,
        description: `Certification for completing all modules in the ${category} category`,
        issuedAt: new Date(),
        expiresAt: null, // Certificates don't expire
        imageUrl: `/certificates/${category.toLowerCase()}.png`,
        category
      });
      
      return res.status(201).json({
        message: 'Certificate generated successfully',
        certificate
      });
    } catch (error) {
      console.error('Generate certificate error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not generate certificate'
      });
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
      
      // Get user's earned badges if authenticated
      let userBadges: Record<number, boolean> = {};
      
      if (req.session && req.session.userId) {
        const earned = await storage.getUserBadges(req.session.userId);
        userBadges = earned.reduce((acc, badge) => {
          acc[badge.badgeId] = true;
          return acc;
        }, {} as Record<number, boolean>);
      }
      
      return res.status(200).json({
        badges,
        userBadges
      });
    } catch (error) {
      console.error('Get badges error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve badges'
      });
    }
  });

  // Get user's badges
  app.get('/v2/api/user/badges', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access your badges'
      });
    }
    
    try {
      const userBadges = await storage.getUserBadges(req.session.userId);
      
      // Get full badge details for each user badge
      const badgesWithDetails = await Promise.all(
        userBadges.map(async (userBadge) => {
          const badge = await storage.getBadgeById(userBadge.badgeId);
          return {
            ...userBadge,
            badge
          };
        })
      );
      
      return res.status(200).json({
        badges: badgesWithDetails
      });
    } catch (error) {
      console.error('Get user badges error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve user badges'
      });
    }
  });

  // Award a badge (admin only)
  app.post('/v2/api/badges/:id/award/:userId', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId || req.session.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to award badges'
      });
    }
    
    try {
      const badgeId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);
      
      if (isNaN(badgeId) || isNaN(userId)) {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'Badge ID and User ID must be numbers'
        });
      }
      
      // Check if badge exists
      const badge = await storage.getBadgeById(badgeId);
      
      if (!badge) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Badge not found'
        });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({
          error: 'Not found',
          message: 'User not found'
        });
      }
      
      // Check if user already has this badge
      const existingBadge = await storage.getUserBadge(userId, badgeId);
      
      if (existingBadge) {
        return res.status(409).json({
          error: 'Already awarded',
          message: 'User already has this badge'
        });
      }
      
      // Award badge
      const userBadge = await storage.awardBadge({
        userId,
        badgeId,
        awardedAt: new Date()
      });
      
      return res.status(201).json({
        message: 'Badge awarded successfully',
        userBadge
      });
    } catch (error) {
      console.error('Award badge error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not award badge'
      });
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
      const flags = await storage.getFeatureFlags();
      
      return res.status(200).json({
        flags
      });
    } catch (error) {
      console.error('Get feature flags error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve feature flags'
      });
    }
  });

  // Get specific feature flag
  app.get('/v2/api/feature-flags/:name', async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const flag = await storage.getFeatureFlag(name);
      
      if (!flag) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Feature flag not found'
        });
      }
      
      // Check if user has access to this feature
      let userHasAccess = flag.isEnabled; // Default to flag's global state
      
      if (req.session && req.session.userRole) {
        const featureAccess = await storage.getFeatureAccess(name, req.session.userRole as any);
        
        if (featureAccess !== undefined) {
          userHasAccess = featureAccess.isEnabled;
        }
      }
      
      return res.status(200).json({
        flag,
        hasAccess: userHasAccess
      });
    } catch (error) {
      console.error('Get feature flag error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not retrieve feature flag'
      });
    }
  });

  // Update feature flag (admin only)
  app.patch('/v2/api/feature-flags/:name', async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId || req.session.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update feature flags'
      });
    }
    
    try {
      const name = req.params.name;
      const { isEnabled } = req.body;
      
      if (typeof isEnabled !== 'boolean') {
        return res.status(400).json({
          error: 'Invalid data',
          message: 'isEnabled must be a boolean'
        });
      }
      
      const updatedFlag = await storage.updateFeatureFlag(name, isEnabled);
      
      if (!updatedFlag) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Feature flag not found'
        });
      }
      
      return res.status(200).json({
        message: 'Feature flag updated successfully',
        flag: updatedFlag
      });
    } catch (error) {
      console.error('Update feature flag error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not update feature flag'
      });
    }
  });
}

/**
 * Register email subscription routes
 */
function registerEmailSubscriptionRoutes(app: Express) {
  // Subscribe to email newsletter
  app.post('/v2/api/subscribe', async (req: Request, res: Response) => {
    try {
      const validatedData = emailSubscriptionSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getEmailSubscriber(validatedData.email);
      
      if (existingSubscriber) {
        if (existingSubscriber.status === 'subscribed') {
          return res.status(409).json({
            error: 'Already subscribed',
            message: 'This email is already subscribed to our newsletter'
          });
        } else {
          // Reactivate subscription
          await storage.updateEmailSubscriberStatus(validatedData.email, 'subscribed');
          
          return res.status(200).json({
            message: 'Subscription reactivated successfully'
          });
        }
      }
      
      // Create new subscriber
      await storage.createEmailSubscriber({
        email: validatedData.email,
        firstName: validatedData.firstName || null,
        lastName: validatedData.lastName || null,
        status: 'subscribed',
        subscribedAt: new Date()
      });
      
      return res.status(201).json({
        message: 'Successfully subscribed to newsletter'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      
      console.error('Newsletter subscription error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not process subscription request'
      });
    }
  });

  // Unsubscribe from email newsletter
  app.post('/v2/api/unsubscribe', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          error: 'Invalid data',
          message: 'Email is required'
        });
      }
      
      const subscriber = await storage.getEmailSubscriber(email);
      
      if (!subscriber) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Email not found in our subscription list'
        });
      }
      
      await storage.updateEmailSubscriberStatus(email, 'unsubscribed');
      
      return res.status(200).json({
        message: 'Successfully unsubscribed from newsletter'
      });
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Could not process unsubscribe request'
      });
    }
  });
}