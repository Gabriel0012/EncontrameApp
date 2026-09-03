import { useMemo } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { type BrandColors, Radius } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useChatController } from '@/features/chat/chat.controller';
import { ChatDisclaimerSection } from '@/features/chat/sections/chat-disclaimer-section';
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
            <ChatHeaderSection controller={controller} />
          </View>
          <View style={styles.flex}>
            <ChatMessagesSection controller={controller} />
          </View>
          <ChatInputSection controller={controller} />
        </KeyboardAvoidingView>
      </ContentShell>

      <ChatDisclaimerSection
        visible={controller.disclaimerVisible}
        onAccept={() => {
          void controller.handleAcceptDisclaimer();
        }}
      />

      <Modal
        transparent
        visible={controller.confirmClear}
        animationType="fade"
        onRequestClose={() => controller.setConfirmClear(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Apagar toda a conversa?</Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => controller.setConfirmClear(false)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={() => void controller.handleClear()} style={styles.modalConfirm}>
                <Text style={styles.modalConfirmText}>Apagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    modalBackdrop: {
      flex: 1,
      backgroundColor: brand.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: PageGutter,
    },
    modalCard: {
      width: '100%',
      backgroundColor: brand.surface,
      borderRadius: Radius.lg,
      padding: PageGutter,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: brand.textDark,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
    },
    modalCancel: {
      flex: 1,
      height: 46,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.fieldBackground,
      borderWidth: 1,
      borderColor: brand.divider,
    },
    modalCancelText: {
      color: brand.textDark,
      fontWeight: '600',
    },
    modalConfirm: {
      flex: 1,
      height: 46,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.error,
    },
    modalConfirmText: {
      color: brand.onPrimary,
      fontWeight: '600',
    },
  });
}
