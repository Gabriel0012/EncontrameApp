import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { ColorSchemeName } from '@/constants/brand';
import { isSofiaPaletteId, type SofiaPaletteId } from '@/constants/sofia-palettes';

const DISCLAIMER_KEY = 'encontrame.sofia.disclaimerAccepted';
const WELCOME_KEY = 'encontrame.sofia.welcomeComplete';
const PALETTE_KEY = 'encontrame.theme.palette';
const SCHEME_KEY = 'encontrame.theme.scheme';

/** Se o usuário já aceitou o aviso legal da Sofia neste aparelho. */
export async function isSofiaDisclaimerAccepted(): Promise<boolean> {
  const value = await storageGet(DISCLAIMER_KEY);
  return value === '1';
}

export async function acceptSofiaDisclaimer(): Promise<void> {
  await storageSet(DISCLAIMER_KEY, '1');
}

/** Se o fluxo de apresentação + tema da Sofia já foi concluído. */
export async function isSofiaWelcomeComplete(): Promise<boolean> {
  const value = await storageGet(WELCOME_KEY);
  return value === '1';
}

export async function completeSofiaWelcome(): Promise<void> {
  await storageSet(WELCOME_KEY, '1');
}

export async function loadThemePrefs(): Promise<{
  paletteId: SofiaPaletteId | null;
  scheme: ColorSchemeName | null;
}> {
  const [paletteRaw, schemeRaw] = await Promise.all([storageGet(PALETTE_KEY), storageGet(SCHEME_KEY)]);
  return {
    paletteId: isSofiaPaletteId(paletteRaw) ? paletteRaw : null,
    scheme: schemeRaw === 'light' || schemeRaw === 'dark' ? schemeRaw : null,
  };
}

export async function saveThemePalette(id: SofiaPaletteId): Promise<void> {
  await storageSet(PALETTE_KEY, id);
}

export async function saveThemeScheme(scheme: ColorSchemeName): Promise<void> {
  await storageSet(SCHEME_KEY, scheme);
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
