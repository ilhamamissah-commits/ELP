import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Star,
  Blocks,
  Volume2,
} from 'lucide-react';

import { LEGO_CHALLENGES } from './engineeringData';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

export const LegoBuilder: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [placedBlocks, setPlacedBlocks] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const challenge = LEGO_CHALLENGES[challengeIndex];

  useEffect(() => {
    setPlacedBlocks(0);
    setCompleted(false);
  }, [challengeIndex]);

  /* Auto-read the challenge when it changes */
  useEffect(() => {
    if (!autoReadEnabled || !challenge) return;

    const timer = window.setTimeout(() => {
      speak(
        `${challenge.title}. Build the target structure using ${challenge.levels} blocks. Difficulty: ${challenge.difficulty}.`,
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [challengeIndex, challenge, speak, autoReadEnabled]);

  /* Announce completion */
  useEffect(() => {
    if (!completed) return;

    speak(
      'Build complete! Excellent work. You matched the target structure. Engineers compare their designs with requirements, test them, and improve them when needed.',
    );
  }, [completed, speak]);

  /* Announce failure after a test */
  useEffect(() => {
    if (completed || attempts === 0) return;
    if (placedBlocks === challenge?.levels) return;

    speak(
      'Your design is not finished yet. Compare it with the target and make another adjustment.',
    );
  }, [attempts, completed, placedBlocks, challenge, speak]);

  const handlePlaceBlock = () => {
    if (completed) return;

    if (placedBlocks < challenge.levels) {
      if (soundEnabled) playSoundFeedback('move');
      setPlacedBlocks((previous) => previous + 1);
    }
  };

  const handleRemoveBlock = () => {
    if (completed) return;

    if (soundEnabled) playSoundFeedback('move');
    setPlacedBlocks((previous) => Math.max(previous - 1, 0));
  };

  const handleTest = () => {
    setAttempts((previous) => previous + 1);

    if (placedBlocks === challenge.levels) {
      if (soundEnabled) playSoundFeedback('correct');
      setCompleted(true);
      setScore((previous) => previous + 10);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
    }
  };

  const nextChallenge = () => {
    if (challengeIndex < LEGO_CHALLENGES.length - 1) {
      setChallengeIndex((previous) => previous + 1);
    } else {
      setChallengeIndex(0);
      setPlacedBlocks(0);
      setCompleted(false);
    }
  };

  const reset = () => {
    setPlacedBlocks(0);
    setCompleted(false);

    speak('Build reset.');
  };

  const progress = Math.round((placedBlocks / challenge.levels) * 100);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Blocks className="w-5 h-5" />
            <span className="text-xs font-semibold">
              Engineering &amp; Design
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white">🧱 LEGO Builder</h3>

          <p className="text-gray-400 text-sm mt-1">
            Plan, build, test and improve your design.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Volume2
              className={`w-4 h-4 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>

          <button
            onClick={reset}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
            title="Reset build"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Challenge Information */}
      <div className="flex justify-between items-center mb-4">
        <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">
          Challenge {challengeIndex + 1} / {LEGO_CHALLENGES.length}
        </span>

        <span className="text-yellow-400 font-bold text-xs flex items-center gap-1">
          <Star className="w-3 h-3" />
          {score}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Build Progress</span>
          <span>
            {placedBlocks}/{challenge.levels} blocks
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${Math.max(progress, 2)}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>

      {/* Target */}
      <div className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 mb-5">
        <p className="text-gray-400 text-sm mb-3 text-center">
          🎯 Build this structure
        </p>

        <div className="flex flex-col-reverse items-center gap-1 min-h-[140px] justify-start">
          {Array.from({ length: challenge.levels }).map((_, i) => {
            const blockColor =
              i === 0
                ? challenge.color1
                : i === challenge.levels - 1
                  ? challenge.color3
                  : challenge.color2;

            return (
              <motion.div
                key={`target-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="w-20 h-8 rounded-sm border border-white/10"
                style={{ backgroundColor: blockColor }}
              />
            );
          })}
        </div>

        <div className="text-center mt-3">
          <p className="text-white font-bold">{challenge.title}</p>

          <p className="text-gray-500 text-xs mt-1">
            Difficulty: {challenge.difficulty}
          </p>
        </div>
      </div>

      {/* Building Area */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white font-bold text-sm">🏗️ Your Build</p>

          <p className="text-gray-500 text-xs">{placedBlocks} blocks</p>
        </div>

        <div className="min-h-[180px] bg-[#111] rounded-xl border-2 border-dashed border-gray-700 flex flex-col-reverse items-center justify-start p-4 overflow-hidden">
          {Array.from({ length: placedBlocks }).map((_, i) => {
            const blockColor =
              i === 0
                ? challenge.color1
                : i === placedBlocks - 1
                  ? challenge.color3
                  : challenge.color2;

            return (
              <motion.div
                key={`build-${i}`}
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-20 h-8 rounded-sm mb-1 border border-white/10"
                style={{ backgroundColor: blockColor }}
              />
            );
          })}

          {placedBlocks === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-[145px]">
              <span className="text-4xl mb-2">🧱</span>

              <p className="text-gray-500 text-sm">
                Your building area is empty.
              </p>

              <p className="text-gray-600 text-xs mt-1">
                Add blocks to begin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Block Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleRemoveBlock}
          disabled={placedBlocks === 0 || completed}
          className="py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          − Remove Block
        </button>

        <button
          onClick={handlePlaceBlock}
          disabled={placedBlocks >= challenge.levels || completed}
          className="py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          + Add Block
        </button>
      </div>

      {/* Test */}
      {!completed && (
        <button
          onClick={handleTest}
          disabled={placedBlocks === 0}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          🧪 Test My Build
        </button>
      )}

      {/* Result */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />

            <p className="font-bold text-green-400">Build Complete!</p>
          </div>

          <p className="text-gray-300 text-sm text-center">
            Excellent work! You matched the target structure.
          </p>

          <div className="mt-3 pt-3 border-t border-green-500/10">
            <p className="text-gray-400 text-xs text-center">
              Engineers compare their designs with requirements, test them, and
              improve them when needed.
            </p>
          </div>

          <button
            onClick={nextChallenge}
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Next Challenge
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Failed Test */}
      {!completed && attempts > 0 && placedBlocks !== challenge.levels && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
        >
          <p className="text-yellow-300 text-sm text-center">
            🧠 Your design is not finished yet. Compare it with the target and
            make another adjustment.
          </p>
        </motion.div>
      )}

      {attempts > 0 && (
        <p className="text-gray-600 text-xs text-center mt-4">
          Tests: {attempts}
        </p>
      )}
    </div>
  );
};