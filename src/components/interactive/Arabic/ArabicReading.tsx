import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  CheckCircle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

import { ARABIC_PHRASES } from '../../../data/arabicPhrases';
import { speakArabic } from '../../../services/arabicSpeech';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

interface ArabicReadingProps {
  onComplete?: (score: number) => void;
}

type ReadingMode = 'guided' | 'practice' | 'mastery';

type PhraseProgress = {
  id: string;
  attempts: number;
  mastered: boolean;
};

export const ArabicReading: React.FC<ArabicReadingProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<ReadingMode>('guided');
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [learned, setLearned] = useState<string[]>([]);
  const [progress, setProgress] = useState<PhraseProgress[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [feedback, setFeedback] = useState<'mastered' | 'practice' | null>(
    null
  );

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const current = ARABIC_PHRASES[index];

  const totalPhrases = ARABIC_PHRASES.length;

  const masteredCount = progress.filter((item) => item.mastered).length;

  const progressPercent =
    totalPhrases > 0 ? Math.round((masteredCount / totalPhrases) * 100) : 0;

  const currentProgress = useMemo(() => {
    if (!current) return undefined;
    return progress.find((item) => item.id === current.id);
  }, [current, progress]);

  // Arabic voice gated on soundEnabled
  const speakArabicGated = (text: string) => {
    if (!soundEnabled) return;
    speakArabic(text);
  };

  // Auto-pronounce current phrase (guided + practice only)
  useEffect(() => {
    if (!current || isComplete || mode === 'mastery') return;
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speakArabicGated(current.arabic);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [index, current, isComplete, mode, autoReadEnabled, soundEnabled]);

  // Reset per-phrase UI state
  useEffect(() => {
    setFeedback(null);
    setRevealed(false);
  }, [index]);

  // Announce completion + fire callback once
  useEffect(() => {
    if (!isComplete || hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);

    const percentage = Math.round((masteredCount / totalPhrases) * 100);
    speak(
      percentage >= 80
        ? `Masha'Allah! You mastered ${masteredCount} of ${totalPhrases} phrases.`
        : `Well done! You mastered ${masteredCount} of ${totalPhrases} phrases. Let's practise again.`,
    );
  }, [isComplete, hasFinished, onComplete, score, masteredCount, totalPhrases, speak]);

  const speakPhrase = () => {
    if (!current) return;
    speakArabicGated(current.arabic);
  };

  const markAsMastered = () => {
    if (!current) return;

    const alreadyMastered = currentProgress?.mastered === true;

    if (alreadyMastered) {
      setFeedback('mastered');
      return;
    }

    if (soundEnabled) playSoundFeedback('correct');

    const streakBonus = streak >= 2 ? 5 : 0;
    const earned = 10 + streakBonus;

    setScore((previous) => previous + earned);
    setStreak((previous) => previous + 1);

    setProgress((previous) => {
      const existing = previous.find((item) => item.id === current.id);

      if (existing) {
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

    setLearned((previous) =>
      previous.includes(current.id) ? previous : [...previous, current.id]
    );

    setFeedback('mastered');

    speak(`Excellent reading! You mastered the phrase: ${current.meaning}.`);
  };

  const markForPractice = () => {
    if (!current) return;

    if (soundEnabled) playSoundFeedback('try-again');

    setStreak(0);

    setProgress((previous) => {
      const existing = previous.find((item) => item.id === current.id);

      if (existing) {
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

    setFeedback('practice');

    speak(
      "That's okay. Listening and repeating is part of learning. Keep practising!",
    );
  };

  const handleNext = () => {
    if (!current) return;

    setRevealed(false);
    setFeedback(null);

    if (index < totalPhrases - 1) {
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

  const handleReset = () => {
    setIndex(0);
    setMode('guided');
    setRevealed(false);
    setScore(0);
    setStreak(0);
    setLearned([]);
    setProgress([]);
    setIsComplete(false);
    setHasFinished(false);
    setFeedback(null);

    speak("Let's practise Arabic reading again!");
  };

  if (totalPhrases === 0) {
    return (
      <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <h3 className="text-2xl font-bold text-white mb-3">
          📚 Arabic Reading
        </h3>

        <p className="text-gray-400 text-sm">
          No Arabic reading material is available yet. Add phrases to
          arabicPhrases.ts and return to this lesson.
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180 }}
          className="text-7xl mb-5"
        >
          🎉
        </motion.div>

        <p className="text-2xl font-bold text-emerald-400 mb-2">
          Masha&apos;Allah!
        </p>

        <p className="text-gray-300 mb-6">
          You completed this Arabic reading lesson.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <div className="text-xl font-bold text-emerald-400">
              {learned.length}
            </div>
            <div className="text-[11px] text-gray-500">Mastered</div>
          </div>

          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <div className="text-xl font-bold text-yellow-400">{score}</div>
            <div className="text-[11px] text-gray-500">Score</div>
          </div>

          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <div className="text-xl font-bold text-indigo-400">
              {progressPercent}%
            </div>
            <div className="text-[11px] text-gray-500">Mastery</div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6 text-left">
          <p className="text-sm text-white font-semibold mb-2">
            What you practiced
          </p>

          <ul className="space-y-2 text-xs text-gray-400">
            <li>• Reading Arabic words and sentences</li>
            <li>• Connecting written Arabic with meaning</li>
            <li>• Listening and pronunciation practice</li>
            <li>• Reading confidence and self-assessment</li>
            <li>• Progressive phrase recognition</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500 transition-colors"
          >
            Learn Again
          </button>

          <button
            onClick={() => onComplete?.(score)}
            className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 transition-colors"
          >
            Finish &amp; Move Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">📚 Arabic Reading</h3>

        <div className="flex items-center gap-2">
          <button
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
            title="Reset lesson"
            className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-5">
        Read, listen, understand, and build confidence with progressive
        Arabic phrases and sentences.
      </p>

      {/* MODE SELECTOR */}
      <div className="flex justify-center gap-1 mb-5 bg-gray-900 p-1 rounded-xl border border-gray-800">
        <button
          onClick={() => {
            setMode('guided');
            speak('Guided reading mode. Listen first, then try reading aloud.');
          }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'guided'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Guided Reading
        </button>

        <button
          onClick={() => {
            setMode('practice');
            speak('Practice mode. Try reading the Arabic before revealing the meaning.');
          }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'practice'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Practice
        </button>

        <button
          onClick={() => {
            setMode('mastery');
            speak('Mastery mode. Read the phrase aloud, then tell yourself what it means.');
          }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'mastery'
              ? 'bg-yellow-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Mastery
        </button>
      </div>

      {/* PROGRESS SUMMARY */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500">
          Phrase <span className="text-emerald-400 font-bold">{index + 1}</span>{' '}
          / {totalPhrases}
        </span>

        <div className="flex gap-3">
          <span className="text-yellow-400 font-bold text-xs">
            ⭐ {score}
          </span>

          {streak > 0 && (
            <span className="text-orange-400 font-bold text-xs">
              🔥 {streak}
            </span>
          )}
        </div>
      </div>

      {/* MASTERY BAR */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* MAIN READING CARD */}
      <motion.div
        key={`${index}-${mode}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] p-7 rounded-xl border border-gray-800 mb-5"
      >
        {current.emoji && <div className="text-5xl mb-4">{current.emoji}</div>}

        <div
          dir="rtl"
          lang="ar"
          className="text-4xl md:text-5xl text-emerald-400 leading-[2] mb-4 font-medium"
        >
          {current.arabic}
        </div>

        {mode === 'guided' && (
          <div className="text-gray-500 text-xs">
            Listen first, then try reading it aloud.
          </div>
        )}

        {mode === 'practice' && (
          <div className="text-gray-500 text-xs">
            Try reading the Arabic before revealing the meaning.
          </div>
        )}

        {mode === 'mastery' && (
          <div className="text-gray-500 text-xs">
            Read the phrase aloud, then tell yourself what it means.
          </div>
        )}

        {/* MEANING */}
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-5 pt-5 border-t border-gray-800"
          >
            <div className="text-xl text-white font-semibold mb-2">
              {current.meaning}
            </div>

            <div className="text-xs text-gray-500">
              Category: {current.category}
            </div>

            <div className="text-xs text-gray-500 mt-1">
              Level: {current.level}
            </div>
          </motion.div>
        ) : (
          <div className="mt-5 text-xs text-gray-600">
            Meaning hidden — try reading first.
          </div>
        )}
      </motion.div>

      {/* AUDIO + MEANING */}
      <div className="flex flex-wrap justify-center gap-3 mb-5">
        <button
          onClick={speakPhrase}
          className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold flex items-center gap-2 hover:bg-emerald-500 transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          Listen
        </button>

        <button
          onClick={() => setRevealed((previous) => !previous)}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500 transition-colors"
        >
          {revealed ? 'Hide Meaning' : 'Show Meaning'}
        </button>
      </div>

      {/* SELF-ASSESSMENT */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-5">
        <p className="text-sm text-white font-semibold mb-1">
          How did you do?
        </p>

        <p className="text-xs text-gray-500 mb-4">
          Read the Arabic aloud before choosing.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={markAsMastered}
            className={`px-3 py-3 rounded-lg border transition-all ${
              currentProgress?.mastered
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-emerald-600/10 border-emerald-600/40 text-emerald-300 hover:bg-emerald-600/20'
            }`}
          >
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs font-bold">I Can Read This</span>
          </button>

          <button
            onClick={markForPractice}
            className="px-3 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-white transition-all"
          >
            <span className="text-lg block mb-1">🔁</span>
            <span className="text-xs font-bold">I Need Practice</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-3 mb-5 text-sm ${
            feedback === 'mastered'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
          }`}
        >
          {feedback === 'mastered' ? (
            <>
              <strong>Excellent reading! ✓</strong>
              <p className="text-xs mt-1 text-gray-400">
                This phrase has been added to your mastered reading skills.
              </p>
            </>
          ) : (
            <>
              <strong>That&apos;s okay — keep practicing!</strong>
              <p className="text-xs mt-1 text-gray-400">
                Listening and repeating is part of learning.
              </p>
            </>
          )}
        </motion.div>
      )}

      {/* PHRASE NAVIGATION */}
      <div className="flex justify-between items-center gap-3">
        <button
          onClick={handlePrevious}
          disabled={index === 0}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            index === 0
              ? 'bg-gray-900 text-gray-700 cursor-not-allowed'
              : 'bg-gray-800 text-gray-300 hover:text-white'
          }`}
        >
          ← Previous
        </button>

        <div className="text-xs text-gray-500">
          {currentProgress?.mastered
            ? '✓ Mastered'
            : currentProgress
              ? 'Practice again'
              : 'Not attempted'}
        </div>

        <button
          onClick={handleNext}
          className="px-5 py-2 bg-indigo-600 rounded-lg text-white font-bold flex items-center gap-2 hover:bg-indigo-500 transition-colors"
        >
          {index === totalPhrases - 1 ? 'Complete' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CURRICULUM NOTE */}
      <div className="mt-5 pt-4 border-t border-gray-800">
        <p className="text-[11px] text-gray-600">
          Arabic Reading Progression • Read → Listen → Understand → Practice →
          Master
        </p>
      </div>
    </div>
  );
};