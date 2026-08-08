import { useState } from 'react';
import { Alert } from 'react-native';

import { useChatHistoryQuery, useSendMessageMutation } from '@/services/chat/chat.service';
import type { ChatMessage } from '@/services/chat/chat.types';

function nowTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function todayLabel() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${now.getFullYear()}`;
}

/** Centraliza estado e envio de mensagens do chat com a IA (Sofia). */
export function useChatController() {
  const historyQuery = useChatHistoryQuery();
  const sendMutation = useSendMessageMutation();

  // Mensagens da conversa vindas do histórico (query) + as adicionadas na sessão.
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const messages: ChatMessage[] = [...(historyQuery.data ?? []), ...sessionMessages];

  const canSend = input.trim().length > 0 && !sendMutation.isPending;

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      time: nowTime(),
    };
    setSessionMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const reply = await sendMutation.mutateAsync({ text });
      setSessionMessages((prev) => [...prev, reply]);
    } catch {
      Alert.alert('Falha no envio', 'Não foi possível enviar a mensagem. Tente novamente.');
    }
  };

  return {
    messages,
    input,
    setInput,
    canSend,
    sending: sendMutation.isPending,
    today: todayLabel(),
    handleSend,
  };
}

export type ChatController = ReturnType<typeof useChatController>;
