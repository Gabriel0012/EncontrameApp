import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import {
  Brand,
  BrandPalettes,
  type BrandColors,
  type ColorSchemeName,
} from '@/constants/brand';

type BrandThemeValue = {
  brand: BrandColors;
  colorScheme: ColorSchemeName;
};

const BrandThemeContext = createContext<BrandThemeValue>({
  brand: Brand,
  colorScheme: 'light',
});

export function BrandThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const colorScheme: ColorSchemeName = scheme === 'dark' ? 'dark' : 'light';
  const value = useMemo(
    () => ({
      brand: BrandPalettes[colorScheme],
      colorScheme,
    }),
    [colorScheme],
  );

  return <BrandThemeContext.Provider value={value}>{children}</BrandThemeContext.Provider>;
}

/** Paleta ativa conforme preferência do sistema. */
export function useBrand(): BrandColors {
  return useContext(BrandThemeContext).brand;
}

/** `'light' | 'dark'` resolvido a partir de `useColorScheme`. */
export function useBrandColorScheme(): ColorSchemeName {
  return useContext(BrandThemeContext).colorScheme;
}
