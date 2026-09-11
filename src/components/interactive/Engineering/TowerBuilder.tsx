import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  RotateCcw,
  ArrowRight,
  Blocks,
  Star,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type BlockColor = 'red' | 'blue' | 'yellow';

type TowerBlock = {
  id: number;
  color: BlockColor;
};

const BLOCK_STYLES: Record<BlockColor, string> = {
  red: 'bg-red-500 border-red-300',
  blue: 'bg-blue-500 border-blue-300',
  yellow: 'bg-yellow-400 border-yellow-200',
};

const BLOCK_LABELS: Record<BlockColor, string> = {
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
};

const MIN_BLOCKS = 6;
const MIN_RED_BLOCKS = 1;
const MAX_BLOCKS = 12;

export const TowerBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<TowerBlock[]>([]);
  const [tested, setTested] = useState(false);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const redCount = useMemo(
    () => blocks.filter((block) => block.color === 'red').length,
    [blocks]
  );

  const heightProgress = Math.min((blocks.length / MIN_BLOCKS) * 100, 100);

  /* Auto-read the challenge once on mount */
  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speak(
        'Tower Builder. Your engineering challenge: build a stable tower. Use at least 6 blocks. Include at least one red block. Build from the bottom upward. Try to make your tower tall and balanced.',
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [speak, autoReadEnabled]);

  /* Read the hint when it opens */
  useEffect(() => {
    if (showHint) {
      speak(
        'A strong tower needs a good foundation. Build carefully from the bottom and think about balance as the tower gets taller.',
      );
    }
  }, [showHint, speak]);

  /* Announce success once */
  useEffect(() => {
    if (!tested || !passed) return;

    speak(
      'Excellent engineering! Your tower meets the challenge requirements. You used planning, construction and testing. Engineers think about stability, foundations, materials and constraints when designing structures.',
    );
  }, [tested, passed, speak]);

  /* Announce failure once */
  useEffect(() => {
    if (!tested || passed) return;

    const reason =
      blocks.length < MIN_BLOCKS
        ? `You need at least ${MIN_BLOCKS} blocks.`
        : redCount < MIN_RED_BLOCKS
          ? 'Add at least one red block.'
          : 'Check your design and try testing again.';

    speak(`Your tower needs improvement. ${reason}`);
  }, [tested, passed, blocks.length, redCount, speak]);

  const addBlock = (color: BlockColor) => {
    if (blocks.length >= MAX_BLOCKS) return;

    if (soundEnabled) playSoundFeedback('move');

    setTested(false);
    setPassed(false);

    setBlocks((previous) => [
      ...previous,
      {
        id: Date.now() + Math.random(),
        color,
      },
    ]);
  };

  const removeBlock = () => {
    if (blocks.length === 0) return;

    if (soundEnabled) playSoundFeedback('move');

    setTested(false);
    setPassed(false);

    setBlocks((previous) => previous.slice(0, -1));
  };

  const handleTest = () => {
    setTested(true);
    setAttempts((previous) => previous + 1);

    const hasEnoughBlocks = blocks.length >= MIN_BLOCKS;
    const hasRedBlock = redCount >= MIN_RED_BLOCKS;

    const success = hasEnoughBlocks && hasRedBlock;

    setPassed(success);

    if (success) {
      if (soundEnabled) playSoundFeedback('correct');
      setScore((previous) => previous + 10);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
    }
  };

  const handleReset = () => {
    setBlocks([]);
    setTested(false);
    setPassed(false);
    setAttempts(0);
    setShowHint(false);

    speak('Tower reset.');
  };

  const nextChallenge = () => {
    handleReset();
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Blocks className="w-6 h-6 text-indigo-400" />

            <h3 className="text-2xl font-bold text-white">Tower Builder</h3>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            Build a tall tower that follows the engineering rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
            <Star className="w-4 h-4" />
            {score}
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-4 h-4 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 mt-5 mb-5 text-left">
        <p className="text-indigo-300 text-xs uppercase tracking-wide font-semibold mb-2">
          Engineering Challenge
        </p>

        <p className="text-white font-semibold mb-2">Build a stable tower.</p>

        <ul className="space-y-1 text-sm text-gray-400">
          <li>• Use at least {MIN_BLOCKS} blocks.</li>
          <li>• Include at least one red block.</li>
          <li>• Build from the bottom upward.</li>
          <li>• Try to make your tower tall and balanced.</li>
        </ul>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Tower height</span>

          <span>
            {blocks.length} / {MIN_BLOCKS} blocks
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${heightProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Tower Area */}
      <div className="relative min-h-[300px] bg-[#111111] rounded-xl border-2 border-dashed border-gray-700 p-4 mb-5 overflow-hidden">
        {/* Ground */}
        <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-700 rounded-full" />

        {/* Tower */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-1">
          <AnimatePresence initial={false}>
            {blocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ scale: 0, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`w-24 h-7 rounded-md border shadow-lg ${BLOCK_STYLES[block.color]}`}
              >
                <span className="sr-only">
                  {BLOCK_LABELS[block.color]} block
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
            Your tower will appear here.
          </div>
        )}
      </div>

      {/* Tower Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-gray-900 rounded-lg p-2">
          <p className="text-xs text-gray-500">Blocks</p>
          <p className="text-white font-bold">{blocks.length}</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-2">
          <p className="text-xs text-gray-500">Red</p>
          <p className="text-red-400 font-bold">{redCount}</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-2">
          <p className="text-xs text-gray-500">Attempts</p>
          <p className="text-white font-bold">{attempts}</p>
        </div>
      </div>

      {/* Materials */}
      <p className="text-gray-300 text-sm font-semibold mb-3">
        Choose your building materials
      </p>

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => addBlock('red')}
          disabled={blocks.length >= MAX_BLOCKS}
          className="px-4 py-2 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500 disabled:opacity-40"
        >
          Red
        </button>

        <button
          onClick={() => addBlock('blue')}
          disabled={blocks.length >= MAX_BLOCKS}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-500 disabled:opacity-40"
        >
          Blue
        </button>

        <button
          onClick={() => addBlock('yellow')}
          disabled={blocks.length >= MAX_BLOCKS}
          className="px-4 py-2 bg-yellow-500 rounded-lg text-gray-900 font-bold hover:bg-yellow-400 disabled:opacity-40"
        >
          Yellow
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={removeBlock}
          disabled={blocks.length === 0}
          className="flex-1 py-2 bg-gray-800 rounded-lg text-gray-300 font-semibold hover:bg-gray-700 disabled:opacity-40"
        >
          Remove
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700"
          aria-label="Reset tower"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleTest}
          disabled={blocks.length === 0}
          className="flex-[2] py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500 disabled:opacity-40"
        >
          Test Tower
        </button>
      </div>

      {/* Hint */}
      <div className="mb-4">
        <button
          onClick={() => setShowHint((previous) => !previous)}
          className="text-xs text-indigo-300 hover:text-indigo-200"
        >
          {showHint ? 'Hide hint' : 'Need a hint?'}
        </button>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
          >
            <p className="text-sm text-indigo-200">
              A strong tower needs a good foundation. Build carefully from the
              bottom and think about balance as the tower gets taller.
            </p>
          </motion.div>
        )}
      </div>

      {/* Test Result */}
      {tested && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl ${
            passed
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {passed ? (
            <>
              <CheckCircle className="w-5 h-5 inline mr-1" />

              <span className="font-bold">Excellent engineering!</span>

              <p className="text-sm mt-2">
                Your tower meets the challenge requirements. You used planning,
                construction and testing.
              </p>

              <button
                onClick={nextChallenge}
                className="mt-3 px-4 py-2 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-500"
              >
                Try Again
                <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </>
          ) : (
            <>
              <p className="font-bold">Your tower needs improvement.</p>

              <p className="text-sm mt-1">
                {blocks.length < MIN_BLOCKS
                  ? `You need at least ${MIN_BLOCKS} blocks.`
                  : redCount < MIN_RED_BLOCKS
                    ? 'Add at least one red block.'
                    : 'Check your design and try testing again.'}
              </p>
            </>
          )}
        </motion.div>
      )}

      {/* Learning Point */}
      <div className="mt-5 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          What Engineers Learn
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Engineers think about{' '}
          <strong className="text-gray-300">
            stability, foundations, materials and constraints
          </strong>{' '}
          when designing structures.
        </p>
      </div>
    </div>
  );
};