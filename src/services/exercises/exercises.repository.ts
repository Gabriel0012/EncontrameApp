import { env } from '@/lib/env';
import { exercisesAxiosRepository } from '@/services/exercises/exercises.axios.repository';
import { exercisesMockRepository } from '@/services/exercises/exercises.mock.repository';
import type { Exercise } from '@/services/exercises/exercises.types';

export interface ExercisesRepository {
  list(): Promise<Exercise[]>;
}

export function getExercisesRepository(): ExercisesRepository {
  return env.useMocks ? exercisesMockRepository : exercisesAxiosRepository;
}
