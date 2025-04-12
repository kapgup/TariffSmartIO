/**
 * Type definitions for the client application
 */

/**
 * User type
 */
export interface User {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  bio?: string;
  role: string;
  subscriptionTier?: string;
  subscriptionExpiresAt?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  token?: string;
}

/**
 * Learning module
 */
export interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  featured: boolean;
  order: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Learning module section
 */
export interface ModuleSection {
  id: number;
  moduleId: number;
  title: string;
  content: string;
  order: number;
}

/**
 * Module response
 */
export interface ModuleResponse {
  module: Module;
  sections: ModuleSection[];
  related: Module[];
}

/**
 * Modules list response
 */
export interface ModulesResponse {
  modules: Module[];
  categories: string[];
  totalModules: number;
}

/**
 * Dictionary term
 */
export interface DictionaryTerm {
  id: number;
  term: string;
  slug: string;
  definition: string;
  category: string;
  relatedTerms?: number[];
  examples?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Dictionary term response
 */
export interface DictionaryTermResponse {
  term: DictionaryTerm;
  related: DictionaryTerm[];
}

/**
 * Dictionary terms list response
 */
export interface DictionaryTermsResponse {
  terms: DictionaryTerm[];
  categories: string[];
  totalTerms: number;
}

/**
 * Trade agreement
 */
export interface TradeAgreement {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string;
  countries: string[];
  status: string;
  signedDate: string;
  effectiveDate?: string;
  expirationDate?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Agreement response
 */
export interface AgreementResponse {
  agreement: TradeAgreement;
  related: TradeAgreement[];
}

/**
 * Agreements list response
 */
export interface AgreementsResponse {
  agreements: TradeAgreement[];
  totalAgreements: number;
}

/**
 * Quiz
 */
export interface Quiz {
  id: number;
  moduleId?: number;
  title: string;
  description: string;
  difficulty: string;
  timeLimit?: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Quiz question
 */
export interface QuizQuestion {
  id: number;
  quizId: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'matching';
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

/**
 * Quiz response
 */
export interface QuizResponse {
  quiz: Quiz;
  questions: QuizQuestion[];
}

/**
 * Quiz result
 */
export interface QuizResult {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  passingScore: number;
  passedAt?: string;
  completedAt: string;
  timeSpent: number;
}

/**
 * Daily challenge
 */
export interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  type: 'quiz' | 'task';
  points: number;
  content: any;
  availableFrom: string;
  availableTo: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Daily challenge response
 */
export interface DailyChallengeResponse {
  challenge: DailyChallenge | null;
  completed: boolean;
}

/**
 * User progress
 */
export interface UserProgress {
  completedModules: number;
  totalModules: number;
  completedChallenges: number;
  earnedPoints: number;
  rank?: string;
  badges: Badge[];
  certificates: Certificate[];
  recentActivity: ActivityItem[];
}

/**
 * Badge
 */
export interface Badge {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
  earnedAt: string;
}

/**
 * Certificate
 */
export interface Certificate {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: string;
  expiresAt?: string;
}

/**
 * Activity item
 */
export interface ActivityItem {
  id: number;
  type: 'module_completed' | 'quiz_passed' | 'challenge_completed' | 'badge_earned' | 'certificate_earned';
  itemId: number;
  itemName: string;
  timestamp: string;
}

/**
 * Feature flag
 */
export interface FeatureFlag {
  id: number;
  name: string;
  isEnabled: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Feature flag response
 */
export interface FeatureFlagResponse {
  flag: FeatureFlag;
  isEnabled: boolean;
}