import { create as createAxios, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { notifyApiError } from '@/lib/api-error-events';
import { apiErrorDisplayMessage } from '@/lib/api-errors';
import { notifySessionExpired } from '@/lib/auth-events';
import { env } from '@/lib/env';
import {
  clearSession,
  ensureSessionHydrated,
  getAccessToken,
  getRefreshToken,
  getSessionUser,
  saveSession,
} from '@/lib/session';
import { getAuthRepository } from '@/services/auth/auth.repository';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

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

/** Uma promise compartilhada evita vários refreshes em paralelo. */
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';
    const shouldRetry401 =
      Boolean(original) && status === 401 && !original?._retry && !isAuthPublicPath(url);

    if (shouldRetry401 && original) {
      original._retry = true;

      try {
        const accessToken = await refreshAccessTokenShared();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        await clearSession();
        notifySessionExpired();
        return Promise.reject(refreshError);
      }
    }

    if (!url.includes('/Auth/refresh') && !url.includes('/Auth/logout')) {
      notifyApiError(apiErrorDisplayMessage(error));
    }
    return Promise.reject(error);
  },
);

function isAuthPublicPath(url: string) {
  return (
    url.includes('/Auth/login') ||
    url.includes('/Auth/register') ||
    url.includes('/Auth/refresh') ||
    url.includes('/Auth/logout')
  );
}

async function refreshAccessTokenShared(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      // Pós-F5 a memória pode estar vazia: relê o storage antes de desistir.
      await ensureSessionHydrated();

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token ausente.');
      }

      const result = await getAuthRepository().refresh(refreshToken);
      const user = result.user ?? getSessionUser();
      if (!user) {
        throw new Error('Usuário da sessão ausente.');
      }

      if (!result.accessToken || !result.refreshToken) {
        throw new Error('Resposta de refresh incompleta.');
      }

      await saveSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user,
      });

      return result.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
