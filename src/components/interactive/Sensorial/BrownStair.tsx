import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Eye,
  HelpCircle,
  RotateCcw,
  Ruler,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

type StairPiece = {
  id: number;
  thickness: number;
  label: string;
};

type ActivityStage =
  | 'observe'
  | 'compare'
  | 'build'
  | 'check'
  | 'complete';

const PRISMS: StairPiece[] = [
  { id: 10, thickness: 10, label: 'Thickest' },
  { id: 9, thickness: 9, label: 'Very thick' },
  { id: 8, thickness: 8, label: 'Thick' },
  { id: 7, thickness: 7, label: 'Quite thick' },
  { id: 6, thickness: 6, label: 'Medium-thick' },
  { id: 5, thickness: 5, label: 'Medium' },
  { id: 4, thickness: 4, label: 'Medium-thin' },
  { id: 3, thickness: 3, label: 'Thin' },
  { id: 2, thickness: 2, label: 'Very thin' },
  { id: 1, thickness: 1, label: 'Thinnest' },
];

const STAGES: ActivityStage[] = [
  'observe',
  'compare',
  'build',
  'check',
  'complete',
];

const STAGE_LABELS: Record<ActivityStage, string> = {
  observe: 'Observe',
  compare: 'Compare',
  build: 'Build',
  check: 'Check',
  complete: 'Complete',
};

