import { isAxiosError } from 'axios';

import type { ErrorCode, FieldErrors } from '@/lib/validation';

interface ApiFieldError {
  field?: string;
  error?: string;
}

interface ApiErrorBody {
  message?: string;
  errors?: ApiFieldError[];
}

export interface ParsedApiError {
  /** Código geral (`validation_failed`, `conflict`, `invalid_credentials`, …). */
  code?: string;
  /** Erros por campo, já renomeados para os nomes usados no formulário. */
  fields: FieldErrors;
}

/**
 * Traduz o corpo de erro da API (`{ message, errors: [{ field, error }] }`)
 * para os campos do formulário. `fieldMap` renomeia o campo da API quando
 * o nome no app é diferente (ex.: `document` → `cpf`).
 */
export function parseApiError(
  error: unknown,
  fieldMap: Record<string, string> = {},
): ParsedApiError {
  if (!isAxiosError(error)) return { fields: {} };

  const body = error.response?.data as ApiErrorBody | string | undefined;
  if (!body || typeof body === 'string') return { fields: {} };

  const fields: FieldErrors = {};
  for (const item of body.errors ?? []) {
    if (!item?.field || !item.error) continue;
    fields[fieldMap[item.field] ?? item.field] = item.error as ErrorCode;
  }

  return { code: body.message, fields };
}
