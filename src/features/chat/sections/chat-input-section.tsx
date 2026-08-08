import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';
import type { ChatController } from '@/features/chat/chat.controller';

interface ChatInputSectionProps {
  controller: ChatController;
}

export function ChatInputSection({ controller }: ChatInputSectionProps) {
  return (
    <View style={styles.bar}>
      <TextInput
        style={styles.input}
        value={controller.input}
        onChangeText={controller.setInput}
        placeholder="Digite sua mensagem aqui..."
        placeholderTextColor={Brand.placeholder}
        multiline
      />
      <Pressable
        style={[styles.send, !controller.canSend && styles.sendDisabled]}
        onPress={controller.handleSend}
        disabled={!controller.canSend}
      >
        <MaterialCommunityIcons name="send" size={20} color={Brand.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Brand.divider,
    backgroundColor: Brand.white,
  },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.fieldBorder,
    backgroundColor: Brand.white,
    fontSize: 15,
    color: Brand.textDark,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Brand.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: Brand.fieldBorder,
  },
});
