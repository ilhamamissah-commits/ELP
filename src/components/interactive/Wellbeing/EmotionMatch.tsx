import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Lightbulb,
  RotateCcw,
  Volume2,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

/* =========================================================
   TYPES
========================================================= */

type EmotionId =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'scared'
  | 'surprised';

type ActivityStage =
  | 'identify'
  | 'response'
  | 'complete';

interface Emotion {
  id: EmotionId;
  name: string;
  emoji: string;
  description: string;
  example: string;
  helpfulResponses: string[];
  colorClass: string;
}

/* =========================================================
   DATA
========================================================= */

const EMOTIONS: Emotion[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    description:
      'You may feel happy when something good happens or when you spend time with people you care about.',
    example:
      'You finish something you worked hard on and feel proud.',
    helpfulResponses: [
      'Smile and enjoy the moment.',
      'Share your happiness with someone.',
      'Say thank you when someone helped you.',
    ],
    colorClass: 'yellow',
  },
  {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    description:
      'You may feel sad when something you care about is lost, difficult or does not go the way you hoped.',
    example:
      'A friend cannot play with you today and you feel disappointed.',
    helpfulResponses: [
      'Talk to a trusted person.',
      'Take some quiet time.',
      'Do something gentle that helps you feel cared for.',
    ],
    colorClass: 'blue',
  },
  {
    id: 'angry',
    name: 'Angry',
    emoji: '😡',
    description:
      'You may feel angry when something seems unfair, frustrating or upsetting.',
    example:
      'Someone takes your turn and you feel very frustrated.',
    helpfulResponses: [
      'Pause before reacting.',
      'Take slow breaths.',
      'Use words to explain what happened.',
    ],
    colorClass: 'red',
  },
  {
    id: 'scared',
    name: 'Scared',
    emoji: '😨',
    description:
      'You may feel scared when you think something could hurt you or when something feels unfamiliar.',
    example:
      'You hear a loud noise you were not expecting.',
    helpfulResponses: [
      'Move somewhere safe.',
      'Tell a trusted adult.',
      'Take slow breaths and remind yourself that you are safe when appropriate.',
    ],
    colorClass: 'purple',
  },
  {
    id: 'surprised',
    name: 'Surprised',
    emoji: '😲',
    description:
      'You may feel surprised when something happens that you did not expect.',
    example:
      'Someone gives you a gift when you were not expecting one.',
    helpfulResponses: [
      'Pause and notice what happened.',
      'Ask questions if you are unsure.',
      'Give yourself time to understand the situation.',
    ],
    colorClass: 'orange',
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getColorClasses = (color: string) => {
  const colors: Record<
    string,
    {
      border: string;
      background: string;
      text: string;
      button: string;
    }
  > = {
    yellow: {
      border: 'border-yellow-400/30',
      background: 'bg-yellow-400/10',
      text: 'text-yellow-300',
      button: 'bg-yellow-500 hover:bg-yellow-400',
    },
    blue: {
      border: 'border-blue-400/30',
      background: 'bg-blue-400/10',
      text: 'text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-500',
    },
    red: {
      border: 'border-red-400/30',
      background: 'bg-red-400/10',
      text: 'text-red-300',
      button: 'bg-red-600 hover:bg-red-500',
    },
    purple: {
      border: 'border-purple-400/30',
      background: 'bg-purple-400/10',
      text: 'text-purple-300',
      button: 'bg-purple-600 hover:bg-purple-500',
    },
    orange: {
      border: 'border-orange-400/30',
      background: 'bg-orange-400/10',
      text: 'text-orange-300',
      button: 'bg-orange-600 hover:bg-orange-500',
    },
  };

  return colors[color] ?? colors.blue;
};

/* =========================================================
   COMPONENT
========================================================= */

export const EmotionMatch: React.FC = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<ActivityStage>('identify');
  const [selectedResponse, setSelectedResponse] =
    useState<string | null>(null);
  const [completed, setCompleted] = useState<EmotionId[]>([]);
  const [score, setScore] = useState(0);

  const emotion = EMOTIONS[currentIndex];

  const colors = getColorClasses(emotion.colorClass);

  const progress = useMemo(() => {
    return Math.round(
      (completed.length / EMOTIONS.length) * 100
    );
  }, [completed.length]);

  /* -------------------------------------------------------
     Auto-read prompt when emotion changes (identify stage)
  ------------------------------------------------------- */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage !== 'identify') return;
    if (!emotion) return;

    const timer = window.setTimeout(() => {
      speak(
        `Can you name this feeling? Take a moment to look at the picture.`
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [currentIndex, stage, emotion, autoReadEnabled, speak]);

  /* -------------------------------------------------------
     Auto-read prompt when moving to response stage
  ------------------------------------------------------- */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage !== 'response') return;

    const timer = window.setTimeout(() => {
      speak(
        `What could help when you feel ${emotion.name.toLowerCase()}? Choose a response.`
      );
    }, 500);

    return () => window.clearTimeout(timer);
  }, [stage, emotion, autoReadEnabled, speak]);

  /* -------------------------------------------------------
     Completion narration — fires once when the stage flips
  ------------------------------------------------------- */

  useEffect(() => {
    if (stage !== 'complete') return;

    speak(
      `Wonderful work. You explored ${EMOTIONS.length} feelings. Remember, all feelings are okay to notice. What matters is learning safe and helpful ways to respond to them.`
    );
  }, [stage, speak]);

  /* -------------------------------------------------------
     Cleanup speech on unmount
  ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  /* -------------------------------------------------------
     Identify emotion
  ------------------------------------------------------- */

  const handleIdentify = () => {
    setStage('response');

    if (!completed.includes(emotion.id)) {
      setCompleted((current) => [
        ...current,
        emotion.id,
      ]);

      setScore((current) => current + 10);
    }

    speak(
      `This feeling is ${emotion.name}. ${emotion.description}`
    );
  };

  /* -------------------------------------------------------
     Choose response
  ------------------------------------------------------- */

  const handleResponse = (response: string) => {
    setSelectedResponse(response);

    speak(response);

    window.setTimeout(() => {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= EMOTIONS.length) {
        setStage('complete');
        return;
      }

      setCurrentIndex(nextIndex);
      setSelectedResponse(null);
      setStage('identify');
    }, 2200);
  };

  /* -------------------------------------------------------
     Reset
  ------------------------------------------------------- */

  const resetActivity = () => {
    stopSpeaking();

    setCurrentIndex(0);
    setStage('identify');
    setSelectedResponse(null);
    setCompleted([]);
    setScore(0);
  };

  /* =======================================================
     COMPLETE
  ======================================================= */

  if (stage === 'complete') {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-app-border bg-app-card p-6 shadow-xl md:p-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
          >
            <Heart className="h-10 w-10 text-emerald-400" />
          </motion.div>

          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Wellbeing Complete
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            You did a great job! 🌟
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">
            You explored {EMOTIONS.length} different feelings
            and learned that feelings give us information about
            what is happening inside and around us.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-app-border bg-slate-950/50 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Feelings explored
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {completed.length}
            </p>
          </div>

          <div className="rounded-2xl border border-app-border bg-slate-950/50 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              XP earned
            </p>
            <p className="mt-1 text-2xl font-bold text-cyan-300">
              {score}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 shrink-0 text-cyan-300" />

            <div>
              <h3 className="font-semibold text-white">
                Remember
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-gray-400">
                All feelings are okay to notice. What matters is
                learning safe and helpful ways to respond to them.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={resetActivity}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-app-border py-3 font-semibold text-white transition hover:bg-white/5"
        >
          <RotateCcw className="h-4 w-4" />
          Explore Again
        </button>
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-app-border bg-app-card p-6 shadow-xl md:p-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10">
          <Heart className="h-6 w-6 text-pink-300" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
          Emotional Awareness
        </p>

        <h2 className="mt-1 text-3xl font-black text-white">
          Emotion Match
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Learn to notice, name and respond to feelings.
        </p>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-gray-500">
            Feelings explored
          </span>

          <span className="font-semibold text-pink-300">
            {completed.length} / {EMOTIONS.length}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-pink-400"
          />
        </div>
      </div>

      {/* Stage indicator */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <div
          className={`rounded-xl border p-3 text-center ${
            stage === 'identify'
              ? 'border-pink-400/30 bg-pink-400/10'
              : 'border-app-border bg-slate-950/40'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Step 1
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            Notice & Name
          </p>
        </div>

        <div
          className={`rounded-xl border p-3 text-center ${
            stage === 'response'
              ? 'border-pink-400/30 bg-pink-400/10'
              : 'border-app-border bg-slate-950/40'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Step 2
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            Choose a Response
          </p>
        </div>
      </div>

      {/* Emotion card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={emotion.id}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          className={`mt-6 rounded-3xl border ${colors.border} ${colors.background} p-6 text-center`}
        >
          <div className="text-8xl">
            {emotion.emoji}
          </div>

          <h3 className="mt-4 text-2xl font-black text-white">
            {emotion.name}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            {emotion.description}
          </p>

          <div className="mt-5 rounded-2xl border border-white/5 bg-black/10 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Example
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-300">
              {emotion.example}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              speak(
                `${emotion.name}. ${emotion.description} Example: ${emotion.example}`
              )
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <Volume2 className="h-4 w-4" />
            Hear this
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Identify */}
      {stage === 'identify' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <p className="mb-3 text-center text-sm text-gray-400">
            Can you name this feeling?
          </p>

          <button
            type="button"
            onClick={handleIdentify}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white transition ${colors.button}`}
          >
            <CheckCircle className="h-4 w-4" />
            This is {emotion.name}
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* Response */}
      {stage === 'response' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-center">
            <CheckCircle className="mx-auto h-6 w-6 text-emerald-400" />

            <p className="mt-2 font-semibold text-white">
              You named the feeling!
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Now think about a helpful response.
            </p>
          </div>

          <p className="mb-3 text-sm font-semibold text-white">
            What could help?
          </p>

          <div className="space-y-2">
            {emotion.helpfulResponses.map((response) => {
              const selected =
                selectedResponse === response;

              return (
                <button
                  key={response}
                  type="button"
                  onClick={() => handleResponse(response)}
                  disabled={selectedResponse !== null}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selected
                      ? 'border-emerald-400/40 bg-emerald-400/10'
                      : 'border-app-border bg-slate-950/40 hover:border-pink-400/30 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-gray-400">
                    ✓
                  </div>

                  <span className="text-sm text-gray-300">
                    {response}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Footer guidance */}
      <div className="mt-6 rounded-2xl border border-app-border bg-slate-950/50 p-4">
        <p className="text-center text-xs leading-relaxed text-gray-500">
          Feelings are messages, not instructions. You can notice
          a feeling and choose what to do next.
        </p>
      </div>
    </div>
  );
};

export default EmotionMatch;