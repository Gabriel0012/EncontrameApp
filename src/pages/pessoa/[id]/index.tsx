import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { usePessoaDetalheController } from '@/features/pessoa-detalhe/pessoa-detalhe.controller';
import { PessoaDetalheHeroSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-hero-section';
import { PessoaDetalheHistorySection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-history-section';
import { PessoaDetalheInfoSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-info-section';
import { PessoaDetalheSightingSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-sighting-section';
import { PessoaDetalheThanksSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-thanks-section';
import { useBrand } from '@/lib/brand-theme';

export default function PessoaDetalhePage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = usePessoaDetalheController();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ContentShell>
          <ScreenHeader title={controller.person?.fullName ?? 'Pessoa desaparecida'} />
          {controller.loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={brand.orange} />
            </View>
          ) : controller.notFound ? (
            <Text style={styles.empty}>Não encontramos essa pessoa.</Text>
          ) : (
            <View style={styles.body}>
              <PessoaDetalheHeroSection controller={controller} />
              <PessoaDetalheInfoSection controller={controller} />
              <PessoaDetalheSightingSection controller={controller} />
            </View>
          )}
        </ContentShell>
      </ScrollView>
      <PessoaDetalheThanksSection controller={controller} />
      <PessoaDetalheHistorySection controller={controller} />
    </SafeAreaView>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: brand.white,
    },
    content: {
      flexGrow: 1,
      paddingTop: 8,
      paddingBottom: 32,
    },
    body: {
      marginTop: 16,
      gap: 24,
    },
    center: {
      paddingTop: 48,
      alignItems: 'center',
    },
    empty: {
      marginTop: 32,
      fontSize: 16,
      color: brand.textMuted,
    },
  });
}
