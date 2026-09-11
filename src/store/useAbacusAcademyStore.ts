// useAbacusAcademyStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ABACUS_LEVELS,
  AbacusLevel,
  AbacusLevelId,
  DEFAULT_ABACUS_LEVEL,
} from '../abacus/academy';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface AbacusLevelProgress {
  attempts: number;
  correct: number;
  bestStreak: number;
  currentStreak: number;
  mastery: number;
  completed: boolean;
}

export type AbacusLevelStatus =
  | 'locked'
  | 'available'
  | 'in-progress'
  | 'mastered';

export interface AbacusCertificate {
  levelId: AbacusLevelId;
  earnedAt: string;
  mastery: number;
}

interface AbacusAcademyState {
  levels: Record<
    AbacusLevelId,
    AbacusLevelProgress
  >;

  certificates: AbacusCertificate[];

  recordAttempt: (
    levelId: AbacusLevelId,
    correct: boolean,
  ) => void;

  resetLevel: (
    levelId: AbacusLevelId,
  ) => void;

  resetAcademy: () => void;

  getLevelProgress: (
    levelId: AbacusLevelId,
  ) => AbacusLevelProgress;

  isLevelUnlocked: (
    levelId: AbacusLevelId,
  ) => boolean;

  isLevelMastered: (
    levelId: AbacusLevelId,
  ) => boolean;

  getLevelStatus: (
    levelId: AbacusLevelId,
  ) => AbacusLevelStatus;

  getNextLevel: (
    levelId: AbacusLevelId,
  ) => AbacusLevel | undefined;

  getCurrentLevel: () => AbacusLevel;

  getOverallProgress: () => number;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const ACADEMY_VERSION = 3;

const EMPTY_PROGRESS: AbacusLevelProgress = {
  attempts: 0,
  correct: 0,
  bestStreak: 0,
  currentStreak: 0,
  mastery: 0,
  completed: false,
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function createEmptyProgress(): AbacusLevelProgress {
  return {
    ...EMPTY_PROGRESS,
  };
}

function createInitialLevels(): Record<
  AbacusLevelId,
  AbacusLevelProgress
> {
  return ABACUS_LEVELS.reduce(
    (
      accumulator,
      level,
    ) => {
      accumulator[level.id] =
        createEmptyProgress();

      return accumulator;
    },
    {} as Record<
      AbacusLevelId,
      AbacusLevelProgress
    >,
  );
}

function isValidLevelId(
  levelId: string,
): levelId is AbacusLevelId {
  return ABACUS_LEVELS.some(
    level => level.id === levelId,
  );
}

function getLevelDefinition(
  levelId: AbacusLevelId,
): AbacusLevel {
  const level =
    ABACUS_LEVELS.find(
      candidate =>
        candidate.id === levelId,
    );

  if (!level) {
    throw new Error(
      `Unknown Abacus Academy level: ${levelId}`,
    );
  }

  return level;
}

function calculateMastery(
  correct: number,
  attempts: number,
): number {
  if (attempts <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (correct / attempts) * 100,
      ),
    ),
  );
}

function hasMastery(
  level: AbacusLevel,
  progress: AbacusLevelProgress,
): boolean {
  return (
    progress.attempts >=
      level.minimumAttempts &&
    progress.mastery >=
      level.masteryTarget
  );
}

function normaliseProgress(
  value: unknown,
): AbacusLevelProgress {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return createEmptyProgress();
  }

  const candidate =
    value as Partial<AbacusLevelProgress>;

  const attempts = Math.max(
    0,
    Math.floor(
      Number(candidate.attempts) || 0,
    ),
  );

  const correct = Math.min(
    attempts,
    Math.max(
      0,
      Math.floor(
        Number(candidate.correct) || 0,
      ),
    ),
  );

  const bestStreak = Math.min(
    attempts,
    Math.max(
      0,
      Math.floor(
        Number(candidate.bestStreak) ||
          0,
      ),
    ),
  );

  const currentStreak = Math.min(
    attempts,
    Math.max(
      0,
      Math.floor(
        Number(
          candidate.currentStreak,
        ) || 0,
      ),
    ),
  );

  const mastery =
    calculateMastery(
      correct,
      attempts,
    );

  return {
    attempts,
    correct,
    bestStreak,
    currentStreak,
    mastery,
    completed:
      Boolean(candidate.completed) &&
      attempts > 0,
  };
}

/* -------------------------------------------------------------------------- */
/* Store                                                                      */
/* -------------------------------------------------------------------------- */

