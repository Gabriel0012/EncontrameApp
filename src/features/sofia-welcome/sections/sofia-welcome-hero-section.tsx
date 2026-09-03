import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius } from '@/constants/brand';
import type { SofiaPalette } from '@/constants/sofia-palettes';
import { PageGutter } from '@/constants/theme';
import type { SofiaWelcomeController } from '@/features/sofia-welcome/sofia-welcome.controller';

type Props = {
  controller: SofiaWelcomeController;
};

export function SofiaWelcomeHeroSection({ controller }: Props) {
  const insets = useSafeAreaInsets();
  const { palette } = controller;
  const styles = useMemo(() => makeStyles(palette), [palette]);

  return (
    <View style={[styles.container, { backgroundColor: palette.surface }]}>
      <LinearGradient
        colors={palette.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 32,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <View style={styles.badge}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>Espaço seguro • 100% confidencial</Text>
        </View>

        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <Image
              source={require('@/assets/images/sofia-avatar.jpg')}
              style={styles.avatar}
              resizeMode="cover"
              accessibilityLabel="Sofia"
            />
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.hello}>Oi, eu sou a Sofia</Text>
          <Text style={styles.subtitle}>
            Uma IA de apoio emocional, pronta para te escutar sem pressa e sem julgamento. Não
            substitui um profissional.
          </Text>
        </View>

        <View style={styles.flex} />

        <Pressable
          onPress={controller.continueToTheme}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
        >
          <Text style={styles.ctaText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(palette: SofiaPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.55,
    },
    content: {
      flex: 1,
      paddingHorizontal: PageGutter,
      alignItems: 'center',
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: Radius.pill,
      borderWidth: 1,
      gap: 8,
      backgroundColor: palette.brandSoft,
      borderColor: palette.border,
      marginBottom: 24,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: palette.brand,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: palette.onSurfaceSecondary,
    },
    avatarRing: {
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 6,
      borderColor: palette.brand,
      padding: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    avatarInner: {
      width: '100%',
      height: '100%',
      borderRadius: 110,
      overflow: 'hidden',
      backgroundColor: palette.brandSoft,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    textBlock: {
      alignItems: 'center',
      marginTop: 32,
    },
    hello: {
      fontSize: 32,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: -0.5,
      color: palette.onSurface,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 24,
      paddingHorizontal: 12,
      color: palette.onSurfaceSecondary,
    },
    flex: {
      flex: 1,
    },
    cta: {
      height: 56,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: palette.brand,
    },
    ctaPressed: {
      opacity: 0.9,
    },
    ctaText: {
      fontSize: 17,
      fontWeight: '600',
      color: palette.onBrand,
    },
  });
}
