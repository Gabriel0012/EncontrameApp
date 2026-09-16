import { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useGrupoChatController } from '@/features/grupo-chat/grupo-chat.controller';
import { GrupoChatInputSection } from '@/features/grupo-chat/sections/grupo-chat-input-section';
import { GrupoChatMessagesSection } from '@/features/grupo-chat/sections/grupo-chat-messages-section';
import { useBrand } from '@/lib/brand-theme';
import { useComposerKeyboardPadding } from '@/lib/use-composer-keyboard-padding';

export default function GrupoChatPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useGrupoChatController();
  const composerPadding = useComposerKeyboardPadding();

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'android' ? ['top'] : ['top', 'bottom']}
    >
      <ContentShell style={styles.shell} noGutter>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animated.View style={[styles.flex, composerPadding]}>
            <View style={styles.header}>
              <ScreenHeader title="Grupo do apoio" />
            </View>
            <View style={styles.messages}>
              <GrupoChatMessagesSection controller={controller} />
            </View>
            <GrupoChatInputSection controller={controller} />
          </Animated.View>
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
      minHeight: 0,
    },
    flex: {
      flex: 1,
      minHeight: 0,
    },
    messages: {
      flex: 1,
      minHeight: 0,
    },
    header: {
      paddingHorizontal: PageGutter,
    },
  });
}
