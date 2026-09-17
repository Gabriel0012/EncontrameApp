import { BrandFab } from '@/components/brand-fab';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** FAB no estilo do Maps: centraliza na localização atual só no toque. */
export function MapMyLocationFab({ onPress, disabled = false, style }: Props) {
  return (
    <BrandFab
      accessibilityLabel="Centralizar na minha localização"
      icon="crosshairs-gps"
      variant="surface"
      disabled={disabled}
      onPress={onPress}
      style={[{ bottom: 16, right: 16, zIndex: 25, elevation: 10 }, style]}
    />
  );
}
