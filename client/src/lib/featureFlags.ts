import { useQuery } from '@tanstack/react-query';
import { FeatureFlag } from '@shared/schema';
import { queryClient } from './queryClient';

/**
 * Hook to check if a feature flag is enabled
 * 
 * @param featureName The name of the feature flag to check
 * @param defaultValue Optional default value if the flag doesn't exist (defaults to false)
 * @returns Boolean indicating if the feature is enabled
 */
export function useFeatureFlag(featureName: string, defaultValue: boolean = false): boolean {
  const { data, isLoading } = useQuery<{ flag: FeatureFlag }>({
    queryKey: [`/api/feature-flags/${featureName}`],
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // If loading or error, return the default value
  if (isLoading || !data) {
    return defaultValue;
  }

  return data.flag?.isEnabled ?? defaultValue;
}

/**
 * Function to fetch all feature flags
 * 
 * @returns Promise with an array of feature flags
 */
export async function fetchAllFeatureFlags(): Promise<FeatureFlag[]> {
  try {
    const response = await fetch('/api/feature-flags');
    if (!response.ok) {
      throw new Error('Failed to fetch feature flags');
    }
    const data = await response.json();
    return data.flags;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return [];
  }
}

/**
 * Function to invalidate feature flag cache
 * 
 * @param featureName Optional specific feature flag to invalidate, or all if not provided
 */
export function invalidateFeatureFlags(featureName?: string): void {
  if (featureName) {
    queryClient.invalidateQueries({ queryKey: [`/api/feature-flags/${featureName}`] });
  } else {
    queryClient.invalidateQueries({ queryKey: ['/api/feature-flags'] });
  }
}