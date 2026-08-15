import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useRecitations } from '@/context/RecitationContext';
import { confirmAction } from '@/utils/confirm';

type StatProps = {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

function Stat({ label, value, icon }: StatProps) {
  return (
    <View style={styles.stat}>
      <MaterialIcons name={icon} size={20} color={Colors.gold} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function Header() {
  const { totalRecitations, completedSurahs, globalPercentage, resetAll } = useRecitations();

  const confirmResetAll = () => {
    confirmAction(
      'Réinitialiser tout',
      'Voulez-vous vraiment remettre tous les compteurs à zéro ?',
      resetAll,
    );
  };

  return (
    <LinearGradient colors={[Colors.headerStart, Colors.headerEnd]} style={styles.gradient}>
      <View style={styles.inner}>
        <View style={styles.titleRow}>
          <MaterialIcons name="menu-book" size={28} color={Colors.white} />
          <Text style={styles.title}>رحلتي مع القرآن</Text>
          <Pressable
            accessibilityLabel="Réinitialiser tous les compteurs"
            onPress={confirmResetAll}
            hitSlop={8}
            style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
            <MaterialIcons name="restart-alt" size={22} color={Colors.white} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <Stat
            icon="repeat"
            label="Total récitations"
            value={totalRecitations.toLocaleString('fr-FR')}
          />
          <View style={styles.divider} />
          <Stat
            icon="check-circle"
            label="Sourates complétées"
            value={String(completedSurahs)}
          />
          <View style={styles.divider} />
          <Stat icon="percent" label="Progression globale" value={`${globalPercentage}%`} />
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${globalPercentage}%` }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: {
    flex: 1,
    color: Colors.white,
    fontSize: 26,
    fontFamily: 'Amiri_700Bold',
    textAlign: 'right',
  },
  resetButton: {
    padding: Spacing.two,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.half,
  },
  statValue: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: 'Amiri_700Bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
});
