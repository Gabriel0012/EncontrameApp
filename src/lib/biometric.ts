import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ENABLED_KEY = 'encontrame.auth.biometricEnabled';

export type BiometricKind = 'fingerprint' | 'face' | 'generic';

export interface BiometricCopy {
  enrollTitle: string;
  enrollBody: string;
  enrollConfirm: string;
  enrollPrompt: string;
  loginButton: string;
  loginPrompt: string;
  icon: 'fingerprint' | 'face-recognition';
}

/** Hardware presente e biometria cadastrada no aparelho (não disponível no web). */
export async function isBiometricAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const [hasHardware, enrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return hasHardware && enrolled;
  } catch {
    return false;
  }
}

export async function getBiometricKind(): Promise<BiometricKind> {
  if (Platform.OS === 'web') return 'generic';

  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'face';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'fingerprint';
    }
    return 'generic';
  } catch {
    return 'generic';
  }
}

export function biometricCopy(kind: BiometricKind): BiometricCopy {
  if (kind === 'face') {
    return {
      enrollTitle: 'Entrar com Face ID?',
      enrollBody: 'Quer entrar com a Face ID deste celular da próxima vez?',
      enrollConfirm: 'Usar Face ID',
      enrollPrompt: 'Confirme com a Face ID para ativar o login rápido.',
      loginButton: 'Entrar com Face ID',
      loginPrompt: 'Use a Face ID para entrar',
      icon: 'face-recognition',
    };
  }

  if (kind === 'fingerprint') {
    return {
      enrollTitle: 'Entrar com a digital?',
      enrollBody: 'Quer entrar com a digital deste celular da próxima vez?',
      enrollConfirm: 'Usar digital',
      enrollPrompt: 'Confirme com a digital para ativar o login rápido.',
      loginButton: 'Entrar com a digital',
      loginPrompt: 'Use a digital para entrar',
      icon: 'fingerprint',
    };
  }

  return {
    enrollTitle: 'Entrar com biometria?',
    enrollBody: 'Quer entrar com a biometria deste celular da próxima vez?',
    enrollConfirm: 'Usar biometria',
    enrollPrompt: 'Confirme a biometria para ativar o login rápido.',
    loginButton: 'Entrar com biometria',
    loginPrompt: 'Use a biometria para entrar',
    icon: 'fingerprint',
  };
}

export async function getBiometricEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const value = await storageGet(ENABLED_KEY);
  return value === '1';
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  if (enabled) {
    await storageSet(ENABLED_KEY, '1');
    return;
  }
  await storageDelete(ENABLED_KEY);
}

export async function authenticate(promptMessage: string): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancelar',
      disableDeviceFallback: true,
    });
    return result.success;
  } catch {
    return false;
  }
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
    // Sem storage persistente.
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
