import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, Blocks, Volume2 } from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type PartType = 'plank' | 'pillar' | 'support';

interface BuildState {
  planks: number;
  pillars: number;
  supports: number;
}

const MAX_PLANKS = 6;
const MAX_PILLARS = 4;
const MAX_SUPPORTS = 4;

const TARGET = {
  planks: 3,
  pillars: 2,
  supports: 1,
};

export const BridgeBuilder: React.FC = () => {
  const [build, setBuild] = useState<BuildState>({
    planks: 0,
    pillars: 0,
    supports: 0,
  });

  const [isTested, setIsTested] = useState(false);
  const [passed, setPassed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  /* Auto-read the challenge once on mount */
  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speak(
        'Bridge Builder. Your engineering challenge: build a bridge that can safely hold 3 blocks. You need at least 3 planks, 2 pillars, and 1 support.',
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [speak, autoReadEnabled]);

  const handleBuild = (type: PartType) => {
    setIsTested(false);
    setPassed(false);

    if (soundEnabled) playSoundFeedback('move');

    setBuild((previous) => {
      if (type === 'plank') {
        return {
          ...previous,
          planks: Math.min(previous.planks + 1, MAX_PLANKS),
        };
      }

      if (type === 'pillar') {
        return {
          ...previous,
          pillars: Math.min(previous.pillars + 1, MAX_PILLARS),
        };
      }

      return {
        ...previous,
        supports: Math.min(previous.supports + 1, MAX_SUPPORTS),
      };
    });
  };

  const handleRemove = (type: PartType) => {
    setIsTested(false);
    setPassed(false);

    if (soundEnabled) playSoundFeedback('move');

    setBuild((previous) => {
      if (type === 'plank') {
        return {
          ...previous,
          planks: Math.max(previous.planks - 1, 0),
        };
      }

      if (type === 'pillar') {
        return {
          ...previous,
          pillars: Math.max(previous.pillars - 1, 0),
        };
      }

      return {
        ...previous,
        supports: Math.max(previous.supports - 1, 0),
      };
    });
  };

  const handleTest = () => {
    const success =
      build.planks >= TARGET.planks &&
      build.pillars >= TARGET.pillars &&
      build.supports >= TARGET.supports;

    setPassed(success);
    setIsTested(true);
    setAttempts((previous) => previous + 1);

    if (success) {
      if (soundEnabled) playSoundFeedback('correct');
      speak(
        'Bridge passed! Excellent engineering. Your bridge has enough structural support to carry the challenge load. Engineers design, test, learn from failures, and improve their designs.',
      );
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(
        'The bridge needs improvement. Check the requirements and add the missing structural parts. Then test your design again.',
      );
    }
  };

  const handleReset = () => {
    setBuild({
      planks: 0,
      pillars: 0,
      supports: 0,
    });

    setIsTested(false);
    setPassed(false);

    speak('Bridge reset.');
  };

  const progress = Math.min(
    100,
    Math.round(
      ((Math.min(build.planks, TARGET.planks) / TARGET.planks +
        Math.min(build.pillars, TARGET.pillars) / TARGET.pillars +
        Math.min(build.supports, TARGET.supports) / TARGET.supports) /
        3) *
        100
    )
  );

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
              <Blocks className="w-7 h-7" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white">
            🌉 Bridge Builder
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            Build a strong bridge using engineering principles.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          aria-label="Toggle sound"
          className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors shrink-0"
        >
          <Volume2
            className={`w-4 h-4 ${
              soundEnabled ? 'text-amber-300' : 'text-gray-500'
            }`}
          />
        </button>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-5">
        <p className="text-indigo-300 font-bold text-sm mb-1">
          Engineering Challenge
        </p>

        <p className="text-gray-300 text-sm">
          Build a bridge that can safely hold{' '}
          <span className="font-bold text-white">3 blocks</span>.
        </p>

        <p className="text-gray-400 text-xs mt-2">
          You need at least 3 planks, 2 pillars, and 1 support.
        </p>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Build Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${Math.max(progress, 3)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Bridge Visual */}
      <div className="relative bg-[#151515] rounded-xl border border-gray-800 min-h-[220px] mb-5 overflow-hidden">
        <div className="absolute bottom-4 left-5 right-5 h-2 bg-gray-700 rounded-full" />

        {/* Left Pillars */}
        <div className="absolute bottom-6 left-12 flex gap-2 items-end">
          {Array.from({ length: Math.ceil(build.pillars / 2) }).map(
            (_, index) => (
              <motion.div
                key={`left-pillar-${index}`}
                initial={{ height: 0 }}
                animate={{ height: 70 }}
                className="w-6 bg-gray-500 rounded-t-md"
              />
            )
          )}
        </div>

        {/* Right Pillars */}
        <div className="absolute bottom-6 right-12 flex gap-2 items-end">
          {Array.from({ length: Math.floor(build.pillars / 2) }).map(
            (_, index) => (
              <motion.div
                key={`right-pillar-${index}`}
                initial={{ height: 0 }}
                animate={{ height: 70 }}
                className="w-6 bg-gray-500 rounded-t-md"
              />
            )
          )}
        </div>

        {/* Bridge Deck */}
        <div className="absolute left-16 right-16 bottom-24 flex flex-col-reverse gap-1">
          {Array.from({ length: build.planks }).map((_, index) => (
            <motion.div
              key={`plank-${index}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="h-5 bg-amber-600 rounded-sm border border-amber-500/40"
            />
          ))}
        </div>

        {/* Supports */}
        {Array.from({ length: build.supports }).map((_, index) => (
          <motion.div
            key={`support-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-20 left-1/2 w-4 h-14 bg-indigo-500 rounded-sm"
            style={{
              transform: `translateX(calc(-50% + ${
                (index - (build.supports - 1) / 2) * 28
              }px))`,
            }}
          />
        ))}

        {build.planks === 0 &&
          build.pillars === 0 &&
          build.supports === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-600 text-sm">
                Your construction site is empty.
              </p>
            </div>
          )}
      </div>

      {/* Parts */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between bg-gray-900 rounded-xl p-3">
          <div>
            <p className="text-white font-semibold">🪵 Planks</p>
            <p className="text-gray-500 text-xs">Create the bridge deck</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRemove('plank')}
              disabled={build.planks === 0}
              className="w-8 h-8 rounded-lg bg-gray-800 text-white disabled:opacity-30"
            >
              −
            </button>

            <span className="w-6 text-center text-white font-bold">
              {build.planks}
            </span>

            <button
              onClick={() => handleBuild('plank')}
              disabled={build.planks >= MAX_PLANKS}
              className="w-8 h-8 rounded-lg bg-amber-600 text-white disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-900 rounded-xl p-3">
          <div>
            <p className="text-white font-semibold">🧱 Pillars</p>
            <p className="text-gray-500 text-xs">Hold the bridge up</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRemove('pillar')}
              disabled={build.pillars === 0}
              className="w-8 h-8 rounded-lg bg-gray-800 text-white disabled:opacity-30"
            >
              −
            </button>

            <span className="w-6 text-center text-white font-bold">
              {build.pillars}
            </span>

            <button
              onClick={() => handleBuild('pillar')}
              disabled={build.pillars >= MAX_PILLARS}
              className="w-8 h-8 rounded-lg bg-gray-600 text-white disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-900 rounded-xl p-3">
          <div>
            <p className="text-white font-semibold">🔩 Supports</p>
            <p className="text-gray-500 text-xs">Add extra stability</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRemove('support')}
              disabled={build.supports === 0}
              className="w-8 h-8 rounded-lg bg-gray-800 text-white disabled:opacity-30"
            >
              −
            </button>

            <span className="w-6 text-center text-white font-bold">
              {build.supports}
            </span>

            <button
              onClick={() => handleBuild('support')}
              disabled={build.supports >= MAX_SUPPORTS}
              className="w-8 h-8 rounded-lg bg-indigo-600 text-white disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div
          className={`rounded-lg p-2 text-center border ${
            build.planks >= TARGET.planks
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-gray-800 bg-gray-900'
          }`}
        >
          <p className="text-xs text-gray-500">Planks</p>
          <p className="text-white font-bold">
            {build.planks}/{TARGET.planks}
          </p>
        </div>

        <div
          className={`rounded-lg p-2 text-center border ${
            build.pillars >= TARGET.pillars
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-gray-800 bg-gray-900'
          }`}
        >
          <p className="text-xs text-gray-500">Pillars</p>
          <p className="text-white font-bold">
            {build.pillars}/{TARGET.pillars}
          </p>
        </div>

        <div
          className={`rounded-lg p-2 text-center border ${
            build.supports >= TARGET.supports
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-gray-800 bg-gray-900'
          }`}
        >
          <p className="text-xs text-gray-500">Supports</p>
          <p className="text-white font-bold">
            {build.supports}/{TARGET.supports}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
          title="Reset bridge"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleTest}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold transition-colors"
        >
          🧪 Test Bridge
        </button>
      </div>

      {/* Result */}
      {isTested && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl ${
            passed
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          {passed ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="font-bold text-green-400">Bridge Passed!</p>
              </div>

              <p className="text-gray-300 text-sm">
                Excellent engineering! Your bridge has enough structural
                support to carry the challenge load.
              </p>

              <p className="text-gray-500 text-xs mt-2">
                Engineers design, test, learn from failures, and improve their
                designs.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-red-400 mb-2">
                The bridge needs improvement.
              </p>

              <p className="text-gray-300 text-sm">
                Check the requirements and add the missing structural parts.
                Then test your design again.
              </p>
            </>
          )}
        </motion.div>
      )}

      {attempts > 0 && (
        <p className="text-center text-gray-600 text-xs mt-4">
          Tests completed: {attempts}
        </p>
      )}
    </div>
  );
};