import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import type { LoginController } from '@/features/login/login.controller';

interface LoginFormSectionProps {
  controller: LoginController;
  /** Labels claros no fundo navy da home desktop. */
  tone?: 'default' | 'onDark';
  /** Remove margem superior (quando o form já vem embutido). */
  compact?: boolean;
}

export function LoginFormSection({
  controller,
  tone = 'default',
  compact = false,
}: LoginFormSectionProps) {
  return (
    <View style={[styles.form, compact && styles.formCompact]}>
      <BrandField
        label="E-mail / CPF"
        value={controller.identifier}
        onChangeText={controller.setIdentifier}
        placeholder="exemplo@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        tone={tone}
      />
      <BrandField
        label="Senha"
        value={controller.password}
        onChangeText={controller.setPassword}
        placeholder="••••••••••••••"
        secureTextEntry
        tone={tone}
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
  formCompact: {
    marginTop: 0,
  },
  submit: {
    marginTop: 8,
  },
});
