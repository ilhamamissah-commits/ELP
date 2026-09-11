import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type SubtractionProblem = {
  a: number;
  b: number;
  emoji: string;
  strategy: string;
  explanation: string;
};

const SESSION_LENGTH = 6;

const LEVEL_RANGES: Record<number, { minA: number; maxA: number }> = {
  1: { minA: 3, maxA: 10 },
  2: { minA: 5, maxA: 20 },
  3: { minA: 10, maxA: 50 },
  4: { minA: 20, maxA: 100 },
  5: { minA: 50, maxA: 500 },
};

const OBJECTS = ['🍎', '⭐', '🍓', '🐟', '🧸', '🌸', '🚗', '🦋'];

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildOptions = (answer: number, min: number, max: number): number[] => {
  const candidates = new Set<number>();
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4]);

  offsets.forEach((offset) => {
    const value = answer + offset;
    if (value >= min && value <= max && value !== answer) {
      candidates.add(value);
    }
  });

  let distance = 5;
  while (candidates.size < 2) {
    const lower = answer - distance;
    const upper = answer + distance;
    if (lower >= min && lower !== answer) candidates.add(lower);
    if (upper <= max && upper !== answer) candidates.add(upper);
    distance += 1;
    if (distance > 50) break;
  }

  return shuffle([answer, ...Array.from(candidates).slice(0, 2)]);
};

const createProblem = (learnerLevel: number): SubtractionProblem => {
  const range = LEVEL_RANGES[learnerLevel] ?? LEVEL_RANGES[1];
  const a =
    Math.floor(Math.random() * (range.maxA - range.minA + 1)) + range.minA;
  const maxB = Math.max(1, Math.floor(a * 0.65));
  const b = Math.floor(Math.random() * maxB) + 1;
  const answer = a - b;

  let strategy = 'Count back';
  let explanation = `${a} take away ${b} equals ${answer}.`;

  if (learnerLevel >= 3 && b <= 10) {
    strategy = 'Count back or use a number line';
    explanation = `Start at ${a} and count back ${b} steps. You land on ${answer}.`;
  }

  if (learnerLevel >= 4) {
    strategy = 'Find the difference';
    explanation = `The difference between ${a} and ${b} is ${answer}.`;
  }

  return {
    a,
    b,
    emoji: OBJECTS[Math.floor(Math.random() * OBJECTS.length)],
    strategy,
    explanation,
  };
};

