import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';
import { SignupFormSection } from '@/features/signup/sections/signup-form-section';
import { useSignupController } from '@/features/signup/signup.controller';

export default function SignupPage() {
  const controller = useSignupController();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ContentShell>
            <ScreenHeader title="Criar uma conta" />
            <SignupFormSection controller={controller} />
          </ContentShell>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBar />
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
  content: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 16,
  },
});
