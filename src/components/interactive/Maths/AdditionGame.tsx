import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type AdditionStrategy =
  | 'count-all'
  | 'count-on'
  | 'number-bond'
  | 'mental';

interface Problem {
  id: string;
  a: number;
  b: number;
  emoji: string;
  strategy: AdditionStrategy;
  hint: string;
  explanation: string;
}

const PROBLEMS: Problem[] = [
  { id: 'addition-1', a: 2, b: 3, emoji: '🍎', strategy: 'count-all',
    hint: 'Count all the apples together.',
    explanation: 'There are 2 apples, then 3 more. Altogether there are 5.' },
  { id: 'addition-2', a: 4, b: 2, emoji: '⭐', strategy: 'count-on',
    hint: 'Start at 4 and count on 2 more: 5, 6.',
    explanation: 'Start with 4 and count on 2. You reach 6.' },
  { id: 'addition-3', a: 5, b: 4, emoji: '🍓', strategy: 'count-on',
    hint: 'Start at 5 and count on 4 more.',
    explanation: '5 + 4 makes 9.' },
  { id: 'addition-4', a: 6, b: 3, emoji: '🐟', strategy: 'number-bond',
    hint: 'Think: 6 needs 4 to make 10. So 3 more makes 9.',
    explanation: '6 + 3 = 9. This is one step away from making 10.' },
  { id: 'addition-5', a: 7, b: 2, emoji: '🌸', strategy: 'count-on',
    hint: 'Start at 7 and count two more.',
    explanation: '7 + 2 = 9.' },
  { id: 'addition-6', a: 8, b: 2, emoji: '🐝', strategy: 'number-bond',
    hint: 'What number goes with 8 to make 10?',
    explanation: '8 and 2 make 10. This is an important number bond.' },
  { id: 'addition-7', a: 5, b: 5, emoji: '🟢', strategy: 'number-bond',
    hint: '5 and 5 make a familiar number.',
    explanation: '5 + 5 = 10.' },
  { id: 'addition-8', a: 9, b: 1, emoji: '🦋', strategy: 'number-bond',
    hint: 'What happens when you add 1 to 9?',
    explanation: '9 + 1 = 10.' },
];

const STRATEGIES = [
  { id: 'count-all' as AdditionStrategy, title: 'Count All', icon: '🔢',
    description: 'Count both groups.' },
  { id: 'count-on' as AdditionStrategy, title: 'Count On', icon: '➡️',
    description: 'Start with one number and count forward.' },
  { id: 'number-bond' as AdditionStrategy, title: 'Number Bonds', icon: '🔗',
    description: 'Use numbers that work together.' },
  { id: 'mental' as AdditionStrategy, title: 'Mental Maths', icon: '🧠',
    description: 'Solve without counting every object.' },
];

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const buildOptions = (answer: number): number[] => {
  const candidates = new Set<number>([
    Math.max(0, answer - 2),
    Math.max(0, answer - 1),
    answer,
    answer + 1,
    answer + 2,
  ]);
  return shuffle(Array.from(candidates).slice(0, 3));
};

const getStage = (level: number) => {
  if (level <= 1) return { title: 'Foundation', description: 'Build understanding by combining quantities.' };
  if (level === 2) return { title: 'Developing', description: 'Use counting strategies and number bonds.' };
  if (level === 3) return { title: 'Secure', description: 'Choose efficient strategies to calculate.' };
  if (level === 4) return { title: 'Advanced', description: 'Apply addition to increasingly complex problems.' };
  return { title: 'Mastery', description: 'Reason flexibly and solve unfamiliar problems.' };
};

