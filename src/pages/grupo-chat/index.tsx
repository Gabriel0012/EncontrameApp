import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useGrupoChatController } from '@/features/grupo-chat/grupo-chat.controller';
import { GrupoChatInputSection } from '@/features/grupo-chat/sections/grupo-chat-input-section';
import { GrupoChatMessagesSection } from '@/features/grupo-chat/sections/grupo-chat-messages-section';

export default function GrupoChatPage() {
  const controller = useGrupoChatController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ContentShell style={styles.shell} noGutter>
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
    paddingHorizontal: PageGutter,
  },
});
