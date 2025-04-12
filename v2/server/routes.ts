import { Express, Request, Response } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { db } from "./db";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { 
  featureFlags, 
  modules, 
  quizzes, 
  quizQuestions, 
  quizOptions,
  dictionaryTerms,
  tradeAgreements,
  userModuleProgress,
  userQuizProgress,
  dailyChallenges,
  challengeCompletions,
  badges,
  userBadges,
  emailSubscribers,
  insertEmailSubscriberSchema,
  insertUserSchema,
  insertModuleSchema,
  insertQuizSchema,
  insertQuizQuestionSchema,
  insertQuizOptionSchema,
  insertDictionaryTermSchema,
  insertTradeAgreementSchema,
  insertDailyChallengeSchema,
  insertBadgeSchema
} from "../shared/schema";

/**
 * Register all routes for the v2 platform
 */
export async function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/v2/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", version: "2.0", timestamp: new Date().toISOString() });
  });

  // ===== FEATURE FLAGS =====
  app.get("/v2/api/feature-flags", async (_req: Request, res: Response) => {
    try {
      const flags = await storage.getFeatureFlags();
      res.json({ flags });
    } catch (error) {
      console.error("Error fetching feature flags:", error);
      res.status(500).json({ error: "Failed to fetch feature flags" });
    }
  });

  app.get("/v2/api/feature-flags/:name", async (req: Request, res: Response) => {
    try {
      const flag = await storage.getFeatureFlag(req.params.name);
      if (!flag) {
        return res.status(404).json({ error: "Feature flag not found" });
      }
      res.json({ flag });
    } catch (error) {
      console.error(`Error fetching feature flag ${req.params.name}:`, error);
      res.status(500).json({ error: "Failed to fetch feature flag" });
    }
  });

  // ===== MODULES =====
  app.get("/v2/api/modules", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const publishedOnly = req.query.published === "true";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const modulesList = await storage.getModules({ 
        category, 
        published: publishedOnly,
        limit,
        offset
      });
      
      // Get all unique categories
      const categoriesResult = await db.selectDistinct({ category: modules.category })
        .from(modules)
        .where(publishedOnly ? eq(modules.published, true) : undefined);
      
      const categories = categoriesResult.map(c => c.category);
      
      // Get total count
      const [{ count }] = await db.select({ 
        count: sql<number>`count(*)` 
      })
      .from(modules)
      .where(
        category ? eq(modules.category, category as any) : undefined,
        publishedOnly ? eq(modules.published, true) : undefined
      );
      
      res.json({ 
        modules: modulesList,
        categories,
        totalModules: count
      });
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  app.get("/v2/api/modules/:id", async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id);
      const moduleData = await storage.getModuleById(moduleId);
      
      if (!moduleData) {
        return res.status(404).json({ error: "Module not found" });
      }
      
      // Get related quizzes for this module
      const relatedQuizzes = await storage.getQuizzes({ moduleId });
      
      res.json({ module: moduleData, quizzes: relatedQuizzes });
    } catch (error) {
      console.error(`Error fetching module ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch module" });
    }
  });

  app.get("/v2/api/modules/slug/:slug", async (req: Request, res: Response) => {
    try {
      const moduleData = await storage.getModuleBySlug(req.params.slug);
      
      if (!moduleData) {
        return res.status(404).json({ error: "Module not found" });
      }
      
      // Get related quizzes for this module
      const relatedQuizzes = await storage.getQuizzes({ moduleId: moduleData.id });
      
      res.json({ module: moduleData, quizzes: relatedQuizzes });
    } catch (error) {
      console.error(`Error fetching module with slug ${req.params.slug}:`, error);
      res.status(500).json({ error: "Failed to fetch module" });
    }
  });

  app.post("/v2/api/modules", async (req: Request, res: Response) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const newModule = await storage.createModule(moduleData);
      res.status(201).json({ module: newModule });
    } catch (error) {
      console.error("Error creating module:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid module data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create module" });
    }
  });

  // ===== QUIZZES =====
  app.get("/v2/api/quizzes", async (req: Request, res: Response) => {
    try {
      const moduleId = req.query.moduleId ? parseInt(req.query.moduleId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const quizList = await storage.getQuizzes({ moduleId, limit, offset });
      
      // Get total count
      const [{ count }] = await db.select({ 
        count: sql<number>`count(*)` 
      })
      .from(quizzes)
      .where(moduleId ? eq(quizzes.moduleId, moduleId) : undefined);
      
      res.json({ 
        quizzes: quizList,
        totalQuizzes: count
      });
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  app.get("/v2/api/quizzes/:id", async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      const quizData = await storage.getQuizById(quizId);
      
      if (!quizData) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      
      // Get quiz questions with their options
      const questions = await storage.getQuizQuestions(quizId);
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.id);
          return {
            ...question,
            options: options.map(opt => ({
              id: opt.id,
              text: opt.text,
              order: opt.order,
              questionId: opt.questionId,
              isCorrect: opt.isCorrect
            }))
          };
        })
      );
      
      res.json({ 
        quiz: quizData, 
        questions: questionsWithOptions.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      console.error(`Error fetching quiz ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });

  app.get("/v2/api/quizzes/slug/:slug", async (req: Request, res: Response) => {
    try {
      const quizData = await storage.getQuizBySlug(req.params.slug);
      
      if (!quizData) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      
      // Get quiz questions with their options
      const questions = await storage.getQuizQuestions(quizData.id);
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuizOptions(question.id);
          return {
            ...question,
            options: options.map(opt => ({
              id: opt.id,
              text: opt.text,
              order: opt.order,
              questionId: opt.questionId,
              isCorrect: opt.isCorrect
            }))
          };
        })
      );
      
      res.json({ 
        quiz: quizData, 
        questions: questionsWithOptions.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      console.error(`Error fetching quiz with slug ${req.params.slug}:`, error);
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });

  app.post("/v2/api/quizzes", async (req: Request, res: Response) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const newQuiz = await storage.createQuiz(quizData);
      res.status(201).json({ quiz: newQuiz });
    } catch (error) {
      console.error("Error creating quiz:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid quiz data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create quiz" });
    }
  });

  app.post("/v2/api/quiz-questions", async (req: Request, res: Response) => {
    try {
      const questionData = insertQuizQuestionSchema.parse(req.body);
      const newQuestion = await storage.createQuizQuestion(questionData);
      res.status(201).json({ question: newQuestion });
    } catch (error) {
      console.error("Error creating quiz question:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid question data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create quiz question" });
    }
  });

  app.post("/v2/api/quiz-options", async (req: Request, res: Response) => {
    try {
      const optionData = insertQuizOptionSchema.parse(req.body);
      const newOption = await storage.createQuizOption(optionData);
      res.status(201).json({ option: newOption });
    } catch (error) {
      console.error("Error creating quiz option:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid option data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create quiz option" });
    }
  });

  // Submit a quiz attempt
  app.post("/v2/api/quizzes/:id/submit", async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      const { userId, answers, timeSpent } = req.body;
      
      if (!userId || !answers) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Get the quiz
      const quiz = await storage.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      
      // Get all questions and correct answers
      const questions = await storage.getQuizQuestions(quizId);
      const correctAnswers: Record<number, number[]> = {};
      
      for (const question of questions) {
        const options = await storage.getQuizOptions(question.id);
        correctAnswers[question.id] = options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.id);
      }
      
      // Calculate score
      let correctCount = 0;
      
      for (const questionId in answers) {
        const userAnswer = answers[questionId];
        const correctOptionsForQuestion = correctAnswers[parseInt(questionId)] || [];
        
        // For single-select questions
        if (typeof userAnswer === 'number') {
          if (correctOptionsForQuestion.includes(userAnswer)) {
            correctCount++;
          }
        } 
        // For multi-select questions
        else if (Array.isArray(userAnswer)) {
          const isCorrect = 
            userAnswer.length === correctOptionsForQuestion.length &&
            userAnswer.every(a => correctOptionsForQuestion.includes(a));
          
          if (isCorrect) {
            correctCount++;
          }
        }
      }
      
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= (quiz.passingScore || 70);
      
      // Update user progress
      const progress = await storage.updateUserQuizProgress(
        userId,
        quizId,
        score,
        passed
      );
      
      res.json({ 
        success: true,
        score,
        passed,
        correctAnswers: Object.fromEntries(
          Object.entries(correctAnswers).map(([qId, answers]) => [qId, answers])
        ),
        progress
      });
    } catch (error) {
      console.error(`Error submitting quiz ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  // ===== DICTIONARY =====
  app.get("/v2/api/dictionary", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const searchQuery = req.query.query as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const terms = await storage.getDictionaryTerms({ 
        category, 
        searchQuery,
        limit,
        offset
      });
      
      // Get all unique categories
      const categoriesResult = await db.selectDistinct({ category: dictionaryTerms.category })
        .from(dictionaryTerms);
      
      const categories = categoriesResult.map(c => c.category);
      
      // Get total count with the same filters
      const [{ count }] = await db.select({ 
        count: sql<number>`count(*)` 
      })
      .from(dictionaryTerms)
      .where(
        category ? eq(dictionaryTerms.category, category as any) : undefined,
        searchQuery ? 
          like(dictionaryTerms.name, `%${searchQuery}%`) : 
          undefined
      );
      
      res.json({ 
        terms,
        categories,
        totalTerms: count
      });
    } catch (error) {
      console.error("Error fetching dictionary terms:", error);
      res.status(500).json({ error: "Failed to fetch dictionary terms" });
    }
  });

  app.get("/v2/api/dictionary/:id", async (req: Request, res: Response) => {
    try {
      const termId = parseInt(req.params.id);
      const term = await storage.getDictionaryTermById(termId);
      
      if (!term) {
        return res.status(404).json({ error: "Dictionary term not found" });
      }
      
      // Increment view count
      await storage.updateDictionaryTermViewCount(termId);
      
      res.json({ term });
    } catch (error) {
      console.error(`Error fetching dictionary term ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch dictionary term" });
    }
  });

  app.get("/v2/api/dictionary/slug/:slug", async (req: Request, res: Response) => {
    try {
      const term = await storage.getDictionaryTermBySlug(req.params.slug);
      
      if (!term) {
        return res.status(404).json({ error: "Dictionary term not found" });
      }
      
      // Increment view count
      await storage.updateDictionaryTermViewCount(term.id);
      
      res.json({ term });
    } catch (error) {
      console.error(`Error fetching dictionary term with slug ${req.params.slug}:`, error);
      res.status(500).json({ error: "Failed to fetch dictionary term" });
    }
  });

  app.post("/v2/api/dictionary", async (req: Request, res: Response) => {
    try {
      const termData = insertDictionaryTermSchema.parse(req.body);
      const newTerm = await storage.createDictionaryTerm(termData);
      res.status(201).json({ term: newTerm });
    } catch (error) {
      console.error("Error creating dictionary term:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid term data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create dictionary term" });
    }
  });

  // ===== TRADE AGREEMENTS =====
  app.get("/v2/api/trade-agreements", async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const agreements = await storage.getTradeAgreements({ 
        status, 
        limit,
        offset
      });
      
      // Get all unique statuses
      const statusesResult = await db.selectDistinct({ status: tradeAgreements.status })
        .from(tradeAgreements);
      
      const statuses = statusesResult.map(s => s.status);
      
      // Get total count with the same filters
      const [{ count }] = await db.select({ 
        count: sql<number>`count(*)` 
      })
      .from(tradeAgreements)
      .where(
        status ? eq(tradeAgreements.status, status as any) : undefined
      );
      
      res.json({ 
        agreements,
        statuses,
        totalAgreements: count
      });
    } catch (error) {
      console.error("Error fetching trade agreements:", error);
      res.status(500).json({ error: "Failed to fetch trade agreements" });
    }
  });

  app.get("/v2/api/trade-agreements/:id", async (req: Request, res: Response) => {
    try {
      const agreementId = parseInt(req.params.id);
      const agreement = await storage.getTradeAgreementById(agreementId);
      
      if (!agreement) {
        return res.status(404).json({ error: "Trade agreement not found" });
      }
      
      res.json({ agreement });
    } catch (error) {
      console.error(`Error fetching trade agreement ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch trade agreement" });
    }
  });

  app.get("/v2/api/trade-agreements/slug/:slug", async (req: Request, res: Response) => {
    try {
      const agreement = await storage.getTradeAgreementBySlug(req.params.slug);
      
      if (!agreement) {
        return res.status(404).json({ error: "Trade agreement not found" });
      }
      
      res.json({ agreement });
    } catch (error) {
      console.error(`Error fetching trade agreement with slug ${req.params.slug}:`, error);
      res.status(500).json({ error: "Failed to fetch trade agreement" });
    }
  });

  app.post("/v2/api/trade-agreements", async (req: Request, res: Response) => {
    try {
      const agreementData = insertTradeAgreementSchema.parse(req.body);
      const newAgreement = await storage.createTradeAgreement(agreementData);
      res.status(201).json({ agreement: newAgreement });
    } catch (error) {
      console.error("Error creating trade agreement:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid agreement data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create trade agreement" });
    }
  });

  // ===== USER PROGRESS =====
  app.get("/v2/api/user-progress/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get all module progress for this user
      const moduleProgressData = await db
        .select()
        .from(userModuleProgress)
        .where(eq(userModuleProgress.userId, userId));
      
      // Get all quiz progress for this user
      const quizProgressData = await db
        .select()
        .from(userQuizProgress)
        .where(eq(userQuizProgress.userId, userId));
      
      // Get badges for this user
      const userBadgesData = await storage.getUserBadges(userId);
      
      // Calculate overall progress stats
      const completedModules = moduleProgressData.filter(m => m.status === "completed").length;
      const totalModules = await db.select({ count: sql<number>`count(*)` }).from(modules);
      const totalModulesCount = totalModules[0].count;
      
      const completedQuizzes = quizProgressData.filter(q => q.completed).length;
      const totalQuizzes = await db.select({ count: sql<number>`count(*)` }).from(quizzes);
      const totalQuizzesCount = totalQuizzes[0].count;
      
      // Calculate overall progress percentage
      const moduleCompletionPercent = totalModulesCount > 0 
        ? (completedModules / totalModulesCount) * 100
        : 0;
        
      const quizCompletionPercent = totalQuizzesCount > 0
        ? (completedQuizzes / totalQuizzesCount) * 100
        : 0;
      
      // Average quiz score
      const quizScores = quizProgressData
        .filter(q => q.score !== null)
        .map(q => q.score as number);
        
      const averageQuizScore = quizScores.length > 0
        ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
        : 0;
      
      res.json({
        moduleProgress: moduleProgressData,
        quizProgress: quizProgressData,
        badges: userBadgesData,
        stats: {
          completedModules,
          totalModules: totalModulesCount,
          moduleCompletionPercent,
          completedQuizzes,
          totalQuizzes: totalQuizzesCount,
          quizCompletionPercent,
          averageQuizScore,
          badgesEarned: userBadgesData.length
        }
      });
    } catch (error) {
      console.error(`Error fetching user progress for user ${req.params.userId}:`, error);
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  // ===== DAILY CHALLENGES =====
  app.get("/v2/api/daily-challenge", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      
      // Get today's challenge
      const challenge = await storage.getDailyChallenge(date);
      
      if (!challenge) {
        return res.status(404).json({ error: "No challenge found for today" });
      }
      
      // Check if the user has completed this challenge
      let completed = false;
      if (userId) {
        completed = await storage.checkChallengeCompletion(userId, challenge.id);
      }
      
      res.json({
        challenge,
        completed
      });
    } catch (error) {
      console.error(`Error fetching daily challenge:`, error);
      res.status(500).json({ error: "Failed to fetch daily challenge" });
    }
  });

  app.post("/v2/api/daily-challenge/:id/complete", async (req: Request, res: Response) => {
    try {
      const challengeId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "Missing required field: userId" });
      }
      
      // Check if challenge exists
      const challenge = await storage.getDailyChallengeById(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      // Check if already completed
      const isCompleted = await storage.checkChallengeCompletion(userId, challengeId);
      if (isCompleted) {
        return res.status(400).json({ error: "Challenge already completed by this user" });
      }
      
      // Mark as completed
      const completion = await storage.completeChallenge(userId, challengeId);
      
      res.json({ 
        success: true, 
        completion,
        points: challenge.points
      });
    } catch (error) {
      console.error(`Error completing challenge ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to complete challenge" });
    }
  });

  app.post("/v2/api/daily-challenge", async (req: Request, res: Response) => {
    try {
      const challengeData = insertDailyChallengeSchema.parse(req.body);
      const newChallenge = await storage.createDailyChallenge(challengeData);
      res.status(201).json({ challenge: newChallenge });
    } catch (error) {
      console.error("Error creating daily challenge:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid challenge data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create daily challenge" });
    }
  });

  // ===== BADGES =====
  app.get("/v2/api/badges", async (_req: Request, res: Response) => {
    try {
      const badgesList = await storage.getBadges();
      res.json({ badges: badgesList });
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  });

  app.post("/v2/api/badges", async (req: Request, res: Response) => {
    try {
      const badgeData = insertBadgeSchema.parse(req.body);
      const newBadge = await storage.createBadge(badgeData);
      res.status(201).json({ badge: newBadge });
    } catch (error) {
      console.error("Error creating badge:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid badge data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create badge" });
    }
  });

  app.post("/v2/api/badges/:id/award", async (req: Request, res: Response) => {
    try {
      const badgeId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "Missing required field: userId" });
      }
      
      // Check if badge exists
      const badge = await storage.getBadgeById(badgeId);
      if (!badge) {
        return res.status(404).json({ error: "Badge not found" });
      }
      
      // Award badge to user
      const userBadge = await storage.awardBadgeToUser(userId, badgeId);
      
      res.json({ 
        success: true,
        userBadge,
        badge
      });
    } catch (error) {
      console.error(`Error awarding badge ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to award badge" });
    }
  });

  // ===== CERTIFICATES =====
  app.get("/v2/api/certificates/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const certificates = await storage.getUserCertificates(userId);
      res.json({ certificates });
    } catch (error) {
      console.error(`Error fetching certificates for user ${req.params.userId}:`, error);
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  });

  app.post("/v2/api/certificates/generate", async (req: Request, res: Response) => {
    try {
      const { userId, moduleId } = req.body;
      
      if (!userId || !moduleId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if user has completed the module
      const progress = await db.select()
        .from(userModuleProgress)
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            eq(userModuleProgress.moduleId, moduleId),
            eq(userModuleProgress.status, "completed")
          )
        );
      
      if (!progress || progress.length === 0) {
        return res.status(400).json({ error: "User has not completed this module" });
      }
      
      // Generate certificate
      const certificate = await storage.generateCertificate(userId, moduleId);
      
      res.json({ 
        success: true,
        certificate
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ error: "Failed to generate certificate" });
    }
  });

  // ===== EMAIL SUBSCRIBERS =====
  app.post("/v2/api/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Check if already subscribed
      const existingSubscriber = await storage.getEmailSubscriber(email);
      
      if (existingSubscriber) {
        // If unsubscribed before, resubscribe
        if (existingSubscriber.status === "unsubscribed") {
          await storage.updateEmailSubscriberStatus(email, "subscribed");
          return res.json({ 
            success: true, 
            message: "Successfully resubscribed" 
          });
        }
        
        return res.status(400).json({ 
          error: "Email already subscribed", 
          status: existingSubscriber.status 
        });
      }
      
      // Create new subscriber
      const subscriber = await storage.createEmailSubscriber({
        email,
        status: "subscribed"
      });
      
      res.json({ 
        success: true,
        subscriber
      });
    } catch (error) {
      console.error("Error subscribing email:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/v2/api/unsubscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Check if subscribed
      const existingSubscriber = await storage.getEmailSubscriber(email);
      
      if (!existingSubscriber) {
        return res.status(404).json({ error: "Email not found in subscribers list" });
      }
      
      // Update status to unsubscribed
      await storage.updateEmailSubscriberStatus(email, "unsubscribed");
      
      res.json({ 
        success: true,
        message: "Successfully unsubscribed"
      });
    } catch (error) {
      console.error("Error unsubscribing email:", error);
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // ===== USERS =====
  app.post("/v2/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = userData.email 
        ? await storage.getUserByEmail(userData.email)
        : userData.googleId 
          ? await storage.getUserByGoogleId(userData.googleId)
          : null;
          
      if (existingUser) {
        return res.status(400).json({ 
          error: "User already exists",
          userId: existingUser.id
        });
      }
      
      // Create new user
      const newUser = await storage.createUser(userData);
      
      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.errors) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/v2/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Remove sensitive information
      const { password, ...safeUser } = user;
      
      res.json({ user: safeUser });
    } catch (error) {
      console.error(`Error fetching user ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
}