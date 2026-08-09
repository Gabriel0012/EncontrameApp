import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import type { HomeController } from '@/features/home/home.controller';
import type { LoginController } from '@/features/login/login.controller';
import { LoginFormSection } from '@/features/login/sections/login-form-section';
import { useBrand } from '@/lib/brand-theme';

interface HomeDesktopAuthSectionProps {
  home: HomeController;
  login: LoginController;
}

/** Login embutido na home em telas largas — evita ir para /login. */
export function HomeDesktopAuthSection({ home, login }: HomeDesktopAuthSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <LoginFormSection controller={login} compact submitVariant="orange" />
      </View>
      <Pressable onPress={home.goToSignup} hitSlop={12} style={styles.signupHit}>
        <Text style={styles.signupLink}>Criar uma conta</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrap: {
      width: '100%',
      maxWidth: 400,
      gap: 20,
      alignItems: 'center',
    },
    card: {
      width: '100%',
      backgroundColor: brand.surface,
      borderRadius: Radius.sm,
      paddingHorizontal: 24,
      paddingVertical: 28,
    },
    signupHit: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    signupLink: {
      color: brand.onPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
  });
}
