import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowRight, Star } from 'lucide-react';

interface LevelData {
  gridSize: number; 
  start: { x: number; y: number };
  target: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  steps: string[]; // The exact path to take
}

const LEVELS: LevelData[] = [
  // --- LEVEL 1: Beginner (3x3 Grid, Short Paths) ---
  { gridSize: 3, start: { x: 0, y: 0 }, target: { x: 1, y: 0 }, obstacles: [], steps: ['Right'] },
  { gridSize: 3, start: { x: 0, y: 0 }, target: { x: 0, y: 1 }, obstacles: [], steps: ['Down'] },
  { gridSize: 3, start: { x: 0, y: 0 }, target: { x: 2, y: 0 }, obstacles: [], steps: ['Right', 'Right'] },
  { gridSize: 3, start: { x: 2, y: 0 }, target: { x: 2, y: 2 }, obstacles: [], steps: ['Down', 'Down'] },
  { gridSize: 3, start: { x: 0, y: 2 }, target: { x: 2, y: 2 }, obstacles: [], steps: ['Right', 'Right'] },
  { gridSize: 3, start: { x: 1, y: 1 }, target: { x: 1, y: 2 }, obstacles: [], steps: ['Down'] },
  { gridSize: 3, start: { x: 0, y: 2 }, target: { x: 2, y: 0 }, obstacles: [], steps: ['Right', 'Up', 'Up'] },
  { gridSize: 3, start: { x: 0, y: 2 }, target: { x: 2, y: 0 }, obstacles: [], steps: ['Up', 'Right', 'Right'] },

  // --- LEVEL 2: Intermediate (4x4 Grid, Moderate Paths) ---
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 3, y: 0 }, obstacles: [], steps: ['Right', 'Right', 'Right'] },
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 0, y: 3 }, obstacles: [], steps: ['Down', 'Down', 'Down'] },
  { gridSize: 4, start: { x: 1, y: 1 }, target: { x: 3, y: 3 }, obstacles: [], steps: ['Right', 'Down', 'Down', 'Right'] },
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 2, y: 2 }, obstacles: [{ x: 1, y: 1 }], steps: ['Right', 'Down', 'Down', 'Right'] }, // Basic obstacle
  { gridSize: 4, start: { x: 3, y: 3 }, target: { x: 1, y: 3 }, obstacles: [], steps: ['Left', 'Left'] },
  { gridSize: 4, start: { x: 0, y: 3 }, target: { x: 3, y: 0 }, obstacles: [], steps: ['Up', 'Up', 'Right', 'Right', 'Up'] },

  // --- LEVEL 3: Harder (4x4 Grid, Obstacles) ---
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 3, y: 2 }, obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }], steps: ['Right', 'Down', 'Right', 'Right', 'Up'] },
  { gridSize: 4, start: { x: 2, y: 0 }, target: { x: 0, y: 3 }, obstacles: [{ x: 2, y: 1 }, { x: 1, y: 2 }], steps: ['Left', 'Left', 'Down', 'Right', 'Down', 'Left'] },
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 3, y: 3 }, obstacles: [], steps: ['Right', 'Right', 'Down', 'Down', 'Right'] },
  { gridSize: 4, start: { x: 0, y: 2 }, target: { x: 3, y: 2 }, obstacles: [{ x: 1, y: 2 }], steps: ['Down', 'Right', 'Up', 'Right', 'Right'] },
  { gridSize: 4, start: { x: 1, y: 0 }, target: { x: 1, y: 3 }, obstacles: [{ x: 1, y: 1 }], steps: ['Right', 'Down', 'Left', 'Down', 'Down'] },

  // --- LEVEL 4: Master (4x4 Grid, Complex Paths) ---
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 3, y: 3 }, obstacles: [{ x: 1, y: 0 }, { x: 2, y: 0 }], steps: ['Down', 'Right', 'Up', 'Right', 'Right', 'Down', 'Down'] },
  { gridSize: 4, start: { x: 3, y: 0 }, target: { x: 0, y: 3 }, obstacles: [{ x: 3, y: 1 }], steps: ['Down', 'Right', 'Left', 'Left', 'Left', 'Down', 'Down'] },
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 3, y: 3 }, obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }], steps: ['Right', 'Down', 'Right', 'Down', 'Right', 'Right'] },
  { gridSize: 4, start: { x: 0, y: 0 }, target: { x: 3, y: 3 }, obstacles: [{ x: 1, y: 0 }, { x: 3, y: 2 }], steps: ['Down', 'Right', 'Right', 'Up', 'Right', 'Down', 'Down'] },

  // --- LEVEL 5: Advanced (5x5 Grid, Super Complex) ---
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [], steps: ['Right', 'Right', 'Down', 'Down', 'Right', 'Down', 'Down'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }], steps: ['Down', 'Right', 'Right', 'Right', 'Right', 'Down', 'Down', 'Down'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 1 }, { x: 1, y: 1 }], steps: ['Right', 'Right', 'Down', 'Down', 'Down', 'Right', 'Right', 'Right'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [], steps: ['Right', 'Down', 'Right', 'Down', 'Right', 'Right', 'Down', 'Down'] },

  // --- LEVEL 6: Genius (5x5 Grid, Maze-like) ---
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }], steps: ['Down', 'Down', 'Down', 'Down', 'Right', 'Right', 'Right', 'Right', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }], steps: ['Right', 'Down', 'Right', 'Down', 'Down', 'Right', 'Right', 'Right', 'Up', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }], steps: ['Right', 'Right', 'Up', 'Right', 'Down', 'Down', 'Right', 'Right', 'Right'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }], steps: ['Down', 'Down', 'Down', 'Down', 'Right', 'Right', 'Right', 'Right', 'Up', 'Up', 'Up'] },

  // --- LEVEL 7: Extreme (More Obstacles) ---
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }], steps: ['Right', 'Down', 'Down', 'Right', 'Down', 'Down', 'Right', 'Right', 'Right', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }], steps: ['Right', 'Right', 'Down', 'Down', 'Right', 'Right', 'Right', 'Down', 'Down', 'Left', 'Left', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }], steps: ['Down', 'Right', 'Right', 'Down', 'Down', 'Right', 'Right', 'Down', 'Right', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }], steps: ['Down', 'Right', 'Right', 'Down', 'Down', 'Down', 'Right', 'Right', 'Up', 'Right'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }], steps: ['Right', 'Down', 'Down', 'Right', 'Right', 'Right', 'Right', 'Down', 'Down', 'Down', 'Down'] },

  // --- LEVEL 8: Legendary (Very Long Paths) ---
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }], steps: ['Right', 'Right', 'Up', 'Up', 'Right', 'Right', 'Right', 'Down', 'Down', 'Right', 'Down'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }], steps: ['Down', 'Down', 'Right', 'Up', 'Right', 'Right', 'Down', 'Down', 'Right', 'Right', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }], steps: ['Down', 'Down', 'Down', 'Right', 'Right', 'Up', 'Right', 'Down', 'Down', 'Right', 'Right', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 2 }], steps: ['Right', 'Right', 'Right', 'Down', 'Down', 'Right', 'Right', 'Down', 'Down', 'Up', 'Right', 'Right'] },

  // --- LEVEL 9 & 10: Final Bosses ---
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 1 }], steps: ['Down', 'Down', 'Right', 'Right', 'Right', 'Up', 'Right', 'Down', 'Down', 'Right', 'Down', 'Down'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }], steps: ['Down', 'Right', 'Down', 'Down', 'Right', 'Up', 'Right', 'Down', 'Down', 'Right', 'Right', 'Right', 'Up'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }], steps: ['Right', 'Right', 'Right', 'Down', 'Down', 'Right', 'Right', 'Down', 'Down', 'Left', 'Left', 'Down', 'Right', 'Right'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }], steps: ['Down', 'Down', 'Right', 'Right', 'Up', 'Right', 'Down', 'Down', 'Right', 'Right', 'Down', 'Down', 'Up', 'Right'] },
  { gridSize: 5, start: { x: 0, y: 0 }, target: { x: 4, y: 4 }, obstacles: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }], steps: ['Down', 'Down', 'Right', 'Down', 'Down', 'Right', 'Right', 'Right', 'Right', 'Up', 'Up', 'Up', 'Right', 'Down'] },
];

