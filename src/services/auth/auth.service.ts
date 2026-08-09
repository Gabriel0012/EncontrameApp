import { useMutation } from '@tanstack/react-query';

import { saveSession } from '@/lib/session';
import { getAuthRepository } from '@/services/auth/auth.repository';
import type { LoginPayload, SignupPayload } from '@/services/auth/auth.types';

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
