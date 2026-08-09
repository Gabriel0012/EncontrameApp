import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandField } from '@/components/brand-field';
import { BrandSelect } from '@/components/brand-select';
import { FormRow } from '@/components/form-row';
import { Brand, Radius } from '@/constants/brand';
import {
  BUILD_OPTIONS,
  type CadastrarPessoaController,
  ETHNICITY_OPTIONS,
} from '@/features/cadastrar-pessoa/cadastrar-pessoa.controller';

interface CadastrarPessoaBasicSectionProps {
  controller: CadastrarPessoaController;
}

export function CadastrarPessoaBasicSection({ controller }: CadastrarPessoaBasicSectionProps) {
  return (
    <View style={styles.form}>
      <View style={styles.photoWrapper}>
        <Text style={styles.photoLabel}>Foto</Text>
        <Pressable style={styles.photoBox} onPress={controller.handlePickPhoto}>
          {controller.photoUri ? (
            <Image source={{ uri: controller.photoUri }} style={styles.photoImage} />
          ) : (
            <MaterialCommunityIcons name="camera" size={30} color={Brand.placeholder} />
          )}
        </Pressable>
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

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
  photoWrapper: {
    gap: 8,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.label,
  },
  photoBox: {
    height: 64,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Brand.fieldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  rowItem: {
    flex: 1,
  },
});
