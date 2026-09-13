import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { useBiometricEnroll } from '@/features/biometric/use-biometric-enroll';
import { useGoogleAuth } from '@/features/google-auth/use-google-auth';
import { parseApiError } from '@/lib/api-errors';
import { safeReturnTo } from '@/lib/auth-guard';
import {
  authenticate,
  biometricCopy,
  getBiometricEnabled,
  getBiometricKind,
  isBiometricAvailable,
  type BiometricCopy,
} from '@/lib/biometric';
import { generalErrorMessage } from '@/lib/error-messages';
import { hasStoredSession } from '@/lib/session';
import { useFieldErrors } from '@/lib/use-field-errors';
import { collectErrors, textError } from '@/lib/validation';
import {
  revokeStoredSession,
  unlockAndRefreshSession,
  useLoginMutation,
} from '@/services/auth/auth.service';

const BIOMETRIC_FAIL = 'Não foi possível entrar com a digital. Use e-mail e senha.';

/** Centraliza estado, validação e ações da tela de login. */
export function useLoginController() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const loginMutation = useLoginMutation();
  const enroll = useBiometricEnroll();
  const { errors, setErrors, setFieldCode, markDirty, isDirty, fieldError } = useFieldErrors();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [biometricCopyState, setBiometricCopyState] = useState<BiometricCopy | null>(null);
  const [biometricSubmitting, setBiometricSubmitting] = useState(false);
  const autoPrompted = useRef(false);

  const dest = (safeReturnTo(returnTo) ?? '/inicio') as Href;

  const google = useGoogleAuth({
    successHref: dest,
    beforeSuccess: () => enroll.promptIfAvailable(),
  });

  const changeIdentifier = (value: string) => {
    setIdentifier(value);
    setFormError('');
    if (isDirty('identifier')) setFieldCode('identifier', textError(value));
  };

  const blurIdentifier = () => {
    markDirty('identifier');
    setFieldCode('identifier', textError(identifier));
  };

  const changePassword = (value: string) => {
    setPassword(value);
    setFormError('');
    if (isDirty('password')) setFieldCode('password', textError(value));
  };

  const blurPassword = () => {
    markDirty('password');
    setFieldCode('password', textError(password));
  };

  const biometricBusy = useRef(false);

  const handleBiometricLogin = async () => {
    if (biometricBusy.current) return;

    biometricBusy.current = true;
    setBiometricSubmitting(true);
    setFormError('');
    try {
      const copy = biometricCopyState ?? biometricCopy(await getBiometricKind());
      const ok = await authenticate(copy.loginPrompt);
      if (!ok) return;

      await unlockAndRefreshSession();
      router.replace(dest);
    } catch {
      setFormError(BIOMETRIC_FAIL);
      await revokeStoredSession();
      setBiometricCopyState(null);
    } finally {
      biometricBusy.current = false;
      setBiometricSubmitting(false);
    }
  };

  const handleUseAnotherAccount = async () => {
    setFormError('');
    await revokeStoredSession();
    setBiometricCopyState(null);
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [enabled, stored, available] = await Promise.all([
        getBiometricEnabled(),
        hasStoredSession(),
        isBiometricAvailable(),
      ]);
      if (cancelled || !enabled || !stored || !available) return;

      const copy = biometricCopy(await getBiometricKind());
      if (cancelled) return;
      setBiometricCopyState(copy);

      if (autoPrompted.current) return;
      autoPrompted.current = true;
      await handleBiometricLogin();
    })();

    return () => {
      cancelled = true;
    };
    // Auto-prompt só no mount da tela de login.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    const found = collectErrors({
      identifier: textError(identifier),
      password: textError(password),
    });

    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    try {
      await loginMutation.mutateAsync({ identifier, password });
      await enroll.promptIfAvailable();
      router.replace(dest);
    } catch (error) {
      const { code, fields } = parseApiError(error);

      if (Object.keys(fields).length > 0) {
        setErrors(fields);
        return;
      }

      if (code === 'invalid_credentials') {
        setFormError(generalErrorMessage(code));
      }
    }
  };

  return {
    identifier,
    setIdentifier: changeIdentifier,
    blurIdentifier,
    password,
    setPassword: changePassword,
    blurPassword,
    errors,
    fieldError,
    formError: formError || google.error,
    submitting: loginMutation.isPending,
    googleAvailable: google.available,
    googleReady: google.ready,
    googleSubmitting: google.submitting,
    handleGoogle: google.promptGoogle,
    handleLogin,
    goToSignup: () => router.push('/signup'),
    enroll,
    biometricAvailable: biometricCopyState != null,
    biometricLabel: biometricCopyState?.loginButton ?? 'Entrar com a digital',
    biometricIcon: biometricCopyState?.icon ?? 'fingerprint',
    biometricSubmitting,
    handleBiometricLogin,
    handleUseAnotherAccount,
  };
}

export type LoginController = ReturnType<typeof useLoginController>;
