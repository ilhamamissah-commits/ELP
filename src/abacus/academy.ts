export type AbacusLevelId = 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'level-6';
export type AbacusMode = 'beginner' | 'practice' | 'challenge' | 'mental';

export interface AbacusLevel {
  id: AbacusLevelId;
  title: string;
  subtitle: string;
  rodCount: number;
  masteryTarget: number;
}

export const ABACUS_LEVELS: AbacusLevel[] = [
  { id: 'level-1', title: 'Level 1: Number Recognition', subtitle: 'Build numbers from 1 to 9.', rodCount: 1, masteryTarget: 5 },
  { id: 'level-2', title: 'Level 2: Place Value', subtitle: 'Use tens and ones together.', rodCount: 2, masteryTarget: 5 },
  { id: 'level-3', title: 'Level 3: Addition', subtitle: 'Build the answer to an addition.', rodCount: 2, masteryTarget: 6 },
  { id: 'level-4', title: 'Level 4: Subtraction', subtitle: 'Build the answer to a subtraction.', rodCount: 2, masteryTarget: 6 },
  { id: 'level-5', title: 'Level 5: Multiplication & Division', subtitle: 'Build the answer to number facts.', rodCount: 3, masteryTarget: 8 },
  { id: 'level-6', title: 'Level 6: Mental Abacus', subtitle: 'Picture the beads, then build the answer.', rodCount: 3, masteryTarget: 8 }
];

export interface AbacusPrompt {
  prompt: string;
  answer: number;
  flash?: boolean;
}

const integer = (max: number, min = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

export function createPrompt(levelId: AbacusLevelId, mode: AbacusMode): AbacusPrompt {
  if (mode === 'beginner' || levelId === 'level-1') {
    const value = integer(9);
    return { prompt: `Make ${value}`, answer: value };
  }
  if (levelId === 'level-2') {
    const value = integer(89, 10);
    return { prompt: `Make ${value}`, answer: value };
  }
  if (levelId === 'level-3' || levelId === 'level-6') {
    const a = integer(levelId === 'level-6' ? 49 : 69, 10);
    const b = integer(20, 1);
    return { prompt: `${a} + ${b}`, answer: a + b, flash: levelId === 'level-6' || mode === 'mental' };
  }
  if (levelId === 'level-4') {
    const a = integer(89, 20);
    const b = integer(Math.min(30, a - 1), 1);
    return { prompt: `${a} − ${b}`, answer: a - b };
  }
  const divisor = integer(9, 2);
  const quotient = integer(9, 2);
  return Math.random() > 0.5
    ? { prompt: `${divisor} × ${quotient}`, answer: divisor * quotient }
    : { prompt: `${divisor * quotient} ÷ ${divisor}`, answer: quotient };
}
