import { type Href, useRouter } from 'expo-router';

/** Perfil da Sofia, no espírito dos detalhes de um contato. */
export function useSofiaPerfilController() {
  const router = useRouter();

  const goBackToChat = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/chat' as Href);
  };

  const goToExercises = () => {
    router.push('/exercises' as Href);
  };

  const goToTheme = () => {
    router.push('/sofia-theme' as Href);
  };

  return {
    goBackToChat,
    goToExercises,
    goToTheme,
  };
}

export type SofiaPerfilController = ReturnType<typeof useSofiaPerfilController>;
