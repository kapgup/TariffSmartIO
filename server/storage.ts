import { 
  users, type User, type InsertUser,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  countries, type Country, type InsertCountry,
  featureFlags, type FeatureFlag, type InsertFeatureFlag,
  subscriptions, type Subscription, type InsertSubscription,
  featureAccess, type FeatureAccess, type InsertFeatureAccess,
  emailSubscribers, type EmailSubscriber, type InsertEmailSubscriber
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
  
  currentUserId: number;
  currentProductCategoryId: number;
  currentProductId: number;
  currentCountryId: number;
  currentFeatureFlagId: number;
  currentSubscriptionId: number;
  currentFeatureAccessId: number;

  currentEmailSubscriberId: number;

  constructor() {
    this.users = new Map();
    this.productCategories = new Map();
    this.products = new Map();
    this.countries = new Map();
    this.featureFlags = new Map();
    this.subscriptions = new Map();
    this.featureAccessList = new Map();
    this.emailSubscribers = new Map();
    
    this.currentUserId = 1;
    this.currentProductCategoryId = 1;
    this.currentProductId = 1;
    this.currentCountryId = 1;
    this.currentFeatureFlagId = 1;
    this.currentSubscriptionId = 1;
    this.currentFeatureAccessId = 1;
    this.currentEmailSubscriberId = 1;
    
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
}

// Import DatabaseStorage implementation
import { DatabaseStorage } from './database-storage';

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
