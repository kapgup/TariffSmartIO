import { relations } from "drizzle-orm";
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  pgEnum, 
  primaryKey, 
  json
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Common timestamp fields
const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
};

// ========== ENUMS ==========
export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "premium", "basic"]);
export const moduleCategoryEnum = pgEnum("module_category", [
  "tariffs", 
  "trade_policy", 
  "customs", 
  "shipping", 
  "regulations", 
  "agreements"
]);
export const difficultyEnum = pgEnum("difficulty", ["beginner", "intermediate", "advanced"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "canceled", "expired", "pending"]);
export const tradeAgreementStatusEnum = pgEnum("trade_agreement_status", ["active", "proposed", "expired", "renegotiating"]);
export const emailSubscriberStatusEnum = pgEnum("email_subscriber_status", ["subscribed", "unsubscribed", "pending"]);

// ========== USER TABLES ==========
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  displayName: text("display_name"),
  role: userRoleEnum("role").default("basic").notNull(),
  googleId: text("google_id").unique(),
  profilePicture: text("profile_picture"),
  subscriptionTier: text("subscription_tier").default("basic"),
  subscriptionExpiration: timestamp("subscription_expiration"),
  lastLogin: timestamp("last_login"),
  ...timestamps
});

export const userRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  moduleProgress: many(userModuleProgress),
  quizProgress: many(userQuizProgress),
  badges: many(userBadges),
  challengeCompletions: many(challengeCompletions),
  certificates: many(certificates)
}));

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  plan: text("plan").notNull(),
  status: subscriptionStatusEnum("status").default("pending").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  paymentMethod: text("payment_method"),
  paymentId: text("payment_id"),
  ...timestamps
});

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  })
}));

// ========== MODULE TABLES ==========
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: json("content").notNull(),
  category: moduleCategoryEnum("category").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  duration: integer("duration").notNull(), // in minutes
  imageUrl: text("image_url"),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(false).notNull(),
  tags: text("tags").array(),
  estimatedCompletion: text("estimated_completion"),
  ...timestamps
});

export const moduleRelations = relations(modules, ({ one, many }) => ({
  author: one(users, {
    fields: [modules.authorId],
    references: [users.id]
  }),
  quizzes: many(quizzes),
  progress: many(userModuleProgress)
}));

export const userModuleProgress = pgTable("user_module_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  progress: integer("progress").default(0).notNull(), // 0-100 percentage
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  ...timestamps
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.moduleId] })
  };
});

export const userModuleProgressRelations = relations(userModuleProgress, ({ one }) => ({
  user: one(users, {
    fields: [userModuleProgress.userId],
    references: [users.id]
  }),
  module: one(modules, {
    fields: [userModuleProgress.moduleId],
    references: [modules.id]
  })
}));

// ========== QUIZ TABLES ==========
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  difficulty: difficultyEnum("difficulty").notNull(),
  passingScore: integer("passing_score").default(70).notNull(), // percentage
  duration: integer("duration"), // in minutes
  tags: text("tags").array(),
  ...timestamps
});

export const quizRelations = relations(quizzes, ({ one, many }) => ({
  module: one(modules, {
    fields: [quizzes.moduleId],
    references: [modules.id]
  }),
  questions: many(quizQuestions),
  progress: many(userQuizProgress)
}));

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  question: text("question").notNull(),
  explanation: text("explanation"),
  points: integer("points").default(1).notNull(),
  type: text("type").default("multiple_choice").notNull(), // multiple_choice, true_false, fill_in
  order: integer("order").default(0).notNull(),
  ...timestamps
});

export const quizQuestionRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id]
  }),
  options: many(quizOptions)
}));

export const quizOptions = pgTable("quiz_options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => quizQuestions.id),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  explanation: text("explanation"),
  order: integer("order").default(0).notNull(),
  ...timestamps
});

export const quizOptionRelations = relations(quizOptions, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizOptions.questionId],
    references: [quizQuestions.id]
  })
}));

export const userQuizProgress = pgTable("user_quiz_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(), // percentage
  passed: boolean("passed").default(false).notNull(),
  attempts: integer("attempts").default(1).notNull(),
  answers: json("answers").notNull(), // store user answers
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  timeSpent: integer("time_spent"), // in seconds
  ...timestamps
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.quizId] })
  };
});

export const userQuizProgressRelations = relations(userQuizProgress, ({ one }) => ({
  user: one(users, {
    fields: [userQuizProgress.userId],
    references: [users.id]
  }),
  quiz: one(quizzes, {
    fields: [userQuizProgress.quizId],
    references: [quizzes.id]
  })
}));

// ========== DICTIONARY TABLES ==========
export const dictionaryTerms = pgTable("dictionary_terms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  definition: text("definition").notNull(),
  category: moduleCategoryEnum("category").notNull(),
  context: text("context"),
  examples: text("examples").array(),
  related: text("related").array(),
  sourceUrl: text("source_url"),
  imageUrl: text("image_url"),
  viewCount: integer("view_count").default(0).notNull(),
  ...timestamps
});

// ========== TRADE AGREEMENT TABLES ==========
export const tradeAgreements = pgTable("trade_agreements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  countries: text("countries").array().notNull(),
  status: tradeAgreementStatusEnum("status").notNull(),
  signedDate: timestamp("signed_date"),
  effectiveDate: timestamp("effective_date"),
  expiryDate: timestamp("expiry_date"),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  tags: text("tags").array(),
  ...timestamps
});

