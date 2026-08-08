import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import type { SignupPasswordController } from '@/features/signup-password/signup-password.controller';

interface SignupPasswordFormSectionProps {
  controller: SignupPasswordController;
}

export function SignupPasswordFormSection({ controller }: SignupPasswordFormSectionProps) {
  return (
    <>
      <View style={styles.form}>
        <BrandField
          label="Senha"
          value={controller.password}
          onChangeText={controller.setPassword}
          placeholder="••••••••••••••"
          secureTextEntry
        />
        <BrandField
          label="Confirmar Senha"
          value={controller.confirm}
          onChangeText={controller.setConfirm}
          placeholder="••••••••••••••"
          secureTextEntry
        />
      </View>

      <View style={styles.footer}>
        <BrandButton
          label="Cadastrar"
          variant="blue"
          loading={controller.submitting}
          onPress={controller.handleRegister}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
    gap: 20,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
