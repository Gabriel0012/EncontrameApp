import type { AuthRepository } from '@/services/auth/auth.repository';
import type {
  AuthResult,
  GoogleRegisterPayload,
  GoogleStartResult,
  LoginPayload,
  SignupPayload,
} from '@/services/auth/auth.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const EXISTING_GOOGLE_EMAIL = 'google@encontra.me';

function decodeGoogleProfile(idToken: string): { email: string; name: string } {
  try {
    const part = idToken.split('.')[1];
    if (!part) throw new Error('token');
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const json = globalThis.atob(padded);
    const payload = JSON.parse(json) as { email?: string; name?: string };
    return {
      email: payload.email ?? 'novo.google@encontra.me',
      name: payload.name ?? 'Usuário Google',
    };
  } catch {
    return { email: 'novo.google@encontra.me', name: 'Usuário Google' };
  }
}

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

  async googleStart(idToken: string): Promise<GoogleStartResult> {
    await delay(400);
    const profile = decodeGoogleProfile(idToken);
    if (profile.email.toLowerCase() === EXISTING_GOOGLE_EMAIL) {
      return {
        status: 'authenticated',
        session: {
          accessToken: 'mock-access-token-google',
          refreshToken: 'mock-refresh-token-google',
          user: {
            id: 'mock-google-user',
            name: profile.name,
            email: profile.email,
          },
        },
      };
    }

    return { status: 'needsRegistration', profile };
  },

  async googleRegister(payload: GoogleRegisterPayload) {
    await delay(600);
    return {
      accessToken: 'mock-access-token-google-register',
      refreshToken: 'mock-refresh-token-google-register',
      user: {
        id: 'mock-google-new',
        name: payload.name || 'Novo Usuário Google',
        email: decodeGoogleProfile(payload.idToken).email,
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
