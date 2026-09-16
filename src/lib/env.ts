/**
 * Acesso centralizado às variáveis de ambiente públicas do Expo.
 * Só variáveis com prefixo EXPO_PUBLIC_ ficam disponíveis no bundle do app.
 * Fonte: env da máquina / Netlify, depois `.env.local` / `.env.production` (ver AGENTS.md).
 */
export const env = {
  /** Quando true, os services usam os repositórios mockados (sem depender da API). */
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false',
  /** URL base da API (já inclui /api; usada quando useMocks = false). */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  /** Client ID web do OAuth Google (público; audience do ID token). */
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  /** API key da Maps JavaScript API (web). Não use a chave restrita ao Android. */
  googleMapsWebApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY ?? '',
  /** Chave fixa enviada no header X-App-Key (consulta pública pelo app). */
  appKey: process.env.EXPO_PUBLIC_APP_KEY ?? '',
} as const;
