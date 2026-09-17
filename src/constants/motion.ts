import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutUp,
  withTiming,
  type WithTimingConfig,
} from 'react-native-reanimated';

export const Motion = {
  /** 250ms — 25ms era imperceptível (1–2 frames). */
  durationMs: 250,
  /** Entrada de conteúdo (cards, painéis) — mais lenta que o press. */
  enterMs: 350,
  staggerMs: 50,
  staggerMax: 8,
} as const;

const timingConfig: WithTimingConfig = {
  duration: Motion.durationMs,
};

const enterEasing = Easing.out(Easing.cubic);

function staggerDelay(index = 0) {
  return Math.min(Math.max(index, 0), Motion.staggerMax) * Motion.staggerMs;
}

/** `withTiming` com a duração padrão da marca (250ms). */
export function brandTiming<T extends number>(to: T) {
  return withTiming(to, timingConfig);
}

export function enterUp(index = 0) {
  return FadeInUp.duration(Motion.enterMs).delay(staggerDelay(index)).easing(enterEasing);
}

export function enterRight(index = 0) {
  return FadeInRight.duration(Motion.enterMs).delay(staggerDelay(index)).easing(enterEasing);
}

export function enterDown(index = 0) {
  return FadeInDown.duration(Motion.enterMs).delay(staggerDelay(index)).easing(enterEasing);
}

export function enterFade(index = 0) {
  return FadeIn.duration(Motion.enterMs).delay(staggerDelay(index)).easing(enterEasing);
}

export function exitUp() {
  return FadeOutUp.duration(Motion.durationMs).easing(enterEasing);
}

export function exitFade() {
  return FadeOut.duration(Motion.durationMs).easing(enterEasing);
}
