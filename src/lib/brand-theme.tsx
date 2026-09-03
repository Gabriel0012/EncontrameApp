import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform, useColorScheme } from 'react-native';

import {
  Brand,
  BrandPalettes,
  type BrandColors,
  type ColorSchemeName,
} from '@/constants/brand';
import {
  applySofiaPaletteToBrand,
  getSofiaPalette,
  type SofiaPaletteId,
} from '@/constants/sofia-palettes';
import { loadThemePrefs, saveThemePalette, saveThemeScheme } from '@/lib/sofia-prefs';

type BrandThemeValue = {
  brand: BrandColors;
  colorScheme: ColorSchemeName;
  paletteId: SofiaPaletteId | null;
  setPalette: (id: SofiaPaletteId) => void;
  setScheme: (scheme: ColorSchemeName) => void;
  hydrated: boolean;
};

const BrandThemeContext = createContext<BrandThemeValue>({
  brand: Brand,
  colorScheme: 'light',
  paletteId: null,
  setPalette: () => {},
  setScheme: () => {},
  hydrated: false,
});

function applyWebCssVars(
  brand: BrandColors,
  colorScheme: ColorSchemeName,
  paletteId: SofiaPaletteId | null,
) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.theme = colorScheme;
  root.dataset.palette = paletteId ?? 'brand';
  root.style.setProperty('--background', brand.white);
  root.style.setProperty('--surface', brand.surface);
  root.style.setProperty('--input', brand.fieldBackground);
  root.style.setProperty('--border', brand.fieldBorder);
  root.style.setProperty('--text-primary', brand.textDark);
  root.style.setProperty('--text-secondary', brand.textMuted);
  root.style.setProperty('--text-placeholder', brand.placeholder);
  root.style.setProperty('--text-label', brand.label);
  root.style.setProperty('--primary', brand.blue);
  root.style.setProperty('--primary-hover', brand.blueDark);
  root.style.setProperty('--divider', brand.divider);
  root.style.setProperty('--error', brand.error);
  root.style.setProperty('--avatar-background', brand.avatarBackground);
  root.style.setProperty('--avatar-icon', brand.avatarIcon);
  root.style.setProperty('--chat-bubble-ai', brand.chatBubbleAI);
  root.style.setProperty('--chat-bubble-user', brand.chatBubbleUser);
  root.style.setProperty('--on-chat-bubble-user', brand.onChatBubbleUser);
  root.style.setProperty('--on-primary', brand.onPrimary);
}

export function BrandThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const systemColorScheme: ColorSchemeName = systemScheme === 'dark' ? 'dark' : 'light';

  const [hydrated, setHydrated] = useState(false);
  const [paletteId, setPaletteId] = useState<SofiaPaletteId | null>(null);
  const [schemePreference, setSchemePreference] = useState<ColorSchemeName | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const prefs = await loadThemePrefs();
      if (cancelled) return;
      setPaletteId(prefs.paletteId);
      setSchemePreference(prefs.scheme);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const colorScheme: ColorSchemeName = schemePreference ?? systemColorScheme;

  const brand = useMemo(() => {
    const base = BrandPalettes[colorScheme];
    if (!paletteId) return base;
    return applySofiaPaletteToBrand(base, getSofiaPalette(paletteId, colorScheme));
  }, [colorScheme, paletteId]);

  useEffect(() => {
    applyWebCssVars(brand, colorScheme, paletteId);
  }, [brand, colorScheme, paletteId]);

  const setPalette = useCallback(
    (id: SofiaPaletteId) => {
      setPaletteId(id);
      void saveThemePalette(id);
      if (schemePreference == null) {
        setSchemePreference(systemColorScheme);
        void saveThemeScheme(systemColorScheme);
      }
    },
    [schemePreference, systemColorScheme],
  );

  const setScheme = useCallback(
    (scheme: ColorSchemeName) => {
      setSchemePreference(scheme);
      void saveThemeScheme(scheme);
      if (paletteId == null) {
        setPaletteId('green');
        void saveThemePalette('green');
      }
    },
    [paletteId],
  );

  const value = useMemo(
    () => ({
      brand,
      colorScheme,
      paletteId,
      setPalette,
      setScheme,
      hydrated,
    }),
    [brand, colorScheme, paletteId, setPalette, setScheme, hydrated],
  );

  return <BrandThemeContext.Provider value={value}>{children}</BrandThemeContext.Provider>;
}

/** Paleta ativa (identidade Encontra-me ou overlay Sofia). */
export function useBrand(): BrandColors {
  return useContext(BrandThemeContext).brand;
}

/** `'light' | 'dark'` — preferência salva, ou sistema enquanto não houver escolha. */
export function useBrandColorScheme(): ColorSchemeName {
  return useContext(BrandThemeContext).colorScheme;
}

export function useBrandTheme(): BrandThemeValue {
  return useContext(BrandThemeContext);
}
