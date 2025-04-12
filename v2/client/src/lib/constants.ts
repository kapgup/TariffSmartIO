export const APP_NAME = "TariffSmart";
export const APP_VERSION = "v2";
export const APP_FULL_NAME = `${APP_NAME} ${APP_VERSION}`;

// Navigation items
export const NAV_ITEMS = [
  { name: "Home", path: "/v2" },
  { name: "Learning Modules", path: "/v2/modules" },
  { name: "Trade Dictionary", path: "/v2/dictionary" },
  { name: "Trade Agreements", path: "/v2/agreements" },
  { name: "Daily Challenge", path: "/v2/challenge" },
];

// Learning module difficulty levels
export const MODULE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate", 
  ADVANCED: "advanced"
};

// Quiz types
export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: "multiple-choice",
  TRUE_FALSE: "true-false",
  MYTH_VS_FACT: "myth-vs-fact"
};

// Dictionary categories
export const DICTIONARY_CATEGORIES = [
  "All Categories",
  "Basic Concepts",
  "Trade Policies",
  "Trade Restrictions",
  "International Organizations",
  "Trade Agreements",
  "Import/Export"
];

// Simulation types
export const SIMULATION_TYPES = {
  TARIFF_IMPACT: "tariff-impact",
  SUPPLY_DEMAND: "supply-demand",
  TRADE_BALANCE: "trade-balance"
};

// Challenge types
export const CHALLENGE_TYPES = {
  TERM: "term",
  QUIZ: "quiz",
  FACT: "fact"
};

// Analytics events
export const ANALYTICS_EVENTS = {
  MODULE_START: "module_start",
  MODULE_COMPLETE: "module_complete",
  QUIZ_START: "quiz_start",
  QUIZ_COMPLETE: "quiz_complete",
  DICTIONARY_TERM_VIEW: "dictionary_term_view",
  CHALLENGE_COMPLETE: "challenge_complete"
};

// Sample module topics (for MVP)
export const MVP_MODULE_TOPICS = [
  "What are Tariffs?",
  "Understanding Free Trade",
  "Protectionism vs. Open Markets",
  "Supply Chains 101",
  "How Trade Affects Prices"
];

// Content license information
export const CONTENT_LICENSE = "Creative Commons Attribution-NonCommercial 4.0 International License";
export const CONTENT_LICENSE_URL = "https://creativecommons.org/licenses/by-nc/4.0/";

// Support contact
export const SUPPORT_EMAIL = "support@tariffsmart.io";