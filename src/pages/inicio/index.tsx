import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { ContentShell } from '@/components/content-shell';
import { RegisterFab } from '@/components/register-fab';
import { type BrandColors } from '@/constants/brand';
import { useInicioController } from '@/features/inicio/inicio.controller';
import { InicioMapSection } from '@/features/inicio/sections/inicio-map-section';
import { InicioPeopleCarouselSection } from '@/features/inicio/sections/inicio-people-carousel-section';
import { InicioTopBarSection } from '@/features/inicio/sections/inicio-top-bar-section';
import { useBrand } from '@/lib/brand-theme';

export default function InicioPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useInicioController();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ContentShell style={styles.content}>
        <InicioTopBarSection controller={controller} />
        <InicioPeopleCarouselSection controller={controller} />
        <InicioMapSection controller={controller} />
      </ContentShell>
      <BottomBar active="home" />
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
    content: {
      flex: 1,
      paddingTop: 4,
    },
  });
}
