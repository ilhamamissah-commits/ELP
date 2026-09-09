import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Eye,
  Palette,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

type ColorId =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'purple'
  | 'orange';

type ActivityStage =
  | 'observe'
  | 'identify'
  | 'match'
  | 'discriminate'
  | 'complete';

type ColorTablet = {
  id: ColorId;
  name: string;
  hex: string;
  dark: string;
  description: string;
};

const COLORS: ColorTablet[] = [
  {
    id: 'red',
    name: 'Red',
    hex: '#ef4444',
    dark: '#991b1b',
    description: 'A strong, warm color.',
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#3b82f6',
    dark: '#1e40af',
    description: 'A cool color often seen in the sky and water.',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#f59e0b',
    dark: '#92400e',
    description: 'A bright, warm color.',
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#22c55e',
    dark: '#14532d',
    description: 'A color commonly seen in leaves and plants.',
  },
  {
    id: 'purple',
    name: 'Purple',
    hex: '#a855f7',
    dark: '#581c87',
    description: 'A color made from the visual qualities of red and blue.',
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#f97316',
    dark: '#9a3412',
    description: 'A warm color between red and yellow.',
  },
];

const STAGES: ActivityStage[] = [
  'observe',
  'identify',
  'match',
  'discriminate',
  'complete',
];

const STAGE_LABELS: Record<ActivityStage, string> = {
  observe: 'Observe',
  identify: 'Identify',
  match: 'Match',
  discriminate: 'Discriminate',
  complete: 'Complete',
};

