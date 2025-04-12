// Module Types
export interface Module {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedMinutes: number;
  category: string;
  content: string | object;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleResponse {
  module: Module;
}

export interface ModulesResponse {
  modules: Module[];
}

export interface ModuleContent {
  sections: ModuleSection[];
}

export interface ModuleSection {
  type: string;
  content?: string;
  url?: string;
  caption?: string;
  title?: string;
  id?: number;
}

// Quiz Types
export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  type: string;
  moduleId: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientQuizQuestion {
  id: number;
  quizId: number;
  question: string;
  options: string[] | string;
  correctAnswer: string;
  explanation: string | null;
  points: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResponse {
  quiz: Quiz;
  questions: ClientQuizQuestion[];
}

export interface QuizzesResponse {
  quizzes: Quiz[];
}

export interface QuizAnswer {
  questionId: number;
  answer: string;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
}

export interface QuizResultItem {
  questionId: number;
  correct: boolean;
  correctAnswer: string;
  explanation: string | null;
}

export interface QuizResult {
  quizId: number;
  score: number;
  results: QuizResultItem[];
}

// Dictionary Types
export interface DictionaryTerm {
  id: number;
  term: string;
  definition: string;
  category: string;
  example: string | null;
  relatedTerms: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface DictionaryTermResponse {
  term: DictionaryTerm;
}

export interface DictionaryResponse {
  terms: DictionaryTerm[];
  totalCount: number;
}

// Trade Agreement Types
export interface TradeAgreement {
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  keyPoints: string | string[];
  countries: string[];
  year: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeAgreementResponse {
  agreement: TradeAgreement;
}

export interface TradeAgreementsResponse {
  agreements: TradeAgreement[];
}

// Daily Challenge Types
export interface DailyChallenge {
  id: number;
  title: string;
  type: string;
  difficulty: string;
  content: string | object;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyChallengeResponse {
  challenge: DailyChallenge;
  completed: boolean;
}

// User Progress Types
export interface ModuleProgress {
  moduleId: number;
  status: string;
  completedAt: string | null;
}

export interface QuizProgress {
  quizId: number;
  score: number;
  completedAt: string;
}

export interface ChallengeProgress {
  challengeId: number;
  date: string;
  completedAt: string;
}

export interface UserProgress {
  modules: ModuleProgress[];
  quizzes: QuizProgress[];
  challenges: ChallengeProgress[];
  streakCount: number;
  totalPoints: number;
}

export interface UserProgressResponse {
  progress: UserProgress;
}