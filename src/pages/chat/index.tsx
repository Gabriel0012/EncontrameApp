import { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useChatController } from '@/features/chat/chat.controller';
import { ChatHeaderSection } from '@/features/chat/sections/chat-header-section';
import { ChatInputSection } from '@/features/chat/sections/chat-input-section';
import { ChatMessagesSection } from '@/features/chat/sections/chat-messages-section';
import { useBrand } from '@/lib/brand-theme';

export default function ChatPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useChatController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ContentShell style={styles.shell} noGutter>
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

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: brand.white,
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
}
