import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Lightbulb,
  Play,
  RotateCcw,
  Square,
  Target,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';

import {
  ROBOTICS_CHALLENGES,
  type RoboticsChallenge,
} from './roboticsChallenges';

import type { SequenceCommand } from './roboticsChallenges';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type Position = {
  x: number;
  y: number;
};

type Facing = 0 | 1 | 2 | 3;
// 0 = North
// 1 = East
// 2 = South
// 3 = West

const FACING_ICONS = ['⬆️', '➡️', '⬇️', '⬅️'];

const FACING_NAMES = ['North', 'East', 'South', 'West'];

const COMMANDS: {
  command: SequenceCommand;
  label: string;
  icon: string;
  className: string;
}[] = [
  {
    command: 'Forward',
    label: 'Forward',
    icon: '⬆️',
    className: 'bg-blue-600 hover:bg-blue-500',
  },
  {
    command: 'Backward',
    label: 'Backward',
    icon: '⬇️',
    className: 'bg-blue-600 hover:bg-blue-500',
  },
  {
    command: 'TurnLeft',
    label: 'Turn Left',
    icon: '↶',
    className: 'bg-purple-600 hover:bg-purple-500',
  },
  {
    command: 'TurnRight',
    label: 'Turn Right',
    icon: '↷',
    className: 'bg-purple-600 hover:bg-purple-500',
  },
  {
    command: 'Wait',
    label: 'Wait',
    icon: '⏱️',
    className: 'bg-slate-600 hover:bg-slate-500',
  },
  {
    command: 'Stop',
    label: 'Stop',
    icon: '⏹️',
    className: 'bg-slate-600 hover:bg-slate-500',
  },
];

const DEFAULT_GRID_SIZE = 5;

const getGridSize = (challenge: RoboticsChallenge): number => {
  const candidate = challenge as RoboticsChallenge & {
    gridSize?: number;
  };

  return candidate.gridSize ?? DEFAULT_GRID_SIZE;
};

const getStartPosition = (challenge: RoboticsChallenge): Position => {
  const candidate = challenge as RoboticsChallenge & {
    robot?: Position;
    start?: Position;
  };

  return candidate.robot ?? candidate.start ?? { x: 0, y: 0 };
};

const getTargetPosition = (challenge: RoboticsChallenge): Position => {
  const candidate = challenge as RoboticsChallenge & {
    target?: Position;
  };

  return candidate.target ?? { x: 2, y: 0 };
};

const getTargetEmoji = (challenge: RoboticsChallenge): string => {
  const candidate = challenge as RoboticsChallenge & {
    targetEmoji?: string;
  };

  return candidate.targetEmoji ?? '⭐';
};

const isInsideGrid = (position: Position, gridSize: number): boolean => {
  return (
    position.x >= 0 &&
    position.x < gridSize &&
    position.y >= 0 &&
    position.y < gridSize
  );
};

const moveRelativeToFacing = (
  position: Position,
  facing: Facing,
  command: 'Forward' | 'Backward'
): Position => {
  const directionMultiplier = command === 'Forward' ? 1 : -1;

  const deltas: Position[] = [
    { x: 0, y: -1 }, // North
    { x: 1, y: 0 }, // East
    { x: 0, y: 1 }, // South
    { x: -1, y: 0 }, // West
  ];

  const delta = deltas[facing];

  return {
    x: position.x + delta.x * directionMultiplier,
    y: position.y + delta.y * directionMultiplier,
  };
};

const calculateNextFacing = (
  facing: Facing,
  command: SequenceCommand
): Facing => {
  if (command === 'TurnRight') {
    return ((facing + 1) % 4) as Facing;
  }

  if (command === 'TurnLeft') {
    return ((facing + 3) % 4) as Facing;
  }

  return facing;
};

