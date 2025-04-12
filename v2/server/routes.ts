import { Request, Response, NextFunction, Express, Router } from "express";
import { storage } from "./storage";
import * as schema from "../shared/schema";
import { z } from "zod";

const v2Router = Router();

// Middleware to check user authentication
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};

// Helper for JSON validation errors
function handleValidationError(err: any, res: Response) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: err.errors });
  }
  console.error("Route error:", err);
  return res.status(500).json({ error: "Internal server error" });
}

// API Routes
// Modules
v2Router.get("/modules", async (req: Request, res: Response) => {
  try {
    const modules = await storage.getModules();
    res.json({ modules });
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

v2Router.get("/modules/:id", async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.id);
    const module = await storage.getModuleById(moduleId);
    
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }
    
    // If user is authenticated, track progress
    if (req.isAuthenticated() && req.user) {
      const userId = (req.user as any).id;
      await storage.updateUserProgress(userId, moduleId, false);
    }
    
    res.json({ module });
  } catch (err) {
    console.error("Error fetching module:", err);
    res.status(500).json({ error: "Failed to fetch module" });
  }
});

v2Router.post("/modules/:id/complete", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.id);
    const userId = (req.user as any).id;
    
    const module = await storage.getModuleById(moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }
    
    const progress = await storage.updateUserProgress(userId, moduleId, true);
    res.json({ progress });
  } catch (err) {
    console.error("Error completing module:", err);
    res.status(500).json({ error: "Failed to update module progress" });
  }
});

// Quizzes
v2Router.get("/quizzes", async (req: Request, res: Response) => {
  try {
    const quizzes = await storage.getQuizzes();
    res.json({ quizzes });
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

v2Router.get("/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const quizId = parseInt(req.params.id);
    const quiz = await storage.getQuizById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    
    const questions = await storage.getQuizQuestions(quizId);
    
    // Strip correct answers when sending to client
    const clientQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options as string),
      order: q.order
    }));
    
    res.json({ 
      quiz,
      questions: clientQuestions
    });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

v2Router.get("/modules/:id/quizzes", async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.id);
    const quizzes = await storage.getQuizzesByModuleId(moduleId);
    res.json({ quizzes });
  } catch (err) {
    console.error("Error fetching module quizzes:", err);
    res.status(500).json({ error: "Failed to fetch module quizzes" });
  }
});

v2Router.post("/quizzes/:id/submit", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const quizId = parseInt(req.params.id);
    const userId = (req.user as any).id;
    
    // Validate request body
    const answerSchema = z.object({
      answers: z.array(z.object({
        questionId: z.number(),
        answer: z.string()
      }))
    });
    
    const { answers } = answerSchema.parse(req.body);
    
    // Fetch quiz and questions
    const quiz = await storage.getQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    
    const questions = await storage.getQuizQuestions(quizId);
    const questionMap = new Map(questions.map(q => [q.id, q]));
    
    // Score the quiz
    let correctCount = 0;
    const results = [];
    
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      
      if (!question) {
        results.push({
          questionId: answer.questionId,
          correct: false,
          correctAnswer: null,
          explanation: "Question not found"
        });
        continue;
      }
      
      const isCorrect = question.correctAnswer === answer.answer;
      if (isCorrect) correctCount++;
      
      results.push({
        questionId: answer.questionId,
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
    }
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Save quiz result
    const progress = await storage.saveQuizResult(userId, quizId, score);
    
    res.json({
      score,
      results,
      progress
    });
  } catch (err) {
    handleValidationError(err, res);
  }
});

// Dictionary Terms
v2Router.get("/dictionary", async (req: Request, res: Response) => {
  try {
    const terms = await storage.getDictionaryTerms();
    res.json({ terms });
  } catch (err) {
    console.error("Error fetching dictionary terms:", err);
    res.status(500).json({ error: "Failed to fetch dictionary terms" });
  }
});

v2Router.get("/dictionary/:id", async (req: Request, res: Response) => {
  try {
    const termId = parseInt(req.params.id);
    const term = await storage.getDictionaryTermById(termId);
    
    if (!term) {
      return res.status(404).json({ error: "Term not found" });
    }
    
    // Record view if authenticated
    if (req.isAuthenticated() && req.user) {
      const userId = (req.user as any).id;
      await storage.recordDictionaryTermView(userId, termId);
    }
    
    res.json({ term });
  } catch (err) {
    console.error("Error fetching dictionary term:", err);
    res.status(500).json({ error: "Failed to fetch dictionary term" });
  }
});

