export type ChatRole = 'user' | 'assistant';

/** Mensagem trocada no chat com a IA (Sofia). */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  /** Horário formatado para exibição (HH:mm). */
  time: string;
}

export interface SendMessagePayload {
  text: string;
}
