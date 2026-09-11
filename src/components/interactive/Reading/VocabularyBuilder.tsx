import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lightbulb,
  RotateCcw,
  Trophy,
  BookOpen,
  Sparkles,
  Star,
} from 'lucide-react';

import { VOCABULARY_CURRICULUM } from '../../../data/vocabularyCurriculum';
import { useReadAloud } from '../../../hooks/useReadAloud';

interface VocabularyBuilderProps {
  onComplete?: (score: number) => void;
}

type Mode = 'learn' | 'quiz' | 'complete';
type Feedback = 'idle' | 'correct' | 'incorrect';

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({
  onComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mode, setMode] = useState<Mode>('learn');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);

  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const [quizAttempts, setQuizAttempts] = useState(0);
  const [wordsLearned, setWordsLearned] = useState(0);

  // ✅ NEW: Use the universal read aloud hook
  const { speak } = useReadAloud();

  const level = VOCABULARY_CURRICULUM[currentLevel];
  const currentWord = level.words[currentWordIndex];

  /*
   * ---------------------------------------------------------
   * AUDIO
   * ---------------------------------------------------------
   */

  /*
   * Automatically pronounce the current word.
   * Speaks the word AND its meaning for richer learning.
   */
  useEffect(() => {
    if (mode === 'learn' && currentWord?.word) {
      const timer = window.setTimeout(() => {
        speak(`${currentWord.word}. ${currentWord.meaning}`);
      }, 500);

      return () => window.clearTimeout(timer);
    }
  }, [currentWord, mode, speak]);

  /*
   * ---------------------------------------------------------
   * QUIZ DATA
   * ---------------------------------------------------------
   */

  const shuffledWords = useMemo(() => {
    return [...level.words].sort(() => Math.random() - 0.5);
  }, [currentLevel, level.words]);

  const targetFamily = level.words[0]?.family ?? '';

  const correctWords = useMemo(() => {
    return level.words.filter(
      (word) => word.family === targetFamily
    );
  }, [level.words, targetFamily]);

  const progressPercent =
    ((currentWordIndex + 1) / level.words.length) * 100;

  const totalLevels = VOCABULARY_CURRICULUM.length;

  /*
   * ---------------------------------------------------------
   * LEARNING MODE
   * ---------------------------------------------------------
   */

  const handleNextWord = () => {
    if (currentWordIndex < level.words.length - 1) {
      const nextIndex = currentWordIndex + 1;

      setCurrentWordIndex(nextIndex);
      setWordsLearned((previous) => previous + 1);

      speak(
        `${level.words[nextIndex].word}. ${level.words[nextIndex].meaning}`
      );
      return;
    }

    setWordsLearned((previous) => previous + 1);
    setMode('quiz');
    setCurrentWordIndex(0);
    setSelectedWords([]);
    setFeedback('idle');
    setShowHint(false);

    speak("Great job! Let's play a vocabulary game!");
  };

  /*
   * ---------------------------------------------------------
   * QUIZ SELECTION
   * ---------------------------------------------------------
   */

  const toggleSelection = (id: string) => {
    if (feedback === 'correct') return;

    setSelectedWords((previous) => {
      if (previous.includes(id)) {
        return previous.filter((wordId) => wordId !== id);
      }

      return [...previous, id];
    });

    setFeedback('idle');
  };

  /*
   * ---------------------------------------------------------
   * QUIZ CHECK
   * ---------------------------------------------------------
   */

  const handleCheck = () => {
    setQuizAttempts((previous) => previous + 1);

    const correctIds = correctWords.map((word) => word.id);

    const allCorrect =
      correctIds.every((id) => selectedWords.includes(id)) &&
      selectedWords.length === correctIds.length;

    if (allCorrect) {
      setFeedback('correct');

      const earnedPoints = quizAttempts === 0 ? 20 : 10;

      setLevelScore(earnedPoints);
      setScore((previous) => previous + earnedPoints);

      speak('Excellent! You found all the words!');
    } else {
      setFeedback('incorrect');
      speak('Almost! Try again.');
    }
  };

  /*
   * ---------------------------------------------------------
   * RETRY QUIZ
   * ---------------------------------------------------------
   */

  const handleRetry = () => {
    setSelectedWords([]);
    setFeedback('idle');
    setShowHint(false);
    speak('Try again. Find the words in the family.');
  };

  /*
   * ---------------------------------------------------------
   * NEXT LEVEL
   * ---------------------------------------------------------
   */

  const handleNextLevel = () => {
    if (currentLevel >= totalLevels - 1) {
      setMode('complete');

      speak('Congratulations! You completed the vocabulary course!');

      if (onComplete) {
        onComplete(score);
      }

      return;
    }

    setCurrentLevel((previous) => previous + 1);

    setMode('learn');
    setCurrentWordIndex(0);

    setLevelScore(0);
    setFeedback('idle');
    setSelectedWords([]);
    setShowHint(false);
    setQuizAttempts(0);

    speak('Welcome to the next level!');
  };

  /*
   * ---------------------------------------------------------
   * RESET LEVEL
   * ---------------------------------------------------------
   */

  const handleRestartLevel = () => {
    setMode('learn');
    setCurrentWordIndex(0);
    setSelectedWords([]);
    setFeedback('idle');
    setShowHint(false);
    setQuizAttempts(0);
    setLevelScore(0);

    speak('Restarting this level.');
  };

  /*
   * ---------------------------------------------------------
   * COMPLETION SCREEN
   * ---------------------------------------------------------
   */

  if (mode === 'complete') {
    return (
      <div className="max-w-lg mx-auto bg-app-card p-6 rounded-3xl border border-app-border shadow-xl text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-8"
        >
          <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>

          <h2 className="text-3xl font-black text-white mb-2">
            Amazing Work! 🎉
          </h2>

          <p className="text-gray-400 mb-6">
            You completed your vocabulary adventure.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-900 rounded-2xl p-4">
              <div className="text-2xl font-black text-white">
                {score}
              </div>
              <div className="text-xs text-gray-500">
                Total Points
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4">
              <div className="text-2xl font-black text-white">
                {totalLevels}
              </div>
              <div className="text-xs text-gray-500">
                Levels Completed
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-7 h-7 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentLevel(0);
              setCurrentWordIndex(0);
              setMode('learn');
              setScore(0);
              setLevelScore(0);
              setSelectedWords([]);
              setFeedback('idle');
              setQuizAttempts(0);
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN UI
   * ---------------------------------------------------------
   */

  return (
    <div className="max-w-lg mx-auto bg-app-card p-4 sm:p-6 rounded-3xl border border-app-border shadow-xl">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-5 gap-3">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-400" />

            <h3 className="text-lg sm:text-xl font-black text-white">
              Vocabulary Adventure
            </h3>
          </div>

          <p className="text-xs text-gray-500">
            Level {currentLevel + 1} of {totalLevels}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Read instructions aloud */}
          <button
            type="button"
            onClick={() =>
              speak(
                mode === 'learn'
                  ? `Learn the word ${currentWord.word}.`
                  : `Find all words in the ${targetFamily} family.`
              )
            }
            aria-label="Read instructions aloud"
            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <div className="text-right">
            <div className="text-xs text-gray-500">
              Points
            </div>

            <div className="font-black text-yellow-400">
              ⭐ {score}
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL INFORMATION */}

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center gap-3">
          <div>
            <h4 className="font-bold text-white">
              {level.title}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {level.syllabusFocus}
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        </div>

        {mode === 'learn' && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>
                Word {currentWordIndex + 1}
              </span>
              <span>
                {level.words.length} words
              </span>
            </div>

            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* =====================================================
            LEARN MODE
        ====================================================== */}

        {mode === 'learn' && (
          <motion.div
            key="learn"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center gap-4"
          >

            {/* WORD CARD */}

            <div className="bg-gray-950 p-7 sm:p-8 rounded-3xl border border-gray-800 w-full text-center">

              <motion.div
                key={currentWord.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl mb-5"
              >
                {currentWord.emoji}
              </motion.div>

              <div className="flex items-center justify-center gap-3 mb-3">

                <h2 className="text-4xl sm:text-5xl font-black text-white">
                  {currentWord.word}
                </h2>

                <button
                  onClick={() =>
                    speak(`${currentWord.word}. ${currentWord.meaning}`)
                  }
                  aria-label={`Hear ${currentWord.word}`}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white shadow-lg"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

              </div>

              <p className="text-gray-400 text-sm">
                {currentWord.meaning}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full">
                <span className="text-xs text-gray-500">
                  Word family
                </span>
                <span className="text-xs font-bold text-indigo-300">
                  "{currentWord.family}"
                </span>
              </div>

            </div>

            {/* LISTEN AGAIN */}

            <button
              onClick={() =>
                speak(`${currentWord.word}. ${currentWord.meaning}`)
              }
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Listen again
            </button>

            {/* NEXT */}

            <button
              onClick={handleNextWord}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black flex justify-center items-center gap-2 shadow-lg"
            >
              {currentWordIndex < level.words.length - 1
                ? 'Next Word'
                : 'Start Vocabulary Game'}

              <ArrowRight className="w-5 h-5" />
            </button>

          </motion.div>
        )}

        {/* =====================================================
            QUIZ MODE
        ====================================================== */}

        {mode === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center gap-4"
          >

            {/* QUIZ HEADER */}

            <div className="w-full text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold mb-3">
                <Sparkles className="w-3 h-3" />
                Vocabulary Challenge
              </div>

              <h3 className="text-xl font-black text-white">
                Find the "{targetFamily}" family!
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                Tap every word that belongs to this family.
              </p>
            </div>

            {/* HINT */}

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-3 text-sm text-yellow-300"
                >
                  💡 Hint: Look for words that have the same
                  ending sound as "{targetFamily}".
                </motion.div>
              )}
            </AnimatePresence>

            {/* WORD OPTIONS */}

            <div className="grid grid-cols-2 gap-3 w-full">
              {shuffledWords.map((word) => {
                const selected = selectedWords.includes(word.id);

                const isCorrect =
                  feedback === 'correct' &&
                  word.family === targetFamily;

                return (
                  <motion.button
                    key={word.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleSelection(word.id);
                      speak(word.word);
                    }}
                    disabled={feedback === 'correct'}
                    aria-pressed={selected}
                    className={`
                      relative p-4 rounded-2xl text-sm font-black
                      transition-all border-2
                      min-h-[110px]
                      flex flex-col items-center justify-center
                      gap-2
                      ${
                        isCorrect
                          ? 'bg-green-600 border-green-400 text-white'
                          : selected
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-600'
                      }
                    `}
                  >
                    <span className="text-4xl">
                      {word.emoji}
                    </span>

                    <span>
                      {word.word}
                    </span>

                    {selected && !isCorrect && (
                      <CheckCircle className="absolute top-2 right-2 w-4 h-4" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* ACTION BUTTONS */}

            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  setShowHint((previous) => !previous);
                  speak(
                    `Hint. Look for words ending in the same sound as ${targetFamily}.`
                  );
                }}
                className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-yellow-400"
                aria-label="Show hint"
              >
                <Lightbulb className="w-5 h-5" />
              </button>

              <button
                onClick={handleCheck}
                disabled={
                  selectedWords.length === 0 ||
                  feedback === 'correct'
                }
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-black"
              >
                Check My Answer
              </button>
            </div>

            {/* CORRECT */}

            <AnimatePresence>
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full p-5 bg-green-500/10 border border-green-500/30 rounded-2xl text-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />

                  <h4 className="text-lg font-black text-green-400">
                    Excellent! 🎉
                  </h4>

                  <p className="text-sm text-gray-400 mt-1">
                    You found all the words in the family.
                  </p>

                  <div className="flex justify-center gap-1 my-3">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>

                  <div className="text-yellow-400 font-black mb-3">
                    +{levelScore} points
                  </div>

                  <button
                    onClick={handleNextLevel}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-black flex justify-center items-center gap-2"
                  >
                    {currentLevel === totalLevels - 1
                      ? 'Complete Course'
                      : 'Next Level'}

                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INCORRECT */}

            <AnimatePresence>
              {feedback === 'incorrect' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="w-7 h-7 text-red-400 shrink-0" />

                    <div className="flex-1">
                      <h4 className="font-black text-red-400">
                        Almost there!
                      </h4>

                      <p className="text-xs text-gray-400 mt-1">
                        Some words don't belong to the "{targetFamily}" family.
                        Try again.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleRetry}
                    className="w-full mt-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESTART */}

            <button
              onClick={handleRestartLevel}
              className="text-xs text-gray-600 hover:text-gray-400"
            >
              Restart this level
            </button>

          </motion.div>
        )}

      </AnimatePresence>

      {/* FOOTER LEARNING INDICATOR */}

      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-[10px] text-gray-600">
        <span>
          {mode === 'learn'
            ? '🌱 Explore & Listen'
            : '🧠 Practice & Remember'}
        </span>

        <span>
          {wordsLearned} words explored
        </span>
      </div>

    </div>
  );
};