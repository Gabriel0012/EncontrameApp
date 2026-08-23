import { useCallback, useRef, useState } from 'react';

import { fieldErrorMessage } from '@/lib/error-messages';
import type { ErrorCode, FieldErrors } from '@/lib/validation';

/** Guarda os códigos de erro por campo e resolve o texto exibido no formulário. */
export function useFieldErrors() {
  const [errors, setErrorsState] = useState<FieldErrors>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const dirtyRef = useRef<Record<string, boolean>>({});

  const markDirty = useCallback((field: string) => {
    if (dirtyRef.current[field]) return;
    dirtyRef.current = { ...dirtyRef.current, [field]: true };
    setDirty(dirtyRef.current);
  }, []);

  const markAllDirty = useCallback((fields: string[]) => {
    let changed = false;
    const next = { ...dirtyRef.current };
    for (const field of fields) {
      if (!next[field]) {
        next[field] = true;
        changed = true;
      }
    }
    if (!changed) return;
    dirtyRef.current = next;
    setDirty(next);
  }, []);

  const isDirty = useCallback((field: string) => Boolean(dirtyRef.current[field]), []);

  const setFieldCode = useCallback((field: string, code: ErrorCode | undefined) => {
    setErrorsState((prev) => {
      if (!code) {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      }
      if (prev[field] === code) return prev;
      return { ...prev, [field]: code };
    });
  }, []);

  const setErrors = useCallback(
    (next: FieldErrors) => {
      setErrorsState(next);
      markAllDirty(Object.keys(next));
    },
    [markAllDirty],
  );

  const fieldError = useCallback(
    (field: string) => {
      if (!dirty[field]) return undefined;
      const code = errors[field];
      return code ? fieldErrorMessage(field, code) : undefined;
    },
    [dirty, errors],
  );

  return { errors, setErrors, setFieldCode, markDirty, markAllDirty, isDirty, fieldError };
}

export type FieldErrorsController = ReturnType<typeof useFieldErrors>;
