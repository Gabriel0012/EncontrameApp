import { isAxiosError } from 'axios';

import { fieldErrorMessage, generalErrorMessage } from '@/lib/error-messages';
import type { ErrorCode, FieldErrors } from '@/lib/validation';

interface ApiFieldError {
  field?: string;
  error?: string;
}

interface ApiErrorBody {
  message?: string;
  errors?: ApiFieldError[];
  title?: string;
  detail?: string;
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
  if (!body) return { fields: {} };
  if (typeof body === 'string') return { code: body, fields: {} };

  const fields: FieldErrors = {};
  for (const item of body.errors ?? []) {
    if (!item?.field || !item.error) continue;
    fields[fieldMap[item.field] ?? item.field] = item.error as ErrorCode;
  }

  return { code: body.message || body.detail || body.title, fields };
}

function isSnakeCode(value: string) {
  return /^[a-z][a-z0-9_]*$/.test(value);
}

/** Texto pronto para o modal de erro (código da API traduzido, ou a mensagem original). */
export function apiErrorDisplayMessage(error: unknown): string {
  if (isAxiosError(error) && !error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'A requisição demorou demais. Tente novamente.';
    }
    return 'Não foi possível conectar. Verifique sua internet.';
  }

  const { code, fields } = parseApiError(error);
  const fieldMessages = Object.entries(fields).map(([field, fieldCode]) =>
    fieldErrorMessage(field, fieldCode),
  );
  if (fieldMessages.length === 1) return fieldMessages[0];
  if (fieldMessages.length > 1) return fieldMessages.join('\n');

  if (code) {
    if (isSnakeCode(code)) return generalErrorMessage(code);
    return code;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return generalErrorMessage();
}
