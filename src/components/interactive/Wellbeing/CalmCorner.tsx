import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

/* =========================================================
   TYPES
========================================================= */

type CalmPhase =
  | 'ready'
  | 'inhale'
  | 'hold'
  | 'exhale'
  | 'complete';

type Mood =
  | 'calm'
  | 'okay'
  | 'happy'
  | 'tired'
  | 'worried';

/* =========================================================
   CONSTANTS
========================================================= */

const TOTAL_ROUNDS = 3;

const PHASE_DURATION = {
  inhale: 4000,
  hold: 2000,
  exhale: 5000,
};

const MOODS: {
  id: Mood;
  label: string;
  emoji: string;
}[] = [
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
  },
  {
    id: 'okay',
    label: 'Okay',
    emoji: '🙂',
  },
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
  },
  {
    id: 'tired',
    label: 'Tired',
    emoji: '😴',
  },
  {
    id: 'worried',
    label: 'Worried',
    emoji: '😟',
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export const CalmCorner: React.FC = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);

  const { speak, stopSpeaking } = useReadAloud();

  const [phase, setPhase] = useState<CalmPhase>('ready');
  const [round, setRound] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(
    null
  );

  /* -------------------------------------------------------
     Progress
  ------------------------------------------------------- */

  const progress = useMemo(() => {
    if (phase === 'complete') {
      return 100;
    }

    return Math.round((round / TOTAL_ROUNDS) * 100);
  }, [phase, round]);

  /* -------------------------------------------------------
     Start exercise
  ------------------------------------------------------- */

  const startExercise = () => {
    setRound(1);
    setIsPaused(false);
    setPhase('inhale');

    speak('Breathe in slowly.');
  };

  /* -------------------------------------------------------
     Reset
  ------------------------------------------------------- */

  const resetExercise = useCallback(() => {
    stopSpeaking();

    setPhase('ready');
    setRound(0);
    setIsPaused(false);
  }, [stopSpeaking]);

  /* -------------------------------------------------------
     Breathing engine
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      phase === 'ready' ||
      phase === 'complete' ||
      isPaused
    ) {
      return;
    }

    const duration =
      PHASE_DURATION[phase as keyof typeof PHASE_DURATION];

    const timer = window.setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('hold');
        speak('Hold gently.');
        return;
      }

      if (phase === 'hold') {
        setPhase('exhale');
        speak('Breathe out slowly.');
        return;
      }

      if (phase === 'exhale') {
        if (round >= TOTAL_ROUNDS) {
          setPhase('complete');
          speak(
            'Well done. Take a moment to notice how you feel.'
          );
        } else {
          setRound((current) => current + 1);
          setPhase('inhale');
          speak('Breathe in slowly.');
        }
      }
    }, duration);

    return () => window.clearTimeout(timer);
  }, [phase, round, isPaused, speak]);

  /* -------------------------------------------------------
     Auto-read intro when idle on Ready screen
  ------------------------------------------------------- */

  useEffect(() => {
    if (phase !== 'ready') return;

    const timer = window.setTimeout(() => {
      speak(
        'Calm Corner. A quiet space to pause, breathe and notice how you feel. Press start when you are ready.'
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [phase, speak]);

  /* -------------------------------------------------------
     Cleanup speech on unmount
  ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  /* -------------------------------------------------------
     Phase labels
  ------------------------------------------------------- */

  const phaseLabel = {
    ready: 'Ready when you are',
    inhale: 'Breathe in',
    hold: 'Hold gently',
    exhale: 'Breathe out',
    complete: 'You did it!',
  }[phase];

  const phaseInstruction = {
    ready: 'Take a quiet moment and get comfortable.',
    inhale: 'Slowly breathe in through your nose.',
    hold: 'Pause gently. There is no need to force it.',
    exhale: 'Slowly breathe out and relax your shoulders.',
    complete: 'Notice how your body feels now.',
  }[phase];

  /* -------------------------------------------------------
     Animation (respect reduceMotion)
  ------------------------------------------------------- */

  const breathingAnimation = reduceMotion
    ? { scale: 1 }
    : phase === 'inhale'
      ? { scale: 1.35 }
      : phase === 'exhale'
        ? { scale: 0.8 }
        : { scale: 1 };

  const ambientScale = reduceMotion
    ? 1
    : phase === 'inhale'
      ? [1, 1.08, 1.15]
      : phase === 'exhale'
        ? [1.15, 1.08, 1]
        : 1;

  /* =======================================================
     COMPLETE STATE
  ======================================================= */

  if (phase === 'complete') {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-app-border bg-app-card p-6 shadow-xl md:p-8">
        <div className="text-center">
          <motion.div
            initial={reduceMotion ? { scale: 1 } : { scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
          >
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </motion.div>

          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Calm Corner Complete
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Well done 🌿
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">
            You completed {TOTAL_ROUNDS} breathing rounds.
            Taking a calm moment can help you pause, notice
            your feelings and prepare for what comes next.
          </p>
        </div>

        {/* Mood check-in */}
        <div className="mt-8">
          <h3 className="text-center font-semibold text-white">
            How do you feel now?
          </h3>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => {
                  setSelectedMood(mood.id);
                  speak(`You feel ${mood.label.toLowerCase()}. Thank you for noticing.`);
                }}
                className={`rounded-xl border p-2 text-center transition ${
                  selectedMood === mood.id
                    ? 'border-cyan-400/50 bg-cyan-400/10'
                    : 'border-app-border bg-slate-900/50 hover:bg-white/5'
                }`}
                aria-pressed={selectedMood === mood.id}
              >
                <span className="block text-2xl">
                  {mood.emoji}
                </span>

                <span className="mt-1 block text-[10px] text-gray-400">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={resetExercise}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-app-border py-3 font-semibold text-white transition hover:bg-white/5"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  /* =======================================================
     MAIN VIEW
  ======================================================= */

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-app-border bg-app-card p-6 shadow-xl md:p-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10">
          <Heart className="h-6 w-6 text-teal-300" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Wellbeing
        </p>

        <h2 className="mt-1 text-3xl font-black text-white">
          Calm Corner
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
          A quiet space to pause, breathe and notice how you
          feel.
        </p>
      </div>

      {/* Progress */}
      {phase !== 'ready' && (
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-gray-500">
              Breathing progress
            </span>

            <span className="font-semibold text-teal-300">
              Round {round} / {TOTAL_ROUNDS}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-teal-400"
            />
          </div>
        </div>
      )}

      {/* Breathing area */}
      <div className="relative mt-7 flex min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-teal-400/10 bg-gradient-to-b from-slate-950 to-teal-950/20">
        {/* Ambient rings */}
        <motion.div
          animate={{
            scale: ambientScale,
            opacity:
              phase === 'ready'
                ? 0.35
                : 0.65,
          }}
          transition={{
            duration:
              phase === 'inhale'
                ? 4
                : phase === 'exhale'
                  ? 5
                  : 1,
            ease: 'easeInOut',
          }}
          className="absolute h-64 w-64 rounded-full border border-teal-400/10"
        />

        <motion.div
          animate={{
            scale: breathingAnimation.scale,
          }}
          transition={{
            duration:
              phase === 'inhale'
                ? 4
                : phase === 'exhale'
                  ? 5
                  : 0.8,
            ease: 'easeInOut',
          }}
          className="relative flex h-40 w-40 items-center justify-center rounded-full border border-teal-300/30 bg-teal-400/10 shadow-[0_0_70px_rgba(45,212,191,0.12)]"
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-teal-400/10">
            <span className="text-4xl">🌿</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative z-10 mt-8 text-center"
          >
            <h3 className="text-xl font-bold text-white">
              {phaseLabel}
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-400">
              {phaseInstruction}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-3">
        {phase === 'ready' ? (
          <button
            type="button"
            onClick={startExercise}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-bold text-white transition hover:bg-teal-500"
          >
            <Play className="h-4 w-4" />
            Start Calm Exercise
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setIsPaused((current) => {
                  const next = !current;
                  if (next) {
                    stopSpeaking();
                  } else {
                    // Resuming — re-announce the current phase
                    speak(phaseInstruction);
                  }
                  return next;
                });
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-bold text-white transition hover:bg-teal-500"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  Continue
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetExercise}
              className="rounded-xl border border-app-border px-4 text-gray-300 transition hover:bg-white/5 hover:text-white"
              aria-label="Restart breathing exercise"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={toggleSound}
          className="rounded-xl border border-app-border px-4 text-gray-300 transition hover:bg-white/5 hover:text-white"
          aria-label={
            soundEnabled
              ? 'Turn voice guidance off'
              : 'Turn voice guidance on'
          }
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-amber-300" />
          ) : (
            <VolumeX className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Guidance */}
      <div className="mt-6 rounded-2xl border border-app-border bg-slate-950/50 p-4">
        <p className="text-center text-xs leading-relaxed text-gray-500">
          There is no perfect way to breathe here. Follow the
          gentle rhythm, stay comfortable and stop if you feel
          uncomfortable.
        </p>
      </div>
    </div>
  );
};

export default CalmCorner;