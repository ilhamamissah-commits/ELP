import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Check,
  Recycle,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { useProgressStore } from '../../../store/useProgressStore';
type WasteType = 'Organic' | 'Recyclable' | 'Hazardous';

interface RecyclingItem {
  id: string;
  emoji: string;
  name: string;
  type: WasteType;
  childDescription: string;
}

interface RecyclingBin {
  id: WasteType;
  label: string;
  emoji: string;
  description: string;
}

const RECYCLING_ACTIVITY_ID = 'nature-recycling-001';

const RECYCLING_SKILLS = [
  'nature-waste-classification',
  'nature-recycling',
  'nature-environmental-awareness',
] as const;

const ITEMS: readonly RecyclingItem[] = [
  {
    id: 'banana-peel',
    emoji: '🍌',
    name: 'Banana Peel',
    type: 'Organic',
    childDescription:
      'A banana peel can go with food and plant waste.',
  },
  {
    id: 'plastic-bottle',
    emoji: '🥤',
    name: 'Plastic Bottle',
    type: 'Recyclable',
    childDescription:
      'This plastic bottle can be collected for recycling.',
  },
  {
    id: 'cardboard-box',
    emoji: '📦',
    name: 'Cardboard Box',
    type: 'Recyclable',
    childDescription:
      'Clean cardboard can be recycled.',
  },
  {
    id: 'apple-core',
    emoji: '🍎',
    name: 'Apple Core',
    type: 'Organic',
    childDescription:
      'An apple core can go with food and plant waste.',
  },
  {
    id: 'battery',
    emoji: '🔋',
    name: 'Battery',
    type: 'Hazardous',
    childDescription:
      'Batteries need special collection. Ask a grown-up for help.',
  },
  {
    id: 'tin-can',
    emoji: '🥫',
    name: 'Tin Can',
    type: 'Recyclable',
    childDescription:
      'Metal cans can often be recycled.',
  },
  {
    id: 'newspaper',
    emoji: '🗞️',
    name: 'Newspaper',
    type: 'Recyclable',
    childDescription:
      'Clean paper can be recycled.',
  },
  {
    id: 'chicken-bone',
    emoji: '🍗',
    name: 'Chicken Bone',
    type: 'Organic',
    childDescription:
      'Food scraps can go with organic waste.',
  },
] as const;

const BINS: readonly RecyclingBin[] = [
  {
    id: 'Organic',
    label: 'Organic',
    emoji: '🍃',
    description: 'Food & plant waste',
  },
  {
    id: 'Recyclable',
    label: 'Recycle',
    emoji: '♻️',
    description: 'Paper, plastic & metal',
  },
  {
    id: 'Hazardous',
    label: 'Special',
    emoji: '🔋',
    description: 'Ask a grown-up',
  },
] as const;

const POINTS_PER_CORRECT = 10;
const TOTAL_ITEMS = ITEMS.length;

type FeedbackState = 'correct' | 'tryAgain' | null;

