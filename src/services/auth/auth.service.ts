import { useMutation } from '@tanstack/react-query';

import { saveSession } from '@/lib/session';
import { getAuthRepository } from '@/services/auth/auth.repository';
import type { GoogleRegisterPayload, LoginPayload, SignupPayload } from '@/services/auth/auth.types';

/**
 * Camada de acesso à API de autenticação exposta como hooks do React Query.
 * O repositório (axios ou mock) é resolvido por env dentro de cada chamada.
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const result = await getAuthRepository().login(payload);
      await saveSession(result);
      return result;
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const result = await getAuthRepository().signup(payload);
      await saveSession(result);
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
      return result;
    },
  });
}
