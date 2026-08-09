import { api } from '@/lib/axios';
import type { GroupChatRepository } from '@/services/grupo-chat/grupo-chat.repository';
import type {
  GroupChatMessage,
  SendGroupMessagePayload,
} from '@/services/grupo-chat/grupo-chat.types';

/** Implementação real: fala com a API existente via axios. */
export const grupoChatAxiosRepository: GroupChatRepository = {
  async history() {
    const { data } = await api.get<GroupChatMessage[]>('/grupos/apoio/mensagens');
    return data;
  },

  async send(payload: SendGroupMessagePayload) {
    const { data } = await api.post<GroupChatMessage>('/grupos/apoio/mensagens', payload);
    return data;
  },
};
