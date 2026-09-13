import { useRef, useState } from 'react';

import {
  authenticate,
  biometricCopy,
  getBiometricEnabled,
  getBiometricKind,
  isBiometricAvailable,
  setBiometricEnabled,
  type BiometricCopy,
} from '@/lib/biometric';

/** Oferece ativar biometria após cadastro/login, se o aparelho tiver digital/Face ID. */
export function useBiometricEnroll() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copy, setCopy] = useState<BiometricCopy>(() => biometricCopy('generic'));
  const enrollPromptRef = useRef(copy.enrollPrompt);
  const resolveRef = useRef<(() => void) | null>(null);

  const finish = () => {
    setBusy(false);
    setVisible(false);
    resolveRef.current?.();
    resolveRef.current = null;
  };

  const promptIfAvailable = async () => {
    const [available, enabled] = await Promise.all([isBiometricAvailable(), getBiometricEnabled()]);
    if (!available || enabled) return;

    const next = biometricCopy(await getBiometricKind());
    enrollPromptRef.current = next.enrollPrompt;
    setCopy(next);

    await new Promise<void>((resolve) => {
      resolveRef.current = resolve;
      setVisible(true);
    });
  };

  const accept = async () => {
    setBusy(true);
    try {
      const ok = await authenticate(enrollPromptRef.current);
      if (ok) await setBiometricEnabled(true);
    } finally {
      finish();
    }
  };

  const decline = () => {
    finish();
  };

  return { visible, busy, copy, accept, decline, promptIfAvailable };
}

export type BiometricEnrollController = ReturnType<typeof useBiometricEnroll>;
