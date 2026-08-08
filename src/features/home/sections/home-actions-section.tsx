import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { Brand } from '@/constants/brand';
import type { HomeController } from '@/features/home/home.controller';

interface HomeActionsSectionProps {
  controller: HomeController;
}

export function HomeActionsSection({ controller }: HomeActionsSectionProps) {
  return (
    <View style={styles.actions}>
      <BrandButton label="Começar" variant="orange" onPress={controller.goToSignup} />
      <Pressable onPress={controller.goToLogin} hitSlop={12}>
        <Text style={styles.loginLink}>Já possuo uma conta ›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 18,
    alignItems: 'center',
  },
  loginLink: {
    color: Brand.cream,
    fontSize: 15,
    fontWeight: '600',
  },
});
