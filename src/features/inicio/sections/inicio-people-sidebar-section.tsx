import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { InicioController } from '@/features/inicio/inicio.controller';
import { useBrand } from '@/lib/brand-theme';
import { resolvePersonStatusColor, resolvePersonStatusOnColor } from '@/lib/person-status';
import type { Person } from '@/services/people/people.types';

interface InicioPeopleSidebarSectionProps {
  controller: InicioController;
}

/** Lista lateral da home no desktop, no formato do painel do Maps. */
export function InicioPeopleSidebarSection({ controller }: InicioPeopleSidebarSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const { people, showPeopleSkeleton } = controller;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.title}>Pessoas próximas</Text>
        <Pressable onPress={controller.goToAllPeople} accessibilityRole="button">
          <Text style={styles.allLink}>Ver todas</Text>
        </Pressable>
      </View>

      {showPeopleSkeleton ? (
        <View style={styles.center}>
          <ActivityIndicator color={brand.blue} />
        </View>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SidebarPersonCard person={item} controller={controller} brand={brand} styles={styles} />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma pessoa próxima.</Text>
          }
        />
      )}
    </View>
  );
}

function SidebarPersonCard({
  person,
  controller,
  brand,
  styles,
}: {
  person: Person;
  controller: InicioController;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const statusLabel = person.statusDescription ?? '—';
  const badgeColor = resolvePersonStatusColor(brand, person.statusId, person.statusDescription);
  const badgeTextColor = resolvePersonStatusOnColor(brand);
  const location = controller.locationLine(person);

  return (
    <Pressable
      style={styles.card}
      onPress={() => controller.goToPerson(person.id)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${person.fullName}`}
    >
      <View style={styles.photo}>
        {person.photoUri ? (
          <Image source={{ uri: person.photoUri }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons name="account" size={28} color={brand.avatarIcon} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {person.fullName}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          Idade: {person.age ?? '—'}
          {location ? ` · ${location}` : ''}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
            <Text style={[styles.statusBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    panel: {
      flex: 1,
      minHeight: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: PageGutter,
      paddingTop: 4,
      paddingBottom: 8,
    },
    title: {
      fontSize: 15,
      fontWeight: '800',
      color: brand.textDark,
    },
    allLink: {
      fontSize: 13,
      fontWeight: '700',
      color: brand.blue,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 12,
      paddingBottom: 16,
      gap: 8,
    },
    card: {
      flexDirection: 'row',
      minHeight: 72,
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: brand.cardInfo,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: brand.divider,
    },
    photo: {
      width: 72,
      alignSelf: 'stretch',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.avatarBackground,
    },
    photoImage: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    info: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 10,
      paddingVertical: 8,
      gap: 2,
      justifyContent: 'center',
    },
    name: {
      color: brand.textDark,
      fontSize: 14,
      fontWeight: '800',
    },
    meta: {
      color: brand.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    statusRow: {
      flexDirection: 'row',
      marginTop: 2,
    },
    statusBadge: {
      borderRadius: Radius.pill,
      paddingHorizontal: 7,
      paddingVertical: 2,
      maxWidth: '100%',
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: '700',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      marginTop: 24,
      textAlign: 'center',
      color: brand.textMuted,
      fontWeight: '600',
      fontSize: 13,
    },
  });
}
