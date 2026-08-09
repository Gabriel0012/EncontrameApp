import { useMutation, useQuery } from '@tanstack/react-query';

import { getGroupChatRepository } from '@/services/grupo-chat/grupo-chat.repository';
import type { SendGroupMessagePayload } from '@/services/grupo-chat/grupo-chat.types';

const groupChatKeys = {
  history: ['grupo-chat', 'history'] as const,
};

/**
 * Camada de acesso à API do chat em grupo exposta como hooks do React Query.
 * O repositório (axios ou mock) é resolvido por env dentro de cada chamada.
 */
export function useGroupChatHistoryQuery() {
  return useQuery({
    queryKey: groupChatKeys.history,
    queryFn: () => getGroupChatRepository().history(),
  });
}

export function useSendGroupMessageMutation() {
  return useMutation({
    mutationFn: (payload: SendGroupMessagePayload) => getGroupChatRepository().send(payload),
  });
}
