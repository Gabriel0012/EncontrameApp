import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
} from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { ChatController } from '@/features/chat/chat.controller';
import { useBrand } from '@/lib/brand-theme';
import { useDesktopChatEnterSubmit } from '@/lib/use-desktop-chat-enter-submit';

const COMPOSER_SIZE = 40;
const SEND_SIZE = 28;
const LINE_HEIGHT = 20;
const INPUT_MAX_HEIGHT = 100;

interface ChatInputSectionProps {
  controller: ChatController;
}

export function ChatInputSection({ controller }: ChatInputSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const [draft, setDraft] = useState('');
  const [inputHeight, setInputHeight] = useState(LINE_HEIGHT);
  const typing = draft.length > 0;
  const canSend = draft.trim().length > 0 && controller.allowSend;

  const sendDraft = () => {
    const text = draft;
    if (!text.trim() || !controller.allowSend) return;
    setDraft('');
    setInputHeight(LINE_HEIGHT);
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

  const onContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    const next = Math.ceil(event.nativeEvent.contentSize.height);
    setInputHeight(Math.min(INPUT_MAX_HEIGHT, Math.max(LINE_HEIGHT, next)));
  };

  return (
    <View style={styles.bar}>
      <View style={styles.field}>
        <TextInput
          style={[styles.input, { height: inputHeight }]}
          value={draft}
          onChangeText={setDraft}
          onContentSizeChange={onContentSizeChange}
          placeholder="Escreva o que está sentindo…"
          placeholderTextColor={brand.placeholder}
          multiline
          textAlignVertical="center"
          underlineColorAndroid="transparent"
          {...desktopSubmit}
        />
        {typing ? (
          <Pressable
            style={[styles.send, !canSend && styles.sendDisabled]}
            onPress={sendDraft}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Enviar"
          >
            <MaterialCommunityIcons name="send" size={14} color={brand.onPrimary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    bar: {
      paddingHorizontal: PageGutter,
      paddingVertical: 10,
      backgroundColor: brand.white,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: COMPOSER_SIZE,
      maxHeight: 120,
      paddingLeft: 16,
      paddingRight: 6,
      paddingVertical: 6,
      gap: 8,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      backgroundColor: brand.fieldBackground,
    },
    input: {
      flex: 1,
      fontSize: 15,
      lineHeight: LINE_HEIGHT,
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
      margin: 0,
      color: brand.textDark,
      includeFontPadding: false,
    },
    send: {
      width: SEND_SIZE,
      height: SEND_SIZE,
      borderRadius: SEND_SIZE / 2,
      backgroundColor: brand.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendDisabled: {
      backgroundColor: brand.fieldBorder,
    },
  });
}
