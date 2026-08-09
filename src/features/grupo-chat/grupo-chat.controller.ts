import { useState } from 'react';
import { Alert } from 'react-native';

import {
  useGroupChatHistoryQuery,
  useSendGroupMessageMutation,
} from '@/services/grupo-chat/grupo-chat.service';
import { CURRENT_USER } from '@/services/grupo-chat/grupo-chat.types';
import type { GroupChatMessage } from '@/services/grupo-chat/grupo-chat.types';

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

/** Centraliza estado e envio de mensagens do chat em grupo (Grupo do apoio). */
export function useGrupoChatController() {
  const historyQuery = useGroupChatHistoryQuery();
  const sendMutation = useSendGroupMessageMutation();

  // Mensagens da conversa vindas do histórico (query) + as adicionadas na sessão.
  const [sessionMessages, setSessionMessages] = useState<GroupChatMessage[]>([]);
  const [input, setInput] = useState('');

  const messages: GroupChatMessage[] = [...(historyQuery.data ?? []), ...sessionMessages];

  const canSend = input.trim().length > 0 && !sendMutation.isPending;

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const optimisticMessage: GroupChatMessage = {
      id: `me-${Date.now()}`,
      sender: CURRENT_USER,
      text,
      time: nowTime(),
      isMine: true,
    };
    setSessionMessages((prev) => [...prev, optimisticMessage]);
    setInput('');

    try {
      await sendMutation.mutateAsync({ text });
    } catch {
      setSessionMessages((prev) => prev.filter((message) => message.id !== optimisticMessage.id));
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

export type GrupoChatController = ReturnType<typeof useGrupoChatController>;
