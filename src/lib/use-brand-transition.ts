import { useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { brandTiming } from '@/constants/motion';

/**
 * Anima um número (ex.: opacity) até `value` em 25ms.
 * Retorna um estilo que aplica só `opacity`.
 */
export function useTimedOpacity(value: number) {
  const opacity = useSharedValue(value);

  useEffect(() => {
    opacity.value = brandTiming(value);
  }, [value, opacity]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
}

/**
 * Anima entre inactiveValue e activeValue conforme `active` (25ms).
 * Retorna um estilo que aplica só `opacity`.
 */
export function useTimedNumber(active: boolean, inactiveValue: number, activeValue: number) {
  return useTimedOpacity(active ? activeValue : inactiveValue);
}

/**
 * Anima uma cor entre inactiveColor e activeColor em 25ms.
 * `styleKey` limita o estilo à prop alterada (`backgroundColor` | `borderColor` | `color`).
 */
export function useTimedColor(
  active: boolean,
  inactiveColor: string,
  activeColor: string,
  styleKey: 'backgroundColor' | 'borderColor' | 'color' = 'backgroundColor',
) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = brandTiming(active ? 1 : 0);
  }, [active, progress]);

  return useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, [0, 1], [inactiveColor, activeColor]);
    return { [styleKey]: color };
  });
}
