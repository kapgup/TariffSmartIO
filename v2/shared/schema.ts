import { pgEnum, pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const difficultyEnum = pgEnum("difficulty", ["beginner", "intermediate", "advanced"]);
export const moduleStatusEnum = pgEnum("module_status", ["not_started", "in_progress", "completed"]);
export const quizTypeEnum = pgEnum("quiz_type", ["multiple_choice", "true_false", "fill_blank", "matching"]);
export const challengeTypeEnum = pgEnum("challenge_type", ["quiz", "flashcard", "matching", "true_false"]);
export const dictionaryCategoryEnum = pgEnum("dictionary_category", ["tariffs", "trade_policy", "shipping", "customs", "regulations", "agreements"]);
export const moduleCategoryEnum = pgEnum("module_category", ["tariffs", "trade_policy", "treaties", "customs", "shipping", "compliance"]);
export const agreementStatusEnum = pgEnum("agreement_status", ["active", "pending", "expired", "proposed"]);

// Modules
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  category: moduleCategoryEnum("category").notNull(),
  content: text("content").notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  title: true,
  description: true, 
  difficulty: true,
  estimatedMinutes: true,
  category: true,
  content: true,
  published: true,
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: quizTypeEnum("type").notNull(),
  moduleId: integer("module_id").references(() => modules.id),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  title: true,
  description: true,
  type: true,
  moduleId: true,
  published: true,
});

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON string array for multiple choice, or string for fill_blank
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  points: integer("points").notNull().default(1),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  quizId: true,
  question: true,
  options: true,
  correctAnswer: true,
  explanation: true,
  points: true,
  order: true,
});

// Dictionary Terms
export const dictionaryTerms = pgTable("dictionary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  category: dictionaryCategoryEnum("category").notNull(),
  example: text("example"),
  relatedTerms: text("related_terms"), // JSON string array
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDictionaryTermSchema = createInsertSchema(dictionaryTerms).pick({
  term: true,
  definition: true,
  category: true,
  example: true,
  relatedTerms: true,
});

// Daily Challenges
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: challengeTypeEnum("type").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  content: text("content").notNull(), // JSON string
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).pick({
  title: true,
  type: true,
  difficulty: true,
  content: true,
  date: true,
});

// Trade Agreements
export const tradeAgreements = pgTable("trade_agreements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  keyPoints: text("key_points").notNull(), // JSON string array
  countries: text("countries").notNull(), // JSON string array
  year: integer("year").notNull(),
  status: agreementStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTradeAgreementSchema = createInsertSchema(tradeAgreements).pick({
  name: true,
  shortDescription: true,
  fullDescription: true,
  keyPoints: true,
  countries: true,
  year: true,
  status: true,
});

// User Progress Tables
export const userModuleProgress = pgTable("user_module_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to users table in v1
  moduleId: integer("module_id").notNull().references(() => modules.id),
  status: moduleStatusEnum("status").notNull().default("not_started"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserModuleProgressSchema = createInsertSchema(userModuleProgress).pick({
  userId: true,
  moduleId: true,
  status: true,
  completedAt: true,
});

export const userQuizProgress = pgTable("user_quiz_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to users table in v1
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserQuizProgressSchema = createInsertSchema(userQuizProgress).pick({
  userId: true,
  quizId: true,
  score: true,
  completedAt: true,
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to users table in v1
  challengeId: integer("challenge_id").notNull().references(() => dailyChallenges.id),
  date: timestamp("date").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserChallengeProgressSchema = createInsertSchema(userChallengeProgress).pick({
  userId: true,
  challengeId: true,
  date: true,
  completedAt: true,
});

// Type exports
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertDictionaryTerm = z.infer<typeof insertDictionaryTermSchema>;
export type DictionaryTerm = typeof dictionaryTerms.$inferSelect;

export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;

export type InsertTradeAgreement = z.infer<typeof insertTradeAgreementSchema>;
export type TradeAgreement = typeof tradeAgreements.$inferSelect;

export type InsertUserModuleProgress = z.infer<typeof insertUserModuleProgressSchema>;
export type UserModuleProgress = typeof userModuleProgress.$inferSelect;

export type InsertUserQuizProgress = z.infer<typeof insertUserQuizProgressSchema>;
export type UserQuizProgress = typeof userQuizProgress.$inferSelect;

export type InsertUserChallengeProgress = z.infer<typeof insertUserChallengeProgressSchema>;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;