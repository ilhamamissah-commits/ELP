import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { SENTENCE_CURRICULUM } from '../../../data/sentenceCurriculum';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useProgressStore } from '../../../store/useProgressStore';

interface SentenceBuilderProps {
  onComplete?: (score: number) => void;
}

const SENTENCE_ACTIVITY_ID = 'reading-sentence-builder-001';

const SENTENCE_SKILLS = [
  'reading-sentence-structure',
  'reading-word-order',
  'reading-sentence-construction',
  'reading-grammar-awareness',
  'reading-comprehension-foundation',
  'reading-written-language',
] as const;

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activityComplete, setActivityComplete] = useState(false);

  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ✅ NEW: Use the universal read aloud hook (respects accent + mute)
  const { speak } = useReadAloud();

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  const currentSentence = SENTENCE_CURRICULUM[currentIndex];

  const targetWords = useMemo(
    () => currentSentence.text.trim().split(/\s+/),
    [currentSentence.text],
  );

  const clearTimers = useCallback(() => {
    timerIdsRef.current.forEach((timerId) => {
      clearTimeout(timerId);
    });
    timerIdsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearTimers]);

  // Prepare a new sentence.
  useEffect(() => {
    const shuffled = [...targetWords].sort(() => Math.random() - 0.5);
    setBank(shuffled);
    setConstructed([]);
    setIsCorrect(false);
  }, [currentIndex, targetWords]);

  // ✅ AUTO-READ: Speak the sentence pattern when it changes
  useEffect(() => {
    const timerId = setTimeout(() => {
      speak(`Build this sentence. ${currentSentence.pattern}.`);
    }, 700);
    timerIdsRef.current.push(timerId);
    return () => clearTimeout(timerId);
  }, [currentIndex, currentSentence.pattern, speak]);

  const handleSpeakSentence = useCallback(() => {
    speak(currentSentence.text, { rate: 0.8 });
  }, [currentSentence.text, speak]);

  const handleSpeakWords = useCallback(() => {
    clearTimers();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    targetWords.forEach((word, index) => {
      const timerId = setTimeout(() => {
        speak(word, { rate: 0.9 });
      }, index * 550);
      timerIdsRef.current.push(timerId);
    });
  }, [clearTimers, targetWords, speak]);

  const handleAddWord = useCallback(
    (word: string) => {
      if (isCorrect) return;
      setConstructed((previous) => [...previous, word]);
      setBank((previous) => {
        const index = previous.indexOf(word);
        if (index === -1) return previous;
        return [
          ...previous.slice(0, index),
          ...previous.slice(index + 1),
        ];
      });
    },
    [isCorrect],
  );

  const handleRemoveWord = useCallback(
    (index: number) => {
      if (isCorrect) return;
      setConstructed((previous) => {
        const word = previous[index];
        if (word === undefined) return previous;
        return [
          ...previous.slice(0, index),
          ...previous.slice(index + 1),
        ];
      });
      setBank((previous) => {
        const word = constructed[index];
        if (word === undefined) return previous;
        return [...previous, word];
      });
    },
    [constructed, isCorrect],
  );

  // Check the constructed sentence.
  useEffect(() => {
    if (constructed.length !== targetWords.length || isCorrect) {
      return;
    }

    const currentBuilt = constructed.join(' ');
    if (currentBuilt !== currentSentence.text) {
      return;
    }

    setIsCorrect(true);
    const nextScore = score + 10;
    setScore(nextScore);

    if (!completedIds.includes(currentSentence.id)) {
      setCompletedIds((previous) => [
        ...previous,
        currentSentence.id,
      ]);
    }

    speak(currentSentence.text, { rate: 0.8 });

    const isLastSentence =
      currentIndex === SENTENCE_CURRICULUM.length - 1;

    const completionTimer = setTimeout(() => {
      if (isLastSentence) {
        completeActivity({
          id: SENTENCE_ACTIVITY_ID,
          score: Math.min(
            100,
            Math.round(
              (nextScore / (SENTENCE_CURRICULUM.length * 10)) * 100,
            ),
          ),
          academyId: 'language',
          domain: 'language',
          skillIds: SENTENCE_SKILLS,
        });
        setActivityComplete(true);
        onComplete?.(nextScore);
        return;
      }
      setCurrentIndex((previous) => previous + 1);
    }, 2500);

    timerIdsRef.current.push(completionTimer);
  }, [
    completedIds,
    completeActivity,
    constructed,
    currentIndex,
    currentSentence.id,
    currentSentence.text,
    isCorrect,
    onComplete,
    score,
    targetWords.length,
    speak,
  ]);

  const handleRestart = useCallback(() => {
    clearTimers();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentIndex(0);
    setConstructed([]);
    setBank([]);
    setIsCorrect(false);
    setScore(0);
    setCompletedIds([]);
    setActivityComplete(false);
  }, [clearTimers]);

  const progressPercent =
    SENTENCE_CURRICULUM.length > 0
      ? Math.round(
          ((currentIndex + (isCorrect ? 1 : 0)) /
            SENTENCE_CURRICULUM.length) *
            100,
        )
      : 0;

  if (activityComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto w-full max-w-xl rounded-2xl border border-app-border bg-app-card p-8 text-center shadow-xl"
      >
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-12 w-12 text-green-400" />
        </div>

        <div className="mb-2 flex items-center justify-center gap-2 text-emerald-300">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Reading Practice Complete
          </span>
          <Sparkles className="h-5 w-5" />
        </div>

        <h3 className="text-2xl font-bold text-white">
          Excellent Sentence Building!
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
          You practised recognising word order, constructing sentences,
          and reading complete sentences aloud.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-app-border bg-black/20 p-4">
            <div className="text-2xl font-bold text-white">
              {completedIds.length}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Sentences completed
            </div>
          </div>

          <div className="rounded-xl border border-app-border bg-black/20 p-4">
            <div className="text-2xl font-bold text-white">
              {score}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Session points
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-500"
        >
          <RotateCcw className="h-4 w-4" />
          Practise Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-app-border bg-app-card p-6 shadow-xl">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Reading • Sentence Skills
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Sentence Builder
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ Read instructions aloud */}
            <button
              type="button"
              onClick={() =>
                speak(`Build this sentence. ${currentSentence.pattern}.`)
              }
              aria-label="Read instructions aloud"
              className="rounded-full bg-emerald-600 p-2 text-white transition hover:bg-emerald-500"
            >
              <Volume2 className="h-4 w-4" />
            </button>

            <span className="shrink-0 rounded-full bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-300">
              Level {currentSentence.level}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Reading progression
            </span>
            <span className="font-semibold text-gray-300">
              {progressPercent}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-gray-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-label="Sentence building progression"
          >
            <motion.div
              className="h-full rounded-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Session information */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-yellow-400 font-bold">
          ⭐ {score}
        </div>

        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">
          {currentIndex + 1} / {SENTENCE_CURRICULUM.length}
        </span>

        <button
          type="button"
          onClick={handleSpeakWords}
          aria-label="Hear the sentence words"
          className="rounded-lg bg-gray-800 p-2 text-white transition hover:bg-gray-700"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      {/* Question */}
      <div className="mb-4 rounded-xl border border-gray-800 bg-[#1a1a1a] p-5 text-center">
        <p className="text-sm text-gray-400">
          Build the sentence using the words below.
        </p>
        <div className="mt-3 text-lg font-bold text-white">
          {currentSentence.pattern}
        </div>
      </div>

      {/* Constructed Sentence */}
      <div
        className={`mb-4 min-h-[90px] rounded-xl border p-4 transition ${
          isCorrect
            ? 'border-green-500/40 bg-green-500/5'
            : 'border-gray-700 bg-[#1a1a1a]'
        }`}
        aria-label="Constructed sentence"
      >
        <div className="flex min-h-[55px] flex-wrap items-center justify-center gap-2">
          <AnimatePresence mode="popLayout">
            {constructed.map((word, index) => (
              <motion.button
                key={`${word}-${index}`}
                type="button"
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleRemoveWord(index)}
                disabled={isCorrect}
                className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-gray-600 disabled:cursor-default"
                aria-label={`Remove word ${word}`}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>

          {constructed.length === 0 && (
            <span className="w-full text-center text-sm italic text-gray-500">
              Tap the words below to build the sentence.
            </span>
          )}
        </div>
      </div>

      {/* Word Bank */}
      <div className="rounded-xl border border-gray-800 bg-[#111] p-4">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
          Word Bank
        </p>

        <div className="flex min-h-[65px] flex-wrap justify-center gap-2">
          <AnimatePresence mode="popLayout">
            {bank.map((word, index) => (
              <motion.button
                key={`${word}-${index}`}
                type="button"
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleAddWord(word)}
                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow transition hover:border-indigo-400"
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Feedback */}
      <div className="mt-5 flex min-h-[48px] justify-center">
        {isCorrect ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 rounded-full border border-green-500/50 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400"
          >
            <CheckCircle2 className="h-5 w-5" />
            Perfect! Sentence completed.
          </motion.div>
        ) : constructed.length > 0 ? (
          <div className="flex items-center text-sm text-gray-500">
            Keep going — think about which word comes next.
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-500">
            Read the pattern, then arrange the words in order.
          </div>
        )}
      </div>

      {/* Read Full Sentence */}
      {isCorrect && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={handleSpeakSentence}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            <Volume2 className="h-4 w-4" />
            Hear the sentence
          </button>
        </div>
      )}
    </div>
  );
};