export const SubtractionGame: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const completeActivity = useProgressStore((state) => state.completeActivity);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const [problem, setProblem] = useState<SubtractionProblem>(() =>
    createProblem(currentLevel)
  );

  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showNumberLine, setShowNumberLine] = useState(false);
  const [completed, setCompleted] = useState(false);

  const range = LEVEL_RANGES[currentLevel] ?? LEVEL_RANGES[1];
  const correctAnswer = problem.a - problem.b;

  useEffect(() => {
    setProblem(createProblem(currentLevel));
    setQuestionNumber(1);
    setCorrectAnswers(0);
    setSelected(null);
    setShowHint(false);
    setShowExplanation(false);
    setShowNumberLine(false);
    setCompleted(false);
  }, [currentLevel]);

  const options = useMemo(
    () => buildOptions(correctAnswer, 0, range.maxA),
    [correctAnswer, range.maxA]
  );

  // Auto-read question on change
  useEffect(() => {
    if (autoReadEnabled) {
      const readOut = `${problem.a} minus ${problem.b} equals what?`;
      const timer = window.setTimeout(() => speak(readOut), 350);
      return () => window.clearTimeout(timer);
    }
  }, [problem.a, problem.b, speak, autoReadEnabled]);

  // Read hint when it opens
  useEffect(() => {
    if (showHint && !selected) {
      speak(
        `Start with ${problem.a}, then count backwards ${problem.b} steps.`
      );
    }
  }, [showHint, selected, problem.a, problem.b, speak]);

  // Announce completion
  useEffect(() => {
    if (!completed) return;

    const accuracy = Math.round((correctAnswers / SESSION_LENGTH) * 100);

    speak(
      accuracy >= 80
        ? `Brilliant work! You scored ${accuracy} percent. Your subtraction skills are strong!`
        : `Well done! You scored ${accuracy} percent. Let's keep practising subtraction.`,
    );
  }, [completed, correctAnswers, speak]);

  const handleAnswer = (answer: number) => {
    if (selected !== null || completed) return;

    const correct = answer === correctAnswer;
    setSelected(answer);

    if (correct) {
      if (soundEnabled) playSoundFeedback('correct');
      setCorrectAnswers((previous) => previous + 1);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
    }

    speak(correct ? `Correct! ${problem.explanation}` : `Not quite. ${problem.explanation}`);

    setShowExplanation(true);

    window.setTimeout(() => {
      if (questionNumber >= SESSION_LENGTH) {
        const finalCorrect = correctAnswers + (correct ? 1 : 0);
        const finalScore = Math.round((finalCorrect / SESSION_LENGTH) * 100);

        completeActivity({
          id: 'maths-subtraction-lab',
          score: finalScore,
          academyId: 'maths',
          domain: 'numeracy',
          skillIds: [
            'subtraction',
            'number-sense',
            'counting-back',
            'take-away',
            'difference',
            'calculation',
            'mathematical-reasoning',
          ],
        });

        setCompleted(true);
        return;
      }

      setProblem(createProblem(currentLevel));
      setQuestionNumber((previous) => previous + 1);
      setSelected(null);
      setShowHint(false);
      setShowExplanation(false);
      setShowNumberLine(false);
    }, 2400);
  };

  const restart = () => {
    setProblem(createProblem(currentLevel));
    setQuestionNumber(1);
    setCorrectAnswers(0);
    setSelected(null);
    setShowHint(false);
    setShowExplanation(false);
    setShowNumberLine(false);
    setCompleted(false);

    speak("Let's practise subtraction again!");
  };

  const renderObjects = () => (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto">
      {Array.from({ length: problem.a }).map((_, index) => {
        const removed = index >= problem.a - problem.b;
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: removed ? 0.25 : 1, scale: 1 }}
            transition={{ delay: Math.min(index * 0.025, 0.4) }}
            className={`text-3xl sm:text-4xl select-none ${
              removed ? 'line-through grayscale' : ''
            }`}
          >
            {problem.emoji}
          </motion.span>
        );
      })}
    </div>
  );

  const renderNumberLine = () => {
    const start = Math.max(0, problem.a - 12);
    const end = Math.min(
      Math.max(problem.a + 2, correctAnswer + 2),
      problem.a + 12
    );
    const numbers = Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-5 rounded-2xl border border-app-border bg-gray-900/60 p-4 overflow-hidden"
      >
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-4">
          Number line
        </div>
        <div className="overflow-x-auto">
          <div
            className="flex items-end min-w-max mx-auto"
            style={{ width: `${Math.max(numbers.length * 44, 100)}px` }}
          >
            {numbers.map((number) => {
              const isStart = number === problem.a;
              const isAnswer = number === correctAnswer;
              return (
                <div key={number} className="flex-1 min-w-11 text-center">
                  <div
                    className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isAnswer
                        ? 'bg-green-500 text-white'
                        : isStart
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {number}
                  </div>
                  <div className="h-2 border-l border-gray-700 mx-auto mt-1" />
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          Start at <strong className="text-white">{problem.a}</strong> and count
          back <strong className="text-white">{problem.b}</strong> steps.
        </p>
      </motion.div>
    );
  };

  if (completed) {
    const accuracy = Math.round((correctAnswers / SESSION_LENGTH) * 100);
    const strongPerformance = accuracy >= 80;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-app-card p-6 sm:p-8 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-green-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">
          Subtraction Session Complete
        </h3>

        <p className="text-gray-400 mt-2">
          You solved {correctAnswers} of {SESSION_LENGTH} problems correctly.
        </p>

        <div className="my-6 rounded-2xl bg-gray-900/70 border border-app-border p-5">
          <div className="text-4xl font-black text-white">{accuracy}%</div>
          <div className="text-sm text-gray-400 mt-1">Session accuracy</div>
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                strongPerformance
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-amber-500/15 text-amber-400'
              }`}
            >
              {strongPerformance
                ? 'Subtraction skills are developing strongly'
                : 'Keep practising subtraction'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={restart}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 font-bold py-3 hover:bg-gray-100 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Practise Again
        </button>
      </motion.div>
    );
  }

  const progress = ((questionNumber - 1) / SESSION_LENGTH) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 sm:p-7 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">➖</span>
            <h3 className="text-2xl font-bold text-white">Subtraction Lab</h3>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Take away, count back and discover the difference.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="shrink-0 text-right">
            <div className="text-xs uppercase tracking-wider text-gray-500">
              Level
            </div>
            <div className="text-xl font-bold text-white">{currentLevel}</div>
          </div>

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
            Challenge {questionNumber} of {SESSION_LENGTH}
          </span>
          <span>{correctAnswers} correct</span>
        </div>

        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Pedagogy pathway */}
      <div className="flex items-center justify-center gap-2 mb-5 text-xs flex-wrap">
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
          Take away
        </span>
        <ArrowRight className="w-3 h-3 text-gray-600" />
        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">
          Count back
        </span>
        <ArrowRight className="w-3 h-3 text-gray-600" />
        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400">
          Reason
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${questionNumber}-${problem.a}-${problem.b}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {/* Question */}
          <div className="text-center mb-5">
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              {problem.a} − {problem.b} = ?
            </h4>

            <button
              type="button"
              onClick={() => speak(`${problem.a} minus ${problem.b} equals what?`)}
              className="mt-2 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              <Volume2 className="w-4 h-4" />
              Hear question
            </button>
          </div>

          {/* Concrete representation */}
          <div className="rounded-2xl bg-gray-900/60 border border-app-border p-5 mb-5">
            <div className="text-xs uppercase tracking-wider text-gray-500 text-center mb-4">
              Take away {problem.b}
            </div>

            {renderObjects()}

            <div className="flex items-center justify-center gap-3 mt-5 text-lg font-bold">
              <span className="text-white">{problem.a}</span>
              <span className="text-gray-500">−</span>
              <span className="text-red-400">{problem.b}</span>
              <span className="text-gray-500">=</span>
              <span className="text-gray-400">?</span>
            </div>
          </div>

          {/* Number line */}
          {showNumberLine && renderNumberLine()}

          {/* Answer options */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = option === correctAnswer;

              let buttonClass =
                'bg-gray-900 border-gray-700 text-white hover:border-gray-500';

              if (selected !== null && isSelected) {
                buttonClass = isCorrect
                  ? 'bg-green-500/15 border-green-400 text-green-300'
                  : 'bg-red-500/15 border-red-400 text-red-300';
              }

              return (
                <motion.button
                  key={option}
                  type="button"
                  disabled={selected !== null}
                  whileHover={selected === null ? { scale: 1.03 } : undefined}
                  whileTap={selected === null ? { scale: 0.97 } : undefined}
                  onClick={() => handleAnswer(option)}
                  className={`min-h-16 rounded-xl border-2 text-2xl font-bold transition ${buttonClass}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSelected && isCorrect && <CheckCircle className="w-5 h-5" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Learning tools */}
          {selected === null && (
            <div className="mt-5 flex justify-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => setShowHint((previous) => !previous)}
                className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>

              <button
                type="button"
                onClick={() => setShowNumberLine((previous) => !previous)}
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <span className="text-base">↔</span>
                {showNumberLine ? 'Hide number line' : 'Use number line'}
              </button>
            </div>
          )}

          {/* Hint */}
          {showHint && selected === null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-200"
            >
              <div className="font-semibold mb-1">Try this strategy</div>
              <div>
                Start with {problem.a}, then count backwards {problem.b} steps.
              </div>
              <div className="mt-2 text-amber-300/80">
                Strategy: {problem.strategy}
              </div>
            </motion.div>
          )}

          {/* Feedback */}
          {showExplanation && selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-xl p-4 border ${
                selected === correctAnswer
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {selected === correctAnswer ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">Excellent!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">
                      Good try — let's learn from it.
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-300 mt-2">{problem.explanation}</p>

              {selected !== correctAnswer && (
                <p className="text-xs text-gray-500 mt-2">
                  Correct answer: {correctAnswer}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};