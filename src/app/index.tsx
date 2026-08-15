import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { SurahCard } from '@/components/SurahCard';
import { Colors, Spacing } from '@/constants/theme';
import { useRecitations } from '@/context/RecitationContext';
import { surahs } from '@/data/surahs';

export default function HomeScreen() {
  const { counts, loaded, increment, resetSurah } = useRecitations();

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.headerStart} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header />
      <FlatList
        data={surahs}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <SurahCard
            surah={item}
            count={counts[item.number] ?? 0}
            onIncrement={increment}
            onReset={resetSurah}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
});
