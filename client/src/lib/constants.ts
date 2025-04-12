export const APP_NAME = "TariffSmart";

// Implementation dates
export const BASELINE_TARIFF_DATE = "April 5, 2025";
export const CHINA_TARIFF_DATE = "April 9, 2025";
export const OTHER_COUNTRIES_TARIFF_DATE = "July 8, 2025";
export const CHINA_RETAIL_PRICE_CHANGE_PERIOD = "Late April - May 2025";
export const OTHER_COUNTRIES_RETAIL_PRICE_CHANGE_PERIOD = "October - November 2025";

// Legacy names (for backward compatibility)
export const RECIPROCAL_TARIFF_DATE = CHINA_TARIFF_DATE;
export const RETAIL_PRICE_CHANGE_PERIOD = CHINA_RETAIL_PRICE_CHANGE_PERIOD;

// Tariff impacts
export const IMPACT_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high"
};

// Navigation items
export const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Calculator", path: "/calculator" },
  { name: "Products", path: "/products" },
  { name: "Countries", path: "/countries" },
  { name: "Timeline", path: "/timeline" },
  { name: "About", path: "/about" }
];

// Product Categories for filters
export const PRODUCT_CATEGORIES = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Home Goods",
  "Food & Beverages",
  "Automotive"
];

// Countries for filters
export const COUNTRIES = [
  "All Countries",
  "China",
  "European Union",
  "Mexico",
  "Canada",
  "Japan",
  "Vietnam",
  "South Korea",
  "Germany",
  "Bangladesh"
];

// Tariff rate ranges for filters
export const TARIFF_RANGES = [
  "All Tariff Rates",
  "10-20%",
  "21-30%",
  "31-40%",
  "41%+"
];

// Calculator form default categories
export const CALCULATOR_CATEGORIES = [
  "Electronics",
  "Clothing & Apparel",
  "Furniture & Home Goods",
  "Imported Food & Beverages", 
  "Automotive & Parts"
];

// Feature flag names
export const FEATURE_FLAGS = {
  PRODUCT_FILTERING: "productFiltering",
  TARIFF_CALCULATOR: "tariffCalculator",
  AUTHENTICATION: "authentication",
  EMAIL_ALERTS: "emailAlerts",
  ALTERNATIVE_PRODUCTS: "alternativeProducts"
};

// Google Analytics ID
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "G-0EJNCJ1GWF";
