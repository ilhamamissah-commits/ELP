import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  RotateCcw,
  Eye,
  GitCompare,
  Ruler,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

type ActivityStage =
  | 'observe'
  | 'compare'
  | 'order'
  | 'build'
  | 'check'
  | 'complete';

type RedRod = {
  id: number;
  length: number;
  label: string;
};

const RODS: RedRod[] = [
  { id: 10, length: 10, label: 'Longest' },
  { id: 9, length: 9, label: 'Very long' },
  { id: 8, length: 8, label: 'Long' },
  { id: 7, length: 7, label: 'Long' },
  { id: 6, length: 6, label: 'Medium-long' },
  { id: 5, length: 5, label: 'Medium' },
  { id: 4, length: 4, label: 'Medium-short' },
  { id: 3, length: 3, label: 'Short' },
  { id: 2, length: 2, label: 'Very short' },
  { id: 1, length: 1, label: 'Shortest' },
];

const STAGES: ActivityStage[] = [
  'observe',
  'compare',
  'order',
  'build',
  'check',
  'complete',
];

const STAGE_LABELS: Record<ActivityStage, string> = {
  observe: 'Observe',
  compare: 'Compare',
  order: 'Order',
  build: 'Build',
  check: 'Check',
  complete: 'Reflect',
};

