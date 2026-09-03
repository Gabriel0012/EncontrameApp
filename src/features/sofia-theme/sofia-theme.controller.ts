import { useEffect, useRef } from 'react';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

import {
  getSofiaPalette,
  sofiaPaletteOrder,
  type SofiaPaletteId,
} from '@/constants/sofia-palettes';
import { useBrandTheme } from '@/lib/brand-theme';
import { completeSofiaWelcome } from '@/lib/sofia-prefs';

const asText = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? '');

/** Escolha de claro/escuro e cor primária da Sofia. */
export function useSofiaThemeController() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fromWelcome = asText(params.from) === 'welcome';
  const { paletteId, colorScheme, setPalette, setScheme, hydrated } = useBrandTheme();
  const selectedId: SofiaPaletteId = paletteId ?? 'green';
  const didInit = useRef(false);

  useEffect(() => {
    if (!hydrated || didInit.current) return;
    didInit.current = true;
    if (paletteId == null) {
      setPalette('green');
    }
  }, [hydrated, paletteId, setPalette]);

  const continueToChat = () => {
    void (async () => {
      await completeSofiaWelcome();
      router.replace('/chat' as Href);
    })();
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/inicio' as Href);
  };

  return {
    fromWelcome,
    selectedId,
    colorScheme,
    setPalette,
    setScheme,
    continueToChat,
    goBack,
    palettes: sofiaPaletteOrder.map((id) => getSofiaPalette(id, colorScheme)),
  };
}

export type SofiaThemeController = ReturnType<typeof useSofiaThemeController>;
