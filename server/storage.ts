import { 
  users, type User, type InsertUser,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  countries, type Country, type InsertCountry,
  featureFlags, type FeatureFlag, type InsertFeatureFlag
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  
  currentUserId: number;
  currentProductCategoryId: number;
  currentProductId: number;
  currentCountryId: number;
  currentFeatureFlagId: number;

  constructor() {
    this.users = new Map();
    this.productCategories = new Map();
    this.products = new Map();
    this.countries = new Map();
    this.featureFlags = new Map();
    
    this.currentUserId = 1;
    this.currentProductCategoryId = 1;
    this.currentProductId = 1;
    this.currentCountryId = 1;
    this.currentFeatureFlagId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add countries with tariff information
    const countryData: InsertCountry[] = [
      { name: "China", baseTariff: 10, reciprocalTariff: 50, effectiveDate: "April 9, 2025" },
      { name: "European Union", baseTariff: 10, reciprocalTariff: 25, effectiveDate: "April 9, 2025" },
      { name: "Mexico", baseTariff: 10, reciprocalTariff: 20, effectiveDate: "April 9, 2025" },
      { name: "Canada", baseTariff: 10, reciprocalTariff: 15, effectiveDate: "April 9, 2025" },
      { name: "Japan", baseTariff: 10, reciprocalTariff: 30, effectiveDate: "April 9, 2025" },
      { name: "Vietnam", baseTariff: 10, reciprocalTariff: 15, effectiveDate: "April 9, 2025" },
      { name: "South Korea", baseTariff: 10, reciprocalTariff: 25, effectiveDate: "April 9, 2025" },
      { name: "Germany", baseTariff: 10, reciprocalTariff: 25, effectiveDate: "April 9, 2025" },
      { name: "Bangladesh", baseTariff: 10, reciprocalTariff: 10, effectiveDate: "April 9, 2025" },
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
      { name: "Smartphones", description: "Mobile phones, smartphones, and related accessories", categoryId: 1, originCountry: "China", currentPrice: 699, estimatedIncrease: 20, impactLevel: "high" },
      { name: "Televisions", description: "TVs, smart displays, and home entertainment systems", categoryId: 1, originCountry: "Mexico", currentPrice: 499, estimatedIncrease: 15, impactLevel: "medium" },
      { name: "Clothing & Apparel", description: "Fashion items, shoes, accessories, and sportswear", categoryId: 2, originCountry: "Vietnam", currentPrice: 0, estimatedIncrease: 15, impactLevel: "medium" },
      { name: "Automobiles", description: "Cars, trucks, SUVs and automotive parts", categoryId: 5, originCountry: "Japan", currentPrice: 35000, estimatedIncrease: 20, impactLevel: "high" },
      { name: "Furniture", description: "Home furniture, office furniture, and decor items", categoryId: 3, originCountry: "China", currentPrice: 0, estimatedIncrease: 20, impactLevel: "medium" },
      { name: "Food & Beverages", description: "Imported foods, wines, spirits, and specialty items", categoryId: 4, originCountry: "European Union", currentPrice: 0, estimatedIncrease: 11, impactLevel: "low" }
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const category: ProductCategory = { ...insertCategory, id };
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
    const product: Product = { ...insertProduct, id };
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
    const country: Country = { ...insertCountry, id };
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
    const featureFlag: FeatureFlag = { ...insertFeatureFlag, id };
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
}

// Import DatabaseStorage implementation
import { DatabaseStorage } from './database-storage';

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
