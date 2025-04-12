/**
 * Type definitions for TariffSmart Education (v2)
 */

// API Response Types
export interface ApiError {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: string;
  profilePicture?: string;
  subscriptionTier?: string;
  subscriptionExpiration?: string;
  createdAt: string;
  updatedAt: string;
}

// Module Types
export interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  duration: number; // in minutes
  imageUrl?: string;
  authorId: number;
  authorName?: string;
  published: boolean;
  tags: string[];
  prerequisites?: number[];
  prerequisiteTitles?: string[];
  estimatedCompletion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleListItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  imageUrl?: string;
  published: boolean;
  tags: string[];
  prerequisiteCount: number;
  quizCount: number;
  progress?: UserProgress;
}

export interface ModulesResponse {
  modules: ModuleListItem[];
  categories: string[];
  totalModules: number;
  completedModules?: number;
}

export interface ModuleDetailResponse {
  module: Module;
  relatedModules?: ModuleListItem[];
  prerequisites?: ModuleListItem[];
  nextModules?: ModuleListItem[];
  quizzes?: QuizBasic[];
  progress?: UserProgress;
}

// Quiz Types
export interface QuizQuestion {
  id: number;
  questionText: string;
  options: QuizOption[];
  type: string;
  explanation?: string;
  imageUrl?: string;
  difficulty: string;
  points: number;
}

export interface QuizOption {
  id: number;
  text: string;
  isCorrect?: boolean;
}

export interface QuizBasic {
  id: number;
  title: string;
  slug: string;
  description: string;
  moduleId: number;
  moduleName?: string;
  questionCount: number;
  duration: number;
  difficulty: string;
  completed?: boolean;
  score?: number;
}

export interface Quiz extends QuizBasic {
  questions: QuizQuestion[];
  passingScore: number;
  tags: string[];
}

export interface QuizListResponse {
  quizzes: QuizBasic[];
  totalQuizzes: number;
}

export interface QuizDetailResponse {
  quiz: Quiz;
  userAnswers?: Record<number, number | number[]>;
  progress?: UserQuizProgress;
}

export interface QuizSubmissionRequest {
  quizId: number;
  answers: Record<number, number | number[]>;
  timeSpent: number;
}

export interface QuizSubmissionResponse {
  score: number;
  totalPoints: number;
  passingScore: number;
  passed: boolean;
  answers: QuizQuestionResult[];
  nextQuizId?: number;
  certificateUrl?: string;
}

export interface QuizQuestionResult {
  questionId: number;
  correct: boolean;
  selectedAnswer: number | number[];
  correctAnswer: number | number[];
  explanation: string;
  points: number;
}

// Dictionary Types
export interface DictionaryTerm {
  id: number;
  name: string;
  slug: string;
  definition: string;
  category: string;
  context?: string;
  examples?: string[];
  related?: string[];
  sourceUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DictionaryTermListItem {
  id: number;
  name: string;
  slug: string;
  definition: string;
  category: string;
}

export interface DictionaryTermsResponse {
  terms: DictionaryTermListItem[];
  categories: string[];
  totalTerms: number;
}

export interface DictionaryTermResponse {
  term: DictionaryTerm;
  relatedTerms: DictionaryTermListItem[];
}

// Trade Agreement Types
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
  expiryDate?: string;
  imageUrl?: string;
  sourceUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TradeAgreementListItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  countries: string[];
  status: string;
  signedDate: string;
  effectiveDate?: string;
  expiryDate?: string;
  tags: string[];
}

export interface TradeAgreementsResponse {
  agreements: TradeAgreementListItem[];
  totalAgreements: number;
  statuses: string[];
}

export interface TradeAgreementDetailResponse {
  agreement: TradeAgreement;
  relatedAgreements: TradeAgreementListItem[];
}

// Challenge Types
export interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  points: number;
  content: any; // Varies based on challenge type
  date: string;
  expiresAt: string;
  imageUrl?: string;
}

export interface ChallengeCompletion {
  id: number;
  userId: number;
  challengeId: number;
  completed: boolean;
  score?: number;
  answers?: any;
  createdAt: string;
}

export interface DailyChallengeResponse {
  challenge: DailyChallenge;
  completion?: ChallengeCompletion;
  streakCount?: number;
}

// User Progress Types
export interface UserProgress {
  moduleId: number;
  status: string; // "not_started", "in_progress", "completed"
  startedAt?: string;
  completedAt?: string;
  percentComplete: number;
  lastPosition?: string;
}

export interface UserQuizProgress {
  quizId: number;
  attempted: boolean;
  completed: boolean;
  score?: number;
  attempts: number;
  bestScore?: number;
  lastAttemptAt?: string;
  answers?: Record<number, number | number[]>;
}

export interface UserProgressResponse {
  modules: UserProgress[];
  quizzes: UserQuizProgress[];
  totalCompleted: number;
  totalInProgress: number;
  badges: UserBadge[];
  points: number;
  rank?: string;
}

export interface UserBadge {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  awardedAt: string;
}

// Simulation Types
export interface Simulation {
  id: number;
  title: string;
  description: string;
  type: string;
  complexity: string;
  duration: number;
  moduleId?: number;
  scenarioData: any;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationListResponse {
  simulations: Simulation[];
  totalSimulations: number;
}

export interface SimulationResponse {
  simulation: Simulation;
  userProgress?: any;
}

// Profile Types
export interface UserProfile {
  user: User;
  progress: UserProgressResponse;
  achievements: UserBadge[];
  certificates: UserCertificate[];
}

export interface UserCertificate {
  id: number;
  title: string;
  issuedAt: string;
  expiresAt?: string;
  imageUrl: string;
  verificationUrl: string;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string; // 'month' or 'year'
  features: string[];
}

export interface SubscriptionPlansResponse {
  plans: SubscriptionPlan[];
}