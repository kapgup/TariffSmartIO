// Types for the frontend application

export interface Country {
  id: number;
  name: string;
  baseTariff: number;
  reciprocalTariff: number;
  effectiveDate: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  primaryCountries: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  originCountry: string;
  currentPrice: number | null;
  estimatedIncrease: number;
  impactLevel: string;
}

export interface FeatureFlag {
  id: number;
  name: string;
  isEnabled: boolean;
  description: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  isSubscribed?: boolean;
  role?: string;
}

export interface CalculatorInput {
  category: string;
  amount: number;
  country: string;
}

export interface CalculationResult {
  category: string;
  amount: number;
  country: string;
  originalTariff: number;
  reciprocalTariff: number;
  totalTariff: number;
  increase: string;
  error?: string;
}

export interface CalculationSummary {
  calculations: CalculationResult[];
  totalSpending: number;
  totalIncrease: string;
  percentageIncrease: string;
}

export interface ProductFilter {
  category: string;
  country: string;
  tariffRange: string;
  searchQuery: string;
}
