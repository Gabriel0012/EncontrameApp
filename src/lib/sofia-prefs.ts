import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DISCLAIMER_KEY = 'encontrame.sofia.disclaimerAccepted';

/** Se o usuário já aceitou o aviso legal da Sofia neste aparelho. */
export async function isSofiaDisclaimerAccepted(): Promise<boolean> {
  const value = await storageGet(DISCLAIMER_KEY);
  return value === '1';
}

export async function acceptSofiaDisclaimer(): Promise<void> {
  await storageSet(DISCLAIMER_KEY, '1');
}

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
    // Sem storage persistente.
  }
}
