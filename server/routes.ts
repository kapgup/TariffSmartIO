import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductCategorySchema, insertProductSchema, insertCountrySchema, insertFeatureFlagSchema, insertUserSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
