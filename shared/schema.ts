import { pgTable, text, serial, integer, boolean, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Email subscribers
export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").default("active").notNull(), // "active", "unsubscribed"
  source: text("source"), // where the subscriber signed up (e.g., "homepage", "calculator")
  createdAt: timestamp("created_at").defaultNow().notNull(),
  gdprConsent: boolean("gdpr_consent").default(true), // GDPR compliance
  consentTimestamp: timestamp("consent_timestamp").defaultNow(),
  ipAddress: text("ip_address"), // Store for compliance records
});

export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).pick({
  email: true,
  source: true, 
  gdprConsent: true,
  ipAddress: true,
});

// User schema with OAuth and role-based fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"), // Can be null for OAuth users
  email: text("email"),
  googleId: text("google_id").unique(), // For Google OAuth
  displayName: text("display_name"),    // From Google profile
  profilePicture: text("profile_picture"), // Profile picture URL
  isSubscribed: boolean("is_subscribed").default(false),
  role: text("role").default("user").notNull(), // "anonymous", "user", "premium", "editor", "admin"
  subscriptionTier: text("subscription_tier"), // null, "basic", "premium"
  subscriptionExpiration: timestamp("subscription_expiration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  googleId: true,
  displayName: true,
  profilePicture: true,
  isSubscribed: true,
  role: true,
});

// Subscriptions table for premium features
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  plan: text("plan").notNull(), // "basic", "premium"
  status: text("status").notNull(), // "active", "cancelled", "expired"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  autoRenew: boolean("auto_renew").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  plan: true,
  status: true,
  startDate: true,
  endDate: true,
  autoRenew: true,
});

// Feature access control
export const featureAccess = pgTable("feature_access", {
  id: serial("id").primaryKey(),
  featureName: text("feature_name").notNull(),
  userRole: text("user_role").notNull(), // "anonymous", "user", "premium", "editor", "admin"
  isEnabled: boolean("is_enabled").default(false),
});

export const insertFeatureAccessSchema = createInsertSchema(featureAccess).pick({
  featureName: true,
  userRole: true,
  isEnabled: true,
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
  impactLevel: text("impact_level"),
});

export const insertCountrySchema = createInsertSchema(countries).pick({
  name: true,
  baseTariff: true,
  reciprocalTariff: true,
  effectiveDate: true,
  impactLevel: true,
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
export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertFeatureAccess = z.infer<typeof insertFeatureAccessSchema>;
export type FeatureAccess = typeof featureAccess.$inferSelect;

export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;
