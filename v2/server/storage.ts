import { db } from "./db";
import { eq, and, desc, asc, like } from "drizzle-orm";
import * as schema from "../shared/schema";

export interface IStorage {
  // Modules
  getModules(): Promise<schema.Module[]>;
  getModuleById(id: number): Promise<schema.Module | undefined>;
  createModule(module: schema.InsertModule): Promise<schema.Module>;
  updateModule(id: number, module: Partial<schema.InsertModule>): Promise<schema.Module | undefined>;
  
  // Quizzes
  getQuizzes(): Promise<schema.Quiz[]>;
  getQuizById(id: number): Promise<schema.Quiz | undefined>;
  getQuizzesByModuleId(moduleId: number): Promise<schema.Quiz[]>;
  createQuiz(quiz: schema.InsertQuiz): Promise<schema.Quiz>;
  
  // Quiz Questions
  getQuizQuestions(quizId: number): Promise<schema.QuizQuestion[]>;
  createQuizQuestion(question: schema.InsertQuizQuestion): Promise<schema.QuizQuestion>;
  
  // Dictionary Terms
  getDictionaryTerms(): Promise<schema.DictionaryTerm[]>;
  getDictionaryTermById(id: number): Promise<schema.DictionaryTerm | undefined>;
  getDictionaryTermByName(term: string): Promise<schema.DictionaryTerm | undefined>;
  getDictionaryTermsByCategory(category: string): Promise<schema.DictionaryTerm[]>;
  createDictionaryTerm(term: schema.InsertDictionaryTerm): Promise<schema.DictionaryTerm>;
  
  // Trade Agreements
  getTradeAgreements(): Promise<schema.TradeAgreement[]>;
  getTradeAgreementById(id: number): Promise<schema.TradeAgreement | undefined>;
  createTradeAgreement(agreement: schema.InsertTradeAgreement): Promise<schema.TradeAgreement>;
  
  // User Progress
  getUserProgress(userId: number): Promise<schema.UserProgress[]>;
  getUserModuleProgress(userId: number, moduleId: number): Promise<schema.UserProgress | undefined>;
  updateUserProgress(userId: number, moduleId: number, completed: boolean): Promise<schema.UserProgress>;
  getUserQuizResults(userId: number, quizId: number): Promise<schema.UserProgress | undefined>;
  saveQuizResult(userId: number, quizId: number, score: number): Promise<schema.UserProgress>;
  
  // Dictionary Term Views (for gamification)
  recordDictionaryTermView(userId: number, termId: number): Promise<schema.DictionaryView>;
  getDictionaryTermViews(userId: number): Promise<schema.DictionaryView[]>;
  
  // Daily Challenges
  getDailyChallenge(date?: Date): Promise<schema.DailyChallenge | undefined>;
  createDailyChallenge(challenge: schema.InsertDailyChallenge): Promise<schema.DailyChallenge>;
  recordChallengeCompletion(userId: number, challengeId: number, score?: number): Promise<schema.ChallengeCompletion>;
  getUserChallengeCompletions(userId: number): Promise<schema.ChallengeCompletion[]>;
  
  // Simulations
  getSimulations(): Promise<schema.Simulation[]>;
  getSimulationById(id: number): Promise<schema.Simulation | undefined>;
  getSimulationsByModuleId(moduleId: number): Promise<schema.Simulation[]>;
  createSimulation(simulation: schema.InsertSimulation): Promise<schema.Simulation>;
}

export class DatabaseStorage implements IStorage {
  // Modules
  async getModules(): Promise<schema.Module[]> {
    return db.select().from(schema.modules).orderBy(schema.modules.order);
  }
  
  async getModuleById(id: number): Promise<schema.Module | undefined> {
    const [module] = await db.select().from(schema.modules).where(eq(schema.modules.id, id));
    return module;
  }
  
  async createModule(module: schema.InsertModule): Promise<schema.Module> {
    const [newModule] = await db.insert(schema.modules).values(module).returning();
    return newModule;
  }
  
  async updateModule(id: number, moduleData: Partial<schema.InsertModule>): Promise<schema.Module | undefined> {
    const [updatedModule] = await db
      .update(schema.modules)
      .set({ ...moduleData, updatedAt: new Date() })
      .where(eq(schema.modules.id, id))
      .returning();
    return updatedModule;
  }
  
  // Quizzes
  async getQuizzes(): Promise<schema.Quiz[]> {
    return db.select().from(schema.quizzes);
  }
  
