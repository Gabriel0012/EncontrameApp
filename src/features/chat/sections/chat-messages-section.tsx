import { useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { ChatController } from '@/features/chat/chat.controller';
import { useBrand } from '@/lib/brand-theme';
import type { ChatMessage } from '@/services/chat/chat.types';

interface ChatMessagesSectionProps {
  controller: ChatController;
}

export function ChatMessagesSection({ controller }: ChatMessagesSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const listRef = useRef<FlatList<ChatMessage>>(null);

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

  return (
    <FlatList
      ref={listRef}
      data={controller.messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      ListHeaderComponent={<Text style={styles.dateLabel}>{controller.today}</Text>}
    />
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: PageGutter,
      paddingVertical: 16,
      gap: 18,
    },
    dateLabel: {
      alignSelf: 'center',
      fontSize: 13,
      fontWeight: '600',
      color: brand.textMuted,
      marginBottom: 6,
    },
    row: {
      maxWidth: '82%',
      gap: 4,
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
    text: {
      fontSize: 15,
      lineHeight: 21,
    },
    textUser: {
      color: brand.onPrimary,
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
