import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Reserva mínima da barra de 3 botões no Android (edge-to-edge). */
const ANDROID_NAV_MIN = 54;
const DEFAULT_MIN = 10;

/** Padding inferior que desvia da barra de navegação do sistema. */
export function useBottomSafeInset() {
  const { bottom } = useSafeAreaInsets();
  const min = Platform.OS === 'android' ? ANDROID_NAV_MIN : DEFAULT_MIN;
  return Math.max(bottom, min);
}
