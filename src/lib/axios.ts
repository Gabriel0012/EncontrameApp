import { create as createAxios } from 'axios';

import { env } from '@/lib/env';

/**
 * Instância única do axios usada pelos repositórios *.axios.repository.ts.
 * A baseURL vem da env EXPO_PUBLIC_API_URL.
 */
export const api = createAxios({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
