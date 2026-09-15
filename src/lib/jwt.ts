/** Lê o `exp` (unix seconds) de um JWT sem validar a assinatura. */
export function readJwtExpiry(token: string): number | null {
  const part = token.split('.')[1];
  if (!part) return null;

  try {
    const padded = padBase64(part.replace(/-/g, '+').replace(/_/g, '/'));
    const json = decodeBase64(padded);
    const payload = JSON.parse(json) as { exp?: unknown };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

/** True quando o access token já venceu ou vence em breve (não envia JWT morto). */
export function isAccessTokenExpiring(token: string, skewSeconds = 30): boolean {
  const exp = readJwtExpiry(token);
  if (exp == null) return true;
  return exp * 1000 <= Date.now() + skewSeconds * 1000;
}

function padBase64(value: string): string {
  const remainder = value.length % 4;
  if (remainder === 0) return value;
  return value + '='.repeat(4 - remainder);
}

function decodeBase64(value: string): string {
  const globalAtob = (globalThis as { atob?: (data: string) => string }).atob;
  if (typeof globalAtob === 'function') {
    return globalAtob(value);
  }

  const buffer = (globalThis as { Buffer?: { from: (data: string, enc: string) => { toString: (enc: string) => string } } })
    .Buffer;
  if (buffer) {
    return buffer.from(value, 'base64').toString('utf8');
  }

  throw new Error('Base64 decode unavailable.');
}
