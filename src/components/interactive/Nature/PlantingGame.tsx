import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  Check,
  Droplets,
  RotateCcw,
  Sprout,
  Sun,
} from 'lucide-react';
import { useProgressStore } from '../../../store/useProgressStore';

interface PlantingStage {
  id: string;
  title: string;
  instruction: string;
  emoji: string;
  actionLabel: string;
}

const STAGES: readonly PlantingStage[] = [
  {
    id: 'dig',
    title: 'Make a little hole',
    instruction:
      'Dig a small hole in the soil.',
    emoji: '🕳️',
    actionLabel: 'Dig the hole',
  },
  {
    id: 'seed',
    title: 'Plant the seed',
    instruction:
      'Put the little seed in the hole.',
    emoji: '🌰',
    actionLabel: 'Plant the seed',
  },
  {
    id: 'cover',
    title: 'Cover the seed',
    instruction:
      'Cover the seed gently with soil.',
    emoji: '🌱',
    actionLabel: 'Cover it',
  },
  {
    id: 'water',
    title: 'Give it water',
    instruction:
      'Water the seed gently.',
    emoji: '💧',
    actionLabel: 'Water the seed',
  },
  {
    id: 'grow',
    title: 'Watch it grow!',
    instruction:
      'The seed grows into a little plant.',
    emoji: '🌱',
    actionLabel: 'Watch it grow',
  },
] as const;

const TOTAL_STAGES = STAGES.length;

const PLANTING_ACTIVITY_ID =
  'nature-planting-001';

const PLANTING_SKILLS = [
  'nature-plant-life-cycle',
  'nature-plant-care',
  'nature-sequencing',
] as const;

