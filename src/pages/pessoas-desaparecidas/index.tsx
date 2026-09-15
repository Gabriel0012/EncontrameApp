import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { RegisterFab } from '@/components/register-fab';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { MaxListingWidth } from '@/constants/theme';
import { usePessoasDesaparecidasController } from '@/features/pessoas-desaparecidas/pessoas-desaparecidas.controller';
import { PessoasDesaparecidasFiltersSection } from '@/features/pessoas-desaparecidas/sections/pessoas-desaparecidas-filters-section';
import { PessoasDesaparecidasListSection } from '@/features/pessoas-desaparecidas/sections/pessoas-desaparecidas-list-section';
import { useBrand } from '@/lib/brand-theme';

export default function PessoasDesaparecidasPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = usePessoasDesaparecidasController();

  const listHeader = (
    <View style={styles.header}>
      <ScreenHeader title="Pessoas desaparecidas" />
      {controller.totalCount > 0 ? (
        <Text style={styles.count}>
          {controller.totalCount} {controller.totalCount === 1 ? 'pessoa' : 'pessoas'}
        </Text>
      ) : null}
      <PessoasDesaparecidasFiltersSection controller={controller} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ContentShell style={styles.shell} maxWidth={MaxListingWidth}>
        <PessoasDesaparecidasListSection controller={controller} header={listHeader} />
      </ContentShell>
      <BottomBar />
      <RegisterFab always />
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
      paddingTop: 8,
    },
    header: {
      gap: 8,
      marginBottom: 12,
    },
    count: {
      color: brand.textMuted,
      fontWeight: '600',
    },
  });
}
