import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useProgressStore } from '../../../store/useProgressStore';

interface SoundCard {
  readonly id: string;
  readonly emoji: string;
  readonly word: string;
  readonly sound: string;
}

interface SoundLotteryProps {
  onComplete?: (score: number) => void;
}

const PHONICS_BANK: readonly SoundCard[] = [
  { id: 's1', emoji: '☀️', word: 'Sun', sound: 's' },
  { id: 's2', emoji: '🐍', word: 'Snake', sound: 's' },
  { id: 'a1', emoji: '🍎', word: 'Apple', sound: 'a' },
  { id: 'a2', emoji: '🐜', word: 'Ant', sound: 'a' },
  { id: 't1', emoji: '🐯', word: 'Tiger', sound: 't' },
  { id: 't2', emoji: '🌴', word: 'Tree', sound: 't' },
  { id: 'p1', emoji: '🐷', word: 'Pig', sound: 'p' },
  { id: 'p2', emoji: '🍕', word: 'Pizza', sound: 'p' },
  { id: 'i1', emoji: '🦎', word: 'Iguana', sound: 'i' },
  { id: 'i2', emoji: '🖍️', word: 'Ink', sound: 'i' },
  { id: 'n1', emoji: '🪹', word: 'Nest', sound: 'n' },
  { id: 'n2', emoji: '🥜', word: 'Nut', sound: 'n' },
];

const PHONICS_SOUNDS = ['s', 'a', 't', 'p', 'i', 'n'] as const;

const SOUND_LOTTERY_ACTIVITY_ID =
  'reading-phonics-sound-lottery-001';

const SOUND_LOTTERY_SKILLS = [
  'reading-phonemic-awareness',
  'reading-initial-sound-recognition',
  'reading-letter-sound-correspondence',
  'reading-phonics-pattern-recognition',
  'reading-auditory-discrimination',
] as const;

