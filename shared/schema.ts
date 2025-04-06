import { pgTable, text, serial, integer, boolean, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (kept from original but extended)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isSubscribed: boolean("is_subscribed").default(false),
  role: text("role").default("user")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isSubscribed: true,
});

// Product Categories
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  primaryCountries: jsonb("primary_countries").$type<string[]>(),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).pick({
  name: true,
  description: true,
  primaryCountries: true,
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").notNull(),
  originCountry: text("origin_country"),
  currentPrice: numeric("current_price"),
  estimatedIncrease: numeric("estimated_increase"),
  impactLevel: text("impact_level"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  categoryId: true,
  originCountry: true,
  currentPrice: true,
  estimatedIncrease: true,
  impactLevel: true,
});

// Countries with tariff rates
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  baseTariff: numeric("base_tariff").notNull(),
  reciprocalTariff: numeric("reciprocal_tariff").notNull(),
  effectiveDate: text("effective_date"),
});

export const insertCountrySchema = createInsertSchema(countries).pick({
  name: true,
  baseTariff: true,
  reciprocalTariff: true,
  effectiveDate: true,
});

// Feature flags
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isEnabled: boolean("is_enabled").default(false),
  description: text("description"),
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).pick({
  name: true,
  isEnabled: true,
  description: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;
