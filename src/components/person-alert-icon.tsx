import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useBrand } from '@/lib/brand-theme';
import { isPersonAlertStatus } from '@/lib/person-status';

type PersonAlertIconProps = {
  statusId?: number;
  statusDescription?: string;
  size?: number;
};

/** Ícone do status Alerta. O tooltip com a descrição do alerta entra neste componente. */
export function PersonAlertIcon({
  statusId,
  statusDescription,
  size = 14,
}: PersonAlertIconProps) {
  const brand = useBrand();
  if (!isPersonAlertStatus(statusId, statusDescription)) {
    return null;
  }

  return (
    <MaterialCommunityIcons
      name="alert"
      size={size}
      color={brand.statusAlerta}
      accessibilityLabel="Alerta"
    />
  );
}
