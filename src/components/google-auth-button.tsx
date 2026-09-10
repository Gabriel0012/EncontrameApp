import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { GOOGLE_G_IMAGE } from '@/components/google-g-mark';
import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand } from '@/lib/brand-theme';
import { useTimedOpacity } from '@/lib/use-brand-transition';

type Props = {
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

/** Botão de continuar com Google (web). */
export function GoogleAuthButton({ onPress, loading = false, disabled = false, style }: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const isInactive = disabled || loading;
  const [highlighted, setHighlighted] = useState(false);
  const opacityTarget = isInactive ? 0.5 : highlighted ? 0.85 : 1;
  const animatedStyle = useTimedOpacity(opacityTarget);

  const setHighlight = (on: boolean) => {
    if (isInactive) return;
    setHighlighted(on);
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      onPressIn={() => setHighlight(true)}
      onPressOut={() => setHighlight(false)}
      onHoverIn={() => setHighlight(true)}
      onHoverOut={() => setHighlight(false)}
      accessibilityRole="button"
      accessibilityLabel="Continuar com Google"
    >
      <Animated.View style={[styles.base, animatedStyle, style]}>
        {loading ? (
          <ActivityIndicator color={brand.blue} />
        ) : (
          <View style={styles.content}>
            <Image
              source={GOOGLE_G_IMAGE}
              style={styles.googleMark}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
            <Text style={styles.label}>Continuar com Google</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    base: {
      height: 54,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      backgroundColor: brand.white,
      borderWidth: 1.5,
      borderColor: brand.blue,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    googleMark: {
      width: 20,
      height: 20,
    },
    label: {
      fontSize: 17,
      fontWeight: '700',
      color: brand.blue,
    },
  });
}
