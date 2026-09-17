import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createElement, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { MapMyLocationFab } from '@/components/map-my-location-fab';
import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand, useBrandColorScheme } from '@/lib/brand-theme';
import { env } from '@/lib/env';
import {
  loadGoogleMapsJs,
  type GoogleCircle,
  type GoogleMap,
  type GoogleMapsApi,
  type GoogleMarker,
  type GoogleOverlayView,
  type GooglePolyline,
  type LatLngLiteral,
} from '@/lib/google-maps-web';
import { brandMapStyle } from '@/lib/map-style';
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

export type BrandMapHandle = {
  recenterOnUser: () => void;
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
  showLocationFab?: boolean;
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

function photoPinSvg(id: string, photoUri: string, ring: string) {
  const clipId = `face-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const href = photoUri.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="36" height="36" viewBox="0 0 36 36"><defs><clipPath id="${clipId}"><circle cx="18" cy="18" r="15"/></clipPath></defs><circle cx="18" cy="18" r="17" fill="${ring}"/><image href="${href}" xlink:href="${href}" x="3" y="3" width="30" height="30" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/></svg>`;
}

function pinIcon(pin: MapPin, brand: BrandColors) {
  if (pin.photoUri) {
    return photoPinSvg(pin.id, pin.photoUri, brand.onPrimary);
  }

  return pinIconSvg(brand.pin, brand.onPrimary, Boolean(pin.locked));
}

function pinIconSize(pin: MapPin, emphasized: boolean) {
  const photo = Boolean(pin.photoUri);
  if (photo) {
    const size = emphasized ? 48 : 36;
    return { width: size, height: size, anchorX: size / 2, anchorY: size / 2 };
  }

  return emphasized
    ? { width: 40, height: 48, anchorX: 20, anchorY: 20 }
    : { width: 28, height: 36, anchorX: 14, anchorY: 14 };
}

function applyMarkerIcon(
  gmaps: GoogleMapsApi,
  marker: GoogleMarker,
  pin: MapPin,
  brand: BrandColors,
  emphasized: boolean,
) {
  const size = pinIconSize(pin, emphasized);
  marker.setIcon({
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinIcon(pin, brand))}`,
    scaledSize: new gmaps.Size(size.width, size.height),
    anchor: new gmaps.Point(size.anchorX, size.anchorY),
  });
  marker.setOpacity?.(pin.opacity ?? 1);
  marker.setZIndex?.(pin.zIndex ?? 1);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function createTooltipElement(tooltip: MapPinTooltip, brand: BrandColors) {
  const root = document.createElement('div');
  root.style.position = 'absolute';
  root.style.transform = 'translate(-50%, calc(-100% - 12px))';
  root.style.background = brand.white;
  root.style.color = brand.textDark;
  root.style.padding = '10px 12px';
  root.style.borderRadius = `${Radius.md}px`;
  root.style.border = `1px solid ${brand.divider}`;
  root.style.boxShadow = '0 8px 20px rgba(11, 36, 66, 0.18)';
  root.style.maxWidth = '220px';
  root.style.pointerEvents = 'none';
  root.style.zIndex = '3';
  root.innerHTML = `<div style="font-size:13px;font-weight:800;line-height:1.3">${escapeHtml(tooltip.title)}</div><div style="margin-top:2px;font-size:12px;font-weight:500;color:${brand.textMuted};line-height:1.35">${escapeHtml(tooltip.subtitle)}</div>`;
  return root;
}

function attachTooltipOverlay(
  gmaps: GoogleMapsApi,
  map: GoogleMap,
  position: LatLngLiteral,
  content: HTMLElement,
): GoogleOverlayView {
  const overlay = new gmaps.OverlayView();
  overlay.onAdd = () => {
    overlay.getPanes?.()?.floatPane?.appendChild(content);
  };
  overlay.draw = () => {
    const point = overlay.getProjection?.()?.fromLatLngToDivPixel(position);
    if (!point) {
      return;
    }
    content.style.left = `${point.x}px`;
    content.style.top = `${point.y}px`;
  };
  overlay.onRemove = () => {
    content.remove();
  };
  overlay.setMap(map);
  return overlay;
}

function dashedPolylineOptions(path: LatLngLiteral[], color: string) {
  return {
    path,
    geodesic: true,
    strokeOpacity: 0,
    strokeWeight: 3,
    clickable: false,
    zIndex: 0,
    icons: [
      {
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          strokeColor: color,
          scale: 3,
        },
        offset: '0',
        repeat: '14px',
      },
    ],
  };
}

/**
 * Mapa no navegador via Maps JavaScript API.
 * react-native-maps não roda na web; o Metro usa este arquivo no lugar de brand-map.tsx.
 */
export const BrandMap = forwardRef<BrandMapHandle, Props>(function BrandMap(
  {
    pins = [],
    polylines = [],
    userLocation = null,
    onPress,
    onMapPress,
    onPinDragEnd,
    rounded = false,
    mapPadding,
    showLocationFab = true,
    style,
  },
  ref,
) {
  const brand = useBrand();
  const colorScheme = useBrandColorScheme();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const mapStyle = useMemo(() => brandMapStyle(brand, colorScheme), [brand, colorScheme]);
  const mapStyleRef = useRef(mapStyle);
  const apiKey = env.googleMapsWebApiKey;
  const isPreview = Boolean(onPress);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const mapsApiRef = useRef<GoogleMapsApi | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const polylinesRef = useRef<GooglePolyline[]>([]);
  const tooltipRef = useRef<GoogleOverlayView | null>(null);
  const clearHighlightRef = useRef<() => void>(() => undefined);
  const userMarkerRef = useRef<GoogleMarker | null>(null);
  const userCircleRef = useRef<GoogleCircle | null>(null);
  const userLocationRef = useRef(userLocation);
  const onPressRef = useRef(onPress);
  const onMapPressRef = useRef(onMapPress);
  const onPinDragEndRef = useRef(onPinDragEnd);
  const mapPaddingRef = useRef(mapPadding);
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
    onMapPressRef.current = onMapPress;
  }, [onMapPress]);

  useEffect(() => {
    onPinDragEndRef.current = onPinDragEnd;
  }, [onPinDragEnd]);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    mapStyleRef.current = mapStyle;
    mapRef.current?.setOptions({ styles: mapStyle });
  }, [mapStyle]);

  useEffect(() => {
    mapPaddingRef.current = mapPadding;
  }, [mapPadding]);

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
          padding: mapPaddingRef.current,
        });

        mapsApiRef.current = gmaps;
        mapRef.current = map;
        setSession({ key: sessionKey, ok: true });
        requestAnimationFrame(() => {
          gmaps.event.trigger(map, 'resize');
        });

        listeners.push(
          gmaps.event.addListener(map, 'click', (event) => {
            clearHighlightRef.current();
            if (onPressRef.current) {
              onPressRef.current();
              return;
            }

            const latLng = event?.latLng;
            if (latLng) {
              onMapPressRef.current?.(latLng.lat(), latLng.lng());
            }
          }),
        );

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
      tooltipRef.current?.setMap(null);
      tooltipRef.current = null;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      polylinesRef.current.forEach((line) => line.setMap(null));
      polylinesRef.current = [];
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

    tooltipRef.current?.setMap(null);
    tooltipRef.current = null;
    markersRef.current.forEach((marker) => marker.setMap(null));
    polylinesRef.current.forEach((line) => line.setMap(null));

    let stickyId: string | null = null;
    let hoveredId: string | null = null;

    const hideTooltip = () => {
      tooltipRef.current?.setMap(null);
      tooltipRef.current = null;
    };

    const showTooltip = (pin: MapPin) => {
      hideTooltip();
      if (!pin.tooltip) {
        return;
      }
      const content = createTooltipElement(pin.tooltip, brand);
      tooltipRef.current = attachTooltipOverlay(gmaps, map, {
        lat: pin.latitude,
        lng: pin.longitude,
      }, content);
    };

    const setEmphasized = (pinId: string | null) => {
      markersRef.current.forEach((marker, index) => {
        const pin = pins[index];
        if (!pin) {
          return;
        }
        applyMarkerIcon(gmaps, marker, pin, brand, pinId === pin.id);
      });
    };

    const activeId = () => stickyId ?? hoveredId;

    clearHighlightRef.current = () => {
      stickyId = null;
      hoveredId = null;
      hideTooltip();
      setEmphasized(null);
    };

    markersRef.current = pins.map((pin) => {
      const size = pinIconSize(pin, Boolean(pin.emphasized));
      const marker = new gmaps.Marker({
        map,
        position: { lat: pin.latitude, lng: pin.longitude },
        title: pin.tooltip ? undefined : pin.label,
        draggable: Boolean(pin.draggable) && !onPressRef.current,
        opacity: pin.opacity ?? 1,
        zIndex: pin.zIndex ?? 1,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinIcon(pin, brand))}`,
          scaledSize: new gmaps.Size(size.width, size.height),
          anchor: new gmaps.Point(size.anchorX, size.anchorY),
        },
      });

      gmaps.event.addListener(marker, 'mouseover', () => {
        if (onPressRef.current) {
          return;
        }
        hoveredId = pin.id;
        setEmphasized(activeId());
        showTooltip(pin);
      });

      gmaps.event.addListener(marker, 'mouseout', () => {
        if (onPressRef.current) {
          return;
        }
        hoveredId = null;
        if (stickyId) {
          const stickyPin = pins.find((item) => item.id === stickyId);
          setEmphasized(stickyId);
          if (stickyPin) {
            showTooltip(stickyPin);
          }
          return;
        }
        hideTooltip();
        setEmphasized(null);
      });

      gmaps.event.addListener(marker, 'click', () => {
        if (onPressRef.current) {
          onPressRef.current();
          return;
        }
        stickyId = pin.id;
        setEmphasized(pin.id);
        showTooltip(pin);
        pin.onPress?.();
      });

      gmaps.event.addListener(marker, 'dragend', () => {
        const position = marker.getPosition?.();
        if (!position) {
          return;
        }
        onPinDragEndRef.current?.(pin.id, position.lat(), position.lng());
      });

      return marker;
    });

    polylinesRef.current = polylines.map((line) => {
      const path = line.coordinates.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      }));
      return new gmaps.Polyline(
        line.dashed
          ? { map, ...dashedPolylineOptions(path, brand.blue) }
          : {
              map,
              path,
              geodesic: true,
              strokeColor: brand.blue,
              strokeOpacity: 1,
              strokeWeight: 3,
              clickable: false,
              zIndex: 0,
            },
      );
    });

    return () => {
      hideTooltip();
      clearHighlightRef.current = () => undefined;
    };
  }, [brand, pins, polylines, status]);

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
      ? 'Defina EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY no ambiente'
      : 'Não foi possível carregar o mapa';
  const mapBoxStyle = [styles.map, rounded && styles.rounded, style];
  const flattened = StyleSheet.flatten(mapBoxStyle) as ViewStyle;
  const fillsParent = flattened.height == null && flattened.minHeight == null;
  const explicitHeight = typeof flattened.height === 'number' ? flattened.height : undefined;

  const recenterOnUser = () => {
    const map = mapRef.current;
    if (!map || !userLocation) {
      return;
    }
    map.setCenter({ lat: userLocation.latitude, lng: userLocation.longitude });
    map.setZoom(16);
  };

  useImperativeHandle(ref, () => ({ recenterOnUser }));

  return (
    <View style={[styles.map, fillsParent && styles.fill, rounded && styles.rounded, style]}>
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
              height: explicitHeight ?? '100%',
              minHeight: explicitHeight,
              overflow: 'hidden',
              borderRadius: rounded ? Radius.lg : 0,
            },
          })
        : null}

      {status === 'missing-key' || status === 'error' ? (
        <View style={styles.fallback} pointerEvents="none">
          <MaterialCommunityIcons name="map-outline" size={40} color={brand.mapStroke} />
          <Text style={styles.hint}>{fallbackMessage}</Text>
        </View>
      ) : null}
      {isPreview || !showLocationFab ? null : (
        <MapMyLocationFab onPress={recenterOnUser} disabled={!userLocation} />
      )}
    </View>
  );
});

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
