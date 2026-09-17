/**
 * Tokens de layout/tipografia (não cores de marca — essas ficam em brand.ts).
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
/** Listagem em 2 colunas no desktop precisa de um pouco mais de largura. */
export const MaxListingWidth = 1100;
/** Margem horizontal padrão das telas (alinha shell, top bar, forms, etc.). */
export const PageGutter = Spacing.four;
/** Telas a partir deste width usam layout em 2 colunas (web/tablet). */
export const WideLayoutBreakpoint = 768;
/** Largura do painel esquerdo da home no desktop (lista estilo Maps). */
export const InicioSidebarWidth = 400;

/** Métricas de botão/campo: conforto no mobile, compacto no desktop. */
export const ComfortControl = {
  buttonHeight: 54,
  buttonFont: 17,
  buttonPadH: 24,
  fieldMinHeight: 52,
  fieldFont: 16,
  fieldPadH: 18,
  fieldPadV: 12,
  labelFont: 14,
  headerTitle: 22,
  icon: 22,
} as const;

export const CompactControl = {
  buttonHeight: 40,
  buttonFont: 14,
  buttonPadH: 16,
  fieldMinHeight: 40,
  fieldFont: 14,
  fieldPadH: 14,
  fieldPadV: 8,
  labelFont: 12,
  headerTitle: 18,
  icon: 18,
} as const;

export type ControlMetrics = {
  buttonHeight: number;
  buttonFont: number;
  buttonPadH: number;
  fieldMinHeight: number;
  fieldFont: number;
  fieldPadH: number;
  fieldPadV: number;
  labelFont: number;
  headerTitle: number;
  icon: number;
};

export function controlMetrics(compact: boolean): ControlMetrics {
  return compact ? CompactControl : ComfortControl;
}
