import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ABACUS_LEVELS, AbacusLevelId } from '../abacus/academy';

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
  recordAttempt: (levelId: AbacusLevelId, correct: boolean) => void;
}

const emptyProgress = (): AbacusLevelProgress => ({ attempts: 0, correct: 0, bestStreak: 0, currentStreak: 0, mastery: 0, completed: false });

export const useAbacusAcademyStore = create<AbacusAcademyState>()(
  persist(
    (set) => ({
      levels: {},
      certificates: [],
      recordAttempt: (levelId, correct) => set((state) => {
        const previous = state.levels[levelId] || emptyProgress();
        const level = ABACUS_LEVELS.find((candidate) => candidate.id === levelId)!;
        const attempts = previous.attempts + 1;
        const correctAnswers = previous.correct + (correct ? 1 : 0);
        const currentStreak = correct ? previous.currentStreak + 1 : 0;
        const mastery = Math.round((correctAnswers / attempts) * 100);
        const completed = correctAnswers >= level.masteryTarget && mastery >= 80;
        const progress = { attempts, correct: correctAnswers, currentStreak, bestStreak: Math.max(previous.bestStreak, currentStreak), mastery, completed };
        return {
          levels: { ...state.levels, [levelId]: progress },
          certificates: completed && !state.certificates.includes(levelId) ? [...state.certificates, levelId] : state.certificates
        };
      })
    }),
    { name: 'abacus-academy-storage' }
  )
);
