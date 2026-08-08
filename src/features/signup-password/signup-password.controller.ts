import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { useSignupMutation } from '@/services/auth/auth.service';
import type { SignupPayload } from '@/services/auth/auth.types';

const asText = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? '');

/** Centraliza validação e cadastro da etapa 2 (senha). */
export function useSignupPasswordController() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const signupMutation = useSignupMutation();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'Use pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Senhas diferentes', 'A confirmação não corresponde à senha.');
      return;
    }

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
    } catch {
      Alert.alert('Falha no cadastro', 'Não foi possível concluir. Tente novamente.');
    }
  };

  return {
    password,
    setPassword,
    confirm,
    setConfirm,
    submitting: signupMutation.isPending,
    handleRegister,
  };
}

export type SignupPasswordController = ReturnType<typeof useSignupPasswordController>;
