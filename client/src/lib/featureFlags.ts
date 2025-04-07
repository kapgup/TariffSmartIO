import { useQuery } from "@tanstack/react-query";
import { FEATURE_FLAGS } from "./constants";
import { FeatureFlag } from "./types";

// Feature flag hook to check if a feature is enabled
export function useFeatureFlag(flagName: string): boolean {
  const { data } = useQuery<{ flag: FeatureFlag }>({ 
    queryKey: [`/api/feature-flags/${flagName}`],
    suspense: false,
    retry: false,
    staleTime: 60000 // 1 minute
  });
  
  return data?.flag?.isEnabled ?? false;
}

// Hook to check if the calculator feature is enabled
export function useCalculatorFeature(): boolean {
  return useFeatureFlag(FEATURE_FLAGS.TARIFF_CALCULATOR);
}

// Hook to check if product filtering is enabled
export function useProductFilteringFeature(): boolean {
  return useFeatureFlag(FEATURE_FLAGS.PRODUCT_FILTERING);
}

// Hook to check if authentication is enabled
export function useAuthenticationFeature(): boolean {
  return useFeatureFlag(FEATURE_FLAGS.AUTHENTICATION);
}

// Hook to check if email alerts are enabled
export function useEmailAlertsFeature(): boolean {
  return useFeatureFlag(FEATURE_FLAGS.EMAIL_ALERTS);
}

// Hook to check if alternative products are enabled
export function useAlternativeProductsFeature(): boolean {
  return useFeatureFlag(FEATURE_FLAGS.ALTERNATIVE_PRODUCTS);
}

// All features hook
export function useFeatureFlags() {
  const { data } = useQuery<{ flags: FeatureFlag[] }>({
    queryKey: ['/api/feature-flags'],
    suspense: false
  });
  
  const flags = data?.flags || [];
  
  // Convert array to object for easier access
  const flagsMap = flags.reduce((acc, flag) => {
    acc[flag.name] = flag.isEnabled;
    return acc;
  }, {} as Record<string, boolean>);
  
  return {
    flags: flagsMap,
    isCalculatorEnabled: flagsMap[FEATURE_FLAGS.TARIFF_CALCULATOR] ?? true,
    isProductFilteringEnabled: flagsMap[FEATURE_FLAGS.PRODUCT_FILTERING] ?? true,
    isAuthenticationEnabled: flagsMap[FEATURE_FLAGS.AUTHENTICATION] ?? false,
    isEmailAlertsEnabled: flagsMap[FEATURE_FLAGS.EMAIL_ALERTS] ?? false,
    isAlternativeProductsEnabled: flagsMap[FEATURE_FLAGS.ALTERNATIVE_PRODUCTS] ?? false
  };
}
