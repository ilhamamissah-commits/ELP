import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

interface MoneyQuestion {
  question: string;
  options: string[];
  answer: number;
  emoji: string;
  explanation: string;
}

const QUESTIONS: MoneyQuestion[] = [
  {
    question: 'Which is a NEED?',
    options: ['Water', 'Toy', 'Candy'],
    answer: 0,
    emoji: '💧',
    explanation:
      'Water is a need because our bodies need it to stay healthy.',
  },
  {
    question: 'Which is a WANT?',
    options: ['Food', 'Video Game', 'Clothes'],
    answer: 1,
    emoji: '🎮',
    explanation:
      'A video game can be fun, but we do not need it to stay healthy and safe.',
  },
  {
    question: 'What is a smart thing to do with some of your money?',
    options: ['Spend it all', 'Save some', 'Throw it away'],
    answer: 1,
    emoji: '🐷',
    explanation:
      'Saving some money can help you reach a future goal.',
  },
  {
    question: 'What is a coin used for?',
    options: ['Buying things', 'Coloring', 'Playing music'],
    answer: 0,
    emoji: '🪙',
    explanation:
      'Coins are a form of money that can be used to pay for things.',
  },
  {
    question: 'A budget helps us...',
    options: ['Waste money', 'Plan our money', 'Lose money'],
    answer: 1,
    emoji: '📊',
    explanation:
      'A budget is a plan for how we will use our money.',
  },
  {
    question: 'One way people can earn money is by...',
    options: ['Working', 'Sleeping', 'Doing nothing'],
    answer: 0,
    emoji: '💼',
    explanation:
      'People can earn money by doing work or providing useful goods and services.',
  },
  {
    question: 'What is a savings goal?',
    options: [
      'Money we lose',
      'Something we are saving money to get or do',
      'Money we spend immediately',
    ],
    answer: 1,
    emoji: '🎯',
    explanation:
      'A savings goal is something we plan to save money for.',
  },
  {
    question: 'Who can help a child learn about money?',
    options: ['A trusted adult', 'A monkey', 'Nobody'],
    answer: 0,
    emoji: '👨‍👩‍👧‍👦',
    explanation:
      'Parents, guardians, teachers and other trusted adults can help children learn about money.',
  },
];

export const MoneyGame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const current = QUESTIONS[index];

  const correctAnswers = Math.floor(score / 10);

  /* Auto-read the question when it changes */
  useEffect(() => {
    if (!autoReadEnabled || completed) return;

    const timer = window.setTimeout(() => {
      speak(current.question);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [index, current, completed, speak, autoReadEnabled]);

  /* Announce completion */
  useEffect(() => {
    if (!completed) return;

    const percentage = Math.round(
      (correctAnswers / QUESTIONS.length) * 100,
    );

    speak(
      percentage >= 80
        ? `Activity complete! You scored ${percentage} percent. Excellent money thinking!`
        : percentage >= 60
          ? `Activity complete! You scored ${percentage} percent. Good work! Keep practising.`
          : `Activity complete! You scored ${percentage} percent. Keep learning. Every try helps you grow!`,
    );
  }, [completed, correctAnswers, speak]);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null || completed) return;

    setSelected(optionIndex);

    if (optionIndex === current.answer) {
      if (soundEnabled) playSoundFeedback('correct');
      setScore((currentScore) => currentScore + 10);
      speak(`Correct! ${current.explanation}`);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(`Good try! ${current.explanation}`);
    }
  };

  const next = () => {
    if (selected === null) return;

    if (index === QUESTIONS.length - 1) {
      setCompleted(true);
      return;
    }

    setSelected(null);
    setIndex((currentIndex) => currentIndex + 1);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setCompleted(false);

    speak("Let's practise money thinking again!");
  };

  const progress = completed
    ? 100
    : ((index + 1) / QUESTIONS.length) * 100;

  /* COMPLETION SCREEN */
  if (completed) {
    const percentage = Math.round(
      (correctAnswers / QUESTIONS.length) * 100,
    );

    return (
      <div className="w-full max-w-xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-app-card border border-app-border rounded-3xl p-8 shadow-xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.15 }}
            className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5"
          >
            <Trophy className="w-10 h-10 text-amber-400" />
          </motion.div>

          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Activity complete
          </p>

          <h2 className="text-3xl font-bold text-white">Money Explorer</h2>

          <p className="text-gray-400 mt-2">
            Great work learning about money and saving!
          </p>

          <div className="grid grid-cols-2 gap-3 mt-7">
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
              <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">XP earned</p>
              <p className="text-2xl font-bold text-amber-400">{score}</p>
            </div>

            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
              <Target className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Accuracy</p>
              <p className="text-2xl font-bold text-green-400">
                {percentage}%
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
            <p className="text-green-400 font-semibold">
              {percentage >= 80
                ? '🌟 Excellent money thinking!'
                : percentage >= 60
                  ? '👏 Good work! Keep practising.'
                  : '🌱 Keep learning. Every try helps you grow!'}
            </p>
          </div>

          <button
            onClick={restart}
            className="w-full mt-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Money Explorer</h1>
            <p className="text-xs text-gray-500">Money &amp; Saving</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">XP</p>
            <p className="font-bold text-amber-400">{score}</p>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-4 h-4 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Question {index + 1} of {QUESTIONS.length}
          </span>

          <span>{correctAnswers} correct</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* QUESTION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-app-card border border-app-border rounded-3xl p-6 md:p-8 shadow-xl"
        >
          <div className="text-center mb-7">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-5"
            >
              {current.emoji}
            </motion.div>

            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Think carefully
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              {current.question}
            </h2>
          </div>

          {/* OPTIONS */}
          <div className="space-y-3">
            {current.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrect = optionIndex === current.answer;

              let classes =
                'bg-gray-900 border-gray-800 text-white hover:border-gray-600';

              if (selected !== null && isCorrect) {
                classes =
                  'bg-green-500/10 border-green-500 text-green-400';
              }

              if (selected !== null && isSelected && !isCorrect) {
                classes = 'bg-red-500/10 border-red-500 text-red-400';
              }

              return (
                <motion.button
                  key={option}
                  whileHover={
                    selected === null ? { scale: 1.015 } : undefined
                  }
                  whileTap={
                    selected === null ? { scale: 0.985 } : undefined
                  }
                  disabled={selected !== null}
                  onClick={() => handleSelect(optionIndex)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all ${classes}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-sm shrink-0">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>

                    <span className="flex-1">{option}</span>

                    {selected !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    )}

                    {selected !== null && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 shrink-0" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* FEEDBACK */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                className={`rounded-2xl p-4 border ${
                  selected === current.answer
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-amber-500/10 border-amber-500/20'
                }`}
              >
                <div className="flex gap-3">
                  {selected === current.answer ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  ) : (
                    <Target className="w-5 h-5 text-amber-400 shrink-0" />
                  )}

                  <div>
                    <p
                      className={`font-bold ${
                        selected === current.answer
                          ? 'text-green-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {selected === current.answer
                        ? 'Correct!'
                        : 'Good try!'}
                    </p>

                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      {current.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NEXT */}
          {selected !== null && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={next}
              className="w-full mt-5 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {index === QUESTIONS.length - 1
                ? 'Finish Activity'
                : 'Next Question'}

              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* LEARNING REMINDER */}
      <div className="mt-5 text-center">
        <p className="text-xs text-gray-600">
          Think • Choose • Learn • Try again
        </p>
      </div>
    </div>
  );
};

export default MoneyGame;