import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthUser } from '@/services/auth/auth.types';

const TOKEN_KEY = 'encontrame.auth.token';
const USER_KEY = 'encontrame.auth.user';

export interface Session {
  token: string;
  user: AuthUser;
}

/** Cache em memória para o interceptor do axios (storage é async). */
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
  const [token, userJson] = await Promise.all([storageGet(TOKEN_KEY), storageGet(USER_KEY)]);

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
    storageSet(TOKEN_KEY, session.token),
    storageSet(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function clearSession(): Promise<void> {
  memoryToken = null;
  memoryUser = null;
  await Promise.all([storageDelete(TOKEN_KEY), storageDelete(USER_KEY)]);
}

/**
 * SecureStore só funciona em iOS/Android nativo.
 * No web (ou se o módulo nativo falhar), usa localStorage / memória.
 */
async function storageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webGet(key);
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return webGet(key);
  }
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    webSet(key, value);
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    webSet(key, value);
  }
}

async function storageDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    webDelete(key);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    webDelete(key);
  }
}

function webGet(key: string): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function webSet(key: string, value: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  } catch {
    // Sem storage persistente — fica só o cache em memória.
  }
}

function webDelete(key: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
