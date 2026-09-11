import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  CheckCircle,
  Lightbulb,
  Volume2,
  RotateCcw,
  Trophy,
  ArrowRight,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type Operation = 'add' | 'subtract';

interface Challenge {
  start: number;
  operation: Operation;
  amount: number;
  answer: number;
  hint: string;
  explanation: string;
}

const CHALLENGES_BY_LEVEL: Record<number, Challenge[]> = {
  1: [
    { start: 3, operation: 'add', amount: 1, answer: 4,
      hint: 'Move one step forward from 3.', explanation: '3 + 1 = 4.' },
    { start: 5, operation: 'subtract', amount: 1, answer: 4,
      hint: 'Move one step backward from 5.', explanation: '5 − 1 = 4.' },
    { start: 2, operation: 'add', amount: 2, answer: 4,
      hint: 'Count two steps forward: 3, 4.', explanation: '2 + 2 = 4.' },
    { start: 6, operation: 'subtract', amount: 2, answer: 4,
      hint: 'Count two steps backward: 5, 4.', explanation: '6 − 2 = 4.' },
    { start: 4, operation: 'add', amount: 3, answer: 7,
      hint: 'Count three more: 5, 6, 7.', explanation: '4 + 3 = 7.' },
  ],

  2: [
    { start: 7, operation: 'add', amount: 2, answer: 9,
      hint: 'Count two numbers after 7.', explanation: '7 + 2 = 9.' },
    { start: 10, operation: 'subtract', amount: 3, answer: 7,
      hint: 'Count three numbers backwards.', explanation: '10 − 3 = 7.' },
    { start: 8, operation: 'add', amount: 5, answer: 13,
      hint: 'Add five by counting forward.', explanation: '8 + 5 = 13.' },
    { start: 15, operation: 'subtract', amount: 5, answer: 10,
      hint: 'Taking away five from fifteen leaves ten.', explanation: '15 − 5 = 10.' },
    { start: 9, operation: 'add', amount: 6, answer: 15,
      hint: 'Think about making 10 first.', explanation: '9 + 6 = 15.' },
  ],

  3: [
    { start: 12, operation: 'add', amount: 5, answer: 17,
      hint: 'Add five to twelve.', explanation: '12 + 5 = 17.' },
    { start: 18, operation: 'subtract', amount: 7, answer: 11,
      hint: 'Take away seven from eighteen.', explanation: '18 − 7 = 11.' },
    { start: 14, operation: 'add', amount: 8, answer: 22,
      hint: 'Add six to reach 20, then two more.', explanation: '14 + 8 = 22.' },
    { start: 25, operation: 'subtract', amount: 9, answer: 16,
      hint: 'Take away ten, then give one back.', explanation: '25 − 9 = 16.' },
    { start: 17, operation: 'add', amount: 6, answer: 23,
      hint: 'Think 17 + 3 = 20, then add 3.', explanation: '17 + 6 = 23.' },
  ],

  4: [
    { start: 24, operation: 'add', amount: 8, answer: 32,
      hint: 'Make the next ten first.', explanation: '24 + 8 = 32.' },
    { start: 35, operation: 'subtract', amount: 7, answer: 28,
      hint: 'Take away five, then two more.', explanation: '35 − 7 = 28.' },
    { start: 27, operation: 'add', amount: 15, answer: 42,
      hint: 'Add ten, then five.', explanation: '27 + 15 = 42.' },
    { start: 50, operation: 'subtract', amount: 18, answer: 32,
      hint: 'Take away 20, then add 2 back.', explanation: '50 − 18 = 32.' },
    { start: 36, operation: 'add', amount: 19, answer: 55,
      hint: 'Add 20, then subtract 1.', explanation: '36 + 19 = 55.' },
  ],

  5: [
    { start: 48, operation: 'add', amount: 27, answer: 75,
      hint: 'Add tens first, then ones.', explanation: '48 + 27 = 75.' },
    { start: 72, operation: 'subtract', amount: 28, answer: 44,
      hint: 'Subtract 30, then add 2 back.', explanation: '72 − 28 = 44.' },
    { start: 65, operation: 'add', amount: 36, answer: 101,
      hint: 'Add 30, then 6.', explanation: '65 + 36 = 101.' },
    { start: 100, operation: 'subtract', amount: 37, answer: 63,
      hint: 'Subtract 40, then add 3 back.', explanation: '100 − 37 = 63.' },
    { start: 57, operation: 'add', amount: 28, answer: 85,
      hint: 'Think 57 + 30 − 2.', explanation: '57 + 28 = 85.' },
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
  const options = new Set<number>([answer]);
  const offsets = [-2, 2, -5, 5, -10, 10];

  for (const offset of offsets) {
    const candidate = answer + offset;
    if (candidate >= 0) options.add(candidate);
    if (options.size === 3) break;
  }

  while (options.size < 3) options.add(answer + options.size);

  return shuffle(Array.from(options));
};

export const NumberOperations: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const completeActivity = useProgressStore(
    (state) => state.completeActivity
  );

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const currentLevel = profile?.currentLevel ?? 1;

  const challenges = useMemo(() => {
    const level = Math.min(Math.max(currentLevel, 1), 5);
    return shuffle(CHALLENGES_BY_LEVEL[level] ?? CHALLENGES_BY_LEVEL[1]);
  }, [currentLevel]);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [number, setNumber] = useState(challenges[0]?.start ?? 5);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const SESSION_SIZE = 5;

  const current = challenges[challengeIndex % challenges.length];

  const options = useMemo(() => buildOptions(current.answer), [current.answer]);

  const accuracy =
    attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

  const progress = Math.min((attempts / SESSION_SIZE) * 100, 100);
  const isCorrectNumber = number === current.answer;

  // Auto-read the challenge on load
  useEffect(() => {
    if (autoReadEnabled) {
      const opWord = current.operation === 'add' ? 'plus' : 'minus';
      const readOut = `${current.start} ${opWord} ${current.amount}. Find the answer.`;
      const timer = window.setTimeout(() => speak(readOut), 350);
      return () => window.clearTimeout(timer);
    }
  }, [challengeIndex, current, speak, autoReadEnabled]);

  // Read hint when it opens
  useEffect(() => {
    if (showHint && current) speak(current.hint);
  }, [showHint, current, speak]);

  // Announce completion
  useEffect(() => {
    if (!completed) return;

    const finalAccuracy =
      attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    speak(
      finalAccuracy >= 80
        ? `Brilliant work! You scored ${finalAccuracy} percent. You are a number star!`
        : `Well done! You scored ${finalAccuracy} percent. Let's practise number operations again.`,
    );
  }, [completed, attempts, correctAnswers, speak]);

  const finishSession = useCallback(
    (finalCorrect: number, finalAttempts: number) => {
      const finalAccuracy =
        finalAttempts > 0 ? Math.round((finalCorrect / finalAttempts) * 100) : 0;

      completeActivity({
        id: 'maths-number-operations-lab',
        score: finalAccuracy,
        academyId: 'maths',
        domain: 'numeracy',
        skillIds: [
          'number-sense',
          'addition',
          'subtraction',
          'counting-on',
          'counting-back',
          'calculation',
          'mathematical-reasoning',
        ],
      });

      setCompleted(true);
    },
    [completeActivity]
  );

  const add = () => setNumber((prev) => Math.min(prev + 1, 100));
  const subtract = () => setNumber((prev) => Math.max(prev - 1, 0));

  const moveBy = (amount: number) =>
    setNumber((prev) => Math.max(0, Math.min(prev + amount, 100)));

  const handleAnswer = (answer: number) => {
    if (selected !== null || completed) return;

    const nextAttempts = attempts + 1;
    setSelected(answer);
    setAttempts(nextAttempts);

    if (answer === current.answer) {
      if (soundEnabled) playSoundFeedback('correct');

      const nextCorrect = correctAnswers + 1;
      setCorrectAnswers(nextCorrect);

      speak(`Correct! ${current.explanation}`);

      if (nextAttempts >= SESSION_SIZE) {
        setTimeout(() => finishSession(nextCorrect, nextAttempts), 2000);
        return;
      }

      setTimeout(() => {
        const nextIndex = (challengeIndex + 1) % challenges.length;
        setChallengeIndex(nextIndex);
        setNumber(challenges[nextIndex].start);
        setSelected(null);
        setShowHint(false);
        setShowExplanation(false);
      }, 2000);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');

      speak('Not quite. Try using the number line.');
      setShowExplanation(true);
    }
  };

  const resetExploration = () => setNumber(current.start);

  const restart = () => {
    const first = challenges[0];
    setChallengeIndex(0);
    setNumber(first.start);
    setSelected(null);
    setCorrectAnswers(0);
    setAttempts(0);
    setShowHint(false);
    setShowExplanation(false);
    setCompleted(false);

    speak("Let's practise number operations again!");
  };

  if (completed) {
    const finalAccuracy =
      attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    const stars =
      finalAccuracy >= 90 ? 3 : finalAccuracy >= 70 ? 2 : finalAccuracy >= 50 ? 1 : 0;

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
          Number Operations Complete
        </h3>

        <p className="text-gray-400 mt-2">
          You practised addition, subtraction and number sense.
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="text-3xl tracking-wide">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className={index < stars ? 'text-yellow-400' : 'text-gray-700'}
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <span className="text-xl">🧮</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                Number Operations Lab
              </h3>
              <p className="text-xs text-gray-500">
                Mathematics Academy · Level {currentLevel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const opWord = current.operation === 'add' ? 'plus' : 'minus';
              speak(`${current.start} ${opWord} ${current.amount}. Find the answer.`);
            }}
            aria-label="Read activity"
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
              className={`w-5 h-5 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
            />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Challenge {Math.min(attempts + 1, SESSION_SIZE)} of {SESSION_SIZE}
          </span>
          <span>{accuracy}% accuracy</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Operation prompt */}
      <div className="text-center mb-5">
        <p className="text-sm text-gray-500 mb-2">
          Change the number, then solve the challenge.
        </p>

        <div className="flex items-center justify-center gap-3 text-4xl font-black">
          <span className="text-white">{current.start}</span>
          <span className={current.operation === 'add' ? 'text-emerald-400' : 'text-red-400'}>
            {current.operation === 'add' ? '+' : '−'}
          </span>
          <span className="text-white">{current.amount}</span>
          <span className="text-gray-500">=</span>
          <span className="text-indigo-400">?</span>
        </div>
      </div>

      {/* Interactive number explorer */}
      <div className="p-5 rounded-2xl bg-gray-950/70 border border-gray-800 mb-5">
        <p className="text-center text-xs uppercase tracking-wider text-gray-600 font-bold mb-3">
          Number Explorer
        </p>

        <motion.div
          key={number}
          initial={{ scale: 0.92, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl font-black text-indigo-400 text-center mb-5"
        >
          {number}
        </motion.div>

        <div className="flex justify-center gap-5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={subtract}
            disabled={number <= 0}
            aria-label="Subtract one"
            className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-3xl font-black hover:bg-red-500/25 disabled:opacity-30"
          >
            −
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={add}
            disabled={number >= 100}
            aria-label="Add one"
            className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-3xl font-black hover:bg-emerald-500/25 disabled:opacity-30"
          >
            +
          </motion.button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() =>
              moveBy(current.operation === 'add' ? current.amount : -current.amount)
            }
            className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 font-semibold"
          >
            {current.operation === 'add'
              ? `Add ${current.amount}`
              : `Take away ${current.amount}`}
          </button>

          <button
            type="button"
            onClick={resetExploration}
            className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Number line */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase tracking-wider text-gray-600 font-bold">
            Number Line
          </span>
          <span className="text-xs text-gray-500">
            {current.operation === 'add' ? 'Move forward' : 'Move backward'}
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-end min-w-max justify-center gap-1">
            {Array.from(
              {
                length: Math.min(
                  21,
                  Math.max(current.start, current.answer, 10) + 1
                ),
              },
              (_, index) => index
            ).map((value) => {
              const active =
                value === number || value === current.start || value === current.answer;

              return (
                <div
                  key={value}
                  className={`w-7 flex flex-col items-center ${
                    active ? 'text-indigo-300' : 'text-gray-700'
                  }`}
                >
                  <div
                    className={`w-px h-3 ${
                      active ? 'bg-indigo-400' : 'bg-gray-700'
                    }`}
                  />
                  <span className="text-[9px]">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const correct = option === current.answer;

          let className =
            'bg-gray-800 border-gray-700 text-white hover:bg-gray-700';

          if (isSelected && correct)
            className = 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
          else if (isSelected && !correct)
            className = 'bg-red-500/20 border-red-400 text-red-300';

          return (
            <motion.button
              key={option}
              type="button"
              disabled={selected !== null}
              whileHover={selected === null ? { scale: 1.04 } : undefined}
              whileTap={selected === null ? { scale: 0.97 } : undefined}
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
        {selected === current.answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-5 h-5" />
              Correct!
            </div>
            <p className="text-sm text-gray-400 mt-1">{current.explanation}</p>
          </motion.div>
        )}

        {selected !== null && selected !== current.answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <p className="text-red-300 font-bold">
              Not quite. Let's use the number line.
            </p>
            <p className="text-sm text-gray-400 mt-1">{current.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning tools */}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setShowHint((value) => !value)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? 'Hide Hint' : 'Hint'}
        </button>

        <button
          type="button"
          onClick={() => setShowExplanation((value) => !value)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold"
        >
          <ArrowRight className="w-4 h-4" />
          Method
        </button>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
        >
          <p className="text-yellow-300 text-sm">💡 {current.hint}</p>
        </motion.div>
      )}

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
        >
          <p className="text-blue-300 text-sm">{current.explanation}</p>
        </motion.div>
      )}

      {/* Pedagogy */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-[11px] uppercase tracking-wider text-gray-600 font-bold mb-1">
          Montessori → Cambridge Progression
        </p>
        <p className="text-xs text-gray-500">
          Concrete manipulation → number line → operation → calculation → reasoning
        </p>
      </div>
    </div>
  );
};