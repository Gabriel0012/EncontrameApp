import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: integrar com a API de autenticação existente.
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Entrar" />

          <View style={styles.form}>
            <BrandField
              label="E-mail / CPF"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <BrandField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••••"
              secureTextEntry
            />
            <BrandButton label="Entrar" variant="blue" onPress={handleLogin} style={styles.submit} />
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
  },
  form: {
    marginTop: 28,
    gap: 20,
  },
  submit: {
    marginTop: 8,
  },
});
