import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Helper function to make API requests with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = '/api/v2'; // Prefix for v2 API endpoints
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
    }
  }
  
  // For 204 No Content responses, return empty object
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json() as Promise<T>;
}

/**
 * Helper function for API mutations (POST, PUT, DELETE)
 */
export async function apiMutation<T, U = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  data?: U
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Default query function that can be used with useQuery
 * It automatically handles errors and parsing JSON
 *
 * Usage:
 * ```
 * const { data } = useQuery({ 
 *   queryKey: ['/api/modules'], 
 *   queryFn: defaultQueryFn 
 * });
 * ```
 */
export const defaultQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
  const [endpoint, ...params] = queryKey;
  if (!endpoint) {
    throw new Error('Query key must include an endpoint');
  }
  
  return apiRequest<unknown>(endpoint);
};