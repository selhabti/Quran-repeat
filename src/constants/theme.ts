export const Colors = {
  headerStart: '#00796B',
  headerEnd: '#004D40',
  gold: '#D4AF37',
  background: '#F5F5F5',
  card: '#FFFFFF',
  badgeGreen: '#4DB6AC',
  gray: '#BDBDBD',
  green: '#4CAF50',
  orange: '#FF9800',
  red: '#F44336',
  text: '#212121',
  textSecondary: '#757575',
  white: '#FFFFFF',
  buttonGreen: '#2E7D32',
} as const;

export type ProgressStage = 'start' | 'progress' | 'near' | 'complete';

export function progressStage(count: number, target: number): ProgressStage {
  if (count >= target) return 'complete';
  if (count >= target * 0.7) return 'near';
  if (count >= target * 0.3) return 'progress';
  return 'start';
}

export function progressColor(count: number, target: number): string {
  const stage = progressStage(count, target);
  switch (stage) {
    case 'complete':
      return Colors.gold;
    case 'near':
      return Colors.green;
    case 'progress':
      return Colors.orange;
    default:
      return Colors.red;
  }
}

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export const MaxContentWidth = 800;
