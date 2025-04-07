import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductCategorySchema, insertProductSchema, insertCountrySchema, insertFeatureFlagSchema, insertUserSchema } from "@shared/schema";
import { isAuthenticated, hasRole, isAdmin, isPremium, getCurrentUser } from "./auth/middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - all prefixed with /api
  
  // Countries
  app.get("/api/countries", async (_req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json({ countries });
    } catch (error) {
      res.status(500).json({ message: "Error fetching countries", error: (error as Error).message });
    }
  });
  
  app.get("/api/countries/:name", async (req, res) => {
    try {
      const country = await storage.getCountryByName(req.params.name);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json({ country });
    } catch (error) {
      res.status(500).json({ message: "Error fetching country", error: (error as Error).message });
    }
  });
  
  // Product Categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getProductCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Error fetching product categories", error: (error as Error).message });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getProductCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json({ category });
    } catch (error) {
      res.status(500).json({ message: "Error fetching category", error: (error as Error).message });
    }
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        const products = await storage.getProductsByCategory(categoryId);
        return res.json({ products });
      }
      
      const products = await storage.getProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error: (error as Error).message });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ product });
    } catch (error) {
      res.status(500).json({ message: "Error fetching product", error: (error as Error).message });
    }
  });
  
  // Feature Flags
  app.get("/api/feature-flags", async (_req, res) => {
    try {
      const flags = await storage.getFeatureFlags();
      res.json({ flags });
    } catch (error) {
      res.status(500).json({ message: "Error fetching feature flags", error: (error as Error).message });
    }
  });
  
  app.get("/api/feature-flags/:name", async (req, res) => {
    try {
      const flag = await storage.getFeatureFlag(req.params.name);
      if (!flag) {
        return res.status(404).json({ message: "Feature flag not found" });
      }
      
      res.json({ flag });
    } catch (error) {
      res.status(500).json({ message: "Error fetching feature flag", error: (error as Error).message });
    }
  });
  
  // Tariff Calculator API
  app.post("/api/calculate-tariff-impact", async (req, res) => {
    try {
      const schema = z.object({
        items: z.array(z.object({
          category: z.string(),
          amount: z.number().positive(),
          country: z.string()
        }))
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
      }
      
      const { items } = result.data;
      const calculations = [];
      let totalSpending = 0;
      let totalIncrease = 0;
      
      for (const item of items) {
        const country = await storage.getCountryByName(item.country);
        if (!country) {
          calculations.push({
            category: item.category,
            amount: item.amount,
            country: item.country,
            increase: 0,
            error: "Country not found"
          });
          continue;
        }
        
        totalSpending += item.amount;
        const tariffRate = Number(country.baseTariff) + Number(country.reciprocalTariff);
        const increase = (item.amount * tariffRate) / 100;
        totalIncrease += increase;
        
        calculations.push({
          category: item.category,
          amount: item.amount,
          country: item.country,
          originalTariff: Number(country.baseTariff),
          reciprocalTariff: Number(country.reciprocalTariff),
          totalTariff: tariffRate,
          increase: increase.toFixed(2)
        });
      }
      
      res.json({
        calculations,
        totalSpending,
        totalIncrease: totalIncrease.toFixed(2),
        percentageIncrease: totalSpending > 0 ? ((totalIncrease / totalSpending) * 100).toFixed(2) : 0
      });
    } catch (error) {
      res.status(500).json({ message: "Error calculating tariff impact", error: (error as Error).message });
    }
  });

  // User profile - authenticated only
  app.get("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      // Return the user profile (password is already excluded from the User type)
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile", error: (error as Error).message });
    }
  });

  // Save user calculations - authenticated only
  app.post("/api/user/save-calculation", isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({
        calculationData: z.object({
          items: z.array(z.object({
            category: z.string(),
            amount: z.number(),
            country: z.string()
          })),
          totalSpending: z.number(),
          totalIncrease: z.string(),
          percentageIncrease: z.string()
        }),
        name: z.string()
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
      }
      
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // In a real implementation, we would save this to the database
      // For now, just return a success response
      res.json({ 
        success: true, 
        message: "Calculation saved successfully",
        savedCalculation: {
          id: Math.floor(Math.random() * 1000),
          userId: user.id,
          name: result.data.name,
          data: result.data.calculationData,
          createdAt: new Date()
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error saving calculation", error: (error as Error).message });
    }
  });

  // Admin only - update feature flag
  app.patch("/api/admin/feature-flags/:name", isAdmin, async (req, res) => {
    try {
      const { name } = req.params;
      const schema = z.object({
        isEnabled: z.boolean()
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
      }
      
      const updatedFlag = await storage.updateFeatureFlag(name, result.data.isEnabled);
      if (!updatedFlag) {
        return res.status(404).json({ message: "Feature flag not found" });
      }
      
      res.json({ flag: updatedFlag, message: "Feature flag updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating feature flag", error: (error as Error).message });
    }
  });

  // Premium user - detailed tariff analysis
  app.post("/api/premium/detailed-analysis", isPremium, async (req, res) => {
    try {
      const schema = z.object({
        items: z.array(z.object({
          category: z.string(),
          amount: z.number().positive(),
          country: z.string()
        }))
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
      }
      
      const { items } = result.data;
      const calculations = [];
      let totalSpending = 0;
      let totalIncrease = 0;
      
      for (const item of items) {
        const country = await storage.getCountryByName(item.country);
        if (!country) {
          calculations.push({
            category: item.category,
            amount: item.amount,
            country: item.country,
            increase: 0,
            error: "Country not found"
          });
          continue;
        }
        
        totalSpending += item.amount;
        const tariffRate = Number(country.baseTariff) + Number(country.reciprocalTariff);
        const increase = (item.amount * tariffRate) / 100;
        totalIncrease += increase;
        
        // Enhanced premium analysis with more details
        calculations.push({
          category: item.category,
          amount: item.amount,
          country: item.country,
          originalTariff: Number(country.baseTariff),
          reciprocalTariff: Number(country.reciprocalTariff),
          totalTariff: tariffRate,
          increase: increase.toFixed(2),
          priceImpact: (increase / item.amount * 100).toFixed(2) + "%",
          effectiveDate: country.effectiveDate,
          estimatedRetailImpact: (increase * 1.3).toFixed(2), // 30% markup for retail estimation
          alternativeSources: ["Alternate source data would be here"],
          forecastedTrends: ["Trend analysis would be here"]
        });
      }
      
      res.json({
        calculations,
        totalSpending,
        totalIncrease: totalIncrease.toFixed(2),
        percentageIncrease: totalSpending > 0 ? ((totalIncrease / totalSpending) * 100).toFixed(2) : 0,
        premiumInsights: {
          monthlyProjection: (totalIncrease * 12).toFixed(2),
          marketAnalysis: "Detailed market analysis would be here",
          industryTrends: ["Industry trend data would be here"],
          alternativeSuppliers: ["Alternative supplier data would be here"]
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error calculating detailed analysis", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
