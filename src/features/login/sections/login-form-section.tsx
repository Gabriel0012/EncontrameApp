import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import type { LoginController } from '@/features/login/login.controller';

interface LoginFormSectionProps {
  controller: LoginController;
}

export function LoginFormSection({ controller }: LoginFormSectionProps) {
  return (
    <View style={styles.form}>
      <BrandField
        label="E-mail / CPF"
        value={controller.identifier}
        onChangeText={controller.setIdentifier}
        placeholder="exemplo@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <BrandField
        label="Senha"
        value={controller.password}
        onChangeText={controller.setPassword}
        placeholder="••••••••••••••"
        secureTextEntry
      />
      <BrandButton
        label="Entrar"
        variant="blue"
        loading={controller.submitting}
        onPress={controller.handleLogin}
        style={styles.submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 28,
    gap: 20,
  },
  submit: {
    marginTop: 8,
  },
});