export const PlantingGame: React.FC = () => {
  const [step, setStep] =
    useState(0);

  const [completed, setCompleted] =
    useState(false);

  const [showFeedback, setShowFeedback] =
    useState(false);

  const [stars, setStars] =
    useState(0);

  const timeoutRef =
    useRef<number | null>(null);

  const completeActivity =
    useProgressStore(
      (state) =>
        state.completeActivity,
    );

  const currentStage =
    STAGES[step];

  const progress = completed
    ? 100
    : Math.round(
        ((step + 1) /
          TOTAL_STAGES) *
          100,
      );

  /**
   * Clean up delayed feedback when
   * the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (
        timeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          timeoutRef.current,
        );
      }
    };
  }, []);

  const handleAction = () => {
    if (
      showFeedback ||
      completed
    ) {
      return;
    }

    setShowFeedback(true);

    timeoutRef.current =
      window.setTimeout(() => {
        setShowFeedback(false);

        if (
          step <
          TOTAL_STAGES - 1
        ) {
          setStep(
            (previous) =>
              previous + 1,
          );

          return;
        }

        /**
         * The learner completed the
         * complete planting sequence.
         *
         * This creates evidence for:
         * - plant life cycle
         * - plant care
         * - sequencing
         */
        setCompleted(true);
        setStars(3);

        completeActivity({
          id:
            PLANTING_ACTIVITY_ID,

          score: 100,

          academyId:
            'nature',

          domain:
            'science',

          skillIds:
            PLANTING_SKILLS,
        });
      }, 700);
  };

  const resetGame = () => {
    if (
      timeoutRef.current !==
      null
    ) {
      window.clearTimeout(
        timeoutRef.current,
      );

      timeoutRef.current = null;
    }

    setStep(0);
    setCompleted(false);
    setShowFeedback(false);
    setStars(0);
  };

  if (completed) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-app-border bg-app-card shadow-xl"
      >
        <div className="relative overflow-hidden px-6 pb-8 pt-8 text-center sm:px-8">
          <motion.div
            initial={{
              scale: 0,
              rotate: -10,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 14,
            }}
            className="mb-5 text-7xl"
            aria-hidden="true"
          >
            🌻
          </motion.div>

          <h2 className="text-2xl font-black text-white sm:text-3xl">
            You grew a plant!
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400 sm:text-base">
            Great job! You learned how a seed can grow into a plant.
          </p>

          <div
            className="mt-6 flex items-center justify-center gap-2"
            aria-label={`${stars} stars earned`}
          >
            {[1, 2, 3].map(
              (star) => (
                <motion.span
                  key={star}
                  initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    delay:
                      star * 0.15,
                  }}
                  className="text-4xl"
                  aria-hidden="true"
                >
                  ⭐
                </motion.span>
              ),
            )}
          </div>

          <div className="mt-7 rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
            <div className="flex items-center justify-center gap-2 text-green-300">
              <Sprout
                className="h-5 w-5"
                aria-hidden="true"
              />

              <span className="font-bold">
                Planting complete!
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-base font-black text-white shadow-lg transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-400/30 active:scale-[0.98]"
          >
            <RotateCcw
              className="h-5 w-5"
              aria-hidden="true"
            />

            Plant Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-app-border bg-app-card shadow-xl">
      {/* Header */}
      <div className="px-5 pb-4 pt-6 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sprout
                className="h-6 w-6 text-green-400"
                aria-hidden="true"
              />

              <h2 className="text-xl font-black text-white sm:text-2xl">
                Plant a Seed
              </h2>
            </div>

            <p className="text-sm text-gray-400">
              Let&apos;s help a little seed grow!
            </p>
          </div>

          <div
            className="rounded-full border border-app-border bg-gray-900/50 px-3 py-1.5 text-xs font-bold text-gray-300"
            aria-label={`Step ${step + 1} of ${TOTAL_STAGES}`}
          >
            {step + 1}/{TOTAL_STAGES}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>Growing</span>
            <span>
              {progress}%
            </span>
          </div>

          <div
            className="h-3 overflow-hidden rounded-full bg-gray-800"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Plant growing progress"
          >
            <motion.div
              className="h-full rounded-full bg-green-500"
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.4,
              }}
            />
          </div>
        </div>
      </div>

      {/* Learning Scene */}
      <div className="px-5 pb-6 sm:px-7">
        <div className="relative overflow-hidden rounded-3xl border border-app-border bg-gradient-to-b from-sky-950/40 to-amber-950/30 p-6 sm:p-8">
          {/* Sun */}
          <motion.div
            animate={{
              rotate: [
                0,
                8,
                0,
                -8,
                0,
              ],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute right-5 top-5 text-4xl"
            aria-hidden="true"
          >
            ☀️
          </motion.div>

          {/* Cloud */}
          <div
            className="absolute left-5 top-7 text-2xl opacity-60"
            aria-hidden="true"
          >
            ☁️
          </div>

          {/* Learning content */}
          <div className="relative z-10 flex min-h-[250px] flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{
                  opacity: 0,
                  scale: 0.75,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  y: -15,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="text-center"
              >
                <motion.div
                  animate={
                    showFeedback
                      ? {
                          scale: [
                            1,
                            1.15,
                            1,
                          ],
                          rotate: [
                            0,
                            -5,
                            5,
                            0,
                          ],
                        }
                      : {
                          scale: 1,
                        }
                  }
                  transition={{
                    duration: 0.45,
                  }}
                  className="mb-5 text-7xl sm:text-8xl"
                  aria-hidden="true"
                >
                  {
                    currentStage.emoji
                  }
                </motion.div>

                <h3 className="text-xl font-black text-white sm:text-2xl">
                  {
                    currentStage.title
                  }
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-300 sm:text-base">
                  {
                    currentStage.instruction
                  }
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-amber-950/50" />
        </div>

        {/* Feedback */}
        <div className="mt-4 min-h-12">
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-center text-sm font-bold text-green-300"
                role="status"
                aria-live="polite"
              >
                <Check
                  className="h-5 w-5"
                  aria-hidden="true"
                />

                Wonderful! 🌱
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action */}
        <motion.button
          type="button"
          whileTap={{
            scale: 0.97,
          }}
          whileHover={{
            scale: 1.01,
          }}
          onClick={handleAction}
          disabled={showFeedback}
          className="mt-2 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-400/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {currentStage.id ===
          'water' ? (
            <Droplets
              className="h-6 w-6"
              aria-hidden="true"
            />
          ) : currentStage.id ===
            'grow' ? (
            <Sun
              className="h-6 w-6"
              aria-hidden="true"
            />
          ) : null}

          <span>
            {
              currentStage.actionLabel
            }
          </span>

          {currentStage.id !==
            'grow' && (
            <ArrowRight
              className="h-5 w-5"
              aria-hidden="true"
            />
          )}
        </motion.button>

        {/* Learning reminder */}
        <p className="mt-4 text-center text-xs font-medium text-gray-500">
          Seed → Soil → Water → Plant 🌱
        </p>
      </div>
    </div>
  );
};