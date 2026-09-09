import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Undo2,
  CheckCircle2,
  Sparkles,
  Trophy,
} from 'lucide-react';

type PatternItem = {
  id: number;
  emoji: string;
  name: string;
};

type Difficulty = 'easy' | 'medium' | 'challenge';

const PATTERN_ITEMS: PatternItem[] = [
  { id: 1, emoji: '🔴', name: 'red circle' },
  { id: 2, emoji: '🔵', name: 'blue circle' },
  { id: 3, emoji: '🟡', name: 'yellow circle' },
  { id: 4, emoji: '🟢', name: 'green circle' },
  { id: 5, emoji: '⭐', name: 'star' },
  { id: 6, emoji: '🌸', name: 'flower' },
];

const DIFFICULTY_SETTINGS: Record<
  Difficulty,
  {
    label: string;
    description: string;
    targetLength: number;
  }
> = {
  easy: {
    label: 'Easy',
    description: 'Make a simple AB pattern',
    targetLength: 6,
  },
  medium: {
    label: 'Growing',
    description: 'Make an AAB or ABB pattern',
    targetLength: 8,
  },
  challenge: {
    label: 'Challenge',
    description: 'Make an ABC pattern',
    targetLength: 9,
  },
};

export const PatternMaker: React.FC = () => {
  const [pattern, setPattern] = useState<PatternItem[]>([]);
  const [selectedItem, setSelectedItem] = useState(PATTERN_ITEMS[0]);
  const [difficulty, setDifficulty] =
    useState<Difficulty>('easy');

  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const targetLength =
    DIFFICULTY_SETTINGS[difficulty].targetLength;

  /**
   * Add the selected object to the pattern.
   */
  const addToPattern = () => {
    if (completed) return;

    if (pattern.length >= targetLength) {
      return;
    }

    setPattern((previous) => [...previous, selectedItem]);
    setCompleted(false);
  };

  /**
   * Remove the last item.
   */
  const removeLast = () => {
    if (pattern.length === 0) return;

    setPattern((previous) => previous.slice(0, -1));
    setCompleted(false);
  };

  /**
   * Clear the entire pattern.
   */
  const clearPattern = () => {
    setPattern([]);
    setCompleted(false);
  };

  /**
   * Change difficulty.
   */
  const changeDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    setPattern([]);
    setCompleted(false);
  };

  /**
   * Determine the basic pattern structure.
   *
   * Example:
   * 🔴 🔵 🔴 🔵
   * becomes ABAB.
   */
  const getPatternStructure = useMemo(() => {
    const uniqueItems: number[] = [];

    pattern.forEach((item) => {
      if (!uniqueItems.includes(item.id)) {
        uniqueItems.push(item.id);
      }
    });

    return pattern
      .map((item) => {
        const index = uniqueItems.indexOf(item.id);

        return String.fromCharCode(65 + index);
      })
      .join('');
  }, [pattern]);

  /**
   * Validate whether the child has created
   * the expected repeating structure.
   */
  const isCorrectPattern = useMemo(() => {
    if (pattern.length !== targetLength) {
      return false;
    }

    if (difficulty === 'easy') {
      // ABABAB
      if (pattern.length < 2) return false;

      for (let i = 2; i < pattern.length; i++) {
        if (pattern[i].id !== pattern[i % 2].id) {
          return false;
        }
      }

      return pattern[0].id !== pattern[1].id;
    }

    if (difficulty === 'medium') {
      // Accept AABAAB or ABBA BB-style repeating groups.
      if (pattern.length < 4) return false;

      const firstThree = pattern
        .slice(0, 3)
        .map((item) => item.id);

      for (let i = 3; i < pattern.length; i++) {
        if (
          pattern[i].id !==
          firstThree[i % firstThree.length]
        ) {
          return false;
        }
      }

      return (
        new Set(firstThree).size >= 2
      );
    }

    // ABCABCABC
    if (pattern.length < 3) return false;

    const firstThree = pattern
      .slice(0, 3)
      .map((item) => item.id);

    if (new Set(firstThree).size !== 3) {
      return false;
    }

    for (let i = 3; i < pattern.length; i++) {
      if (
        pattern[i].id !==
        firstThree[i % 3]
      ) {
        return false;
      }
    }

    return true;
  }, [difficulty, pattern, targetLength]);

  /**
   * Check the child's answer.
   */
  const checkPattern = () => {
    setAttempts((previous) => previous + 1);

    if (isCorrectPattern) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  };

  const progressPercentage =
    Math.min(
      (pattern.length / targetLength) * 100,
      100
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="px-5 sm:px-7 pt-6 pb-5">
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                <span className="text-2xl">🔁</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Pattern Maker
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Learn, repeat and discover patterns!
                </p>
              </div>
            </div>

            <button
              onClick={clearPattern}
              aria-label="Reset pattern"
              className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* DIFFICULTY */}
        <div className="px-5 sm:px-7 pb-5">

          <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">
            Choose a level
          </p>

          <div className="grid grid-cols-3 gap-2">

            {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(
              (level) => (
                <motion.button
                  key={level}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => changeDifficulty(level)}
                  className={`rounded-xl px-3 py-3 text-center transition ${
                    difficulty === level
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-bold">
                    {DIFFICULTY_SETTINGS[level].label}
                  </div>

                  <div className="text-[10px] mt-1 opacity-80">
                    {level === 'easy' && 'AB'}
                    {level === 'medium' && 'AAB / ABB'}
                    {level === 'challenge' && 'ABC'}
                  </div>
                </motion.button>
              )
            )}

          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            {DIFFICULTY_SETTINGS[difficulty].description}
          </p>

        </div>

        {/* PROGRESS */}
        <div className="px-5 sm:px-7 pb-5">

          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">
              Your pattern
            </span>

            <span className="text-gray-500">
              {pattern.length}/{targetLength}
            </span>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-indigo-500 rounded-full"
            />
          </div>

        </div>

        {/* OBJECT SELECTION */}
        <div className="px-5 sm:px-7 pb-5">

          <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
            Choose an object
          </p>

          <div className="grid grid-cols-6 gap-2">

            {PATTERN_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedItem(item)}
                aria-label={`Choose ${item.name}`}
                className={`aspect-square rounded-2xl flex items-center justify-center text-3xl border-2 transition ${
                  selectedItem.id === item.id
                    ? 'bg-indigo-500/20 border-indigo-400 shadow-lg'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                }`}
              >
                {item.emoji}
              </motion.button>
            ))}

          </div>

        </div>

        {/* ADD BUTTON */}
        <div className="px-5 sm:px-7 pb-5">

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={addToPattern}
            disabled={pattern.length >= targetLength || completed}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition"
          >
            ➕ Add {selectedItem.emoji}
          </motion.button>

        </div>

        {/* PATTERN AREA */}
        <div className="px-5 sm:px-7">

          <div className="relative min-h-[125px] rounded-2xl bg-gray-950 border-2 border-gray-800 p-4">

            {pattern.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">
                  🧩
                </div>

                <p className="text-gray-500 text-sm">
                  Your pattern will appear here
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center items-center gap-2">

                <AnimatePresence>
                  {pattern.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{
                        opacity: 0,
                        scale: 0.4,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-3xl"
                    >
                      {item.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>

              </div>
            )}

          </div>

          {/* Pattern notation */}
          {pattern.length > 0 && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Pattern: {getPatternStructure}
            </p>
          )}

        </div>

        {/* CONTROLS */}
        <div className="px-5 sm:px-7 pt-5">

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={removeLast}
              disabled={pattern.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold disabled:opacity-30"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>

            <button
              onClick={clearPattern}
              disabled={pattern.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold disabled:opacity-30"
            >
              <RotateCcw className="w-4 h-4" />
              Start Again
            </button>

          </div>

        </div>

        {/* CHECK */}
        <div className="p-5 sm:p-7">

          <motion.button
            whileHover={{
              scale: pattern.length === targetLength ? 1.02 : 1,
            }}
            whileTap={{
              scale: pattern.length === targetLength ? 0.98 : 1,
            }}
            onClick={checkPattern}
            disabled={pattern.length !== targetLength}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-40 transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            Check My Pattern
          </motion.button>

        </div>

        {/* SUCCESS / FEEDBACK */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              className="mx-5 sm:mx-7 mb-7 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center"
            >

              <div className="flex justify-center mb-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-emerald-400" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">
                Fantastic! 🎉
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                You created the correct repeating pattern!
              </p>

              <div className="flex justify-center items-center gap-2 mt-3 text-yellow-400 text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                Great pattern thinking!
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ATTEMPTS */}
        {attempts > 0 && !completed && (
          <div className="px-5 sm:px-7 pb-6">

            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3 text-center">
              <p className="text-sm text-yellow-300 font-semibold">
                Almost there! Look carefully at what repeats. 🔍
              </p>
            </div>

          </div>
        )}

      </div>
    </motion.section>
  );
};