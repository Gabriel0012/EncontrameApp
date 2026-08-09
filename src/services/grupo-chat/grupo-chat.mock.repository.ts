import type { GroupChatRepository } from '@/services/grupo-chat/grupo-chat.repository';
import { CURRENT_USER } from '@/services/grupo-chat/grupo-chat.types';
import type { GroupChatMessage, SendGroupMessagePayload } from '@/services/grupo-chat/grupo-chat.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Horário atual formatado como HH:mm (sem depender de locale do device). */
function nowTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const mockHistory: GroupChatMessage[] = [
  {
    id: 'g1',
    sender: CURRENT_USER,
    text: 'Meu filho está desaparecido há 3 dias, alguém pode me ajudar?',
    time: '19:48',
    isMine: true,
  },
  {
    id: 'g2',
    sender: { id: 'u1', name: 'Fulano da Silva' },
    text: 'Também perdi meu filho semana passada. Força pra você.',
    time: '19:50',
    isMine: false,
  },
  {
    id: 'g3',
    sender: CURRENT_USER,
    text: 'Olá, gostaria de me conectar com você.',
    time: '19:50',
    isMine: true,
  },
];

/** Implementação mockada: permite desenvolver sem depender da API. */
export const grupoChatMockRepository: GroupChatRepository = {
  async history() {
    await delay(300);
    return mockHistory;
  },

  async send(payload: SendGroupMessagePayload) {
    await delay(400);
    return {
      id: `me-${Date.now()}`,
      sender: CURRENT_USER,
      text: payload.text,
      time: nowTime(),
      isMine: true,
    } satisfies GroupChatMessage;
  },
};
