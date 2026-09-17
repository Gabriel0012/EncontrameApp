import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Radius, type BrandColors } from '@/constants/brand';
import { POLICE_REPORT_PHONE } from '@/constants/emergency';
import { brandTiming } from '@/constants/motion';
import { useBrand } from '@/lib/brand-theme';
import { useBottomSafeInset } from '@/lib/use-bottom-safe-inset';
import { useTimedOpacity } from '@/lib/use-brand-transition';
import { useWideLayout } from '@/lib/use-wide-layout';

type Tab = 'register' | 'home' | 'phone';

type Props = {
  /** Aba ativa ganha uma plataforma laranja abaixo do ícone; a cor do ícone não muda. */
  active?: Tab;
};

function BottomTab({
  icon,
  isActive,
  onPress,
  brand,
  accessibilityLabel,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isActive: boolean;
  onPress?: () => void;
  brand: BrandColors;
  accessibilityLabel?: string;
}) {
  const [highlighted, setHighlighted] = useState(false);
  const pressOpacity = useTimedOpacity(highlighted ? 0.85 : 1);

  // Sempre inicia em 0 para a transição rodar no mount (cada página remonta o footer).
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = brandTiming(isActive ? 1 : 0);
  }, [isActive, progress]);

  const platformStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleX: 0.45 + progress.value * 0.55 }],
  }));

  const content = (
    <Animated.View style={[styles.iconWrap, pressOpacity]}>
      <MaterialCommunityIcons name={icon} size={26} color={brand.label} />
      <Animated.View style={[styles.platform, { backgroundColor: brand.orange }, platformStyle]} />
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
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
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
  const bottomInset = useBottomSafeInset();
  const router = useRouter();
  const { isWide } = useWideLayout();

  if (isWide) {
    return null;
  }

  const openPoliceDialer = () => {
    void Linking.openURL(`tel:${POLICE_REPORT_PHONE}`);
  };

  return (
    <View style={[stylesBar.bar, { paddingBottom: bottomInset, zIndex: 20 }]}>
      <BottomTab
        brand={brand}
        icon="phone"
        isActive={active === 'phone'}
        onPress={openPoliceDialer}
        accessibilityLabel={`Ligar para a polícia, ${POLICE_REPORT_PHONE}`}
      />
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
    minWidth: 48,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  platform: {
    marginTop: 5,
    width: 28,
    height: 5,
    borderRadius: Radius.pill,
  },
});
