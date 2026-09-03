import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useBrand } from '@/lib/brand-theme';

export function ExerciseGroundingSection() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.box}>
      <Text style={styles.text}>
        Encontre com calma:{'\n'}
        5 coisas que você vê{'\n'}
        4 que pode tocar{'\n'}
        3 que ouve{'\n'}
        2 que sente cheiro{'\n'}1 que pode saborear
      </Text>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    box: {
      marginTop: 32,
      padding: PageGutter,
      borderRadius: Radius.lg,
      backgroundColor: brand.fieldBackground,
      borderWidth: 1,
      borderColor: brand.divider,
      width: '100%',
    },
    text: {
      fontSize: 16,
      lineHeight: 28,
      textAlign: 'center',
      color: brand.textDark,
    },
  });
}
