import { useWindowDimensions } from 'react-native';

import { WideLayoutBreakpoint } from '@/constants/theme';

export function useWideLayout() {
  const { width } = useWindowDimensions();
  return {
    width,
    isWide: width >= WideLayoutBreakpoint,
  };
}
