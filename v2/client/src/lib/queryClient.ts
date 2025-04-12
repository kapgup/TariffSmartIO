import { QueryClient } from '@tanstack/react-query';

const BASE_URL = '/v2/api';

export async function apiRequest<TData = unknown, TError = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<TData> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.error || 'An error occurred',
      data: errorData,
    } as TError;
  }

  // If no content, return empty object
  if (response.status === 204) {
    return {} as TData;
  }

  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        const [url] = queryKey as [string, ...unknown[]];
        return apiRequest(url);
      },
    },
  },
});

// Wrapper around apiRequest for post/put/patch/delete mutations
export async function apiMutation<TData = unknown, TVars = unknown, TError = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  variables?: TVars
): Promise<TData> {
  return apiRequest<TData, TError>(url, {
    method,
    body: variables ? JSON.stringify(variables) : undefined,
  });
}