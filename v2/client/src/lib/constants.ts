// Challenge Types
export const CHALLENGE_TYPES = {
  QUIZ: 'quiz',
  TERM: 'term',
  FACT: 'fact'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  PREMIUM: 'premium',
  EDITOR: 'editor',
  ADMIN: 'admin'
};

// Quiz Types
export const QUIZ_TYPES = {
  MODULE: 'module',
  STANDALONE: 'standalone',
  CERTIFICATION: 'certification'
};

// Module Categories
export const MODULE_CATEGORIES = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  SPECIALIZED: 'specialized'
};

// API Endpoints
export const API_ENDPOINTS = {
  MODULES: '/modules',
  QUIZZES: '/quizzes',
  DICTIONARY: '/dictionary',
  TRADE_AGREEMENTS: '/trade-agreements',
  PROGRESS: '/progress',
  DAILY_CHALLENGE: '/daily-challenge',
  SIMULATIONS: '/simulations'
};

// Dictionary Term Categories
export const DICTIONARY_CATEGORIES = {
  TARIFFS: 'tariffs',
  TRADE_POLICY: 'trade policy',
  SHIPPING: 'shipping',
  CUSTOMS: 'customs',
  REGULATIONS: 'regulations',
  AGREEMENTS: 'agreements'
};

// Progress Status
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Routes
export const ROUTES = {
  HOME: '/v2',
  MODULES: '/v2/modules',
  MODULE_DETAIL: '/v2/modules/:id',
  QUIZ: '/v2/quiz/:id',
  DICTIONARY: '/v2/dictionary',
  DICTIONARY_TERM: '/v2/dictionary/:id',
  DICTIONARY_TERM_BY_NAME: '/v2/dictionary/term/:name',
  AGREEMENTS: '/v2/agreements',
  AGREEMENT_DETAIL: '/v2/agreements/:id',
  CHALLENGE: '/v2/challenge',
  SIMULATION: '/v2/simulations/:id',
  PROFILE: '/v2/profile',
  LOGIN: '/v2/login',
  REGISTER: '/v2/register'
};