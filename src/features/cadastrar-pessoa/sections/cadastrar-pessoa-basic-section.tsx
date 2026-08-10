import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandField } from '@/components/brand-field';
import { BrandSelect } from '@/components/brand-select';
import { FormRow } from '@/components/form-row';
import { Radius, type BrandColors } from '@/constants/brand';
import {
  BUILD_OPTIONS,
  type CadastrarPessoaController,
  ETHNICITY_OPTIONS,
} from '@/features/cadastrar-pessoa/cadastrar-pessoa.controller';
import { useBrand } from '@/lib/brand-theme';

interface CadastrarPessoaBasicSectionProps {
  controller: CadastrarPessoaController;
}

export function CadastrarPessoaBasicSection({ controller }: CadastrarPessoaBasicSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.form}>
      <View style={styles.photoWrapper}>
        <Text style={styles.photoLabel}>Foto</Text>
        {controller.photoUri ? (
          <View style={styles.photoPreviewCard}>
            <Image
              source={{ uri: controller.photoUri }}
              style={styles.photoImage}
              resizeMode="cover"
            />
            <Pressable
              style={styles.removeBadge}
              onPress={controller.handleRemovePhoto}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Remover foto"
            >
              <MaterialCommunityIcons name="close" size={14} color={brand.onPrimary} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.photoBox} onPress={controller.handlePickPhoto}>
            <MaterialCommunityIcons name="camera" size={30} color={brand.placeholder} />
          </Pressable>
        )}
      </View>

      <FormRow>
        <BrandField
          label="Nome Completo"
          value={controller.fullName}
          onChangeText={controller.setFullName}
          placeholder="Fulano Beltrano da Silva"
          autoCapitalize="words"
        />
        <BrandField
          label="Apelido"
          value={controller.nickname}
          onChangeText={controller.setNickname}
          placeholder="Fulano"
          autoCapitalize="words"
        />
      </FormRow>

      <FormRow>
        <BrandField
          label="Idade"
          value={controller.age}
          onChangeText={controller.setAge}
          placeholder="36"
          keyboardType="number-pad"
        />
        <BrandSelect
          label="Porte físico"
          value={controller.build}
          options={BUILD_OPTIONS}
          onSelect={controller.setBuild}
        />
      </FormRow>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <BrandField
            label="Altura"
            value={controller.heightCm}
            onChangeText={controller.setHeightCm}
            placeholder="180 cm"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.rowItem}>
          <BrandSelect
            label="Cor/Etnia"
            value={controller.ethnicity}
            options={ETHNICITY_OPTIONS}
            onSelect={controller.setEthnicity}
          />
        </View>
      </View>

      <BrandField
        label="Roupas"
        value={controller.clothes}
        onChangeText={controller.setClothes}
        placeholder="Camisa branca, calça jeans, etc..."
      />
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    form: {
      gap: 18,
    },
    photoWrapper: {
      gap: 8,
    },
    photoLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: brand.label,
    },
    photoBox: {
      height: 64,
      borderRadius: Radius.md,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: brand.fieldBorder,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: brand.fieldBackground,
    },
    photoPreviewCard: {
      width: 96,
      height: 96,
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: brand.avatarBackground,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    removeBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 22,
      height: 22,
      borderRadius: Radius.pill,
      backgroundColor: brand.pin,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      gap: 14,
    },
    rowItem: {
      flex: 1,
    },
  });
}
