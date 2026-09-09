import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { PHONICS_CURRICULUM } from '../../../data/phonicsCurriculum';
import { useProgressStore } from '../../../store/useProgressStore';


const PHONICS_ACTIVITY_ID = 'reading-phonics-blending-001';

const PHONICS_SKILLS = [
  'reading-phonemic-awareness',
  'reading-letter-sound-correspondence',
  'reading-phoneme-blending',
  'reading-word-decoding',
  'reading-phonics-pattern-recognition',
  'reading-oral-reading-foundation',
] as const;

export const PhonicsBlender: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [blended, setBlended] = useState(false);
  const [score, setScore] = useState(0);
  const [isBlending, setIsBlending] = useState(false);
  const [curriculumComplete, setCurriculumComplete] = useState(false);

  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  const level = PHONICS_CURRICULUM[currentLevel];

  const currentWord = level?.words[currentWordIndex];

  const totalLevels = PHONICS_CURRICULUM.length;

  const totalWords = useMemo(
    () =>
      PHONICS_CURRICULUM.reduce(
        (total, phonicsLevel) => total + phonicsLevel.words.length,
        0,
      ),
    [],
  );

  const completedWordsBeforeCurrentLevel = useMemo(
    () =>
      PHONICS_CURRICULUM.slice(0, currentLevel).reduce(
        (total, phonicsLevel) => total + phonicsLevel.words.length,
        0,
      ),
    [currentLevel],
  );

  const overallWordProgress = currentWord
    ? completedWordsBeforeCurrentLevel + currentWordIndex
    : 0;

  const wordProgressPercent =
    totalWords > 0
      ? Math.round((overallWordProgress / totalWords) * 100)
      : 0;

  const levelProgressPercent =
    level && level.words.length > 0
      ? Math.round(((currentWordIndex + 1) / level.words.length) * 100)
      : 0;

  const clearSpeechTimers = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });

    timeoutIdsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearSpeechTimers();

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearSpeechTimers]);

  const speak = useCallback((text: string, rate = 0.7): void => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.15;

    window.speechSynthesis.speak(utterance);
  }, []);

  const speakSounds = useCallback((): void => {
    if (!currentWord) {
      return;
    }

    clearSpeechTimers();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    currentWord.sounds.forEach((sound, index) => {
      const timeoutId = setTimeout(() => {
        speak(sound, 0.65);
      }, index * 700);

      timeoutIdsRef.current.push(timeoutId);
    });
  }, [clearSpeechTimers, currentWord, speak]);

  const handleBlend = useCallback((): void => {
    if (!currentWord || isBlending || blended) {
      return;
    }

    setIsBlending(true);

    clearSpeechTimers();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    currentWord.sounds.forEach((sound, index) => {
      const timeoutId = setTimeout(() => {
        speak(sound, 0.65);
      }, index * 700);

      timeoutIdsRef.current.push(timeoutId);
    });

    const blendDelay = currentWord.sounds.length * 700 + 300;

    const completionTimeout = setTimeout(() => {
      speak(currentWord.word, 0.55);

      setBlended(true);
      setIsBlending(false);
      setScore((previousScore) => previousScore + 1);

      completeActivity({
        id: PHONICS_ACTIVITY_ID,
        score: 100,
        academyId: 'language',
        domain: 'literacy',
        skillIds: PHONICS_SKILLS,
      });
    }, blendDelay);

    timeoutIdsRef.current.push(completionTimeout);
  }, [
    blended,
    clearSpeechTimers,
    completeActivity,
    currentWord,
    isBlending,
    speak,
  ]);

  const handleNextWord = useCallback((): void => {
    if (!level) {
      return;
    }

    clearSpeechTimers();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentWordIndex < level.words.length - 1) {
      setCurrentWordIndex((previousIndex) => previousIndex + 1);
      setBlended(false);
      setIsBlending(false);
      return;
    }

    if (currentLevel < totalLevels - 1) {
      setCurrentLevel((previousLevel) => previousLevel + 1);
      setCurrentWordIndex(0);
      setBlended(false);
      setIsBlending(false);
      return;
    }

    setCurriculumComplete(true);
    setBlended(false);
    setIsBlending(false);
  }, [
    clearSpeechTimers,
    currentLevel,
    currentWordIndex,
    level,
    totalLevels,
  ]);

  const handleRestart = useCallback((): void => {
    clearSpeechTimers();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setCurrentLevel(0);
    setCurrentWordIndex(0);
    setBlended(false);
    setIsBlending(false);
    setCurriculumComplete(false);
    setScore(0);
  }, [clearSpeechTimers]);

  if (!level || !currentWord) {
    return (
      <div className="max-w-lg mx-auto rounded-2xl border border-app-border bg-app-card p-8 text-center shadow-xl">
        <div className="mb-4 text-5xl">📚</div>

        <h3 className="text-xl font-bold text-white">
          Phonics Practice Unavailable
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          No phonics learning content is currently available.
        </p>
      </div>
    );
  }

  if (curriculumComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg rounded-2xl border border-app-border bg-app-card p-8 text-center shadow-xl"
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
          Excellent Blending Work!
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          You practised listening to individual sounds, blending phonemes,
          and decoding words across the phonics sequence.
        </p>

        <div className="mt-6 rounded-xl border border-app-border bg-black/20 p-4">
          <div className="text-3xl font-bold text-white">{score}</div>
          <div className="mt-1 text-xs text-gray-400">
            Words blended during this session
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
    <div className="mx-auto max-w-lg rounded-2xl border border-app-border bg-app-card p-6 text-center shadow-xl">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Reading • Phonics
            </p>

            <h3 className="mt-1 text-xl font-bold text-white">
              {level.title}
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-300">
            {level.patternFocus}
          </span>
        </div>

        {/* Overall Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Phonics progression
            </span>

            <span className="font-semibold text-gray-300">
              {wordProgressPercent}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-gray-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={wordProgressPercent}
            aria-label="Phonics progression"
          >
            <motion.div
              className="h-full rounded-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${wordProgressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Learning Card */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-[#1a1a1a] p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Level {currentLevel + 1} of {totalLevels}
          </span>

          <span className="text-xs font-medium text-gray-500">
            Word {currentWordIndex + 1} of {level.words.length}
          </span>
        </div>

        {/* Sound Squares */}
        <div
          className="mb-7 flex flex-wrap justify-center gap-3"
          aria-label="Individual phonemes"
        >
          {currentWord.sounds.map((sound, index) => (
            <motion.button
              key={`${sound}-${index}`}
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: index * 0.08,
                type: 'spring',
                stiffness: 300,
              }}
              onClick={() => speak(sound, 0.65)}
              disabled={isBlending}
              aria-label={`Hear sound ${sound}`}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-bold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sound}
            </motion.button>
          ))}
        </div>

        {/* Blending Instruction */}
        {!blended && (
          <motion.div
            key={`instruction-${currentWord.word}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-800 bg-black/20 px-4 py-3"
          >
            <p className="text-sm font-medium text-gray-300">
              Tap each sound. Listen carefully, then blend the sounds into
              one word.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Say the sounds smoothly from left to right.
            </p>
          </motion.div>
        )}

        {/* Blended Word */}
        {blended && (
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 15,
            }}
            className="text-center"
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-400">
              Blended Word
            </div>

            <button
              type="button"
              onClick={() => speak(currentWord.word, 0.55)}
              className="group"
              aria-label={`Hear the word ${currentWord.word}`}
            >
              <span className="block text-5xl font-black tracking-wide text-white transition group-hover:text-indigo-300">
                {currentWord.word}
              </span>

              <span className="mt-3 block text-4xl">
                {currentWord.emoji}
              </span>
            </button>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-sm font-semibold text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Successfully blended
            </div>
          </motion.div>
        )}
      </div>

      {/* Current Level Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Current phonics stage</span>
          <span className="text-gray-400">
            {currentWordIndex + 1}/{level.words.length}
          </span>
        </div>

        <div
          className="h-1.5 overflow-hidden rounded-full bg-gray-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={levelProgressPercent}
          aria-label="Current phonics stage progress"
        >
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgressPercent}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div
        className="mb-6 flex justify-center gap-1.5"
        aria-label="Word progression"
      >
        {level.words.map((word, index) => (
          <div
            key={`${word.word}-${index}`}
            className={`h-1.5 rounded-full transition-all ${
              index < currentWordIndex
                ? 'w-6 bg-green-500'
                : index === currentWordIndex
                  ? 'w-8 bg-indigo-500'
                  : 'w-2 bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        {!blended ? (
          <>
            <button
              type="button"
              onClick={handleBlend}
              disabled={isBlending}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Play className="h-4 w-4" />
              {isBlending ? 'Blending...' : 'Blend Sounds'}
            </button>

            <button
              type="button"
              onClick={speakSounds}
              disabled={isBlending}
              aria-label="Hear all sounds"
              className="rounded-xl bg-gray-700 px-4 py-3 font-bold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleNextWord}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-500"
            >
              {currentWordIndex === level.words.length - 1 &&
              currentLevel === totalLevels - 1
                ? 'Finish Practice'
                : 'Next Word'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => speak(currentWord.word, 0.55)}
              aria-label={`Hear ${currentWord.word}`}
              className="rounded-xl bg-gray-700 px-4 py-3 font-bold text-white transition hover:bg-gray-600"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Session Score */}
      <div className="mt-5 text-xs text-gray-500">
        Words blended this session:{' '}
        <span className="font-semibold text-gray-300">{score}</span>
      </div>
    </div>
  );
};