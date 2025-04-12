// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string | null;
  role: 'admin' | 'editor' | 'premium' | 'basic';
  googleId: string | null;
  profilePicture: string | null;
  bio: string | null;
  subscriptionTier: string | null;
  subscriptionExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Module Types
export interface ModuleListItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'tariffs' | 'trade_policy' | 'customs' | 'shipping' | 'regulations' | 'agreements';
  estimatedMinutes: number;
  published: boolean;
  imageUrl: string | null;
  authorId: number | null;
}

export interface Module extends ModuleListItem {
  content: any;
  prerequisites: number[] | null;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModulesResponse {
  modules: ModuleListItem[];
  categories: string[];
  totalModules: number;
}

export interface ModuleResponse {
  module: Module;
}

export interface ModuleSection {
  title: string;
  content: string;
  type: 'text' | 'video' | 'image' | 'code' | 'table';
  resources?: {
    title: string;
    url: string;
    type: 'link' | 'pdf' | 'video';
  }[];
}

// Quiz Types
export interface QuizListItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  moduleId: number | null;
  passingScore: number;
  timeLimit: number | null;
  published: boolean;
  authorId: number | null;
}

export interface Quiz extends QuizListItem {
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  text: string;
  points: number;
  explanation: string | null;
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  order: number;
  options?: QuizOption[];
}

export interface QuizOption {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuizListResponse {
  quizzes: QuizListItem[];
}

export interface QuizResponse {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  questionId: number;
  selectedOptionId: number;
}

export interface QuizResult {
  score: number;
  maxScore: number;
  passed: boolean;
  attempts: number;
  responses: Record<number, {
    questionId: number;
    selectedOptionId: number;
    isCorrect: boolean;
    correctOptionId?: number;
  }>;
}

// Dictionary Types
export interface DictionaryTermListItem {
  id: number;
  name: string;
  slug: string;
  category: 'tariffs' | 'trade_policy' | 'customs' | 'shipping' | 'regulations' | 'agreements';
  definition: string;
  authorId: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  viewCount: number;
}

export interface DictionaryTerm extends DictionaryTermListItem {
  examples: string[] | null;
  relatedTerms: number[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DictionaryTermsResponse {
  terms: DictionaryTermListItem[];
  categories: string[];
  total: number;
}

export interface DictionaryTermResponse {
  term: DictionaryTerm;
}

// Trade Agreement Types
export interface TradeAgreementListItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  countries: string[];
  status: 'active' | 'expired' | 'proposed' | 'renegotiating';
  startDate: Date | null;
  endDate: Date | null;
  authorId: number | null;
}

export interface TradeAgreement extends TradeAgreementListItem {
  content: any;
  keyProvisions: string[] | null;
  documentUrl: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeAgreementsResponse {
  agreements: TradeAgreementListItem[];
  stats: {
    totalActive: number;
    totalExpired: number;
    totalProposed: number;
    totalRenegotiating: number;
    total: number;
  };
}

export interface TradeAgreementResponse {
  agreement: TradeAgreement;
}

// Challenge Types
export interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  type: 'quiz' | 'research' | 'reading';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: any;
  date: Date;
  points: number;
  expiresAt: Date;
  authorId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyChallengeResponse {
  challenge: DailyChallenge;
  completed: boolean;
}

// User Progress Types
export interface UserProgress {
  userId: number;
  moduleId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  currentSection: number;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt: Date | null;
}

export interface UserQuizProgress {
  userId: number;
  quizId: number;
  score: number;
  attempts: number;
  completed: boolean;
  lastAttemptAt: Date;
  responses: any;
}

export interface UserProgressResponse {
  moduleProgress: UserProgress[];
  quizProgress: UserQuizProgress[];
}

// Certificate Types
export interface Certificate {
  id: number;
  title: string;
  userId: number;
  moduleId: number | null;
  imageUrl: string;
  issuedAt: Date;
  verificationCode: string;
}

export interface CertificatesResponse {
  certificates: Certificate[];
}

// Badge Types
export interface Badge {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
  category: string;
  points: number;
}

export interface UserBadge {
  userId: number;
  badgeId: number;
  awardedAt: Date;
  badge: Badge;
}

export interface BadgesResponse {
  badges: Badge[];
}

export interface UserBadgesResponse {
  badges: UserBadge[];
}

// Feature Flag Types
export interface FeatureFlag {
  id: number;
  name: string;
  description: string;
  isEnabled: boolean;
}

export interface FeatureFlagsResponse {
  flags: FeatureFlag[];
}

export interface FeatureFlagResponse {
  flag: FeatureFlag;
  isEnabled: boolean;
}

// Auth Types
export interface AuthResponse {
  user: Omit<User, 'password'>;
}