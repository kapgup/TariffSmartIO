import { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Global query client instance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Error type from API responses
 */
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

/**
 * Type guard for API errors
 */
export function isApiError(obj: any): obj is ApiError {
  return (
    obj && 
    typeof obj === 'object' && 
    'message' in obj && 
    'status' in obj
  );
}

/**
 * Base URL for API requests
 */
const API_BASE_URL = '/v2/api';

/**
 * Fetch wrapper for API requests
 * @param endpoint - API endpoint to fetch
 * @param init - Fetch init options
 * @returns Promise with the parsed response data
 */
export async function apiFetch<T = any>(
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  });

  // For non-JSON responses, return the Response object
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return response as unknown as T;
  }

  const data = await response.json();

  // Handle error responses
  if (!response.ok) {
    const error = data.error || { message: 'An unknown error occurred', status: response.status };
    throw error;
  }

  return data;
}

/**
 * API request for mutations (POST, PATCH, DELETE)
 * @param endpoint - API endpoint to call
 * @param method - HTTP method
 * @param data - Request body data
 * @returns Promise with the parsed response data
 */
export async function apiRequest<TData = any, TResult = any>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  data?: TData
): Promise<TResult> {
  return apiFetch<TResult>(endpoint, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Helper to invalidate a query by key
 * @param queryKey - Query key to invalidate
 */
export function invalidateQuery(queryKey: QueryKey): void {
  queryClient.invalidateQueries({ queryKey });
}

/**
 * Helper to set query data directly
 * @param queryKey - Query key to update
 * @param data - New data
 */
export function setQueryData<T>(queryKey: QueryKey, data: T): void {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Default query function that can be used with useQuery
 * @param queryKey - Query key array
 * @returns Promise with the parsed response data
 */
export const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
  // Convert query key to a path string
  // For example: ['/users', 1, 'posts'] becomes '/users/1/posts'
  const endpoint = queryKey.join('/').replace(/\/+/g, '/');
  return apiFetch(endpoint);
};

/**
 * Resets the entire query cache
 */
export function resetQueryCache(): void {
  queryClient.resetQueries();
}

/**
 * Prefetch data for a specific query
 * @param queryKey - Query key to prefetch
 */
export async function prefetchQuery(queryKey: QueryKey): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => defaultQueryFn({ queryKey }),
  });
}