import { api } from '@/lib/axios';
import type { ExercisesRepository } from '@/services/exercises/exercises.repository';
import type { Exercise } from '@/services/exercises/exercises.types';

export const exercisesAxiosRepository: ExercisesRepository = {
  async list() {
    const { data } = await api.get<Exercise[]>('/IAChat/exercises');
    return data;
  },
};
