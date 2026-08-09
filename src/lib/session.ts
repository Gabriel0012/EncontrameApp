import * as SecureStore from 'expo-secure-store';

import type { AuthUser } from '@/services/auth/auth.types';

const TOKEN_KEY = 'encontrame.auth.token';
const USER_KEY = 'encontrame.auth.user';

export interface Session {
  token: string;
  user: AuthUser;
}

/** Cache em memória para o interceptor do axios (SecureStore é async). */
let memoryToken: string | null = null;
let memoryUser: AuthUser | null = null;

export function getAccessToken(): string | null {
  return memoryToken;
}

export function getSessionUser(): AuthUser | null {
  return memoryUser;
}

/** Carrega token/usuário persistidos para a memória (chamar no boot do app). */
export async function hydrateSession(): Promise<Session | null> {
  const [token, userJson] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  if (!token || !userJson) {
    memoryToken = null;
    memoryUser = null;
    return null;
  }

  try {
    const user = JSON.parse(userJson) as AuthUser;
    memoryToken = token;
    memoryUser = user;
    return { token, user };
  } catch {
    await clearSession();
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  memoryToken = session.token;
  memoryUser = session.user;
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, session.token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function clearSession(): Promise<void> {
  memoryToken = null;
  memoryUser = null;
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
