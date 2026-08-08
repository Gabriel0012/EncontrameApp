import { api } from '@/lib/axios';
import type { ChatRepository } from '@/services/chat/chat.repository';
import type { ChatMessage, SendMessagePayload } from '@/services/chat/chat.types';

/** Implementação real: fala com a API existente via axios. */
export const chatAxiosRepository: ChatRepository = {
  async history() {
    const { data } = await api.get<ChatMessage[]>('/chat/messages');
    return data;
  },

  async send(payload: SendMessagePayload) {
    const { data } = await api.post<ChatMessage>('/chat/messages', payload);
    return data;
  },
};