v2Router.get("/dictionary/term/:name", async (req: Request, res: Response) => {
  try {
    const termName = req.params.name;
    const term = await storage.getDictionaryTermByName(termName);
    
    if (!term) {
      return res.status(404).json({ error: "Term not found" });
    }
    
    // Record view if authenticated
    if (req.isAuthenticated() && req.user) {
      const userId = (req.user as any).id;
      await storage.recordDictionaryTermView(userId, term.id);
    }
    
    res.json({ term });
  } catch (err) {
    console.error("Error fetching dictionary term by name:", err);
    res.status(500).json({ error: "Failed to fetch dictionary term" });
  }
});

v2Router.get("/dictionary/category/:category", async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const terms = await storage.getDictionaryTermsByCategory(category);
    res.json({ terms });
  } catch (err) {
    console.error("Error fetching dictionary terms by category:", err);
    res.status(500).json({ error: "Failed to fetch dictionary terms" });
  }
});

// Trade Agreements
v2Router.get("/trade-agreements", async (req: Request, res: Response) => {
  try {
    const agreements = await storage.getTradeAgreements();
    res.json({ agreements });
  } catch (err) {
    console.error("Error fetching trade agreements:", err);
    res.status(500).json({ error: "Failed to fetch trade agreements" });
  }
});

v2Router.get("/trade-agreements/:id", async (req: Request, res: Response) => {
  try {
    const agreementId = parseInt(req.params.id);
    const agreement = await storage.getTradeAgreementById(agreementId);
    
    if (!agreement) {
      return res.status(404).json({ error: "Trade agreement not found" });
    }
    
    res.json({ agreement });
  } catch (err) {
    console.error("Error fetching trade agreement:", err);
    res.status(500).json({ error: "Failed to fetch trade agreement" });
  }
});

// User Progress
v2Router.get("/progress", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const progress = await storage.getUserProgress(userId);
    res.json({ progress });
  } catch (err) {
    console.error("Error fetching user progress:", err);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

// Daily Challenge
v2Router.get("/daily-challenge", async (req: Request, res: Response) => {
  try {
    const challenge = await storage.getDailyChallenge();
    
    if (!challenge) {
      return res.status(404).json({ error: "No daily challenge available" });
    }
    
    // Check if user completed the challenge
    let completed = false;
    if (req.isAuthenticated() && req.user) {
      const userId = (req.user as any).id;
      const completions = await storage.getUserChallengeCompletions(userId);
      completed = completions.some(c => c.challengeId === challenge.id);
    }
    
    res.json({ 
      challenge,
      completed
    });
  } catch (err) {
    console.error("Error fetching daily challenge:", err);
    res.status(500).json({ error: "Failed to fetch daily challenge" });
  }
});

v2Router.post("/daily-challenge/:id/complete", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const challengeId = parseInt(req.params.id);
    const userId = (req.user as any).id;
    const score = req.body.score;
    
    const completion = await storage.recordChallengeCompletion(userId, challengeId, score);
    res.json({ completion });
  } catch (err) {
    console.error("Error completing daily challenge:", err);
    res.status(500).json({ error: "Failed to complete daily challenge" });
  }
});

// Simulations
v2Router.get("/simulations", async (req: Request, res: Response) => {
  try {
    const simulations = await storage.getSimulations();
    res.json({ simulations });
  } catch (err) {
    console.error("Error fetching simulations:", err);
    res.status(500).json({ error: "Failed to fetch simulations" });
  }
});

v2Router.get("/simulations/:id", async (req: Request, res: Response) => {
  try {
    const simulationId = parseInt(req.params.id);
    const simulation = await storage.getSimulationById(simulationId);
    
    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }
    
    res.json({ simulation });
  } catch (err) {
    console.error("Error fetching simulation:", err);
    res.status(500).json({ error: "Failed to fetch simulation" });
  }
});

v2Router.get("/modules/:id/simulations", async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.id);
    const simulations = await storage.getSimulationsByModuleId(moduleId);
    res.json({ simulations });
  } catch (err) {
    console.error("Error fetching module simulations:", err);
    res.status(500).json({ error: "Failed to fetch module simulations" });
  }
});

// Export all routes
export function registerV2Routes(app: Express) {
  // Apply v2 router to /v2/api prefix
  app.use("/v2/api", v2Router);
  
  console.log("TariffSmart v2 API routes registered");
  
  return app;
}