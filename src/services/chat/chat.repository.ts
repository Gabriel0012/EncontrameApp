import { env } from '@/lib/env';
import { chatAxiosRepository } from '@/services/chat/chat.axios.repository';
import { chatMockRepository } from '@/services/chat/chat.mock.repository';
import type { ChatMessage, SendMessagePayload } from '@/services/chat/chat.types';

/** Contrato comum aos repositórios do chat (axios e mock). */
export interface ChatRepository {
  history(): Promise<ChatMessage[]>;
  send(payload: SendMessagePayload): Promise<ChatMessage>;
}

/**
 * Escolhe o repositório conforme a env: mock quando EXPO_PUBLIC_USE_MOCKS,
 * caso contrário o repositório real via axios.
 */
export function getChatRepository(): ChatRepository {
  return env.useMocks ? chatMockRepository : chatAxiosRepository;
}
