import {
  users, type User, type InsertUser,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  countries, type Country, type InsertCountry,
  featureFlags, type FeatureFlag, type InsertFeatureFlag
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { IStorage } from "./storage";

// Database-backed storage implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize the database asynchronously
    this.initializeData().catch(err => {
      console.error("Failed to initialize database:", err);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product Category methods
  async getProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories);
  }

  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    const results = await db.select().from(productCategories).where(eq(productCategories.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createProductCategory(insertCategory: InsertProductCategory): Promise<ProductCategory> {
    const [category] = await db.insert(productCategories).values(insertCategory).returning();
    return category;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const results = await db.select().from(products).where(eq(products.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Country methods
  async getCountries(): Promise<Country[]> {
    return await db.select().from(countries);
  }

  async getCountryByName(name: string): Promise<Country | undefined> {
    const results = await db.select().from(countries).where(eq(countries.name, name));
    return results.length > 0 ? results[0] : undefined;
  }

  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const [country] = await db.insert(countries).values(insertCountry).returning();
    return country;
  }

  // Feature Flag methods
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return await db.select().from(featureFlags);
  }

  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    const results = await db.select().from(featureFlags).where(eq(featureFlags.name, name));
    return results.length > 0 ? results[0] : undefined;
  }

  async createFeatureFlag(insertFeatureFlag: InsertFeatureFlag): Promise<FeatureFlag> {
    const [featureFlag] = await db.insert(featureFlags).values(insertFeatureFlag).returning();
    return featureFlag;
  }

  async updateFeatureFlag(name: string, isEnabled: boolean): Promise<FeatureFlag | undefined> {
    const results = await db.select().from(featureFlags).where(eq(featureFlags.name, name));
    if (results.length === 0) return undefined;
    
    const [updatedFlag] = await db
      .update(featureFlags)
      .set({ isEnabled })
      .where(eq(featureFlags.name, name))
      .returning();
    
    return updatedFlag;
  }

  // Initialize data if needed
  async initializeData() {
    try {
      console.log('Checking if database needs initialization...');
      
      // Check if we already have data
      const result = await db.select({
        count: sql<number>`count(*)`,
      }).from(featureFlags);
      
      if (result.length > 0 && result[0].count > 0) {
        console.log('Database already contains data, skipping initialization');
        return;
      }

      console.log('Initializing database with seed data');

      // Create categories
      const electronics = await this.createProductCategory({
        name: "Electronics",
        description: "Consumer electronics and gadgets",
        primaryCountries: ["China", "South Korea", "Japan"]
      });

      const clothing = await this.createProductCategory({
        name: "Clothing & Apparel",
        description: "Clothing, footwear, and accessories",
        primaryCountries: ["Vietnam", "Bangladesh", "China"]
      });

      const toys = await this.createProductCategory({
        name: "Toys & Games",
        description: "Children's toys and games",
        primaryCountries: ["China", "Vietnam", "Mexico"]
      });

      const furniture = await this.createProductCategory({
        name: "Furniture & Home Goods",
        description: "Home furniture and decorative items",
        primaryCountries: ["China", "Vietnam", "Mexico"]
      });

      const food = await this.createProductCategory({
        name: "Food & Beverages",
        description: "Imported food products and beverages",
        primaryCountries: ["Mexico", "Canada", "EU"]
      });

      // Create countries with correct numeric types
      await this.createCountry({
        name: "China",
        baseTariff: 10,
        reciprocalTariff: 45,
        effectiveDate: "April 9, 2025",
        impactLevel: "High"
      });

      await this.createCountry({
        name: "Vietnam",
        baseTariff: 10,
        reciprocalTariff: 25,
        effectiveDate: "April 9, 2025",
        impactLevel: "Medium"
      });

      await this.createCountry({
        name: "Mexico",
        baseTariff: 10,
        reciprocalTariff: 15,
        effectiveDate: "April 9, 2025",
        impactLevel: "Medium-Low"
      });

      await this.createCountry({
        name: "Canada",
        baseTariff: 10,
        reciprocalTariff: 10,
        effectiveDate: "April 9, 2025",
        impactLevel: "Low"
      });

      await this.createCountry({
        name: "South Korea",
        baseTariff: 10,
        reciprocalTariff: 30,
        effectiveDate: "April 9, 2025",
        impactLevel: "Medium-High"
      });

      await this.createCountry({
        name: "Japan",
        baseTariff: 10,
        reciprocalTariff: 25,
        effectiveDate: "April 9, 2025",
        impactLevel: "Medium"
      });

      await this.createCountry({
        name: "EU",
        baseTariff: 10,
        reciprocalTariff: 20,
        effectiveDate: "April 9, 2025",
        impactLevel: "Medium"
      });

      await this.createCountry({
        name: "Bangladesh",
        baseTariff: 10,
        reciprocalTariff: 15,
        effectiveDate: "April 9, 2025",
        impactLevel: "Low"
      });

      await this.createCountry({
        name: "India",
        baseTariff: 10,
        reciprocalTariff: 35,
        effectiveDate: "April 9, 2025",
        impactLevel: "Medium-High"
      });

      await this.createCountry({
        name: "Brazil",
        baseTariff: 10,
        reciprocalTariff: 20,
        effectiveDate: "April 9, 2025",
        impactLevel: "Medium"
      });

      // Create products
      await this.createProduct({
        name: "Smartphones",
        description: "Mobile phones and accessories",
        categoryId: electronics.id,
        originCountry: "China",
        currentPrice: 899,
        estimatedIncrease: 40.5,
        impactLevel: "High"
      });

      await this.createProduct({
        name: "Laptops",
        description: "Portable computers",
        categoryId: electronics.id,
        originCountry: "China",
        currentPrice: 1200,
        estimatedIncrease: 54,
        impactLevel: "High"
      });

      await this.createProduct({
        name: "TVs",
        description: "Televisions and home entertainment",
        categoryId: electronics.id,
        originCountry: "South Korea",
        currentPrice: 750,
        estimatedIncrease: 22.5,
        impactLevel: "Medium"
      });

      await this.createProduct({
        name: "T-Shirts",
        description: "Casual cotton shirts",
        categoryId: clothing.id,
        originCountry: "Bangladesh",
        currentPrice: 15,
        estimatedIncrease: 1.5,
        impactLevel: "Low"
      });

      await this.createProduct({
        name: "Jeans",
        description: "Denim pants",
        categoryId: clothing.id,
        originCountry: "Vietnam",
        currentPrice: 45,
        estimatedIncrease: 6.75,
        impactLevel: "Medium"
      });

      await this.createProduct({
        name: "Action Figures",
        description: "Collectible toys",
        categoryId: toys.id,
        originCountry: "China",
        currentPrice: 25,
        estimatedIncrease: 11.25,
        impactLevel: "High"
      });

      await this.createProduct({
        name: "Board Games",
        description: "Family board games",
        categoryId: toys.id,
        originCountry: "China",
        currentPrice: 35,
        estimatedIncrease: 15.75,
        impactLevel: "High"
      });

      await this.createProduct({
        name: "Sofas",
        description: "Living room furniture",
        categoryId: furniture.id,
        originCountry: "Vietnam",
        currentPrice: 899,
        estimatedIncrease: 134.85,
        impactLevel: "Medium"
      });

      await this.createProduct({
        name: "Coffee Tables",
        description: "Living room tables",
        categoryId: furniture.id,
        originCountry: "China",
        currentPrice: 250,
        estimatedIncrease: 112.5,
        impactLevel: "High"
      });

      await this.createProduct({
        name: "Imported Chocolates",
        description: "Premium chocolate assortments",
        categoryId: food.id,
        originCountry: "EU",
        currentPrice: 12,
        estimatedIncrease: 1.8,
        impactLevel: "Medium"
      });

      await this.createProduct({
        name: "Imported Cheese",
        description: "Specialty cheeses",
        categoryId: food.id,
        originCountry: "EU",
        currentPrice: 15,
        estimatedIncrease: 2.25,
        impactLevel: "Medium"
      });

      await this.createProduct({
        name: "Imported Wines",
        description: "Premium wines",
        categoryId: food.id,
        originCountry: "EU",
        currentPrice: 35,
        estimatedIncrease: 5.25,
        impactLevel: "Medium"
      });

      // Create feature flags
      await this.createFeatureFlag({
        name: "productFiltering",
        isEnabled: true,
        description: "Enables product filtering functionality"
      });

      await this.createFeatureFlag({
        name: "calculator",
        isEnabled: true,
        description: "Enables the tariff calculator tool"
      });

      await this.createFeatureFlag({
        name: "authentication",
        isEnabled: false,
        description: "Enables user authentication features"
      });

      await this.createFeatureFlag({
        name: "emailAlerts",
        isEnabled: true,
        description: "Enables email alert signup functionality"
      });

      await this.createFeatureFlag({
        name: "alternativeProducts",
        isEnabled: false,
        description: "Enables alternative product recommendations"
      });

      console.log('Database initialization complete');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
}