import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandFab } from '@/components/brand-fab';
import { useWideLayout } from '@/lib/use-wide-layout';

type Props = {
  onPress: () => void;
};

/** Atalho circular da Sofia na home (o cadastro fica na barra / menu). */
export function SofiaFab({ onPress }: Props) {
  const insets = useSafeAreaInsets();
  const { isWide } = useWideLayout();
  const bottom = isWide ? Math.max(insets.bottom, 24) + 8 : Math.max(insets.bottom, 10) + 72;

  return (
    <BrandFab
      accessibilityLabel="Conversar com a Sofia"
      image={require('@/assets/images/sofia-avatar.jpg')}
      onPress={onPress}
      style={{ bottom, right: 24, zIndex: 30, elevation: 12 }}
    />
  );
}
