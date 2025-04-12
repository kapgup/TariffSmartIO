// Module-related types
export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  content: string; // JSON content of the module
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export type ModuleContent = {
  sections: ModuleSection[];
};

export type ModuleSection = 
  | { type: 'text'; content: string }
  | { type: 'image'; url: string; caption: string }
  | { type: 'video'; url: string; caption: string }
  | { type: 'simulation'; id: number; title: string }
  | { type: 'quiz'; id: number; title: string };

// Quiz-related types
export interface Quiz {
  id: number;
  moduleId: number | null;
  title: string;
  description: string | null;
  isStandalone: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  question: string;
  options: string; // JSON array of options
  correctAnswer: string;
  explanation: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientQuizQuestion {
  id: number;
  question: string;
  options: string[];
  order: number;
}

export interface QuizSubmission {
  answers: { questionId: number; answer: string }[];
}

export interface QuizResult {
  score: number;
  results: {
    questionId: number;
    correct: boolean;
    correctAnswer: string;
    explanation: string | null;
  }[];
  progress: UserProgress;
}

// Dictionary-related types
export interface DictionaryTerm {
  id: number;
  term: string;
  definition: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

// Trade agreement types
export interface TradeAgreement {
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  keyPoints: string; // JSON array of key points
  createdAt: string;
  updatedAt: string;
}

// Progress tracking types
export interface UserProgress {
  id: number;
  userId: number;
  moduleId: number | null;
  quizId: number | null;
  completed: boolean;
  score: number | null;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Dictionary term view types
export interface DictionaryView {
  id: number;
  userId: number;
  termId: number;
  viewCount: number;
  lastViewedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Daily challenge types
export interface DailyChallenge {
  id: number;
  date: string;
  type: string;
  content: string; // JSON content that depends on the type
  createdAt: string;
}

export interface ChallengeCompletion {
  id: number;
  userId: number;
  challengeId: number;
  completed: boolean;
  score: number | null;
  completedAt: string;
}

// Simulation types
export interface Simulation {
  id: number;
  moduleId: number | null;
  title: string;
  description: string;
  type: string;
  config: string; // JSON configuration
  createdAt: string;
  updatedAt: string;
}

// User-related types
export interface User {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  profilePicture?: string;
  role: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ModulesResponse {
  modules: Module[];
}

export interface ModuleResponse {
  module: Module;
}

export interface QuizzesResponse {
  quizzes: Quiz[];
}

export interface QuizResponse {
  quiz: Quiz;
  questions: ClientQuizQuestion[];
}

export interface DictionaryTermsResponse {
  terms: DictionaryTerm[];
}

export interface DictionaryTermResponse {
  term: DictionaryTerm;
}

export interface TradeAgreementsResponse {
  agreements: TradeAgreement[];
}

export interface TradeAgreementResponse {
  agreement: TradeAgreement;
}

export interface UserProgressResponse {
  progress: UserProgress[];
}

export interface DailyChallengeResponse {
  challenge: DailyChallenge;
  completed: boolean;
}

export interface SimulationsResponse {
  simulations: Simulation[];
}

export interface SimulationResponse {
  simulation: Simulation;
}