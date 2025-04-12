import { db } from "./db";
import { 
  modules, Module, InsertModule,
  quizzes, Quiz, InsertQuiz,
  quizQuestions, QuizQuestion, InsertQuizQuestion,
  quizOptions, QuizOption, InsertQuizOption,
  dictionaryTerms, DictionaryTerm, InsertDictionaryTerm,
  tradeAgreements, TradeAgreement, InsertTradeAgreement,
  dailyChallenges, DailyChallenge, InsertDailyChallenge,
  challengeCompletions, ChallengeCompletion,
  users, User, InsertUser,
  userModuleProgress, UserModuleProgress,
  userQuizProgress, UserQuizProgress,
  badges, Badge, InsertBadge,
  userBadges, UserBadge,
  featureFlags, FeatureFlag, InsertFeatureFlag,
  featureAccess, FeatureAccess, InsertFeatureAccess,
  emailSubscribers, EmailSubscriber, InsertEmailSubscriber,
  certificates, Certificate
} from "../shared/schema";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";

/**
 * Interface for all storage operations in the v2 platform
 */
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: number, role: string): Promise<User | undefined>;
  
  // Modules
  getModules(options?: { category?: string, published?: boolean, limit?: number, offset?: number }): Promise<Module[]>;
  getModuleById(id: number): Promise<Module | undefined>;
  getModuleBySlug(slug: string): Promise<Module | undefined>;
  getModuleCategories(): Promise<string[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, module: Partial<Module>): Promise<Module | undefined>;
  
  // Quizzes
  getQuizzes(options?: { moduleId?: number, limit?: number, offset?: number }): Promise<Quiz[]>;
  getQuizById(id: number): Promise<Quiz | undefined>;
  getQuizBySlug(slug: string): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Quiz Questions
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  
  // Quiz Options
  getQuizOptions(questionId: number): Promise<QuizOption[]>;
  createQuizOption(option: InsertQuizOption): Promise<QuizOption>;
  
  // Dictionary Terms
  getDictionaryTerms(options?: { category?: string, searchQuery?: string, limit?: number, offset?: number }): Promise<DictionaryTerm[]>;
  getDictionaryTermById(id: number): Promise<DictionaryTerm | undefined>;
  getDictionaryTermBySlug(slug: string): Promise<DictionaryTerm | undefined>;
  getDictionaryCategories(): Promise<string[]>;
  createDictionaryTerm(term: InsertDictionaryTerm): Promise<DictionaryTerm>;
  updateDictionaryTermViewCount(id: number): Promise<DictionaryTerm | undefined>;
  
  // Trade Agreements
  getTradeAgreements(options?: { status?: string, limit?: number, offset?: number }): Promise<TradeAgreement[]>;
  getTradeAgreementById(id: number): Promise<TradeAgreement | undefined>;
  getTradeAgreementBySlug(slug: string): Promise<TradeAgreement | undefined>;
  createTradeAgreement(agreement: InsertTradeAgreement): Promise<TradeAgreement>;
  
  // User Progress
  getUserModuleProgress(userId: number, moduleId: number): Promise<UserModuleProgress | undefined>;
  updateUserModuleProgress(userId: number, moduleId: number, progress: number, completed?: boolean): Promise<UserModuleProgress>;
  getUserQuizProgress(userId: number, quizId: number): Promise<UserQuizProgress | undefined>;
  updateUserQuizProgress(userId: number, quizId: number, score: number, passed: boolean): Promise<UserQuizProgress>;
  
  // Daily Challenges
  getDailyChallenge(date?: string): Promise<DailyChallenge | undefined>;
  createDailyChallenge(challenge: InsertDailyChallenge): Promise<DailyChallenge>;
  checkChallengeCompletion(userId: number, challengeId: number): Promise<boolean>;
  completeChallenge(userId: number, challengeId: number): Promise<ChallengeCompletion>;
  
  // Badges
  getBadges(): Promise<Badge[]>;
  getBadgeById(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getUserBadges(userId: number): Promise<Badge[]>;
  awardBadgeToUser(userId: number, badgeId: number): Promise<UserBadge>;
  
  // Feature Flags
  getFeatureFlags(): Promise<FeatureFlag[]>;
  getFeatureFlag(name: string): Promise<FeatureFlag | undefined>;
  createFeatureFlag(featureFlag: InsertFeatureFlag): Promise<FeatureFlag>;
  updateFeatureFlag(name: string, isEnabled: boolean): Promise<FeatureFlag | undefined>;
  
  // Feature Access
  getFeatureAccess(featureName: string, userRole: string): Promise<FeatureAccess | undefined>;
  getAllFeatureAccess(): Promise<FeatureAccess[]>;
  setFeatureAccess(featureName: string, userRole: string, isEnabled: boolean): Promise<FeatureAccess>;
  
  // Email Subscribers
  getEmailSubscribers(): Promise<EmailSubscriber[]>;
  getEmailSubscriber(email: string): Promise<EmailSubscriber | undefined>;
  createEmailSubscriber(subscriber: InsertEmailSubscriber): Promise<EmailSubscriber>;
  updateEmailSubscriberStatus(email: string, status: string): Promise<EmailSubscriber | undefined>;
  
  // Certificates
  getUserCertificates(userId: number): Promise<Certificate[]>;
  generateCertificate(userId: number, moduleId: number): Promise<Certificate>;
}

