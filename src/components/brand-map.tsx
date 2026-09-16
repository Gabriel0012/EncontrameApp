import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import MapView, { Callout, Circle, Marker, Polyline, type Region } from 'react-native-maps';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand, useBrandColorScheme } from '@/lib/brand-theme';
import { brandMapStyle, hexToRgba } from '@/lib/map-style';
import { type UserLocation, userAccuracyRadius } from '@/lib/use-user-location';

export type MapPinTooltip = {
  title: string;
  subtitle: string;
};

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  locked?: boolean;
  photoUri?: string;
  draggable?: boolean;
  opacity?: number;
  emphasized?: boolean;
  zIndex?: number;
  tooltip?: MapPinTooltip;
  onPress?: () => void;
};

export type MapPolyline = {
  id: string;
  coordinates: { latitude: number; longitude: number }[];
  dashed?: boolean;
};

export type MapPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Props = {
  pins?: MapPin[];
  polylines?: MapPolyline[];
  userLocation?: UserLocation | null;
  onPress?: () => void;
  onMapPress?: (latitude: number, longitude: number) => void;
  onPinDragEnd?: (id: string, latitude: number, longitude: number) => void;
  rounded?: boolean;
  mapPadding?: MapPadding;
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
  polylines = [],
  userLocation = null,
  onPress,
  onMapPress,
  onPinDragEnd,
  rounded = false,
  mapPadding,
  style,
}: Props) {
  const brand = useBrand();
  const colorScheme = useBrandColorScheme();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const mapStyle = useMemo(() => brandMapStyle(brand, colorScheme), [brand, colorScheme]);
  const mapRef = useRef<MapView>(null);
  const pinsSignatureRef = useRef('');
  const [activePinId, setActivePinId] = useState<string | null>(null);
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
    <View
      collapsable={false}
      style={[
        styles.map,
        fillsParent && styles.fill,
        rounded && styles.rounded,
        style,
        mapPadding && {
          paddingTop: mapPadding.top,
          paddingRight: mapPadding.right,
          paddingBottom: mapPadding.bottom,
          paddingLeft: mapPadding.left,
        },
      ]}
    >
      <MapView
        ref={mapRef}
        style={[styles.mapView, rounded && styles.roundedMap]}
        customMapStyle={mapStyle}
        initialRegion={region}
        userInterfaceStyle={colorScheme}
        onMapReady={() => {
          mapRef.current?.animateToRegion(regionFromPins(pins, userLocation), 1);
        }}
        onPress={(event) => {
          if (isPreview) {
            onPress?.();
            return;
          }
          setActivePinId(null);
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
        {polylines.map((line) => (
          <Polyline
            key={line.id}
            coordinates={line.coordinates}
            strokeColor={brand.blue}
            strokeWidth={3}
            lineDashPattern={line.dashed ? [8, 6] : undefined}
            geodesic
            zIndex={0}
          />
        ))}
        {pins.map((pin) => (
          <PersonPinMarker
            key={pin.id}
            pin={pin}
            brand={brand}
            styles={styles}
            isPreview={isPreview}
            emphasized={Boolean(pin.emphasized) || activePinId === pin.id}
            onPreviewPress={onPress}
            onPinDragEnd={onPinDragEnd}
            onSelect={() => setActivePinId(pin.id)}
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
  emphasized,
  onPreviewPress,
  onPinDragEnd,
  onSelect,
}: {
  pin: MapPin;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
  isPreview: boolean;
  emphasized: boolean;
  onPreviewPress?: () => void;
  onPinDragEnd?: (id: string, latitude: number, longitude: number) => void;
  onSelect: () => void;
}) {
  const [photoReady, setPhotoReady] = useState(!pin.photoUri);

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      title={pin.tooltip ? undefined : pin.label}
      opacity={pin.opacity ?? 1}
      zIndex={pin.zIndex ?? 1}
      tracksViewChanges={!photoReady || emphasized}
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
        onSelect();
        pin.onPress?.();
      }}
    >
      <View style={styles.pin}>
        {pin.photoUri ? (
          <Image
            source={{ uri: pin.photoUri }}
            style={emphasized ? styles.pinPhotoLg : styles.pinPhoto}
            onLoad={() => setPhotoReady(true)}
          />
        ) : (
          <View style={emphasized ? styles.pinBadgeLg : styles.pinBadge}>
            <MaterialCommunityIcons
              name={pin.locked ? 'lock' : 'account'}
              size={emphasized ? 20 : 16}
              color={brand.onPrimary}
            />
          </View>
        )}
        {pin.label && !pin.tooltip ? (
          <Text style={styles.pinLabel} numberOfLines={1}>
            {pin.label}
          </Text>
        ) : null}
      </View>
      {pin.tooltip ? (
        <Callout tooltip>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipTitle}>{pin.tooltip.title}</Text>
            <Text style={styles.tooltipSubtitle}>{pin.tooltip.subtitle}</Text>
          </View>
        </Callout>
      ) : null}
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
      overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
    },
    fill: {
      flex: 1,
    },
    mapView: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...(Platform.OS === 'android' ? { opacity: 0.99 } : {}),
    },
    rounded: {
      borderRadius: Radius.lg,
      overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
    },
    roundedMap: {
      borderRadius: Radius.lg,
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
    pinBadgeLg: {
      width: 40,
      height: 40,
      borderRadius: 20,
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
    pinPhotoLg: {
      width: 48,
      height: 48,
      borderRadius: 24,
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
    tooltip: {
      maxWidth: 220,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: Radius.md,
      backgroundColor: brand.white,
      borderWidth: 1,
      borderColor: brand.divider,
    },
    tooltipTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: brand.textDark,
    },
    tooltipSubtitle: {
      marginTop: 2,
      fontSize: 12,
      color: brand.textMuted,
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
