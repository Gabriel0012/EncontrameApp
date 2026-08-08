import { QueryClient } from '@tanstack/react-query';

/** Cliente único do React Query, provido no layout raiz. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});
