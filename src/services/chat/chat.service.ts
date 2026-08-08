import { useMutation, useQuery } from '@tanstack/react-query';

import { getChatRepository } from '@/services/chat/chat.repository';
import type { SendMessagePayload } from '@/services/chat/chat.types';

const chatKeys = {
  history: ['chat', 'history'] as const,
};

/**
 * Camada de acesso à API do chat exposta como hooks do React Query.
 * O repositório (axios ou mock) é resolvido por env dentro de cada chamada.
 */
export function useChatHistoryQuery() {
  return useQuery({
    queryKey: chatKeys.history,
    queryFn: () => getChatRepository().history(),
  });
}

export function useSendMessageMutation() {
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => getChatRepository().send(payload),
  });
}
