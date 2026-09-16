import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { BrandMap } from '@/components/brand-map';
import { Radius, type BrandColors } from '@/constants/brand';
import type { PessoaDetalheController } from '@/features/pessoa-detalhe/pessoa-detalhe.controller';
import { useBrand } from '@/lib/brand-theme';

interface PessoaDetalheSightingSectionProps {
  controller: PessoaDetalheController;
}

export function PessoaDetalheSightingSection({ controller }: PessoaDetalheSightingSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.wrap}>
      {controller.sightingBlockedMessage ? (
        <Text style={styles.message}>{controller.sightingBlockedMessage}</Text>
      ) : (
        <BrandButton
          label="Vi essa pessoa por perto"
          variant="orange"
          onPress={controller.openSightingForm}
        />
      )}

      {controller.formMessage ? <Text style={styles.message}>{controller.formMessage}</Text> : null}

      {controller.formOpen ? (
        <View style={styles.form}>
          <View>
            <BrandField
              label="Onde você viu?"
              value={controller.address}
              onChangeText={controller.setAddress}
              placeholder="Digite para buscar o endereço"
              autoCapitalize="words"
              autoComplete="off"
              trailingIcon="map-marker-outline"
              error={controller.addressError}
            />
            {controller.suggesting ? (
              <Text style={styles.hint}>Buscando endereços…</Text>
            ) : null}
            {controller.suggestions.length > 0 ? (
              <View style={styles.suggestions}>
                {controller.suggestions.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.suggestion}
                    onPress={() => controller.pickSuggestion(item)}
                  >
                    <Text style={styles.suggestionLabel}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
          <View style={styles.mapFrame}>
            <BrandMap
              pins={controller.sightingPins}
              userLocation={controller.userLocation}
              rounded
              style={styles.map}
              onMapPress={controller.placeSightingOnMap}
              onPinDragEnd={controller.handlePinDragEnd}
            />
          </View>
          <Text style={styles.hint}>Toque no mapa ou arraste o pin para indicar o local.</Text>
          <BrandButton
            label="Usar minha localização"
            variant="outline"
            loading={controller.locating}
            onPress={controller.useCurrentLocation}
          />
          <BrandButton
            label="Registrar avistamento"
            variant="blue"
            loading={controller.submitting}
            onPress={controller.submitSighting}
          />
        </View>
      ) : null}
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrap: {
      gap: 12,
    },
    form: {
      gap: 12,
    },
    message: {
      fontSize: 14,
      fontWeight: '600',
      color: brand.textMuted,
    },
    hint: {
      marginTop: 8,
      fontSize: 13,
      color: brand.textMuted,
    },
    mapFrame: {
      height: 240,
      width: '100%',
      overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
    },
    map: {
      height: 240,
      width: '100%',
      flexGrow: 0,
      flexShrink: 0,
    },
    suggestions: {
      marginTop: 8,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      borderRadius: Radius.md,
      backgroundColor: brand.surface,
      overflow: 'hidden',
    },
    suggestion: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: brand.divider,
    },
    suggestionLabel: {
      fontSize: 14,
      color: brand.textDark,
    },
  });
}
