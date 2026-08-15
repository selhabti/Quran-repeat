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

const COUNTS_KEY = '@quran-repeat/counts:v1';
const PROFILE_KEY = '@quran-repeat/profile:v1';

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
  name: string;
  setName: (name: string) => void;
};

const RecitationContext = createContext<RecitationContextValue | null>(null);

export function RecitationProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<Counts>({});
  const [name, setNameState] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [rawCounts, rawProfile] = await Promise.all([
          AsyncStorage.getItem(COUNTS_KEY),
          AsyncStorage.getItem(PROFILE_KEY),
        ]);
        if (active && rawCounts) {
          setCounts(JSON.parse(rawCounts) as Counts);
        }
        if (active && rawProfile) {
          const profile = JSON.parse(rawProfile) as { name?: string };
          if (profile?.name) setNameState(profile.name);
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

  const setName = useCallback((value: string) => {
    setNameState(value);
    AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ name: value })).catch((error) => {
      console.warn('Impossible de sauvegarder le prénom', error);
    });
  }, []);

  const persist = useCallback((next: Counts) => {
    AsyncStorage.setItem(COUNTS_KEY, JSON.stringify(next)).catch((error) => {
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
      name,
      setName,
    }),
    [counts, loaded, stats, increment, resetSurah, resetAll, name, setName],
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
