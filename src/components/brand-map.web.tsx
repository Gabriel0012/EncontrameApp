import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand, useBrandColorScheme } from '@/lib/brand-theme';
import { env } from '@/lib/env';
import {
  loadGoogleMapsJs,
  type GoogleCircle,
  type GoogleMap,
  type GoogleMapsApi,
  type GoogleMarker,
} from '@/lib/google-maps-web';
import { brandMapStyle } from '@/lib/map-style';
import { type UserLocation, userAccuracyRadius } from '@/lib/use-user-location';

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  locked?: boolean;
};

type Props = {
  pins?: MapPin[];
  userLocation?: UserLocation | null;
  onPress?: () => void;
  rounded?: boolean;
  style?: ViewStyle;
};

const DEFAULT_CENTER = { lat: -19.9167, lng: -43.9345 };
const DEFAULT_ZOOM = 12;

function asHtmlElement(node: unknown): HTMLElement | null {
  if (typeof HTMLElement !== 'undefined' && node instanceof HTMLElement) {
    return node;
  }

  return null;
}

function userDotSvg(fill: string, ring: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="${ring}"/><circle cx="11" cy="11" r="7" fill="${fill}"/></svg>`;
}

function pinIconSvg(color: string, iconColor: string, locked: boolean) {
  const icon = locked
    ? '<path fill="ICON" d="M17.2 11.4V10a3.2 3.2 0 0 0-6.4 0v1.4H9.2V20h11.6v-8.6h-3.6zm-4.8-1.4a1.6 1.6 0 0 1 3.2 0v1.4h-3.2V10z"/>'
    : '<circle fill="ICON" cx="14" cy="11" r="3.2"/><path fill="ICON" d="M8.2 20v-1.4c0-2.1 2.6-3.4 5.8-3.4s5.8 1.3 5.8 3.4V20H8.2z"/>';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><circle cx="14" cy="14" r="12" fill="${color}" stroke="${iconColor}" stroke-width="2"/>${icon.replaceAll('ICON', iconColor)}</svg>`;
}

/**
 * Mapa no navegador via Maps JavaScript API.
 * react-native-maps não roda na web; o Metro usa este arquivo no lugar de brand-map.tsx.
 */
