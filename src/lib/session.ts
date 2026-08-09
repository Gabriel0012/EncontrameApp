import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthUser } from '@/services/auth/auth.types';

const ACCESS_TOKEN_KEY = 'encontrame.auth.accessToken';
const REFRESH_TOKEN_KEY = 'encontrame.auth.refreshToken';
const USER_KEY = 'encontrame.auth.user';

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/** Cache em memória para o interceptor do axios (storage é async). */
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;
let memoryUser: AuthUser | null = null;

export function getAccessToken(): string | null {
  return memoryAccessToken;
}

export function getRefreshToken(): string | null {
  return memoryRefreshToken;
}

export function getSessionUser(): AuthUser | null {
  return memoryUser;
}

/** Carrega tokens/usuário persistidos para a memória (chamar no boot do app). */
export async function hydrateSession(): Promise<Session | null> {
  const [accessToken, refreshToken, userJson] = await Promise.all([
    storageGet(ACCESS_TOKEN_KEY),
    storageGet(REFRESH_TOKEN_KEY),
    storageGet(USER_KEY),
  ]);

  if (!accessToken || !refreshToken || !userJson) {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    memoryUser = null;
    return null;
  }

  try {
    const user = JSON.parse(userJson) as AuthUser;
    memoryAccessToken = accessToken;
    memoryRefreshToken = refreshToken;
    memoryUser = user;
    return { accessToken, refreshToken, user };
  } catch {
    await clearSession();
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  memoryAccessToken = session.accessToken;
  memoryRefreshToken = session.refreshToken;
  memoryUser = session.user;
  await Promise.all([
    storageSet(ACCESS_TOKEN_KEY, session.accessToken),
    storageSet(REFRESH_TOKEN_KEY, session.refreshToken),
    storageSet(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function clearSession(): Promise<void> {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  memoryUser = null;
  await Promise.all([
    storageDelete(ACCESS_TOKEN_KEY),
    storageDelete(REFRESH_TOKEN_KEY),
    storageDelete(USER_KEY),
  ]);
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
