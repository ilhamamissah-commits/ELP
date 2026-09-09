import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  RotateCcw,
  Play,
  Trash2,
  Bug,
  Repeat,
  GitBranch,
  Boxes,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

type CodingConcept =
  | 'sequence'
  | 'algorithm'
  | 'debugging'
  | 'loops'
  | 'conditions'
  | 'patterns'
  | 'events'
  | 'functions';

type Command =
  | 'Move Up'
  | 'Move Down'
  | 'Move Left'
  | 'Move Right'
  | 'Pick Up';

interface Challenge {
  id: number;
  concept: CodingConcept;
  title: string;
  instruction: string;
  targetSequence: Command[];
  emoji: string;
  difficulty: 1 | 2 | 3;
  hint: string;
}

const COMMANDS: Command[] = [
  'Move Up',
  'Move Down',
  'Move Left',
  'Move Right',
  'Pick Up',
];

const CHALLENGES: Challenge[] = [
  // -------------------------
  // LEVEL 1 — SEQUENCING
  // -------------------------
  {
    id: 1,
    concept: 'sequence',
    title: 'Move the Star',
    instruction: 'Put the instructions in the correct order.',
    targetSequence: ['Move Right', 'Move Up'],
    emoji: '⭐',
    difficulty: 1,
    hint: 'Move right first, then move up.',
  },
  {
    id: 2,
    concept: 'sequence',
    title: 'Find the Gem',
    instruction: 'Can you guide the robot to the gem?',
    targetSequence: ['Move Down', 'Move Right'],
    emoji: '💎',
    difficulty: 1,
    hint: 'Start by moving down.',
  },
  {
    id: 3,
    concept: 'sequence',
    title: 'Get the Apple',
    instruction: 'The robot needs two steps before picking up the apple.',
    targetSequence: ['Move Right', 'Move Right', 'Pick Up'],
    emoji: '🍎',
    difficulty: 1,
    hint: 'Move right twice, then pick up the apple.',
  },

  // -------------------------
  // LEVEL 2 — ALGORITHMS
  // -------------------------
  {
    id: 4,
    concept: 'algorithm',
    title: 'Reach the Door',
    instruction: 'Create an algorithm to reach the door.',
    targetSequence: ['Move Down', 'Move Left', 'Move Up'],
    emoji: '🚪',
    difficulty: 2,
    hint: 'An algorithm is a step-by-step plan.',
  },
  {
    id: 5,
    concept: 'algorithm',
    title: 'Fetch the Ball',
    instruction: 'Give the robot every step it needs.',
    targetSequence: ['Move Up', 'Move Right', 'Pick Up'],
    emoji: '⚽',
    difficulty: 2,
    hint: 'Think about where the ball is located.',
  },

  // -------------------------
  // LEVEL 3 — DEBUGGING
  // -------------------------
  {
    id: 6,
    concept: 'debugging',
    title: 'Fix the Robot',
    instruction: 'The robot has the wrong instruction. Find the bug!',
    targetSequence: ['Move Right', 'Move Down', 'Pick Up'],
    emoji: '🐶',
    difficulty: 2,
    hint: 'Check every instruction carefully.',
  },

  // -------------------------
  // LEVEL 4 — PATTERNS
  // -------------------------
  {
    id: 7,
    concept: 'patterns',
    title: 'Follow the Pattern',
    instruction: 'Can you follow the movement pattern?',
    targetSequence: [
      'Move Up',
      'Move Up',
      'Move Right',
      'Pick Up',
    ],
    emoji: '⭐',
    difficulty: 2,
    hint: 'Look for repeated instructions.',
  },

  // -------------------------
  // LEVEL 5 — LOOPS
  // -------------------------
  {
    id: 8,
    concept: 'loops',
    title: 'Repeat the Move',
    instruction: 'The robot needs to move right three times.',
    targetSequence: [
      'Move Right',
      'Move Right',
      'Move Right',
      'Pick Up',
    ],
    emoji: '🏆',
    difficulty: 3,
    hint: 'This is a perfect example of repetition.',
  },
];

const CONCEPT_INFO: Record<
  CodingConcept,
  {
    label: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
  sequence: {
    label: 'Sequencing',
    description: 'Put instructions in the correct order.',
    icon: <ArrowRight className="w-5 h-5" />,
  },
  algorithm: {
    label: 'Algorithms',
    description: 'Create a step-by-step plan to solve a problem.',
    icon: <Boxes className="w-5 h-5" />,
  },
  debugging: {
    label: 'Debugging',
    description: 'Find mistakes and fix them.',
    icon: <Bug className="w-5 h-5" />,
  },
  loops: {
    label: 'Loops',
    description: 'Repeat instructions to make your program shorter.',
    icon: <Repeat className="w-5 h-5" />,
  },
  conditions: {
    label: 'Conditions',
    description: 'Make a decision based on what happens.',
    icon: <GitBranch className="w-5 h-5" />,
  },
  patterns: {
    label: 'Patterns',
    description: 'Recognize and use repeated instructions.',
    icon: <Repeat className="w-5 h-5" />,
  },
  events: {
    label: 'Events',
    description: 'Tell the computer what to do when something happens.',
    icon: <Play className="w-5 h-5" />,
  },
  functions: {
    label: 'Functions',
    description: 'Group instructions together and give them a name.',
    icon: <Boxes className="w-5 h-5" />,
  },
};

