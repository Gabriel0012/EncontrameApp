import { StyleSheet, Text, View } from 'react-native';

import { GoogleAuthButton } from '@/components/google-auth-button';
import { useGoogleAuth } from '@/features/google-auth/use-google-auth';
import { useBrand } from '@/lib/brand-theme';

interface SignupGoogleControlsProps {
  onNeedsRegistration: () => void;
  disabled?: boolean;
}

/**
 * Isolado para só montar o OAuth Google quando o botão está visível.
 * Evita um segundo prompt ao chegar no cadastro já pré-preenchido.
 */
export function SignupGoogleControls({
  onNeedsRegistration,
  disabled = false,
}: SignupGoogleControlsProps) {
  const brand = useBrand();
  const google = useGoogleAuth({ onNeedsRegistration });

  if (!google.available) return null;

  return (
    <>
      {google.error ? <Text style={[styles.error, { color: brand.error }]}>{google.error}</Text> : null}
      <GoogleAuthButton
        onPress={google.promptGoogle}
        loading={google.submitting}
        disabled={!google.ready || disabled}
      />
      <View style={styles.orWrap}>
        <View style={[styles.orLine, { backgroundColor: brand.fieldBorder }]} />
        <Text style={[styles.orLabel, { color: brand.placeholder }]}>ou preencha os dados</Text>
        <View style={[styles.orLine, { backgroundColor: brand.fieldBorder }]} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: 13,
    fontWeight: '600',
  },
  orWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
