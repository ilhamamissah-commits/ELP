import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowRight, MapPin } from 'lucide-react';

// --- Define the 65 Progressive Challenges ---
const CHALLENGES = [
  // Level 1 (Easy)
  { id: 1, title: 'Move Forward', gridSize: 3, robot: { x: 0, y: 2 }, target: { x: 2, y: 2 }, targetEmoji: '⭐', targetSequence: ['Forward', 'Forward'] },
  { id: 2, title: 'Turn Right', gridSize: 3, robot: { x: 0, y: 2 }, target: { x: 2, y: 2 }, targetEmoji: '⭐', targetSequence: ['Forward', 'Forward', 'TurnRight'] },
  { id: 3, title: 'Turn Left', gridSize: 3, robot: { x: 2, y: 2 }, target: { x: 0, y: 2 }, targetEmoji: '⭐', targetSequence: ['Left', 'Forward', 'Forward'] },
  { id: 4, title: 'Move Back', gridSize: 3, robot: { x: 2, y: 0 }, target: { x: 2, y: 2 }, targetEmoji: '⭐', targetSequence: ['Back', 'Back'] },
  { id: 5, title: 'Two Steps', gridSize: 3, robot: { x: 0, y: 0 }, target: { x: 2, y: 0 }, targetEmoji: '⭐', targetSequence: ['Forward', 'Forward'] },
  { id: 6, title: 'Go Right', gridSize: 3, robot: { x: 0, y: 0 }, target: { x: 2, y: 2 }, targetEmoji: '⭐', targetSequence: ['Right', 'Forward', 'Forward'] },
  { id: 7, title: 'Go Left', gridSize: 3, robot: { x: 2, y: 0 }, target: { x: 0, y: 2 }, targetEmoji: '⭐', targetSequence: ['Left', 'Forward', 'Forward'] },
  // ... (Note: You can keep your 65 challenges here, but I am providing the visual logic that works with all of them)
];

// Define the direction mapping
const MOVE_DELTAS: Record<string, { x: number; y: number }> = {
  'Forward': { x: 0, y: -1 }, // Up on screen
  'Back': { x: 0, y: 1 },     // Down on screen
  'Right': { x: 1, y: 0 },
  'Left': { x: -1, y: 0 },
};

// Define visual directions (for the robot's face)
const FACING_DIRECTIONS = ['⬆️', '➡️', '⬇️', '⬅️'];
const FACING_ROTATIONS = [0, 90, 180, 270]; // degrees

