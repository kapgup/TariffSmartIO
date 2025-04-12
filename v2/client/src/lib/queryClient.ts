import { QueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from './constants';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Base API request function
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const isV2Endpoint = Object.values(API_ENDPOINTS).some(endpoint => 
    url.startsWith(endpoint)
  );

  // Add v2 prefix if it's a v2 endpoint and doesn't already have it
  const apiUrl = isV2Endpoint && !url.startsWith('/v2') 
    ? `/api/v2${url}` 
    : `/api${url}`;

  const response = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If can't parse JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(`API error (${response.status}): ${errorMessage}`);
  }

  return response.json();
}

// Mutation helper
export async function apiMutation<T, U = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  data?: U
): Promise<T> {
  return apiRequest<T>(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

// Default fetch function for useQuery
export const defaultQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
  const [url] = queryKey;
  return apiRequest(url);
};

// Configure the QueryClient with our default fetch function
queryClient.setDefaultOptions({
  queries: {
    queryFn: defaultQueryFn,
  },
});