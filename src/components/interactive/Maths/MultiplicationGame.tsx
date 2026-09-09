import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Lightbulb,
  Volume2,
  RotateCcw,
  Trophy,
  ArrowRight,
} from 'lucide-react';

import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

interface MultiplicationProblem {
  a: number;
  b: number;
  emoji: string;
  strategy: string;
  hint: string;
  explanation: string;
}

const PROBLEMS_BY_LEVEL: Record<number, MultiplicationProblem[]> = {
  1: [
    {
      a: 2,
      b: 2,
      emoji: '🍎',
      strategy: '2 + 2',
      hint: 'Count two groups of two.',
      explanation: '2 groups of 2 means 2 + 2 = 4.',
    },
    {
      a: 2,
      b: 3,
      emoji: '⭐',
      strategy: '3 + 3',
      hint: 'Make two groups of three.',
      explanation: '2 groups of 3 means 3 + 3 = 6.',
    },
    {
      a: 3,
      b: 2,
      emoji: '🍓',
      strategy: '2 + 2 + 2',
      hint: 'Count three groups of two.',
      explanation: '3 groups of 2 means 2 + 2 + 2 = 6.',
    },
    {
      a: 2,
      b: 4,
      emoji: '🐟',
      strategy: '4 + 4',
      hint: 'Count by fours twice.',
      explanation: '2 groups of 4 means 4 + 4 = 8.',
    },
    {
      a: 3,
      b: 3,
      emoji: '🌟',
      strategy: '3 + 3 + 3',
      hint: 'There are three groups of three.',
      explanation: '3 groups of 3 means 3 + 3 + 3 = 9.',
    },
  ],

  2: [
    {
      a: 2,
      b: 5,
      emoji: '🍓',
      strategy: '5 + 5',
      hint: 'Count by fives.',
      explanation: '2 groups of 5 means 5 + 5 = 10.',
    },
    {
      a: 3,
      b: 4,
      emoji: '⭐',
      strategy: '4 + 4 + 4',
      hint: 'Count by fours three times.',
      explanation: '3 groups of 4 means 4 + 4 + 4 = 12.',
    },
    {
      a: 4,
      b: 2,
      emoji: '🐟',
      strategy: '2 + 2 + 2 + 2',
      hint: 'Count four groups of two.',
      explanation: '4 groups of 2 means 2 + 2 + 2 + 2 = 8.',
    },
    {
      a: 3,
      b: 5,
      emoji: '🍎',
      strategy: '5 + 5 + 5',
      hint: 'Count by fives three times.',
      explanation: '3 groups of 5 means 5 + 5 + 5 = 15.',
    },
    {
      a: 4,
      b: 3,
      emoji: '🌱',
      strategy: '3 + 3 + 3 + 3',
      hint: 'Count four groups of three.',
      explanation: '4 groups of 3 means 3 + 3 + 3 + 3 = 12.',
    },
  ],

  3: [
    {
      a: 3,
      b: 6,
      emoji: '🔵',
      strategy: '6 + 6 + 6',
      hint: 'Count by sixes three times.',
      explanation: '3 × 6 = 6 + 6 + 6 = 18.',
    },
    {
      a: 4,
      b: 5,
      emoji: '🍎',
      strategy: '5 + 5 + 5 + 5',
      hint: 'Four groups of five.',
      explanation: '4 × 5 = 20.',
    },
    {
      a: 5,
      b: 3,
      emoji: '⭐',
      strategy: '3 + 3 + 3 + 3 + 3',
      hint: 'Count five groups of three.',
      explanation: '5 × 3 = 15.',
    },
    {
      a: 4,
      b: 6,
      emoji: '🐟',
      strategy: '6 + 6 + 6 + 6',
      hint: 'Count by sixes.',
      explanation: '4 × 6 = 24.',
    },
    {
      a: 5,
      b: 4,
      emoji: '🍓',
      strategy: '4 + 4 + 4 + 4 + 4',
      hint: 'Count five groups of four.',
      explanation: '5 × 4 = 20.',
    },
  ],

  4: [
    {
      a: 6,
      b: 4,
      emoji: '🔷',
      strategy: '4 × 6',
      hint: 'Think of six groups of four.',
      explanation: '6 × 4 = 24.',
    },
    {
      a: 7,
      b: 3,
      emoji: '🍎',
      strategy: '3 × 7',
      hint: 'Count seven groups of three.',
      explanation: '7 × 3 = 21.',
    },
    {
      a: 6,
      b: 5,
      emoji: '⭐',
      strategy: '5 × 6',
      hint: 'Count by fives six times.',
      explanation: '6 × 5 = 30.',
    },
    {
      a: 8,
      b: 3,
      emoji: '🐟',
      strategy: '3 × 8',
      hint: 'Eight groups of three.',
      explanation: '8 × 3 = 24.',
    },
    {
      a: 7,
      b: 4,
      emoji: '🍓',
      strategy: '4 × 7',
      hint: 'Think 7 + 7 + 7 + 7.',
      explanation: '7 × 4 = 28.',
    },
  ],

  5: [
    {
      a: 8,
      b: 6,
      emoji: '🔵',
      strategy: '6 × 8',
      hint: 'Break it into smaller groups if needed.',
      explanation: '8 × 6 = 48.',
    },
    {
      a: 9,
      b: 4,
      emoji: '🍎',
      strategy: '4 × 9',
      hint: 'Think 10 × 4 minus 4.',
      explanation: '9 × 4 = 36.',
    },
    {
      a: 7,
      b: 8,
      emoji: '⭐',
      strategy: '8 × 7',
      hint: 'Use a multiplication fact you already know.',
      explanation: '7 × 8 = 56.',
    },
    {
      a: 9,
      b: 5,
      emoji: '🍓',
      strategy: '5 × 9',
      hint: 'Count by fives nine times.',
      explanation: '9 × 5 = 45.',
    },
    {
      a: 8,
      b: 9,
      emoji: '🐟',
      strategy: '9 × 8',
      hint: 'Think 10 × 8 minus 8.',
      explanation: '8 × 9 = 72.',
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

  const offsets = [
    -2,
    2,
    -3,
    3,
    -5,
    5,
    -10,
    10,
  ];

  for (const offset of offsets) {
    const value = answer + offset;

    if (value > 0) {
      candidates.add(value);
    }

    if (candidates.size === 3) break;
  }

  while (candidates.size < 3) {
    candidates.add(answer + candidates.size * 2);
  }

  return shuffle(Array.from(candidates));
};

const speak = (text: string) => {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1.05;

  window.speechSynthesis.speak(utterance);
};

export const MultiplicationGame: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const completeActivity = useProgressStore(
    (state) => state.completeActivity
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const problems = useMemo(() => {
    const level = Math.min(Math.max(currentLevel, 1), 5);

    return shuffle(
      PROBLEMS_BY_LEVEL[level] ?? PROBLEMS_BY_LEVEL[1]
    );
  }, [currentLevel]);

  const [problemIndex, setProblemIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showRepeatedAddition, setShowRepeatedAddition] =
    useState(false);
  const [completed, setCompleted] = useState(false);

  const SESSION_SIZE = 5;

  const current = problems[problemIndex % problems.length];

  const correctAnswer = current.a * current.b;

  const options = useMemo(
    () => buildOptions(correctAnswer),
    [correctAnswer]
  );

  const accuracy =
    attempts > 0
      ? Math.round((correctAnswers / attempts) * 100)
      : 0;

  const progress = Math.min(
    (attempts / SESSION_SIZE) * 100,
    100
  );

  const finishSession = useCallback(
    (finalCorrect: number, finalAttempts: number) => {
      const finalAccuracy =
        finalAttempts > 0
          ? Math.round((finalCorrect / finalAttempts) * 100)
          : 0;

      completeActivity({
        id: 'maths-multiplication-lab',
        score: finalAccuracy,
        academyId: 'maths',
        domain: 'numeracy',
        skillIds: [
          'multiplication',
          'equal-groups',
          'repeated-addition',
          'multiplication-facts',
          'calculation',
          'number-sense',
          'mathematical-reasoning',
        ],
      });

      setCompleted(true);
    },
    [completeActivity]
  );

  const handleAnswer = (answer: number) => {
    if (selected !== null || completed) return;

    const nextAttempts = attempts + 1;

    setSelected(answer);
    setAttempts(nextAttempts);

    if (answer === correctAnswer) {
      const nextCorrect = correctAnswers + 1;

      setCorrectAnswers(nextCorrect);

      speak(
        `Correct! ${current.a} groups of ${current.b} equals ${correctAnswer}.`
      );

      if (nextAttempts >= SESSION_SIZE) {
        setTimeout(() => {
          finishSession(nextCorrect, nextAttempts);
        }, 1200);

        return;
      }

      setTimeout(() => {
        setProblemIndex((value) => value + 1);
        setSelected(null);
        setShowHint(false);
        setShowExplanation(false);
        setShowRepeatedAddition(false);
      }, 1200);
    } else {
      speak(
        `Not quite. ${current.a} groups of ${current.b}. Try again.`
      );

      setShowExplanation(true);
    }
  };

  const restart = () => {
    setProblemIndex(0);
    setSelected(null);
    setCorrectAnswers(0);
    setAttempts(0);
    setShowHint(false);
    setShowExplanation(false);
    setShowRepeatedAddition(false);
    setCompleted(false);
  };

  useEffect(() => {
    return () => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (completed) {
    const finalAccuracy =
      attempts > 0
        ? Math.round((correctAnswers / attempts) * 100)
        : 0;

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
        className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-2xl font-bold text-white mt-4">
          Multiplication Lab Complete
        </h3>

        <p className="text-gray-400 mt-2">
          You practised building multiplication from equal groups.
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="text-3xl tracking-wide">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < stars
                    ? 'text-yellow-400'
                    : 'text-gray-700'
                }
              >
                ★
              </span>
            ))}
          </div>

          <div className="text-4xl font-black text-white mt-2">
            {finalAccuracy}%
          </div>

          <p className="text-sm text-gray-500 mt-1">
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <span className="text-xl">×</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                Multiplication Lab
              </h3>

              <p className="text-xs text-gray-500">
                Mathematics Academy · Level {currentLevel}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            speak(
              `Look at the equal groups. Work out how many objects there are altogether.`
            )
          }
          aria-label="Read instructions"
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Question {Math.min(attempts + 1, SESSION_SIZE)} of{' '}
            {SESSION_SIZE}
          </span>

          <span>{accuracy}% accuracy</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Concept */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-5">
        <p className="text-blue-300 text-sm font-semibold">
          Multiplication means equal groups.
        </p>

        <p className="text-gray-400 text-xs mt-1">
          {current.a} groups of {current.b}
        </p>
      </div>

      {/* Groups */}
      <div className="flex flex-wrap justify-center gap-3 mb-5">
        {Array.from({ length: current.a }).map((_, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: groupIndex * 0.08,
            }}
            className="min-w-[92px] min-h-[92px] p-3 rounded-2xl bg-gray-950/70 border border-gray-800 flex flex-wrap justify-center items-center gap-1"
          >
            {Array.from({ length: current.b }).map(
              (_, itemIndex) => (
                <motion.span
                  key={itemIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay:
                      groupIndex * 0.08 +
                      itemIndex * 0.04,
                  }}
                  className="text-2xl"
                >
                  {current.emoji}
                </motion.span>
              )
            )}
          </motion.div>
        ))}
      </div>

      {/* Multiplication sentence */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <span className="text-3xl font-black text-white">
          {current.a}
        </span>

        <span className="text-2xl text-gray-500">×</span>

        <span className="text-3xl font-black text-white">
          {current.b}
        </span>

        <span className="text-2xl text-gray-500">=</span>

        <span className="text-3xl font-black text-emerald-400">
          ?
        </span>
      </div>

      {/* Repeated addition */}
      <button
        type="button"
        onClick={() =>
          setShowRepeatedAddition((value) => !value)
        }
        className="w-full mb-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold"
      >
        <ArrowRight className="w-4 h-4" />
        {showRepeatedAddition
          ? 'Hide repeated addition'
          : 'Show repeated addition'}
      </button>

      <AnimatePresence>
        {showRepeatedAddition && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 p-4 rounded-xl bg-gray-900 border border-gray-800 text-center"
          >
            <p className="text-xs uppercase tracking-wider text-gray-600 font-bold mb-2">
              Repeated Addition
            </p>

            <p className="text-xl font-bold text-white">
              {Array.from({ length: current.a })
                .map(() => current.b)
                .join(' + ')}
              {' = '}
              {correctAnswer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answers */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === correctAnswer;

          let className =
            'bg-gray-800 border-gray-700 text-white hover:bg-gray-700';

          if (isSelected && isCorrect) {
            className =
              'bg-emerald-500/20 border-emerald-400 text-emerald-300';
          } else if (isSelected && !isCorrect) {
            className =
              'bg-red-500/20 border-red-400 text-red-300';
          }

          return (
            <motion.button
              key={option}
              type="button"
              disabled={selected !== null}
              whileHover={
                selected === null ? { scale: 1.04 } : undefined
              }
              whileTap={
                selected === null ? { scale: 0.97 } : undefined
              }
              onClick={() => handleAnswer(option)}
              className={`h-16 rounded-xl border-2 text-2xl font-black transition-colors ${className}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {selected === correctAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-5 h-5" />
              Excellent!
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {current.explanation}
            </p>
          </motion.div>
        )}

        {selected !== null &&
          selected !== correctAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-red-300 font-bold">
                Let's think about the groups again.
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {current.a} groups of {current.b} means adding{' '}
                {current.b} {current.a} times.
              </p>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Learning controls */}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setShowHint((value) => !value);
            speak(current.hint);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? 'Hide Hint' : 'Hint'}
        </button>

        <button
          type="button"
          onClick={() =>
            speak(
              `${current.a} groups of ${current.b}. ${current.explanation}`
            )
          }
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold"
        >
          <Volume2 className="w-4 h-4" />
          Explain
        </button>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
        >
          <p className="text-yellow-300 text-sm">
            💡 {current.hint}
          </p>
        </motion.div>
      )}

      {/* Pedagogy footer */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-[11px] uppercase tracking-wider text-gray-600 font-bold mb-1">
          Learning Progression
        </p>

        <p className="text-xs text-gray-500">
          Equal groups → repeated addition → multiplication sentence
          → mental strategy → reasoning
        </p>
      </div>
    </div>
  );
};