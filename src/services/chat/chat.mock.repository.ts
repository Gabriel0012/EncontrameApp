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
  text: 'Olá! Eu sou a Sofia, e você pode me ver como uma amiga que está aqui para te escutar com toda a atenção e sem julgamentos. Meu propósito é te oferecer um ombro amigo e um espaço seguro para você colocar para fora o que está sentindo.',
  time: '19:50',
};

const cannedReplies = [
  'Eu sinto muito que você esteja passando por essa aflição, posso imaginar a sua dor e o tamanho da sua preocupação. Saiba que este é um espaço seguro para você desabafar e colocar seus sentimentos para fora, estou aqui para te ouvir.',
  'Obrigada por compartilhar isso comigo. Respire fundo — você não está sozinho(a) nesse momento. Me conte mais sobre o que está sentindo.',
  'Entendo o quanto isso é difícil. Estou aqui com você. Quer me contar mais detalhes para pensarmos juntos nos próximos passos?',
];

/** Implementação mockada: respostas acolhedoras enquanto a IA real não é integrada. */
export const chatMockRepository: ChatRepository = {
  async history() {
    await delay(300);
    return [introMessage];
  },

  async send(_payload: SendMessagePayload) {
    await delay(900);
    const text = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
    return {
      id: `sofia-${Date.now()}`,
      role: 'assistant',
      text,
      time: nowTime(),
    } satisfies ChatMessage;
  },
};
