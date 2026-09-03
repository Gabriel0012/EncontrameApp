export type ExerciseKind = 'breathing' | 'grounding' | 'gratitude';

export interface Exercise {
  id: string;
  title: string;
  subtitle: string;
  kind: ExerciseKind;
  durationSec: number;
}
