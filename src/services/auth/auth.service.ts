import { useMutation } from '@tanstack/react-query';

import { getAuthRepository } from '@/services/auth/auth.repository';
import type { LoginPayload, SignupPayload } from '@/services/auth/auth.types';

/**
 * Camada de acesso à API de autenticação exposta como hooks do React Query.
 * O repositório (axios ou mock) é resolvido por env dentro de cada chamada.
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => getAuthRepository().login(payload),
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => getAuthRepository().signup(payload),
  });
}
