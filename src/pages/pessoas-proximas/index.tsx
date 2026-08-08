import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';
import { usePessoasProximasController } from '@/features/pessoas-proximas/pessoas-proximas.controller';
import { PessoasProximasMapSection } from '@/features/pessoas-proximas/sections/pessoas-proximas-map-section';

export default function PessoasProximasPage() {
  const controller = usePessoasProximasController();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader title="Pessoas próximas" />
      </View>
      <View style={styles.mapArea}>
        <PessoasProximasMapSection controller={controller} />
      </View>
      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  mapArea: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
});
