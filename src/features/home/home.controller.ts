import { useRouter } from 'expo-router';

/** Centraliza a navegação da tela inicial (welcome). */
export function useHomeController() {
  const router = useRouter();

  return {
    goToSignup: () => router.push('/signup'),
    goToLogin: () => router.push('/login'),
  };
}

export type HomeController = ReturnType<typeof useHomeController>;
