import { pgTable, text, serial, integer, boolean, numeric, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
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

// ------------------- V2 Schema for Educational Content -------------------

// Learning modules for v2
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(), // Can hold HTML or markdown content
  orderIndex: integer("order_index").notNull().default(0),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).pick({
  title: true,
  slug: true,
  description: true,
  content: true,
  orderIndex: true,
  imageUrl: true,
  isPublished: true,
});

// Module quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default("knowledge_check"), // knowledge_check, myth_vs_fact, simulation_quiz
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  moduleId: true,
  title: true,
  description: true,
  type: true,
  isPublished: true,
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  question: text("question").notNull(),
  questionType: text("question_type").notNull().default("multiple_choice"), // multiple_choice, true_false, simulation
  orderIndex: integer("order_index").notNull().default(0),
  explanation: text("explanation"), // Explanation shown after answering
  options: jsonb("options"), // Array of options for multiple choice
  correctAnswer: text("correct_answer"), // For simple quiz types
  simulationData: jsonb("simulation_data"), // For simulation-type questions
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  quizId: true,
  question: true,
  questionType: true,
  orderIndex: true,
  explanation: true,
  options: true,
  correctAnswer: true,
  simulationData: true,
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  isCompleted: boolean("is_completed").default(false),
  lastActivityDate: timestamp("last_activity_date").defaultNow(),
  progress: numeric("progress").default("0"), // Percentage of completion (0-100)
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  moduleId: true,
  isCompleted: true,
  progress: true,
});

// Quiz attempts and scores
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quizId: integer("quiz_id").notNull(),
  score: numeric("score"), // Percentage score 
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  completedDate: timestamp("completed_date").defaultNow().notNull(),
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).pick({
  userId: true,
  quizId: true,
  score: true,
  totalQuestions: true,
  correctAnswers: true,
});

// Trade terminology dictionary
export const tradeDictionary = pgTable("trade_dictionary", {
  id: serial("id").primaryKey(),
  term: varchar("term", { length: 100 }).notNull().unique(),
  definition: text("definition").notNull(),
  category: text("category"), // e.g., "tariffs", "agreements", "policies"
  usageExample: text("usage_example"),
  relatedTerms: jsonb("related_terms").$type<string[]>(), // Array of related term IDs
  complexity: text("complexity").default("beginner"), // beginner, intermediate, advanced
});

export const insertTradeDictionarySchema = createInsertSchema(tradeDictionary).pick({
  term: true,
  definition: true,
  category: true,
  usageExample: true,
  relatedTerms: true,
  complexity: true,
});

// Trade agreements and principles (for Explorer)
export const tradeAgreements = pgTable("trade_agreements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  shortName: text("short_name"), // Acronym or abbreviated form
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  countries: jsonb("countries").$type<string[]>(), // Involved countries
  establishedDate: text("established_date"),
  keyPrinciples: jsonb("key_principles"), // Array of key principles
  impactSummary: text("impact_summary"),
});

export const insertTradeAgreementSchema = createInsertSchema(tradeAgreements).pick({
  name: true,
  shortName: true,
  summary: true,
  description: true,
  countries: true,
  establishedDate: true,
  keyPrinciples: true,
  impactSummary: true,
});

// Types for v2 schema
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

export type InsertTradeDictionary = z.infer<typeof insertTradeDictionarySchema>;
export type TradeDictionary = typeof tradeDictionary.$inferSelect;

export type InsertTradeAgreement = z.infer<typeof insertTradeAgreementSchema>;
export type TradeAgreement = typeof tradeAgreements.$inferSelect;
