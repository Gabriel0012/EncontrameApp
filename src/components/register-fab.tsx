import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandFab } from '@/components/brand-fab';
import { useWideLayout } from '@/lib/use-wide-layout';

/**
 * FAB para cadastrar pessoa em telas largas — substitui a aba do BottomBar.
 */
export function RegisterFab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isWide } = useWideLayout();

  if (!isWide) {
    return null;
  }

  return (
    <BrandFab
      accessibilityLabel="Cadastrar uma pessoa"
      onPress={() => router.push('/cadastrar-pessoa')}
      style={{ bottom: Math.max(insets.bottom, 24) + 8, right: 24 }}
    />
  );
}