  async getQuizById(id: number): Promise<schema.Quiz | undefined> {
    const [quiz] = await db.select().from(schema.quizzes).where(eq(schema.quizzes.id, id));
    return quiz;
  }
  
  async getQuizzesByModuleId(moduleId: number): Promise<schema.Quiz[]> {
    return db.select().from(schema.quizzes).where(eq(schema.quizzes.moduleId, moduleId));
  }
  
  async createQuiz(quiz: schema.InsertQuiz): Promise<schema.Quiz> {
    const [newQuiz] = await db.insert(schema.quizzes).values(quiz).returning();
    return newQuiz;
  }
  
  // Quiz Questions
  async getQuizQuestions(quizId: number): Promise<schema.QuizQuestion[]> {
    return db
      .select()
      .from(schema.quizQuestions)
      .where(eq(schema.quizQuestions.quizId, quizId))
      .orderBy(schema.quizQuestions.order);
  }
  
  async createQuizQuestion(question: schema.InsertQuizQuestion): Promise<schema.QuizQuestion> {
    const [newQuestion] = await db.insert(schema.quizQuestions).values(question).returning();
    return newQuestion;
  }
  
  // Dictionary Terms
  async getDictionaryTerms(): Promise<schema.DictionaryTerm[]> {
    return db.select().from(schema.dictionaryTerms).orderBy(schema.dictionaryTerms.term);
  }
  
  async getDictionaryTermById(id: number): Promise<schema.DictionaryTerm | undefined> {
    const [term] = await db.select().from(schema.dictionaryTerms).where(eq(schema.dictionaryTerms.id, id));
    return term;
  }
  
  async getDictionaryTermByName(term: string): Promise<schema.DictionaryTerm | undefined> {
    const [result] = await db
      .select()
      .from(schema.dictionaryTerms)
      .where(eq(schema.dictionaryTerms.term, term));
    return result;
  }
  
  async getDictionaryTermsByCategory(category: string): Promise<schema.DictionaryTerm[]> {
    return db
      .select()
      .from(schema.dictionaryTerms)
      .where(eq(schema.dictionaryTerms.category, category))
      .orderBy(schema.dictionaryTerms.term);
  }
  
  async createDictionaryTerm(term: schema.InsertDictionaryTerm): Promise<schema.DictionaryTerm> {
    const [newTerm] = await db.insert(schema.dictionaryTerms).values(term).returning();
    return newTerm;
  }
  
  // Trade Agreements
  async getTradeAgreements(): Promise<schema.TradeAgreement[]> {
    return db.select().from(schema.tradeAgreements).orderBy(schema.tradeAgreements.name);
  }
  
  async getTradeAgreementById(id: number): Promise<schema.TradeAgreement | undefined> {
    const [agreement] = await db
      .select()
      .from(schema.tradeAgreements)
      .where(eq(schema.tradeAgreements.id, id));
    return agreement;
  }
  
  async createTradeAgreement(agreement: schema.InsertTradeAgreement): Promise<schema.TradeAgreement> {
    const [newAgreement] = await db.insert(schema.tradeAgreements).values(agreement).returning();
    return newAgreement;
  }
  
  // User Progress
  async getUserProgress(userId: number): Promise<schema.UserProgress[]> {
    return db.select().from(schema.userProgress).where(eq(schema.userProgress.userId, userId));
  }
  
