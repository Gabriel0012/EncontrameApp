import { api } from '@/lib/axios';
import { getSessionUser } from '@/lib/session';
import type { GroupChatRepository } from '@/services/grupo-chat/grupo-chat.repository';
import type {
  GroupChatMessage,
  SendGroupMessagePayload,
} from '@/services/grupo-chat/grupo-chat.types';
import { CURRENT_USER } from '@/services/grupo-chat/grupo-chat.types';

interface ApiGroup {
  groupId: number;
  name: string;
  description?: string | null;
}

interface ApiGroupMessage {
  id: number;
  groupId: number;
  userId: number;
  userName: string;
  message: string;
  messageType?: string | null;
  dtRegistration: string;
}

let cachedSupportGroupId: number | null = null;

/** Implementação real: fala com /api/Group e mensagens do grupo de apoio. */
export const grupoChatAxiosRepository: GroupChatRepository = {
  async history() {
    const groupId = await resolveSupportGroupId();
    const { data } = await api.get<ApiGroupMessage[]>(`/api/Group/${groupId}/messages`);
    return data.map(mapMessage);
  },

  async send(payload: SendGroupMessagePayload) {
    const groupId = await resolveSupportGroupId();
    const { data } = await api.post<ApiGroupMessage>(`/api/Group/${groupId}/messages`, {
      message: payload.text,
    });
    return mapMessage(data);
  },
};

async function resolveSupportGroupId(): Promise<number> {
  if (cachedSupportGroupId != null) {
    return cachedSupportGroupId;
  }

  const { data } = await api.get<ApiGroup[]>('/api/Group');
  const support =
    data.find((group) => group.name.toLowerCase() === 'apoio') ?? data[0] ?? null;

  if (!support) {
    throw new Error('Nenhum grupo de apoio disponível.');
  }

  cachedSupportGroupId = support.groupId;
  return support.groupId;
}

function mapMessage(api: ApiGroupMessage): GroupChatMessage {
  const sessionUser = getSessionUser();
  const isMine = sessionUser != null && String(api.userId) === sessionUser.id;

  return {
    id: String(api.id),
    sender: {
      id: String(api.userId),
      name: isMine ? CURRENT_USER.name : api.userName || 'Usuário',
    },
    text: api.message,
    time: formatTime(api.dtRegistration),
    isMine,
  };
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
