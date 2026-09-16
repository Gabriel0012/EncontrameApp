import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { SofiaFab } from '@/components/sofia-fab';
import { type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useInicioController } from '@/features/inicio/inicio.controller';
import { InicioMapSection } from '@/features/inicio/sections/inicio-map-section';
import { InicioPeopleCarouselSection } from '@/features/inicio/sections/inicio-people-carousel-section';
import { InicioTopBarSection } from '@/features/inicio/sections/inicio-top-bar-section';
import { useBrand } from '@/lib/brand-theme';
import { useWideLayout } from '@/lib/use-wide-layout';

export default function InicioPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useInicioController();
  const insets = useSafeAreaInsets();
  const { isWide } = useWideLayout();
  const [topOverlay, setTopOverlay] = useState(280);
  const bottomBar = isWide ? 0 : Math.max(insets.bottom, 10) + 66;
  const mapPadding = useMemo(
    () => ({
      top: insets.top + topOverlay,
      right: PageGutter,
      bottom: bottomBar,
      left: PageGutter,
    }),
    [bottomBar, insets.top, topOverlay],
  );

  return (
    <View style={styles.container}>
      <InicioMapSection controller={controller} mapPadding={mapPadding} />
      <View style={styles.overlay} pointerEvents="box-none">
        <SafeAreaView style={styles.overlayInner} edges={['top']} pointerEvents="box-none">
          <View
            pointerEvents="box-none"
            onLayout={(event) => setTopOverlay(event.nativeEvent.layout.height)}
          >
            <InicioTopBarSection controller={controller} />
            <InicioPeopleCarouselSection controller={controller} />
          </View>
          <View style={styles.overlayFill} pointerEvents="none" />
        </SafeAreaView>
      </View>
      <BottomBar active="home" />
      <SofiaFab onPress={controller.goToChat} />
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: brand.mapBackground,
    },
    overlay: {
      flex: 1,
      zIndex: 2,
    },
    overlayInner: {
      flex: 1,
    },
    overlayFill: {
      flex: 1,
    },
  });
}
