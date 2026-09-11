import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';

import { useProgressStore } from '../../../store/useProgressStore';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

interface BrushingStep {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

const STEPS: readonly BrushingStep[] = [
  {
    id: 'get-toothbrush',
    icon: '🪥',
    title: 'Get Your Toothbrush',
    description:
      'Pick up your toothbrush and get ready to clean your teeth.',
  },
  {
    id: 'add-toothpaste',
    icon: '🧴',
    title: 'Add Toothpaste',
    description:
      'Put a small, pea-sized amount of toothpaste on your brush.',
  },
  {
    id: 'brush-front',
    icon: '😁',
    title: 'Brush Your Front Teeth',
    description:
      'Move the toothbrush gently in small circles across your front teeth.',
  },
  {
    id: 'brush-back',
    icon: '🦷',
    title: 'Brush Your Back Teeth',
    description:
      'Remember to gently brush your back teeth and molars too.',
  },
  {
    id: 'brush-two-minutes',
    icon: '🔄',
    title: 'Brush for Two Minutes',
    description: 'Keep brushing carefully for about two minutes.',
  },
  {
    id: 'rinse',
    icon: '💦',
    title: 'Rinse & Spit',
    description: 'Spit out the toothpaste foam and rinse your mouth.',
  },
  {
    id: 'clean-smile',
    icon: '✨',
    title: 'Clean Smile!',
    description:
      'Wonderful! You have completed your tooth-brushing routine.',
  },
] as const;

const BRUSHING_ACTIVITY_ID = 'practical-life-brushing-teeth-001';

const BRUSHING_SKILLS = [
  'practical-life-personal-hygiene',
  'practical-life-self-care',
  'practical-life-sequencing',
  'practical-life-independence',
] as const;

export const BrushingTeeth: React.FC = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completeActivity = useProgressStore((state) => state.completeActivity);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  /* Auto-read the current step when it changes */
  useEffect(() => {
    if (!autoReadEnabled || completed) return;

    const currentStep = STEPS[step];
    if (!currentStep) return;

    const timer = window.setTimeout(() => {
      speak(`${currentStep.title}. ${currentStep.description}`);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [step, completed, speak, autoReadEnabled]);

  /* Announce completion */
  useEffect(() => {
    if (!completed) return;

    speak(
      'Amazing work! You completed the whole tooth-brushing routine. Your teeth are ready for a healthy smile!',
    );
  }, [completed, speak]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleNext = (): void => {
    if (step < STEPS.length - 1) {
      if (soundEnabled) playSoundFeedback('move');
      setStep((currentStep) => currentStep + 1);
      return;
    }

    if (soundEnabled) playSoundFeedback('correct');
    setCompleted(true);

    completeActivity({
      id: BRUSHING_ACTIVITY_ID,
      score: 100,
      academyId: 'montessori',
      domain: 'general',
      skillIds: BRUSHING_SKILLS,
    });
  };

  const handleRestart = (): void => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setStep(0);
    setCompleted(false);

    speak("Let's practise brushing teeth again!");
  };

  const currentStep = STEPS[step];
  const progressPercentage = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-app-border bg-app-card shadow-xl">
      {/* Header */}
      <div className="border-b border-app-border px-6 py-5 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-2xl">🦷</span>

          <h3 className="text-2xl font-bold text-white">Brushing Teeth</h3>
        </div>

        <p className="text-sm text-gray-400">
          Learn the steps for a healthy tooth-brushing routine.
        </p>
      </div>

      {/* Mute toggle */}
      <div className="flex justify-end px-6 pt-3">
        <button
          type="button"
          onClick={toggleSound}
          aria-label="Toggle sound"
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Volume2
            className={`w-4 h-4 ${
              soundEnabled ? 'text-amber-300' : 'text-gray-500'
            }`}
          />
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 pt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-400">
            {completed ? 'Complete' : 'Your Progress'}
          </span>

          <span className="font-semibold text-gray-300">
            {completed ? '100%' : `${Math.round(progressPercentage)}%`}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{
              width: completed ? '100%' : `${progressPercentage}%`,
            }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      <div className="p-6">
        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.15,
                type: 'spring',
                stiffness: 180,
              }}
              className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10"
            >
              <span className="text-6xl">😁</span>
            </motion.div>

            <div className="mb-3 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />

              <p className="text-xl font-bold text-emerald-400">
                Amazing Work!
              </p>
            </div>

            <p className="mb-6 text-sm leading-6 text-gray-400">
              You completed the whole tooth-brushing routine. Your teeth are
              ready for a healthy smile!
            </p>

            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />

                <span className="font-semibold text-white">
                  Skill Practice Complete
                </span>
              </div>

              <p className="text-xs leading-5 text-gray-400">
                Personal hygiene, self-care, sequencing and independence
                skills have been practiced.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-700 px-6 py-3 font-bold text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-app-card"
            >
              <RotateCcw className="h-4 w-4" />
              Do It Again
            </button>
          </motion.div>
        ) : (
          <>
            {/* Current Step */}
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25 }}
                className="mb-5 text-6xl"
                aria-hidden="true"
              >
                {currentStep.icon}
              </motion.div>

              <h4 className="mb-2 text-xl font-bold text-white">
                {currentStep.title}
              </h4>

              <p className="leading-6 text-gray-400">
                {currentStep.description}
              </p>

              <div className="mt-5 text-xs font-medium text-gray-500">
                Step {step + 1} of {STEPS.length}
              </div>
            </motion.div>

            {/* Step Indicators */}
            <div className="my-5 flex justify-center gap-1.5">
              {STEPS.map((item, index) => (
                <div
                  key={item.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index <= step ? 'w-7 bg-emerald-500' : 'w-2 bg-gray-700'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-app-card"
            >
              {step < STEPS.length - 1 ? 'Next Step' : 'Finish'}

              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BrushingTeeth;