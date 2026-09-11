import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Coins,
  Lightbulb,
  Volume2,
  ArrowRight,
  RotateCcw,
  Trophy,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type CoinValue = 1 | 5 | 10 | 25;

interface MoneyProblem {
  coins: CoinValue[];
  answer: number;
  explanation: string;
  hint: string;
}

const COINS: Record<
  CoinValue,
  {
    value: CoinValue;
    label: string;
    symbol: string;
    className: string;
  }
> = {
  1: {
    value: 1,
    label: '1¢',
    symbol: '1',
    className: 'bg-slate-300 text-slate-800 border-slate-200',
  },
  5: {
    value: 5,
    label: '5¢',
    symbol: '5',
    className: 'bg-orange-200 text-orange-900 border-orange-100',
  },
  10: {
    value: 10,
    label: '10¢',
    symbol: '10',
    className: 'bg-yellow-200 text-yellow-900 border-yellow-100',
  },
  25: {
    value: 25,
    label: '25¢',
    symbol: '25',
    className: 'bg-emerald-200 text-emerald-900 border-emerald-100',
  },
};

const LEVEL_PROBLEMS: Record<number, MoneyProblem[]> = {
  1: [
    {
      coins: [1, 1],
      answer: 2,
      explanation: '1¢ + 1¢ = 2¢.',
      hint: 'Count each coin: 1, then 2.',
    },
    {
      coins: [1, 5],
      answer: 6,
      explanation: '5¢ + 1¢ = 6¢.',
      hint: 'Start with the bigger coin: 5¢. Add 1¢.',
    },
    {
      coins: [5, 5],
      answer: 10,
      explanation: '5¢ + 5¢ = 10¢.',
      hint: 'Count by fives: 5, 10.',
    },
    {
      coins: [5, 1, 1],
      answer: 7,
      explanation: '5¢ + 1¢ + 1¢ = 7¢.',
      hint: 'Start at 5 and count two more.',
    },
    {
      coins: [10, 1],
      answer: 11,
      explanation: '10¢ + 1¢ = 11¢.',
      hint: 'Ten plus one makes eleven.',
    },
  ],

  2: [
    {
      coins: [1, 1, 5],
      answer: 7,
      explanation: '5¢ + 1¢ + 1¢ = 7¢.',
      hint: 'Start with 5 and count two ones.',
    },
    {
      coins: [5, 5, 5],
      answer: 15,
      explanation: '5¢ + 5¢ + 5¢ = 15¢.',
      hint: 'Count by fives: 5, 10, 15.',
    },
    {
      coins: [10, 5],
      answer: 15,
      explanation: '10¢ + 5¢ = 15¢.',
      hint: 'Ten plus five.',
    },
    {
      coins: [10, 10, 5],
      answer: 25,
      explanation: '10¢ + 10¢ + 5¢ = 25¢.',
      hint: 'Two tens make 20. Add 5.',
    },
    {
      coins: [10, 5, 1, 1],
      answer: 17,
      explanation: '10¢ + 5¢ + 1¢ + 1¢ = 17¢.',
      hint: 'Make 15 first, then add two.',
    },
  ],

  3: [
    {
      coins: [25, 10, 5],
      answer: 40,
      explanation: '25¢ + 10¢ + 5¢ = 40¢.',
      hint: '25 + 10 = 35. Add 5 more.',
    },
    {
      coins: [25, 25],
      answer: 50,
      explanation: '25¢ + 25¢ = 50¢.',
      hint: 'Two quarters make 50¢.',
    },
    {
      coins: [10, 10, 10, 5],
      answer: 35,
      explanation: '10¢ + 10¢ + 10¢ + 5¢ = 35¢.',
      hint: 'Three tens make 30. Add 5.',
    },
    {
      coins: [25, 10, 10, 5],
      answer: 50,
      explanation: '25¢ + 10¢ + 10¢ + 5¢ = 50¢.',
      hint: '25 + 20 + 5.',
    },
    {
      coins: [25, 25, 10, 5],
      answer: 65,
      explanation: '25¢ + 25¢ + 10¢ + 5¢ = 65¢.',
      hint: 'Two quarters make 50. Add 15.',
    },
  ],

  4: [
    {
      coins: [25, 25, 10, 10, 5],
      answer: 75,
      explanation: '50¢ + 20¢ + 5¢ = 75¢.',
      hint: 'Combine the two 25¢ coins first.',
    },
    {
      coins: [25, 25, 25, 10],
      answer: 85,
      explanation: '75¢ + 10¢ = 85¢.',
      hint: 'Three quarters make 75¢.',
    },
    {
      coins: [25, 10, 10, 10, 5],
      answer: 60,
      explanation: '25¢ + 30¢ + 5¢ = 60¢.',
      hint: 'Make 30¢ from the three tens.',
    },
    {
      coins: [25, 25, 10, 5, 1],
      answer: 66,
      explanation: '50¢ + 10¢ + 5¢ + 1¢ = 66¢.',
      hint: 'Make 65¢, then add 1¢.',
    },
    {
      coins: [25, 25, 25, 25],
      answer: 100,
      explanation: 'Four quarters make 100¢, which is $1.',
      hint: 'How many quarters make a whole dollar?',
    },
  ],

  5: [
    {
      coins: [25, 25, 25, 25],
      answer: 100,
      explanation: 'Four 25¢ coins equal 100¢, or $1.',
      hint: 'Four quarters make one dollar.',
    },
    {
      coins: [25, 25, 25, 10, 5],
      answer: 90,
      explanation: '75¢ + 10¢ + 5¢ = 90¢.',
      hint: 'Three quarters make 75¢.',
    },
    {
      coins: [25, 25, 10, 10, 10, 5],
      answer: 85,
      explanation: '50¢ + 30¢ + 5¢ = 85¢.',
      hint: 'Group the quarters and tens.',
    },
    {
      coins: [25, 25, 25, 10, 10, 5],
      answer: 100,
      explanation: '75¢ + 20¢ + 5¢ = 100¢, or $1.',
      hint: 'Can you make exactly 100¢?',
    },
    {
      coins: [25, 25, 25, 25, 10, 5],
      answer: 115,
      explanation: '100¢ + 10¢ + 5¢ = 115¢.',
      hint: 'Four quarters make $1. Then add 15¢.',
    },
  ],
};

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const buildOptions = (answer: number): number[] => {
  const candidates = new Set<number>([answer]);

  const offsets = [5, -5, 10, -10, 15, -15, 25, -25];

  for (const offset of offsets) {
    const value = answer + offset;

    if (value >= 0 && value !== answer) {
      candidates.add(value);
    }

    if (candidates.size >= 3) break;
  }

  while (candidates.size < 3) {
    candidates.add(answer + candidates.size * 5);
  }

  return shuffle(Array.from(candidates).slice(0, 3));
};