export const Sequencer: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState(0); // 0: Up, 1: Right, 2: Down, 3: Left
  const [won, setWon] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [score, setScore] = useState(0);
  
  // Store timeout to clean up
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const challenge = CHALLENGES[challengeIndex % CHALLENGES.length];

  // Reset robot position when challenge changes
  useEffect(() => {
    setRobotPos(challenge.robot);
    setFacing(0);
    setSequence([]);
    setWon(false);
    setFailed(false);
    setIsAnimating(false);
  }, [challengeIndex]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const addCommand = (command: string) => {
    if (isAnimating) return;
    setSequence([...sequence, command]);
  };

  const removeLast = () => {
    if (isAnimating) return;
    setSequence(sequence.slice(0, -1));
  };

  const runCode = () => {
    if (isAnimating || sequence.length === 0) return;
    
    setIsAnimating(true);
    setFailed(false);
    
    // Simulate the robot moving step by step
    let currentPos = { ...challenge.robot };
    let currentFacing = 0;
    let idx = 0;

    const moveStep = () => {
      if (idx >= sequence.length) {
        // Finished executing all commands
        if (currentPos.x === challenge.target.x && currentPos.y === challenge.target.y) {
          setWon(true);
          setScore(prev => prev + 10);
        } else {
          setFailed(true);
          // Reset to start
          setRobotPos(challenge.robot);
          setFacing(0);
        }
        setIsAnimating(false);
        return;
      }

      const command = sequence[idx];
      
      // Handle rotation commands
      if (command === 'TurnRight') {
        currentFacing = (currentFacing + 1) % 4;
        setFacing(currentFacing);
        idx++;
        timeoutRef.current = setTimeout(moveStep, 300);
        return;
      }
      if (command === 'TurnLeft') {
        currentFacing = (currentFacing + 3) % 4;
        setFacing(currentFacing);
        idx++;
        timeoutRef.current = setTimeout(moveStep, 300);
        return;
      }

      // Handle movement commands
      const directionMap: Record<string, number> = { Forward: 0, Back: 1, Right: 2, Left: 3 };
      // If command is a direction, face that direction and move
      if (directionMap.hasOwnProperty(command)) {
        const newFacing = directionMap[command];
        const delta = MOVE_DELTAS[command];
        currentFacing = newFacing;
        setFacing(newFacing);
        
        currentPos = {
          x: currentPos.x + delta.x,
          y: currentPos.y + delta.y
        };
        
        // Check if out of bounds or hit an obstacle
        if (currentPos.x < 0 || currentPos.x >= challenge.gridSize || currentPos.y < 0 || currentPos.y >= challenge.gridSize) {
          setFailed(true);
          setRobotPos(challenge.robot);
          setFacing(0);
          setIsAnimating(false);
          return;
        }
        
        setRobotPos(currentPos);
      }
      
      idx++;
      timeoutRef.current = setTimeout(moveStep, 300);
    };

    moveStep();
  };

  const nextChallenge = () => {
    if (challengeIndex < 64) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      setChallengeIndex(0);
      setScore(0);
      alert("🎉 You completed all 65 Challenges!");
    }
  };

  const resetGame = () => {
    setSequence([]);
    setRobotPos(challenge.robot);
    setFacing(0);
    setWon(false);
    setFailed(false);
    setIsAnimating(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🤖 Robot Sequencer</h3>
        <button onClick={resetGame} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Program the robot to reach the target!</p>

      <div className="flex justify-between items-center mb-4">
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs">Challenge {challengeIndex + 1} / 65</span>
        <span className="text-yellow-400 font-bold text-xs">⭐ Score: {score}</span>
      </div>

      {/* THE GRID (Where the robot lives) */}
      <div 
        className="grid gap-1 mb-4 bg-[#1a1a1a] p-2 rounded-xl border border-gray-800"
        style={{ gridTemplateColumns: `repeat(${challenge.gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: challenge.gridSize * challenge.gridSize }).map((_, index) => {
          const x = index % challenge.gridSize;
          const y = Math.floor(index / challenge.gridSize);
          const isRobot = robotPos.x === x && robotPos.y === y;
          const isTarget = challenge.target.x === x && challenge.target.y === y;

          return (
            <div 
              key={index} 
              className={`aspect-square rounded-lg flex items-center justify-center text-2xl ${isTarget ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-gray-800'}`}
            >
              {isRobot && (
                <motion.span
                  animate={{ rotate: FACING_ROTATIONS[facing] }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl"
                >
                  🤖
                </motion.span>
              )}
              {isTarget && !isRobot && <span className="text-2xl">{challenge.targetEmoji}</span>}
            </div>
          );
        })}
      </div>

      {/* TARGET DISPLAY */}
      <div className="mb-4 text-sm text-gray-400">
        Goal: Move to <span className="text-yellow-400 font-bold">{challenge.targetEmoji}</span> using the commands below.
      </div>

      {/* SEQUENCE DISPLAY */}
      <div className="bg-[#1a1a1a] p-3 rounded-xl border border-gray-800 mb-4 min-h-[50px] flex flex-wrap gap-2 justify-center items-center">
        <p className="text-gray-500 text-xs w-full mb-1">Your Code:</p>
        {sequence.length === 0 ? <span className="text-gray-600 italic">Tap commands below to build your code...</span> : sequence.map((cmd, idx) => (
          <motion.span 
            key={idx}
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${cmd === 'Forward' || cmd === 'Back' || cmd === 'Left' || cmd === 'Right' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}
          >
            {cmd}
          </motion.span>
        ))}
      </div>

      {/* COMMAND BUTTONS */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {['Forward', 'Back', 'Right', 'Left'].map((command) => (
          <motion.button
            key={command}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addCommand(command)}
            disabled={isAnimating}
            className="p-3 bg-blue-600 rounded-lg text-white font-bold text-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {command === 'Forward' ? '⬆️' : command === 'Back' ? '⬇️' : command === 'Right' ? '➡️' : '⬅️'} {command}
          </motion.button>
        ))}
      </div>

      {/* ROTATION COMMANDS */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {['TurnRight', 'TurnLeft'].map((command) => (
          <motion.button
            key={command}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addCommand(command)}
            disabled={isAnimating}
            className="p-3 bg-purple-600 rounded-lg text-white font-bold text-sm hover:bg-purple-500 disabled:opacity-50"
          >
            {command === 'TurnRight' ? '🔄' : '🔄'} {command}
          </motion.button>
        ))}
      </div>

      {/* CONTROL BUTTONS */}
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={removeLast} disabled={isAnimating} className="px-4 py-2 bg-red-600 rounded-lg text-white font-bold disabled:opacity-50">Remove</button>
        <button onClick={runCode} disabled={isAnimating || sequence.length === 0} className="px-6 py-2 bg-green-600 rounded-lg text-white font-bold disabled:opacity-50">Run Code!</button>
      </div>

      {/* FEEDBACK */}
      {won && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> The robot reached its destination!
          <button onClick={nextChallenge} className="ml-2 px-4 py-1 bg-green-600 rounded-lg text-white">Next <ArrowRight className="w-4 h-4 inline" /></button>
        </motion.div>
      )}
      {failed && (
        <div className="p-3 bg-red-500/20 rounded-xl text-red-400 font-bold text-sm">
          ❌ The robot went off course! Try a different sequence.
        </div>
      )}
    </div>
  );
};