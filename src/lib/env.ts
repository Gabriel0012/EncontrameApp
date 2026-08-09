/**
 * Acesso centralizado às variáveis de ambiente públicas do Expo.
 * Só variáveis com prefixo EXPO_PUBLIC_ ficam disponíveis no bundle do app.
 */
export const env = {
  /** Quando true, os services usam os repositórios mockados (sem depender da API). */
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false',
  /** URL base da API (já inclui /api; usada quando useMocks = false). */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
} as const;
