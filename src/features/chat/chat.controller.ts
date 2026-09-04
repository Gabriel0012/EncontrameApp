import { useQueryClient } from '@tanstack/react-query';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  acceptSofiaDisclaimer,
  isSofiaDisclaimerAccepted,
  isSofiaWelcomeComplete,
} from '@/lib/sofia-prefs';
import {
  chatKeys,
  useChatHistoryQuery,
  useClearChatHistoryMutation,
  useSendMessageMutation,
} from '@/services/chat/chat.service';
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const historyQuery = useChatHistoryQuery();
  const sendMutation = useSendMessageMutation();
  const clearMutation = useClearChatHistoryMutation();

  const [optimistic, setOptimistic] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [disclaimerReady, setDisclaimerReady] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [welcomeGate, setWelcomeGate] = useState<'checking' | 'ok'>('checking');

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const welcomeDone = await isSofiaWelcomeComplete();
      if (!mounted) return;
      if (!welcomeDone) {
        router.replace('/sofia-welcome' as Href);
        return;
      }
      setWelcomeGate('ok');

      const accepted = await isSofiaDisclaimerAccepted();
      if (mounted) {
        setDisclaimerAccepted(accepted);
        setDisclaimerReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  const messages: ChatMessage[] = [...(historyQuery.data ?? []), ...optimistic];

  const canSend = input.trim().length > 0 && !sendMutation.isPending && disclaimerAccepted;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !disclaimerAccepted) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      time: nowTime(),
    };
    setOptimistic((prev) => [...prev, userMessage]);
    setInput('');

    try {
      await sendMutation.mutateAsync({ text });
      setOptimistic([]);
      await queryClient.invalidateQueries({ queryKey: chatKeys.history });
    } catch {
      setOptimistic((prev) => prev.filter((message) => message.id !== userMessage.id));
      setInput(text);
    }
  };

  const handleAcceptDisclaimer = async () => {
    await acceptSofiaDisclaimer();
    setDisclaimerAccepted(true);
  };

  const handleClear = async () => {
    setConfirmClear(false);
    try {
      await clearMutation.mutateAsync();
      setOptimistic([]);
    } catch {
      setOptimistic([]);
    }
  };

  return {
    messages,
    input,
    setInput,
    canSend,
    sending: sendMutation.isPending,
    clearing: clearMutation.isPending,
    loading: historyQuery.isLoading,
    today: todayLabel(),
    handleSend,
    disclaimerVisible: disclaimerReady && !disclaimerAccepted,
    handleAcceptDisclaimer,
    confirmClear,
    setConfirmClear,
    handleClear,
    welcomeGate,
  };
}

export type ChatController = ReturnType<typeof useChatController>;
