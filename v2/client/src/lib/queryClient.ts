/**
 * TanStack Query client configuration for TariffSmart Education (v2)
 */

import { QueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS, TOAST_DURATION } from './constants';
import { ApiError } from './types';

// Global fetch wrapper for making API requests with error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Replace any parameter tokens in the endpoint (e.g. :id)
    const url = endpoint.includes('/api/') 
      ? endpoint 
      : `/api/${endpoint}`;
    
    const mergedOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, mergedOptions);
    
    // Handle API error responses
    if (!response.ok) {
      // Try to parse error response as JSON
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch (e) {
        // If parsing fails, create a generic error
        errorData = {
          statusCode: response.status,
          message: response.statusText || 'An unexpected error occurred',
        };
      }
      
      throw errorData;
    }
    
    // Parse JSON response if any
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    // Return an empty object for non-JSON responses
    return {} as T;
  } catch (error) {
    // Rethrow ApiError instances directly
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error;
    }
    
    // Convert other errors to ApiError format
    throw {
      statusCode: 500,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      details: { error },
    } as ApiError;
  }
}

// Configure the global query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Use our custom fetcher by default
      queryFn: async ({ queryKey }) => {
        // Support both string and array queryKey formats
        const endpoint = Array.isArray(queryKey) 
          ? queryKey.join('/').replace(/\/+/g, '/') 
          : queryKey as string;
        
        return apiRequest(endpoint);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Don't retry failed mutations by default
      retry: 0,
    },
  },
});

/**
 * Helper function to format API endpoint with path parameters
 * @example
 * const endpoint = formatEndpoint(API_ENDPOINTS.MODULE_BY_ID, { id: '123' });
 * // Result: '/api/v2/modules/123'
 */
export function formatEndpoint(endpoint: string, params: Record<string, string | number>): string {
  let result = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
}

/**
 * Helper to generate prefixed query keys
 * @example
 * const key = createQueryKey('modules');
 * // Result: ['v2', 'modules']
 * 
 * const detailKey = createQueryKey('modules', '123');
 * // Result: ['v2', 'modules', '123']
 */
export function createQueryKey(base: string, ...parts: (string | number)[]): string[] {
  return ['v2', base, ...parts.map(part => String(part))];
}

/**
 * Handle API errors in a consistent way
 */
export function handleApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if ('statusCode' in error && 'message' in error) {
      const apiError = error as ApiError;
      return `Error ${apiError.statusCode}: ${apiError.message}`;
    }
  }
  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Sleep utility for simulating API delays in development
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}