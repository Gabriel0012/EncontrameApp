import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { RegisterFab } from '@/components/register-fab';
import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';
import { usePessoasProximasController } from '@/features/pessoas-proximas/pessoas-proximas.controller';
import { PessoasProximasMapSection } from '@/features/pessoas-proximas/sections/pessoas-proximas-map-section';

export default function PessoasProximasPage() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
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
