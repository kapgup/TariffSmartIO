import {
  User,
  InsertUser,
  Module,
  InsertModule,
  Quiz,
  InsertQuiz,
  QuizQuestion,
  InsertQuizQuestion,
  QuizOption,
  InsertQuizOption,
  UserModuleProgress,
  InsertUserModuleProgress,
  UserQuizProgress,
  InsertUserQuizProgress,
  DictionaryTerm,
  InsertDictionaryTerm,
  TradeAgreement,
  InsertTradeAgreement,
  DailyChallenge,
  InsertDailyChallenge,
  ChallengeCompletion,
  InsertChallengeCompletion,
  Badge,
  InsertBadge,
  UserBadge,
  InsertUserBadge,
  FeatureFlag,
  InsertFeatureFlag,
  FeatureAccess,
  InsertFeatureAccess,
  EmailSubscriber,
  InsertEmailSubscriber,
  Certificate,
  InsertCertificate,
  users,
  modules,
  quizzes,
  quizQuestions,
  quizOptions,
  userModuleProgress,
  userQuizProgress,
  dictionaryTerms,
  tradeAgreements,
  dailyChallenges,
  challengeCompletions,
  badges,
  userBadges,
  featureFlags,
  featureAccess,
  emailSubscribers,
  certificates,
  moduleCategoryEnum,
  difficultyEnum,
  userRoleEnum,
  tradeAgreementStatusEnum,
  emailSubscriberStatusEnum
} from "../shared/schema";
import { db } from "./db";
import { eq, and, like, desc, sql, asc } from "drizzle-orm";

/**
 * Storage interface for the v2 platform
 */
export class DatabaseStorage {
  constructor() {
    // Initialize storage
  }

  // User related methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserRole(userId: number, role: keyof typeof userRoleEnum.enumValues): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  // Module related methods
  async getModules(options?: { category?: string; published?: boolean; }): Promise<Module[]> {
    let query = db.select().from(modules);
    
    if (options?.category) {
      query = query.where(eq(modules.category, options.category));
    }
    
    if (options?.published !== undefined) {
      query = query.where(eq(modules.published, options.published));
    }
    
    return await query.orderBy(desc(modules.createdAt));
  }

  async getModuleById(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || undefined;
  }

