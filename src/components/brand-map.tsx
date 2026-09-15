import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import MapView, { Circle, Marker, type Region } from 'react-native-maps';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand, useBrandColorScheme } from '@/lib/brand-theme';
import { brandMapStyle, hexToRgba } from '@/lib/map-style';
import { type UserLocation, userAccuracyRadius } from '@/lib/use-user-location';

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  locked?: boolean;
  photoUri?: string;
  draggable?: boolean;
  onPress?: () => void;
};

type Props = {
  pins?: MapPin[];
  userLocation?: UserLocation | null;
  onPress?: () => void;
  onMapPress?: (latitude: number, longitude: number) => void;
  onPinDragEnd?: (id: string, latitude: number, longitude: number) => void;
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

/** Calcula a região do mapa a partir dos pins e da posição do usuário. */
function regionFromPins(pins: MapPin[], userLocation?: UserLocation | null): Region {
  const points = [
    ...pins,
    ...(userLocation
      ? [{ latitude: userLocation.latitude, longitude: userLocation.longitude }]
      : []),
  ];

  if (points.length === 0) {
    return DEFAULT_REGION;
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.6, points.length === 1 ? 0.02 : 0.05),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, points.length === 1 ? 0.02 : 0.05),
  };
}

/**
 * Mapa nativo com pins por coordenada (react-native-maps).
 * Na web, o Metro resolve `brand-map.web.tsx` (sem importar esta lib).
 */
export function BrandMap({
  pins = [],
  userLocation = null,
  onPress,
  onMapPress,
  onPinDragEnd,
  rounded = false,
  style,
}: Props) {
  const brand = useBrand();
  const colorScheme = useBrandColorScheme();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const mapStyle = useMemo(() => brandMapStyle(brand, colorScheme), [brand, colorScheme]);
  const mapRef = useRef<MapView>(null);
  const pinsSignatureRef = useRef('');
  const hasUser = Boolean(userLocation);
  const isPreview = Boolean(onPress);
  const region = regionFromPins(pins, userLocation);
  const mapStyleName = [styles.map, rounded && styles.rounded, style];
  const flattened = StyleSheet.flatten(mapStyleName) as ViewStyle;
  const fillsParent = flattened.height == null && flattened.minHeight == null;

  useEffect(() => {
    const signature = `${pins
      .map((pin) => `${pin.id}:${pin.latitude},${pin.longitude}`)
      .join('|')}|user:${hasUser}`;

    if (signature === pinsSignatureRef.current) {
      return;
    }

    pinsSignatureRef.current = signature;

    if (pins.length === 0 && !hasUser) {
      return;
    }

    mapRef.current?.animateToRegion(regionFromPins(pins, userLocation), 350);
  }, [hasUser, pins, userLocation]);

  return (
    <View style={[styles.map, fillsParent && styles.fill, rounded && styles.rounded, style]}>
      <MapView
        ref={mapRef}
        style={[StyleSheet.absoluteFill, rounded && styles.rounded]}
        customMapStyle={mapStyle}
        initialRegion={region}
        onPress={(event) => {
          if (isPreview) {
            onPress?.();
            return;
          }
          const coordinate = event.nativeEvent.coordinate;
          if (coordinate) {
            onMapPress?.(coordinate.latitude, coordinate.longitude);
          }
        }}
        scrollEnabled={!isPreview}
        zoomEnabled={!isPreview}
        pitchEnabled={!isPreview}
        rotateEnabled={!isPreview}
        toolbarEnabled={false}
      >
        {pins.map((pin) => (
          <PersonPinMarker
            key={pin.id}
            pin={pin}
            brand={brand}
            styles={styles}
            isPreview={isPreview}
            onPreviewPress={onPress}
            onPinDragEnd={onPinDragEnd}
          />
        ))}
        {userLocation ? (
          <>
            <Circle
              center={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              radius={userAccuracyRadius(userLocation.accuracy)}
              fillColor={hexToRgba(brand.blue, 0.18)}
              strokeColor={hexToRgba(brand.blue, 0.4)}
              strokeWidth={1}
            />
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              zIndex={10}
              title="Você está aqui"
              onPress={
                onPress
                  ? (event) => {
                      event.stopPropagation();
                      onPress();
                    }
                  : undefined
              }
            >
              <View style={styles.userDotOuter}>
                <View style={styles.userDot} />
              </View>
            </Marker>
          </>
        ) : null}
      </MapView>
    </View>
  );
}

function PersonPinMarker({
  pin,
  brand,
  styles,
  isPreview,
  onPreviewPress,
  onPinDragEnd,
}: {
  pin: MapPin;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
  isPreview: boolean;
  onPreviewPress?: () => void;
  onPinDragEnd?: (id: string, latitude: number, longitude: number) => void;
}) {
  const [photoReady, setPhotoReady] = useState(!pin.photoUri);

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      title={pin.label}
      tracksViewChanges={!photoReady}
      draggable={!isPreview && Boolean(pin.draggable)}
      onDragEnd={(event) => {
        const coordinate = event.nativeEvent.coordinate;
        onPinDragEnd?.(pin.id, coordinate.latitude, coordinate.longitude);
      }}
      onPress={(event) => {
        event.stopPropagation();
        if (isPreview) {
          onPreviewPress?.();
          return;
        }
        pin.onPress?.();
      }}
    >
      <View style={styles.pin}>
        {pin.photoUri ? (
          <Image
            source={{ uri: pin.photoUri }}
            style={styles.pinPhoto}
            onLoad={() => setPhotoReady(true)}
          />
        ) : (
          <View style={styles.pinBadge}>
            <MaterialCommunityIcons
              name={pin.locked ? 'lock' : 'account'}
              size={16}
              color={brand.onPrimary}
            />
          </View>
        )}
        {pin.label ? (
          <Text style={styles.pinLabel} numberOfLines={1}>
            {pin.label}
          </Text>
        ) : null}
      </View>
    </Marker>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    map: {
      position: 'relative',
      backgroundColor: brand.mapBackground,
      borderWidth: 1,
      borderColor: brand.mapStroke,
      overflow: 'hidden',
    },
    fill: {
      flex: 1,
    },
    rounded: {
      borderRadius: Radius.lg,
      overflow: 'hidden',
    },
    pin: {
      alignItems: 'center',
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
    pinPhoto: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: brand.onPrimary,
      backgroundColor: brand.avatarBackground,
    },
    pinLabel: {
      marginTop: 2,
      maxWidth: 90,
      fontSize: 11,
      fontWeight: '700',
      color: brand.textDark,
    },
    userDotOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: brand.onPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: brand.blue,
    },
  });
}
