import { QueryClient } from '@tanstack/react-query';

/**
 * Base API URL for the v2 platform
 */
const API_BASE_URL = '/v2/api';

/**
 * HTTP methods supported by the API
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Default fetch function for React Query
 * @param endpoint - API endpoint path
 * @returns Promise with response data
 */
export const defaultFetcher = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

/**
 * API request function for mutations
 * @param endpoint - API endpoint path
 * @param method - HTTP method
 * @param data - Request body data
 * @returns Promise with response data
 */
export const apiRequest = async <TData = any, TResponse = any>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data?: TData
): Promise<TResponse> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `API error: ${response.status} ${response.statusText}`
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text() as unknown as TResponse;
};

/**
 * Invalidate a query in the React Query cache
 * @param queryKey - Query key to invalidate
 */
export const invalidateQuery = (queryKey: unknown[]) => {
  queryClient.invalidateQueries({ queryKey });
};

/**
 * React Query client instance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      queryFn: ({ queryKey }) => {
        // Handle array query keys by joining them with slashes
        const endpoint = queryKey
          .map((segment) => (typeof segment === 'string' ? segment : JSON.stringify(segment)))
          .join('/');
        
        return defaultFetcher(endpoint);
      },
    },
  },
});