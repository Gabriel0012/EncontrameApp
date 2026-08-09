import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandMap } from '@/components/brand-map';
import { Radius, type BrandColors } from '@/constants/brand';
import type { PessoasProximasController } from '@/features/pessoas-proximas/pessoas-proximas.controller';
import { useBrand } from '@/lib/brand-theme';

interface PessoasProximasMapSectionProps {
  controller: PessoasProximasController;
}

export function PessoasProximasMapSection({ controller }: PessoasProximasMapSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.wrapper}>
      <BrandMap pins={controller.pins} rounded />

      <View style={styles.searchOverlay}>
        <View style={styles.searchField}>
          <TextInput
            style={styles.searchInput}
            value={controller.search}
            onChangeText={controller.setSearch}
            placeholder="Endereço ou localização"
            placeholderTextColor={brand.placeholder}
            returnKeyType="search"
            onSubmitEditing={controller.handleSearch}
          />
          <MaterialCommunityIcons name="map-marker-outline" size={20} color={brand.placeholder} />
        </View>
        <Pressable style={styles.searchButton} onPress={controller.handleSearch}>
          <Text style={styles.searchButtonLabel}>Buscar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    searchOverlay: {
      position: 'absolute',
      top: 14,
      left: 14,
      right: 14,
      flexDirection: 'row',
      gap: 10,
    },
    searchField: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      height: 46,
      paddingHorizontal: 16,
      borderRadius: Radius.pill,
      backgroundColor: brand.surface,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: brand.textDark,
    },
    searchButton: {
      height: 46,
      paddingHorizontal: 22,
      borderRadius: Radius.pill,
      backgroundColor: brand.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchButtonLabel: {
      color: brand.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
