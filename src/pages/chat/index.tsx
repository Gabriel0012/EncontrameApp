import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { Brand } from '@/constants/brand';
import { useChatController } from '@/features/chat/chat.controller';
import { ChatHeaderSection } from '@/features/chat/sections/chat-header-section';
import { ChatInputSection } from '@/features/chat/sections/chat-input-section';
import { ChatMessagesSection } from '@/features/chat/sections/chat-messages-section';

export default function ChatPage() {
  const controller = useChatController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ContentShell style={styles.shell}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <ChatHeaderSection />
          </View>
          <View style={styles.flex}>
            <ChatMessagesSection controller={controller} />
          </View>
          <ChatInputSection controller={controller} />
        </KeyboardAvoidingView>
      </ContentShell>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  shell: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
  },
});
