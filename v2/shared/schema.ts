import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  json,
  primaryKey,
  pgEnum,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum definitions
export const moduleCategoryEnum = pgEnum("module_category", [
  "tariffs",
  "trade_policy",
  "customs",
  "shipping",
  "regulations",
  "agreements",
]);

export const difficultyLevelEnum = pgEnum("difficulty_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const dictionaryCategoryEnum = pgEnum("dictionary_category", [
  "tariffs",
  "trade_policy",
  "customs",
  "shipping",
  "regulations",
  "agreements",
]);

export const quizTypeEnum = pgEnum("quiz_type", [
  "multiple_choice",
  "true_false",
  "matching",
  "short_answer",
]);

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "editor",
  "premium",
  "basic",
]);

export const progressStatusEnum = pgEnum("progress_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const agreementStatusEnum = pgEnum("agreement_status", [
  "active",
  "proposed",
  "expired",
  "renegotiating",
]);

export const challengeTypeEnum = pgEnum("challenge_type", [
  "quiz",
  "calculation",
  "case_study",
  "simulation",
]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  displayName: text("display_name"),
  role: userRoleEnum("role").default("basic").notNull(),
  googleId: text("google_id").unique(),
  profilePicture: text("profile_picture"),
  subscriptionTier: text("subscription_tier"),
  subscriptionExpiration: timestamp("subscription_expiration"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  moduleProgress: many(userModuleProgress),
  quizProgress: many(userQuizProgress),
  challengeCompletions: many(challengeCompletions),
}));

// Learning modules
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: moduleCategoryEnum("category").notNull(),
  difficulty: difficultyLevelEnum("difficulty").notNull(),
  duration: integer("duration").notNull(), // in minutes
  imageUrl: text("image_url"),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(false).notNull(),
  tags: text("tags").array(),
  estimatedCompletion: text("estimated_completion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const modulesRelations = relations(modules, ({ many, oneToMany }) => ({
  prerequisites: many(modulePrerequisites, { relationName: "module_prerequisites" }),
  requiredFor: many(modulePrerequisites, { relationName: "module_required_for" }),
  progress: many(userModuleProgress),
  quizzes: oneToMany(quizzes, { foreignKey: "moduleId" }),
}));

// Module prerequisites (many-to-many relation)
export const modulePrerequisites = pgTable("module_prerequisites", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  prerequisiteId: integer("prerequisite_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    unq: uniqueIndex("module_prerequisite_unq").on(table.moduleId, table.prerequisiteId),
  };
});

export const modulePrerequisitesRelations = relations(modulePrerequisites, ({ one }) => ({
  module: one(modules, {
    fields: [modulePrerequisites.moduleId],
    references: [modules.id],
    relationName: "module_prerequisites",
  }),
  prerequisite: one(modules, {
    fields: [modulePrerequisites.prerequisiteId],
    references: [modules.id],
    relationName: "module_required_for",
  }),
}));

// User progress on modules
export const userModuleProgress = pgTable("user_module_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  status: progressStatusEnum("status").default("not_started").notNull(),
  percentComplete: integer("percent_complete").default(0).notNull(),
  lastPosition: text("last_position"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("user_module_unq").on(table.userId, table.moduleId),
  };
});

export const userModuleProgressRelations = relations(userModuleProgress, ({ one }) => ({
  user: one(users, {
    fields: [userModuleProgress.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [userModuleProgress.moduleId],
    references: [modules.id],
  }),
}));

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  moduleId: integer("module_id").references(() => modules.id, { onDelete: "set null" }),
  difficulty: difficultyLevelEnum("difficulty").notNull(),
  passingScore: integer("passing_score").default(70).notNull(),
  duration: integer("duration"), // in minutes, optional
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  module: one(modules, {
    fields: [quizzes.moduleId],
    references: [modules.id],
  }),
  questions: many(quizQuestions),
  progress: many(userQuizProgress),
}));

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  type: quizTypeEnum("type").default("multiple_choice").notNull(),
  explanation: text("explanation"),
  imageUrl: text("image_url"),
  difficulty: difficultyLevelEnum("difficulty").default("beginner").notNull(),
  points: integer("points").default(1).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
  options: many(quizOptions),
}));

// Quiz question options
export const quizOptions = pgTable("quiz_options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  order: integer("order").default(0).notNull(),
});

export const quizOptionsRelations = relations(quizOptions, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizOptions.questionId],
    references: [quizQuestions.id],
  }),
}));

// User quiz progress
export const userQuizProgress = pgTable("user_quiz_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  attempted: boolean("attempted").default(false).notNull(),
  completed: boolean("completed").default(false).notNull(),
  score: integer("score"),
  attempts: integer("attempts").default(0).notNull(),
  bestScore: integer("best_score"),
  answers: json("answers").$type<Record<number, number | number[]>>(),
  lastAttemptAt: timestamp("last_attempt_at"),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent"), // in seconds
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("user_quiz_unq").on(table.userId, table.quizId),
  };
});

