import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRef } from 'react';

import { Colors, progressColor, Spacing } from '@/constants/theme';
import { SURAH_TARGET, Surah } from '@/data/surahs';
import { confirmAction } from '@/utils/confirm';

type SurahCardProps = {
  surah: Surah;
  count: number;
  onIncrement: (surahNumber: number) => void;
  onReset: (surahNumber: number) => void;
};

export function SurahCard({ surah, count, onIncrement, onReset }: SurahCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const completed = count >= SURAH_TARGET;
  const percent = Math.min((count / SURAH_TARGET) * 100, 100);
  const barColor = progressColor(count, SURAH_TARGET);

  const springTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const handleIncrement = () => {
    if (!completed) onIncrement(surah.number);
  };

  const confirmReset = () => {
    confirmAction(
      'Réinitialiser le compteur',
      `Remettre « ${surah.nameAr} » à zéro ?`,
      () => onReset(surah.number),
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Sourate ${surah.number}`}
        onPressIn={() => springTo(0.98)}
        onPressOut={() => springTo(1)}
        style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{surah.number}</Text>
          </View>

          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.nameAr}>{surah.nameAr}</Text>
              {completed && (
                <View style={styles.completeBadge}>
                  <MaterialIcons name="star" size={18} color={Colors.gold} />
                  <MaterialIcons name="check-circle" size={16} color={Colors.green} />
                </View>
              )}
            </View>
            <Text style={styles.nameLatin}>
              {surah.nameLatin} · {surah.meaning}
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: barColor }]} />
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.counter, { color: barColor }]}>
            {count} / {SURAH_TARGET}
          </Text>

          <View style={styles.actions}>
            <Pressable
              onPress={confirmReset}
              hitSlop={6}
              style={({ pressed }) => [styles.resetLink, pressed && styles.pressed]}>
              <MaterialIcons name="restart-alt" size={16} color={Colors.textSecondary} />
              <Text style={styles.resetText}>Réinitialiser</Text>
            </Pressable>

            <Pressable
              accessibilityLabel="Ajouter une récitation"
              disabled={completed}
              onPress={handleIncrement}
              onPressIn={() => springTo(0.94)}
              onPressOut={() => springTo(1)}
              style={({ pressed }) => [
                styles.incrementButton,
                completed && styles.incrementButtonComplete,
                pressed && !completed && styles.pressed,
              ]}>
              {completed ? (
                <>
                  <MaterialIcons name="check-circle" size={18} color={Colors.white} />
                  <Text style={styles.incrementText}>مكتملة</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="add" size={22} color={Colors.white} />
                  <Text style={styles.incrementText}>تلاوة</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.badgeGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Amiri_700Bold',
  },
  nameBlock: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameAr: {
    fontSize: 22,
    fontFamily: 'Amiri_700Bold',
    color: Colors.text,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  nameLatin: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Amiri_400Regular',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  counter: {
    fontSize: 16,
    fontFamily: 'Amiri_700Bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  resetText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  incrementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.buttonGreen,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  incrementButtonComplete: {
    backgroundColor: Colors.gray,
  },
  incrementText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Amiri_700Bold',
  },
  pressed: {
    opacity: 0.7,
  },
});
