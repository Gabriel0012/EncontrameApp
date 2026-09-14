import type { BrandColors } from '@/constants/brand';

/** Prefixo dos IDs gravados só no aparelho, antes do sync com a API. */
export const LOCAL_PERSON_ID_PREFIX = 'local-';

/** Sentinel de client: não colide com StatusIds da API (Pendente=1, …). */
export const LOCAL_PERSON_STATUS_ID = 0;
export const LOCAL_PERSON_STATUS_LABEL = 'Cadastro pendente';

const STATUS_PENDENTE = 1;
const STATUS_PROCURADO = 2;
const STATUS_ENCONTRADO = 3;
const STATUS_CANCELADO = 99;

export function isLocalPersonId(id: string): boolean {
  return id.startsWith(LOCAL_PERSON_ID_PREFIX);
}

/** Cor do badge/texto de status (cadastro local âmbar, antes do Pendente vermelho). */
export function resolvePersonStatusColor(
  brand: BrandColors,
  statusId?: number,
  description?: string,
): string {
  if (statusId === LOCAL_PERSON_STATUS_ID) return brand.statusCadastroPendente;
  if (statusId === STATUS_PENDENTE) return brand.statusPendente;
  if (statusId === STATUS_PROCURADO) return brand.statusProcurando;
  if (statusId === STATUS_ENCONTRADO) return brand.statusEncontrado;
  if (statusId === STATUS_CANCELADO) return brand.statusCancelado;

  const normalized = description?.trim().toLowerCase() ?? '';
  if (normalized.includes('cadastro pendente')) return brand.statusCadastroPendente;
  if (normalized.includes('pendente')) return brand.statusPendente;
  if (normalized.includes('procur')) return brand.statusProcurando;
  if (normalized.includes('encontrado')) return brand.statusEncontrado;
  if (normalized.includes('cancelado')) return brand.statusCancelado;

  return brand.statusCancelado;
}
