import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';

// --- 100 Progressive Items across 4 Levels ---
interface Item {
  id: number;
  emoji: string;
  category: string;
  level: number; // 1-4
}

const ITEMS: Item[] = [
  // LEVEL 1: Simple, obvious (10 items)
  { id: 1, emoji: '🍎', category: 'fruit', level: 1 },
  { id: 2, emoji: '🐶', category: 'animal', level: 1 },
  { id: 3, emoji: '🍌', category: 'fruit', level: 1 },
  { id: 4, emoji: '🐱', category: 'animal', level: 1 },
  { id: 5, emoji: '🚗', category: 'vehicle', level: 1 },
  { id: 6, emoji: '⚽', category: 'toy', level: 1 },
  { id: 7, emoji: '🍓', category: 'fruit', level: 1 },
  { id: 8, emoji: '🐟', category: 'animal', level: 1 },
  { id: 9, emoji: '🚌', category: 'vehicle', level: 1 },
  { id: 10, emoji: '🧸', category: 'toy', level: 1 },

  // LEVEL 2: Slightly harder (20 items)
  { id: 11, emoji: '🥕', category: 'vegetable', level: 2 },
  { id: 12, emoji: '👕', category: 'clothing', level: 2 },
  { id: 13, emoji: '🔴', category: 'color', level: 2 },
  { id: 14, emoji: '🍊', category: 'fruit', level: 2 },
  { id: 15, emoji: '🐸', category: 'animal', level: 2 },
  { id: 16, emoji: '🚲', category: 'vehicle', level: 2 },
  { id: 17, emoji: '🎲', category: 'toy', level: 2 },
  { id: 18, emoji: '🥦', category: 'vegetable', level: 2 },
  { id: 19, emoji: '👗', category: 'clothing', level: 2 },
  { id: 20, emoji: '🔵', category: 'color', level: 2 },
  { id: 21, emoji: '🍇', category: 'fruit', level: 2 },
  { id: 22, emoji: '🐔', category: 'animal', level: 2 },
  { id: 23, emoji: '🚂', category: 'vehicle', level: 2 },
  { id: 24, emoji: '🪀', category: 'toy', level: 2 },
  { id: 25, emoji: '🍅', category: 'vegetable', level: 2 },
  { id: 26, emoji: '🧢', category: 'clothing', level: 2 },
  { id: 27, emoji: '🟢', category: 'color', level: 2 },
  { id: 28, emoji: '🍍', category: 'fruit', level: 2 },
  { id: 29, emoji: '🐷', category: 'animal', level: 2 },
  { id: 30, emoji: '✈️', category: 'vehicle', level: 2 },

  // LEVEL 3: Harder mixes (30 items)
  { id: 31, emoji: '🍞', category: 'food', level: 3 },
  { id: 32, emoji: '🔺', category: 'shape', level: 3 },
  { id: 33, emoji: '🔨', category: 'tool', level: 3 },
  { id: 34, emoji: '🥒', category: 'vegetable', level: 3 },
  { id: 35, emoji: '🧣', category: 'clothing', level: 3 },
  { id: 36, emoji: '🟡', category: 'color', level: 3 },
  { id: 37, emoji: '🍔', category: 'food', level: 3 },
  { id: 38, emoji: '🟦', category: 'shape', level: 3 },
  { id: 39, emoji: '🔧', category: 'tool', level: 3 },
  { id: 40, emoji: '🌽', category: 'vegetable', level: 3 },
  { id: 41, emoji: '🩴', category: 'clothing', level: 3 },
  { id: 42, emoji: '🟠', category: 'color', level: 3 },
  { id: 43, emoji: '🍕', category: 'food', level: 3 },
  { id: 44, emoji: '🟥', category: 'shape', level: 3 },
  { id: 45, emoji: '🔩', category: 'tool', level: 3 },
  { id: 46, emoji: '🧅', category: 'vegetable', level: 3 },
  { id: 47, emoji: '👟', category: 'clothing', level: 3 },
  { id: 48, emoji: '🟣', category: 'color', level: 3 },
  { id: 49, emoji: '🍗', category: 'food', level: 3 },
  { id: 50, emoji: '🟩', category: 'shape', level: 3 },
  { id: 51, emoji: '🔬', category: 'tool', level: 3 },
  { id: 52, emoji: '🥔', category: 'vegetable', level: 3 },
  { id: 53, emoji: '👔', category: 'clothing', level: 3 },
  { id: 54, emoji: '🟤', category: 'color', level: 3 },
  { id: 55, emoji: '🌮', category: 'food', level: 3 },
  { id: 56, emoji: '🟪', category: 'shape', level: 3 },
  { id: 57, emoji: '🪛', category: 'tool', level: 3 },
  { id: 58, emoji: '🍠', category: 'vegetable', level: 3 },
  { id: 59, emoji: '🧥', category: 'clothing', level: 3 },
  { id: 60, emoji: '🟥', category: 'color', level: 3 },

  // LEVEL 4: Advanced (40 items)
  { id: 61, emoji: '🍜', category: 'food', level: 4 },
  { id: 62, emoji: '🟨', category: 'shape', level: 4 },
  { id: 63, emoji: '🪚', category: 'tool', level: 4 },
  { id: 64, emoji: '🥬', category: 'vegetable', level: 4 },
  { id: 65, emoji: '👖', category: 'clothing', level: 4 },
  { id: 66, emoji: '🟦', category: 'color', level: 4 },
  { id: 67, emoji: '🍣', category: 'food', level: 4 },
  { id: 68, emoji: '🟦', category: 'shape', level: 4 },
  { id: 69, emoji: '🔦', category: 'tool', level: 4 },
  { id: 70, emoji: '🍆', category: 'vegetable', level: 4 },
  { id: 71, emoji: '👞', category: 'clothing', level: 4 },
  { id: 72, emoji: '🟨', category: 'color', level: 4 },
  { id: 73, emoji: '🍱', category: 'food', level: 4 },
  { id: 74, emoji: '🟧', category: 'shape', level: 4 },
  { id: 75, emoji: '🪜', category: 'tool', level: 4 },
  { id: 76, emoji: '🥕', category: 'vegetable', level: 4 },
  { id: 77, emoji: '👒', category: 'clothing', level: 4 },
  { id: 78, emoji: '🟩', category: 'color', level: 4 },
  { id: 79, emoji: '🍩', category: 'food', level: 4 },
  { id: 80, emoji: '🟩', category: 'shape', level: 4 },
  { id: 81, emoji: '🪓', category: 'tool', level: 4 },
  { id: 82, emoji: '🥑', category: 'vegetable', level: 4 },
  { id: 83, emoji: '👘', category: 'clothing', level: 4 },
  { id: 84, emoji: '🟦', category: 'color', level: 4 },
  { id: 85, emoji: '🍪', category: 'food', level: 4 },
  { id: 86, emoji: '🟪', category: 'shape', level: 4 },
  { id: 87, emoji: '⚒️', category: 'tool', level: 4 },
  { id: 88, emoji: '🫑', category: 'vegetable', level: 4 },
  { id: 89, emoji: '🧤', category: 'clothing', level: 4 },
  { id: 90, emoji: '🟨', category: 'color', level: 4 },
  { id: 91, emoji: '🍰', category: 'food', level: 4 },
  { id: 92, emoji: '🟦', category: 'shape', level: 4 },
  { id: 93, emoji: '🔧', category: 'tool', level: 4 },
  { id: 94, emoji: '🥦', category: 'vegetable', level: 4 },
  { id: 95, emoji: '🧦', category: 'clothing', level: 4 },
  { id: 96, emoji: '🟩', category: 'color', level: 4 },
  { id: 97, emoji: '🍦', category: 'food', level: 4 },
  { id: 98, emoji: '🟧', category: 'shape', level: 4 },
  { id: 99, emoji: '🪛', category: 'tool', level: 4 },
  { id: 100, emoji: '🥗', category: 'vegetable', level: 4 },
];

