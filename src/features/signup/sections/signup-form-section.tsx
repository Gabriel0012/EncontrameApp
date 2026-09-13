import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { FormRow } from '@/components/form-row';
import { type BrandColors } from '@/constants/brand';
import { BiometricEnrollSection } from '@/features/biometric/sections/biometric-enroll-section';
import { SignupGoogleControls } from '@/features/signup/sections/signup-google-controls';
import type { SignupController } from '@/features/signup/signup.controller';
import { useBrand } from '@/lib/brand-theme';

interface SignupFormSectionProps {
  controller: SignupController;
}

export function SignupFormSection({ controller }: SignupFormSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.form}>
      {controller.fromGoogle ? null : (
        <SignupGoogleControls
          onNeedsRegistration={controller.applyGoogleDraft}
          disabled={controller.submitting}
        />
      )}
      <FormRow>
        <BrandField
          label="Nome"
          value={controller.name}
          onChangeText={controller.setName}
          placeholder="Fulano Beltrano da Silva"
          autoCapitalize="words"
          required
          error={controller.fieldError('name')}
          onBlur={controller.blurName}
        />
        <BrandField
          label="CPF"
          value={controller.cpf}
          onChangeText={controller.setCpf}
          placeholder="000.000.000-00"
          keyboardType="numeric"
          required
          error={controller.fieldError('cpf')}
          onBlur={controller.blurCpf}
        />
      </FormRow>
      <FormRow>
        <BrandField
          label="E-mail"
          value={controller.email}
          onChangeText={controller.setEmail}
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          required
          editable={!controller.fromGoogle}
          error={controller.fieldError('email')}
          onBlur={controller.blurEmail}
        />
        <BrandField
          label="Telefone"
          value={controller.phone}
          onChangeText={controller.setPhone}
          placeholder="( 31 ) 9 9999-9999"
          keyboardType="phone-pad"
          required
          error={controller.fieldError('phone')}
          onBlur={controller.blurPhone}
        />
      </FormRow>
      <FormRow>
        <BrandField
          label="CEP"
          value={controller.cep}
          onChangeText={controller.setCep}
          placeholder="30550-830"
          keyboardType="numeric"
          trailingIcon="magnify"
          onTrailingPress={controller.handleCepSearch}
          error={controller.fieldError('cep')}
          onBlur={controller.blurCep}
        />
        <BrandField
          label="Claúsula"
          value={controller.clause}
          onChangeText={controller.setClause}
          placeholder="Exemplo..."
        />
      </FormRow>

      {controller.formError ? <Text style={styles.formError}>{controller.formError}</Text> : null}

      <BrandButton
        label={controller.fromGoogle ? 'Criar conta' : 'Próximo'}
        variant="outline"
        trailingIcon={controller.fromGoogle ? undefined : 'chevron-double-right'}
        loading={controller.submitting}
        onPress={controller.handleNext}
        style={styles.submit}
      />
      <BiometricEnrollSection controller={controller.enroll} />
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    form: {
      marginTop: 20,
      gap: 18,
    },
    formError: {
      fontSize: 13,
      fontWeight: '600',
      color: brand.error,
    },
    submit: {
      marginTop: 12,
    },
  });
}
