import { withTiming, type WithTimingConfig } from 'react-native-reanimated';

export const Motion = {
  /** 250ms — 25ms era imperceptível (1–2 frames). */
  durationMs: 250,
} as const;

const timingConfig: WithTimingConfig = {
  duration: Motion.durationMs,
};

/** `withTiming` com a duração padrão da marca (250ms). */
export function brandTiming<T extends number>(to: T) {
  return withTiming(to, timingConfig);
}
