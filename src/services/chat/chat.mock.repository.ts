import type { ChatRepository } from '@/services/chat/chat.repository';
import type { ChatMessage, SendMessagePayload } from '@/services/chat/chat.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Horário atual formatado como HH:mm (sem depender de locale do device). */
function nowTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const introMessage: ChatMessage = {
  id: 'sofia-intro',
  role: 'assistant',
  text: 'Oi, eu sou a Sofia 🌿 Que bom te ver aqui. Antes de mais nada: eu sou uma IA feita para conversar e apoiar — não substituo um profissional de saúde. Se estiver em emergência no Brasil, ligue 188 (CVV) ou 192 (SAMU).\n\nAgora, me conta: como você está de verdade hoje?',
  time: '19:50',
};

const cannedReplies = [
  'Eu sinto muito que você esteja passando por essa aflição, posso imaginar a sua dor e o tamanho da sua preocupação. Saiba que este é um espaço seguro para você desabafar e colocar seus sentimentos para fora, estou aqui para te ouvir.',
  'Obrigada por compartilhar isso comigo. Respire fundo — você não está sozinho(a) nesse momento. Me conte mais sobre o que está sentindo.',
  'Entendo o quanto isso é difícil. Estou aqui com você. Quer me contar mais detalhes para pensarmos juntos nos próximos passos?',
];

let store: ChatMessage[] = [introMessage];

/** Implementação mockada: respostas acolhedoras enquanto a IA real não é integrada. */
export const chatMockRepository: ChatRepository = {
  async history() {
    await delay(300);
    return [...store];
  },

  async send(payload: SendMessagePayload) {
    await delay(900);
    store = [
      ...store,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: payload.text,
        time: nowTime(),
      },
    ];
    const text = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
    const reply = {
      id: `sofia-${Date.now()}`,
      role: 'assistant' as const,
      text,
      time: nowTime(),
    } satisfies ChatMessage;
    store = [...store, reply];
    return reply;
  },

  async clearHistory() {
    await delay(200);
    store = [introMessage];
  },
};