export const AdditionGame: React.FC = () => {
  const { profiles, currentProfileId } = useProfileStore();
  const { completeActivity } = useProgressStore();

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const profile = profiles[currentProfileId];
  const currentLevel = profile?.currentLevel ?? 1;
  const stage = getStage(currentLevel);

  const [problemIndex, setProblemIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedStrategy, setSelectedStrategy] =
    useState<AdditionStrategy>('count-all');
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionProblems, setSessionProblems] = useState<Problem[]>(() =>
    shuffle(PROBLEMS).slice(0, 5),
  );
  const [options, setOptions] = useState<number[]>([]);

  const current = sessionProblems[problemIndex];
  const correctAnswer = current ? current.a + current.b : 0;

  const accuracy = useMemo(() => {
    if (attempts === 0) return 0;
    return Math.round((correct / attempts) * 100);
  }, [correct, attempts]);

  // Reset + auto-read on new question (only if autoRead is on)
  useEffect(() => {
    if (!current) return;

    setOptions(buildOptions(correctAnswer));
    setSelected(null);
    setShowHint(false);
    setShowExplanation(false);
    setSelectedStrategy(current.strategy);

    if (autoReadEnabled) {
      const readOut = `${current.a} plus ${current.b}. How many altogether?`;
      const timer = window.setTimeout(() => speak(readOut), 350);
      return () => window.clearTimeout(timer);
    }
  }, [problemIndex, current, correctAnswer, speak, autoReadEnabled]);

  // Hint read-aloud
  useEffect(() => {
    if (showHint && current) speak(current.hint);
  }, [showHint, current, speak]);

  // Completion celebration
  useEffect(() => {
    if (!sessionComplete) return;
    const finalMessage =
      accuracy >= 80
        ? `Brilliant work! You scored ${accuracy} percent.`
        : `Great effort! You scored ${accuracy} percent. Let's practise again!`;
    speak(finalMessage);
  }, [sessionComplete, accuracy, speak]);

  const speakProblem = useCallback(() => {
    if (!current) return;
    speak(`${current.a} plus ${current.b}. How many altogether?`);
  }, [current, speak]);

  const handleStrategy = (strategy: AdditionStrategy) => {
    setSelectedStrategy(strategy);
    const chosen = STRATEGIES.find((item) => item.id === strategy);
    if (chosen) speak(`${chosen.title}. ${chosen.description}`);
  };

  const finishActivity = useCallback(
    (finalCorrect: number, finalAttempts: number) => {
      const finalAccuracy =
        finalAttempts > 0
          ? Math.round((finalCorrect / finalAttempts) * 100)
          : 0;

      completeActivity({
        id: 'maths-addition-lab',
        score: finalAccuracy,
        academyId: 'maths',
        domain: 'numeracy',
        skillIds: [
          'addition',
          'counting-on',
          'number-bonds',
          'calculation',
          'mathematical-reasoning',
          'number-sense',
        ],
      });

      setSessionComplete(true);
    },
    [completeActivity],
  );

  const handleAnswer = (answer: number) => {
    if (!current || selected !== null || sessionComplete) return;

    const isCorrect = answer === correctAnswer;
    setSelected(answer);
    setAttempts((v) => v + 1);

    if (isCorrect) {
      const nextCorrect = correct + 1;
      setCorrect(nextCorrect);
      setScore((v) => v + 10);
      setShowExplanation(true);

      if (soundEnabled) playSoundFeedback('correct');

      speak(
        `Yes! ${current.a} plus ${current.b} equals ${correctAnswer}. ${current.explanation}`,
      );

      window.setTimeout(() => {
        const isLast = problemIndex >= sessionProblems.length - 1;
        if (isLast) finishActivity(nextCorrect, attempts + 1);
        else setProblemIndex((v) => v + 1);
      }, 2200);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      setShowHint(true);
      speak('Not quite. Have another try!');
    }
  };

  const resetSession = () => {
    const newProblems = shuffle(PROBLEMS).slice(0, 5);
    setSessionProblems(newProblems);
    setProblemIndex(0);
    setSelected(null);
    setScore(0);
    setCorrect(0);
    setAttempts(0);
    setShowHint(false);
    setShowExplanation(false);
    setSessionComplete(false);
    speak('Here we go again. Let us practise addition!');
  };

  if (sessionComplete) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-app-border bg-app-card p-6 text-center shadow-xl">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Trophy className="mx-auto h-14 w-14 text-amber-300" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-300">
            Mathematics Academy
          </p>
          <h3 className="mt-2 text-3xl font-bold text-white">Addition Complete!</h3>
          <p className="mt-2 text-sm text-gray-400">
            You completed your addition session.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-gray-900 p-4">
              <span className="block text-2xl font-bold text-amber-300">{score}</span>
              <span className="text-[10px] text-gray-500">Points</span>
            </div>
            <div className="rounded-2xl bg-gray-900 p-4">
              <span className="block text-2xl font-bold text-emerald-300">{correct}</span>
              <span className="text-[10px] text-gray-500">Correct</span>
            </div>
            <div className="rounded-2xl bg-gray-900 p-4">
              <span className="block text-2xl font-bold text-indigo-300">{accuracy}%</span>
              <span className="text-[10px] text-gray-500">Accuracy</span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetSession}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-indigo-600 px-6 font-bold text-white transition hover:bg-indigo-500"
          >
            <RotateCcw className="h-4 w-4" />
            Practise Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-app-border bg-app-card p-4 shadow-xl sm:p-6">
      {/* HEADER */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">
            Mathematics Academy
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            ➕ Addition Lab
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Learn to combine quantities and explain your thinking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gray-900 px-4 py-2 text-center">
            <span className="block text-[10px] text-gray-500">Session</span>
            <span className="font-bold text-white">
              {problemIndex + 1}/{sessionProblems.length}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="rounded-xl bg-gray-900 p-2.5 text-gray-300 transition hover:bg-gray-800"
          >
            <Volume2
              className={`h-5 w-5 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
            />
          </button>
        </div>
      </div>

      {/* QUESTION */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/60 p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
            Addition
          </span>
          <button
            type="button"
            onClick={speakProblem}
            className="rounded-lg bg-gray-800 p-2 text-gray-300 transition hover:text-white"
            aria-label="Read question aloud"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-3xl font-bold text-white">
            {current.a} + {current.b} = ?
          </span>
        </div>
      </div>

      {/* STRATEGIES */}
      <div className="mt-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleStrategy(s.id)}
              disabled={selected !== null}
              className={`rounded-2xl border p-3 text-left transition ${
                selectedStrategy === s.id
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <span className="mt-1 block text-xs font-bold text-white">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ANSWERS */}
      <div className="mt-5 flex justify-center gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === correctAnswer;
          let buttonClass = 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700';
          if (isSelected && isCorrect) buttonClass = 'border-green-400 bg-green-500 text-white';
          else if (isSelected && !isCorrect) buttonClass = 'border-red-400 bg-red-500 text-white';

          return (
            <motion.button
              key={option}
              type="button"
              whileHover={selected === null ? { scale: 1.08 } : undefined}
              whileTap={selected === null ? { scale: 0.94 } : undefined}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`h-16 w-16 rounded-2xl border-2 text-2xl font-bold transition disabled:cursor-not-allowed ${buttonClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* HINT */}
      <AnimatePresence>
        {showHint && selected !== correctAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 overflow-hidden"
          >
            <div className="flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
              <Lightbulb className="h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <p className="text-sm font-bold text-amber-200">Try this strategy</p>
                <p className="mt-1 text-xs text-gray-300">{current.hint}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FEEDBACK */}
      <AnimatePresence mode="wait">
        {selected === correctAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 p-4"
          >
            <div className="flex items-center justify-center gap-2 text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">
                Excellent! {current.a} + {current.b} = {correctAnswer}
              </span>
            </div>
            {showExplanation && (
              <p className="mt-2 text-center text-xs text-gray-400">
                {current.explanation}
              </p>
            )}
          </motion.div>
        )}

        {selected !== null && selected !== correctAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-red-300">
              <XCircle className="h-5 w-5" />
              <span className="font-bold">Not quite. Try another answer.</span>
            </div>
            <button
              type="button"
              onClick={() => { setSelected(null); setShowHint(false); }}
              className="mt-3 rounded-xl bg-gray-800 px-4 py-2 text-xs font-bold text-gray-200"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATS */}
      <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-gray-900/60 p-4 text-center">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-gray-500">Points</span>
          <strong className="text-lg text-amber-300">{score}</strong>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-gray-500">Correct</span>
          <strong className="text-lg text-emerald-300">{correct}</strong>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-gray-500">Accuracy</span>
          <strong className="text-lg text-indigo-300">{accuracy}%</strong>
        </div>
      </div>

      <button
        type="button"
        onClick={resetSession}
        className="mx-auto mt-5 flex items-center gap-2 text-xs text-gray-500 transition hover:text-gray-300"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Restart session
      </button>
    </div>
  );
};