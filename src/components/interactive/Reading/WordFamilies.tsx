import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Lightbulb,
  Trophy,
  Star,
  Sparkles,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';

interface WordFamily {
  family: string;
  words: string[];
  emoji: string;
  level: number;
}

const WORD_FAMILIES: WordFamily[] = [
  // LEVEL 1
  { family: 'at', words: ['cat', 'bat', 'hat', 'mat', 'rat'], emoji: '🐱', level: 1 },
  { family: 'an', words: ['can', 'fan', 'pan', 'ran', 'van'], emoji: '🥫', level: 1 },
  { family: 'ig', words: ['big', 'dig', 'fig', 'pig', 'wig'], emoji: '🐷', level: 1 },
  { family: 'op', words: ['cop', 'hop', 'mop', 'pop', 'top'], emoji: '🧹', level: 1 },
  { family: 'en', words: ['hen', 'men', 'pen', 'ten', 'den'], emoji: '🐔', level: 1 },
  { family: 'ed', words: ['bed', 'red', 'fed', 'led', 'wed'], emoji: '🛏️', level: 1 },
  { family: 'ot', words: ['cot', 'dot', 'hot', 'lot', 'pot'], emoji: '🍲', level: 1 },
  { family: 'in', words: ['bin', 'fin', 'pin', 'tin', 'win'], emoji: '🏆', level: 1 },
  { family: 'ug', words: ['bug', 'hug', 'jug', 'mug', 'rug'], emoji: '🐛', level: 1 },
  { family: 'et', words: ['jet', 'net', 'pet', 'set', 'wet'], emoji: '✈️', level: 1 },

  // LEVEL 2
  { family: 'ag', words: ['bag', 'hag', 'lag', 'rag', 'tag'], emoji: '🎒', level: 2 },
  { family: 'am', words: ['ham', 'jam', 'ram', 'yam', 'dam'], emoji: '🥪', level: 2 },
  { family: 'ap', words: ['cap', 'gap', 'lap', 'map', 'nap'], emoji: '🗺️', level: 2 },
  { family: 'ax', words: ['fax', 'lax', 'max', 'tax', 'wax'], emoji: '📠', level: 2 },
  { family: 'ub', words: ['cub', 'hub', 'rub', 'sub', 'tub'], emoji: '🛁', level: 2 },
  { family: 'un', words: ['bun', 'fun', 'gun', 'nun', 'run'], emoji: '🎉', level: 2 },
  { family: 'ut', words: ['but', 'cut', 'gut', 'hut', 'nut'], emoji: '🥜', level: 2 },
  { family: 'id', words: ['bid', 'did', 'hid', 'kid', 'lid'], emoji: '🧒', level: 2 },
  { family: 'ob', words: ['cob', 'job', 'mob', 'rob', 'sob'], emoji: '🌽', level: 2 },

  // LEVEL 3
  { family: 'ack', words: ['back', 'pack', 'rack', 'sack', 'tack'], emoji: '🎒', level: 3 },
  { family: 'ick', words: ['kick', 'lick', 'pick', 'sick', 'tick'], emoji: '🤒', level: 3 },
  { family: 'ock', words: ['block', 'clock', 'dock', 'lock', 'rock'], emoji: '🪨', level: 3 },
  { family: 'uck', words: ['duck', 'luck', 'muck', 'suck', 'tuck'], emoji: '🦆', level: 3 },
  { family: 'ash', words: ['cash', 'dash', 'flash', 'rash', 'trash'], emoji: '💸', level: 3 },
  { family: 'ish', words: ['dish', 'fish', 'wish', 'swish', 'squish'], emoji: '🐟', level: 3 },
  { family: 'ush', words: ['brush', 'crush', 'hush', 'rush', 'flush'], emoji: '🧹', level: 3 },
  { family: 'ing', words: ['king', 'ring', 'sing', 'wing', 'thing'], emoji: '👑', level: 3 },
  { family: 'ang', words: ['bang', 'fang', 'hang', 'rang', 'sang'], emoji: '🦷', level: 3 },
  { family: 'ong', words: ['long', 'song', 'strong', 'wrong', 'gong'], emoji: '🎵', level: 3 },

  // LEVEL 4
  { family: 'ake', words: ['bake', 'cake', 'lake', 'make', 'take'], emoji: '🎂', level: 4 },
  { family: 'ike', words: ['bike', 'hike', 'like', 'pike', 'spike'], emoji: '🚲', level: 4 },
  { family: 'ame', words: ['came', 'game', 'lame', 'name', 'same'], emoji: '🎮', level: 4 },
  { family: 'ane', words: ['cane', 'lane', 'mane', 'pane', 'plane'], emoji: '🛩️', level: 4 },
  { family: 'ate', words: ['date', 'gate', 'late', 'mate', 'plate'], emoji: '🚪', level: 4 },
  { family: 'ole', words: ['hole', 'mole', 'pole', 'role', 'whole'], emoji: '🕳️', level: 4 },
  { family: 'one', words: ['bone', 'cone', 'stone', 'tone', 'zone'], emoji: '🦴', level: 4 },
  { family: 'ine', words: ['dine', 'fine', 'line', 'mine', 'nine'], emoji: '9️⃣', level: 4 },
  { family: 'ore', words: ['bore', 'core', 'more', 'score', 'store'], emoji: '🏪', level: 4 },
  { family: 'ute', words: ['cute', 'flute', 'mute', 'route', 'shute'], emoji: '😊', level: 4 },

  // LEVEL 5
  { family: 'ay', words: ['day', 'may', 'play', 'say', 'stay'], emoji: '☀️', level: 5 },
  { family: 'oy', words: ['boy', 'joy', 'roy', 'soy', 'toy'], emoji: '🧸', level: 5 },
  { family: 'ee', words: ['bee', 'fee', 'see', 'tree', 'three'], emoji: '🐝', level: 5 },
  { family: 'ea', words: ['beach', 'each', 'peach', 'reach', 'teach'], emoji: '🏖️', level: 5 },
  { family: 'ar', words: ['car', 'far', 'star', 'tar', 'jar'], emoji: '🚗', level: 5 },
  { family: 'or', words: ['corn', 'fork', 'storm', 'torn', 'worn'], emoji: '🌽', level: 5 },
  { family: 'er', words: ['her', 'perk', 'term', 'fern', 'germ'], emoji: '🌿', level: 5 },
  { family: 'ir', words: ['bird', 'dirt', 'fir', 'girl', 'skirt'], emoji: '🐦', level: 5 },
  { family: 'ur', words: ['burn', 'curl', 'fur', 'hurt', 'nurse'], emoji: '🔥', level: 5 },
  { family: 'ow', words: ['cow', 'how', 'now', 'plow', 'snow'], emoji: '🐄', level: 5 },
];

