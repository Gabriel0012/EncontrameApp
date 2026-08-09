import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import type { HomeController } from '@/features/home/home.controller';
import type { LoginController } from '@/features/login/login.controller';
import { LoginFormSection } from '@/features/login/sections/login-form-section';

interface HomeDesktopAuthSectionProps {
  home: HomeController;
  login: LoginController;
}

/** Login embutido na home em telas largas — evita ir para /login. */
export function HomeDesktopAuthSection({ home, login }: HomeDesktopAuthSectionProps) {
  return (
    <View style={styles.wrap}>
      <LoginFormSection controller={login} tone="onDark" compact />
      <BrandButton
        label="Criar uma conta"
        variant="orange"
        onPress={home.goToSignup}
        style={styles.signup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 16,
    paddingBottom: 8,
  },
  signup: {
    marginTop: 4,
  },
});
