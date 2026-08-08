import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandMap } from '@/components/brand-map';
import { Brand, Radius } from '@/constants/brand';
import type { PessoasProximasController } from '@/features/pessoas-proximas/pessoas-proximas.controller';

interface PessoasProximasMapSectionProps {
  controller: PessoasProximasController;
}

export function PessoasProximasMapSection({ controller }: PessoasProximasMapSectionProps) {
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
            placeholderTextColor={Brand.placeholder}
            returnKeyType="search"
            onSubmitEditing={controller.handleSearch}
          />
          <MaterialCommunityIcons name="map-marker-outline" size={20} color={Brand.placeholder} />
        </View>
        <Pressable style={styles.searchButton} onPress={controller.handleSearch}>
          <Text style={styles.searchButtonLabel}>Buscar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.fieldBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Brand.textDark,
  },
  searchButton: {
    height: 46,
    paddingHorizontal: 22,
    borderRadius: Radius.pill,
    backgroundColor: Brand.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonLabel: {
    color: Brand.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
