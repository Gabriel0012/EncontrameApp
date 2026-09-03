import { type Href, useRouter } from 'expo-router';

import { getSofiaPalette } from '@/constants/sofia-palettes';
import { useBrandTheme } from '@/lib/brand-theme';

/** Apresentação da Sofia na primeira visita ao chat. */
export function useSofiaWelcomeController() {
  const router = useRouter();
  const { paletteId, colorScheme } = useBrandTheme();
  const palette = getSofiaPalette(paletteId ?? 'green', colorScheme);

  const continueToTheme = () => {
    router.push('/sofia-theme?from=welcome' as Href);
  };

  return {
    palette,
    continueToTheme,
  };
}

export type SofiaWelcomeController = ReturnType<typeof useSofiaWelcomeController>;