  async getModuleBySlug(slug: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.slug, slug));
    return module || undefined;
  }
  
  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(insertModule).returning();
    return module;
  }

  async updateModule(id: number, moduleData: Partial<InsertModule>): Promise<Module | undefined> {
    const [module] = await db
      .update(modules)
      .set({ ...moduleData, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return module || undefined;
  }

  // Quiz related methods
  async getQuizzes(options?: { moduleId?: number; published?: boolean }): Promise<Quiz[]> {
    let query = db.select().from(quizzes);
    
    if (options?.moduleId) {
      query = query.where(eq(quizzes.moduleId, options.moduleId));
    }
    
    if (options?.published !== undefined) {
      query = query.where(eq(quizzes.published, options.published));
    }
    
    return await query.orderBy(desc(quizzes.createdAt));
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async getQuizBySlug(slug: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.slug, slug));
    return quiz || undefined;
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }

  async updateQuiz(id: number, quizData: Partial<InsertQuiz>): Promise<Quiz | undefined> {
    const [quiz] = await db
      .update(quizzes)
      .set({ ...quizData, updatedAt: new Date() })
      .where(eq(quizzes.id, id))
      .returning();
    return quiz || undefined;
  }

  // Quiz questions and options
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.order));
  }

  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    const [question] = await db.select().from(quizQuestions).where(eq(quizQuestions.id, id));
    return question || undefined;
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db.insert(quizQuestions).values(insertQuestion).returning();
    return question;
  }

  async getQuizOptions(questionId: number): Promise<QuizOption[]> {
    return await db
      .select()
      .from(quizOptions)
      .where(eq(quizOptions.questionId, questionId))
      .orderBy(asc(quizOptions.order));
  }

  async createQuizOption(insertOption: InsertQuizOption): Promise<QuizOption> {
    const [option] = await db.insert(quizOptions).values(insertOption).returning();
    return option;
  }

  // User progress
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
    return progress || undefined;
  }

  async getUserModuleProgressByUser(userId: number): Promise<UserModuleProgress[]> {
    return await db
      .select()
      .from(userModuleProgress)
      .where(eq(userModuleProgress.userId, userId));
  }

  async createUserModuleProgress(insertProgress: InsertUserModuleProgress): Promise<UserModuleProgress> {
    const [progress] = await db.insert(userModuleProgress).values(insertProgress).returning();
    return progress;
  }

  async updateUserModuleProgress(userId: number, moduleId: number, data: Partial<InsertUserModuleProgress>): Promise<UserModuleProgress | undefined> {
    const [progress] = await db
      .update(userModuleProgress)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.moduleId, moduleId)
        )
      )
      .returning();
    return progress || undefined;
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
    return progress || undefined;
  }

  async getUserQuizProgressByUser(userId: number): Promise<UserQuizProgress[]> {
    return await db
      .select()
      .from(userQuizProgress)
      .where(eq(userQuizProgress.userId, userId));
  }

  async createUserQuizProgress(insertProgress: InsertUserQuizProgress): Promise<UserQuizProgress> {
    const [progress] = await db.insert(userQuizProgress).values(insertProgress).returning();
    return progress;
  }

  async updateUserQuizProgress(userId: number, quizId: number, data: Partial<InsertUserQuizProgress>): Promise<UserQuizProgress | undefined> {
    const [progress] = await db
      .update(userQuizProgress)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(userQuizProgress.userId, userId),
          eq(userQuizProgress.quizId, quizId)
        )
      )
      .returning();
    return progress || undefined;
  }

  // Dictionary terms
  async getDictionaryTerms(options?: { category?: string; searchQuery?: string }): Promise<DictionaryTerm[]> {
    let query = db.select().from(dictionaryTerms);
    
    if (options?.category) {
      query = query.where(eq(dictionaryTerms.category, options.category));
    }
    
    if (options?.searchQuery) {
      query = query.where(
        like(dictionaryTerms.name, `%${options.searchQuery}%`)
      );
    }
    
    return await query.orderBy(asc(dictionaryTerms.name));
  }

  async getDictionaryTermById(id: number): Promise<DictionaryTerm | undefined> {
    const [term] = await db.select().from(dictionaryTerms).where(eq(dictionaryTerms.id, id));
    return term || undefined;
  }

  async getDictionaryTermBySlug(slug: string): Promise<DictionaryTerm | undefined> {
    const [term] = await db.select().from(dictionaryTerms).where(eq(dictionaryTerms.slug, slug));
    return term || undefined;
  }

  async createDictionaryTerm(insertTerm: InsertDictionaryTerm): Promise<DictionaryTerm> {
    const [term] = await db.insert(dictionaryTerms).values(insertTerm).returning();
    return term;
  }

  async updateDictionaryTerm(id: number, termData: Partial<InsertDictionaryTerm>): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .update(dictionaryTerms)
      .set({ ...termData, updatedAt: new Date() })
      .where(eq(dictionaryTerms.id, id))
      .returning();
    return term || undefined;
  }

  async incrementDictionaryTermViewCount(id: number): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .update(dictionaryTerms)
      .set({
        viewCount: sql`${dictionaryTerms.viewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(dictionaryTerms.id, id))
      .returning();
    return term || undefined;
  }

  // Trade agreements
  async getTradeAgreements(options?: { status?: keyof typeof tradeAgreementStatusEnum.enumValues; searchQuery?: string }): Promise<TradeAgreement[]> {
    let query = db.select().from(tradeAgreements);
    
    if (options?.status) {
      query = query.where(eq(tradeAgreements.status, options.status));
    }
    
    if (options?.searchQuery) {
      query = query.where(
        like(tradeAgreements.name, `%${options.searchQuery}%`)
      );
    }
    
    return await query.orderBy(asc(tradeAgreements.name));
  }

  async getTradeAgreementById(id: number): Promise<TradeAgreement | undefined> {
    const [agreement] = await db.select().from(tradeAgreements).where(eq(tradeAgreements.id, id));
    return agreement || undefined;
  }

  async getTradeAgreementBySlug(slug: string): Promise<TradeAgreement | undefined> {
    const [agreement] = await db.select().from(tradeAgreements).where(eq(tradeAgreements.slug, slug));
    return agreement || undefined;
  }

  async createTradeAgreement(insertAgreement: InsertTradeAgreement): Promise<TradeAgreement> {
    const [agreement] = await db.insert(tradeAgreements).values(insertAgreement).returning();
    return agreement;
  }

  async updateTradeAgreement(id: number, agreementData: Partial<InsertTradeAgreement>): Promise<TradeAgreement | undefined> {
    const [agreement] = await db
      .update(tradeAgreements)
      .set({ ...agreementData, updatedAt: new Date() })
      .where(eq(tradeAgreements.id, id))
      .returning();
    return agreement || undefined;
  }

  // Daily challenges
  async getDailyChallenges(): Promise<DailyChallenge[]> {
    return await db.select().from(dailyChallenges).orderBy(desc(dailyChallenges.date));
  }

  async getDailyChallenge(date?: Date): Promise<DailyChallenge | undefined> {
    const queryDate = date || new Date();
    const [challenge] = await db
      .select()
      .from(dailyChallenges)
      .where(eq(dailyChallenges.date, queryDate));
    return challenge || undefined;
  }

  async createDailyChallenge(insertChallenge: InsertDailyChallenge): Promise<DailyChallenge> {
    const [challenge] = await db.insert(dailyChallenges).values(insertChallenge).returning();
    return challenge;
  }

  async getChallengeCompletion(userId: number, challengeId: number): Promise<ChallengeCompletion | undefined> {
    const [completion] = await db
      .select()
      .from(challengeCompletions)
      .where(
        and(
          eq(challengeCompletions.userId, userId),
          eq(challengeCompletions.challengeId, challengeId)
        )
      );
    return completion || undefined;
  }

  async getUserChallengeCompletions(userId: number): Promise<ChallengeCompletion[]> {
    return await db
      .select()
      .from(challengeCompletions)
      .where(eq(challengeCompletions.userId, userId));
  }

  async createChallengeCompletion(insertCompletion: InsertChallengeCompletion): Promise<ChallengeCompletion> {
    const [completion] = await db.insert(challengeCompletions).values(insertCompletion).returning();
    return completion;
  }

  // Badges
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }

  async getBadgeById(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge || undefined;
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db.insert(badges).values(insertBadge).returning();
    return badge;
  }

  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));
  }

  async getUserBadge(userId: number, badgeId: number): Promise<UserBadge | undefined> {
    const [userBadge] = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, badgeId)
        )
      );
    return userBadge || undefined;
  }

  async awardBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const [userBadge] = await db.insert(userBadges).values(insertUserBadge).returning();
    return userBadge;
  }

  // Feature flags
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return await db.select().from(featureFlags);
  }

  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    const [featureFlag] = await db.select().from(featureFlags).where(eq(featureFlags.name, name));
    return featureFlag || undefined;
  }

  async createFeatureFlag(insertFeatureFlag: InsertFeatureFlag): Promise<FeatureFlag> {
    const [featureFlag] = await db.insert(featureFlags).values(insertFeatureFlag).returning();
    return featureFlag;
  }

  async updateFeatureFlag(name: string, isEnabled: boolean): Promise<FeatureFlag | undefined> {
    const [featureFlag] = await db
      .update(featureFlags)
      .set({ isEnabled, updatedAt: new Date() })
      .where(eq(featureFlags.name, name))
      .returning();
    return featureFlag || undefined;
  }

  // Feature access
  async getFeatureAccess(featureName: string, userRole: keyof typeof userRoleEnum.enumValues): Promise<FeatureAccess | undefined> {
    const [access] = await db
      .select()
      .from(featureAccess)
      .where(
        and(
          eq(featureAccess.featureName, featureName),
          eq(featureAccess.userRole, userRole)
        )
      );
    return access || undefined;
  }

  async getAllFeatureAccess(): Promise<FeatureAccess[]> {
    return await db.select().from(featureAccess);
  }

  async setFeatureAccess(featureName: string, userRole: keyof typeof userRoleEnum.enumValues, isEnabled: boolean): Promise<FeatureAccess> {
    // Try to update existing record
    const [existing] = await db
      .update(featureAccess)
      .set({ isEnabled, updatedAt: new Date() })
      .where(
        and(
          eq(featureAccess.featureName, featureName),
          eq(featureAccess.userRole, userRole)
        )
      )
      .returning();

    if (existing) {
      return existing;
    }

    // Create new record if it doesn't exist
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

  // Email subscribers
  async getEmailSubscribers(): Promise<EmailSubscriber[]> {
    return await db.select().from(emailSubscribers);
  }

  async getEmailSubscriber(email: string): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, email));
    return subscriber || undefined;
  }

  async createEmailSubscriber(insertSubscriber: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const [subscriber] = await db.insert(emailSubscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async updateEmailSubscriberStatus(email: string, status: keyof typeof emailSubscriberStatusEnum.enumValues): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db
      .update(emailSubscribers)
      .set({ status, updatedAt: new Date() })
      .where(eq(emailSubscribers.email, email))
      .returning();
    return subscriber || undefined;
  }

  // Certificates
  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId));
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const [certificate] = await db.insert(certificates).values(insertCertificate).returning();
    return certificate;
  }

  // Initialize default data
  async initializeData(): Promise<void> {
    // Initialize default feature flags
    const defaultFeatureFlags = [
      { name: 'ENABLE_V2', description: 'Enable the v2 platform features', isEnabled: true },
      { name: 'ENABLE_LEARNING_MODULES', description: 'Enable learning modules features', isEnabled: true },
      { name: 'ENABLE_QUIZZES', description: 'Enable quiz features', isEnabled: true },
      { name: 'ENABLE_DICTIONARY', description: 'Enable the trade dictionary', isEnabled: true },
      { name: 'ENABLE_DAILY_CHALLENGES', description: 'Enable daily challenges', isEnabled: true },
      { name: 'ENABLE_BADGES', description: 'Enable badges and achievements', isEnabled: true },
      { name: 'ENABLE_CERTIFICATES', description: 'Enable completion certificates', isEnabled: true },
      { name: 'ENABLE_TRADE_AGREEMENTS', description: 'Enable trade agreements database', isEnabled: true },
      { name: 'ENABLE_USER_PROGRESS', description: 'Enable user progress tracking', isEnabled: true },
      { name: 'ENABLE_SOCIAL_SHARING', description: 'Enable social media sharing', isEnabled: false },
      { name: 'ENABLE_EMAIL_SUBSCRIPTION', description: 'Enable email subscription features', isEnabled: true },
    ];

    for (const flag of defaultFeatureFlags) {
      const existing = await this.getFeatureFlag(flag.name);
      if (!existing) {
        await this.createFeatureFlag(flag);
      }
    }

    // Initialize default feature access for different user roles
    const features = [
      'LEARNING_MODULES',
      'QUIZZES',
      'DICTIONARY',
      'DAILY_CHALLENGES',
      'BADGES',
      'CERTIFICATES',
      'TRADE_AGREEMENTS',
      'USER_PROGRESS',
    ];

    const roles = ['admin', 'editor', 'premium', 'basic'] as const;

    for (const feature of features) {
      for (const role of roles) {
        // Admins and editors get access to everything
        // Premium users get access to everything 
        // Basic users get access to basic features only
        const isEnabled = 
          role === 'admin' || 
          role === 'editor' || 
          role === 'premium' || 
          (role === 'basic' && 
            (feature === 'LEARNING_MODULES' || 
             feature === 'DICTIONARY' ||
             feature === 'DAILY_CHALLENGES'));

        await this.setFeatureAccess(feature, role, isEnabled);
      }
    }
  }
}

// Create a singleton instance
export const storage = new DatabaseStorage();