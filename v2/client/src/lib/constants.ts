/**
 * Application constants for TariffSmart Education (v2)
 */

// App Information
export const APP_NAME = "TariffSmart";
export const APP_FULL_NAME = "TariffSmart Education";
export const APP_DESCRIPTION = "Your comprehensive learning platform for understanding tariffs, trade policies, and international commerce dynamics.";
export const APP_VERSION = "2.0.0";
export const COPYRIGHT_YEAR = "2025";

// Navigation Links
export const ROUTES = {
  HOME: "/v2",
  MODULES: "/v2/modules",
  MODULE_DETAIL: "/v2/modules/:id",
  QUIZ: "/v2/quiz/:id",
  DICTIONARY: "/v2/dictionary",
  DICTIONARY_TERM: "/v2/dictionary/term/:name",
  AGREEMENTS: "/v2/trade-agreements",
  AGREEMENT_DETAIL: "/v2/trade-agreements/:id",
  CHALLENGE: "/v2/challenge",
  PROFILE: "/v2/profile",
  SETTINGS: "/v2/settings",
  LOGIN: "/v2/login",
  REGISTER: "/v2/register",
  NOT_FOUND: "/v2/not-found",
};

export const NAVIGATION_LINKS = [
  { name: "Home", href: ROUTES.HOME },
  { name: "Modules", href: ROUTES.MODULES },
  { name: "Dictionary", href: ROUTES.DICTIONARY },
  { name: "Trade Agreements", href: ROUTES.AGREEMENTS },
  { name: "Daily Challenge", href: ROUTES.CHALLENGE },
];

export const FOOTER_LINKS = {
  product: [
    { name: "Features", href: `${ROUTES.HOME}#features` },
    { name: "Pricing", href: `${ROUTES.HOME}#pricing` },
    { name: "Updates", href: `${ROUTES.HOME}#updates` },
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "API Documentation", href: "/docs/api" },
    { name: "Community", href: "/community" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

// API Endpoints
export const API_ENDPOINTS = {
  // Modules
  MODULES: "/api/v2/modules",
  MODULE_BY_ID: "/api/v2/modules/:id",
  MODULE_COMPLETE: "/api/v2/modules/:id/complete",
  MODULE_SIMULATIONS: "/api/v2/modules/:id/simulations",
  MODULE_QUIZZES: "/api/v2/modules/:id/quizzes",
  
  // Quizzes
  QUIZZES: "/api/v2/quizzes",
  QUIZ_BY_ID: "/api/v2/quizzes/:id",
  QUIZ_SUBMIT: "/api/v2/quizzes/:id/submit",
  
  // Dictionary
  DICTIONARY: "/api/v2/dictionary",
  DICTIONARY_TERM: "/api/v2/dictionary/:id",
  DICTIONARY_TERM_BY_NAME: "/api/v2/dictionary/term/:name",
  DICTIONARY_CATEGORY: "/api/v2/dictionary/category/:category",
  
  // Trade Agreements
  TRADE_AGREEMENTS: "/api/v2/trade-agreements",
  TRADE_AGREEMENT_BY_ID: "/api/v2/trade-agreements/:id",
  
  // User Progress
  USER_PROGRESS: "/api/v2/progress",
  
  // Daily Challenge
  DAILY_CHALLENGE: "/api/v2/daily-challenge",
  DAILY_CHALLENGE_COMPLETE: "/api/v2/daily-challenge/:id/complete",
  
  // Simulations
  SIMULATIONS: "/api/v2/simulations",
  SIMULATION_BY_ID: "/api/v2/simulations/:id",
};

// MVP Module Topics
export const MVP_MODULE_TOPICS = [
  "Tariff Classifications",
  "Tariff Calculations",
  "Trade Agreements",
  "Trade Policy Fundamentals",
  "Global Supply Chains",
  "Import/Export Documentation",
  "Customs Compliance",
  "Trade Remedies",
  "International Regulations",
  "Shipping Terms and Incoterms",
  "Customs Valuation Methods",
  "Anti-Dumping Duties"
];

// Query Keys
export const QUERY_KEYS = {
  modules: "modules",
  module: "module",
  quizzes: "quizzes",
  quiz: "quiz",
  dictionary: "dictionary",
  dictionaryTerm: "dictionaryTerm",
  tradeAgreements: "tradeAgreements",
  tradeAgreement: "tradeAgreement",
  userProgress: "userProgress",
  dailyChallenge: "dailyChallenge",
  simulations: "simulations",
  simulation: "simulation",
};

// Enums
export const MODULE_DIFFICULTY = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
};

export const MODULE_CATEGORIES = {
  TARIFFS: "tariffs",
  TRADE_POLICY: "trade_policy",
  CUSTOMS: "customs",
  SHIPPING: "shipping",
  REGULATIONS: "regulations",
  AGREEMENTS: "agreements",
};

export const DICTIONARY_CATEGORIES = {
  TARIFFS: "Tariffs",
  TRADE_POLICY: "Trade Policy",
  SHIPPING: "Shipping",
  CUSTOMS: "Customs",
  REGULATIONS: "Regulations",
  AGREEMENTS: "Agreements",
};

export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  MATCHING: "matching",
  SHORT_ANSWER: "short_answer",
};

export const CHALLENGE_TYPES = {
  QUIZ: "quiz",
  CALCULATION: "calculation",
  CASE_STUDY: "case_study",
  SIMULATION: "simulation",
};

export const AGREEMENT_STATUS = {
  ACTIVE: "active",
  PROPOSED: "proposed",
  EXPIRED: "expired",
  RENEGOTIATING: "renegotiating",
};

export const USER_ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  PREMIUM: "premium",
  BASIC: "basic",
};

export const SUBSCRIPTION_TIERS = {
  BASIC: "basic",
  PREMIUM: "premium",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
};

export const PROGRESS_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

// UI Constants
export const ITEMS_PER_PAGE = 10;
export const TOAST_DURATION = 5000; // milliseconds

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_DICTIONARY: "enable_dictionary",
  ENABLE_DAILY_CHALLENGE: "enable_daily_challenge",
  ENABLE_SIMULATIONS: "enable_simulations",
  ENABLE_TRADE_AGREEMENTS: "enable_trade_agreements",
  SHOW_ADS: "show_ads",
  BETA_FEATURES: "beta_features",
};