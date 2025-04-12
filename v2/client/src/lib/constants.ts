// Application information
export const APP_FULL_NAME = "TariffSmart Education";
export const APP_SHORT_NAME = "TariffEd";
export const SUPPORT_EMAIL = "support@tariffsmart.com";
export const CONTENT_LICENSE = "Creative Commons Attribution 4.0";
export const CONTENT_LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

// Navigation links
export const NAV_ITEMS = [
  { name: "Home", href: "/v2" },
  { name: "Modules", href: "/v2/modules" },
  { name: "Dictionary", href: "/v2/dictionary" },
  { name: "Trade Agreements", href: "/v2/agreements" },
  { name: "Daily Challenge", href: "/v2/challenge" }
];

// API endpoints
export const API_ENDPOINTS = {
  // Modules
  MODULES: "/modules",
  MODULE_BY_ID: (id: number) => `/modules/${id}`,
  
  // Quizzes
  QUIZZES: "/quizzes",
  QUIZ_BY_ID: (id: number) => `/quizzes/${id}`,
  QUIZ_BY_MODULE: (moduleId: number) => `/quizzes/module/${moduleId}`,
  SUBMIT_QUIZ: (id: number) => `/quizzes/${id}/submit`,
  
  // Dictionary
  DICTIONARY: "/dictionary",
  DICTIONARY_TERM: (id: number) => `/dictionary/${id}`,
  DICTIONARY_BY_CATEGORY: (category: string) => `/dictionary/category/${category}`,
  
  // Trade Agreements
  AGREEMENTS: "/agreements",
  AGREEMENT_BY_ID: (id: number) => `/agreements/${id}`,
  
  // Challenges
  DAILY_CHALLENGE: "/challenges/daily",
  COMPLETE_CHALLENGE: (id: number) => `/challenges/${id}/complete`,
  
  // User Progress
  USER_PROGRESS: "/user/progress",
  MODULE_PROGRESS: (moduleId: number) => `/user/progress/module/${moduleId}`,
};

// Challenge types
export const CHALLENGE_TYPES = {
  QUIZ: "quiz",
  FLASHCARD: "flashcard",
  MATCHING: "matching",
  TRUE_FALSE: "true_false",
};

// User roles
export const USER_ROLES = {
  GUEST: "guest",
  USER: "user",
  PREMIUM: "premium",
  EDUCATOR: "educator",
  ADMIN: "admin",
};

// Quiz types
export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  FILL_BLANK: "fill_blank",
  MATCHING: "matching",
};

// Module categories
export const MODULE_CATEGORIES = {
  TARIFFS: "tariffs",
  TRADE_POLICY: "trade_policy",
  TREATIES: "treaties",
  CUSTOMS: "customs",
  SHIPPING: "shipping",
  COMPLIANCE: "compliance",
};

// Dictionary categories
export const DICTIONARY_CATEGORIES = {
  TARIFFS: "tariffs",
  TRADE_POLICY: "trade_policy",
  SHIPPING: "shipping",
  CUSTOMS: "customs",
  REGULATIONS: "regulations",
  AGREEMENTS: "agreements",
};

export const DICTIONARY_CATEGORIES_ARRAY = Object.values(DICTIONARY_CATEGORIES);

// Progress status
export const PROGRESS_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

// Routes
export const ROUTES = {
  HOME: "/v2",
  MODULES: "/v2/modules",
  MODULE_DETAIL: (id: number) => `/v2/modules/${id}`,
  DICTIONARY: "/v2/dictionary",
  DICTIONARY_TERM: (id: number) => `/v2/dictionary/${id}`,
  AGREEMENTS: "/v2/agreements",
  AGREEMENT_DETAIL: (id: number) => `/v2/agreements/${id}`,
  CHALLENGE: "/v2/challenge",
  QUIZ: (id: number) => `/v2/quiz/${id}`,
  LOGIN: "/v2/auth/login",
  REGISTER: "/v2/auth/register",
  PROFILE: "/v2/profile",
  NOT_FOUND: "/v2/not-found",
};

// MVP Module Topics
export const MVP_MODULE_TOPICS = [
  {
    title: "Tariff Fundamentals",
    description: "Learn the basics of tariffs and their role in international trade",
    difficulty: "beginner",
    category: MODULE_CATEGORIES.TARIFFS,
    estimatedMinutes: 30,
  },
  {
    title: "Trade Policy Basics",
    description: "Introduction to trade policy principles and international agreements",
    difficulty: "beginner",
    category: MODULE_CATEGORIES.TRADE_POLICY,
    estimatedMinutes: 25,
  },
  {
    title: "Supply Chain Impacts",
    description: "Understand how tariffs affect global supply chains and business operations",
    difficulty: "intermediate",
    category: MODULE_CATEGORIES.SHIPPING,
    estimatedMinutes: 45,
  },
  {
    title: "Customs Documentation",
    description: "Essential documentation required for international shipments",
    difficulty: "intermediate",
    category: MODULE_CATEGORIES.CUSTOMS,
    estimatedMinutes: 40,
  },
  {
    title: "Tariff Calculations Advanced",
    description: "Complex methods for calculating tariff costs across different product categories",
    difficulty: "advanced",
    category: MODULE_CATEGORIES.TARIFFS,
    estimatedMinutes: 60,
  },
];