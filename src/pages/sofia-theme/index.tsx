import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandButton } from '@/components/brand-button';
import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { SofiaThemePickerSection } from '@/features/sofia-theme/sections/sofia-theme-picker-section';
import { useSofiaThemeController } from '@/features/sofia-theme/sofia-theme.controller';
import { useBrand } from '@/lib/brand-theme';

export default function SofiaThemePage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useSofiaThemeController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ContentShell style={styles.shell} noGutter>
        <View style={styles.header}>
          <ScreenHeader title="Personalizar Sofia" onBack={controller.goBack} />
        </View>
        <SofiaThemePickerSection controller={controller} />
        {controller.fromWelcome ? (
          <View style={styles.footer}>
            <BrandButton
              label="Começar a conversar"
              variant="blue"
              onPress={controller.continueToChat}
            />
          </View>
        ) : null}
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
    footer: {
      paddingHorizontal: PageGutter,
      paddingBottom: 12,
    },
  });
}
