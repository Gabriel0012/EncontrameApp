import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Brand, Radius } from '@/constants/brand';

export type MapPin = {
  id: string;
  /** Posição relativa dentro do mapa (0..1). */
  x: number;
  y: number;
  label?: string;
  locked?: boolean;
};

type Props = {
  pins?: MapPin[];
  onPress?: () => void;
  rounded?: boolean;
  style?: ViewStyle;
};

/**
 * Placeholder visual do mapa. A integração real (Google Maps) entra depois;
 * por enquanto reproduz a aparência dos protótipos com pins posicionáveis.
 */
export function BrandMap({ pins = [], onPress, rounded = false, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.map, rounded && styles.rounded, style]}
    >
      <View style={styles.grid} pointerEvents="none">
        <MaterialCommunityIcons name="map-outline" size={40} color={Brand.mapStroke} />
        <Text style={styles.hint}>Mapa — integração em breve</Text>
      </View>

      {pins.map((pin) => (
        <View
          key={pin.id}
          pointerEvents="none"
          style={[styles.pin, { left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }]}
        >
          <View style={styles.pinBadge}>
            <MaterialCommunityIcons
              name={pin.locked ? 'lock' : 'account'}
              size={16}
              color={Brand.white}
            />
          </View>
          {pin.label ? (
            <Text style={styles.pinLabel} numberOfLines={1}>
              {pin.label}
            </Text>
          ) : null}
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: Brand.mapBackground,
    borderWidth: 1,
    borderColor: Brand.mapStroke,
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: Radius.lg,
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  hint: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textMuted,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
  pinBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Brand.pin,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Brand.white,
  },
  pinLabel: {
    marginTop: 2,
    maxWidth: 90,
    fontSize: 11,
    fontWeight: '700',
    color: Brand.textDark,
  },
});
