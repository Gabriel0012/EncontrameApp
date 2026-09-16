import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMap } from '@/components/brand-map';
import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { PessoaDetalheController } from '@/features/pessoa-detalhe/pessoa-detalhe.controller';
import { useBrand } from '@/lib/brand-theme';
import { useWideLayout } from '@/lib/use-wide-layout';

interface PessoaDetalheHistorySectionProps {
  controller: PessoaDetalheController;
}

export function PessoaDetalheHistorySection({ controller }: PessoaDetalheHistorySectionProps) {
  const brand = useBrand();
  const { isWide } = useWideLayout();
  const styles = useMemo(() => makeStyles(brand, isWide), [brand, isWide]);
  const hasPins = controller.historyPins.length > 0;
  const showError = !controller.historyLoading && Boolean(controller.historyError);
  const showEmpty = !controller.historyLoading && !showError && !hasPins;

  return (
    <Modal
      visible={controller.historyOpen}
      transparent={isWide}
      animationType={isWide ? 'fade' : 'slide'}
      presentationStyle={isWide ? 'overFullScreen' : 'fullScreen'}
      onRequestClose={controller.closeHistory}
    >
      <View style={styles.shell}>
        {isWide ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={controller.closeHistory}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          />
        ) : null}
        <SafeAreaView style={styles.panel} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Text style={styles.title}>Histórico de avistamentos</Text>
            <Pressable
              onPress={controller.closeHistory}
              hitSlop={12}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <MaterialCommunityIcons name="close" size={28} color={brand.textDark} />
            </Pressable>
          </View>

          <View style={styles.body}>
            {controller.historyLoading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={brand.orange} />
              </View>
            ) : showError ? (
              <View style={styles.center}>
                <Text style={styles.empty}>Não foi possível carregar o histórico.</Text>
              </View>
            ) : showEmpty ? (
              <View style={styles.center}>
                <Text style={styles.empty}>Ainda não há avistamentos com localização.</Text>
              </View>
            ) : (
              <BrandMap
                pins={controller.historyPins}
                polylines={controller.historyPolylines}
                rounded
                style={styles.map}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function makeStyles(brand: BrandColors, isWide: boolean) {
  return StyleSheet.create({
    shell: {
      flex: 1,
      backgroundColor: isWide ? brand.overlay : brand.white,
      justifyContent: isWide ? 'center' : 'flex-start',
      alignItems: isWide ? 'center' : 'stretch',
      padding: isWide ? PageGutter : 0,
    },
    panel: {
      flex: isWide ? undefined : 1,
      width: '100%',
      maxWidth: isWide ? 720 : undefined,
      height: isWide ? 560 : undefined,
      backgroundColor: brand.white,
      borderRadius: isWide ? Radius.lg : 0,
      overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
      zIndex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: PageGutter,
      paddingTop: 8,
      paddingBottom: 8,
      gap: 12,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: '800',
      color: brand.textDark,
    },
    closeBtn: {
      padding: 4,
    },
    body: {
      flex: 1,
      paddingHorizontal: PageGutter,
      paddingBottom: PageGutter,
    },
    map: {
      flex: 1,
      minHeight: isWide ? 420 : undefined,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: PageGutter,
    },
    empty: {
      fontSize: 16,
      textAlign: 'center',
      color: brand.textMuted,
    },
  });
}
