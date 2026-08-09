import { env } from '@/lib/env';
import { grupoChatAxiosRepository } from '@/services/grupo-chat/grupo-chat.axios.repository';
import { grupoChatMockRepository } from '@/services/grupo-chat/grupo-chat.mock.repository';
import type {
  GroupChatMessage,
  SendGroupMessagePayload,
} from '@/services/grupo-chat/grupo-chat.types';

/** Contrato comum aos repositórios do chat em grupo (axios e mock). */
export interface GroupChatRepository {
  history(): Promise<GroupChatMessage[]>;
  send(payload: SendGroupMessagePayload): Promise<GroupChatMessage>;
}

/**
 * Escolhe o repositório conforme a env: mock quando EXPO_PUBLIC_USE_MOCKS,
 * caso contrário o repositório real via axios.
 */
export function getGroupChatRepository(): GroupChatRepository {
  return env.useMocks ? grupoChatMockRepository : grupoChatAxiosRepository;
}
