import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';
import { useGrupoChatController } from '@/features/grupo-chat/grupo-chat.controller';
import { GrupoChatInputSection } from '@/features/grupo-chat/sections/grupo-chat-input-section';
import { GrupoChatMessagesSection } from '@/features/grupo-chat/sections/grupo-chat-messages-section';

export default function GrupoChatPage() {
  const controller = useGrupoChatController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <ScreenHeader title="Grupo do apoio" />
        </View>
        <View style={styles.flex}>
          <GrupoChatMessagesSection controller={controller} />
        </View>
        <GrupoChatInputSection controller={controller} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
  },
});
