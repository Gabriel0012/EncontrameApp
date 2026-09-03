import { useEffect, useRef, useState } from 'react';

import { useExercisesQuery } from '@/services/exercises/exercises.service';
import type { Exercise } from '@/services/exercises/exercises.types';

export type BreathPhase = 'in' | 'hold' | 'out';

export function useExercisesController() {
  const query = useExercisesQuery();
  const [active, setActive] = useState<Exercise | null>(null);
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [gratitudeSaved, setGratitudeSaved] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('in');
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active?.kind !== 'breathing') return;

    const cycle = () => {
      setBreathPhase('in');
      phaseTimerRef.current = setTimeout(() => {
        setBreathPhase('hold');
        phaseTimerRef.current = setTimeout(() => {
          setBreathPhase('out');
          phaseTimerRef.current = setTimeout(cycle, 8000);
        }, 7000);
      }, 4000);
    };

    phaseTimerRef.current = setTimeout(() => {
      setBreathPhase('hold');
      phaseTimerRef.current = setTimeout(() => {
        setBreathPhase('out');
        phaseTimerRef.current = setTimeout(cycle, 8000);
      }, 7000);
    }, 4000);

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [active]);

  const closeActive = () => {
    setActive(null);
    setGratitudeSaved(false);
    setGratitudes(['', '', '']);
    setBreathPhase('in');
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
  };

  const start = (exercise: Exercise) => {
    setGratitudeSaved(false);
    setGratitudes(['', '', '']);
    setBreathPhase('in');
    setActive(exercise);
  };

  const setGratitudeAt = (index: number, value: string) => {
    setGratitudes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const breathLabel =
    breathPhase === 'in' ? 'Inspire' : breathPhase === 'hold' ? 'Segure' : 'Expire';

  return {
    exercises: query.data ?? [],
    loading: query.isLoading,
    active,
    start,
    closeActive,
    gratitudes,
    setGratitudeAt,
    gratitudeSaved,
    saveGratitudes: () => setGratitudeSaved(true),
    breathPhase,
    breathLabel,
  };
}

export type ExercisesController = ReturnType<typeof useExercisesController>;
