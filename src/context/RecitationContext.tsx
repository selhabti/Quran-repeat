import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { SURAH_TARGET, surahs } from '@/data/surahs';

const STORAGE_KEY = '@quran-repeat/counts:v1';

export type Counts = Record<number, number>;

type RecitationContextValue = {
  counts: Counts;
  loaded: boolean;
  totalRecitations: number;
  completedSurahs: number;
  globalPercentage: number;
  increment: (surahNumber: number) => void;
  resetSurah: (surahNumber: number) => void;
  resetAll: () => void;
};

const RecitationContext = createContext<RecitationContextValue | null>(null);

export function RecitationProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<Counts>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && active) {
          const parsed = JSON.parse(raw) as Counts;
          setCounts(parsed);
        }
      } catch (error) {
        console.warn('Impossible de charger les données', error);
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((next: Counts) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((error) => {
      console.warn('Impossible de sauvegarder les données', error);
    });
  }, []);

  const increment = useCallback(
    (surahNumber: number) => {
      setCounts((prev) => {
        const next = {
          ...prev,
          [surahNumber]: Math.min((prev[surahNumber] ?? 0) + 1, SURAH_TARGET),
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const resetSurah = useCallback(
    (surahNumber: number) => {
      setCounts((prev) => {
        const next = { ...prev, [surahNumber]: 0 };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    const next: Counts = {};
    setCounts(next);
    persist(next);
  }, [persist]);

  const stats = useMemo(() => {
    const values = Object.values(counts);
    const totalRecitations = values.reduce((sum, value) => sum + value, 0);
    const completedSurahs = values.filter((value) => value >= SURAH_TARGET).length;
    const globalPercentage = totalRecitations / (surahs.length * SURAH_TARGET);
    return {
      totalRecitations,
      completedSurahs,
      globalPercentage: Math.round(globalPercentage * 100),
    };
  }, [counts]);

  const value = useMemo<RecitationContextValue>(
    () => ({
      counts,
      loaded,
      totalRecitations: stats.totalRecitations,
      completedSurahs: stats.completedSurahs,
      globalPercentage: stats.globalPercentage,
      increment,
      resetSurah,
      resetAll,
    }),
    [counts, loaded, stats, increment, resetSurah, resetAll],
  );

  return <RecitationContext.Provider value={value}>{children}</RecitationContext.Provider>;
}

export function useRecitations(): RecitationContextValue {
  const context = useContext(RecitationContext);
  if (!context) {
    throw new Error('useRecitations doit être utilisé dans un RecitationProvider');
  }
  return context;
}
