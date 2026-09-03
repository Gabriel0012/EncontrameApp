import { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { ChatTypingDots } from '@/components/chat-typing-dots';
import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { ChatController } from '@/features/chat/chat.controller';
import { useBrand } from '@/lib/brand-theme';
import { useScrollListToEnd } from '@/lib/use-scroll-list-to-end';
import type { ChatMessage } from '@/services/chat/chat.types';

interface ChatMessagesSectionProps {
  controller: ChatController;
}

export function ChatMessagesSection({ controller }: ChatMessagesSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const lastMessageId = controller.messages.at(-1)?.id;
  const { listRef, scrollToEnd } = useScrollListToEnd<ChatMessage>(
    `${lastMessageId ?? ''}:${controller.sending ? '1' : '0'}`,
  );

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>{item.text}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    );
  };

  if (controller.loading && controller.messages.length === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={brand.blue} />
        <Text style={styles.loadingText}>Um momento…</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={controller.messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => scrollToEnd()}
      ListHeaderComponent={<Text style={styles.dateLabel}>{controller.today}</Text>}
      ListFooterComponent={
        controller.sending ? (
          <View
            style={[styles.row, styles.rowAI, styles.typingFooter]}
            onLayout={() => scrollToEnd()}
          >
            <View style={[styles.bubble, styles.bubbleAI, styles.typingBubble]}>
              <ChatTypingDots />
            </View>
          </View>
        ) : (
          <View style={styles.footerSpacer} />
        )
      }
    />
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: PageGutter,
      paddingTop: 16,
      paddingBottom: 20,
      flexGrow: 1,
    },
    list: {
      flex: 1,
      minHeight: 0,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    loadingText: {
      fontSize: 13,
      color: brand.textMuted,
    },
    dateLabel: {
      alignSelf: 'center',
      fontSize: 13,
      fontWeight: '600',
      color: brand.textMuted,
      marginBottom: 18,
    },
    row: {
      maxWidth: '82%',
      gap: 4,
      marginBottom: 18,
    },
    rowUser: {
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
    },
    rowAI: {
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
    },
    bubble: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: Radius.lg,
    },
    bubbleUser: {
      backgroundColor: brand.chatBubbleUser,
      borderBottomRightRadius: Radius.sm,
    },
    bubbleAI: {
      backgroundColor: brand.chatBubbleAI,
      borderBottomLeftRadius: Radius.sm,
    },
    typingBubble: {
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    typingFooter: {
      paddingBottom: 8,
    },
    footerSpacer: {
      height: 4,
    },
    text: {
      fontSize: 15,
      lineHeight: 21,
    },
    textUser: {
      color: brand.onChatBubbleUser,
      fontWeight: '600',
    },
    textAI: {
      color: brand.textDark,
    },
    time: {
      fontSize: 12,
      color: brand.placeholder,
    },
  });
}
