import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  boolean, 
  pgEnum,
  json,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const moduleCategoryEnum = pgEnum('module_category', [
  'tariffs',
  'trade_policy',
  'customs',
  'shipping',
  'regulations', 
  'agreements'
]);

export const difficultyEnum = pgEnum('difficulty', [
  'beginner',
  'intermediate',
  'advanced'
]);

export const completionStatusEnum = pgEnum('completion_status', [
  'not_started',
  'in_progress',
  'completed'
]);

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'editor',
  'premium',
  'basic'
]);

export const tradeAgreementStatusEnum = pgEnum('trade_agreement_status', [
  'active',
  'expired',
  'proposed',
  'renegotiating'
]);

export const dailyChallengeTypeEnum = pgEnum('daily_challenge_type', [
  'quiz',
  'reading',
  'simulation'
]);

export const emailSubscriberStatusEnum = pgEnum('email_subscriber_status', [
  'pending',
  'subscribed',
  'unsubscribed'
]);

// Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password'),
  displayName: text('display_name'),
  role: userRoleEnum('role').notNull().default('basic'),
  googleId: text('google_id').unique(),
  profilePicture: text('profile_picture'),
  bio: text('bio'),
  lastLogin: timestamp('last_login'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const modules = pgTable('modules', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  content: json('content').notNull(),
  category: moduleCategoryEnum('category').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  authorId: integer('author_id').references(() => users.id),
  published: boolean('published').default(false),
  imageUrl: text('image_url'),
  videoUrl: text('video_url'),
  estimatedCompletion: text('estimated_completion'),
  tags: text('tags').array(),
  prerequisites: integer('prerequisites').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    slugIdx: uniqueIndex('slug_idx').on(table.slug),
  };
});

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  moduleId: integer('module_id').references(() => modules.id),
  difficulty: difficultyEnum('difficulty').notNull(),
  published: boolean('published').default(false),
  passingScore: integer('passing_score').notNull(),
  timeLimit: integer('time_limit'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    slugIdx: uniqueIndex('quiz_slug_idx').on(table.slug),
  };
});

export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').notNull().references(() => quizzes.id),
  question: text('question').notNull(),
  type: text('type').notNull(), // multiple-choice, true-false, etc.
  points: integer('points').notNull().default(1),
  explanation: text('explanation'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const quizOptions = pgTable('quiz_options', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').notNull().references(() => quizQuestions.id),
  text: text('text').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userModuleProgress = pgTable('user_module_progress', {
  userId: integer('user_id').notNull().references(() => users.id),
  moduleId: integer('module_id').notNull().references(() => modules.id),
  status: completionStatusEnum('status').notNull().default('not_started'),
  progress: integer('progress').notNull().default(0),
  currentSection: integer('current_section').default(0),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    pk: uniqueIndex('user_module_pk').on(table.userId, table.moduleId),
  };
});

export const userQuizProgress = pgTable('user_quiz_progress', {
  userId: integer('user_id').notNull().references(() => users.id),
  quizId: integer('quiz_id').notNull().references(() => quizzes.id),
  score: integer('score'),
  attempts: integer('attempts').notNull().default(0),
  completed: boolean('completed').notNull().default(false),
  lastAttemptAt: timestamp('last_attempt_at'),
  responses: json('responses'), // Store user's answers
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    pk: uniqueIndex('user_quiz_pk').on(table.userId, table.quizId),
  };
});

export const dictionaryTerms = pgTable('dictionary_terms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  category: moduleCategoryEnum('category').notNull(),
  definition: text('definition').notNull(),
  examples: text('examples').array(),
  imageUrl: text('image_url'),
  videoUrl: text('video_url'),
  relatedTerms: integer('related_terms').array(),
  authorId: integer('author_id').references(() => users.id),
  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    nameIdx: uniqueIndex('term_name_idx').on(table.name),
    slugIdx: uniqueIndex('term_slug_idx').on(table.slug),
  };
});

export const tradeAgreements = pgTable('trade_agreements', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  content: json('content').notNull(),
  countries: text('countries').array().notNull(),
  status: tradeAgreementStatusEnum('status').notNull(),
  effectiveDate: timestamp('effective_date'),
  expirationDate: timestamp('expiration_date'),
  signedDate: timestamp('signed_date'),
  imageUrl: text('image_url'),
  documentUrl: text('document_url'),
  keyProvisions: text('key_provisions').array(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    nameIdx: uniqueIndex('agreement_name_idx').on(table.name),
    slugIdx: uniqueIndex('agreement_slug_idx').on(table.slug),
  };
});