// Categories (10 total)
const CATEGORIES = ['fruit', 'animal', 'vehicle', 'toy', 'vegetable', 'clothing', 'color', 'food', 'shape', 'tool'];

export const ClassificationSorter: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sorted, setSorted] = useState<Record<string, string[]>>({});
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Get items for the current level
  const levelItems = ITEMS.filter(item => item.level === currentLevel);
  const currentItem = levelItems[currentItemIndex];

  // Reset when level changes
  useEffect(() => {
    setSorted({});
    setCurrentItemIndex(0);
    setCompleted(false);
  }, [currentLevel]);

  const handleSort = (category: string) => {
    if (!currentItem) return;

    if (category === currentItem.category) {
      // Correct!
      if (!sorted[category]) sorted[category] = [];
      sorted[category].push(currentItem.emoji);
      setSorted({ ...sorted });
      setScore(score + 10);

      if (currentItemIndex < levelItems.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
      } else {
        setCompleted(true);
      }
    } else {
      // Incorrect - shake or show feedback
      alert("Oops! That's not the right category. Try again!");
    }
  };

  const nextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(1);
      setScore(0);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setSorted({});
    setCurrentItemIndex(0);
    setCompleted(false);
  };

  // Calculate progress for current level
  const progress = ((currentItemIndex) / levelItems.length) * 100;

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">📦 Classification Sorter</h3>
        <button onClick={resetGame} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Sort each item into the correct category!</p>

      <div className="flex justify-between items-center mb-4 text-xs">
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">Level {currentLevel}</span>
        <span className="text-yellow-400 font-bold">Score: {score}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {!completed ? (
        <>
          <div className="w-24 h-24 mx-auto bg-gray-800 rounded-xl flex items-center justify-center mb-6">
            <span className="text-5xl">{currentItem?.emoji}</span>
          </div>

          <p className="text-gray-400 text-sm mb-4">Which category does this belong to?</p>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSort(category)}
                className="p-3 bg-gray-800 rounded-xl text-white font-bold border-2 border-gray-700 hover:border-indigo-400"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}s
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold mb-4">
            <CheckCircle className="w-5 h-5 inline mr-1" /> Perfect sorting! Level {currentLevel} Complete!
          </motion.div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <div key={category} className="p-2 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">{category}s</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {sorted[category]?.map((emoji, idx) => <span key={idx} className="text-2xl">{emoji}</span>)}
                </div>
              </div>
            ))}
          </div>
          <button onClick={nextLevel} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 mx-auto">
            Next Level <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};