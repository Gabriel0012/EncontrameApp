/** Rotas que exigem sessão (APIs [Authorize] + fluxo da Sofia). */
const PROTECTED_PREFIXES = [
  '/chat',
  '/grupo-chat',
  '/exercises',
  '/sofia-welcome',
  '/sofia-theme',
  '/sofia-perfil',
] as const;

/** Destinos internos permitidos após o login (protegidas + início). */
const ALLOWED_RETURN_TO = [...PROTECTED_PREFIXES, '/inicio'] as const;

function stripQueryAndHash(pathname: string) {
  const withoutHash = pathname.split('#')[0] ?? pathname;
  return withoutHash.split('?')[0] ?? withoutHash;
}

function matchesPrefix(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** True quando a rota atual não deve montar sem usuário autenticado. */
export function isProtectedPath(pathname: string): boolean {
  const path = stripQueryAndHash(pathname);
  return PROTECTED_PREFIXES.some((prefix) => matchesPrefix(path, prefix));
}

/**
 * Só aceita caminhos internos da lista (evita open redirect).
 * `string[]` cobre o formato do `useLocalSearchParams`.
 */
export function safeReturnTo(value: string | string[] | undefined | null): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('://')) {
    return null;
  }

  const path = stripQueryAndHash(decoded);
  const allowed = ALLOWED_RETURN_TO.some((prefix) => matchesPrefix(path, prefix));
  return allowed ? path : null;
}
