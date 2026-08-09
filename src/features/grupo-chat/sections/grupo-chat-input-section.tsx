import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { GrupoChatController } from '@/features/grupo-chat/grupo-chat.controller';
import { useBrand } from '@/lib/brand-theme';

interface GrupoChatInputSectionProps {
  controller: GrupoChatController;
}

export function GrupoChatInputSection({ controller }: GrupoChatInputSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.bar}>
      <TextInput
        style={styles.input}
        value={controller.input}
        onChangeText={controller.setInput}
        placeholder="Digite sua mensagem aqui..."
        placeholderTextColor={brand.placeholder}
        multiline
      />
      <Pressable
        style={[styles.send, !controller.canSend && styles.sendDisabled]}
        onPress={controller.handleSend}
        disabled={!controller.canSend}
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
    input: {
      flex: 1,
      minHeight: 52,
      maxHeight: 120,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      backgroundColor: brand.fieldBackground,
      fontSize: 15,
      color: brand.textDark,
    },
    send: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: brand.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendDisabled: {
      backgroundColor: brand.fieldBorder,
    },
  });
}
