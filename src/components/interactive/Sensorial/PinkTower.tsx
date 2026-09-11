import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  RotateCcw,
  Eye,
  GitCompare,
  Layers,
  Lightbulb,
  ArrowRight,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type ActivityStage =
  | 'observe'
  | 'compare'
  | 'order'
  | 'build'
  | 'check'
  | 'complete';

type PinkBlock = {
  id: number;
  size: number;
  label: string;
};

const INITIAL_BLOCKS: PinkBlock[] = [
  { id: 10, size: 10, label: 'Largest' },
  { id: 9, size: 9, label: 'Very large' },
  { id: 8, size: 8, label: 'Large' },
  { id: 7, size: 7, label: 'Large' },
  { id: 6, size: 6, label: 'Medium-large' },
  { id: 5, size: 5, label: 'Medium' },
  { id: 4, size: 4, label: 'Medium-small' },
  { id: 3, size: 3, label: 'Small' },
  { id: 2, size: 2, label: 'Very small' },
  { id: 1, size: 1, label: 'Smallest' },
];

const STAGE_ORDER: ActivityStage[] = [
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
  complete: 'Complete',
};

export const PinkTower: React.FC = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [stage, setStage] = useState<ActivityStage>('observe');
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const [tower, setTower] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  const blocks = useMemo(() => INITIAL_BLOCKS, []);

  const availableBlocks = blocks.filter(
    (block) => !tower.includes(block.id)
  );

  const currentStageIndex = STAGE_ORDER.indexOf(stage);

  /* =======================================================
     AUTO-READ — stage prompts
     Skipped on 'complete' (has its own effect below).
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage === 'complete') return;

    const timer = window.setTimeout(() => {
      if (stage === 'observe') {
        speak(
          'Look carefully. The Pink Tower has ten cubes. They are the same shape and color, but they become different in size. Notice that the cubes change in size.'
        );
      } else if (stage === 'compare') {
        speak(
          'Compare two cubes. Choose two cubes and look at their size. Which one is larger? Which one is smaller?'
        );
      } else if (stage === 'order') {
        speak(
          'Think about the order. A stable Pink Tower starts with the largest cube. Each cube above it becomes smaller.'
        );
      } else if (stage === 'build') {
        speak(
          'Build the Pink Tower. Choose the largest remaining cube and place it below the smaller ones.'
        );
      } else if (stage === 'check') {
        speak(
          'Check your tower. Look from the bottom to the top. Does every cube become smaller?'
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, autoReadEnabled, speak]);

  /* =======================================================
     FEEDBACK NARRATION
     Every time `feedback` changes to a non-empty string,
     speak it. This covers correct placements, wrong
     placements, comparison results, and the specific
     failure reasons that the build stage produces.
  ======================================================= */

  useEffect(() => {
    if (!feedback) return;

    speak(feedback);
  }, [feedback, speak]);

  /* =======================================================
     COMPLETION NARRATION — fires once on stage === 'complete'
  ======================================================= */

  useEffect(() => {
    if (stage !== 'complete') return;

    if (soundEnabled) playSoundFeedback('correct');

    speak(
      'Beautifully ordered. You observed differences in size, compared the cubes, and ordered them from largest to smallest.'
    );
  }, [stage, speak, soundEnabled]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  /* =======================================================
     HANDLERS
  ======================================================= */

  const goToNextStage = () => {
    const nextIndex = currentStageIndex + 1;

    if (nextIndex < STAGE_ORDER.length) {
      setStage(STAGE_ORDER[nextIndex]);
      setFeedback('');
      setSelectedBlocks([]);
      if (soundEnabled) playSoundFeedback('move');
    }
  };

  const resetActivity = () => {
    stopSpeaking();
    setStage('observe');
    setSelectedBlocks([]);
    setTower([]);
    setAttempts(0);
    setFeedback('');
  };

  const handleCompare = (id: number) => {
    if (soundEnabled) playSoundFeedback('move');

    if (selectedBlocks.includes(id)) {
      setSelectedBlocks(selectedBlocks.filter((blockId) => blockId !== id));
      return;
    }

    if (selectedBlocks.length >= 2) {
      setSelectedBlocks([selectedBlocks[1], id]);
      return;
    }

    setSelectedBlocks([...selectedBlocks, id]);
  };

  const getSelectedSizes = () =>
    selectedBlocks
      .map((id) => blocks.find((block) => block.id === id)?.size ?? 0)
      .sort((a, b) => b - a);

  const handleComparisonCheck = () => {
    if (selectedBlocks.length !== 2) {
      if (soundEnabled) playSoundFeedback('try-again');
      setFeedback('Choose two blocks so you can compare them.');
      return;
    }

    const [larger, smaller] = getSelectedSizes();

    if (larger !== smaller) {
      if (soundEnabled) playSoundFeedback('correct');
      setFeedback(
        `Good observing! One block is larger and one is smaller.`
      );
      setAttempts((value) => value + 1);
    }
  };

  const handleOrderStart = () => {
    setSelectedBlocks([]);
    setFeedback('');
    goToNextStage();
  };

  const handleBuild = (id: number) => {
    if (tower.includes(id)) return;

    setAttempts((value) => value + 1);

    if (tower.length === 0) {
      if (id === 10) {
        if (soundEnabled) playSoundFeedback('move');
        setTower([id]);
        setFeedback('Excellent. The largest block forms the base.');
      } else {
        if (soundEnabled) playSoundFeedback('try-again');
        setFeedback(
          'Look carefully. Which block is the largest? It belongs at the bottom.'
        );
      }

      return;
    }

    const lastPlaced = tower[tower.length - 1];

    if (id < lastPlaced) {
      if (soundEnabled) playSoundFeedback('move');
      setTower([...tower, id]);
      setFeedback('Good comparison. The next block is smaller.');
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      setFeedback(
        'Look at the two blocks again. The next block should be smaller than the one underneath it.'
      );
    }
  };

  const handleCheckTower = () => {
    const isCorrect =
      tower.length === 10 &&
      tower.every(
        (id, index) =>
          index === 0 || id < tower[index - 1]
      );

    if (isCorrect) {
      setFeedback('Your tower follows the size sequence from largest to smallest.');
      setStage('complete');
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      setFeedback(
        'Look from the bottom to the top. Each block should become smaller.'
      );
    }
  };

  const renderBlock = (
    block: PinkBlock,
    interactive = false,
    selected = false
  ) => {
    const width = 34 + block.size * 10;
    const height = 22 + block.size * 6;

    return (
      <motion.button
        key={block.id}
        type="button"
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.96 } : undefined}
        onClick={
          interactive
            ? () =>
                stage === 'compare'
                  ? handleCompare(block.id)
                  : handleBuild(block.id)
            : undefined
        }
        className={`
          relative rounded-md border-2
          transition-all duration-200
          ${interactive ? 'cursor-pointer' : 'cursor-default'}
          ${
            selected
              ? 'border-white ring-2 ring-cyan-400'
              : 'border-pink-300'
          }
        `}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background:
            'linear-gradient(145deg, #fbcfe8 0%, #f9a8d4 100%)',
          boxShadow:
            'inset -4px -4px 8px rgba(157,23,77,0.18), 3px 4px 8px rgba(0,0,0,0.25)',
        }}
        aria-label={`${block.label}, size ${block.size}`}
      >
        {selected && (
          <span className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-cyan-700" />
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
              <Layers className="w-5 h-5 text-pink-300" />
              <h3 className="text-xl font-bold text-white">
                Pink Tower
              </h3>
            </div>

            <p className="text-gray-400 text-sm">
              Explore size, compare dimensions, and build a tower
              from largest to smallest.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Volume2
                className={`w-4 h-4 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
              />
            </button>

            <button
              type="button"
              onClick={resetActivity}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition"
              aria-label="Reset Pink Tower"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Learning progression */}
        <div className="mt-5 flex items-center gap-1 overflow-x-auto pb-1">
          {STAGE_ORDER.map((item, index) => {
            const active = item === stage;
            const completed = index < currentStageIndex;

            return (
              <React.Fragment key={item}>
                <div
                  className={`
                    flex items-center gap-1 px-2.5 py-1.5 rounded-full
                    text-xs whitespace-nowrap
                    ${
                      active
                        ? 'bg-pink-400/20 text-pink-200 border border-pink-400/40'
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

                {index < STAGE_ORDER.length - 1 && (
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
                Look carefully
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                The Pink Tower has ten cubes. They are the same
                shape and color, but they become different in size.
              </p>
            </div>

            <div className="flex items-end justify-center gap-2 min-h-[180px]">
              {blocks.map((block) => (
                <div key={block.id} className="flex flex-col items-center">
                  {renderBlock(block)}
                </div>
              ))}
            </div>

            <div className="bg-gray-900/60 border border-app-border rounded-xl p-4">
              <p className="text-sm text-gray-300">
                <span className="text-pink-300 font-semibold">
                  Notice:
                </span>{' '}
                The cubes change in size. Some are larger and some
                are smaller.
              </p>
            </div>

            <button
              type="button"
              onClick={goToNextStage}
              className="w-full py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-900 font-semibold transition"
            >
              I am ready to compare
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
                Compare two cubes
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose two cubes. Look at their size. Which one is
                larger? Which one is smaller?
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-end gap-3 p-5 bg-gray-900/60 rounded-xl min-h-[220px]">
              {blocks.map((block) =>
                renderBlock(
                  block,
                  true,
                  selectedBlocks.includes(block.id)
                )
              )}
            </div>

            {selectedBlocks.length === 2 && (
              <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4 text-center">
                {(() => {
                  const [larger, smaller] = getSelectedSizes();

                  return (
                    <p className="text-sm text-cyan-200">
                      You selected two cubes. One is{' '}
                      <strong>
                        {larger > smaller ? 'larger' : 'smaller'}
                      </strong>{' '}
                      than the other.
                    </p>
                  );
                })()}
              </div>
            )}

            {feedback && (
              <p className="text-center text-emerald-300 text-sm">
                {feedback}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleComparisonCheck}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
              >
                Compare
              </button>

              <button
                type="button"
                onClick={goToNextStage}
                className="flex-1 py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-900 font-semibold transition"
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
              <Layers className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Think about the order
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                A stable Pink Tower starts with the largest cube.
                Each cube above it becomes smaller.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-900/60 rounded-xl p-4 text-center border border-app-border">
                <div className="text-pink-300 text-2xl mb-2">1</div>
                <p className="text-white font-semibold text-sm">
                  Largest
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Bottom
                </p>
              </div>

              <div className="bg-gray-900/60 rounded-xl p-4 text-center border border-app-border">
                <div className="text-pink-300 text-2xl mb-2">2</div>
                <p className="text-white font-semibold text-sm">
                  Smaller
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Middle
                </p>
              </div>

              <div className="bg-gray-900/60 rounded-xl p-4 text-center border border-app-border">
                <div className="text-pink-300 text-2xl mb-2">3</div>
                <p className="text-white font-semibold text-sm">
                  Smallest
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Top
                </p>
              </div>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-300 shrink-0" />
              <p className="text-sm text-amber-100">
                <strong>Think:</strong> If a smaller cube is
                underneath a larger cube, the tower will not follow
                the size sequence.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOrderStart}
              className="w-full py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-900 font-semibold transition"
            >
              Start building
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
                Build the Pink Tower
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose the largest remaining cube and place it
                below the smaller ones.
              </p>
            </div>

            {/* Tower */}
            <div className="relative h-[330px] bg-gray-950 rounded-xl border-2 border-dashed border-gray-700 overflow-hidden">
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center">
                {tower.map((id) => {
                  const block = blocks.find((item) => item.id === id);

                  if (!block) return null;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, scale: 0.7, y: -30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="rounded-md border-2 border-pink-300"
                      style={{
                        width: `${34 + block.size * 10}px`,
                        height: `${22 + block.size * 6}px`,
                        background:
                          'linear-gradient(145deg, #fbcfe8 0%, #f9a8d4 100%)',
                        boxShadow:
                          'inset -4px -4px 8px rgba(157,23,77,0.18), 3px 4px 8px rgba(0,0,0,0.25)',
                      }}
                    />
                  );
                })}
              </div>

              {tower.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                  The largest cube belongs here.
                </div>
              )}
            </div>

            {/* Block bank */}
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3 text-center uppercase tracking-wider">
                Choose a cube
              </p>

              <div className="flex flex-wrap justify-center items-end gap-3 min-h-[100px]">
                {availableBlocks.map((block) =>
                  renderBlock(block, true)
                )}
              </div>
            </div>

            {feedback && (
              <div className="bg-gray-900/80 border border-app-border rounded-xl p-4 text-center">
                <p className="text-sm text-gray-300">{feedback}</p>
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{tower.length} of 10 cubes placed</span>
              <span>Attempts: {attempts}</span>
            </div>

            {tower.length === 10 && (
              <button
                type="button"
                onClick={goToNextStage}
                className="w-full py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-900 font-semibold transition"
              >
                Check my tower
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
                Check your tower
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Look from the bottom to the top. Does every cube
                become smaller?
              </p>
            </div>

            <div className="flex justify-center items-end min-h-[300px]">
              <div className="flex flex-col-reverse items-center">
                {tower.map((id) => {
                  const block = blocks.find((item) => item.id === id);

                  if (!block) return null;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-md border-2 border-pink-300"
                      style={{
                        width: `${34 + block.size * 10}px`,
                        height: `${22 + block.size * 6}px`,
                        background:
                          'linear-gradient(145deg, #fbcfe8 0%, #f9a8d4 100%)',
                      }}
                    />
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
              onClick={handleCheckTower}
              className="w-full py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-900 font-semibold transition"
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
                Beautifully ordered
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                You observed differences in size, compared the
                cubes, and ordered them from largest to smallest.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-pink-300 font-semibold text-sm">
                  You practised
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Visual discrimination
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-pink-300 font-semibold text-sm">
                  You explored
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Size and dimension
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-pink-300 font-semibold text-sm">
                  You developed
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Ordering and concentration
                </p>
              </div>
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4">
              <p className="text-sm text-cyan-100">
                <strong>Reflect:</strong> What do you notice about
                the tower when you look from the bottom to the top?
              </p>
            </div>

            <button
              type="button"
              onClick={resetActivity}
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