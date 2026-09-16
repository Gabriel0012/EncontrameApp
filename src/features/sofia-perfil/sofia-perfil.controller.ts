import { type Href, useRouter } from 'expo-router';

import { useSafeBack } from '@/lib/safe-back';

/** Perfil da Sofia, no espírito dos detalhes de um contato. */
export function useSofiaPerfilController() {
  const router = useRouter();
  const goBackToChat = useSafeBack('/chat' as Href);

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
