import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useProgressStore } from '../../../store/useProgressStore';

interface PlantCareStep {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

const STEPS: readonly PlantCareStep[] = [
  {
    id: 'check-soil',
    icon: '🪴',
    title: 'Check the Soil',
    description:
      'Touch the soil gently. If it feels dry, the plant may need some water.',
  },
  {
    id: 'fill-watering-can',
    icon: '🚿',
    title: 'Fill the Watering Can',
    description:
      'Fill your watering can with a suitable amount of clean water.',
  },
  {
    id: 'water-base',
    icon: '💧',
    title: 'Water the Soil',
    description:
      'Pour the water gently onto the soil around the base of the plant.',
  },
  {
    id: 'check-plant',
    icon: '🌿',
    title: 'Check the Plant',
    description:
      'Look at the leaves and stem. Check that the plant looks healthy and cared for.',
  },
  {
    id: 'provide-sunlight',
    icon: '☀️',
    title: 'Give It Light',
    description:
      'Place the plant where it can receive the amount of light it needs.',
  },
  {
    id: 'plant-happy',
    icon: '🌱',
    title: 'Plant Care Complete!',
    description:
      'Wonderful! You have practiced caring for a living plant.',
  },
] as const;

const WATERING_PLANTS_ACTIVITY_ID =
  'practical-life-watering-plants-001';

const WATERING_PLANTS_SKILLS = [
  'practical-life-plant-care',
  'practical-life-environmental-care',
  'practical-life-observation',
  'practical-life-sequencing',
  'practical-life-responsibility',
  'practical-life-independence',
] as const;

export const WateringPlants: React.FC = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleNext = (): void => {
    if (step < STEPS.length - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    setCompleted(true);

    completeActivity({
      id: WATERING_PLANTS_ACTIVITY_ID,
      score: 100,
      academyId: 'montessori',
      domain: 'general',
      skillIds: WATERING_PLANTS_SKILLS,
    });
  };

  const handleRestart = (): void => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setStep(0);
    setCompleted(false);
  };

  const currentStep = STEPS[step];

  const progressPercentage =
    ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-app-border bg-app-card shadow-xl">
      {/* Header */}
      <div className="border-b border-app-border px-6 py-5 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span
            className="text-2xl"
            aria-hidden="true"
          >
            🪴
          </span>

          <h3 className="text-2xl font-bold text-white">
            Caring for Plants
          </h3>
        </div>

        <p className="text-sm text-gray-400">
          Learn how to care for a plant with patience and responsibility.
        </p>
      </div>

      {/* Progress */}
      <div className="px-6 pt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-400">
            {completed ? 'Complete' : 'Your Progress'}
          </span>

          <span className="font-semibold text-gray-300">
            {completed
              ? '100%'
              : `${Math.round(progressPercentage)}%`}
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-gray-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            completed
              ? 100
              : Math.round(progressPercentage)
          }
          aria-label="Plant care progress"
        >
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{
              width: completed
                ? '100%'
                : `${progressPercentage}%`,
            }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      <div className="p-6">
        {completed ? (
          /* Completion State */
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
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
              <span
                className="text-6xl"
                role="img"
                aria-label="Healthy plant"
              >
                🌱
              </span>
            </motion.div>

            <div className="mb-3 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />

              <p className="text-xl font-bold text-emerald-400">
                Wonderful Work!
              </p>
            </div>

            <p className="mb-6 text-sm leading-6 text-gray-400">
              You completed the plant-care routine. Caring for
              living things teaches us patience, observation,
              responsibility, and respect for our environment.
            </p>

            {/* Skill Evidence */}
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />

                <span className="font-semibold text-white">
                  Skill Practice Complete
                </span>
              </div>

              <p className="text-xs leading-5 text-gray-400">
                Plant care, observation, environmental care,
                sequencing, responsibility, and independence
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
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 text-center"
            >
              <motion.div
                initial={{
                  scale: 0.8,
                  opacity: 0.5,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
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
            <div
              className="my-5 flex justify-center gap-1.5"
              aria-label={`Step ${step + 1} of ${STEPS.length}`}
            >
              {STEPS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{
                    width: index <= step ? 28 : 8,
                  }}
                  className={`h-1.5 rounded-full ${
                    index <= step
                      ? 'bg-emerald-500'
                      : 'bg-gray-700'
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
              {step < STEPS.length - 1
                ? 'Next Step'
                : 'Finish'}

              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WateringPlants;