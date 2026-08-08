import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';

export default function SignupPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'Use pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Senhas diferentes', 'A confirmação não corresponde à senha.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...params, password };
      // TODO: enviar `payload` para a API de cadastro existente.
      console.log('Cadastro:', payload);
      router.replace('/login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Criar uma conta" />

          <View style={styles.form}>
            <BrandField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••••"
              secureTextEntry
            />
            <BrandField
              label="Confirmar Senha"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••••••••••"
              secureTextEntry
            />
          </View>

          <View style={styles.footer}>
            <BrandButton
              label="Cadastrar"
              variant="blue"
              loading={submitting}
              onPress={handleRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  form: {
    marginTop: 20,
    gap: 20,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
