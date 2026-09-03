import { useQuery } from '@tanstack/react-query';

import { getExercisesRepository } from '@/services/exercises/exercises.repository';

const exercisesKeys = {
  list: ['exercises'] as const,
};

export function useExercisesQuery() {
  return useQuery({
    queryKey: exercisesKeys.list,
    queryFn: () => getExercisesRepository().list(),
  });
}
