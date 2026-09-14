import { useSyncExternalStore } from 'react';

import { getSessionUser, subscribeSession } from '@/lib/session';
import type { AuthUser } from '@/services/auth/auth.types';

/** Usuário da sessão em memória; atualiza a UI quando login/logout muda o cache. */
export function useSessionUser(): AuthUser | null {
  return useSyncExternalStore(subscribeSession, getSessionUser, getSessionUser);
}
