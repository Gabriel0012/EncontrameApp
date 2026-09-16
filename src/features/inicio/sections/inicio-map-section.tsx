import { StyleSheet, View } from 'react-native';

import { BrandMap, type MapPadding } from '@/components/brand-map';
import type { InicioController } from '@/features/inicio/inicio.controller';

interface InicioMapSectionProps {
  controller: InicioController;
  mapPadding: MapPadding;
}

export function InicioMapSection({ controller, mapPadding }: InicioMapSectionProps) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.wrapper]}>
      <BrandMap
        pins={controller.pins}
        userLocation={controller.userLocation}
        mapPadding={mapPadding}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 0,
  },
  map: {
    flex: 1,
    borderWidth: 0,
  },
});
