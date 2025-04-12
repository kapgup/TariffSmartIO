import { eq, sql, like, and, or, desc, asc } from 'drizzle-orm';
import { db } from './db';
import {
  users, User, InsertUser,
  modules, Module, InsertModule,
  quizzes, Quiz, InsertQuiz,
  quizQuestions, QuizQuestion, InsertQuizQuestion,
  quizOptions, QuizOption, InsertQuizOption,
  userModuleProgress, UserModuleProgress,
  userQuizProgress, UserQuizProgress,
  dictionaryTerms, DictionaryTerm, InsertDictionaryTerm,
  tradeAgreements, TradeAgreement, InsertTradeAgreement,
  dailyChallenges, DailyChallenge, InsertDailyChallenge,
  challengeCompletions, ChallengeCompletion, InsertChallengeCompletion,
  badges, Badge, InsertBadge,
  userBadges, UserBadge, InsertUserBadge,
  certificates, Certificate, InsertCertificate,
  featureFlags, FeatureFlag, InsertFeatureFlag,
  featureAccess, FeatureAccess, InsertFeatureAccess,
  emailSubscribers, EmailSubscriber, InsertEmailSubscriber,
  userRoleEnum, completionStatusEnum, tradeAgreementStatusEnum, emailSubscriberStatusEnum
} from '../shared/schema';

/**
 * Storage class for the v2 platform
 * Handles all database interactions
 */
export class DatabaseStorage {
  /**
   * Get a user by ID
   */
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Get a user by email
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  /**
   * Get a user by Google ID
   */
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  /**
   * Create a new user
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  /**
   * Update a user's role
   */
  async updateUserRole(userId: number, role: "admin" | "editor" | "premium" | "basic"): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  /**
   * Get modules with optional filtering
   */
  async getModules(options?: { category?: string; published?: boolean; }): Promise<Module[]> {
    let query = db.select().from(modules);

    if (options?.category) {
      query = query.where(eq(modules.category, options.category as any));
    }

    if (options?.published !== undefined) {
      query = query.where(eq(modules.published, options.published));
    }

    return await query.orderBy(desc(modules.createdAt));
  }