export const SoundLottery: React.FC<SoundLotteryProps> = ({
  onComplete,
}) => {
  // ✅ NEW: Universal read aloud hook
  const { speak } = useReadAloud();

  const [currentSound, setCurrentSound] = useState<string>('s');
  const [cards, setCards] = useState<SoundCard[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
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

  // ✅ Play the phoneme sound with a slow, clear rate
  const playSound = useCallback(
    (sound: string) => {
      speak(sound, { rate: 0.5, pitch: 1.2 });
    },
    [speak],
  );

  const setupRound = useCallback((targetSound: string) => {
    const validCards = PHONICS_BANK.filter(
      (card) => card.sound === targetSound,
    );

    const distractors = PHONICS_BANK
      .filter((card) => card.sound !== targetSound)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const newCards = [...validCards, ...distractors].sort(
      () => Math.random() - 0.5,
    );

    setCards(newCards);
    setRevealed([]);
    setFound([]);
    setIsFinished(false);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();

    const nextSound =
      PHONICS_SOUNDS[round % PHONICS_SOUNDS.length];

    setCurrentSound(nextSound);
    setupRound(nextSound);
    setRound((previousRound) => previousRound + 1);

    // ✅ Auto-speak the new target sound
    const timer = window.setTimeout(() => {
      speak(nextSound, { rate: 0.5, pitch: 1.2 });
    }, 600);
    timerIdsRef.current.push(timer);
  }, [clearTimers, round, setupRound, speak]);

  useEffect(() => {
    setupRound(PHONICS_SOUNDS[0]);
    setRound(1);

    // ✅ Auto-speak the first sound
    const timer = window.setTimeout(() => {
      speak(PHONICS_SOUNDS[0], { rate: 0.5, pitch: 1.2 });
    }, 800);
    timerIdsRef.current.push(timer);
    return () => window.clearTimeout(timer);
  }, [setupRound, speak]);

  const handleReveal = useCallback(
    (id: string, sound: string) => {
      if (
        revealed.includes(id) ||
        found.includes(id) ||
        isFinished ||
        lessonComplete
      ) {
        return;
      }

      setRevealed((previous) => [...previous, id]);

      if (sound === currentSound) {
        setFound((previous) => [...previous, id]);
        setScore((previous) => previous + 10);
        playSound(currentSound);
      } else {
        // ✅ Gentle "try again" feedback when wrong card tapped
        speak('Try another card.', { rate: 0.85 });
      }
    },
    [
      currentSound,
      found,
      isFinished,
      lessonComplete,
      playSound,
      revealed,
      speak,
    ],
  );

  useEffect(() => {
    if (cards.length === 0 || isFinished || lessonComplete) {
      return;
    }

    const correctCardIds = cards
      .filter((card) => card.sound === currentSound)
      .map((card) => card.id);

    const allFound = correctCardIds.every((id) =>
      found.includes(id),
    );

    if (!allFound || correctCardIds.length === 0) {
      return;
    }

    setIsFinished(true);

    // ✅ Celebrate the completed round
    speak('Excellent! You found all three!', { rate: 0.85 });

    const isFinalRound = round >= PHONICS_SOUNDS.length;

    const completionTimer = setTimeout(() => {
      if (isFinalRound) {
        const finalScore = Math.min(
          100,
          Math.round(
            (score / (PHONICS_SOUNDS.length * 30)) * 100,
          ),
        );

        completeActivity({
          id: SOUND_LOTTERY_ACTIVITY_ID,
          score: finalScore,
          academyId: 'language',
          domain: 'literacy',
          skillIds: SOUND_LOTTERY_SKILLS,
        });

        setLessonComplete(true);
        speak('Congratulations! You finished the Sound Lottery!', {
          rate: 0.85,
        });
        onComplete?.(score);
        return;
      }

      startGame();
    }, 1500);

    timerIdsRef.current.push(completionTimer);
  }, [
    cards,
    completeActivity,
    currentSound,
    found,
    isFinished,
    lessonComplete,
    onComplete,
    round,
    score,
    startGame,
    speak,
  ]);

  const handleRestart = useCallback(() => {
    clearTimers();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setCurrentSound(PHONICS_SOUNDS[0]);
    setCards([]);
    setRevealed([]);
    setFound([]);
    setScore(0);
    setRound(1);
    setIsFinished(false);
    setLessonComplete(false);

    setupRound(PHONICS_SOUNDS[0]);
    speak('Restarting sound lottery.', { rate: 0.85 });
  }, [clearTimers, setupRound, speak]);

  const progressPercent = Math.min(
    100,
    Math.round(
      ((Math.min(round, PHONICS_SOUNDS.length)) /
        PHONICS_SOUNDS.length) *
        100,
    ),
  );

  if (lessonComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-2xl rounded-2xl border border-app-border bg-app-card p-8 text-center shadow-xl"
      >
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-12 w-12 text-green-400" />
        </div>

        <div className="mb-2 flex items-center justify-center gap-2 text-emerald-300">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Phonics Practice Complete
          </span>
          <Sparkles className="h-5 w-5" />
        </div>

        <h3 className="text-2xl font-bold text-white">
          Great Sound Recognition!
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
          You practised identifying beginning sounds and matching
          spoken phonemes with words.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-app-border bg-black/20 p-4">
            <div className="text-2xl font-bold text-white">
              {PHONICS_SOUNDS.length}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Sounds practised
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
    <div className="mx-auto max-w-2xl rounded-2xl border border-app-border bg-app-card p-6 shadow-xl">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Reading • Phonics
            </p>
            <h3 className="mt-1 text-2xl font-bold text-white">
              Sound Lottery
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Find the words that begin with the target sound.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-yellow-400">
              ⭐ {score}
            </span>

            <button
              type="button"
              onClick={handleRestart}
              aria-label="Restart phonics practice"
              className="rounded-lg bg-gray-800 p-2 text-gray-300 transition hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Sound recognition progression
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
            aria-label="Sound recognition progression"
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

      {/* TARGET SOUND */}
      <motion.div
        key={currentSound}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-[#222222] p-5"
      >
        <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Find the sound
        </span>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => playSound(currentSound)}
            aria-label={`Hear the ${currentSound} sound`}
            className="rounded-full bg-indigo-600 p-3 text-white transition hover:bg-indigo-500"
          >
            <Volume2 className="h-6 w-6" />
          </button>

          <span className="rounded-xl border-2 border-indigo-500/30 bg-indigo-500/10 px-5 py-2 font-mono text-4xl font-bold text-indigo-400">
            /{currentSound}/
          </span>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Listen, then find all three words that start with this sound.
        </p>
      </motion.div>

      {/* LOTTERY GRID */}
      <div
        className="mx-auto mb-8 grid max-w-md grid-cols-3 gap-4"
        aria-label="Phonics word cards"
      >
        <AnimatePresence>
          {cards.map((card) => {
            const isRevealed = revealed.includes(card.id);
            const isFound = found.includes(card.id);
            const isHidden = !isRevealed && !isFound;

            return (
              <motion.button
                key={card.id}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={
                  isHidden && !isFinished ? { scale: 1.04 } : {}
                }
                whileTap={
                  isHidden && !isFinished ? { scale: 0.96 } : {}
                }
                onClick={() =>
                  handleReveal(card.id, card.sound)
                }
                disabled={
                  !isHidden || isFinished || lessonComplete
                }
                aria-label={
                  isHidden
                    ? 'Reveal word card'
                    : `${card.word}, beginning sound ${card.sound}`
                }
                className={`aspect-square rounded-2xl border-2 text-3xl transition-all duration-300 ${
                  isFound
                    ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/20'
                    : isRevealed
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-500 hover:bg-[#333]'
                }`}
              >
                {isHidden ? (
                  <span className="text-4xl opacity-20">?</span>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-4xl">{card.emoji}</span>
                    <span className="text-xs font-bold text-white/80">
                      {card.word}
                    </span>
                    {isFound && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-1"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ROUND PROGRESS */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Sounds practised</span>
          <span className="text-gray-400">
            {Math.min(round, PHONICS_SOUNDS.length)} /{' '}
            {PHONICS_SOUNDS.length}
          </span>
        </div>

        <div className="flex gap-1.5">
          {PHONICS_SOUNDS.map((sound, index) => (
            <div
              key={sound}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                index < round - 1
                  ? 'bg-green-500'
                  : index === round - 1
                    ? 'bg-indigo-500'
                    : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ROUND COMPLETION */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <p className="font-bold text-indigo-300">
                All three words found!
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Excellent sound recognition. Next sound coming up...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Round */}
      {!isFinished && (
        <div className="text-center text-sm text-gray-500">
          Round {Math.min(round, PHONICS_SOUNDS.length)} of{' '}
          {PHONICS_SOUNDS.length}
        </div>
      )}
    </div>
  );
};