export const CodingBasics: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [sequence, setSequence] = useState<Command[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  const current = CHALLENGES[challengeIndex];

  const concept = useMemo(
    () => CONCEPT_INFO[current.concept],
    [current.concept]
  );

  const addCommand = (command: Command) => {
    if (completed) return;

    setSequence((previous) => [...previous, command]);
    setMessage('');
  };

  const removeLast = () => {
    if (completed) return;

    setSequence((previous) => previous.slice(0, -1));
  };

  const resetChallenge = () => {
    setSequence([]);
    setCompleted(false);
    setShowHint(false);
    setMessage('');
    setAttempts(0);
  };

  const runCode = () => {
    if (sequence.length === 0) {
      setMessage('Add some instructions first!');
      return;
    }

    setAttempts((previous) => previous + 1);

    const correct =
      sequence.length === current.targetSequence.length &&
      sequence.every(
        (command, index) =>
          command === current.targetSequence[index]
      );

    if (correct) {
      setCompleted(true);

      // Reward first successful attempt more highly.
      const points = attempts === 0 ? 20 : 10;

      setScore((previous) => previous + points);
      setMessage('Excellent! Your algorithm works!');
    } else {
      setMessage(
        current.concept === 'debugging'
          ? 'There is still a bug. Check your instructions!'
          : 'The robot did not reach the target. Debug your code and try again!'
      );
    }
  };

  const nextChallenge = () => {
    setChallengeIndex(
      (previous) => (previous + 1) % CHALLENGES.length
    );

    setSequence([]);
    setCompleted(false);
    setShowHint(false);
    setMessage('');
    setAttempts(0);
  };

  const progress =
    ((challengeIndex + (completed ? 1 : 0)) / CHALLENGES.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-6 rounded-3xl border border-app-border shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">💻</span>

            <h2 className="text-2xl font-bold text-white">
              Coding Basics
            </h2>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            Learn how computers solve problems step by step.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400">
            SCORE
          </div>

          <div className="text-xl font-bold text-white">
            {score}
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>
            Challenge {challengeIndex + 1} of {CHALLENGES.length}
          </span>

          <span>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CONCEPT */}
      <motion.div
        key={current.concept}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
            {concept.icon}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-indigo-300 font-bold">
              Coding Concept
            </div>

            <div className="text-lg font-bold text-white">
              {concept.label}
            </div>

            <div className="text-sm text-gray-400">
              {concept.description}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CHALLENGE */}
      <div className="bg-[#171717] p-6 rounded-2xl border border-gray-800 mb-5 text-center">

        <div className="text-7xl mb-3">
          {current.emoji}
        </div>

        <h3 className="text-xl font-bold text-white">
          {current.title}
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          {current.instruction}
        </p>

        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs">
          Difficulty {current.difficulty}/3
        </div>
      </div>

      {/* CODE AREA */}
      <div className="mb-4">

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-300">
            Your Program
          </span>

          <span className="text-xs text-gray-500">
            {sequence.length} instruction
            {sequence.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="min-h-[90px] bg-[#101010] border border-gray-800 rounded-2xl p-4">

          {sequence.length === 0 ? (
            <div className="h-full min-h-[55px] flex items-center justify-center text-gray-600 text-sm">
              Click instructions below to build your program.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">

              {sequence.map((command, index) => (
                <motion.div
                  key={`${command}-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm"
                >
                  <span className="text-gray-500 font-mono">
                    {index + 1}
                  </span>

                  <span>{command}</span>
                </motion.div>
              ))}

            </div>
          )}

        </div>
      </div>

      {/* COMMANDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">

        {COMMANDS.map((command) => (
          <motion.button
            key={command}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={completed}
            onClick={() => addCommand(command)}
            className="p-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-xl text-white font-semibold border border-gray-700 transition"
          >
            {command}
          </motion.button>
        ))}

      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-2 mb-4">

        <button
          onClick={removeLast}
          disabled={sequence.length === 0 || completed}
          className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded-xl text-white font-bold"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>

        <button
          onClick={resetChallenge}
          className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        <button
          onClick={runCode}
          disabled={completed}
          className="flex-[2] min-w-[150px] flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white font-bold"
        >
          <Play className="w-4 h-4" />
          Run Program
        </button>

      </div>

      {/* HINT */}
      {!completed && (
        <button
          onClick={() => setShowHint((previous) => !previous)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-yellow-400 hover:text-yellow-300"
        >
          <Lightbulb className="w-4 h-4" />

          {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      )}

      <AnimatePresence>
        {showHint && !completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-200"
          >
            💡 {current.hint}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FEEDBACK */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl text-center font-semibold ${
            completed
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
          }`}
        >
          {completed && (
            <CheckCircle className="w-5 h-5 inline mr-2" />
          )}

          {message}
        </motion.div>
      )}

      {/* SUCCESS */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <button
            onClick={nextChallenge}
            className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold"
          >
            Next Coding Challenge →
          </button>
        </motion.div>
      )}

    </div>
  );
};