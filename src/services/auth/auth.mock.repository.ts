import type { AuthRepository } from '@/services/auth/auth.repository';
import type { AuthResult, LoginPayload, SignupPayload } from '@/services/auth/auth.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Implementação mockada: permite desenvolver sem depender da API. */
export const authMockRepository: AuthRepository = {
  async login(payload: LoginPayload) {
    await delay(600);
    return {
      accessToken: 'mock-access-token-login',
      refreshToken: 'mock-refresh-token-login',
      user: {
        id: 'mock-user-1',
        name: 'Usuário Mock',
        email: payload.identifier.includes('@') ? payload.identifier : 'mock@encontra.me',
      },
    } satisfies AuthResult;
  },

  async signup(payload: SignupPayload) {
    await delay(600);
    return {
      accessToken: 'mock-access-token-signup',
      refreshToken: 'mock-refresh-token-signup',
      user: {
        id: 'mock-user-new',
        name: payload.name || 'Novo Usuário',
        email: payload.email || 'novo@encontra.me',
      },
    } satisfies AuthResult;
  },

  async refresh(_refreshToken: string) {
    await delay(300);
    return {
      accessToken: 'mock-access-token-refreshed',
      refreshToken: 'mock-refresh-token-refreshed',
      user: {
        id: 'mock-user-1',
        name: 'Usuário Mock',
        email: 'mock@encontra.me',
      },
    } satisfies AuthResult;
  },

  async logout(_refreshToken: string | null) {
    await delay(100);
  },
};
