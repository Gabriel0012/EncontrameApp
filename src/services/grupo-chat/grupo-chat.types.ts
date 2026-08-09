/** Remetente de uma mensagem do grupo de apoio. */
export interface GroupChatSender {
  id: string;
  name: string;
}

/** Usuário atual (ainda não há sessão real logada — ver AGENTS.md). */
export const CURRENT_USER: GroupChatSender = { id: 'me', name: 'Você' };

/** Mensagem trocada no chat em grupo entre pessoas que buscam ajuda. */
export interface GroupChatMessage {
  id: string;
  sender: GroupChatSender;
  text: string;
  /** Horário formatado para exibição (HH:mm). */
  time: string;
  /** Indica se a mensagem foi enviada pelo usuário atual. */
  isMine: boolean;
}

export interface SendGroupMessagePayload {
  text: string;
}
