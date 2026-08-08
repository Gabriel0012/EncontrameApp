import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';

type Props = {
  title: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, onBack }: Props) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={styles.header}>
      <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
        <MaterialCommunityIcons name="chevron-left" size={30} color={Brand.textDark} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  backButton: {
    marginLeft: -6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.textDark,
  },
});
