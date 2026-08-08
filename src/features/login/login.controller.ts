import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { useLoginMutation } from '@/services/auth/auth.service';

/** Centraliza estado, validação e ações da tela de login. */
export function useLoginController() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Campos obrigatórios', 'Informe e-mail/CPF e senha.');
      return;
    }

    try {
      await loginMutation.mutateAsync({ identifier, password });
      router.replace('/');
    } catch {
      Alert.alert('Falha no login', 'Não foi possível entrar. Tente novamente.');
    }
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    submitting: loginMutation.isPending,
    handleLogin,
  };
}

export type LoginController = ReturnType<typeof useLoginController>;