  /**
   * Get a module by ID
   */
  async getModuleById(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  /**
   * Get a module by slug
   */
  async getModuleBySlug(slug: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.slug, slug));
    return module;
  }

  /**
   * Create a new module
   */
  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(insertModule).returning();
    return module;
  }

  /**
   * Update a module
   */
  async updateModule(id: number, moduleData: Partial<InsertModule>): Promise<Module | undefined> {
    const [module] = await db
      .update(modules)
      .set({ ...moduleData, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return module;
  }

  /**
   * Get quizzes with optional filtering
   */
  async getQuizzes(options?: { moduleId?: number; published?: boolean }): Promise<Quiz[]> {
    let query = db.select().from(quizzes);

    if (options?.moduleId !== undefined) {
      query = query.where(eq(quizzes.moduleId, options.moduleId));
    }

    if (options?.published !== undefined) {
      query = query.where(eq(quizzes.published, options.published));
    }

    return await query.orderBy(desc(quizzes.createdAt));
  }

  /**
   * Get a quiz by ID
   */
  async getQuizById(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  /**
   * Get a quiz by slug
   */
  async getQuizBySlug(slug: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.slug, slug));
    return quiz;
  }

  /**
   * Create a new quiz
   */
  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }

  /**
   * Update a quiz
   */
  async updateQuiz(id: number, quizData: Partial<InsertQuiz>): Promise<Quiz | undefined> {
    const [quiz] = await db
      .update(quizzes)
      .set({ ...quizData, updatedAt: new Date() })
      .where(eq(quizzes.id, id))
      .returning();
    return quiz;
  }

  /**
   * Get questions for a quiz
   */
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));
  }

  /**
   * Get a quiz question by ID
   */
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, id));
    return question;
  }

  /**
   * Create a new quiz question
   */
  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db
      .insert(quizQuestions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  /**
   * Get options for a quiz question
   */
  async getQuizOptions(questionId: number): Promise<QuizOption[]> {
    return await db
      .select()
      .from(quizOptions)
      .where(eq(quizOptions.questionId, questionId));
  }

  /**
   * Create a new quiz option
   */
  async createQuizOption(insertOption: InsertQuizOption): Promise<QuizOption> {
    const [option] = await db
      .insert(quizOptions)
      .values(insertOption)
      .returning();
    return option;
  }

  /**
   * Get a user's progress for a module
   */
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

  /**
   * Get all module progress for a user
   */
  async getUserModuleProgressByUser(userId: number): Promise<UserModuleProgress[]> {
    return await db
      .select()
      .from(userModuleProgress)
      .where(eq(userModuleProgress.userId, userId));
  }

  /**
   * Create user module progress
   */
  async createUserModuleProgress(insertProgress: {
    userId: number;
    moduleId: number;
    status?: "not_started" | "in_progress" | "completed";
    progress?: number;
    currentSection?: number;
    startedAt?: Date;
    completedAt?: Date;
    lastAccessedAt?: Date;
  }): Promise<UserModuleProgress> {
    const [progress] = await db
      .insert(userModuleProgress)
      .values({
        ...insertProgress,
        status: insertProgress.status || 'not_started',
        progress: insertProgress.progress || 0,
        currentSection: insertProgress.currentSection || 0,
        startedAt: insertProgress.startedAt || new Date(),
        lastAccessedAt: insertProgress.lastAccessedAt || new Date(),
      })
      .returning();
    return progress;
  }

  /**
   * Update user module progress
   */
  async updateUserModuleProgress(
    userId: number,
    moduleId: number,
    data: Partial<{
      status: "not_started" | "in_progress" | "completed";
      progress: number;
      currentSection: number;
      completedAt: Date;
      lastAccessedAt: Date;
    }>
  ): Promise<UserModuleProgress | undefined> {
    const [progress] = await db
      .update(userModuleProgress)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.moduleId, moduleId)
        )
      )
      .returning();
    return progress;
  }

  /**
   * Get a user's progress for a quiz
   */
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

  /**
   * Get all quiz progress for a user
   */
  async getUserQuizProgressByUser(userId: number): Promise<UserQuizProgress[]> {
    return await db
      .select()
      .from(userQuizProgress)
      .where(eq(userQuizProgress.userId, userId));
  }

  /**
   * Create user quiz progress
   */
  async createUserQuizProgress(insertProgress: {
    userId: number;
    quizId: number;
    score?: number;
    attempts?: number;
    completed?: boolean;
    lastAttemptAt?: Date;
    responses?: any;
  }): Promise<UserQuizProgress> {
    const [progress] = await db
      .insert(userQuizProgress)
      .values({
        userId: insertProgress.userId,
        quizId: insertProgress.quizId,
        score: insertProgress.score,
        attempts: insertProgress.attempts || 0,
        completed: insertProgress.completed || false,
        lastAttemptAt: insertProgress.lastAttemptAt,
        responses: insertProgress.responses,
      })
      .returning();
    return progress;
  }

  /**
   * Update user quiz progress
   */
  async updateUserQuizProgress(
    userId: number,
    quizId: number,
    data: Partial<{
      score: number;
      attempts: number;
      completed: boolean;
      lastAttemptAt: Date;
      responses: any;
    }>
  ): Promise<UserQuizProgress | undefined> {
    const [progress] = await db
      .update(userQuizProgress)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userQuizProgress.userId, userId),
          eq(userQuizProgress.quizId, quizId)
        )
      )
      .returning();
    return progress;
  }

  /**
   * Get dictionary terms with optional filtering
   */
  async getDictionaryTerms(options?: { category?: string; searchQuery?: string }): Promise<DictionaryTerm[]> {
    let query = db.select().from(dictionaryTerms);

    if (options?.category) {
      query = query.where(eq(dictionaryTerms.category, options.category as any));
    }

    if (options?.searchQuery) {
      query = query.where(
        or(
          like(dictionaryTerms.name, `%${options.searchQuery}%`),
          like(dictionaryTerms.definition, `%${options.searchQuery}%`)
        )
      );
    }

    return await query.orderBy(asc(dictionaryTerms.name));
  }

  /**
   * Get a dictionary term by ID
   */
  async getDictionaryTermById(id: number): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .select()
      .from(dictionaryTerms)
      .where(eq(dictionaryTerms.id, id));
    return term;
  }

  /**
   * Get a dictionary term by slug
   */
  async getDictionaryTermBySlug(slug: string): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .select()
      .from(dictionaryTerms)
      .where(eq(dictionaryTerms.slug, slug));
    return term;
  }

  /**
   * Create a new dictionary term
   */
  async createDictionaryTerm(insertTerm: InsertDictionaryTerm): Promise<DictionaryTerm> {
    const [term] = await db
      .insert(dictionaryTerms)
      .values(insertTerm)
      .returning();
    return term;
  }

  /**
   * Update a dictionary term
   */
  async updateDictionaryTerm(id: number, termData: Partial<InsertDictionaryTerm>): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .update(dictionaryTerms)
      .set({
        ...termData,
        updatedAt: new Date(),
      })
      .where(eq(dictionaryTerms.id, id))
      .returning();
    return term;
  }

  /**
   * Increment view count for a dictionary term
   */
  async incrementDictionaryTermViewCount(id: number): Promise<DictionaryTerm | undefined> {
    const [term] = await db
      .update(dictionaryTerms)
      .set({
        viewCount: sql`${dictionaryTerms.viewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(dictionaryTerms.id, id))
      .returning();
    return term;
  }

  /**
   * Get trade agreements with optional filtering
   */
  async getTradeAgreements(options?: { status?: "active" | "expired" | "proposed" | "renegotiating"; searchQuery?: string }): Promise<TradeAgreement[]> {
    let query = db.select().from(tradeAgreements);

    if (options?.status) {
      query = query.where(eq(tradeAgreements.status, options.status as any));
    }

    if (options?.searchQuery) {
      query = query.where(
        or(
          like(tradeAgreements.name, `%${options.searchQuery}%`),
          like(tradeAgreements.description, `%${options.searchQuery}%`)
        )
      );
    }

    return await query.orderBy(desc(tradeAgreements.effectiveDate));
  }

  /**
   * Get a trade agreement by ID
   */
  async getTradeAgreementById(id: number): Promise<TradeAgreement | undefined> {
    const [agreement] = await db
      .select()
      .from(tradeAgreements)
      .where(eq(tradeAgreements.id, id));
    return agreement;
  }

  /**
   * Get a trade agreement by slug
   */
  async getTradeAgreementBySlug(slug: string): Promise<TradeAgreement | undefined> {
    const [agreement] = await db
      .select()
      .from(tradeAgreements)
      .where(eq(tradeAgreements.slug, slug));
    return agreement;
  }

  /**
   * Create a new trade agreement
   */
  async createTradeAgreement(insertAgreement: InsertTradeAgreement): Promise<TradeAgreement> {
    const [agreement] = await db
      .insert(tradeAgreements)
      .values(insertAgreement)
      .returning();
    return agreement;
  }

  /**
   * Update a trade agreement
   */
  async updateTradeAgreement(id: number, agreementData: Partial<InsertTradeAgreement>): Promise<TradeAgreement | undefined> {
    const [agreement] = await db
      .update(tradeAgreements)
      .set({
        ...agreementData,
        updatedAt: new Date(),
      })
      .where(eq(tradeAgreements.id, id))
      .returning();
    return agreement;
  }

  /**
   * Get all daily challenges
   */
  async getDailyChallenges(): Promise<DailyChallenge[]> {
    return await db
      .select()
      .from(dailyChallenges)
      .orderBy(desc(dailyChallenges.date));
  }

  /**
   * Get daily challenge for a specific date
   */
  async getDailyChallenge(date: Date = new Date()): Promise<DailyChallenge | undefined> {
    // Format the date to YYYY-MM-DD for proper comparison
    const formattedDate = date.toISOString().split('T')[0];
    const startOfDay = new Date(`${formattedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${formattedDate}T23:59:59.999Z`);

    const [challenge] = await db
      .select()
      .from(dailyChallenges)
      .where(
        and(
          sql`${dailyChallenges.date} >= ${startOfDay}`,
          sql`${dailyChallenges.date} <= ${endOfDay}`
        )
      );
    return challenge;
  }

  /**
   * Create a new daily challenge
   */
  async createDailyChallenge(insertChallenge: InsertDailyChallenge): Promise<DailyChallenge> {
    const [challenge] = await db
      .insert(dailyChallenges)
      .values(insertChallenge)
      .returning();
    return challenge;
  }

  /**
   * Get a challenge completion record
   */
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
    return completion;
  }

  /**
   * Get all challenge completions for a user
   */
  async getUserChallengeCompletions(userId: number): Promise<ChallengeCompletion[]> {
    return await db
      .select()
      .from(challengeCompletions)
      .where(eq(challengeCompletions.userId, userId))
      .orderBy(desc(challengeCompletions.completedAt));
  }

  /**
   * Create a challenge completion record
   */
  async createChallengeCompletion(insertCompletion: InsertChallengeCompletion): Promise<ChallengeCompletion> {
    const [completion] = await db
      .insert(challengeCompletions)
      .values(insertCompletion)
      .returning();
    return completion;
  }

  /**
   * Get all badges
   */
  async getBadges(): Promise<Badge[]> {
    return await db
      .select()
      .from(badges)
      .orderBy(asc(badges.name));
  }

  /**
   * Get a badge by ID
   */
  async getBadgeById(id: number): Promise<Badge | undefined> {
    const [badge] = await db
      .select()
      .from(badges)
      .where(eq(badges.id, id));
    return badge;
  }

  /**
   * Create a new badge
   */
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db
      .insert(badges)
      .values(insertBadge)
      .returning();
    return badge;
  }

  /**
   * Get all badges for a user
   */
  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.awardedAt));
  }

  /**
   * Get a specific user badge
   */
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
    return userBadge;
  }

  /**
   * Award a badge to a user
   */
  async awardBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const [userBadge] = await db
      .insert(userBadges)
      .values(insertUserBadge)
      .returning();
    return userBadge;
  }

  /**
   * Get all feature flags
   */
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return await db
      .select()
      .from(featureFlags)
      .orderBy(asc(featureFlags.name));
  }

  /**
   * Get a feature flag by name
   */
  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    const [flag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.name, name));
    return flag;
  }

  /**
   * Create a new feature flag
   */
  async createFeatureFlag(insertFeatureFlag: InsertFeatureFlag): Promise<FeatureFlag> {
    const [flag] = await db
      .insert(featureFlags)
      .values(insertFeatureFlag)
      .returning();
    return flag;
  }

  /**
   * Update a feature flag
   */
  async updateFeatureFlag(name: string, isEnabled: boolean): Promise<FeatureFlag | undefined> {
    const [flag] = await db
      .update(featureFlags)
      .set({
        isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(featureFlags.name, name))
      .returning();
    return flag;
  }

  /**
   * Get feature access for a specific role
   */
  async getFeatureAccess(featureName: string, userRole: "admin" | "editor" | "premium" | "basic"): Promise<FeatureAccess | undefined> {
    const [access] = await db
      .select()
      .from(featureAccess)
      .where(
        and(
          eq(featureAccess.feature_name, featureName),
          eq(featureAccess.user_role, userRole as any)
        )
      );
    return access;
  }

  /**
   * Get all feature access settings
   */
  async getAllFeatureAccess(): Promise<FeatureAccess[]> {
    return await db.select().from(featureAccess);
  }

  /**
   * Set feature access for a role
   */
  async setFeatureAccess(
    featureName: string,
    userRole: "admin" | "editor" | "premium" | "basic",
    isEnabled: boolean
  ): Promise<FeatureAccess> {
    // Try to find existing access
    const existingAccess = await this.getFeatureAccess(featureName, userRole);

    if (existingAccess) {
      const [access] = await db
        .update(featureAccess)
        .set({
          isEnabled,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(featureAccess.feature_name, featureName),
            eq(featureAccess.user_role, userRole as any)
          )
        )
        .returning();
      return access;
    } else {
      const [access] = await db
        .insert(featureAccess)
        .values({
          feature_name: featureName,
          user_role: userRole as any,
          isEnabled,
        })
        .returning();
      return access;
    }
  }

  /**
   * Get all email subscribers
   */
  async getEmailSubscribers(): Promise<EmailSubscriber[]> {
    return await db
      .select()
      .from(emailSubscribers)
      .orderBy(desc(emailSubscribers.createdAt));
  }

  /**
   * Get an email subscriber
   */
  async getEmailSubscriber(email: string): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(emailSubscribers)
      .where(eq(emailSubscribers.email, email));
    return subscriber;
  }

  /**
   * Create a new email subscriber
   */
  async createEmailSubscriber(insertSubscriber: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const [subscriber] = await db
      .insert(emailSubscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  /**
   * Update an email subscriber's status
   */
  async updateEmailSubscriberStatus(
    email: string,
    status: "pending" | "subscribed" | "unsubscribed"
  ): Promise<EmailSubscriber | undefined> {
    const updates: any = {
      status,
      updatedAt: new Date(),
    };

    // Add date fields based on status
    if (status === "subscribed") {
      updates.subscribedAt = new Date();
    } else if (status === "unsubscribed") {
      updates.unsubscribedAt = new Date();
    }

    const [subscriber] = await db
      .update(emailSubscribers)
      .set(updates)
      .where(eq(emailSubscribers.email, email))
      .returning();
    return subscriber;
  }

  /**
   * Get certificates for a user
   */
  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issuedAt));
  }

  /**
   * Create a certificate
   */
  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const [certificate] = await db
      .insert(certificates)
      .values(insertCertificate)
      .returning();
    return certificate;
  }

  /**
   * Initialize default data
   */
  async initializeData(): Promise<void> {
    // Check if there are any feature flags
    const existingFlags = await this.getFeatureFlags();
    
    if (existingFlags.length === 0) {
      // Create default feature flags
      const defaultFlags = [
        { name: 'enableModules', isEnabled: true, description: 'Enable learning modules feature' },
        { name: 'enableQuizzes', isEnabled: true, description: 'Enable quizzes feature' },
        { name: 'enableDictionary', isEnabled: true, description: 'Enable trade dictionary feature' },
        { name: 'enableAgreements', isEnabled: true, description: 'Enable trade agreements feature' },
        { name: 'enableChallenges', isEnabled: true, description: 'Enable daily challenges feature' },
        { name: 'enableBadges', isEnabled: true, description: 'Enable badges and achievements feature' },
        { name: 'enableCertificates', isEnabled: true, description: 'Enable certificates feature' },
        { name: 'enableGoogleAuth', isEnabled: true, description: 'Enable Google authentication' },
        { name: 'enableRegistration', isEnabled: true, description: 'Enable user registration' },
      ];
      
      for (const flag of defaultFlags) {
        await this.createFeatureFlag(flag);
      }
      
      // Set default access for each role
      const roles: ("admin" | "editor" | "premium" | "basic")[] = ['admin', 'editor', 'premium', 'basic'];
      
      for (const flag of defaultFlags) {
        for (const role of roles) {
          const isEnabled = role === 'admin' || role === 'editor' || 
                          (role === 'premium' && ['enableCertificates', 'enableBadges'].includes(flag.name));
          
          await this.setFeatureAccess(flag.name, role, isEnabled);
        }
      }
    }
  }
}

// Create and export a singleton instance of the storage class
export const storage = new DatabaseStorage();