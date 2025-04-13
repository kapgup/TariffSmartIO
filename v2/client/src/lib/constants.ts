/**
 * Application name
 */
export const APP_NAME = 'TariffSmart';

/**
 * Application version
 */
export const APP_VERSION = 'v2.0.0';

/**
 * Application description
 */
export const APP_DESCRIPTION = 'Educational platform for understanding international trade and tariffs';

/**
 * Support email
 */
export const SUPPORT_EMAIL = 'support@tariffsmart.com';

/**
 * Content license
 */
export const CONTENT_LICENSE = 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License';

/**
 * Content license URL
 */
export const CONTENT_LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';

/**
 * Copyright year
 */
export const COPYRIGHT_YEAR = new Date().getFullYear().toString();

/**
 * Default page size for paginated content
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * URL paths
 */
export const PATHS = {
  HOME: '/v2',
  MODULES: '/v2/modules',
  MODULE_DETAIL: '/v2/modules/:slug',
  DICTIONARY: '/v2/dictionary',
  DICTIONARY_TERM: '/v2/dictionary/:slug',
  AGREEMENTS: '/v2/agreements',
  AGREEMENT_DETAIL: '/v2/agreements/:slug',
  CHALLENGE: '/v2/challenge',
  QUIZ: '/v2/quiz/:id',
  DASHBOARD: '/v2/dashboard',
  LOGIN: '/v2/login',
  REGISTER: '/v2/register',
  PROFILE: '/v2/profile',
  CERTIFICATES: '/v2/certificates',
  BADGES: '/v2/badges',
  ABOUT: '/v2/about',
  TERMS: '/v2/terms',
  PRIVACY: '/v2/privacy',
  NOT_FOUND: '/v2/404',
};

/**
 * Navigation items
 */
export const NAV_ITEMS = [
  { 
    name: 'Home', 
    path: PATHS.HOME,
    public: true
  },
  { 
    name: 'Learning Modules', 
    path: PATHS.MODULES,
    public: true 
  },
  { 
    name: 'Trade Dictionary', 
    path: PATHS.DICTIONARY,
    public: true 
  },
  { 
    name: 'Agreements', 
    path: PATHS.AGREEMENTS,
    public: true 
  },
  { 
    name: 'Daily Challenge', 
    path: PATHS.CHALLENGE,
    public: false 
  },
  { 
    name: 'Dashboard', 
    path: PATHS.DASHBOARD,
    public: false 
  },
];

/**
 * Footer links
 */
export const FOOTER_LINKS = [
  { name: 'About', path: PATHS.ABOUT },
  { name: 'Terms', path: PATHS.TERMS },
  { name: 'Privacy', path: PATHS.PRIVACY },
];

/**
 * Module categories with display names
 */
export const MODULE_CATEGORIES = {
  TARIFFS: 'Tariffs',
  TRADE_POLICY: 'Trade Policy',
  CUSTOMS: 'Customs',
  SHIPPING: 'Shipping',
  REGULATIONS: 'Regulations',
  AGREEMENTS: 'Trade Agreements',
};

/**
 * Dictionary categories with display names
 */
export const DICTIONARY_CATEGORIES = {
  TARIFFS: 'Tariffs',
  TRADE_POLICY: 'Trade Policy',
  CUSTOMS: 'Customs',
  SHIPPING: 'Shipping',
  REGULATIONS: 'Regulations',
  AGREEMENTS: 'Trade Agreements',
};

/**
 * Difficulty levels with display names and colors
 */
export const DIFFICULTY_LEVELS = {
  BEGINNER: { 
    name: 'Beginner', 
    value: 'beginner',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: 'Star' 
  },
  INTERMEDIATE: { 
    name: 'Intermediate', 
    value: 'intermediate',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'Stars' 
  },
  ADVANCED: { 
    name: 'Advanced', 
    value: 'advanced',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: 'Award' 
  },
};

/**
 * User roles with display names and colors
 */
export const USER_ROLES = {
  ADMIN: { 
    name: 'Admin', 
    value: 'admin',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  EDITOR: { 
    name: 'Editor', 
    value: 'editor',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  PREMIUM: { 
    name: 'Premium', 
    value: 'premium',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  BASIC: { 
    name: 'Basic', 
    value: 'basic',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

/**
 * Agreement statuses with display names and colors
 */
export const AGREEMENT_STATUSES = {
  ACTIVE: { 
    name: 'Active', 
    value: 'active',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  EXPIRED: { 
    name: 'Expired', 
    value: 'expired',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  PROPOSED: { 
    name: 'Proposed', 
    value: 'proposed',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  RENEGOTIATING: { 
    name: 'Renegotiating', 
    value: 'renegotiating',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
};

/**
 * Features that require authentication
 */
export const AUTHENTICATED_FEATURES = [
  PATHS.DASHBOARD,
  PATHS.PROFILE,
  PATHS.CERTIFICATES,
  PATHS.BADGES,
  PATHS.CHALLENGE,
];

/**
 * Features that require premium subscription
 */
export const PREMIUM_FEATURES = [
  'advanced-quizzes',
  'certificate-export',
  'custom-learning-path',
];

/**
 * Default profile picture URL (placeholder)
 */
export const DEFAULT_PROFILE_PICTURE = 'https://via.placeholder.com/150';

/**
 * Format date string to a human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
}

/**
 * Daily challenge types with display names and descriptions
 */
export const CHALLENGE_TYPES = {
  QUIZ: {
    name: 'Quiz Challenge',
    value: 'quiz',
    description: 'Test your knowledge with a short quiz on tariff and trade topics',
    icon: 'HelpCircle',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  ANALYSIS: {
    name: 'Trade Analysis',
    value: 'analysis',
    description: 'Analyze a trade scenario and make the best decision',
    icon: 'BarChart2',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  CALCULATION: {
    name: 'Tariff Calculation',
    value: 'calculation',
    description: 'Calculate complex tariffs based on product category and country of origin',
    icon: 'Calculator',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  RESEARCH: {
    name: 'Trade Research',
    value: 'research',
    description: 'Research and report on a current trade issue or policy',
    icon: 'Search',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
};