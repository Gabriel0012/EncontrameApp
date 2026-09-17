import { useWindowDimensions } from 'react-native';

import { controlMetrics, WideLayoutBreakpoint } from '@/constants/theme';

export function useWideLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= WideLayoutBreakpoint;
  return {
    width,
    isWide,
    compact: isWide,
    control: controlMetrics(isWide),
  };
}
