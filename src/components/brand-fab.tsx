import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand } from '@/lib/brand-theme';
import { useTimedOpacity } from '@/lib/use-brand-transition';

type Props = {
  accessibilityLabel: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  /** Quando false, some com fade e não recebe toque. */
  visible?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Botão flutuante circular da marca (mesmo visual do FAB da home).
 */
export function BrandFab({
  accessibilityLabel,
  onPress,
  icon = 'account-plus',
  loading = false,
  disabled = false,
  visible = true,
  style,
}: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const [highlighted, setHighlighted] = useState(false);
  const isInactive = disabled || loading;
  const opacityTarget = !visible ? 0 : isInactive ? 0.5 : highlighted ? 0.88 : 1;
  const opacity = useTimedOpacity(opacityTarget);

  const setHighlight = (on: boolean) => {
    if (isInactive || !visible) return;
    setHighlighted(on);
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isInactive || !visible }}
      hitSlop={8}
      disabled={isInactive || !visible}
      onPress={onPress}
      onPressIn={() => setHighlight(true)}
      onPressOut={() => setHighlight(false)}
      onHoverIn={() => setHighlight(true)}
      onHoverOut={() => setHighlight(false)}
      style={[styles.anchor, style]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Animated.View style={[styles.fab, opacity]}>
        {loading ? (
          <ActivityIndicator color={brand.onPrimary} />
        ) : (
          <MaterialCommunityIcons name={icon} size={28} color={brand.onPrimary} />
        )}
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
