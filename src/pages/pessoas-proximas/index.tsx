import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { RegisterFab } from '@/components/register-fab';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { usePessoasProximasController } from '@/features/pessoas-proximas/pessoas-proximas.controller';
import { PessoasProximasMapSection } from '@/features/pessoas-proximas/sections/pessoas-proximas-map-section';
import { useBrand } from '@/lib/brand-theme';

export default function PessoasProximasPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = usePessoasProximasController();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ContentShell style={styles.shell}>
        <View style={styles.header}>
          <ScreenHeader title="Pessoas próximas" />
        </View>
        <View style={styles.mapArea}>
          <PessoasProximasMapSection controller={controller} />
        </View>
      </ContentShell>
      <BottomBar />
      <RegisterFab />
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
    header: {
      paddingTop: 8,
    },
    mapArea: {
      flex: 1,
      paddingTop: 8,
      paddingBottom: 14,
    },
  });
}