export const userQuizProgressRelations = relations(userQuizProgress, ({ one }) => ({
  user: one(users, {
    fields: [userQuizProgress.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [userQuizProgress.quizId],
    references: [quizzes.id],
  }),
}));

// Dictionary terms
export const dictionaryTerms = pgTable("dictionary_terms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  definition: text("definition").notNull(),
  category: dictionaryCategoryEnum("category").notNull(),
  context: text("context"),
  examples: text("examples").array(),
  related: text("related").array(),
  sourceUrl: text("source_url"),
  imageUrl: text("image_url"),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trade agreements
export const tradeAgreements = pgTable("trade_agreements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  countries: text("countries").array(),
  status: agreementStatusEnum("status").default("active").notNull(),
  signedDate: date("signed_date").notNull(),
  effectiveDate: date("effective_date"),
  expiryDate: date("expiry_date"),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Daily challenges
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: challengeTypeEnum("type").notNull(),
  difficulty: difficultyLevelEnum("difficulty").default("beginner").notNull(),
  points: integer("points").default(10).notNull(),
  content: json("content").notNull(),
  date: date("date").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User challenge completions
export const challengeCompletions = pgTable("challenge_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: integer("challenge_id").notNull().references(() => dailyChallenges.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false).notNull(),
  score: integer("score"),
  answers: json("answers"),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("user_challenge_unq").on(table.userId, table.challengeId),
  };
});

export const challengeCompletionsRelations = relations(challengeCompletions, ({ one }) => ({
  user: one(users, {
    fields: [challengeCompletions.userId],
    references: [users.id],
  }),
  challenge: one(dailyChallenges, {
    fields: [challengeCompletions.challengeId],
    references: [dailyChallenges.id],
  }),
}));

// User badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  criteria: json("criteria").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User earned badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: integer("badge_id").notNull().references(() => badges.id, { onDelete: "cascade" }),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("user_badge_unq").on(table.userId, table.badgeId),
  };
});

// Feature flags
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isEnabled: boolean("is_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feature access by role
export const featureAccess = pgTable("feature_access", {
  id: serial("id").primaryKey(),
  featureName: text("feature_name").notNull(),
  userRole: userRoleEnum("user_role").notNull(),
  isEnabled: boolean("is_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("feature_role_unq").on(table.featureName, table.userRole),
  };
});

// Email subscribers
export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").default("active").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// Certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  moduleId: integer("module_id").references(() => modules.id, { onDelete: "set null" }),
  quizId: integer("quiz_id").references(() => quizzes.id, { onDelete: "set null" }),
  imageUrl: text("image_url").notNull(),
  verificationCode: text("verification_code").notNull().unique(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

// Insert schemas for Zod validation
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.optional(),
});

export const insertModuleSchema = createInsertSchema(modules, {
  tags: (schema) => schema.tags.optional(),
});

export const insertQuizSchema = createInsertSchema(quizzes, {
  tags: (schema) => schema.tags.optional(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions);

export const insertQuizOptionSchema = createInsertSchema(quizOptions);

export const insertDictionaryTermSchema = createInsertSchema(dictionaryTerms, {
  examples: (schema) => schema.examples.optional(),
  related: (schema) => schema.related.optional(),
});

export const insertTradeAgreementSchema = createInsertSchema(tradeAgreements, {
  countries: (schema) => schema.countries.optional(),
  tags: (schema) => schema.tags.optional(),
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges);

export const insertBadgeSchema = createInsertSchema(badges);

export const insertFeatureFlagSchema = createInsertSchema(featureFlags);

export const insertFeatureAccessSchema = createInsertSchema(featureAccess);

export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers, {
  email: (schema) => schema.email.email(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type ModulePrerequisite = typeof modulePrerequisites.$inferSelect;

export type UserModuleProgress = typeof userModuleProgress.$inferSelect;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type QuizOption = typeof quizOptions.$inferSelect;
export type InsertQuizOption = z.infer<typeof insertQuizOptionSchema>;

export type UserQuizProgress = typeof userQuizProgress.$inferSelect;

export type DictionaryTerm = typeof dictionaryTerms.$inferSelect;
export type InsertDictionaryTerm = z.infer<typeof insertDictionaryTermSchema>;

export type TradeAgreement = typeof tradeAgreements.$inferSelect;
export type InsertTradeAgreement = z.infer<typeof insertTradeAgreementSchema>;

export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;

export type ChallengeCompletion = typeof challengeCompletions.$inferSelect;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;

export type FeatureAccess = typeof featureAccess.$inferSelect;
export type InsertFeatureAccess = z.infer<typeof insertFeatureAccessSchema>;

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;

export type Certificate = typeof certificates.$inferSelect;