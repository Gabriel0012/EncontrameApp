import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { parseApiError } from '@/lib/api-errors';
import { fieldErrorMessage, generalErrorMessage } from '@/lib/error-messages';
import { useFieldErrors } from '@/lib/use-field-errors';
import { PASSWORD_MIN_LENGTH, collectErrors, textError, type ErrorCode } from '@/lib/validation';
import { useSignupMutation } from '@/services/auth/auth.service';
import type { SignupPayload } from '@/services/auth/auth.types';

const asText = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? '');

/** Campos da API que têm outro nome no formulário. */
const API_FIELD_MAP = { document: 'cpf', cellPhone: 'phone' };

function confirmError(password: string, confirm: string): ErrorCode | undefined {
  return textError(confirm) ?? (password !== confirm ? 'invalid_format' : undefined);
}

/** Centraliza validação e cadastro da etapa 2 (senha). */
export function useSignupPasswordController() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const signupMutation = useSignupMutation();
  const { errors, setErrors, setFieldCode, markDirty, isDirty, fieldError } = useFieldErrors();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const changePassword = (value: string) => {
    setPassword(value);
    if (isDirty('password')) setFieldCode('password', textError(value, PASSWORD_MIN_LENGTH));
    if (isDirty('confirm')) setFieldCode('confirm', confirmError(value, confirm));
  };

  const blurPassword = () => {
    markDirty('password');
    setFieldCode('password', textError(password, PASSWORD_MIN_LENGTH));
  };

  const changeConfirm = (value: string) => {
    setConfirm(value);
    if (isDirty('confirm')) setFieldCode('confirm', confirmError(password, value));
  };

  const blurConfirm = () => {
    markDirty('confirm');
    setFieldCode('confirm', confirmError(password, confirm));
  };

  const handleRegister = async () => {
    const found = collectErrors({
      password: textError(password, PASSWORD_MIN_LENGTH),
      confirm: confirmError(password, confirm),
    });

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload: SignupPayload = {
      name: asText(params.name),
      cpf: asText(params.cpf),
      email: asText(params.email),
      phone: asText(params.phone),
      cep: asText(params.cep),
      clause: asText(params.clause),
      password,
    };

    try {
      await signupMutation.mutateAsync(payload);
      router.replace('/login');
    } catch (error) {
      const { code, fields } = parseApiError(error, API_FIELD_MAP);

      if (fields.password) {
        setErrors({ password: fields.password });
        return;
      }

      const stepOneFields = Object.keys(fields);
      if (stepOneFields.length > 0) {
        Alert.alert(
          'Revise seus dados',
          stepOneFields.map((field) => fieldErrorMessage(field, fields[field])).join('\n'),
        );
        router.back();
        return;
      }

      Alert.alert('Falha no cadastro', generalErrorMessage(code));
    }
  };

  return {
    password,
    setPassword: changePassword,
    blurPassword,
    confirm,
    setConfirm: changeConfirm,
    blurConfirm,
    errors,
    fieldError,
    submitting: signupMutation.isPending,
    handleRegister,
  };
}

export type SignupPasswordController = ReturnType<typeof useSignupPasswordController>;
