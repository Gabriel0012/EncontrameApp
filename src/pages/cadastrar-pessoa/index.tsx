import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';
import { useCadastrarPessoaController } from '@/features/cadastrar-pessoa/cadastrar-pessoa.controller';
import { CadastrarPessoaBasicSection } from '@/features/cadastrar-pessoa/sections/cadastrar-pessoa-basic-section';
import { CadastrarPessoaDetailsSection } from '@/features/cadastrar-pessoa/sections/cadastrar-pessoa-details-section';

export default function CadastrarPessoaPage() {
  const controller = useCadastrarPessoaController();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ContentShell>
            <ScreenHeader title="Cadastrar uma pessoa" />
            <View style={styles.form}>
              <CadastrarPessoaBasicSection controller={controller} />
              <CadastrarPessoaDetailsSection controller={controller} />
            </View>
          </ContentShell>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBar active="register" />
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
    paddingBottom: 24,
  },
  form: {
    marginTop: 16,
    gap: 18,
  },
});