export function BrandMap({
  pins = [],
  userLocation = null,
  onPress,
  rounded = false,
  style,
}: Props) {
  const brand = useBrand();
  const colorScheme = useBrandColorScheme();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const mapStyle = useMemo(() => brandMapStyle(brand, colorScheme), [brand, colorScheme]);
  const mapStyleRef = useRef(mapStyle);
  const apiKey = env.googleMapsWebApiKey;
  const isPreview = Boolean(onPress);
  const hasUser = Boolean(userLocation);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const mapsApiRef = useRef<GoogleMapsApi | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const userMarkerRef = useRef<GoogleMarker | null>(null);
  const userCircleRef = useRef<GoogleCircle | null>(null);
  const userLocationRef = useRef(userLocation);
  const onPressRef = useRef(onPress);
  const sessionKey = `${Boolean(apiKey)}:${isPreview}:${host ? 'ready' : 'wait'}`;
  const [session, setSession] = useState<{ key: string; ok: boolean } | null>(null);

  const status = !apiKey
    ? 'missing-key'
    : session?.key !== sessionKey
      ? 'loading'
      : session.ok
        ? 'ready'
        : 'error';

  useEffect(() => {
    onPressRef.current = onPress;
  }, [onPress]);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    mapStyleRef.current = mapStyle;
    mapRef.current?.setOptions({ styles: mapStyle });
  }, [mapStyle]);

  useEffect(() => {
    if (!apiKey || !host) {
      return;
    }

    let cancelled = false;
    const listeners: { remove: () => void }[] = [];

    loadGoogleMapsJs(apiKey)
      .then((gmaps) => {
        if (cancelled) {
          return;
        }

        const map = new gmaps.Map(host, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          disableDefaultUI: true,
          zoomControl: !isPreview,
          gestureHandling: isPreview ? 'none' : 'greedy',
          clickableIcons: !isPreview,
          keyboardShortcuts: !isPreview,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: mapStyleRef.current,
        });

        mapsApiRef.current = gmaps;
        mapRef.current = map;
        setSession({ key: sessionKey, ok: true });

        if (onPressRef.current) {
          listeners.push(
            gmaps.event.addListener(map, 'click', () => {
              onPressRef.current?.();
            }),
          );
        }

        if (typeof ResizeObserver !== 'undefined') {
          const observer = new ResizeObserver(() => {
            gmaps.event.trigger(map, 'resize');
          });
          observer.observe(host);
          listeners.push({ remove: () => observer.disconnect() });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSession({ key: sessionKey, ok: false });
        }
      });

    return () => {
      cancelled = true;
      listeners.forEach((listener) => listener.remove());
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      userMarkerRef.current?.setMap(null);
      userCircleRef.current?.setMap(null);
      userMarkerRef.current = null;
      userCircleRef.current = null;
      if (mapRef.current && mapsApiRef.current) {
        mapsApiRef.current.event.clearInstanceListeners(mapRef.current);
      }
      mapRef.current = null;
      mapsApiRef.current = null;
    };
  }, [apiKey, host, isPreview, sessionKey]);

  useEffect(() => {
    const map = mapRef.current;
    const gmaps = mapsApiRef.current;
    if (status !== 'ready' || !map || !gmaps) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = pins.map((pin) => {
      const marker = new gmaps.Marker({
        map,
        position: { lat: pin.latitude, lng: pin.longitude },
        title: pin.label,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            pinIconSvg(brand.pin, brand.onPrimary, Boolean(pin.locked)),
          )}`,
          scaledSize: new gmaps.Size(28, 36),
          anchor: new gmaps.Point(14, 14),
        },
      });

      if (onPressRef.current) {
        gmaps.event.addListener(marker, 'click', () => {
          onPressRef.current?.();
        });
      }

      return marker;
    });

    const user = userLocationRef.current;
    const points = [
      ...pins.map((pin) => ({ lat: pin.latitude, lng: pin.longitude })),
      ...(user ? [{ lat: user.latitude, lng: user.longitude }] : []),
    ];

    if (points.length === 0) {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(DEFAULT_ZOOM);
      return;
    }

    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(15);
      return;
    }

    const bounds = new gmaps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 48);
  }, [brand.onPrimary, brand.pin, hasUser, pins, status]);

  useEffect(() => {
    const map = mapRef.current;
    const gmaps = mapsApiRef.current;
    if (status !== 'ready' || !map || !gmaps) {
      return;
    }

    if (!userLocation) {
      userMarkerRef.current?.setMap(null);
      userCircleRef.current?.setMap(null);
      userMarkerRef.current = null;
      userCircleRef.current = null;
      return;
    }

    const position = { lat: userLocation.latitude, lng: userLocation.longitude };
    const radius = userAccuracyRadius(userLocation.accuracy);

    if (!userMarkerRef.current) {
      const marker = new gmaps.Marker({
        map,
        position,
        title: 'Você está aqui',
        zIndex: 10,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            userDotSvg(brand.blue, brand.onPrimary),
          )}`,
          scaledSize: new gmaps.Size(22, 22),
          anchor: new gmaps.Point(11, 11),
        },
      });

      if (onPressRef.current) {
        gmaps.event.addListener(marker, 'click', () => {
          onPressRef.current?.();
        });
      }

      userMarkerRef.current = marker;
    } else {
      userMarkerRef.current.setPosition(position);
      userMarkerRef.current.setIcon({
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
          userDotSvg(brand.blue, brand.onPrimary),
        )}`,
        scaledSize: new gmaps.Size(22, 22),
        anchor: new gmaps.Point(11, 11),
      });
    }

    if (!userCircleRef.current) {
      userCircleRef.current = new gmaps.Circle({
        map,
        center: position,
        radius,
        fillColor: brand.blue,
        fillOpacity: 0.18,
        strokeColor: brand.blue,
        strokeOpacity: 0.4,
        strokeWeight: 1,
        clickable: false,
      });
      return;
    }

    userCircleRef.current.setCenter(position);
    userCircleRef.current.setRadius(radius);
    userCircleRef.current.setOptions({
      fillColor: brand.blue,
      strokeColor: brand.blue,
    });
  }, [brand.blue, brand.onPrimary, status, userLocation]);

  const fallbackMessage =
    status === 'missing-key'
      ? 'Defina EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY no .env'
      : 'Não foi possível carregar o mapa';

  return (
    <View style={[styles.map, rounded && styles.rounded, style]}>
      {apiKey
        ? createElement('div', {
            ref: (node: HTMLDivElement | null) => {
              const element = asHtmlElement(node);
              setHost((current) => (current === element ? current : element));
            },
            style: {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            },
          })
        : null}

      {status === 'missing-key' || status === 'error' ? (
        <View style={styles.fallback} pointerEvents="none">
          <MaterialCommunityIcons name="map-outline" size={40} color={brand.mapStroke} />
          <Text style={styles.hint}>{fallbackMessage}</Text>
        </View>
      ) : null}
    </View>
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
      textAlign: 'center',
      paddingHorizontal: 16,
    },
  });
}
