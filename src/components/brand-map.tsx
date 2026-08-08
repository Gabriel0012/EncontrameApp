import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';

import { Brand, Radius } from '@/constants/brand';

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

/** Centro padrão: Belo Horizonte (região dos mocks). */
const DEFAULT_REGION: Region = {
  latitude: -19.9167,
  longitude: -43.9345,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

/** Calcula a região do mapa a partir dos pins, com folga mínima. */
function regionFromPins(pins: MapPin[]): Region {
  if (pins.length === 0) {
    return DEFAULT_REGION;
  }

  const latitudes = pins.map((pin) => pin.latitude);
  const longitudes = pins.map((pin) => pin.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.05),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.05),
  };
}

/**
 * Mapa nativo com pins por coordenada (react-native-maps).
 * Na web, o Metro resolve `brand-map.web.tsx` (sem importar esta lib).
 */
export function BrandMap({ pins = [], onPress, rounded = false, style }: Props) {
  const mapRef = useRef<MapView>(null);
  const pinsSignatureRef = useRef('');
  const isPreview = Boolean(onPress);
  const region = regionFromPins(pins);

  useEffect(() => {
    const signature = pins
      .map((pin) => `${pin.id}:${pin.latitude},${pin.longitude}`)
      .join('|');

    if (signature === pinsSignatureRef.current) {
      return;
    }

    pinsSignatureRef.current = signature;

    if (pins.length === 0) {
      return;
    }

    mapRef.current?.animateToRegion(regionFromPins(pins), 350);
  }, [pins]);

  return (
    <View style={[styles.map, rounded && styles.rounded, style]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onPress={onPress}
        scrollEnabled={!isPreview}
        zoomEnabled={!isPreview}
        pitchEnabled={!isPreview}
        rotateEnabled={!isPreview}
        toolbarEnabled={false}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.label}
            tracksViewChanges={false}
            onPress={
              onPress
                ? (event) => {
                    event.stopPropagation();
                    onPress();
                  }
                : undefined
            }
          >
            <View style={styles.pin}>
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
          </Marker>
        ))}
      </MapView>
    </View>
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
  pin: {
    alignItems: 'center',
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