export const MoneyGame: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const completeActivity = useProgressStore(
    (state) => state.completeActivity
  );

  // Global sound / auto-read settings
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  // useReadAloud already respects soundEnabled + voiceAccent internally
  const { speak } = useReadAloud();

  const currentLevel = profile?.currentLevel ?? 1;

  const problems = useMemo(() => {
    const available =
      LEVEL_PROBLEMS[Math.min(Math.max(currentLevel, 1), 5)] ??
      LEVEL_PROBLEMS[1];

    return shuffle(available);
  }, [currentLevel]);

  const [problemIndex, setProblemIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);

  const SESSION_SIZE = 5;

  const current = problems[problemIndex % problems.length];

  const options = useMemo(
    () => buildOptions(current.answer),
    [current.answer]
  );

  const sessionProgress = Math.min(
    (attempts / SESSION_SIZE) * 100,
    100
  );

  const accuracy =
    attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

  // Reset per-question state + auto-read the question (if enabled)
  useEffect(() => {
    if (autoReadEnabled) {
      const readOut = 'Count the coins and choose the total amount of money.';
      const timer = window.setTimeout(() => speak(readOut), 350);
      return () => window.clearTimeout(timer);
    }
  }, [problemIndex, speak, autoReadEnabled]);

  // Read hint aloud when it opens
  useEffect(() => {
    if (showHint && current) {
      speak(current.hint);
    }
  }, [showHint, current, speak]);

  // Announce completion
  useEffect(() => {
    if (!roundComplete) return;

    const finalAccuracy =
      attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    speak(
      finalAccuracy >= 80
        ? `Brilliant work! You scored ${finalAccuracy} percent. You are a money expert!`
        : `Well done! You scored ${finalAccuracy} percent. Let's count coins again.`,
    );
  }, [roundComplete, attempts, correctAnswers, speak]);

  const finishSession = useCallback(() => {
    const finalAccuracy =
      attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    completeActivity({
      id: 'maths-money-lab',
      score: finalAccuracy,
      academyId: 'maths',
      domain: 'numeracy',
      skillIds: [
        'money-recognition',
        'counting-money',
        'coin-values',
        'addition',
        'number-sense',
        'mathematical-reasoning',
      ],
    });

    setRoundComplete(true);
  }, [attempts, correctAnswers, completeActivity]);

  const handleAnswer = (answer: number) => {
    if (selected !== null || roundComplete) return;

    setSelected(answer);
    setAttempts((value) => value + 1);

    if (answer === current.answer) {
      if (soundEnabled) {
        playSoundFeedback('correct');
      }

      setCorrectAnswers((value) => value + 1);

      speak(`Correct! ${current.explanation}`);

      setTimeout(() => {
        const nextAttempts = attempts + 1;

        if (nextAttempts >= SESSION_SIZE) {
          finishSession();
          return;
        }

        setProblemIndex((value) => value + 1);
        setSelected(null);
        setShowHint(false);
        setShowExplanation(false);
      }, 2000);
    } else {
      if (soundEnabled) {
        playSoundFeedback('try-again');
      }

      speak('Not quite. Try counting the coins from the largest value.');
      setShowExplanation(true);
    }
  };

  const restart = () => {
    setProblemIndex(0);
    setSelected(null);
    setShowHint(false);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setAttempts(0);
    setRoundComplete(false);

    speak("Let's count coins again!");
  };

  if (roundComplete) {
    const finalAccuracy =
      attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    const stars =
      finalAccuracy >= 90
        ? 3
        : finalAccuracy >= 70
          ? 2
          : finalAccuracy >= 50
            ? 1
            : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">Money Lab Complete</h3>

        <p className="text-gray-400 mt-2">
          You practised counting and combining coins.
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="text-3xl mb-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className={index < stars ? 'text-yellow-400' : 'text-gray-700'}
              >
                ★
              </span>
            ))}
          </div>

          <div className="text-4xl font-black text-white">{finalAccuracy}%</div>

          <p className="text-gray-500 text-sm mt-1">
            {correctAnswers} correct out of {attempts}
          </p>
        </div>

        <button
          type="button"
          onClick={restart}
          className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Practise Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Coins className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Money Lab</h3>

              <p className="text-gray-500 text-xs">
                Mathematics Academy · Level {currentLevel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              speak(
                `Count the coins and choose the total amount of money. ${current.hint}`
              )
            }
            aria-label="Read activity instructions"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-5 h-5 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Question {Math.min(attempts + 1, SESSION_SIZE)} of {SESSION_SIZE}
          </span>

          <span>{accuracy}% accuracy</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${sessionProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Objective */}
      <div className="mb-5">
        <p className="text-gray-400 text-sm">Count the coins carefully.</p>

        <p className="text-white font-semibold">How much money is this?</p>
      </div>

      {/* Coins */}
      <motion.div
        layout
        className="min-h-[150px] flex flex-wrap justify-center items-center gap-3 p-5 rounded-2xl bg-gray-950/60 border border-gray-800 mb-5"
      >
        {current.coins.map((value, index) => {
          const coin = COINS[value];

          return (
            <motion.div
              key={`${value}-${index}`}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`w-16 h-16 rounded-full border-4 ${coin.className} shadow-lg flex flex-col items-center justify-center`}
            >
              <span className="text-lg font-black">{coin.symbol}</span>

              <span className="text-[10px] font-bold">CENTS</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Counting strategy */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {current.coins.map((value, index) => (
          <React.Fragment key={`${value}-${index}`}>
            <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold">
              {value}¢
            </span>

            {index < current.coins.length - 1 && (
              <span className="text-gray-600 text-xs flex items-center">+</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === current.answer;

          let buttonClass =
            'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white';

          if (isSelected && isCorrect) {
            buttonClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
          } else if (isSelected && !isCorrect) {
            buttonClass = 'bg-red-500/20 border-red-400 text-red-300';
          }

          return (
            <motion.button
              key={option}
              type="button"
              whileHover={selected === null ? { scale: 1.04 } : undefined}
              whileTap={selected === null ? { scale: 0.97 } : undefined}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`h-16 rounded-xl border-2 text-xl font-black transition-colors ${buttonClass}`}
            >
              {option}¢
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {selected !== null && selected === current.answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-5 h-5" />
              Correct!
            </div>

            <p className="text-gray-400 text-sm mt-1">
              {current.explanation}
            </p>
          </motion.div>
        )}

        {selected !== null && selected !== current.answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <p className="text-red-300 font-bold">
              Not quite. Have another look.
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Try counting the coins from the largest value.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint / Explanation */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowHint((value) => !value)}
          className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>

        {selected !== null && (
          <button
            type="button"
            onClick={() => setShowExplanation((value) => !value)}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold"
          >
            <ArrowRight className="w-4 h-4" />
            Explanation
          </button>
        )}
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
        >
          <p className="text-yellow-300 text-sm">💡 {current.hint}</p>
        </motion.div>
      )}

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
        >
          <p className="text-blue-300 text-sm">{current.explanation}</p>
        </motion.div>
      )}

      {/* Learning principle */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-[11px] uppercase tracking-wider text-gray-600 font-bold mb-1">
          Montessori → Cambridge Progression
        </p>

        <p className="text-xs text-gray-500">
          Concrete coins → quantity recognition → addition → mathematical
          reasoning
        </p>
      </div>
    </div>
  );
};