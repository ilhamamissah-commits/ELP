import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ABACUS_LEVELS,
  AbacusLevelId,
} from '../abacus/academy';

export interface AbacusLevelProgress {
  attempts: number;
  correct: number;
  bestStreak: number;
  currentStreak: number;
  mastery: number;
  completed: boolean;
}

interface AbacusAcademyState {
  levels: Partial<Record<AbacusLevelId, AbacusLevelProgress>>;
  certificates: AbacusLevelId[];

  recordAttempt: (
    levelId: AbacusLevelId,
    correct: boolean
  ) => void;

  resetLevel: (levelId: AbacusLevelId) => void;
  getLevelProgress: (
    levelId: AbacusLevelId
  ) => AbacusLevelProgress;
}

const createEmptyProgress = (): AbacusLevelProgress => ({
  attempts: 0,
  correct: 0,
  bestStreak: 0,
  currentStreak: 0,
  mastery: 0,
  completed: false,
});

const calculateMastery = (
  correct: number,
  attempts: number
): number => {
  if (attempts === 0) {
    return 0;
  }

  return Math.round((correct / attempts) * 100);
};

export const useAbacusAcademyStore =
  create<AbacusAcademyState>()(
    persist(
      (set, get) => ({
        levels: {},
        certificates: [],

        recordAttempt: (levelId, correct) =>
          set((state) => {
            const level = ABACUS_LEVELS.find(
              (candidate) => candidate.id === levelId
            );

            // Protect the store from invalid level IDs.
            if (!level) {
              return state;
            }

            const previous =
              state.levels[levelId] ?? createEmptyProgress();

            const attempts = previous.attempts + 1;
            const correctAnswers =
              previous.correct + (correct ? 1 : 0);

            const currentStreak = correct
              ? previous.currentStreak + 1
              : 0;

            const bestStreak = Math.max(
              previous.bestStreak,
              currentStreak
            );

            const mastery = calculateMastery(
              correctAnswers,
              attempts
            );

            const meetsMasteryTarget =
              correctAnswers >= level.masteryTarget &&
              mastery >= 80;

            // Completion is permanent once achieved.
            const completed =
              previous.completed || meetsMasteryTarget;

            const progress: AbacusLevelProgress = {
              attempts,
              correct: correctAnswers,
              currentStreak,
              bestStreak,
              mastery,
              completed,
            };

            const certificates =
              completed &&
              !state.certificates.includes(levelId)
                ? [...state.certificates, levelId]
                : state.certificates;

            return {
              levels: {
                ...state.levels,
                [levelId]: progress,
              },
              certificates,
            };
          }),

        resetLevel: (levelId) =>
          set((state) => {
            const levels = { ...state.levels };
            delete levels[levelId];

            return {
              levels,
            };
          }),

        getLevelProgress: (levelId) => {
          return (
            get().levels[levelId] ??
            createEmptyProgress()
          );
        },
      }),
      {
        name: 'abacus-academy-storage',
      }
    )
  );
