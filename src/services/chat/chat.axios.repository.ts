import { api } from '@/lib/axios';
import type { ChatRepository } from '@/services/chat/chat.repository';
import type { ChatMessage, ChatRole, SendMessagePayload } from '@/services/chat/chat.types';

interface ApiChatMessage {
  id: number;
  message: string;
  messageType?: string | null;
  sentBy?: string | null;
  dtRegistration: string;
}

/** Implementação real: fala com /api/IAChat/messages. */
export const chatAxiosRepository: ChatRepository = {
  async history() {
    const { data } = await api.get<ApiChatMessage[]>('/api/IAChat/messages');
    return data.map(mapMessage);
  },

  async send(payload: SendMessagePayload) {
    const { data } = await api.post<ApiChatMessage[]>('/api/IAChat/messages', {
      message: payload.text,
    });

    const assistant =
      [...data].reverse().find((item) => normalizeRole(item.sentBy) === 'assistant') ?? data.at(-1);

    if (!assistant) {
      throw new Error('A API não retornou resposta da assistente.');
    }

    return mapMessage(assistant);
  },
};

function mapMessage(api: ApiChatMessage): ChatMessage {
  return {
    id: String(api.id),
    role: normalizeRole(api.sentBy),
    text: api.message,
    time: formatTime(api.dtRegistration),
  };
}

function normalizeRole(sentBy?: string | null): ChatRole {
  return sentBy?.toLowerCase() === 'assistant' ? 'assistant' : 'user';
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
