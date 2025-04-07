import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { FeatureFlag } from "@shared/schema";

interface FeatureFlagResponse {
  flag: {
    id: number;
    name: string;
    isEnabled: boolean;
    description: string;
  };
}

/**
 * Hook to determine if ads should be displayed based on:
 * 1. The global 'showAds' feature flag
 * 2. User's subscription status (premium users don't see ads)
 */
export function useAdsEnabled() {
  const { user, isPremium } = useAuth();
  
  // Feature flag query to check if ads are globally enabled
  const { data, isLoading, isError } = useQuery<FeatureFlagResponse>({
    queryKey: ["/api/feature-flags/showAds"],
    retry: false
  });

  // Debug logging
  console.log("Ad visibility check:", { 
    isLoading, 
    isError, 
    flagData: data?.flag,
    isEnabled: data?.flag?.isEnabled
  });

  // If user is premium, never show ads regardless of feature flag
  if (user && isPremium()) {
    console.log("Ads disabled: Premium user");
    return false;
  }

  // During loading, error, or if feature flag explicitly disables ads
  if (isLoading || isError || !data || !data.flag || data.flag.isEnabled === false) {
    console.log("Ads disabled: Feature flag is off or loading");
    return false;
  }

  // In all other cases, show ads
  return true;
}