export const dailyChallenges = pgTable('daily_challenges', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: dailyChallengeTypeEnum('type').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  content: json('content').notNull(),
  date: timestamp('date').notNull().unique(),
  points: integer('points').notNull().default(10),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const challengeCompletions = pgTable('challenge_completions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  challengeId: integer('challenge_id').notNull().references(() => dailyChallenges.id),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
  score: integer('score'),
  responses: json('responses'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    userChallengeIdx: uniqueIndex('user_challenge_idx').on(table.userId, table.challengeId),
  };
});

export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  criteria: json('criteria').notNull(),
  category: text('category').notNull(),
  points: integer('points').notNull().default(10),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  badgeId: integer('badge_id').notNull().references(() => badges.id),
  awardedAt: timestamp('awarded_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    userBadgeIdx: uniqueIndex('user_badge_idx').on(table.userId, table.badgeId),
  };
});

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  moduleId: integer('module_id').references(() => modules.id),
  imageUrl: text('image_url').notNull(),
  verificationCode: text('verification_code').notNull().unique(),
  issuedAt: timestamp('issued_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const featureFlags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  isEnabled: boolean('is_enabled').notNull().default(true),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const featureAccess = pgTable('feature_access', {
  id: serial('id').primaryKey(),
  feature_name: text('feature_name').notNull().references(() => featureFlags.name),
  user_role: userRoleEnum('user_role').notNull(),
  isEnabled: boolean('is_enabled').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    featureRoleIdx: uniqueIndex('feature_role_idx').on(table.feature_name, table.user_role),
  };
});

export const emailSubscribers = pgTable('email_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  status: emailSubscriberStatusEnum('status').notNull().default('pending'),
  subscribedAt: timestamp('subscribed_at'),
  unsubscribedAt: timestamp('unsubscribed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relation definitions
export const usersRelations = relations(users, ({ many }) => ({
  modules: many(modules),
  moduleProgress: many(userModuleProgress),
  quizProgress: many(userQuizProgress),
  challengeCompletions: many(challengeCompletions),
  badges: many(userBadges),
  certificates: many(certificates),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  author: one(users, {
    fields: [modules.authorId],
    references: [users.id],
  }),
  quizzes: many(quizzes),
  progress: many(userModuleProgress),
  certificates: many(certificates),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  module: one(modules, {
    fields: [quizzes.moduleId],
    references: [modules.id],
  }),
  questions: many(quizQuestions),
  progress: many(userQuizProgress),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
  options: many(quizOptions),
}));

export const quizOptionsRelations = relations(quizOptions, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizOptions.questionId],
    references: [quizQuestions.id],
  }),
}));

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

export const dictionaryTermsRelations = relations(dictionaryTerms, ({ one }) => ({
  author: one(users, {
    fields: [dictionaryTerms.authorId],
    references: [users.id],
  }),
}));

export const dailyChallengesRelations = relations(dailyChallenges, ({ many }) => ({
  completions: many(challengeCompletions),
}));

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

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [certificates.moduleId],
    references: [modules.id],
  }),
}));

export const featureAccessRelations = relations(featureAccess, ({ one }) => ({
  feature: one(featureFlags, {
    fields: [featureAccess.feature_name],
    references: [featureFlags.name],
  }),
}));

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizOptionSchema = createInsertSchema(quizOptions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDictionaryTermSchema = createInsertSchema(dictionaryTerms).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true });
export const insertTradeAgreementSchema = createInsertSchema(tradeAgreements).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({ id: true, createdAt: true, updatedAt: true });
export const insertChallengeCompletionSchema = createInsertSchema(challengeCompletions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFeatureAccessSchema = createInsertSchema(featureAccess).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({ id: true, createdAt: true, updatedAt: true, subscribedAt: true, unsubscribedAt: true }).extend({
  email: z.string().email('Invalid email format'),
});

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type InsertQuizOption = z.infer<typeof insertQuizOptionSchema>;
export type InsertDictionaryTerm = z.infer<typeof insertDictionaryTermSchema>;
export type InsertTradeAgreement = z.infer<typeof insertTradeAgreementSchema>;
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type InsertChallengeCompletion = z.infer<typeof insertChallengeCompletionSchema>;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type InsertFeatureAccess = z.infer<typeof insertFeatureAccessSchema>;
export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizOption = typeof quizOptions.$inferSelect;
export type UserModuleProgress = typeof userModuleProgress.$inferSelect;
export type UserQuizProgress = typeof userQuizProgress.$inferSelect;
export type DictionaryTerm = typeof dictionaryTerms.$inferSelect;
export type TradeAgreement = typeof tradeAgreements.$inferSelect;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type ChallengeCompletion = typeof challengeCompletions.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type FeatureAccess = typeof featureAccess.$inferSelect;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;