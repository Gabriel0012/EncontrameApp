import { BrandFab } from '@/components/brand-fab';
import { InicioSidebarWidth } from '@/constants/theme';
import { useBottomSafeInset } from '@/lib/use-bottom-safe-inset';
import { useWideLayout } from '@/lib/use-wide-layout';

type Props = {
  onPress: () => void;
};

/** Atalho circular da Sofia na home (o cadastro fica na barra / menu). */
export function SofiaFab({ onPress }: Props) {
  const bottomInset = useBottomSafeInset();
  const { isWide } = useWideLayout();
  const bottom = isWide ? bottomInset + 8 : bottomInset + 72;
  const left = isWide ? InicioSidebarWidth + 24 : 24;

  return (
    <BrandFab
      accessibilityLabel="Conversar com a Sofia"
      image={require('@/assets/images/sofia-avatar.jpg')}
      onPress={onPress}
      style={{ bottom, left, zIndex: 30, elevation: 12 }}
    />
  );
}
