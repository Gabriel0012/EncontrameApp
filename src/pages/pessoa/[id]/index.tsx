import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandEnter } from '@/components/brand-enter';
import { ContentShell } from '@/components/content-shell';
import { PersonAlertIcon } from '@/components/person-alert-icon';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { usePessoaDetalheController } from '@/features/pessoa-detalhe/pessoa-detalhe.controller';
import { PessoaDetalheHeroSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-hero-section';
import { PessoaDetalheHistorySection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-history-section';
import { PessoaDetalheInfoSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-info-section';
import { PessoaDetalheSightingSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-sighting-section';
import { PessoaDetalheThanksSection } from '@/features/pessoa-detalhe/sections/pessoa-detalhe-thanks-section';
import { useBrand } from '@/lib/brand-theme';
import { useBottomSafeInset } from '@/lib/use-bottom-safe-inset';

export default function PessoaDetalhePage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = usePessoaDetalheController();
  const bottomInset = useBottomSafeInset();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 32 + bottomInset }]}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      >
        <ContentShell>
          <ScreenHeader
            title={controller.person?.fullName ?? 'Pessoa desaparecida'}
            accessory={
              <PersonAlertIcon
                statusId={controller.person?.statusId}
                statusDescription={controller.person?.statusDescription}
                size={18}
              />
            }
          />
          {controller.loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={brand.orange} />
            </View>
          ) : controller.notFound ? (
            <BrandEnter from="fade">
              <Text style={styles.empty}>Não encontramos essa pessoa.</Text>
            </BrandEnter>
          ) : (
            <BrandEnter from="up" style={styles.body}>
              <PessoaDetalheHeroSection controller={controller} />
              <PessoaDetalheInfoSection controller={controller} />
              <PessoaDetalheSightingSection controller={controller} />
            </BrandEnter>
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
