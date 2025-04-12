import { useQuery } from '@tanstack/react-query';
import { FeatureFlagResponse } from '../lib/types';

/**
 * Custom hook to check if a feature flag is enabled
 * @param flagName - Name of the feature flag to check
 * @returns Object with flag status and loading state
 */
export function useFeatureFlag(flagName: string) {
  const { 
    data,
    isLoading,
    isError,
    error,
  } = useQuery<FeatureFlagResponse>({
    queryKey: ['feature-flags', flagName],
    enabled: !!flagName,
  });

  // Get flag status, default to false if loading or error
  const isEnabled = data?.isEnabled || false;
  const flagData = data?.flag;

  return {
    isEnabled,
    flagData,
    isLoading,
    isError,
    error,
  };
}