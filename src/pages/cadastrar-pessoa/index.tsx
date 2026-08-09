import { useMemo, useRef } from 'react';
import {
  KeyboardAvoidingView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { useCadastrarPessoaController } from '@/features/cadastrar-pessoa/cadastrar-pessoa.controller';
import { CadastrarPessoaBasicSection } from '@/features/cadastrar-pessoa/sections/cadastrar-pessoa-basic-section';
import { CadastrarPessoaDetailsSection } from '@/features/cadastrar-pessoa/sections/cadastrar-pessoa-details-section';
import { CadastrarPessoaSubmitFabSection } from '@/features/cadastrar-pessoa/sections/cadastrar-pessoa-submit-fab-section';
import { useBrand } from '@/lib/brand-theme';

export default function CadastrarPessoaPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useCadastrarPessoaController();
  const layoutHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const offsetYRef = useRef(0);

  const syncSubmitVisibility = () => {
    controller.updateSubmitVisibility({
      contentHeight: contentHeightRef.current,
      layoutHeight: layoutHeightRef.current,
      offsetY: offsetYRef.current,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    offsetYRef.current = contentOffset.y;
    layoutHeightRef.current = layoutMeasurement.height;
    contentHeightRef.current = contentSize.height;
    syncSubmitVisibility();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onLayout={(event) => {
            layoutHeightRef.current = event.nativeEvent.layout.height;
            syncSubmitVisibility();
          }}
          onContentSizeChange={(_width, height) => {
            contentHeightRef.current = height;
            syncSubmitVisibility();
          }}
        >
          <ContentShell>
            <ScreenHeader title="Cadastrar uma pessoa" />
            <View style={styles.form}>
              <CadastrarPessoaBasicSection controller={controller} />
              <CadastrarPessoaDetailsSection controller={controller} />
            </View>
          </ContentShell>
        </ScrollView>
      </KeyboardAvoidingView>
      <CadastrarPessoaSubmitFabSection controller={controller} />
      <BottomBar active="register" />
    </SafeAreaView>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: brand.white,
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
}
