import type { ExercisesRepository } from '@/services/exercises/exercises.repository';
import type { Exercise } from '@/services/exercises/exercises.types';

const catalog: Exercise[] = [
  {
    id: 'breath-478',
    title: 'Respiração 4-7-8',
    subtitle: 'Acalma o sistema nervoso em 1 minuto',
    kind: 'breathing',
    durationSec: 60,
  },
  {
    id: 'ground-54321',
    title: 'Aterramento 5-4-3-2-1',
    subtitle: 'Volte ao presente com os sentidos',
    kind: 'grounding',
    durationSec: 120,
  },
  {
    id: 'grat-3',
    title: '3 Gratidões',
    subtitle: 'Encontre um sopro de leveza agora',
    kind: 'gratitude',
    durationSec: 90,
  },
];

export const exercisesMockRepository: ExercisesRepository = {
  async list() {
    return catalog;
  },
};
