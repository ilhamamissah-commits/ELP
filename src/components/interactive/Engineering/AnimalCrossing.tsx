import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type Tool = 'raft' | 'rope' | 'bridge' | 'boat';

interface ToolOption {
  id: Tool;
  name: string;
  emoji: string;
  description: string;
}

const TOOLS: ToolOption[] = [
  {
    id: 'raft',
    name: 'Raft',
    emoji: '🛟',
    description: 'A floating platform that can carry the fox.',
  },
  {
    id: 'rope',
    name: 'Rope',
    emoji: '🪢',
    description: 'Can help secure or guide the raft.',
  },
  {
    id: 'bridge',
    name: 'Bridge',
    emoji: '🌉',
    description: 'A structure that connects two sides.',
  },
  {
    id: 'boat',
    name: 'Boat',
    emoji: '⛵',
    description: 'A vehicle that travels on water.',
  },
];

export const AnimalCrossing: React.FC = () => {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [tested, setTested] = useState(false);
  const [passed, setPassed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  /* Auto-read the challenge once on mount */
  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speak(
        'Animal Crossing. Your challenge: the fox needs to cross the river to reach the forest. The river is too wide to jump across. Can you choose the right tools to help the fox cross safely?',
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [speak, autoReadEnabled]);

  /* Read the hint when it opens */
  useEffect(() => {
    if (showHint && !tested) {
      speak(
        'The fox needs something that can float and something that can help keep it connected to the shore.',
      );
    }
  }, [showHint, tested, speak]);

  const toggleTool = (tool: Tool) => {
    if (tested) return;

    if (soundEnabled) playSoundFeedback('move');

    setSelectedTools((previous) =>
      previous.includes(tool)
        ? previous.filter((item) => item !== tool)
        : [...previous, tool]
    );
  };

  const testSolution = () => {
    const hasRaft = selectedTools.includes('raft');
    const hasRope = selectedTools.includes('rope');

    const success = hasRaft && hasRope;

    setPassed(success);
    setTested(true);
    setAttempts((previous) => previous + 1);

    if (success) {
      if (soundEnabled) playSoundFeedback('correct');
      speak(
        'Solution worked! Excellent problem solving. You chose a floating platform and a way to secure it. The fox can safely cross the river. Engineering lesson: engineers choose materials and tools based on the problem they need to solve.',
      );
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(
        'The fox still cannot cross safely. Think about what can float on water and what could help keep the crossing secure. Change your design and test again.',
      );
    }
  };

  const resetChallenge = () => {
    setSelectedTools([]);
    setTested(false);
    setPassed(false);
    setShowHint(false);

    speak('Challenge reset.');
  };

  const hasRaft = selectedTools.includes('raft');
  const hasRope = selectedTools.includes('rope');

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex-1 text-center">
          <div className="text-5xl mb-2">🦊</div>

          <h3 className="text-2xl font-bold text-white">Animal Crossing</h3>

          <p className="text-gray-400 text-sm mt-1">
            Solve an engineering problem!
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

      {/* Challenge */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-5">
        <p className="text-indigo-300 font-bold text-sm mb-2">
          🧠 Your Challenge
        </p>

        <p className="text-gray-300 text-sm leading-relaxed">
          The fox needs to cross the river to reach the forest. The river is
          too wide to jump across.
        </p>

        <p className="text-white font-semibold text-sm mt-3">
          Can you choose the right tools to help the fox cross safely?
        </p>
      </div>

      {/* Scene */}
      <div className="relative bg-[#151515] rounded-xl border border-gray-800 min-h-[220px] mb-5 overflow-hidden">
        {/* River */}
        <div className="absolute left-0 right-0 top-1/2 h-20 bg-blue-500/20 border-y border-blue-500/20" />

        {/* Left Shore */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-center">
          <div className="text-5xl">🦊</div>
          <p className="text-xs text-gray-500 mt-1">Start</p>
        </div>

        {/* Right Shore */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-center">
          <div className="text-5xl">🌲</div>
          <p className="text-xs text-gray-500 mt-1">Goal</p>
        </div>

        {/* River */}
        <div className="absolute left-20 right-20 top-1/2 -translate-y-1/2 flex justify-center items-center">
          <div className="text-blue-300/50 text-sm">
            ~ ~ ~ RIVER ~ ~ ~
          </div>
        </div>

        {/* Raft */}
        {hasRaft && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-1/2 top-[48%] -translate-x-1/2 text-5xl"
          >
            🛟
          </motion.div>
        )}

        {/* Rope */}
        {hasRope && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="absolute left-24 right-24 top-[58%] h-1 bg-yellow-600/70 rounded-full"
          />
        )}

        {passed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute left-1/2 bottom-3 -translate-x-1/2 text-3xl"
          >
            🦊 🎉
          </motion.div>
        )}
      </div>

      {/* Tool Selection */}
      <div className="mb-5">
        <p className="text-white font-bold text-sm mb-3">Choose your tools</p>

        <div className="grid grid-cols-2 gap-3">
          {TOOLS.map((tool) => {
            const selected = selectedTools.includes(tool.id);

            return (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                disabled={tested}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                } disabled:opacity-60`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tool.emoji}</span>

                  <div>
                    <p className="text-white font-bold text-sm">
                      {tool.name}
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      {!tested && (
        <div className="mb-4">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="w-full py-2 text-yellow-300 text-sm hover:text-yellow-200 transition-colors flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Need a hint?
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3"
            >
              <p className="text-yellow-300 text-sm">
                💡 The fox needs something that can float and something that
                can help keep it connected to the shore.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Test / Reset */}
      <div className="flex gap-3">
        <button
          onClick={resetChallenge}
          className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
          title="Reset challenge"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={testSolution}
          disabled={tested || selectedTools.length === 0}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-colors"
        >
          Test Solution
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Result */}
      {tested && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border ${
            passed
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          {passed ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="font-bold text-green-400">Solution Worked!</p>
              </div>

              <p className="text-gray-300 text-sm">
                Excellent problem solving! You chose a floating platform and
                a way to secure it. The fox can safely cross the river.
              </p>

              <div className="mt-3 pt-3 border-t border-green-500/10">
                <p className="text-gray-400 text-xs">
                  <span className="font-semibold text-white">
                    Engineering lesson:
                  </span>{' '}
                  Engineers choose materials and tools based on the problem
                  they need to solve.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="font-bold text-red-400 mb-2">
                The fox still cannot cross safely.
              </p>

              <p className="text-gray-300 text-sm">
                Think about what can float on water and what could help keep
                the crossing secure. Change your design and test again.
              </p>
            </>
          )}
        </motion.div>
      )}

      {attempts > 0 && (
        <p className="text-center text-gray-600 text-xs mt-4">
          Attempts: {attempts}
        </p>
      )}
    </div>
  );
};