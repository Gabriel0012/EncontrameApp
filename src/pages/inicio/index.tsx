import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { Brand } from '@/constants/brand';
import { useInicioController } from '@/features/inicio/inicio.controller';
import { InicioMapSection } from '@/features/inicio/sections/inicio-map-section';
import { InicioPeopleCarouselSection } from '@/features/inicio/sections/inicio-people-carousel-section';
import { InicioTopBarSection } from '@/features/inicio/sections/inicio-top-bar-section';

export default function InicioPage() {
  const controller = useInicioController();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ContentShell style={styles.content}>
        <InicioTopBarSection controller={controller} />
        <InicioPeopleCarouselSection controller={controller} />
        <InicioMapSection controller={controller} />
      </ContentShell>
      <BottomBar active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  content: {
    flex: 1,
    paddingTop: 4,
  },
});
