import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandFab } from '@/components/brand-fab';
import { useWideLayout } from '@/lib/use-wide-layout';

type Props = {
  /** Quando true, aparece também no mobile (acima da BottomBar). */
  always?: boolean;
  /** Empurra o FAB para cima (ex.: carrossel da home no desktop). */
  extraBottom?: number;
};

/**
 * FAB para cadastrar pessoa em telas largas — substitui a aba do BottomBar.
 * Na listagem (`always`) fica fixo no canto inferior direito em qualquer largura.
 */
export function RegisterFab({ always = false, extraBottom = 0 }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isWide } = useWideLayout();

  if (!always && !isWide) {
    return null;
  }

  const bottom =
    (always && !isWide ? Math.max(insets.bottom, 10) + 72 : Math.max(insets.bottom, 24) + 8) +
    extraBottom;

  return (
    <BrandFab
      accessibilityLabel="Cadastrar uma pessoa"
      onPress={() => router.push('/cadastrar-pessoa')}
      style={{ bottom, right: 24, zIndex: 30, elevation: 12 }}
    />
  );
}
