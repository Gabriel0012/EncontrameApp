import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { GrupoChatController } from '@/features/grupo-chat/grupo-chat.controller';
import { useBrand } from '@/lib/brand-theme';
import { useDesktopChatEnterSubmit } from '@/lib/use-desktop-chat-enter-submit';

const COMPOSER_SIZE = 48;

interface GrupoChatInputSectionProps {
  controller: GrupoChatController;
}

export function GrupoChatInputSection({ controller }: GrupoChatInputSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0 && controller.allowSend;

  const sendDraft = () => {
    const text = draft;
    if (!text.trim() || !controller.allowSend) return;
    setDraft('');
    void controller.handleSend(text).catch(() => {
      setDraft(text);
    });
  };

  const desktopSubmit = useDesktopChatEnterSubmit({
    value: draft,
    onChangeText: setDraft,
    canSend,
    onSend: sendDraft,
  });

  return (
    <View style={styles.bar}>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Digite sua mensagem aqui..."
          placeholderTextColor={brand.placeholder}
          multiline
          textAlignVertical="center"
          underlineColorAndroid="transparent"
          {...desktopSubmit}
        />
      </View>
      <Pressable
        style={[styles.send, !canSend && styles.sendDisabled]}
        onPress={sendDraft}
        disabled={!canSend}
      >
        <MaterialCommunityIcons name="send" size={20} color={brand.onPrimary} />
      </Pressable>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
      paddingHorizontal: PageGutter,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: brand.divider,
      backgroundColor: brand.white,
    },
    field: {
      flex: 1,
      minHeight: COMPOSER_SIZE,
      maxHeight: 120,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      backgroundColor: brand.fieldBackground,
    },
    input: {
      fontSize: 15,
      lineHeight: 20,
      minHeight: 20,
      padding: 0,
      margin: 0,
      maxHeight: 104,
      color: brand.textDark,
    },
    send: {
      width: COMPOSER_SIZE,
      height: COMPOSER_SIZE,
      borderRadius: COMPOSER_SIZE / 2,
      backgroundColor: brand.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendDisabled: {
      backgroundColor: brand.fieldBorder,
    },
  });
}