export const RecyclingGame: React.FC = () => {
  const completeActivity =
    useProgressStore(
      (state) => state.completeActivity,
    );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] =
    useState<FeedbackState>(null);
  const [selectedBin, setSelectedBin] =
    useState<WasteType | null>(null);

  const feedbackTimeoutRef =
    useRef<number | null>(null);

  const item = ITEMS[index];

  const stars = useMemo(() => {
    if (score >= 80) {
      return 3;
    }

    if (score >= 50) {
      return 2;
    }

    if (score >= 20) {
      return 1;
    }

    return 0;
  }, [score]);

  const progress = done
    ? 100
    : Math.round(
        (index / TOTAL_ITEMS) * 100,
      );

  const clearFeedbackTimeout = () => {
    if (
      feedbackTimeoutRef.current !== null
    ) {
      window.clearTimeout(
        feedbackTimeoutRef.current,
      );

      feedbackTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearFeedbackTimeout();
    };
  }, []);

  const handleSort = (
    bin: WasteType,
  ) => {
    if (
      done ||
      feedback !== null
    ) {
      return;
    }

    clearFeedbackTimeout();

    setAttempts(
      (previous) => previous + 1,
    );

    setSelectedBin(bin);

    if (bin === item.type) {
      const nextScore =
        score + POINTS_PER_CORRECT;

      setScore(nextScore);
      setFeedback('correct');

      feedbackTimeoutRef.current =
        window.setTimeout(() => {
          setFeedback(null);
          setSelectedBin(null);

          if (
            index <
            TOTAL_ITEMS - 1
          ) {
            setIndex(
              (previous) =>
                previous + 1,
            );
          } else {
            setDone(true);

            /*
             * Record the completed activity
             * in the ELP progress engine.
             *
             * This activity belongs to:
             * Nature & Agriculture → Science
             */
            completeActivity({
              id: RECYCLING_ACTIVITY_ID,
              score: nextScore,
              academyId: 'nature',
              domain: 'science',
              skillIds:
                RECYCLING_SKILLS,
            });
          }

          feedbackTimeoutRef.current =
            null;
        }, 900);

      return;
    }

    setFeedback('tryAgain');

    feedbackTimeoutRef.current =
      window.setTimeout(() => {
        setFeedback(null);
        setSelectedBin(null);

        feedbackTimeoutRef.current =
          null;
      }, 1000);
  };

  const resetGame = () => {
    clearFeedbackTimeout();

    setIndex(0);
    setScore(0);
    setAttempts(0);
    setDone(false);
    setFeedback(null);
    setSelectedBin(null);
  };

  if (done) {
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
        <div className="px-6 pb-8 pt-8 text-center sm:px-8">
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 14,
            }}
            className="mb-4 text-7xl"
            aria-hidden="true"
          >
            ♻️
          </motion.div>

          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Recycling Hero!
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400 sm:text-base">
            Amazing sorting! You helped
            learn where different things
            belong.
          </p>

          <div
            className="mt-5 flex justify-center gap-2"
            aria-label={`${stars} stars earned`}
          >
            {[1, 2, 3].map(
              (star) => (
                <motion.span
                  key={star}
                  initial={{
                    opacity: 0,
                    scale: 0.4,
                    y: 10,
                  }}
                  animate={{
                    opacity:
                      star <= stars
                        ? 1
                        : 0.2,
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      star * 0.12,
                  }}
                  className="text-4xl"
                  aria-hidden="true"
                >
                  ⭐
                </motion.span>
              ),
            )}
          </div>

          <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border border-app-border bg-gray-900/40 p-4">
              <div className="text-2xl font-black text-green-400">
                {score}
              </div>

              <div className="mt-1 text-xs font-bold text-gray-500">
                Points
              </div>
            </div>

            <div className="rounded-2xl border border-app-border bg-gray-900/40 p-4">
              <div className="text-2xl font-black text-sky-400">
                {attempts}
              </div>

              <div className="mt-1 text-xs font-bold text-gray-500">
                Tries
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
            <div className="flex items-center justify-center gap-2 text-green-300">
              <Sparkles
                className="h-5 w-5"
                aria-hidden="true"
              />

              <span className="font-bold">
                Every little action helps!
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

            Play Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-app-border bg-app-card shadow-xl">
      <div className="px-5 pb-4 pt-6 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Recycle
                className="h-6 w-6 text-green-400"
                aria-hidden="true"
              />

              <h2 className="text-xl font-black text-white sm:text-2xl">
                Recycling Hero
              </h2>
            </div>

            <p className="text-sm text-gray-400">
              Where does this item belong?
            </p>
          </div>

          <div className="rounded-full border border-app-border bg-gray-900/50 px-3 py-1.5 text-xs font-bold text-gray-300">
            {index + 1}/{TOTAL_ITEMS}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>Sorting</span>
            <span>{progress}%</span>
          </div>

          <div
            className="h-3 overflow-hidden rounded-full bg-gray-800"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Recycling game progress"
          >
            <motion.div
              className="h-full rounded-full bg-green-500"
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.35,
              }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 sm:px-7">
        <motion.div
          key={item.id}
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 10,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          className="relative overflow-hidden rounded-3xl border border-app-border bg-gray-950/40 px-5 py-7 text-center"
        >
          <div
            className="absolute right-4 top-4 text-2xl opacity-50"
            aria-hidden="true"
          >
            🌍
          </div>

          <motion.div
            animate={
              feedback === 'tryAgain'
                ? {
                    x: [
                      -4,
                      4,
                      -4,
                      4,
                      0,
                    ],
                  }
                : feedback ===
                    'correct'
                  ? {
                      scale: [
                        1,
                        1.15,
                        1,
                      ],
                    }
                  : {
                      scale: 1,
                    }
            }
            transition={{
              duration: 0.4,
            }}
            className="text-7xl sm:text-8xl"
            aria-hidden="true"
          >
            {item.emoji}
          </motion.div>

          <h3 className="mt-4 text-xl font-black text-white">
            {item.name}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-gray-500">
            {item.childDescription}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Tap the bin where it belongs.
          </p>
        </motion.div>

        <div
          className="mt-4 min-h-14"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {feedback ===
              'correct' && (
              <motion.div
                key="correct"
                initial={{
                  opacity: 0,
                  y: 8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-center text-sm font-black text-green-300"
                role="status"
              >
                <Check
                  className="h-5 w-5"
                  aria-hidden="true"
                />

                Great job! That's right! 🎉
              </motion.div>
            )}

            {feedback ===
              'tryAgain' && (
              <motion.div
                key="tryAgain"
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
                className="flex items-center justify-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-center text-sm font-black text-amber-300"
                role="status"
              >
                <X
                  className="h-5 w-5"
                  aria-hidden="true"
                />

                Try another bin! 💚
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {BINS.map((bin) => {
            const isSelected =
              selectedBin ===
              bin.id;

            const isCorrect =
              feedback ===
                'correct' &&
              item.type ===
                bin.id;

            const isWrong =
              feedback ===
                'tryAgain' &&
              isSelected;

            return (
              <motion.button
                key={bin.id}
                type="button"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() =>
                  handleSort(
                    bin.id,
                  )
                }
                disabled={
                  feedback !== null
                }
                aria-label={`Put ${item.name} in the ${bin.label} bin`}
                className={[
                  'relative flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition focus:outline-none focus:ring-4 focus:ring-green-400/30 disabled:cursor-not-allowed disabled:opacity-80',
                  isCorrect
                    ? 'border-green-400 bg-green-400/20'
                    : isWrong
                      ? 'border-amber-400 bg-amber-400/10'
                      : 'border-gray-700 bg-gray-900/70 hover:border-green-400/60 hover:bg-gray-800',
                ].join(' ')}
              >
                <div
                  className="text-4xl sm:text-5xl"
                  aria-hidden="true"
                >
                  {bin.emoji}
                </div>

                <div className="mt-2 text-sm font-black text-white">
                  {bin.label}
                </div>

                <div className="mt-1 hidden text-[10px] leading-3 text-gray-500 sm:block">
                  {bin.description}
                </div>

                {isCorrect && (
                  <motion.div
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    className="absolute right-2 top-2"
                  >
                    <Check
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </motion.div>
                )}

                {isWrong && (
                  <motion.div
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    className="absolute right-2 top-2"
                  >
                    <AlertCircle
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {item.type ===
          'Hazardous' && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-gray-400"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
              aria-hidden="true"
            />

            <span>
              Some things need
              special care. Always
              ask a grown-up for
              help with batteries.
            </span>
          </motion.div>
        )}

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-app-border bg-gray-900/40 px-4 py-3">
          <div>
            <div className="text-xs font-bold text-gray-500">
              Your score
            </div>

            <div className="text-xl font-black text-green-400">
              {score}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-gray-500">
              Keep going!
            </div>

            <div
              className="text-lg"
              aria-hidden="true"
            >
              {stars > 0
                ? '⭐'.repeat(
                    stars,
                  )
                : '🌱'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};