export const RedRods: React.FC = () => {
  const [stage, setStage] = useState<ActivityStage>('observe');
  const [selectedRods, setSelectedRods] = useState<number[]>([]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);

  const stageIndex = STAGES.indexOf(stage);

  const nextStage = () => {
    const nextIndex = stageIndex + 1;

    if (nextIndex < STAGES.length) {
      setStage(STAGES[nextIndex]);
      setSelectedRods([]);
      setFeedback('');
    }
  };

  const reset = () => {
    setStage('observe');
    setSelectedRods([]);
    setPlaced([]);
    setFeedback('');
    setAttempts(0);
  };

  const handleSelectRod = (id: number) => {
    if (selectedRods.includes(id)) {
      setSelectedRods(
        selectedRods.filter((rodId) => rodId !== id)
      );
      return;
    }

    if (selectedRods.length >= 2) {
      setSelectedRods([selectedRods[1], id]);
      return;
    }

    setSelectedRods([...selectedRods, id]);
  };

  const handleCompare = () => {
    if (selectedRods.length !== 2) {
      setFeedback('Choose two rods to compare their lengths.');
      return;
    }

    const first = RODS.find((rod) => rod.id === selectedRods[0]);
    const second = RODS.find((rod) => rod.id === selectedRods[1]);

    if (!first || !second) return;

    setAttempts((value) => value + 1);

    if (first.length > second.length) {
      setFeedback(
        `The ${first.label.toLowerCase()} rod is longer than the other rod.`
      );
    } else {
      setFeedback(
        `The ${second.label.toLowerCase()} rod is longer than the other rod.`
      );
    }
  };

  const handlePlace = (id: number) => {
    if (placed.includes(id)) return;

    setAttempts((value) => value + 1);

    if (placed.length === 0) {
      if (id === 10) {
        setPlaced([id]);
        setFeedback(
          'Excellent. The longest rod starts the sequence.'
        );
      } else {
        setFeedback(
          'Look carefully. Which rod is the longest?'
        );
      }

      return;
    }

    const lastPlaced = placed[placed.length - 1];

    if (id < lastPlaced) {
      setPlaced([...placed, id]);
      setFeedback(
        'Good comparison. The next rod is shorter.'
      );
    } else {
      setFeedback(
        'Compare the rods again. Choose one that is shorter than the last rod.'
      );
    }
  };

  const checkSequence = () => {
    const correct =
      placed.length === 10 &&
      placed.every(
        (id, index) =>
          index === 0 || id < placed[index - 1]
      );

    if (correct) {
      setStage('complete');
      setFeedback(
        'The rods are ordered correctly from longest to shortest.'
      );
    } else {
      setFeedback(
        'Look from the longest rod to the shortest. Each rod should become shorter.'
      );
    }
  };

  const renderRod = (
    rod: RedRod,
    interactive = false,
    selected = false
  ) => {
    const width = rod.length * 18;

    return (
      <motion.button
        key={rod.id}
        type="button"
        onClick={
          interactive
            ? () =>
                stage === 'compare'
                  ? handleSelectRod(rod.id)
                  : handlePlace(rod.id)
            : undefined
        }
        whileHover={interactive ? { scale: 1.04 } : undefined}
        whileTap={interactive ? { scale: 0.97 } : undefined}
        className={`
          relative flex items-center rounded-full h-4
          border-2 transition-all duration-200
          ${interactive ? 'cursor-pointer' : 'cursor-default'}
          ${
            selected
              ? 'border-white ring-2 ring-cyan-400'
              : 'border-red-700'
          }
        `}
        style={{
          width: `${width}px`,
          background:
            'linear-gradient(to bottom, #f87171, #dc2626)',
          boxShadow:
            'inset 0 -2px 3px rgba(127,29,29,0.35), 2px 3px 6px rgba(0,0,0,0.25)',
        }}
        aria-label={`${rod.label}, length ${rod.length}`}
      >
        {selected && (
          <span className="absolute right-1/2 translate-x-1/2">
            <CheckCircle className="w-4 h-4 text-white" />
          </span>
        )}
      </motion.button>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-app-card rounded-2xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Ruler className="w-5 h-5 text-red-400" />

              <h3 className="text-xl font-bold text-white">
                Red Rods
              </h3>
            </div>

            <p className="text-gray-400 text-sm">
              Explore length by comparing and ordering ten rods.
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition"
            aria-label="Reset Red Rods"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Learning progression */}
        <div className="mt-5 flex items-center gap-1 overflow-x-auto pb-1">
          {STAGES.map((item, index) => {
            const active = item === stage;
            const completed = index < stageIndex;

            return (
              <React.Fragment key={item}>
                <div
                  className={`
                    flex items-center gap-1 px-2.5 py-1.5
                    rounded-full text-xs whitespace-nowrap
                    ${
                      active
                        ? 'bg-red-400/20 text-red-200 border border-red-400/40'
                        : completed
                        ? 'bg-emerald-400/10 text-emerald-300'
                        : 'bg-gray-800 text-gray-500'
                    }
                  `}
                >
                  {completed && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {STAGE_LABELS[item]}
                </div>

                {index < STAGES.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* OBSERVE */}
        {stage === 'observe' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Eye className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Observe the rods
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                The Red Rods are the same thickness, but they are
                different lengths. Look carefully at how far each
                rod reaches.
              </p>
            </div>

            <div className="bg-gray-950 rounded-xl border border-app-border p-6">
              <div className="flex flex-col items-start gap-2">
                {RODS.map((rod) => (
                  <div
                    key={rod.id}
                    className="flex items-center gap-3"
                  >
                    {renderRod(rod)}

                    <span className="text-xs text-gray-600">
                      {rod.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/70 border border-app-border rounded-xl p-4">
              <p className="text-sm text-gray-300">
                <span className="text-red-300 font-semibold">
                  Notice:
                </span>{' '}
                Some rods are long and some are short. Their
                important difference is their <strong>length</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition"
            >
              Compare the rods
            </button>
          </motion.div>
        )}

        {/* COMPARE */}
        {stage === 'compare' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <GitCompare className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Compare two rods
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose two rods. Look carefully at their ends.
                Which rod is longer?
              </p>
            </div>

            <div className="bg-gray-950 rounded-xl border border-app-border p-6">
              <div className="flex flex-col items-start gap-3">
                {RODS.map((rod) =>
                  renderRod(
                    rod,
                    true,
                    selectedRods.includes(rod.id)
                  )
                )}
              </div>
            </div>

            {feedback && (
              <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4 text-center">
                <p className="text-sm text-cyan-100">
                  {feedback}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCompare}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
              >
                Compare
              </button>

              <button
                type="button"
                onClick={nextStage}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* ORDER */}
        {stage === 'order' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Ruler className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Think about length
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                The rods can be arranged in a sequence. Start with
                the longest and finish with the shortest.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-900 rounded-xl p-4 text-center border border-app-border">
                <div className="text-red-400 text-2xl mb-2">
                  ↔
                </div>
                <p className="text-white font-semibold text-sm">
                  Longest
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  First
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 text-center border border-app-border">
                <div className="text-red-400 text-2xl mb-2">
                  ↔
                </div>
                <p className="text-white font-semibold text-sm">
                  Shorter
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Middle
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 text-center border border-app-border">
                <div className="text-red-400 text-2xl mb-2">
                  ↔
                </div>
                <p className="text-white font-semibold text-sm">
                  Shortest
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Last
                </p>
              </div>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-300 shrink-0" />

              <p className="text-sm text-amber-100">
                <strong>Think:</strong> If a rod is longer than the
                one before it, stop and compare again.
              </p>
            </div>

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition"
            >
              Start ordering
            </button>
          </motion.div>
        )}

        {/* BUILD */}
        {stage === 'build' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h4 className="text-lg font-bold text-white">
                Build the sequence
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose the longest remaining rod. Continue with
                shorter rods.
              </p>
            </div>

            {/* Ordered rods */}
            <div className="relative min-h-[260px] bg-gray-950 rounded-xl border-2 border-dashed border-gray-700 p-5">
              {placed.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                  The longest rod belongs here.
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  {placed.map((id, index) => {
                    const rod = RODS.find((item) => item.id === id);

                    if (!rod) return null;

                    return (
                      <motion.div
                        key={`${id}-${index}`}
                        initial={{
                          opacity: 0,
                          scaleX: 0,
                          transformOrigin: 'left',
                        }}
                        animate={{
                          opacity: 1,
                          scaleX: 1,
                        }}
                        className="flex items-center gap-3"
                      >
                        {renderRod(rod)}

                        <span className="text-xs text-gray-600">
                          {index + 1}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rod bank */}
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-4 text-center uppercase tracking-wider">
                Choose a rod
              </p>

              <div className="flex flex-col items-start gap-3 overflow-x-auto">
                {RODS.filter(
                  (rod) => !placed.includes(rod.id)
                ).map((rod) => (
                  <div key={rod.id}>
                    {renderRod(rod, true)}
                  </div>
                ))}
              </div>
            </div>

            {feedback && (
              <div className="bg-gray-900/80 border border-app-border rounded-xl p-4 text-center">
                <p className="text-sm text-gray-300">
                  {feedback}
                </p>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500">
              <span>{placed.length} of 10 rods placed</span>
              <span>Attempts: {attempts}</span>
            </div>

            {placed.length === 10 && (
              <button
                type="button"
                onClick={nextStage}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition"
              >
                Check my sequence
              </button>
            )}
          </motion.div>
        )}

        {/* CHECK */}
        {stage === 'check' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Eye className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Check your sequence
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Look from the longest rod to the shortest. Does
                each rod become shorter?
              </p>
            </div>

            <div className="bg-gray-950 rounded-xl border border-app-border p-6">
              <div className="flex flex-col items-start gap-2">
                {placed.map((id, index) => {
                  const rod = RODS.find((item) => item.id === id);

                  if (!rod) return null;

                  return (
                    <motion.div
                      key={`${id}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3"
                    >
                      {renderRod(rod)}

                      <span className="text-xs text-gray-600">
                        {index + 1}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <p className="text-center text-emerald-300 text-sm">
                {feedback}
              </p>
            )}

            <button
              type="button"
              onClick={checkSequence}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition"
            >
              Check the sequence
            </button>
          </motion.div>
        )}

        {/* COMPLETE */}
        {stage === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <CheckCircle className="w-16 h-16 mx-auto text-emerald-400" />

            <div>
              <h4 className="text-2xl font-bold text-white">
                Excellent observation
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                You compared the rods by length and ordered them
                from longest to shortest.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-red-300 font-semibold text-sm">
                  You practised
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Length discrimination
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-red-300 font-semibold text-sm">
                  You explored
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Longer and shorter
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-red-300 font-semibold text-sm">
                  You developed
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Sequencing and concentration
                </p>
              </div>
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4">
              <p className="text-sm text-cyan-100">
                <strong>Reflect:</strong> How can you tell that one
                rod is longer than another?
              </p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
            >
              Explore Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
