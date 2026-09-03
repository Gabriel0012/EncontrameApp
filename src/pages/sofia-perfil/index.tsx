import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { SofiaPerfilHeroSection } from '@/features/sofia-perfil/sections/sofia-perfil-hero-section';
import { useSofiaPerfilController } from '@/features/sofia-perfil/sofia-perfil.controller';
import { useBrand } from '@/lib/brand-theme';

export default function SofiaPerfilPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useSofiaPerfilController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ContentShell style={styles.shell} noGutter>
        <View style={styles.header}>
          <ScreenHeader title="Sofia" onBack={controller.goBackToChat} />
        </View>
        <SofiaPerfilHeroSection controller={controller} />
      </ContentShell>
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
      paddingHorizontal: PageGutter,
    },
  });
}