/**
 * Implementation of the IStorage interface using PostgreSQL and Drizzle ORM
 */
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserRole(userId: number, role: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // Modules
  async getModules(options?: { category?: string; published?: boolean; limit?: number; offset?: number }): Promise<Module[]> {
    let query = db.select().from(modules);
    
    if (options?.category) {
      query = query.where(eq(modules.category, options.category));
    }
    
    if (options?.published !== undefined) {
      query = query.where(eq(modules.published, options.published));
    }
    
    query = query.orderBy(asc(modules.id));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }

  async getModuleById(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  async getModuleBySlug(slug: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.slug, slug));
    return module;
  }

  async getModuleCategories(): Promise<string[]> {
    const result = await db
      .select({ category: modules.category })
      .from(modules)
      .groupBy(modules.category);
    
    return result.map(item => item.category);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(insertModule).returning();
    return module;
  }

  async updateModule(id: number, moduleData: Partial<Module>): Promise<Module | undefined> {
    const [updatedModule] = await db
      .update(modules)
      .set({ ...moduleData, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return updatedModule;
  }

  // Quizzes
  async getQuizzes(options?: { moduleId?: number; limit?: number; offset?: number }): Promise<Quiz[]> {
    let query = db.select().from(quizzes);
    
    if (options?.moduleId) {
      query = query.where(eq(quizzes.moduleId, options.moduleId));
    }
    
    query = query.orderBy(asc(quizzes.id));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizBySlug(slug: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.slug, slug));
    return quiz;
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }

  // Quiz Questions
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.order));
  }

  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, id));
    return question;
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db
      .insert(quizQuestions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  // Quiz Options
  async getQuizOptions(questionId: number): Promise<QuizOption[]> {
    return await db
      .select()
      .from(quizOptions)
      .where(eq(quizOptions.questionId, questionId));
  }

  async createQuizOption(insertOption: InsertQuizOption): Promise<QuizOption> {
    const [option] = await db
      .insert(quizOptions)
      .values(insertOption)
      .returning();
    return option;
  }

  // Dictionary Terms
  async getDictionaryTerms(options?: { category?: string; searchQuery?: string; limit?: number; offset?: number }): Promise<DictionaryTerm[]> {
    let query = db.select().from(dictionaryTerms);
    
    if (options?.category) {
      query = query.where(eq(dictionaryTerms.category, options.category));
    }
    
    if (options?.searchQuery) {
      query = query.where(
        like(dictionaryTerms.name, `%${options.searchQuery}%`)
      );
    }
    
    query = query.orderBy(asc(dictionaryTerms.name));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }

  async getDictionaryTermById(id: number): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .select()
      .from(dictionaryTerms)
      .where(eq(dictionaryTerms.id, id));
    return term;
  }

  async getDictionaryTermBySlug(slug: string): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .select()
      .from(dictionaryTerms)
      .where(eq(dictionaryTerms.slug, slug));
    return term;
  }

  async getDictionaryCategories(): Promise<string[]> {
    const result = await db
      .select({ category: dictionaryTerms.category })
      .from(dictionaryTerms)
      .groupBy(dictionaryTerms.category);
    
    return result.map(item => item.category);
  }

  async createDictionaryTerm(insertTerm: InsertDictionaryTerm): Promise<DictionaryTerm> {
    const [term] = await db
      .insert(dictionaryTerms)
      .values(insertTerm)
      .returning();
    return term;
  }

  async updateDictionaryTermViewCount(id: number): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .update(dictionaryTerms)
      .set({
        viewCount: sql`${dictionaryTerms.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(dictionaryTerms.id, id))
      .returning();
    return term;
  }

  // Trade Agreements
  async getTradeAgreements(options?: { status?: string; limit?: number; offset?: number }): Promise<TradeAgreement[]> {
    let query = db.select().from(tradeAgreements);
    
    if (options?.status) {
      query = query.where(eq(tradeAgreements.status, options.status));
    }
    
    query = query.orderBy(asc(tradeAgreements.name));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }

  async getTradeAgreementById(id: number): Promise<TradeAgreement | undefined> {
    const [agreement] = await db
      .select()
      .from(tradeAgreements)
      .where(eq(tradeAgreements.id, id));
    return agreement;
  }

  async getTradeAgreementBySlug(slug: string): Promise<TradeAgreement | undefined> {
    const [agreement] = await db
      .select()
      .from(tradeAgreements)
      .where(eq(tradeAgreements.slug, slug));
    return agreement;
  }

  async createTradeAgreement(insertAgreement: InsertTradeAgreement): Promise<TradeAgreement> {
    const [agreement] = await db
      .insert(tradeAgreements)
      .values(insertAgreement)
      .returning();
    return agreement;
  }

  // User Progress
  async getUserModuleProgress(userId: number, moduleId: number): Promise<UserModuleProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.moduleId, moduleId)
        )
      );
    return progress;
  }

  async updateUserModuleProgress(userId: number, moduleId: number, progress: number, completed?: boolean): Promise<UserModuleProgress> {
    // Check if a record exists
    const existingProgress = await this.getUserModuleProgress(userId, moduleId);
    
    if (existingProgress) {
      // Update existing record
      const updateData: any = { 
        progress, 
        updatedAt: new Date() 
      };
      
      if (completed) {
        updateData.completedAt = new Date();
      }
      
      const [updatedProgress] = await db
        .update(userModuleProgress)
        .set(updateData)
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            eq(userModuleProgress.moduleId, moduleId)
          )
        )
        .returning();
      
      return updatedProgress;
    } else {
      // Create new record
      const insertData: any = {
        userId,
        moduleId,
        progress,
        status: completed ? 'completed' : 'in_progress'
      };
      
      if (completed) {
        insertData.completedAt = new Date();
      }
      
      const [newProgress] = await db
        .insert(userModuleProgress)
        .values(insertData)
        .returning();
      
      return newProgress;
    }
  }

  async getUserQuizProgress(userId: number, quizId: number): Promise<UserQuizProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userQuizProgress)
      .where(
        and(
          eq(userQuizProgress.userId, userId),
          eq(userQuizProgress.quizId, quizId)
        )
      );
    return progress;
  }

  async updateUserQuizProgress(userId: number, quizId: number, score: number, passed: boolean): Promise<UserQuizProgress> {
    // Check if a record exists
    const existingProgress = await this.getUserQuizProgress(userId, quizId);
    
    if (existingProgress) {
      // Update existing record
      const [updatedProgress] = await db
        .update(userQuizProgress)
        .set({
          score,
          passed,
          updatedAt: new Date(),
          completedAt: new Date()
        })
        .where(
          and(
            eq(userQuizProgress.userId, userId),
            eq(userQuizProgress.quizId, quizId)
          )
        )
        .returning();
      
      return updatedProgress;
    } else {
      // Create new record
      const [newProgress] = await db
        .insert(userQuizProgress)
        .values({
          userId,
          quizId,
          score,
          passed,
          completedAt: new Date()
        })
        .returning();
      
      return newProgress;
    }
  }

  // Daily Challenges
  async getDailyChallenge(date?: string): Promise<DailyChallenge | undefined> {
    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];
    
    const [challenge] = await db
      .select()
      .from(dailyChallenges)
      .where(eq(dailyChallenges.date, dateStr));
    
    return challenge;
  }

  async createDailyChallenge(insertChallenge: InsertDailyChallenge): Promise<DailyChallenge> {
    const [challenge] = await db
      .insert(dailyChallenges)
      .values(insertChallenge)
      .returning();
    return challenge;
  }

  async checkChallengeCompletion(userId: number, challengeId: number): Promise<boolean> {
    const [completion] = await db
      .select()
      .from(challengeCompletions)
      .where(
        and(
          eq(challengeCompletions.userId, userId),
          eq(challengeCompletions.challengeId, challengeId)
        )
      );
    
    return !!completion;
  }

  async completeChallenge(userId: number, challengeId: number): Promise<ChallengeCompletion> {
    const [completion] = await db
      .insert(challengeCompletions)
      .values({
        userId,
        challengeId,
        completedAt: new Date()
      })
      .returning();
    
    return completion;
  }

  // Badges
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }

  async getBadgeById(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db.insert(badges).values(insertBadge).returning();
    return badge;
  }

  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadgesWithInfo = await db
      .select({
        badge: badges
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));
    
    return userBadgesWithInfo.map(item => item.badge);
  }

  async awardBadgeToUser(userId: number, badgeId: number): Promise<UserBadge> {
    // Check if already awarded
    const [existing] = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, badgeId)
        )
      );
    
    if (existing) {
      return existing;
    }
    
    const [userBadge] = await db
      .insert(userBadges)
      .values({
        userId,
        badgeId,
        awardedAt: new Date()
      })
      .returning();
    
    return userBadge;
  }

  // Feature Flags
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return await db.select().from(featureFlags);
  }

  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    const [featureFlag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.name, name));
    
    return featureFlag;
  }

  async createFeatureFlag(insertFeatureFlag: InsertFeatureFlag): Promise<FeatureFlag> {
    const [featureFlag] = await db
      .insert(featureFlags)
      .values(insertFeatureFlag)
      .returning();
    
    return featureFlag;
  }

  async updateFeatureFlag(name: string, isEnabled: boolean): Promise<FeatureFlag | undefined> {
    const [updatedFlag] = await db
      .update(featureFlags)
      .set({ isEnabled, updatedAt: new Date() })
      .where(eq(featureFlags.name, name))
      .returning();
    
    return updatedFlag;
  }

  // Feature Access
  async getFeatureAccess(featureName: string, userRole: string): Promise<FeatureAccess | undefined> {
    const [access] = await db
      .select()
      .from(featureAccess)
      .where(
        and(
          eq(featureAccess.featureName, featureName),
          eq(featureAccess.userRole, userRole)
        )
      );
    
    return access;
  }

  async getAllFeatureAccess(): Promise<FeatureAccess[]> {
    return await db.select().from(featureAccess);
  }

  async setFeatureAccess(featureName: string, userRole: string, isEnabled: boolean): Promise<FeatureAccess> {
    // Check if record exists
    const existingAccess = await this.getFeatureAccess(featureName, userRole);
    
    if (existingAccess) {
      // Update existing record
      const [updatedAccess] = await db
        .update(featureAccess)
        .set({ isEnabled })
        .where(
          and(
            eq(featureAccess.featureName, featureName),
            eq(featureAccess.userRole, userRole)
          )
        )
        .returning();
      
      return updatedAccess;
    } else {
      // Create new record
      const [newAccess] = await db
        .insert(featureAccess)
        .values({
          featureName,
          userRole,
          isEnabled
        })
        .returning();
      
      return newAccess;
    }
  }

  // Email Subscribers
  async getEmailSubscribers(): Promise<EmailSubscriber[]> {
    return await db.select().from(emailSubscribers);
  }

  async getEmailSubscriber(email: string): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(emailSubscribers)
      .where(eq(emailSubscribers.email, email));
    
    return subscriber;
  }

  async createEmailSubscriber(insertSubscriber: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const [subscriber] = await db
      .insert(emailSubscribers)
      .values(insertSubscriber)
      .returning();
    
    return subscriber;
  }

  async updateEmailSubscriberStatus(email: string, status: string): Promise<EmailSubscriber | undefined> {
    const [updatedSubscriber] = await db
      .update(emailSubscribers)
      .set({ status, updatedAt: new Date() })
      .where(eq(emailSubscribers.email, email))
      .returning();
    
    return updatedSubscriber;
  }

  // Certificates
  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId));
  }

  async generateCertificate(userId: number, moduleId: number): Promise<Certificate> {
    const [certificate] = await db
      .insert(certificates)
      .values({
        userId,
        moduleId,
        issuedAt: new Date()
      })
      .returning();
    
    return certificate;
  }
}

// Export a singleton instance of the database storage
export const storage = new DatabaseStorage();