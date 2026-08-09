import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand } from '@/lib/brand-theme';
import { useTimedOpacity } from '@/lib/use-brand-transition';
import { useWideLayout } from '@/lib/use-wide-layout';

/**
 * FAB para cadastrar pessoa em telas largas — substitui a aba do BottomBar.
 */
export function RegisterFab() {
  const router = useRouter();
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const insets = useSafeAreaInsets();
  const { isWide } = useWideLayout();
  const [highlighted, setHighlighted] = useState(false);
  const opacity = useTimedOpacity(highlighted ? 0.88 : 1);

  if (!isWide) {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel="Cadastrar uma pessoa"
      hitSlop={8}
      onPress={() => router.push('/cadastrar-pessoa')}
      onPressIn={() => setHighlighted(true)}
      onPressOut={() => setHighlighted(false)}
      onHoverIn={() => setHighlighted(true)}
      onHoverOut={() => setHighlighted(false)}
      style={[styles.anchor, { bottom: Math.max(insets.bottom, 24) + 8, right: 24 }]}
    >
      <Animated.View style={[styles.fab, opacity]}>
        <MaterialCommunityIcons name="account-plus" size={28} color={brand.onPrimary} />
      </Animated.View>
    </Pressable>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    anchor: {
      position: 'absolute',
      zIndex: 20,
    },
    fab: {
      width: 56,
      height: 56,
      borderRadius: Radius.pill,
      backgroundColor: brand.blue,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: brand.navyDeep,
      shadowOpacity: 0.28,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
  });
}