  async getUserModuleProgress(userId: number, moduleId: number): Promise<schema.UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(schema.userProgress)
      .where(
        and(
          eq(schema.userProgress.userId, userId),
          eq(schema.userProgress.moduleId, moduleId)
        )
      );
    return progress;
  }
  
  async updateUserProgress(userId: number, moduleId: number, completed: boolean): Promise<schema.UserProgress> {
    // Check if progress entry already exists
    const existingProgress = await this.getUserModuleProgress(userId, moduleId);
    
    if (existingProgress) {
      // Update existing record
      const [updated] = await db
        .update(schema.userProgress)
        .set({
          completed,
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(schema.userProgress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      // Create new record
      const [newProgress] = await db
        .insert(schema.userProgress)
        .values({
          userId,
          moduleId,
          completed,
          lastAccessedAt: new Date()
        })
        .returning();
      return newProgress;
    }
  }
  
  async getUserQuizResults(userId: number, quizId: number): Promise<schema.UserProgress | undefined> {
    const [result] = await db
      .select()
      .from(schema.userProgress)
      .where(
        and(
          eq(schema.userProgress.userId, userId),
          eq(schema.userProgress.quizId, quizId)
        )
      );
    return result;
  }
  
  async saveQuizResult(userId: number, quizId: number, score: number): Promise<schema.UserProgress> {
    // Check if result already exists
    const existingResult = await this.getUserQuizResults(userId, quizId);
    
    if (existingResult) {
      // Update existing record with better score
      if (score > (existingResult.score || 0)) {
        const [updated] = await db
          .update(schema.userProgress)
          .set({
            score,
            completed: true,
            lastAccessedAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(schema.userProgress.id, existingResult.id))
          .returning();
        return updated;
      }
      return existingResult;
    } else {
      // Create new record
      const [newResult] = await db
        .insert(schema.userProgress)
        .values({
          userId,
          quizId,
          score,
          completed: true,
          lastAccessedAt: new Date()
        })
        .returning();
      return newResult;
    }
  }
  
  // Dictionary Term Views
  async recordDictionaryTermView(userId: number, termId: number): Promise<schema.DictionaryView> {
    // Check if view already exists
    const [existingView] = await db
      .select()
      .from(schema.dictionaryViews)
      .where(
        and(
          eq(schema.dictionaryViews.userId, userId),
          eq(schema.dictionaryViews.termId, termId)
        )
      );
    
    if (existingView) {
      // Update view count
      const [updated] = await db
        .update(schema.dictionaryViews)
        .set({
          viewCount: existingView.viewCount + 1,
          lastViewedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(schema.dictionaryViews.id, existingView.id))
        .returning();
      return updated;
    } else {
      // Create new view
      const [newView] = await db
        .insert(schema.dictionaryViews)
        .values({
          userId,
          termId,
          viewCount: 1,
          lastViewedAt: new Date()
        })
        .returning();
      return newView;
    }
  }
  
  async getDictionaryTermViews(userId: number): Promise<schema.DictionaryView[]> {
    return db
      .select()
      .from(schema.dictionaryViews)
      .where(eq(schema.dictionaryViews.userId, userId))
      .orderBy(desc(schema.dictionaryViews.viewCount));
  }
  
  // Daily Challenges
  async getDailyChallenge(date?: Date): Promise<schema.DailyChallenge | undefined> {
    const targetDate = date || new Date();
    const [challenge] = await db
      .select()
      .from(schema.dailyChallenges)
      .where(eq(schema.dailyChallenges.date, targetDate))
      .limit(1);
    return challenge;
  }
  
  async createDailyChallenge(challenge: schema.InsertDailyChallenge): Promise<schema.DailyChallenge> {
    const [newChallenge] = await db.insert(schema.dailyChallenges).values(challenge).returning();
    return newChallenge;
  }
  
  async recordChallengeCompletion(userId: number, challengeId: number, score?: number): Promise<schema.ChallengeCompletion> {
    // Check if already completed
    const [existing] = await db
      .select()
      .from(schema.challengeCompletions)
      .where(
        and(
          eq(schema.challengeCompletions.userId, userId),
          eq(schema.challengeCompletions.challengeId, challengeId)
        )
      );
    
    if (existing) {
      return existing; // Already completed, return existing record
    }
    
    // Create new completion record
    const [completion] = await db
      .insert(schema.challengeCompletions)
      .values({
        userId,
        challengeId,
        score,
        completed: true,
        completedAt: new Date()
      })
      .returning();
    return completion;
  }
  
  async getUserChallengeCompletions(userId: number): Promise<schema.ChallengeCompletion[]> {
    return db
      .select()
      .from(schema.challengeCompletions)
      .where(eq(schema.challengeCompletions.userId, userId))
      .orderBy(desc(schema.challengeCompletions.completedAt));
  }
  
  // Simulations
  async getSimulations(): Promise<schema.Simulation[]> {
    return db.select().from(schema.simulations);
  }
  
  async getSimulationById(id: number): Promise<schema.Simulation | undefined> {
    const [simulation] = await db
      .select()
      .from(schema.simulations)
      .where(eq(schema.simulations.id, id));
    return simulation;
  }
  
  async getSimulationsByModuleId(moduleId: number): Promise<schema.Simulation[]> {
    return db
      .select()
      .from(schema.simulations)
      .where(eq(schema.simulations.moduleId, moduleId));
  }
  
  async createSimulation(simulation: schema.InsertSimulation): Promise<schema.Simulation> {
    const [newSimulation] = await db.insert(schema.simulations).values(simulation).returning();
    return newSimulation;
  }
}

export const storage = new DatabaseStorage();