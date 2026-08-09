import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand } from '@/lib/brand-theme';
import { useTimedOpacity } from '@/lib/use-brand-transition';

type Variant = 'orange' | 'blue' | 'outline';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  trailingIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: ViewStyle;
};

export function BrandButton({
  label,
  onPress,
  variant = 'orange',
  loading = false,
  disabled = false,
  trailingIcon,
  style,
}: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const isOutline = variant === 'outline';
  const bg = variant === 'orange' ? brand.orange : variant === 'blue' ? brand.blue : brand.white;
  const textColor = isOutline ? brand.blue : brand.onPrimary;
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
    >
      <Animated.View
        style={[
          styles.base,
          { backgroundColor: bg },
          isOutline && styles.outline,
          animatedStyle,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.content}>
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            {trailingIcon ? (
              <MaterialCommunityIcons name={trailingIcon} size={20} color={textColor} />
            ) : null}
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
    },
    outline: {
      borderWidth: 1.5,
      borderColor: brand.blue,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    label: {
      fontSize: 17,
      fontWeight: '700',
    },
  });
}