export const WordFamilies: React.FC = () => {
  const [currentFamilyIndex, setCurrentFamilyIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // ✅ NEW: Universal read aloud hook
  const { speak } = useReadAloud();

  const currentFamily = WORD_FAMILIES[currentFamilyIndex];

  /*
   * ---------------------------------------------------------
   * DERIVED DATA
   * ---------------------------------------------------------
   */
  const totalFamilies = WORD_FAMILIES.length;
  const progress = ((currentFamilyIndex + 1) / totalFamilies) * 100;

  const quizWords = useMemo(() => {
    const correctWords = currentFamily.words;

    const otherWords = WORD_FAMILIES
      .filter((family) => family.family !== currentFamily.family)
      .flatMap((family) => family.words);

    const shuffledDistractors = [...otherWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    return [...correctWords, ...shuffledDistractors]
      .sort(() => Math.random() - 0.5);
  }, [currentFamilyIndex, currentFamily]);

  /*
   * ---------------------------------------------------------
   * INTRO AUDIO
   * ---------------------------------------------------------
   */
  useEffect(() => {
    setSelectedWords([]);
    setIsComplete(false);
    setHasChecked(false);
    setShowHint(false);
    setAttempts(0);

    const timer = window.setTimeout(() => {
      speak(`Words ending in ${currentFamily.family}. Find the words that end with ${currentFamily.family}.`);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [currentFamilyIndex, currentFamily.family, speak]);

  /*
   * ---------------------------------------------------------
   * WORD SELECTION
   * ---------------------------------------------------------
   */
  const toggleWord = (word: string) => {
    if (isComplete) return;
    setHasChecked(false);

    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((selected) => selected !== word));
      return;
    }

    setSelectedWords([...selectedWords, word]);
    speak(word);
  };

  /*
   * ---------------------------------------------------------
   * CHECK ANSWER
   * ---------------------------------------------------------
   */
  const checkAnswer = () => {
    const correct =
      selectedWords.length === currentFamily.words.length &&
      currentFamily.words.every((word) => selectedWords.includes(word));

    setAttempts((previous) => previous + 1);
    setHasChecked(true);

    if (correct) {
      setIsComplete(true);

      const earnedPoints = attempts === 0 ? 20 : 10;
      setScore((previous) => previous + earnedPoints);

      speak('Excellent! You found all the words!');
    } else {
      setIsComplete(false);
      speak('Almost! Listen carefully and try again.');
    }
  };

  /*
   * ---------------------------------------------------------
   * RETRY
   * ---------------------------------------------------------
   */
  const retry = () => {
    setSelectedWords([]);
    setHasChecked(false);
    setIsComplete(false);
    setShowHint(false);
    speak('Try again. Listen to the ending of each word.');
  };

  /*
   * ---------------------------------------------------------
   * NEXT FAMILY
   * ---------------------------------------------------------
   */
  const nextFamily = () => {
    if (!isComplete) return;

    if (currentFamilyIndex < totalFamilies - 1) {
      setCurrentFamilyIndex((previous) => previous + 1);
      return;
    }

    speak('Congratulations! You mastered all the word families!');
  };

  const courseFinished =
    currentFamilyIndex === totalFamilies - 1 && isComplete;

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */
  return (
    <div className="max-w-xl mx-auto bg-app-card p-4 sm:p-6 rounded-3xl border border-app-border shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-black text-white">
              Word Families
            </h3>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Discover how words sound alike
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Read instructions aloud */}
          <button
            type="button"
            onClick={() =>
              speak(
                `Find the words that end with ${currentFamily.family}.`
              )
            }
            aria-label="Read instructions aloud"
            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <div className="text-right">
            <div className="text-xs text-gray-500">Score</div>
            <div className="text-yellow-400 font-black">⭐ {score}</div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Family {currentFamilyIndex + 1}</span>
          <span>{totalFamilies} total</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* FAMILY INTRO */}
      <div className="bg-gray-950 rounded-3xl border border-gray-800 p-6 text-center mb-5">
        <motion.div
          key={currentFamily.family}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl mb-4"
        >
          {currentFamily.emoji}
        </motion.div>

        <p className="text-gray-400 text-sm mb-2">
          Listen to the word ending:
        </p>

        <div className="flex justify-center items-center gap-3">
          <span className="text-4xl font-black text-indigo-400">
            -{currentFamily.family}
          </span>

          <button
            onClick={() => speak(currentFamily.family)}
            aria-label="Listen to word family sound"
            className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Words in the same family share a similar ending sound.
        </p>
      </div>

      {/* INSTRUCTION */}
      <div className="text-center mb-4">
        <h4 className="text-lg font-black text-white">
          Which words belong?
        </h4>

        <p className="text-sm text-gray-400">
          Tap all the words that end with{' '}
          <strong className="text-indigo-400">
            -{currentFamily.family}
          </strong>
        </p>
      </div>

      {/* HINT */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-sm"
          >
            💡 Listen to the ending of each word. Words like{' '}
            <strong>{currentFamily.words[0]}</strong> and{' '}
            <strong>{currentFamily.words[1]}</strong> belong together.
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORD GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {quizWords.map((word) => {
          const selected = selectedWords.includes(word);
          const belongs = currentFamily.words.includes(word);
          const correctlySelected = hasChecked && selected && belongs;
          const incorrectlySelected = hasChecked && selected && !belongs;

          return (
            <motion.button
              key={word}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggleWord(word)}
              className={`
                relative min-h-[70px]
                rounded-2xl border-2
                font-black text-base
                transition-all
                ${
                  correctlySelected
                    ? 'bg-green-600 border-green-400 text-white'
                    : incorrectlySelected
                    ? 'bg-red-600 border-red-400 text-white'
                    : selected
                    ? 'bg-indigo-600 border-indigo-400 text-white scale-[1.02]'
                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-600'
                }
              `}
            >
              {word}
              {correctlySelected && (
                <CheckCircle className="absolute top-2 right-2 w-4 h-4" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setShowHint((previous) => !previous);
            speak(
              `Hint. Listen to the ending of each word. ${currentFamily.words[0]} and ${currentFamily.words[1]} belong together.`
            );
          }}
          className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-yellow-400"
          aria-label="Show hint"
        >
          <Lightbulb className="w-5 h-5" />
        </button>

        {!isComplete ? (
          <button
            onClick={checkAnswer}
            disabled={selectedWords.length === 0}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-black"
          >
            Check My Answer
          </button>
        ) : (
          <button
            onClick={nextFamily}
            className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-black flex items-center justify-center gap-2"
          >
            {courseFinished ? 'Finish 🎉' : 'Next Family'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* FEEDBACK */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-5 p-5 rounded-2xl bg-green-500/10 border border-green-500/30 text-center"
          >
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />

            <h4 className="text-lg font-black text-green-400">
              Brilliant! 🌟
            </h4>

            <p className="text-sm text-gray-400 mt-1">
              You found all the words in the{' '}
              <strong className="text-white">
                -{currentFamily.family}
              </strong>{' '}
              family.
            </p>

            <div className="flex justify-center gap-1 mt-3">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>

            <div className="flex justify-center items-center gap-1 mt-2 text-yellow-400 font-black">
              <Trophy className="w-4 h-4" />
              Mastered
            </div>
          </motion.div>
        )}

        {hasChecked && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center"
          >
            <p className="text-orange-300 font-bold">Almost there! 🔎</p>

            <p className="text-xs text-gray-400 mt-1">
              Listen to the ending sounds and try again.
            </p>

            <button
              onClick={retry}
              className="mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-bold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEVEL BADGE */}
      <div className="mt-5 pt-4 border-t border-gray-800 flex justify-between items-center">
        <span className="text-xs text-gray-500">Difficulty</span>

        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold">
          Level {currentFamily.level}
        </span>
      </div>
    </div>
  );
};