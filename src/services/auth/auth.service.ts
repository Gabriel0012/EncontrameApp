import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import {
  clearSession,
  peekStoredSession,
  saveSession,
  unlockSession,
} from '@/lib/session';
import { getAuthRepository } from '@/services/auth/auth.repository';
import type {
  AuthResult,
  GoogleRegisterPayload,
  LoginPayload,
  SignupPayload,
} from '@/services/auth/auth.types';
import { syncLocalPeople } from '@/services/people/people.sync';

/**
 * Camada de acesso à API de autenticação exposta como hooks do React Query.
 * O repositório (axios ou mock) é resolvido por env dentro de cada chamada.
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const result = await getAuthRepository().login(payload);
      await saveSession(result);
      await syncLocalPeople();
      return result;
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const result = await getAuthRepository().signup(payload);
      await saveSession(result);
      await syncLocalPeople();
      return result;
    },
  });
}

export function useGoogleStartMutation() {
  return useMutation({
    mutationFn: async (idToken: string) => {
      const result = await getAuthRepository().googleStart(idToken);
      if (result.status === 'authenticated') {
        await saveSession(result.session);
        await syncLocalPeople();
      }
      return result;
    },
  });
}

export function useGoogleRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: GoogleRegisterPayload) => {
      const result = await getAuthRepository().googleRegister(payload);
      await saveSession(result);
      await syncLocalPeople();
      return result;
    },
  });
}

/** Destrava a sessão persistida e renova o par de tokens via /Auth/refresh. */
export async function unlockAndRefreshSession(): Promise<AuthResult> {
  const session = await unlockSession();
  if (!session) {
    throw new Error('Sessão biométrica ausente.');
  }

  const result = await getAuthRepository().refresh(session.refreshToken);
  const user = result.user ?? session.user;

  if (!result.accessToken || !result.refreshToken) {
    throw new Error('Resposta de refresh incompleta.');
  }

  const next: AuthResult = {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user,
  };
  await saveSession(next);
  await syncLocalPeople();
  return next;
}

/** Logout completo: revoga o refresh persistido e apaga tokens + biometria. */
export async function revokeStoredSession(): Promise<void> {
  const stored = await peekStoredSession();
  try {
    await getAuthRepository().logout(stored?.refreshToken ?? null);
  } finally {
    await clearSession();
    queryClient.clear();
  }
}