export const Sequencer: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [sequence, setSequence] = useState<SequenceCommand[]>([]);
  const [robotPos, setRobotPos] = useState<Position>({ x: 0, y: 0 });
  const [facing, setFacing] = useState<Facing>(0);

  const [isRunning, setIsRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [failed, setFailed] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  const [showHint, setShowHint] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const challenge = ROBOTICS_CHALLENGES[challengeIndex];

  const gridSize = getGridSize(challenge);
  const startPosition = getStartPosition(challenge);
  const targetPosition = getTargetPosition(challenge);
  const targetEmoji = getTargetEmoji(challenge);

  const progress = useMemo(() => {
    if (ROBOTICS_CHALLENGES.length === 0) return 0;

    return Math.round(
      ((challengeIndex + 1) / ROBOTICS_CHALLENGES.length) * 100
    );
  }, [challengeIndex]);

  const isComplete = completedChallenges.includes(challenge.id);

  /*
   * Reset the robot whenever the challenge changes.
   */
  useEffect(() => {
    setRobotPos(startPosition);
    setFacing(0);
    setSequence([]);
    setWon(false);
    setFailed(false);
    setFeedback('');
    setShowHint(false);
    setIsRunning(false);
  }, [challengeIndex]);

  /*
   * Auto-read the challenge description when a new challenge loads.
   */
  useEffect(() => {
    if (!autoReadEnabled || !challenge) return;

    const timer = window.setTimeout(() => {
      speak(`${challenge.title}. ${challenge.description}`);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [challengeIndex, challenge, speak, autoReadEnabled]);

  /*
   * Read the hint when it opens.
   */
  useEffect(() => {
    if (showHint && challenge?.hint) {
      speak(challenge.hint);
    }
  }, [showHint, challenge, speak]);

  /*
   * Read the failure feedback when it appears.
   */
  useEffect(() => {
    if (!failed || !feedback) return;
    speak(`Let's debug it. ${feedback}`);
  }, [failed, feedback, speak]);

  /*
   * Clean up timers.
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /*
   * Add a command to the program.
   */
  const addCommand = (command: SequenceCommand) => {
    if (isRunning || won) return;

    if (soundEnabled) playSoundFeedback('move');

    setSequence((previous) => [...previous, command]);
    setFailed(false);
    setFeedback('');
  };

  /*
   * Remove the final command.
   */
  const removeLastCommand = () => {
    if (isRunning || won) return;

    if (soundEnabled) playSoundFeedback('move');

    setSequence((previous) => previous.slice(0, -1));
    setFailed(false);
    setFeedback('');
  };

  /*
   * Clear the entire program.
   */
  const clearProgram = () => {
    if (isRunning) return;

    if (soundEnabled) playSoundFeedback('move');
    speak('Program cleared.');

    setSequence([]);
    setRobotPos(startPosition);
    setFacing(0);
    setFailed(false);
    setWon(false);
    setFeedback('');
  };

  /*
   * Run the child's program.
   */
  const runProgram = () => {
    if (isRunning || sequence.length === 0 || won) return;

    setAttempts((previous) => previous + 1);
    setIsRunning(true);
    setFailed(false);
    setFeedback('');

    let currentPosition = { ...startPosition };
    let currentFacing: Facing = 0;
    let commandIndex = 0;

    const executeNext = () => {
      if (commandIndex >= sequence.length) {
        const reachedTarget =
          currentPosition.x === targetPosition.x &&
          currentPosition.y === targetPosition.y;

        if (reachedTarget) {
          if (soundEnabled) playSoundFeedback('correct');

          setWon(true);
          setIsRunning(false);

          setScore((previous) => previous + 10);

          setCompletedChallenges((previous) => {
            if (previous.includes(challenge.id)) {
              return previous;
            }

            return [...previous, challenge.id];
          });

          const message =
            challenge.successMessage ||
            'Excellent! Your robot reached its destination.';

          setFeedback(message);

          speak(`Mission successful! ${message}`);

          return;
        }

        if (soundEnabled) playSoundFeedback('try-again');

        setFailed(true);
        setIsRunning(false);
        setRobotPos(startPosition);
        setFacing(0);

        setFeedback(
          'The robot finished the program, but it did not reach the target. Think about what command is missing.'
        );

        return;
      }

      const command = sequence[commandIndex];

      /*
       * STOP
       */
      if (command === 'Stop') {
        commandIndex += 1;

        timeoutRef.current = setTimeout(executeNext, 350);

        return;
      }

      /*
       * WAIT
       */
      if (command === 'Wait') {
        commandIndex += 1;

        timeoutRef.current = setTimeout(executeNext, 700);

        return;
      }

      /*
       * TURN
       */
      if (command === 'TurnLeft' || command === 'TurnRight') {
        currentFacing = calculateNextFacing(currentFacing, command);

        setFacing(currentFacing);

        commandIndex += 1;

        timeoutRef.current = setTimeout(executeNext, 400);

        return;
      }

      /*
       * FORWARD / BACKWARD
       */
      if (command === 'Forward' || command === 'Backward') {
        const nextPosition = moveRelativeToFacing(
          currentPosition,
          currentFacing,
          command
        );

        if (!isInsideGrid(nextPosition, gridSize)) {
          if (soundEnabled) playSoundFeedback('try-again');

          setFailed(true);
          setIsRunning(false);

          setRobotPos(currentPosition);
          setFacing(currentFacing);

          setFeedback(
            'The robot tried to leave the grid. Try turning before moving forward.'
          );

          return;
        }

        currentPosition = nextPosition;

        setRobotPos(currentPosition);

        commandIndex += 1;

        timeoutRef.current = setTimeout(executeNext, 400);

        return;
      }

      commandIndex += 1;

      timeoutRef.current = setTimeout(executeNext, 400);
    };

    executeNext();
  };

  /*
   * Move to the next challenge.
   */
  const nextChallenge = () => {
    if (isRunning) return;

    if (challengeIndex < ROBOTICS_CHALLENGES.length - 1) {
      setChallengeIndex((previous) => previous + 1);
      return;
    }

    /*
     * If the learner reaches the final challenge,
     * return to the beginning while preserving score.
     */
    setChallengeIndex(0);
  };

  /*
   * Move backwards through challenges.
   */
  const previousChallenge = () => {
    if (isRunning || challengeIndex === 0) return;

    setChallengeIndex((previous) => previous - 1);
  };

  /*
   * Reset the current challenge.
   */
  const resetChallenge = () => {
    if (isRunning) return;

    if (soundEnabled) playSoundFeedback('move');

    setSequence([]);
    setRobotPos(startPosition);
    setFacing(0);
    setWon(false);
    setFailed(false);
    setFeedback('');
    setShowHint(false);

    speak('Challenge reset.');
  };

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 md:p-7 rounded-3xl border border-app-border shadow-xl">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-5 h-5 text-cyan-400" />

            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
              Robotics Academy
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white">Robot Sequencer</h3>

          <p className="text-sm text-gray-400 mt-1">
            Build an algorithm and teach the robot what to do.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-4 h-4 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>

          <button
            onClick={resetChallenge}
            disabled={isRunning}
            aria-label="Reset current challenge"
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mb-5">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-gray-400">
            Challenge {challengeIndex + 1} of {ROBOTICS_CHALLENGES.length}
          </span>

          <span className="text-emerald-400 font-semibold">
            {completedChallenges.length} completed
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* CHALLENGE INFO */}
      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{challenge.emoji}</div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-lg font-bold text-white">
                {challenge.title}
              </h4>

              {isComplete && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  Complete
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>

        {challenge.learningObjective && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-2 text-xs">
              <Target className="w-4 h-4 text-cyan-400" />

              <span className="text-gray-500">Learning goal:</span>

              <span className="text-gray-300">
                {challenge.learningObjective}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="mb-5">
        <div
          className="grid gap-1.5 bg-[#111] p-2 rounded-2xl border border-gray-800"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);

            const isRobot = robotPos.x === x && robotPos.y === y;

            const isTarget =
              targetPosition.x === x && targetPosition.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={[
                  'aspect-square rounded-xl flex items-center justify-center relative',
                  isTarget
                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                    : 'bg-gray-800/70 border border-gray-800',
                ].join(' ')}
              >
                {isTarget && !isRobot && (
                  <motion.span
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-2xl"
                  >
                    {targetEmoji}
                  </motion.span>
                )}

                {isRobot && (
                  <motion.div
                    layout
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative"
                  >
                    <motion.span
                      animate={{ rotate: facing * 90 }}
                      transition={{ duration: 0.25 }}
                      className="text-3xl md:text-4xl block"
                    >
                      🤖
                    </motion.span>
                  </motion.div>
                )}

                {!isRobot && !isTarget && (
                  <span className="text-[10px] text-gray-700">
                    {x},{y}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ROBOT STATUS */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs">
          <span className="text-gray-500">
            Position:{' '}
            <strong className="text-gray-300">
              ({robotPos.x}, {robotPos.y})
            </strong>
          </span>

          <span className="text-gray-500">
            Facing:{' '}
            <strong className="text-gray-300">
              {FACING_ICONS[facing]} {FACING_NAMES[facing]}
            </strong>
          </span>
        </div>
      </div>

      {/* GOAL */}
      <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 mb-5 text-center">
        <span className="text-sm text-gray-400">Goal: </span>

        <span className="text-sm text-yellow-300 font-semibold">
          Move the robot to {targetEmoji}
        </span>
      </div>

      {/* PROGRAM */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />

            <span className="text-sm font-bold text-white">Your Program</span>
          </div>

          <span className="text-xs text-gray-500">
            {sequence.length} command
            {sequence.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="min-h-[70px] p-3 rounded-2xl bg-[#111] border border-gray-800">
          {sequence.length === 0 ? (
            <div className="h-full min-h-[44px] flex items-center justify-center text-xs text-gray-600 italic">
              Add commands to build your algorithm...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sequence.map((command, index) => {
                const commandInfo = COMMANDS.find(
                  (item) => item.command === command
                );

                return (
                  <motion.div
                    key={`${command}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700"
                  >
                    <span className="text-[10px] text-gray-600">
                      {index + 1}
                    </span>

                    <span>{commandInfo?.icon}</span>

                    <span className="text-xs font-semibold text-gray-200">
                      {command}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* COMMANDS */}
      <div className="mb-5">
        <div className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">
          Commands
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {COMMANDS.map((item) => (
            <motion.button
              key={item.command}
              whileHover={{ scale: isRunning ? 1 : 1.02 }}
              whileTap={{ scale: isRunning ? 1 : 0.97 }}
              onClick={() => addCommand(item.command)}
              disabled={isRunning || won}
              className={`p-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${item.className}`}
            >
              <span className="mr-1">{item.icon}</span>

              {item.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* PROGRAM CONTROLS */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          onClick={removeLastCommand}
          disabled={isRunning || sequence.length === 0 || won}
          className="px-4 py-3 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-sm disabled:opacity-40"
        >
          Remove Last
        </button>

        <button
          onClick={clearProgram}
          disabled={isRunning || sequence.length === 0}
          className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-sm disabled:opacity-40"
        >
          Clear Program
        </button>
      </div>

      {/* RUN */}
      <button
        onClick={runProgram}
        disabled={isRunning || sequence.length === 0 || won}
        className="w-full px-5 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-4"
      >
        {isRunning ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: 'linear',
              }}
            >
              <Code2 className="w-5 h-5" />
            </motion.div>
            Running Program...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Run Program
          </>
        )}
      </button>

      {/* HINT */}
      {challenge.hint && (
        <div className="mb-4">
          <button
            onClick={() => setShowHint((previous) => !previous)}
            className="w-full p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/20 transition-colors"
          >
            <div className="flex items-center justify-center gap-2 text-yellow-300 text-sm font-semibold">
              <Lightbulb className="w-4 h-4" />

              {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </div>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-sm text-gray-400">
                  💡 {challenge.hint}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* FEEDBACK */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />

              <div className="flex-1 text-left">
                <div className="font-bold text-emerald-400 mb-1">
                  Mission successful!
                </div>

                <p className="text-sm text-gray-400">{feedback}</p>

                <div className="mt-3 flex items-center gap-2 text-xs text-yellow-300">
                  <Trophy className="w-4 h-4" />
                  +10 points
                </div>
              </div>
            </div>

            <button
              onClick={nextChallenge}
              className="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2"
            >
              Next Challenge
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {failed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />

              <div className="text-left">
                <div className="font-bold text-red-400 mb-1">
                  Let&apos;s debug it
                </div>

                <p className="text-sm text-gray-400">{feedback}</p>
              </div>
            </div>

            <button
              onClick={resetChallenge}
              className="mt-3 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <button
          onClick={previousChallenge}
          disabled={isRunning || challengeIndex === 0}
          className="px-3 py-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="text-center">
          <div className="text-xs text-gray-600">Attempts</div>

          <div className="text-sm text-gray-300 font-semibold">
            {attempts}
          </div>
        </div>

        <button
          onClick={nextChallenge}
          disabled={isRunning}
          className="px-3 py-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1 text-sm"
        >
          Skip
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* SCORE */}
      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Score:
          <strong className="text-yellow-300">{score}</strong>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <Target className="w-4 h-4 text-cyan-400" />
          Completed:
          <strong className="text-cyan-300">
            {completedChallenges.length}
          </strong>
        </div>
      </div>
    </div>
  );
};