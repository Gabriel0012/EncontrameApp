import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { type BrandMapHandle } from '@/components/brand-map';
import { MapMyLocationFab } from '@/components/map-my-location-fab';
import { SofiaFab } from '@/components/sofia-fab';
import { Radius, type BrandColors } from '@/constants/brand';
import { InicioSidebarWidth, PageGutter } from '@/constants/theme';
import { useInicioController } from '@/features/inicio/inicio.controller';
import { InicioMapSection } from '@/features/inicio/sections/inicio-map-section';
import { InicioOnboardingSection } from '@/features/inicio/sections/inicio-onboarding-section';
import { InicioPeopleCarouselSection } from '@/features/inicio/sections/inicio-people-carousel-section';
import { InicioPeopleSidebarSection } from '@/features/inicio/sections/inicio-people-sidebar-section';
import { InicioTopBarSection } from '@/features/inicio/sections/inicio-top-bar-section';
import { useBrand } from '@/lib/brand-theme';
import { useBottomSafeInset } from '@/lib/use-bottom-safe-inset';
import { useWideLayout } from '@/lib/use-wide-layout';

export default function InicioPage() {
  const brand = useBrand();
  const { isWide } = useWideLayout();
  const styles = useMemo(() => makeStyles(brand, isWide), [brand, isWide]);
  const controller = useInicioController();
  const mapRef = useRef<BrandMapHandle>(null);
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomSafeInset();
  const [topOverlay, setTopOverlay] = useState(280);
  const bottomBar = isWide ? 0 : bottomInset + 66;
  const fabBottom = isWide ? bottomInset + 8 : bottomInset + 72;
  const sidebarGap = 12;
  const mapPadding = useMemo(
    () =>
      isWide
        ? {
            top: insets.top + 12,
            right: PageGutter,
            bottom: 16,
            left: sidebarGap + InicioSidebarWidth + 12,
          }
        : {
            top: insets.top + topOverlay,
            right: PageGutter,
            bottom: bottomBar,
            left: PageGutter,
          },
    [bottomBar, insets.top, isWide, topOverlay],
  );

  return (
    <View style={styles.container}>
      <InicioMapSection ref={mapRef} controller={controller} mapPadding={mapPadding} />
      <View style={styles.overlay} pointerEvents="box-none">
        {controller.searchOpen ? (
          <Pressable
            style={styles.searchDismiss}
            onPress={controller.closeSearch}
            accessibilityRole="button"
            accessibilityLabel="Fechar busca"
          />
        ) : null}
        <SafeAreaView style={styles.overlayInner} edges={['top']} pointerEvents="box-none">
          {isWide ? (
            <View style={styles.sidebar} pointerEvents="auto">
              <InicioTopBarSection controller={controller} />
              <InicioPeopleSidebarSection controller={controller} />
            </View>
          ) : (
            <View
              pointerEvents="box-none"
              style={styles.topOverlay}
              onLayout={(event) => {
                if (controller.menuOpen) {
                  return;
                }
                const height = event.nativeEvent.layout.height;
                setTopOverlay((current) => (Math.abs(current - height) < 8 ? current : height));
              }}
            >
              <InicioTopBarSection controller={controller} />
              <View pointerEvents={controller.searchOpen ? 'none' : 'box-none'}>
                <InicioPeopleCarouselSection controller={controller} />
              </View>
            </View>
          )}
          <View style={styles.overlayFill} pointerEvents="none" />
        </SafeAreaView>
      </View>
      <BottomBar active="home" />
      <SofiaFab onPress={controller.goToChat} />
      <MapMyLocationFab
        onPress={() => mapRef.current?.recenterOnUser()}
        disabled={!controller.userLocation}
        style={{ bottom: fabBottom, right: 24, zIndex: 30, elevation: 12 }}
      />
      <InicioOnboardingSection controller={controller} />
    </View>
  );
}

function makeStyles(brand: BrandColors, isWide: boolean) {
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
      flexDirection: isWide ? 'row' : 'column',
    },
    sidebar: {
      width: InicioSidebarWidth,
      marginTop: 8,
      marginLeft: 12,
      marginBottom: 12,
      borderRadius: Radius.lg,
      backgroundColor: brand.surface,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      overflow: 'hidden',
      shadowColor: brand.navyDeep,
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    topOverlay: {
      flexGrow: 0,
      flexShrink: 0,
    },
    overlayFill: {
      flex: 1,
    },
    searchDismiss: {
      ...StyleSheet.absoluteFill,
    },
  });
}
