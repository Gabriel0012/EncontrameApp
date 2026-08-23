import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import type { BrandColors } from '@/constants/brand';
import type { LoginController } from '@/features/login/login.controller';
import { useBrand } from '@/lib/brand-theme';

interface LoginFormSectionProps {
  controller: LoginController;
  /** Labels claros no fundo navy da home desktop. */
  tone?: 'default' | 'onDark';
  /** Remove margem superior (quando o form já vem embutido). */
  compact?: boolean;
  /** Cor do botão Entrar (laranja na home web). */
  submitVariant?: 'orange' | 'blue';
}

export function LoginFormSection({
  controller,
  tone = 'default',
  compact = false,
  submitVariant = 'blue',
}: LoginFormSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

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
        required
        error={controller.fieldError('identifier')}
        onBlur={controller.blurIdentifier}
      />
      <BrandField
        label="Senha"
        value={controller.password}
        onChangeText={controller.setPassword}
        placeholder="••••••••••••••"
        secureTextEntry
        tone={tone}
        required
        error={controller.fieldError('password')}
        onBlur={controller.blurPassword}
      />
      {controller.formError ? (
        <Text style={styles.formError}>{controller.formError}</Text>
      ) : null}
      <BrandButton
        label="Entrar"
        variant={submitVariant}
        loading={controller.submitting}
        onPress={controller.handleLogin}
        style={styles.submit}
      />
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    form: {
      marginTop: 28,
      gap: 20,
    },
    formCompact: {
      marginTop: 0,
    },
    formError: {
      fontSize: 13,
      fontWeight: '600',
      color: brand.error,
    },
    submit: {
      marginTop: 8,
    },
  });
}
