/**
 * Regras de validação espelhadas na API (`EcontrameApi.Application/Validation/FieldRules.cs`).
 * Alterar as duas pontas juntas.
 */

import { onlyDigits } from '@/lib/masks';

export type ErrorCode =
  | 'required'
  | 'invalid_format'
  | 'too_short'
  | 'out_of_range'
  | 'already_registered'
  | 'photo_invalid'
  | 'photo_empty'
  | 'photo_too_large';

/** Código de erro por campo do formulário. */
export type FieldErrors = Record<string, ErrorCode>;

export const NAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 6;

const EMAIL_REGEX = /^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/;

export const isEmail = (value: string) => EMAIL_REGEX.test(value.trim());

/** CEP com 8 dígitos. */
export const isCep = (value: string) => onlyDigits(value).length === 8;

/** Telefone brasileiro: DDD (sem zero) + 8 ou 9 dígitos. */
export function isPhone(value: string) {
  const digits = onlyDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;
  return digits[0] !== '0' && digits[1] !== '0';
}

/** CPF: 11 dígitos, não todos iguais e com dígitos verificadores válidos. */
export function isCpf(value: string) {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;
  if (digits.split('').every((digit) => digit === digits[0])) return false;

  return checkDigit(digits, 9) === digits[9] && checkDigit(digits, 10) === digits[10];
}

function checkDigit(digits: string, position: number) {
  const weight = position + 1;
  let sum = 0;

  for (let i = 0; i < position; i += 1) {
    sum += Number(digits[i]) * (weight - i);
  }

  const remainder = (sum * 10) % 11;
  return String(remainder === 10 ? 0 : remainder);
}

/** Obrigatório + tamanho mínimo. */
export function textError(value: string, minLength = 0): ErrorCode | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'required';
  if (minLength > 0 && trimmed.length < minLength) return 'too_short';
  return undefined;
}

/** Obrigatório + formato. */
export function formatError(
  value: string,
  isValid: (value: string) => boolean,
): ErrorCode | undefined {
  if (!value.trim()) return 'required';
  if (!isValid(value)) return 'invalid_format';
  return undefined;
}

/** Só valida o formato quando o campo está preenchido. */
export function optionalFormatError(
  value: string,
  isValid: (value: string) => boolean,
): ErrorCode | undefined {
  if (!value.trim()) return undefined;
  if (!isValid(value)) return 'invalid_format';
  return undefined;
}

/** Só valida a faixa quando o campo está preenchido. */
export function optionalRangeError(
  value: string,
  min: number,
  max: number,
): ErrorCode | undefined {
  if (!value.trim()) return undefined;

  const parsed = Number(value.replace(',', '.'));
  if (Number.isNaN(parsed)) return 'invalid_format';
  if (parsed < min || parsed > max) return 'out_of_range';
  return undefined;
}

/** Descarta os campos válidos e devolve só os erros. */
export function collectErrors(entries: Record<string, ErrorCode | undefined>): FieldErrors {
  const errors: FieldErrors = {};

  for (const [field, code] of Object.entries(entries)) {
    if (code) errors[field] = code;
  }

  return errors;
}
