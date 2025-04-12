import { 
  users, type User, type InsertUser,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  countries, type Country, type InsertCountry,
  featureFlags, type FeatureFlag, type InsertFeatureFlag,
  subscriptions, type Subscription, type InsertSubscription,
  featureAccess, type FeatureAccess, type InsertFeatureAccess,
  emailSubscribers, type EmailSubscriber, type InsertEmailSubscriber,
  // v2 imports
  learningModules, type LearningModule, type InsertLearningModule,
  quizzes, type Quiz, type InsertQuiz,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion,
  userProgress, type UserProgress, type InsertUserProgress,
  quizAttempts, type QuizAttempt, type InsertQuizAttempt,
  tradeDictionary, type TradeDictionary, type InsertTradeDictionary,
  tradeAgreements, type TradeAgreement, type InsertTradeAgreement
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: number, role: string): Promise<User | undefined>;
  updateUserSubscription(userId: number, tier: string | null, expirationDate: Date | null): Promise<User | undefined>;
  
  // Subscriptions
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  getUserSubscriptions(userId: number): Promise<Subscription[]>;
  updateSubscriptionStatus(id: number, status: string): Promise<Subscription | undefined>;
  
  // Email Subscribers
  getEmailSubscribers(): Promise<EmailSubscriber[]>;
  getEmailSubscriber(email: string): Promise<EmailSubscriber | undefined>;
  createEmailSubscriber(subscriber: InsertEmailSubscriber): Promise<EmailSubscriber>;
  updateEmailSubscriberStatus(email: string, status: string): Promise<EmailSubscriber | undefined>;
  
  // Feature Access
  getFeatureAccess(featureName: string, userRole: string): Promise<FeatureAccess | undefined>;
  getAllFeatureAccess(): Promise<FeatureAccess[]>;
  setFeatureAccess(featureName: string, userRole: string, isEnabled: boolean): Promise<FeatureAccess>;
  
  // Product Categories
  getProductCategories(): Promise<ProductCategory[]>;
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Countries
  getCountries(): Promise<Country[]>;
  getCountryByName(name: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  
  // Feature Flags
  getFeatureFlags(): Promise<FeatureFlag[]>;
  getFeatureFlag(name: string): Promise<FeatureFlag | undefined>;
  createFeatureFlag(featureFlag: InsertFeatureFlag): Promise<FeatureFlag>;
  updateFeatureFlag(name: string, isEnabled: boolean): Promise<FeatureFlag | undefined>;

  // V2 Learning Modules
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: number): Promise<LearningModule | undefined>;
  getLearningModuleBySlug(slug: string): Promise<LearningModule | undefined>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;
  updateLearningModule(id: number, module: Partial<InsertLearningModule>): Promise<LearningModule | undefined>;
  
  // V2 Quizzes
  getQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizzesByModule(moduleId: number): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined>;
  
  // V2 Quiz Questions
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  updateQuizQuestion(id: number, question: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined>;
  
  // V2 User Progress
  getUserProgress(userId: number, moduleId: number): Promise<UserProgress | undefined>;
  getUserProgressForAllModules(userId: number): Promise<UserProgress[]>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // V2 Quiz Attempts
  getQuizAttempts(userId: number, quizId: number): Promise<QuizAttempt[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  
  // V2 Trade Dictionary
  getTradeDictionaryTerms(): Promise<TradeDictionary[]>;
  getTradeDictionaryTerm(id: number): Promise<TradeDictionary | undefined>;
  getTradeDictionaryTermByName(term: string): Promise<TradeDictionary | undefined>;
  createTradeDictionaryTerm(term: InsertTradeDictionary): Promise<TradeDictionary>;
  updateTradeDictionaryTerm(id: number, term: Partial<InsertTradeDictionary>): Promise<TradeDictionary | undefined>;
  
  // V2 Trade Agreements
  getTradeAgreements(): Promise<TradeAgreement[]>;
  getTradeAgreement(id: number): Promise<TradeAgreement | undefined>;
  getTradeAgreementByName(name: string): Promise<TradeAgreement | undefined>;
  createTradeAgreement(agreement: InsertTradeAgreement): Promise<TradeAgreement>;
  updateTradeAgreement(id: number, agreement: Partial<InsertTradeAgreement>): Promise<TradeAgreement | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private productCategories: Map<number, ProductCategory>;
  private products: Map<number, Product>;
  private countries: Map<number, Country>;
  private featureFlags: Map<number, FeatureFlag>;
  private subscriptions: Map<number, Subscription>;
  private featureAccessList: Map<number, FeatureAccess>;
  private emailSubscribers: Map<number, EmailSubscriber>;
  // v2 storage
  private learningModules: Map<number, LearningModule>;
  private quizzes: Map<number, Quiz>;
  private quizQuestions: Map<number, QuizQuestion>;
  private userProgressList: Map<string, UserProgress>;
  private quizAttempts: Map<number, QuizAttempt>;
  private tradeDictionary: Map<number, TradeDictionary>;
  private tradeAgreements: Map<number, TradeAgreement>;
  
  currentUserId: number;
  currentProductCategoryId: number;
  currentProductId: number;
  currentCountryId: number;
  currentFeatureFlagId: number;
  currentSubscriptionId: number;
  currentFeatureAccessId: number;
  currentEmailSubscriberId: number;
  // v2 IDs
  currentLearningModuleId: number;
  currentQuizId: number;
  currentQuizQuestionId: number;
  currentQuizAttemptId: number;
  currentTradeDictionaryId: number;
  currentTradeAgreementId: number;

  constructor() {
    this.users = new Map<number, User>();
    this.productCategories = new Map<number, ProductCategory>();
    this.products = new Map<number, Product>();
    this.countries = new Map<number, Country>();
    this.featureFlags = new Map<number, FeatureFlag>();
    this.subscriptions = new Map<number, Subscription>();
    this.featureAccessList = new Map<number, FeatureAccess>();
    this.emailSubscribers = new Map<number, EmailSubscriber>();
    // Initialize v2 storage
    this.learningModules = new Map<number, LearningModule>();
    this.quizzes = new Map<number, Quiz>();
    this.quizQuestions = new Map<number, QuizQuestion>();
    this.userProgressList = new Map<string, UserProgress>();
    this.quizAttempts = new Map<number, QuizAttempt>();
    this.tradeDictionary = new Map<number, TradeDictionary>();
    this.tradeAgreements = new Map<number, TradeAgreement>();
    
    this.currentUserId = 1;
    this.currentProductCategoryId = 1;
    this.currentProductId = 1;
    this.currentCountryId = 1;
    this.currentFeatureFlagId = 1;
    this.currentSubscriptionId = 1;
    this.currentFeatureAccessId = 1;
    this.currentEmailSubscriberId = 1;
    // Initialize v2 IDs
    this.currentLearningModuleId = 1;
    this.currentQuizId = 1;
    this.currentQuizQuestionId = 1;
    this.currentQuizAttemptId = 1;
    this.currentTradeDictionaryId = 1;
    this.currentTradeAgreementId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add countries with tariff information
    const countryData: InsertCountry[] = [
      { name: "China", baseTariff: "10", reciprocalTariff: "50", effectiveDate: "April 9, 2025", impactLevel: "High" },
      { name: "European Union", baseTariff: "10", reciprocalTariff: "25", effectiveDate: "April 9, 2025", impactLevel: "Medium" },
      { name: "Mexico", baseTariff: "10", reciprocalTariff: "20", effectiveDate: "April 9, 2025", impactLevel: "Medium-Low" },
      { name: "Canada", baseTariff: "10", reciprocalTariff: "15", effectiveDate: "April 9, 2025", impactLevel: "Low" },
      { name: "Japan", baseTariff: "10", reciprocalTariff: "30", effectiveDate: "April 9, 2025", impactLevel: "Medium" },
      { name: "Vietnam", baseTariff: "10", reciprocalTariff: "15", effectiveDate: "April 9, 2025", impactLevel: "Medium" },
      { name: "South Korea", baseTariff: "10", reciprocalTariff: "25", effectiveDate: "April 9, 2025", impactLevel: "Medium-High" },
      { name: "Germany", baseTariff: "10", reciprocalTariff: "25", effectiveDate: "April 9, 2025", impactLevel: "Medium" },
      { name: "Bangladesh", baseTariff: "10", reciprocalTariff: "10", effectiveDate: "April 9, 2025", impactLevel: "Low" },
    ];
    
    countryData.forEach(country => this.createCountry(country));
    
    // Add product categories
    const categories: InsertProductCategory[] = [
      { name: "Electronics", description: "Electronic devices, components, and accessories", primaryCountries: ["China", "Japan", "South Korea", "Vietnam"] },
      { name: "Clothing & Apparel", description: "Fashion items, shoes, accessories, and sportswear", primaryCountries: ["China", "Vietnam", "Bangladesh"] },
      { name: "Furniture & Home Goods", description: "Home furniture, office furniture, and decor items", primaryCountries: ["China", "Vietnam", "Mexico"] },
      { name: "Food & Beverages", description: "Imported foods, wines, spirits, and specialty items", primaryCountries: ["European Union", "Mexico", "Canada"] },
      { name: "Automotive", description: "Cars, trucks, SUVs and automotive parts", primaryCountries: ["Japan", "Germany", "Mexico"] }
    ];
    
    categories.forEach(category => this.createProductCategory(category));
    
    // Add products
    const productData: InsertProduct[] = [
      { name: "Smartphones", description: "Mobile phones, smartphones, and related accessories", categoryId: 1, originCountry: "China", currentPrice: "699", estimatedIncrease: "20", impactLevel: "high" },
      { name: "Televisions", description: "TVs, smart displays, and home entertainment systems", categoryId: 1, originCountry: "Mexico", currentPrice: "499", estimatedIncrease: "15", impactLevel: "medium" },
      { name: "Clothing & Apparel", description: "Fashion items, shoes, accessories, and sportswear", categoryId: 2, originCountry: "Vietnam", currentPrice: "0", estimatedIncrease: "15", impactLevel: "medium" },
      { name: "Automobiles", description: "Cars, trucks, SUVs and automotive parts", categoryId: 5, originCountry: "Japan", currentPrice: "35000", estimatedIncrease: "20", impactLevel: "high" },
      { name: "Furniture", description: "Home furniture, office furniture, and decor items", categoryId: 3, originCountry: "China", currentPrice: "0", estimatedIncrease: "20", impactLevel: "medium" },
      { name: "Food & Beverages", description: "Imported foods, wines, spirits, and specialty items", categoryId: 4, originCountry: "European Union", currentPrice: "0", estimatedIncrease: "11", impactLevel: "low" }
    ];
    
    productData.forEach(product => this.createProduct(product));
    
    // Add feature flags
    const featureFlags: InsertFeatureFlag[] = [
      { name: "productFiltering", isEnabled: true, description: "Enable filtering of products by category, country, etc." },
      { name: "tariffCalculator", isEnabled: true, description: "Enable the tariff impact calculator" },
      { name: "authentication", isEnabled: false, description: "Enable user authentication" },
      { name: "emailAlerts", isEnabled: false, description: "Enable email alerts for tariff changes" },
      { name: "alternativeProducts", isEnabled: false, description: "Enable alternative product recommendations" }
    ];
    
    featureFlags.forEach(flag => this.createFeatureFlag(flag));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // Add default values for new fields and ensure all required fields are properly set
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password || null,
      email: insertUser.email || null,
      googleId: insertUser.googleId || null,
      displayName: insertUser.displayName || null,
      profilePicture: insertUser.profilePicture || null,
      isSubscribed: insertUser.isSubscribed || false,
      role: insertUser.role || "user",
      subscriptionTier: null,
      subscriptionExpiration: null,
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId
    );
  }
  
  async updateUserRole(userId: number, role: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (user) {
      const updatedUser = { ...user, role };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }
  
  async updateUserSubscription(userId: number, tier: string | null, expirationDate: Date | null): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (user) {
      const updatedUser = { 
        ...user, 
        subscriptionTier: tier,
        subscriptionExpiration: expirationDate
      };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }
  
  // Subscription methods
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const newSubscription: Subscription = { 
      id,
      userId: subscription.userId,
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate || null,
      autoRenew: subscription.autoRenew || null,
      createdAt: new Date()
    };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }
  
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }
  
  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.userId === userId
    );
  }
  
  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription | undefined> {
    const subscription = await this.getSubscription(id);
    if (subscription) {
      const updatedSubscription = { ...subscription, status };
      this.subscriptions.set(id, updatedSubscription);
      return updatedSubscription;
    }
    return undefined;
  }
  
  // Feature access methods
  async getFeatureAccess(featureName: string, userRole: string): Promise<FeatureAccess | undefined> {
    return Array.from(this.featureAccessList.values()).find(
      (access) => access.featureName === featureName && access.userRole === userRole
    );
  }
  
  async getAllFeatureAccess(): Promise<FeatureAccess[]> {
    return Array.from(this.featureAccessList.values());
  }
  
  async setFeatureAccess(featureName: string, userRole: string, isEnabled: boolean): Promise<FeatureAccess> {
    const existingAccess = await this.getFeatureAccess(featureName, userRole);
    
    if (existingAccess) {
      const updatedAccess = { ...existingAccess, isEnabled };
      this.featureAccessList.set(existingAccess.id, updatedAccess);
      return updatedAccess;
    }
    
    // Create new feature access entry
    const id = this.currentFeatureAccessId++;
    const newAccess: FeatureAccess = { id, featureName, userRole, isEnabled };
    this.featureAccessList.set(id, newAccess);
    return newAccess;
  }
  
  // Product Category methods
  async getProductCategories(): Promise<ProductCategory[]> {
    return Array.from(this.productCategories.values());
  }
  
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    return this.productCategories.get(id);
  }
  
  async createProductCategory(insertCategory: InsertProductCategory): Promise<ProductCategory> {
    const id = this.currentProductCategoryId++;
    
    // Convert primaryCountries to proper string[] or null
    let primaryCountries: string[] | null = null;
    if (insertCategory.primaryCountries) {
      // Make sure it's array of strings
      if (Array.isArray(insertCategory.primaryCountries)) {
        primaryCountries = [...insertCategory.primaryCountries];
      } else if (typeof insertCategory.primaryCountries === 'object') {
        // Handle case when it's an object with numeric keys
        primaryCountries = Object.values(insertCategory.primaryCountries as Record<string, string>);
      }
    }
    
    const category: ProductCategory = { 
      id,
      name: insertCategory.name,
      description: insertCategory.description || null,
      primaryCountries
    };
    this.productCategories.set(id, category);
    return category;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      id,
      name: insertProduct.name,
      categoryId: insertProduct.categoryId,
      description: insertProduct.description || null,
      originCountry: insertProduct.originCountry || null,
      currentPrice: insertProduct.currentPrice || null,
      estimatedIncrease: insertProduct.estimatedIncrease || null,
      impactLevel: insertProduct.impactLevel || null
    };
    this.products.set(id, product);
    return product;
  }
  
  // Country methods
  async getCountries(): Promise<Country[]> {
    return Array.from(this.countries.values());
  }
  
  async getCountryByName(name: string): Promise<Country | undefined> {
    return Array.from(this.countries.values()).find(
      (country) => country.name === name,
    );
  }
  
  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const id = this.currentCountryId++;
    const country: Country = { 
      id,
      name: insertCountry.name,
      baseTariff: insertCountry.baseTariff,
      reciprocalTariff: insertCountry.reciprocalTariff,
      effectiveDate: insertCountry.effectiveDate || null,
      impactLevel: insertCountry.impactLevel || null
    };
    this.countries.set(id, country);
    return country;
  }
  
  // Feature Flag methods
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return Array.from(this.featureFlags.values());
  }
  
  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    return Array.from(this.featureFlags.values()).find(
      (flag) => flag.name === name,
    );
  }
  
  async createFeatureFlag(insertFeatureFlag: InsertFeatureFlag): Promise<FeatureFlag> {
    const id = this.currentFeatureFlagId++;
    const featureFlag: FeatureFlag = { 
      id,
      name: insertFeatureFlag.name,
      isEnabled: insertFeatureFlag.isEnabled || false,
      description: insertFeatureFlag.description || null
    };
    this.featureFlags.set(id, featureFlag);
    return featureFlag;
  }
  
  async updateFeatureFlag(name: string, isEnabled: boolean): Promise<FeatureFlag | undefined> {
    const featureFlag = await this.getFeatureFlag(name);
    if (featureFlag) {
      const updatedFlag = { ...featureFlag, isEnabled };
      this.featureFlags.set(featureFlag.id, updatedFlag);
      return updatedFlag;
    }
    return undefined;
  }
  
  // Email Subscriber methods
  async getEmailSubscribers(): Promise<EmailSubscriber[]> {
    return Array.from(this.emailSubscribers.values());
  }
  
  async getEmailSubscriber(email: string): Promise<EmailSubscriber | undefined> {
    return Array.from(this.emailSubscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }
  
  async createEmailSubscriber(insertSubscriber: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const id = this.currentEmailSubscriberId++;
    const subscriber: EmailSubscriber = {
      id,
      email: insertSubscriber.email,
      status: "active",
      source: insertSubscriber.source || null,
      createdAt: new Date(),
      gdprConsent: insertSubscriber.gdprConsent || true,
      consentTimestamp: new Date(),
      ipAddress: insertSubscriber.ipAddress || null
    };
    this.emailSubscribers.set(id, subscriber);
    return subscriber;
  }
  
  async updateEmailSubscriberStatus(email: string, status: string): Promise<EmailSubscriber | undefined> {
    const subscriber = await this.getEmailSubscriber(email);
    if (subscriber) {
      const updatedSubscriber = { ...subscriber, status };
      this.emailSubscribers.set(subscriber.id, updatedSubscriber);
      return updatedSubscriber;
    }
    return undefined;
  }

  // V2 Learning Modules methods
  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values());
  }
  
  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }
  
  async getLearningModuleBySlug(slug: string): Promise<LearningModule | undefined> {
    return Array.from(this.learningModules.values()).find(
      (module) => module.slug === slug
    );
  }
  
  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const id = this.currentLearningModuleId++;
    const learningModule: LearningModule = {
      id,
      title: module.title,
      slug: module.slug,
      description: module.description,
      content: module.content,
      orderIndex: module.orderIndex || 0,
      imageUrl: module.imageUrl || null,
      isPublished: module.isPublished !== undefined ? module.isPublished : false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.learningModules.set(id, learningModule);
    return learningModule;
  }
  
  async updateLearningModule(id: number, module: Partial<InsertLearningModule>): Promise<LearningModule | undefined> {
    const existingModule = await this.getLearningModule(id);
    if (!existingModule) return undefined;
    
    const updatedModule: LearningModule = {
      ...existingModule,
      ...module,
      updatedAt: new Date()
    };
    this.learningModules.set(id, updatedModule);
    return updatedModule;
  }
  
  // V2 Quizzes methods
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }
  
  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }
  
  async getQuizzesByModule(moduleId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.moduleId === moduleId
    );
  }
  
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const newQuiz: Quiz = {
      id,
      moduleId: quiz.moduleId,
      title: quiz.title,
      description: quiz.description || null,
      type: quiz.type || "knowledge_check",
      isPublished: quiz.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }
  
  async updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined> {
    const existingQuiz = await this.getQuiz(id);
    if (!existingQuiz) return undefined;
    
    const updatedQuiz: Quiz = {
      ...existingQuiz,
      ...quiz,
      updatedAt: new Date()
    };
    this.quizzes.set(id, updatedQuiz);
    return updatedQuiz;
  }
  
  // V2 Quiz Questions methods
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(
      (question) => question.quizId === quizId
    );
  }
  
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    return this.quizQuestions.get(id);
  }
  
  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentQuizQuestionId++;
    const newQuestion: QuizQuestion = {
      id,
      quizId: question.quizId,
      question: question.question,
      questionType: question.questionType || "multiple_choice",
      orderIndex: question.orderIndex || 0,
      options: question.options || null,
      correctAnswer: question.correctAnswer || null,
      explanation: question.explanation || null,
      simulationData: question.simulationData || null
    };
    this.quizQuestions.set(id, newQuestion);
    return newQuestion;
  }
  
  async updateQuizQuestion(id: number, question: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined> {
    const existingQuestion = await this.getQuizQuestion(id);
    if (!existingQuestion) return undefined;
    
    const updatedQuestion: QuizQuestion = {
      ...existingQuestion,
      ...question,
      updatedAt: new Date()
    };
    this.quizQuestions.set(id, updatedQuestion);
    return updatedQuestion;
  }
  
  // V2 User Progress methods
  async getUserProgress(userId: number, moduleId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${moduleId}`;
    return this.userProgressList.get(key);
  }
  
  async getUserProgressForAllModules(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgressList.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  
  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const key = `${progress.userId}-${progress.moduleId}`;
    const existingProgress = await this.getUserProgress(progress.userId, progress.moduleId);
    
    if (existingProgress) {
      const updatedProgress: UserProgress = {
        ...existingProgress,
        ...progress,
        lastUpdated: new Date()
      };
      this.userProgressList.set(key, updatedProgress);
      return updatedProgress;
    } else {
      const newProgress: UserProgress = {
        userId: progress.userId,
        moduleId: progress.moduleId,
        completionStatus: progress.completionStatus || "not_started",
        completionPercentage: progress.completionPercentage || 0,
        lastPosition: progress.lastPosition || null,
        startDate: new Date(),
        lastUpdated: new Date()
      };
      this.userProgressList.set(key, newProgress);
      return newProgress;
    }
  }
  
  // V2 Quiz Attempts methods
  async getQuizAttempts(userId: number, quizId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      (attempt) => attempt.userId === userId && attempt.quizId === quizId
    );
  }
  
  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentQuizAttemptId++;
    const newAttempt: QuizAttempt = {
      id,
      userId: attempt.userId,
      quizId: attempt.quizId,
      score: attempt.score,
      answers: attempt.answers,
      completed: attempt.completed !== undefined ? attempt.completed : true,
      startTime: attempt.startTime || new Date(),
      endTime: attempt.endTime || new Date(),
      passed: attempt.passed !== undefined ? attempt.passed : false
    };
    this.quizAttempts.set(id, newAttempt);
    return newAttempt;
  }
  
  // V2 Trade Dictionary methods
  async getTradeDictionaryTerms(): Promise<TradeDictionary[]> {
    return Array.from(this.tradeDictionary.values());
  }
  
  async getTradeDictionaryTerm(id: number): Promise<TradeDictionary | undefined> {
    return this.tradeDictionary.get(id);
  }
  
  async getTradeDictionaryTermByName(term: string): Promise<TradeDictionary | undefined> {
    return Array.from(this.tradeDictionary.values()).find(
      (dictTerm) => dictTerm.term.toLowerCase() === term.toLowerCase()
    );
  }
  
  async createTradeDictionaryTerm(term: InsertTradeDictionary): Promise<TradeDictionary> {
    const id = this.currentTradeDictionaryId++;
    // Convert related terms from any array-like structure to proper string[]
    let relatedTerms: string[] | null = null;
    if (term.relatedTerms) {
      if (Array.isArray(term.relatedTerms)) {
        relatedTerms = [...term.relatedTerms];
      } else if (typeof term.relatedTerms === 'object') {
        relatedTerms = Object.values(term.relatedTerms as Record<string, string>);
      }
    }
    
    const newTerm: TradeDictionary = {
      id,
      term: term.term,
      definition: term.definition,
      category: term.category || null,
      usageExample: term.usageExample || null,
      relatedTerms: relatedTerms,
      complexity: term.complexity || "basic",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tradeDictionary.set(id, newTerm);
    return newTerm;
  }
  
  async updateTradeDictionaryTerm(id: number, term: Partial<InsertTradeDictionary>): Promise<TradeDictionary | undefined> {
    const existingTerm = await this.getTradeDictionaryTerm(id);
    if (!existingTerm) return undefined;
    
    // Convert related terms if needed
    let relatedTerms = existingTerm.relatedTerms;
    if (term.relatedTerms) {
      if (Array.isArray(term.relatedTerms)) {
        relatedTerms = [...term.relatedTerms];
      } else if (typeof term.relatedTerms === 'object') {
        relatedTerms = Object.values(term.relatedTerms as Record<string, string>);
      }
    }
    
    const updatedTerm: TradeDictionary = {
      ...existingTerm,
      ...term,
      relatedTerms,
      updatedAt: new Date()
    };
    this.tradeDictionary.set(id, updatedTerm);
    return updatedTerm;
  }
  
  // V2 Trade Agreements methods
  async getTradeAgreements(): Promise<TradeAgreement[]> {
    return Array.from(this.tradeAgreements.values());
  }
  
  async getTradeAgreement(id: number): Promise<TradeAgreement | undefined> {
    return this.tradeAgreements.get(id);
  }
  
  async getTradeAgreementByName(name: string): Promise<TradeAgreement | undefined> {
    return Array.from(this.tradeAgreements.values()).find(
      (agreement) => agreement.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  async createTradeAgreement(agreement: InsertTradeAgreement): Promise<TradeAgreement> {
    const id = this.currentTradeAgreementId++;
    
    // Convert countries from any array-like structure to proper string[]
    let countries: string[] | null = null;
    if (agreement.countries) {
      if (Array.isArray(agreement.countries)) {
        countries = [...agreement.countries];
      } else if (typeof agreement.countries === 'object') {
        countries = Object.values(agreement.countries as Record<string, string>);
      }
    }
    
    const newAgreement: TradeAgreement = {
      id,
      name: agreement.name,
      description: agreement.description,
      summary: agreement.summary,
      countries: countries,
      startDate: agreement.startDate || null,
      endDate: agreement.endDate || null,
      status: agreement.status || "active",
      impactSummary: agreement.impactSummary || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tradeAgreements.set(id, newAgreement);
    return newAgreement;
  }
  
  async updateTradeAgreement(id: number, agreement: Partial<InsertTradeAgreement>): Promise<TradeAgreement | undefined> {
    const existingAgreement = await this.getTradeAgreement(id);
    if (!existingAgreement) return undefined;
    
    // Convert countries if needed
    let countries = existingAgreement.countries;
    if (agreement.countries) {
      if (Array.isArray(agreement.countries)) {
        countries = [...agreement.countries];
      } else if (typeof agreement.countries === 'object') {
        countries = Object.values(agreement.countries as Record<string, string>);
      }
    }
    
    const updatedAgreement: TradeAgreement = {
      ...existingAgreement,
      ...agreement,
      countries,
      updatedAt: new Date()
    };
    this.tradeAgreements.set(id, updatedAgreement);
    return updatedAgreement;
  }
}

// Import DatabaseStorage implementation
import { DatabaseStorage } from './database-storage';

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
