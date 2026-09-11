import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Star,
  BookOpen,
  Target,
} from 'lucide-react';

import { ARABIC_WORDS } from '../../../data/arabicVocabulary';
import { speakArabic } from '../../../services/arabicSpeech';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

interface ArabicWordsProps {
  onComplete?: (score: number) => void;
}

type LearningMode = 'guided' | 'practice' | 'mastery';

interface WordProgress {
  id: string;
  attempts: number;
  mastered: boolean;
}

export const ArabicWords: React.FC<ArabicWordsProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [progress, setProgress] = useState<WordProgress[]>([]);

  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<'mastered' | 'practice' | null>(
    null
  );

  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const current = ARABIC_WORDS[index];

  /* Derived progress */
  const masteredCount = useMemo(
    () => progress.filter((item) => item.mastered).length,
    [progress]
  );

  const masteryPercentage = useMemo(() => {
    if (!ARABIC_WORDS.length) return 0;
    return Math.round((masteredCount / ARABIC_WORDS.length) * 100);
  }, [masteredCount]);

  /* Arabic voice gated on soundEnabled */
  const speakArabicGated = (text: string) => {
    if (!soundEnabled) return;
    speakArabic(text);
  };

  /*
   * Auto pronunciation — guided + practice only.
   * Mastery intentionally does not auto-play.
   * Now also gated on autoReadEnabled.
   */
  useEffect(() => {
    if (!current || isComplete || mode === 'mastery') return;
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speakArabicGated(current.arabic);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [index, mode, current, isComplete, autoReadEnabled, soundEnabled]);

  /* Reset per-word UI state */
  useEffect(() => {
    setRevealed(false);
    setFeedback(null);
  }, [index, mode]);

  /* Announce completion once */
  useEffect(() => {
    if (!isComplete || hasFinished) return;

    speak(
      masteryPercentage >= 80
        ? `Masha'Allah! You mastered ${masteredCount} words.`
        : `Well done! You mastered ${masteredCount} words. Let's practise again.`,
    );
  }, [isComplete, hasFinished, masteredCount, masteryPercentage, speak]);

  const speakCurrentWord = () => {
    if (!current) return;
    speakArabicGated(current.arabic);
  };

  const getWordProgress = (id: string) =>
    progress.find((item) => item.id === id);

  const markAsMastered = () => {
    if (!current) return;

    const existing = getWordProgress(current.id);

    if (existing?.mastered) {
      setFeedback('mastered');
      setRevealed(true);
      speak('You have already mastered this word.');
      return;
    }

    if (soundEnabled) playSoundFeedback('correct');

    const newStreak = streak + 1;

    setProgress((previous) => {
      const exists = previous.some((item) => item.id === current.id);

      if (exists) {
        return previous.map((item) =>
          item.id === current.id
            ? { ...item, attempts: item.attempts + 1, mastered: true }
            : item
        );
      }

      return [
        ...previous,
        { id: current.id, attempts: 1, mastered: true },
      ];
    });

    setScore((previous) => previous + 10 + (newStreak >= 2 ? 5 : 0));
    setStreak(newStreak);

    setFeedback('mastered');
    setRevealed(true);

    speak(
      `Excellent! This word has been added to your mastered vocabulary. It means: ${current.meaning}.`,
    );
  };

  const markForPractice = () => {
    if (!current) return;

    if (soundEnabled) playSoundFeedback('try-again');

    setProgress((previous) => {
      const exists = previous.some((item) => item.id === current.id);

      if (exists) {
        return previous.map((item) =>
          item.id === current.id
            ? { ...item, attempts: item.attempts + 1 }
            : item
        );
      }

      return [
        ...previous,
        { id: current.id, attempts: 1, mastered: false },
      ];
    });

    setStreak(0);
    setFeedback('practice');
    setRevealed(true);

    speak(
      'Good effort! Keep practising this word. You can master it later.',
    );
  };

  const handleNext = () => {
    if (!current) return;

    if (index < ARABIC_WORDS.length - 1) {
      setIndex((previous) => previous + 1);
      return;
    }

    setIsComplete(true);
  };

  const handlePrevious = () => {
    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);

    if (onComplete) {
      onComplete(score);
    }

    speak(
      `Masha'Allah! You completed the Arabic vocabulary lesson with ${score} points.`,
    );
  };

  const handleReset = () => {
    setIndex(0);
    setMode('guided');
    setScore(0);
    setStreak(0);
    setProgress([]);
    setRevealed(false);
    setFeedback(null);
    setIsComplete(false);
    setHasFinished(false);

    speak("Let's practise Arabic vocabulary again!");
  };

  /* Empty dataset protection */
  if (!ARABIC_WORDS.length) {
    return (
      <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <BookOpen className="w-10 h-10 mx-auto mb-4 text-emerald-400" />

        <h3 className="text-xl font-bold text-white mb-2">
          Arabic Vocabulary
        </h3>

        <p className="text-gray-400">
          No Arabic vocabulary has been added yet.
        </p>
      </div>
    );
  }

  /* Completion screen */
  if (isComplete) {
    return (
      <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl mb-4"
        >
          🎉
        </motion.div>

        <p className="text-2xl font-bold text-emerald-400 mb-2">
          Masha&apos;Allah!
        </p>

        <p className="text-gray-300 mb-6">
          You completed this Arabic vocabulary lesson.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <Target className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">
              {masteredCount}
            </div>
            <div className="text-xs text-gray-500">Words Mastered</div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <Star className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Vocabulary Mastery</span>
            <span>{masteryPercentage}%</span>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${masteryPercentage}%` }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-white mb-2">
            What you practiced
          </p>

          <ul className="text-xs text-gray-400 space-y-2">
            <li>• Arabic word recognition</li>
            <li>• Arabic pronunciation</li>
            <li>• Vocabulary meaning</li>
            <li>• Listening and repetition</li>
            <li>• Independent word recall</li>
          </ul>
        </div>

        <button
          onClick={handleReset}
          className="w-full px-6 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500 mb-3 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Learn Again
        </button>

        <button
          onClick={finishAndMoveUp}
          disabled={hasFinished}
          className="w-full px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasFinished ? 'Completed' : 'Finish & Move Up'}
        </button>
      </div>
    );
  }

  const currentProgress = getWordProgress(current.id);

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />

          <h3 className="text-2xl font-bold text-white">
            Arabic Vocabulary
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-4 h-4 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>

          <button
            onClick={handleReset}
            aria-label="Reset lesson"
            className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Learn, listen, recognize and master everyday Arabic words.
      </p>

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={() => {
            setMode('guided');
            speak(
              'Guided mode. Listen to the word, look at its meaning, and then decide whether you know it.',
            );
          }}
          className={`px-2 py-2 rounded-lg text-xs font-semibold transition ${
            mode === 'guided'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          Guided
        </button>

        <button
          onClick={() => {
            setMode('practice');
            speak(
              'Practice mode. Listen again, repeat the word aloud, and check that you understand its meaning.',
            );
          }}
          className={`px-2 py-2 rounded-lg text-xs font-semibold transition ${
            mode === 'practice'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          Practice
        </button>

        <button
          onClick={() => {
            setMode('mastery');
            speak(
              'Mastery mode. Try to recognize and pronounce the word before listening to the audio.',
            );
          }}
          className={`px-2 py-2 rounded-lg text-xs font-semibold transition ${
            mode === 'mastery'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          Mastery
        </button>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Word {index + 1} / {ARABIC_WORDS.length}
          </span>

          <span>
            Score:{' '}
            <span className="text-yellow-400 font-bold">{score}</span>
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{
              width: `${((index + 1) / ARABIC_WORDS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Word card */}
      <motion.div
        key={`${index}-${mode}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-5"
      >
        <div className="text-6xl mb-4">{current.emoji}</div>

        <div
          dir="rtl"
          lang="ar"
          className="text-6xl text-white mb-4 font-serif"
        >
          {current.arabic}
        </div>

        <div className="text-gray-400 mb-3">
          Meaning: {current.meaning}
        </div>

        <div className="inline-block bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full">
          Category: {current.category}
        </div>

        {currentProgress?.mastered && (
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Mastered
          </div>
        )}
      </motion.div>

      {/* Audio */}
      <button
        onClick={speakCurrentWord}
        className="w-full px-4 py-3 bg-emerald-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 mb-4 hover:bg-emerald-500"
      >
        <Volume2 className="w-5 h-5" />
        Hear Pronunciation
      </button>

      {/* Learning prompt */}
      <div className="bg-gray-900 rounded-xl p-4 mb-4 text-left">
        <p className="text-xs text-gray-500 mb-1">
          {mode === 'guided'
            ? 'GUIDED LEARNING'
            : mode === 'practice'
              ? 'PRACTICE'
              : 'MASTERY CHALLENGE'}
        </p>

        <p className="text-sm text-gray-300">
          {mode === 'guided'
            ? 'Listen to the word, look at its meaning, and then decide whether you know it.'
            : mode === 'practice'
              ? 'Listen again, repeat the word aloud, and check that you understand its meaning.'
              : 'Try to recognize and pronounce the word before listening to the audio.'}
        </p>
      </div>

      {/* Reveal */}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white mb-4"
        >
          Show Learning Prompt
        </button>
      )}

      {/* Self assessment */}
      {revealed && !feedback && (
        <div className="mb-5">
          <p className="text-sm text-gray-300 font-semibold mb-3">
            How well do you know this word?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={markAsMastered}
              className="px-4 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              I Know It
            </button>

            <button
              onClick={markForPractice}
              className="px-4 py-3 bg-amber-600 rounded-xl text-white font-bold hover:bg-amber-500"
            >
              Practice Again
            </button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback === 'mastered' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-5"
        >
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-400" />

          <p className="text-emerald-400 font-bold">Excellent!</p>

          <p className="text-xs text-gray-400 mt-1">
            {currentProgress?.mastered
              ? 'You have already mastered this word.'
              : 'This word has been added to your mastered vocabulary.'}
          </p>
        </motion.div>
      )}

      {feedback === 'practice' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-5"
        >
          <p className="text-amber-400 font-bold">Good effort!</p>

          <p className="text-xs text-gray-400 mt-1">
            Keep practicing this word. You can master it later.
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={index === 0}
          className="px-4 py-3 bg-gray-800 rounded-xl text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 flex items-center justify-center gap-2"
        >
          {index < ARABIC_WORDS.length - 1 ? 'Next Word' : 'Complete Lesson'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Listen • Read • Understand • Practice • Master
      </p>
    </div>
  );
};