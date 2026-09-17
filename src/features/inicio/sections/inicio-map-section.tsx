import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandMap, type BrandMapHandle, type MapPadding } from '@/components/brand-map';
import type { InicioController } from '@/features/inicio/inicio.controller';

interface InicioMapSectionProps {
  controller: InicioController;
  mapPadding: MapPadding;
}

export const InicioMapSection = forwardRef<BrandMapHandle, InicioMapSectionProps>(
  function InicioMapSection({ controller, mapPadding }, ref) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.wrapper]}>
        <BrandMap
          ref={ref}
          pins={controller.pins}
          userLocation={controller.userLocation}
          mapPadding={mapPadding}
          showLocationFab={false}
          style={styles.map}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 0,
  },
  map: {
    flex: 1,
    borderWidth: 0,
  },
});
