import { create as createAxios } from 'axios';

import { env } from '@/lib/env';
import { getAccessToken } from '@/lib/session';

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

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