export const useAbacusAcademyStore =
  create<AbacusAcademyState>()(
    persist(
      (set, get) => ({
        levels:
          createInitialLevels(),

        certificates: [],

        /* ------------------------------------------------------------------ */
        /* Record attempt                                                     */
        /* ------------------------------------------------------------------ */

        recordAttempt: (
          levelId,
          correct,
        ) => {
          if (
            !isValidLevelId(levelId)
          ) {
            return;
          }

          const state = get();

          /*
           * A locked module must never receive progress.
           */
          if (
            !state.isLevelUnlocked(
              levelId,
            )
          ) {
            return;
          }

          const level =
            getLevelDefinition(levelId);

          const previous =
            state.levels[levelId] ??
            createEmptyProgress();

          const attempts =
            previous.attempts + 1;

          const correctAnswers =
            previous.correct +
            (correct ? 1 : 0);

          const currentStreak =
            correct
              ? previous.currentStreak +
                1
              : 0;

          const bestStreak =
            Math.max(
              previous.bestStreak,
              currentStreak,
            );

          const mastery =
            calculateMastery(
              correctAnswers,
              attempts,
            );

          const completed =
            attempts >=
              level.minimumAttempts &&
            mastery >=
              level.masteryTarget;

          const nextProgress: AbacusLevelProgress =
            {
              attempts,
              correct:
                correctAnswers,
              bestStreak,
              currentStreak,
              mastery,
              completed,
            };

          set(currentState => {
            const nextCertificates =
              [
                ...currentState.certificates,
              ];

            if (completed) {
              const existingIndex =
                nextCertificates.findIndex(
                  certificate =>
                    certificate.levelId ===
                    levelId,
                );

              if (
                existingIndex === -1
              ) {
                nextCertificates.push(
                  {
                    levelId,
                    earnedAt:
                      new Date().toISOString(),
                    mastery,
                  },
                );
              } else {
                /*
                 * Keep the certificate synchronized
                 * with the learner's latest mastery.
                 */
                nextCertificates[
                  existingIndex
                ] = {
                  ...nextCertificates[
                    existingIndex
                  ],
                  mastery,
                };
              }
            }

            return {
              levels: {
                ...currentState.levels,
                [levelId]:
                  nextProgress,
              },
              certificates:
                nextCertificates,
            };
          });
        },

        /* ------------------------------------------------------------------ */
        /* Reset module and all downstream modules                            */
        /* ------------------------------------------------------------------ */

        resetLevel: levelId => {
          if (
            !isValidLevelId(levelId)
          ) {
            return;
          }

          const startIndex =
            ABACUS_LEVELS.findIndex(
              level =>
                level.id === levelId,
            );

          if (startIndex < 0) {
            return;
          }

          /*
           * Everything from the selected module
           * onward is invalidated.
           */
          const resetIds =
            ABACUS_LEVELS
              .slice(startIndex)
              .map(
                level => level.id,
              );

          set(state => {
            const nextLevels = {
              ...state.levels,
            };

            for (
              const id of resetIds
            ) {
              nextLevels[id] =
                createEmptyProgress();
            }

            const nextCertificates =
              state.certificates.filter(
                certificate =>
                  !resetIds.includes(
                    certificate.levelId,
                  ),
              );

            return {
              levels: nextLevels,
              certificates:
                nextCertificates,
            };
          });
        },

        /* ------------------------------------------------------------------ */
        /* Reset academy                                                       */
        /* ------------------------------------------------------------------ */

        resetAcademy: () => {
          set({
            levels:
              createInitialLevels(),
            certificates: [],
          });
        },

        /* ------------------------------------------------------------------ */
        /* Get progress                                                        */
        /* ------------------------------------------------------------------ */

        getLevelProgress:
          levelId => {
            if (
              !isValidLevelId(
                levelId,
              )
            ) {
              return createEmptyProgress();
            }

            return (
              get().levels[levelId] ??
              createEmptyProgress()
            );
          },

        /* ------------------------------------------------------------------ */
        /* Unlocking                                                           */
        /* ------------------------------------------------------------------ */

        isLevelUnlocked:
          levelId => {
            if (
              !isValidLevelId(
                levelId,
              )
            ) {
              return false;
            }

            const level =
              getLevelDefinition(
                levelId,
              );

            /*
             * The first curriculum module
             * is always available.
             */
            if (
              level.prerequisites
                .length === 0
            ) {
              return true;
            }

            /*
             * Every prerequisite must be
             * genuinely mastered.
             */
            return level.prerequisites.every(
              prerequisiteId =>
                get().isLevelMastered(
                  prerequisiteId,
                ),
            );
          },

        /* ------------------------------------------------------------------ */
        /* Mastery                                                             */
        /* ------------------------------------------------------------------ */

        isLevelMastered:
          levelId => {
            if (
              !isValidLevelId(
                levelId,
              )
            ) {
              return false;
            }

            const level =
              getLevelDefinition(
                levelId,
              );

            const progress =
              get().levels[levelId] ??
              createEmptyProgress();

            return hasMastery(
              level,
              progress,
            );
          },

        /* ------------------------------------------------------------------ */
        /* Status                                                              */
        /* ------------------------------------------------------------------ */

        getLevelStatus:
          levelId => {
            if (
              !isValidLevelId(
                levelId,
              )
            ) {
              return 'locked';
            }

            if (
              !get().isLevelUnlocked(
                levelId,
              )
            ) {
              return 'locked';
            }

            if (
              get().isLevelMastered(
                levelId,
              )
            ) {
              return 'mastered';
            }

            const progress =
              get().levels[levelId] ??
              createEmptyProgress();

            if (
              progress.attempts > 0
            ) {
              return 'in-progress';
            }

            return 'available';
          },

        /* ------------------------------------------------------------------ */
        /* Next module                                                        */
        /* ------------------------------------------------------------------ */

        getNextLevel:
          levelId => {
            const index =
              ABACUS_LEVELS.findIndex(
                level =>
                  level.id === levelId,
              );

            if (
              index < 0 ||
              index >=
                ABACUS_LEVELS.length - 1
            ) {
              return undefined;
            }

            return ABACUS_LEVELS[
              index + 1
            ];
          },

        /* ------------------------------------------------------------------ */
        /* Current module                                                     */
        /* ------------------------------------------------------------------ */

        getCurrentLevel:
          () => {
            const state = get();

            /*
             * First:
             * return the earliest module that the
             * learner has started but not mastered.
             */
            const inProgress =
              ABACUS_LEVELS.find(
                level => {
                  const progress =
                    state.levels[
                      level.id
                    ];

                  return (
                    progress.attempts >
                      0 &&
                    !state.isLevelMastered(
                      level.id,
                    ) &&
                    state.isLevelUnlocked(
                      level.id,
                    )
                  );
                },
              );

            if (inProgress) {
              return inProgress;
            }

            /*
             * Second:
             * return the first unlocked module.
             *
             * Because modules are sequential,
             * this naturally becomes the next
             * module after the learner's latest
             * mastered module.
             */
            const available =
              ABACUS_LEVELS.find(
                level =>
                  state.isLevelUnlocked(
                    level.id,
                  ) &&
                  !state.isLevelMastered(
                    level.id,
                  ),
              );

            if (available) {
              return available;
            }

            /*
             * If everything is mastered,
             * return the final module.
             */
            return (
              ABACUS_LEVELS[
                ABACUS_LEVELS.length - 1
              ] ??
              getLevelDefinition(
                DEFAULT_ABACUS_LEVEL,
              )
            );
          },

        /* ------------------------------------------------------------------ */
        /* Overall progress                                                   */
        /* ------------------------------------------------------------------ */

        getOverallProgress:
          () => {
            const state = get();

            if (
              ABACUS_LEVELS.length === 0
            ) {
              return 0;
            }

            const mastered =
              ABACUS_LEVELS.filter(
                level =>
                  state.isLevelMastered(
                    level.id,
                  ),
              ).length;

            return Math.round(
              (mastered /
                ABACUS_LEVELS.length) *
                100,
            );
          },
      }),

      {
        name:
          'abacus-academy-progress',

        version:
          ACADEMY_VERSION,

        /*
         * Only learner progress is persisted.
         *
         * Curriculum definitions,
         * descriptions and prompt logic
         * remain in academy.ts.
         */
        partialize: state => ({
          levels: state.levels,
          certificates:
            state.certificates,
        }),

        /*
         * Safely rebuild persisted progress
         * when the academy schema changes.
         */
        migrate: (
          persistedState,
          version,
        ) => {
          /*
           * If this is an older schema,
           * rebuild the structure.
           *
           * We intentionally do not trust old
           * completion flags because the new
           * curriculum has changed materially.
           */
          if (
            version !==
            ACADEMY_VERSION
          ) {
            return {
              levels:
                createInitialLevels(),
              certificates: [],
            };
          }

          const persisted =
            persistedState as
              | Partial<AbacusAcademyState>
              | undefined;

          const freshLevels =
            createInitialLevels();

          if (
            persisted?.levels
          ) {
            for (
              const level of ABACUS_LEVELS
            ) {
              const saved =
                persisted.levels[
                  level.id
                ];

              if (!saved) {
                continue;
              }

              freshLevels[
                level.id
              ] = normaliseProgress(
                saved,
              );
            }
          }

          const certificates =
            Array.isArray(
              persisted?.certificates,
            )
              ? persisted.certificates.filter(
                  certificate =>
                    certificate &&
                    isValidLevelId(
                      certificate.levelId,
                    ),
                )
              : [];

          return {
            levels: freshLevels,
            certificates,
          };
        },
      },
    ),
  );