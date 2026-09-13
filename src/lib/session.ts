import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { getBiometricEnabled, setBiometricEnabled } from '@/lib/biometric';
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

/** Evita várias leituras paralelas do storage no boot / 401. */
let hydratePromise: Promise<Session | null> | null = null;

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
  if (!hydratePromise) {
    hydratePromise = (async () => {
      // Com biometria ligada a sessão fica travada até o desbloqueio na tela de login.
      if (await getBiometricEnabled()) {
        return null;
      }
      return readSessionFromStorage();
    })().finally(() => {
      hydratePromise = null;
    });
  }
  return hydratePromise;
}

/**
 * Garante que a memória reflita o storage.
 * Usado pelo interceptor 401 quando a memória ainda está vazia (ex.: race pós-F5).
 * Não apaga o storage se as chaves estiverem ausentes — só atualiza a memória.
 * Não destrava sessão protegida por biometria.
 */
export async function ensureSessionHydrated(): Promise<Session | null> {
  if (memoryAccessToken && memoryRefreshToken && memoryUser) {
    return {
      accessToken: memoryAccessToken,
      refreshToken: memoryRefreshToken,
      user: memoryUser,
    };
  }

  return hydrateSession();
}

export async function saveSession(session: Session): Promise<void> {
  applySessionToMemory(session);
  await Promise.all([
    storageSet(ACCESS_TOKEN_KEY, session.accessToken),
    storageSet(REFRESH_TOKEN_KEY, session.refreshToken),
    storageSet(USER_KEY, JSON.stringify(session.user)),
  ]);
}

/** Lê tokens persistidos sem colocá-los na memória (sessão ainda travada). */
export async function peekStoredSession(): Promise<Session | null> {
  return peekSessionFromStorage();
}

export async function hasStoredSession(): Promise<boolean> {
  return (await peekSessionFromStorage()) != null;
}

/** Coloca na memória a sessão persistida (após a biometria confirmar). */
export async function unlockSession(): Promise<Session | null> {
  return readSessionFromStorage();
}

/** Limpa só a memória; tokens e preferência biométrica continuam no aparelho. */
export async function lockSession(): Promise<void> {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  memoryUser = null;
}

export async function clearSession(): Promise<void> {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  memoryUser = null;
  await Promise.all([
    storageDelete(ACCESS_TOKEN_KEY),
    storageDelete(REFRESH_TOKEN_KEY),
    storageDelete(USER_KEY),
    setBiometricEnabled(false),
  ]);
}

async function peekSessionFromStorage(): Promise<Session | null> {
  const [accessToken, refreshToken, userJson] = await Promise.all([
    storageGet(ACCESS_TOKEN_KEY),
    storageGet(REFRESH_TOKEN_KEY),
    storageGet(USER_KEY),
  ]);

  if (!accessToken || !refreshToken || !userJson) {
    return null;
  }

  try {
    const user = JSON.parse(userJson) as AuthUser;
    return { accessToken, refreshToken, user };
  } catch {
    await clearSession();
    return null;
  }
}

async function readSessionFromStorage(): Promise<Session | null> {
  const session = await peekSessionFromStorage();

  if (!session) {
    // Não chama clearSession: ausência na memória pós-F5 não deve apagar o storage.
    memoryAccessToken = null;
    memoryRefreshToken = null;
    memoryUser = null;
    return null;
  }

  applySessionToMemory(session);
  return session;
}

function applySessionToMemory(session: Session): void {
  memoryAccessToken = session.accessToken;
  memoryRefreshToken = session.refreshToken;
  memoryUser = session.user;
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
