import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, type BrandColors } from '@/constants/brand';
import { brandTiming } from '@/constants/motion';
import { useBrand } from '@/lib/brand-theme';
import { useTimedOpacity } from '@/lib/use-brand-transition';
import { useWideLayout } from '@/lib/use-wide-layout';

type Tab = 'register' | 'home' | 'phone';

type Props = {
  /** Aba ativa (fundo azul + ícone branco); as demais ficam cinza. */
  active?: Tab;
};

function BottomTab({
  icon,
  isActive,
  onPress,
  brand,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isActive: boolean;
  onPress?: () => void;
  brand: BrandColors;
}) {
  const [highlighted, setHighlighted] = useState(false);
  const pressOpacity = useTimedOpacity(highlighted ? 0.85 : 1);

  // Sempre inicia em 0 para a transição rodar no mount (cada página remonta o footer).
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = brandTiming(isActive ? 1 : 0);
  }, [isActive, progress]);

  const wrapStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [brand.blueClear, brand.blue]),
  }));

  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const content = (
    <Animated.View style={[styles.iconWrap, wrapStyle, pressOpacity]}>
      <View style={styles.iconStack}>
        <Animated.View style={[styles.iconLayer, inactiveIconStyle]}>
          <MaterialCommunityIcons name={icon} size={26} color={brand.label} />
        </Animated.View>
        <Animated.View style={[styles.iconLayer, activeIconStyle]}>
          <MaterialCommunityIcons name={icon} size={26} color={brand.onPrimary} />
        </Animated.View>
      </View>
    </Animated.View>
  );

  if (!onPress) {
    return <View accessibilityState={{ disabled: true }}>{content}</View>;
  }

  return (
    <Pressable
      hitSlop={12}
      onPress={onPress}
      onPressIn={() => setHighlighted(true)}
      onPressOut={() => setHighlighted(false)}
      onHoverIn={() => setHighlighted(true)}
      onHoverOut={() => setHighlighted(false)}
    >
      {content}
    </Pressable>
  );
}

/**
 * Barra inferior de navegação: telefone (emergência), início e cadastrar pessoa.
 * Em telas largas cede lugar ao menu + FAB.
 */
export function BottomBar({ active }: Props) {
  const brand = useBrand();
  const stylesBar = useMemo(() => makeBarStyles(brand), [brand]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isWide } = useWideLayout();

  if (isWide) {
    return null;
  }

  return (
    <View style={[stylesBar.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <BottomTab brand={brand} icon="phone" isActive={active === 'phone'} />
      <BottomTab
        brand={brand}
        icon="home"
        isActive={active === 'home'}
        onPress={() => router.push('/inicio')}
      />
      <BottomTab
        brand={brand}
        icon="account-plus"
        isActive={active === 'register'}
        onPress={() => router.push('/cadastrar-pessoa')}
      />
    </View>
  );
}

function makeBarStyles(brand: BrandColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: brand.fieldBorder,
      backgroundColor: brand.white,
    },
  });
}

const styles = StyleSheet.create({
  iconWrap: {
    padding: 8,
    borderRadius: Radius.sm,
  },
  iconStack: {
    width: 26,
    height: 26,
  },
  iconLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
