import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Radius } from '@/constants/brand';
import { brandTiming } from '@/constants/motion';
import { useTimedOpacity } from '@/lib/use-brand-transition';

type Tab = 'register' | 'home' | 'phone';

type Props = {
  /** Aba ativa (fundo azul + ícone branco); as demais ficam cinza. */
  active?: Tab;
};

/** Azul da marca com alpha 0 — `transparent` quebra interpolateColor. */
const BLUE_CLEAR = 'rgba(27, 77, 184, 0)';

function BottomTab({
  icon,
  isActive,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isActive: boolean;
  onPress?: () => void;
}) {
  const [highlighted, setHighlighted] = useState(false);
  const pressOpacity = useTimedOpacity(highlighted ? 0.85 : 1);

  // Sempre inicia em 0 para a transição rodar no mount (cada página remonta o footer).
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = brandTiming(isActive ? 1 : 0);
  }, [isActive, progress]);

  const wrapStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [BLUE_CLEAR, Brand.blue]),
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
          <MaterialCommunityIcons name={icon} size={26} color={Brand.label} />
        </Animated.View>
        <Animated.View style={[styles.iconLayer, activeIconStyle]}>
          <MaterialCommunityIcons name={icon} size={26} color={Brand.white} />
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
 */
export function BottomBar({ active }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <BottomTab icon="phone" isActive={active === 'phone'} />
      <BottomTab
        icon="home"
        isActive={active === 'home'}
        onPress={() => router.push('/inicio')}
      />
      <BottomTab
        icon="account-plus"
        isActive={active === 'register'}
        onPress={() => router.push('/cadastrar-pessoa')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Brand.fieldBorder,
    backgroundColor: Brand.white,
  },
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
