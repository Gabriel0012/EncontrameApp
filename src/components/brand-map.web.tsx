import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand } from '@/lib/brand-theme';

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  locked?: boolean;
};

type Props = {
  pins?: MapPin[];
  onPress?: () => void;
  rounded?: boolean;
  style?: ViewStyle;
};

/** Posiciona pins no fallback web a partir das coordenadas (0..1). */
function relativePositions(pins: MapPin[]) {
  if (pins.length === 0) {
    return [];
  }

  const latitudes = pins.map((pin) => pin.latitude);
  const longitudes = pins.map((pin) => pin.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latSpan = Math.max(maxLat - minLat, 0.01);
  const lngSpan = Math.max(maxLng - minLng, 0.01);

  return pins.map((pin) => ({
    ...pin,
    x: 0.15 + ((pin.longitude - minLng) / lngSpan) * 0.7,
    y: 0.15 + ((maxLat - pin.latitude) / latSpan) * 0.7,
  }));
}

/**
 * Fallback do mapa no navegador — react-native-maps não roda na web.
 */
export function BrandMap({ pins = [], onPress, rounded = false, style }: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const positioned = relativePositions(pins);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.map, rounded && styles.rounded, style]}
    >
      <View style={styles.fallback} pointerEvents="none">
        <MaterialCommunityIcons name="map-outline" size={40} color={brand.mapStroke} />
        <Text style={styles.hint}>Mapa disponível no app (iOS/Android)</Text>
      </View>

      {positioned.map((pin) => (
        <View
          key={pin.id}
          pointerEvents="none"
          style={[styles.pin, { left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }]}
        >
          <View style={styles.pinBadge}>
            <MaterialCommunityIcons
              name={pin.locked ? 'lock' : 'account'}
              size={16}
              color={brand.onPrimary}
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

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    map: {
      flex: 1,
      backgroundColor: brand.mapBackground,
      borderWidth: 1,
      borderColor: brand.mapStroke,
      overflow: 'hidden',
    },
    rounded: {
      borderRadius: Radius.lg,
    },
    fallback: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    hint: {
      fontSize: 13,
      fontWeight: '600',
      color: brand.textMuted,
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
      backgroundColor: brand.pin,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: brand.onPrimary,
    },
    pinLabel: {
      marginTop: 2,
      maxWidth: 90,
      fontSize: 11,
      fontWeight: '700',
      color: brand.textDark,
    },
  });
}
