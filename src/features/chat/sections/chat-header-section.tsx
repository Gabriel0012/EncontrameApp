import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';

export function ChatHeaderSection() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
        <MaterialCommunityIcons name="chevron-left" size={30} color={Brand.textDark} />
      </Pressable>
      <View style={styles.avatar}>
        <MaterialCommunityIcons name="account" size={28} color={Brand.avatarIcon} />
      </View>
      <Text style={styles.name}>Sofia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Brand.divider,
  },
  back: {
    marginLeft: -6,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Brand.avatarBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textDark,
  },
});