// ========== DAILY CHALLENGE TABLES ==========
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // quiz, activity, etc.
  difficulty: difficultyEnum("difficulty").notNull(),
  points: integer("points").default(10).notNull(),
  date: timestamp("date").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps
});

export const challengeCompletions = pgTable("challenge_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => dailyChallenges.id),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  ...timestamps
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.challengeId] })
  };
});

export const challengeCompletionRelations = relations(challengeCompletions, ({ one }) => ({
  user: one(users, {
    fields: [challengeCompletions.userId],
    references: [users.id]
  }),
  challenge: one(dailyChallenges, {
    fields: [challengeCompletions.challengeId],
    references: [dailyChallenges.id]
  })
}));

// ========== BADGE TABLES ==========
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  criteria: text("criteria").notNull(),
  points: integer("points").default(5).notNull(),
  ...timestamps
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
  ...timestamps
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.badgeId] })
  };
});

export const userBadgeRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id]
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id]
  })
}));

// ========== FEATURE FLAGS AND ACCESS TABLES ==========
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isEnabled: boolean("is_enabled").default(false).notNull(),
  ...timestamps
});

export const featureAccess = pgTable("feature_access", {
  id: serial("id").primaryKey(),
  featureName: text("feature_name").notNull().references(() => featureFlags.name),
  userRole: userRoleEnum("user_role").notNull(),
  isEnabled: boolean("is_enabled").default(false).notNull(),
  ...timestamps
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.featureName, table.userRole] })
  };
});

// ========== EMAIL SUBSCRIBERS TABLE ==========
export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: emailSubscriberStatusEnum("status").default("pending").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  ...timestamps
});

// ========== CERTIFICATES TABLE ==========
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: integer("module_id").references(() => modules.id),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  verificationCode: text("verification_code").notNull().unique(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  ...timestamps
});

export const certificateRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id]
  }),
  module: one(modules, {
    fields: [certificates.moduleId],
    references: [modules.id]
  })
}));

// ========== SCHEMA TYPES ==========
// User Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

// Subscription Types
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true });

// Module Types
export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });

// User Module Progress Types
export type UserModuleProgress = typeof userModuleProgress.$inferSelect;
export type InsertUserModuleProgress = typeof userModuleProgress.$inferInsert;
export const insertUserModuleProgressSchema = createInsertSchema(userModuleProgress).omit({ id: true });

// Quiz Types
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true });

// Quiz Question Types
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true });

// Quiz Option Types
export type QuizOption = typeof quizOptions.$inferSelect;
export type InsertQuizOption = typeof quizOptions.$inferInsert;
export const insertQuizOptionSchema = createInsertSchema(quizOptions).omit({ id: true });

// User Quiz Progress Types
export type UserQuizProgress = typeof userQuizProgress.$inferSelect;
export type InsertUserQuizProgress = typeof userQuizProgress.$inferInsert;
export const insertUserQuizProgressSchema = createInsertSchema(userQuizProgress).omit({ id: true });

// Dictionary Term Types
export type DictionaryTerm = typeof dictionaryTerms.$inferSelect;
export type InsertDictionaryTerm = typeof dictionaryTerms.$inferInsert;
export const insertDictionaryTermSchema = createInsertSchema(dictionaryTerms).omit({ id: true });

// Trade Agreement Types
export type TradeAgreement = typeof tradeAgreements.$inferSelect;
export type InsertTradeAgreement = typeof tradeAgreements.$inferInsert;
export const insertTradeAgreementSchema = createInsertSchema(tradeAgreements).omit({ id: true });

// Daily Challenge Types
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = typeof dailyChallenges.$inferInsert;
export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({ id: true });

// Challenge Completion Types
export type ChallengeCompletion = typeof challengeCompletions.$inferSelect;
export type InsertChallengeCompletion = typeof challengeCompletions.$inferInsert;
export const insertChallengeCompletionSchema = createInsertSchema(challengeCompletions).omit({ id: true });

// Badge Types
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true });

// User Badge Types
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true });

// Feature Flag Types
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = typeof featureFlags.$inferInsert;
export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({ id: true });

// Feature Access Types
export type FeatureAccess = typeof featureAccess.$inferSelect;
export type InsertFeatureAccess = typeof featureAccess.$inferInsert;
export const insertFeatureAccessSchema = createInsertSchema(featureAccess).omit({ id: true });

// Email Subscriber Types
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = typeof emailSubscribers.$inferInsert;
export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({ id: true });

// Certificate Types
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;
export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true });

// Additional schema validations
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const userRegistrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const moduleCreateSchema = insertModuleSchema.extend({
  tags: z.array(z.string()).optional()
});

export const dictionaryTermCreateSchema = insertDictionaryTermSchema.extend({
  examples: z.array(z.string()).optional(),
  related: z.array(z.string()).optional()
});

export const tradeAgreementCreateSchema = insertTradeAgreementSchema.extend({
  countries: z.array(z.string()),
  tags: z.array(z.string()).optional()
});

export const emailSubscriptionSchema = z.object({
  email: z.string().email()
});