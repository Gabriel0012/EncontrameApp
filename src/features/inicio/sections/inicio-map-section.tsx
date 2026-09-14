import { StyleSheet, View } from 'react-native';

import { BrandMap } from '@/components/brand-map';
import type { InicioController } from '@/features/inicio/inicio.controller';

interface InicioMapSectionProps {
  controller: InicioController;
}

export function InicioMapSection({ controller }: InicioMapSectionProps) {
  return (
    <View style={styles.wrapper}>
      <BrandMap
        pins={controller.pins}
        userLocation={controller.userLocation}
        onPress={controller.goToNearby}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
  },
});