export const ColorTablets: React.FC = () => {
  const [stage, setStage] = useState<ActivityStage>('observe');
  const [revealed, setRevealed] = useState<ColorId[]>([]);
  const [matched, setMatched] = useState<ColorId[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorId | null>(null);
  const [targetColor, setTargetColor] = useState<ColorId | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const progress =
    ((STAGES.indexOf(stage) + 1) / STAGES.length) * 100;

  const remainingColors = useMemo(
    () => COLORS.filter((color) => !matched.includes(color.id)),
    [matched]
  );

  const target = COLORS.find((color) => color.id === targetColor);

  const handleReveal = (id: ColorId) => {
    if (!revealed.includes(id)) {
      setRevealed((current) => [...current, id]);
    }
  };

  const startMatching = () => {
    setStage('match');
    setFeedback(null);
    setSelectedColor(null);

    const firstUnmatched =
      COLORS.find((color) => !matched.includes(color.id)) ?? COLORS[0];

    setTargetColor(firstUnmatched.id);
  };

  const selectMatch = (id: ColorId) => {
    if (!targetColor) return;

    setSelectedColor(id);
    setAttempts((current) => current + 1);

    if (id === targetColor) {
      setFeedback('That matches! You noticed the same color.');
      setMatched((current) =>
        current.includes(id) ? current : [...current, id]
      );

      setTimeout(() => {
        const nextUnmatched = COLORS.find(
          (color) => !matched.includes(color.id) && color.id !== id
        );

        if (!nextUnmatched) {
          setStage('discriminate');
          setTargetColor(null);
          setSelectedColor(null);
          setFeedback(null);
          return;
        }

        setTargetColor(nextUnmatched.id);
        setSelectedColor(null);
        setFeedback(null);
      }, 900);
    } else {
      setFeedback(
        'Look carefully at the two colors. Are they exactly the same?'
      );
    }
  };

  const finishDiscrimination = () => {
    setStage('complete');
  };

  const reset = () => {
    setStage('observe');
    setRevealed([]);
    setMatched([]);
    setSelectedColor(null);
    setTargetColor(null);
    setFeedback(null);
    setAttempts(0);
  };

  return (
    <div className="max-w-3xl mx-auto bg-app-card p-5 md:p-7 rounded-3xl border border-app-border shadow-xl">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">
              Color Tablets
            </h3>

            <p className="text-xs text-gray-500">
              Visual discrimination of color
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

      {/* PROGRESS */}
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
            className="h-full bg-purple-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between mt-2">
          {STAGES.map((item) => (
            <span
              key={item}
              className={`text-[10px] ${
                STAGES.indexOf(item) <= STAGES.indexOf(stage)
                  ? 'text-purple-400'
                  : 'text-gray-600'
              }`}
            >
              {STAGE_LABELS[item]}
            </span>
          ))}
        </div>
      </div>

      {/* OBSERVE */}
      {stage === 'observe' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-purple-500/10 border border-purple-500/20 p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-purple-400" />

              <p className="font-bold text-purple-200">
                Look carefully
              </p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Colors can look different from one another. Take your time
              and use your eyes to notice the differences.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-5 rounded-2xl bg-black/20 border border-gray-800 mb-5">
            {COLORS.map((color) => (
              <motion.div
                key={color.id}
                whileHover={{ scale: 1.04 }}
                className="aspect-[2/3] rounded-xl border-2 border-gray-700"
                style={{
                  backgroundColor: color.hex,
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setStage('identify')}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            I’m Ready to Explore
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* IDENTIFY */}
      {stage === 'identify' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />

              <p className="font-bold text-indigo-200">
                Discover the color names
              </p>
            </div>

            <p className="text-gray-400 text-sm">
              Tap a tablet to reveal its name. Look at the color before
              reading the word.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            {COLORS.map((color) => {
              const isRevealed = revealed.includes(color.id);

              return (
                <motion.button
                  key={color.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleReveal(color.id)}
                  className="aspect-[4/3] rounded-2xl border-2 border-gray-700 overflow-hidden relative"
                  style={{
                    backgroundColor: isRevealed
                      ? color.hex
                      : '#171717',
                  }}
                >
                  {isRevealed ? (
                    <span className="font-bold text-white drop-shadow-lg">
                      {color.name}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-2xl">
                      ?
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {revealed.length === COLORS.length && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-5"
            >
              <p className="text-green-300 text-sm font-semibold">
                You explored all the colors. Now let’s practise matching
                colors that look the same.
              </p>
            </motion.div>
          )}

          <button
            onClick={startMatching}
            disabled={revealed.length !== COLORS.length}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-colors"
          >
            Start Color Matching
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* MATCH */}
      {stage === 'match' && target && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 mb-5 text-center">
            <p className="text-xs uppercase tracking-wider text-indigo-300 font-bold mb-3">
              Find the matching color
            </p>

            <div
              className="w-24 h-24 mx-auto rounded-2xl border-4 border-white/20 shadow-lg mb-3"
              style={{
                backgroundColor: target.hex,
              }}
            />

            <p className="text-white font-bold">
              Find the tablet that is the same color.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            {remainingColors.map((color) => (
              <motion.button
                key={color.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectMatch(color.id)}
                className={`aspect-[4/3] rounded-2xl border-4 transition-all ${
                  selectedColor === color.id
                    ? color.id === target.id
                      ? 'border-green-400'
                      : 'border-amber-400'
                    : 'border-white/10'
                }`}
                style={{
                  backgroundColor: color.hex,
                }}
              />
            ))}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-2xl mb-5 ${
                  feedback.startsWith('That matches')
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-gray-600">
            Attempts: {attempts}
          </p>
        </motion.div>
      )}

      {/* DISCRIMINATE */}
      {stage === 'discriminate' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-amber-400" />

              <p className="font-bold text-amber-200">
                Look and discriminate
              </p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Now look at all the colors together. Notice how each one
              is different. Some are warm, some are cool, and each has
              its own visual character.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {COLORS.map((color) => (
              <motion.div
                key={color.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl overflow-hidden border border-gray-700 bg-black/20"
              >
                <div
                  className="h-28"
                  style={{
                    backgroundColor: color.hex,
                  }}
                />

                <div className="p-3">
                  <p className="text-white font-bold text-sm">
                    {color.name}
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    {color.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={finishDiscrimination}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            I’m Ready to Finish
            <ArrowRight className="w-4 h-4 inline ml-2" />
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

          <h3 className="text-3xl font-bold text-white mb-2">
            Color Exploration Complete
          </h3>

          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            You explored, identified, matched, and compared different
            colors.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-black/20 border border-gray-800">
              <Eye className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
              <p className="text-xs text-gray-400">
                Observation
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-gray-800">
              <Palette className="w-5 h-5 mx-auto mb-2 text-purple-400" />
              <p className="text-xs text-gray-400">
                Color
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-gray-800">
              <Sparkles className="w-5 h-5 mx-auto mb-2 text-amber-400" />
              <p className="text-xs text-gray-400">
                Discrimination
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-purple-500/10 border border-purple-500/20 p-5 mb-6 text-left">
            <p className="text-xs uppercase tracking-wider text-purple-300 font-bold mb-2">
              Sensorial learning
            </p>

            <p className="text-gray-300 text-sm leading-relaxed">
              Your eyes helped you notice differences and similarities
              between colors. Careful observation helps build
              classification, vocabulary, visual memory, and later
              artistic and mathematical thinking.
            </p>
          </div>

          <button
            onClick={reset}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Explore Again
          </button>
        </motion.div>
      )}

      {/* FOOTER */}
      <div className="mt-6 pt-5 border-t border-gray-800">
        <p className="text-center text-xs text-gray-500 leading-relaxed">
          Montessori Sensorial Principle: use the senses to observe,
          discriminate, compare, classify, and refine perception.
        </p>
      </div>
    </div>
  );
};