const MOVE_DELTAS: Record<string, { x: number; y: number }> = {
  'Up': { x: 0, y: -1 },
  'Down': { x: 0, y: 1 },
  'Left': { x: -1, y: 0 },
  'Right': { x: 1, y: 0 },
};

export const SpatialPuzzle: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [commandCount, setCommandCount] = useState(0);
  const [won, setWon] = useState(false);
  const [failed, setFailed] = useState(false);
  const [score, setScore] = useState(0);

  const challenge = LEVELS[levelIndex];
  const gridSize = challenge.gridSize;

  // Reset robot position when level changes
  useEffect(() => {
    resetGame();
  }, [levelIndex]);

  const resetGame = () => {
    setRobotPos({ x: challenge.start.x, y: challenge.start.y });
    setCommandCount(0);
    setWon(false);
    setFailed(false);
  };

  const handleMove = (direction: string) => {
    if (won || failed) return;
    const delta = MOVE_DELTAS[direction];
    const newX = robotPos.x + delta.x;
    const newY = robotPos.y + delta.y;

    // Check out of bounds
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
      setFailed(true);
      return;
    }

    // Check obstacle collision
    const hitObstacle = challenge.obstacles.some(obs => obs.x === newX && obs.y === newY);
    if (hitObstacle) {
      setFailed(true);
      return;
    }

    setRobotPos({ x: newX, y: newY });
    setCommandCount(prev => prev + 1);

    // Win condition
    if (newX === challenge.target.x && newY === challenge.target.y) {
      setWon(true);
      setScore(prev => prev + 10);
    } 
    // Lose condition if we used too many moves
    else if (commandCount + 1 >= challenge.steps.length) {
      setFailed(true);
    }
  };

  const nextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else {
      // Beat all 50!
      setLevelIndex(0);
      setScore(0);
      alert("🎉 You completed all 50 levels! Amazing!");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🤖 Spatial Puzzle</h3>
        <button onClick={resetGame} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Guide the robot to the star!</p>

      <div className="flex justify-between items-center mb-4">
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs">
          Level {levelIndex + 1} / {LEVELS.length}
        </span>
        <span className="text-yellow-400 font-bold text-xs">⭐ Score: {score}</span>
      </div>

      {/* Grid */}
      <div 
        className="grid gap-1 mb-6"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isRobot = robotPos.x === x && robotPos.y === y;
          const isTarget = challenge.target.x === x && challenge.target.y === y;
          const isObstacle = challenge.obstacles.some(obs => obs.x === x && obs.y === y);

          return (
            <div 
              key={index} 
              className={`aspect-square rounded-md flex items-center justify-center text-xl sm:text-2xl ${
                isObstacle ? 'bg-gray-600' : isTarget ? 'bg-yellow-500/30' : 'bg-gray-800'
              }`}
            >
              {isRobot ? '🤖' : isTarget ? '⭐' : ''}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-6">
        {['Up', 'Down', 'Left', 'Right'].map((direction) => (
          <motion.button
            key={direction}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMove(direction)}
            className="px-3 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500 text-sm"
          >
            {direction}
          </motion.button>
        ))}
      </div>

      {/* Win / Lose Feedback */}
      {won && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold mb-2">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Level complete!
          <button onClick={nextLevel} className="ml-2 px-4 py-1 bg-green-600 rounded-lg text-white">
            Next <ArrowRight className="w-4 h-4 inline" />
          </button>
        </motion.div>
      )}
      {failed && (
        <div className="p-3 bg-red-500/20 rounded-xl text-red-400 font-bold">
          Oops! Try again.
          <button onClick={resetGame} className="ml-2 px-3 py-1 bg-red-600 rounded-lg text-white text-xs">Retry</button>
        </div>
      )}
    </div>
  );
};