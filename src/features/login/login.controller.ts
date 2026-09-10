import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { parseApiError } from '@/lib/api-errors';
import { safeReturnTo } from '@/lib/auth-guard';
import { generalErrorMessage } from '@/lib/error-messages';
import { useFieldErrors } from '@/lib/use-field-errors';
import { collectErrors, textError } from '@/lib/validation';
import { useLoginMutation } from '@/services/auth/auth.service';

/** Centraliza estado, validação e ações da tela de login. */
export function useLoginController() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const loginMutation = useLoginMutation();
  const { errors, setErrors, setFieldCode, markDirty, isDirty, fieldError } = useFieldErrors();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

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
      const dest = safeReturnTo(returnTo) ?? '/inicio';
      router.replace(dest as Href);
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
    formError,
    submitting: loginMutation.isPending,
    handleLogin,
    goToSignup: () => router.push('/signup'),
  };
}

export type LoginController = ReturnType<typeof useLoginController>;
