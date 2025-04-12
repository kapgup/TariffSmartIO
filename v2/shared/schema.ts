import { pgTable, serial, text, timestamp, boolean, integer, uuid, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Learning Modules
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  content: text("content").notNull(), // JSON content of the module
  estimatedMinutes: integer("estimated_minutes").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id),
  title: text("title").notNull(),
  description: text("description"),
  isStandalone: boolean("is_standalone").default(false), // If true, not associated with a module
  type: text("type").notNull(), // "multiple-choice", "true-false", "myth-vs-fact"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(), // JSON array of options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"), // Explanation for the answer
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Dictionary Terms
export const dictionaryTerms = pgTable("dictionary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull().unique(),
  definition: text("definition").notNull(),
  category: text("category"), // Optional category for grouping
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDictionaryTermSchema = createInsertSchema(dictionaryTerms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Trade Agreement Summaries
export const tradeAgreements = pgTable("trade_agreements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  keyPoints: json("key_points"), // JSON array of key points
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTradeAgreementSchema = createInsertSchema(tradeAgreements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User Progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to user id
  moduleId: integer("module_id").references(() => modules.id),
  quizId: integer("quiz_id").references(() => quizzes.id),
  completed: boolean("completed").default(false),
  score: integer("score"), // For quizzes
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Dictionary Term Views (for gamification)
export const dictionaryViews = pgTable("dictionary_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to user id
  termId: integer("term_id").references(() => dictionaryTerms.id).notNull(),
  viewCount: integer("view_count").default(1).notNull(),
  lastViewedAt: timestamp("last_viewed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDictionaryViewSchema = createInsertSchema(dictionaryViews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Daily Challenge
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  type: text("type").notNull(), // "term", "quiz", etc.
  content: json("content").notNull(), // Content depends on the type
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({
  id: true,
  createdAt: true,
});

// User Challenge Completions
export const challengeCompletions = pgTable("challenge_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to user id
  challengeId: integer("challenge_id").references(() => dailyChallenges.id).notNull(),
  completed: boolean("completed").default(true).notNull(),
  score: integer("score"), // Optional score if applicable
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertChallengeCompletionSchema = createInsertSchema(challengeCompletions).omit({
  id: true,
});

// Interactive Simulations
export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // Type of simulation
  config: json("config").notNull(), // Configuration for the simulation
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type DictionaryTerm = typeof dictionaryTerms.$inferSelect;
export type InsertDictionaryTerm = z.infer<typeof insertDictionaryTermSchema>;

export type TradeAgreement = typeof tradeAgreements.$inferSelect;
export type InsertTradeAgreement = z.infer<typeof insertTradeAgreementSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type DictionaryView = typeof dictionaryViews.$inferSelect;
export type InsertDictionaryView = z.infer<typeof insertDictionaryViewSchema>;

export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;

export type ChallengeCompletion = typeof challengeCompletions.$inferSelect;
export type InsertChallengeCompletion = z.infer<typeof insertChallengeCompletionSchema>;

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;