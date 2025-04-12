import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users for v2 platform
export const users = pgTable("v2_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  displayName: text("display_name"),
  profilePicture: text("profile_picture"),
  googleId: text("google_id").unique(),
  role: text("role", { enum: ["admin", "editor", "premium", "basic"] }).notNull().default("basic"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  displayName: true,
  profilePicture: true,
  googleId: true,
  role: true
});

// Feature flags for the v2 platform
export const featureFlags = pgTable("v2_feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isEnabled: boolean("is_enabled").notNull().default(true),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).pick({
  name: true,
  isEnabled: true,
  description: true
});

// Learning modules
export const learningModules = pgTable("v2_learning_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedMinutes: integer("estimated_minutes").notNull(),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).pick({
  title: true,
  slug: true,
  description: true,
  content: true,
  category: true,
  difficulty: true,
  estimatedMinutes: true,
  featured: true,
  order: true
});

// Quizzes for learning modules
export const quizzes = pgTable("v2_quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  passingScore: integer("passing_score").notNull().default(70),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  moduleId: true,
  title: true,
  description: true,
  passingScore: true
});

// Quiz questions
export const quizQuestions = pgTable("v2_quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  question: text("question").notNull(),
  type: text("type").notNull(), // multiple-choice, true-false
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  quizId: true,
  question: true,
  type: true,
  order: true
});

// Quiz answers
export const quizAnswers = pgTable("v2_quiz_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull(),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswers).pick({
  questionId: true,
  text: true,
  isCorrect: true,
  explanation: true,
  order: true
});

// Dictionary entries
export const dictionaryTerms = pgTable("v2_dictionary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  slug: text("slug").notNull().unique(),
  definition: text("definition").notNull(),
  category: text("category").notNull(),
  examples: text("examples").array(), // Examples of the term in use
  relatedTerms: text("related_terms").array(), // Related term slugs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertDictionaryTermSchema = createInsertSchema(dictionaryTerms).pick({
  term: true,
  slug: true,
  definition: true,
  category: true,
  examples: true,
  relatedTerms: true
});

// User progress tracking
export const userProgress = pgTable("v2_user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  quizScore: integer("quiz_score"),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  moduleId: true,
  completed: true,
  quizScore: true,
  lastAccessed: true
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;

export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type QuizAnswer = typeof quizAnswers.$inferSelect;

export type InsertDictionaryTerm = z.infer<typeof insertDictionaryTermSchema>;
export type DictionaryTerm = typeof dictionaryTerms.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;