export const BrownStair: React.FC = () => {
  const [placed, setPlaced] = useState<number[]>([]);
  const [stage, setStage] = useState<ActivityStage>('observe');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<
    number[]
  >([]);

  const currentPiece = useMemo(() => {
    if (placed.length === 0) return null;

    const lastId = placed[placed.length - 1];

    return PRISMS.find((piece) => piece.id === lastId) ?? null;
  }, [placed]);

  const progress =
    ((STAGES.indexOf(stage) + 1) / STAGES.length) * 100;

  const remainingPieces = PRISMS.filter(
    (piece) => !placed.includes(piece.id)
  );

  const handleStart = () => {
    setStage('compare');
  };

  const handleComparison = (id: number) => {
    setSelectedForComparison((current) => {
      if (current.includes(id)) {
        return current.filter((pieceId) => pieceId !== id);
      }

      if (current.length >= 2) {
        return [current[1], id];
      }

      return [...current, id];
    });
  };

  const startBuilding = () => {
    setSelectedForComparison([]);
    setStage('build');
  };

  const handlePlace = (id: number) => {
    setAttempts((current) => current + 1);

    if (placed.length === 0) {
      if (id !== 10) {
        setShowHint(true);
        return;
      }

      setPlaced([id]);
      setShowHint(false);
      return;
    }

    const previousId = placed[placed.length - 1];

    if (id >= previousId) {
      setShowHint(true);
      return;
    }

    const nextPlaced = [...placed, id];

    setPlaced(nextPlaced);
    setShowHint(false);

    if (nextPlaced.length === PRISMS.length) {
      setStage('check');
    }
  };

  const checkStair = () => {
    if (placed.length !== PRISMS.length) return;

    const isCorrect = placed.every(
      (id, index) =>
        index === 0 || id < placed[index - 1]
    );

    if (isCorrect) {
      setStage('complete');
    }
  };

  const reset = () => {
    setPlaced([]);
    setStage('observe');
    setAttempts(0);
    setShowHint(false);
    setSelectedForComparison([]);
  };

  const selectedPieces = selectedForComparison
    .map((id) => PRISMS.find((piece) => piece.id === id))
    .filter(Boolean) as StairPiece[];

  return (
    <div className="max-w-3xl mx-auto bg-app-card p-5 md:p-7 rounded-3xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Ruler className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">
              Brown Stair
            </h3>

            <p className="text-xs text-gray-500">
              Visual discrimination of dimension
            </p>
          </div>
        </div>

        <button
          onClick={reset}
          aria-label="Reset activity"
          className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Learning sequence */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-400">
            {STAGE_LABELS[stage]}
          </span>

          <span className="text-xs text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between mt-2">
          {STAGES.map((item) => (
            <span
              key={item}
              className={`text-[10px] ${
                STAGE_ORDER_INDEX(item) <= STAGE_ORDER_INDEX(stage)
                  ? 'text-amber-400'
                  : 'text-gray-600'
              }`}
            >
              {STAGE_LABELS[item]}
            </span>
          ))}
        </div>
      </div>

      {/* INTRO / OBSERVE */}
      {stage === 'observe' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-amber-400" />

              <p className="font-bold text-amber-200">
                Look carefully
              </p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              The Brown Stair is made of prisms that have the same length
              but different thicknesses.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              Your task is to notice the difference in thickness and build
              the stair from the thickest prism to the thinnest.
            </p>
          </div>

          {/* Visual sample */}
          <div className="rounded-2xl bg-black/20 border border-gray-800 p-5 mb-5">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
              Look for the difference
            </p>

            <div className="flex items-end justify-center gap-2 h-28">
              {[10, 7, 4, 1].map((size) => (
                <motion.div
                  key={size}
                  initial={{ height: 0 }}
                  animate={{ height: size * 7 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 bg-amber-700 border border-amber-900 rounded-sm"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            I’m Ready to Compare
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* COMPARE */}
      {stage === 'compare' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />

              <p className="font-bold text-indigo-200">
                Compare two prisms
              </p>
            </div>

            <p className="text-gray-400 text-sm">
              Select two pieces. Look closely at their thickness.
              Which one is thicker?
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 p-5 rounded-2xl bg-black/20 border border-gray-800 mb-5">
            {[10, 7, 5, 3, 1].map((id) => {
              const piece = PRISMS.find((item) => item.id === id)!;
              const selected = selectedForComparison.includes(id);

              return (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleComparison(id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-700 bg-gray-900'
                  }`}
                >
                  <div
                    className="w-14 bg-amber-700 border border-amber-900 rounded-sm"
                    style={{ height: `${piece.thickness * 7}px` }}
                  />
                </motion.button>
              );
            })}
          </div>

          {selectedPieces.length === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-5"
            >
              <p className="text-green-300 font-semibold text-sm">
                Look closely. One prism is thicker than the other.
                Your eyes can help you notice the difference.
              </p>
            </motion.div>
          )}

          <button
            onClick={startBuilding}
            disabled={selectedPieces.length !== 2}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-colors"
          >
            Start Building
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* BUILD */}
      {stage === 'build' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-bold">
                Build the Brown Stair
              </p>

              <p className="text-gray-500 text-sm">
                Thickest first → thinnest last
              </p>
            </div>

            <span className="text-xs text-gray-500">
              {placed.length} / {PRISMS.length}
            </span>
          </div>

          {/* Stair construction area */}
          <div className="relative w-full min-h-[330px] bg-black/20 rounded-2xl border border-gray-800 p-4 mb-5 overflow-hidden">
            <div className="absolute bottom-4 left-4 right-4 h-px bg-gray-700" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <AnimatePresence>
                {placed.map((id, index) => {
                  const piece = PRISMS.find(
                    (item) => item.id === id
                  )!;

                  return (
                    <motion.div
                      key={`${id}-${index}`}
                      initial={{ opacity: 0, y: -30, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="bg-amber-700 border-2 border-amber-900 rounded-sm shadow-lg"
                      style={{
                        width: 'min(92%, 440px)',
                        height: `${piece.thickness * 6}px`,
                      }}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {placed.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-600 text-sm">
                  Your stair will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Hint */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
            >
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />

              <p className="text-amber-200 text-sm leading-relaxed">
                Look at the last prism you placed. Find one that is
                <strong> thinner</strong> than it.
              </p>
            </motion.div>
          )}

          {/* Pieces */}
          <div className="rounded-2xl bg-black/20 border border-gray-800 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4 text-center">
              Choose the next prism
            </p>

            <div className="flex flex-wrap items-end justify-center gap-3 min-h-[110px]">
              {remainingPieces.map((piece) => (
                <motion.button
                  key={piece.id}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePlace(piece.id)}
                  aria-label={`${piece.label} prism`}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
                >
                  <div
                    className="w-12 bg-amber-700 border-2 border-amber-900 rounded-sm"
                    style={{
                      height: `${piece.thickness * 7}px`,
                    }}
                  />

                  <span className="text-[10px] text-gray-500">
                    {piece.thickness}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-600">
              Attempts: {attempts}
            </p>

            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Need a hint?
            </button>
          </div>
        </motion.div>
      )}

      {/* CHECK */}
      {stage === 'check' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Eye className="w-10 h-10 text-indigo-400" />
          </div>

          <h4 className="text-2xl font-bold text-white mb-2">
            Look at your stair
          </h4>

          <p className="text-gray-400 text-sm mb-6">
            Does it gradually change from the thickest prism to the
            thinnest prism?
          </p>

          <div className="rounded-2xl bg-black/20 border border-gray-800 p-5 mb-6">
            <div className="flex flex-col items-center">
              {placed.map((id, index) => {
                const piece = PRISMS.find(
                  (item) => item.id === id
                )!;

                return (
                  <div
                    key={`${id}-${index}`}
                    className="bg-amber-700 border border-amber-900 rounded-sm"
                    style={{
                      width: 'min(90%, 420px)',
                      height: `${piece.thickness * 6}px`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={checkStair}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            Check My Stair
            <CheckCircle className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* COMPLETE */}
      {stage === 'complete' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <h4 className="text-3xl font-bold text-white mb-2">
            Brown Stair Complete
          </h4>

          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            You successfully ordered the prisms by thickness,
            from thickest to thinnest.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-black/20 border border-gray-800">
              <Eye className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
              <p className="text-xs text-gray-400">
                Observation
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-gray-800">
              <Ruler className="w-5 h-5 mx-auto mb-2 text-amber-400" />
              <p className="text-xs text-gray-400">
                Dimension
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-gray-800">
              <Sparkles className="w-5 h-5 mx-auto mb-2 text-green-400" />
              <p className="text-xs text-gray-400">
                Sequencing
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 mb-6 text-left">
            <p className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-2">
              What did you practise?
            </p>

            <p className="text-gray-300 text-sm leading-relaxed">
              You used your eyes to discriminate differences in
              thickness and arranged objects in a gradual sequence.
              This kind of activity prepares the mind for ordering,
              comparison, measurement, and mathematical thinking.
            </p>
          </div>

          <button
            onClick={reset}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Practise Again
          </button>
        </motion.div>
      )}

      {/* Montessori principle */}
      <div className="mt-6 pt-5 border-t border-gray-800">
        <p className="text-center text-xs text-gray-500 leading-relaxed">
          Montessori Sensorial Principle: isolate one quality,
          observe carefully, compare, order, and discover the pattern.
        </p>
      </div>
    </div>
  );
};

/**
 * Small helper used only for displaying the stage labels.
 * Keeping this separate makes the JSX easier to read.
 */
const STAGE_ORDER_INDEX = (stage: ActivityStage): number =>
  STAGES.indexOf(stage);
