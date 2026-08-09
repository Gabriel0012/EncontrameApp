import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { GrupoChatController } from '@/features/grupo-chat/grupo-chat.controller';
import { useBrand } from '@/lib/brand-theme';
import type { GroupChatMessage } from '@/services/grupo-chat/grupo-chat.types';

interface GrupoChatMessagesSectionProps {
  controller: GrupoChatController;
}

export function GrupoChatMessagesSection({ controller }: GrupoChatMessagesSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const listRef = useRef<FlatList<GroupChatMessage>>(null);

  const renderItem = ({ item }: { item: GroupChatMessage }) => {
    if (item.isMine) {
      return (
        <View style={[styles.row, styles.rowMine]}>
          <View style={[styles.bubble, styles.bubbleMine]}>
            <Text style={[styles.text, styles.textMine]}>{item.text}</Text>
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.row, styles.rowOther]}>
        <View style={styles.senderRow}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={20} color={brand.avatarIcon} />
          </View>
          <Text style={styles.senderName}>{item.sender.name}</Text>
        </View>
        <View style={[styles.bubble, styles.bubbleOther]}>
          <Text style={[styles.text, styles.textOther]}>{item.text}</Text>
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
    rowMine: {
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
    },
    rowOther: {
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
    },
    senderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: brand.avatarBackground,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    senderName: {
      fontSize: 13,
      fontWeight: '700',
      color: brand.textMuted,
    },
    bubble: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: Radius.lg,
    },
    bubbleMine: {
      backgroundColor: brand.chatBubbleUser,
      borderBottomRightRadius: Radius.sm,
    },
    bubbleOther: {
      backgroundColor: brand.chatBubbleAI,
      borderBottomLeftRadius: Radius.sm,
    },
    text: {
      fontSize: 15,
      lineHeight: 21,
    },
    textMine: {
      color: brand.onPrimary,
      fontWeight: '600',
    },
    textOther: {
      color: brand.textDark,
    },
    time: {
      fontSize: 12,
      color: brand.placeholder,
    },
  });
}
