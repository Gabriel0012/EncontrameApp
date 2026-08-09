import { create as createAxios } from 'axios';

import { env } from '@/lib/env';
import type { AuthRepository } from '@/services/auth/auth.repository';
import type { AuthResult, LoginPayload, SignupPayload } from '@/services/auth/auth.types';

interface ApiAuthResponse {
  accessToken?: string;
  refreshToken?: string;
  /** Campo legado — algumas versões da API ainda enviam `token`. */
  token?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Cliente sem interceptor de refresh — usado só para login/register/refresh/logout
 * e evita dependência circular com @/lib/axios.
 */
const authApi = createAxios({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Implementação real: fala com a EncontrameApi via axios. */
export const authAxiosRepository: AuthRepository = {
  async login(payload: LoginPayload) {
    const { data } = await authApi.post<ApiAuthResponse>('/Auth/login', {
      identifier: payload.identifier,
      password: payload.password,
    });
    return mapAuthResult(data);
  },

  async signup(payload: SignupPayload) {
    const { data } = await authApi.post<ApiAuthResponse>('/Auth/register', {
      name: payload.name,
      document: payload.cpf,
      email: payload.email,
      cellPhone: payload.phone,
      cep: payload.cep,
      password: payload.password,
    });
    return mapAuthResult(data);
  },

  async refresh(refreshToken: string) {
    const { data } = await authApi.post<ApiAuthResponse>('/Auth/refresh', {
      refreshToken,
    });
    return mapAuthResult(data);
  },

  async logout(refreshToken: string | null) {
    try {
      await authApi.post('/Auth/logout', { refreshToken: refreshToken ?? undefined });
    } catch {
      // Best-effort: limpar sessão local mesmo se a API falhar.
    }
  },
};

function mapAuthResult(data: ApiAuthResponse): AuthResult {
  const accessToken = data.accessToken || data.token || '';
  const refreshToken = data.refreshToken || '';

  if (!accessToken) {
    throw new Error('Resposta de autenticação sem accessToken.');
  }

  return {
    accessToken,
    refreshToken,
    user: {
      id: String(data.user.id),
      name: data.user.name,
      email: data.user.email,
    },
  };
}
