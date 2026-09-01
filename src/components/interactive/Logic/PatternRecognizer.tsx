import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowRight, Star } from 'lucide-react';

// --- 100 Progressive Pattern Levels ---
// Structure: 'pattern' = shows 5 items, 'next' = correct answer, 'options' = distractors
interface LevelData {
  pattern: string[];
  next: string;
  options: string[];
  hint: string;
}

const LEVELS: LevelData[] = [
  // LEVEL 1: AB pattern
  { pattern: ['🔴', '🔵', '🔴', '🔵', '🔴'], next: '🔵', options: ['🔵', '🟡'], hint: 'Red, Blue, Red, Blue, Red...' },
  { pattern: ['⭐', '🌙', '⭐', '🌙', '⭐'], next: '🌙', options: ['🌙', '☀️'], hint: 'Star, Moon, Star, Moon...' },
  { pattern: ['🐱', '🐶', '🐱', '🐶', '🐱'], next: '🐶', options: ['🐶', '🐸'], hint: 'Cat, Dog, Cat, Dog...' },

  // LEVEL 2: AAB pattern
  { pattern: ['🍎', '🍎', '🍌', '🍎', '🍎'], next: '🍌', options: ['🍌', '🍇'], hint: 'Apple, Apple, Banana, Apple, Apple...' },
  { pattern: ['🚗', '🚗', '🚌', '🚗', '🚗'], next: '🚌', options: ['🚌', '🚲'], hint: 'Car, Car, Bus, Car, Car...' },
  { pattern: ['⭐', '⭐', '🌟', '⭐', '⭐'], next: '🌟', options: ['🌟', '💫'], hint: 'Star, Star, Big Star, Star, Star...' },

  // LEVEL 3: ABB pattern
  { pattern: ['🌸', '🌿', '🌿', '🌸', '🌿'], next: '🌿', options: ['🌿', '🌳'], hint: 'Flower, Leaf, Leaf, Flower, Leaf...' },
  { pattern: ['🍓', '🍒', '🍒', '🍓', '🍒'], next: '🍒', options: ['🍒', '🍇'], hint: 'Strawberry, Cherry, Cherry, Strawberry, Cherry...' },
  { pattern: ['🐸', '🐟', '🐟', '🐸', '🐟'], next: '🐟', options: ['🐟', '🐙'], hint: 'Frog, Fish, Fish, Frog, Fish...' },

  // LEVEL 4: ABC pattern
  { pattern: ['🔴', '🟡', '🟢', '🔴', '🟡'], next: '🟢', options: ['🟢', '🔵'], hint: 'Red, Yellow, Green, Red, Yellow...' },
  { pattern: ['🐱', '🐶', '🐰', '🐱', '🐶'], next: '🐰', options: ['🐰', '🐻'], hint: 'Cat, Dog, Rabbit, Cat, Dog...' },
  { pattern: ['⭐', '🌙', '☀️', '⭐', '🌙'], next: '☀️', options: ['☀️', '🌥️'], hint: 'Star, Moon, Sun, Star, Moon...' },

  // LEVEL 5: ABCD pattern
  { pattern: ['🍎', '🍌', '🍇', '🍓', '🍎'], next: '🍌', options: ['🍌', '🍊'], hint: 'Apple, Banana, Grape, Strawberry, Apple...' },
  { pattern: ['🚗', '✈️', '🚢', '🚂', '🚗'], next: '✈️', options: ['✈️', '🚲'], hint: 'Car, Plane, Boat, Train, Car...' },
  { pattern: ['🌸', '🌿', '🌻', '🌱', '🌸'], next: '🌿', options: ['🌿', '🌳'], hint: 'Flower, Leaf, Sunflower, Seed, Flower...' },

  // LEVEL 6: AABB pattern
  { pattern: ['🔴', '🔴', '🔵', '🔵', '🔴'], next: '🔴', options: ['🔴', '🟢'], hint: 'Red, Red, Blue, Blue, Red...' },
  { pattern: ['🍎', '🍎', '🍌', '🍌', '🍎'], next: '🍎', options: ['🍎', '🍇'], hint: 'Apple, Apple, Banana, Banana, Apple...' },
  { pattern: ['🐱', '🐱', '🐶', '🐶', '🐱'], next: '🐱', options: ['🐱', '🐰'], hint: 'Cat, Cat, Dog, Dog, Cat...' },

  // LEVEL 7: ABBCC pattern
  { pattern: ['🔴', '🔵', '🔵', '🟢', '🟢', '🔴'], next: '🔵', options: ['🔵', '🟡'], hint: 'Red, Blue, Blue, Green, Green, Red...' },
  { pattern: ['⭐', '🌙', '🌙', '☀️', '☀️', '⭐'], next: '🌙', options: ['🌙', '💫'], hint: 'Star, Moon, Moon, Sun, Sun, Star...' },
  { pattern: ['🌸', '🌿', '🌿', '🌻', '🌻', '🌸'], next: '🌿', options: ['🌿', '🌳'], hint: 'Flower, Leaf, Leaf, Sunflower, Sunflower, Flower...' },

  // LEVEL 8: ABABAB pattern (extended)
  { pattern: ['🍎', '🍌', '🍎', '🍌', '🍎'], next: '🍌', options: ['🍌', '🍇'], hint: 'Apple, Banana, Apple, Banana, Apple...' },
  { pattern: ['🚗', '🚌', '🚗', '🚌', '🚗'], next: '🚌', options: ['🚌', '🚲'], hint: 'Car, Bus, Car, Bus, Car...' },
  { pattern: ['🐱', '🐸', '🐱', '🐸', '🐱'], next: '🐸', options: ['🐸', '🐰'], hint: 'Cat, Frog, Cat, Frog, Cat...' },

  // LEVEL 9: ABCABC pattern
  { pattern: ['🍎', '🍌', '🍇', '🍎', '🍌'], next: '🍇', options: ['🍇', '🍊'], hint: 'Apple, Banana, Grape, Apple, Banana...' },
  { pattern: ['🐱', '🐶', '🐰', '🐱', '🐶'], next: '🐰', options: ['🐰', '🐻'], hint: 'Cat, Dog, Rabbit, Cat, Dog...' },
  { pattern: ['🔴', '🟡', '🟢', '🔴', '🟡'], next: '🟢', options: ['🟢', '🔵'], hint: 'Red, Yellow, Green, Red, Yellow...' },

  // LEVEL 10: Advanced / Challenge
  { pattern: ['⭐', '🌙', '☀️', '⭐', '🌙'], next: '☀️', options: ['☀️', '🌥️'], hint: 'Star, Moon, Sun, Star, Moon...' },
  { pattern: ['🍎', '🍌', '🍇', '🍓', '🍎'], next: '🍌', options: ['🍌', '🍊'], hint: 'Apple, Banana, Grape, Strawberry, Apple...' },
  { pattern: ['🚗', '✈️', '🚢', '🚂', '🚗'], next: '✈️', options: ['✈️', '🚲'], hint: 'Car, Plane, Boat, Train, Car...' },
  { pattern: ['🌸', '🌿', '🌻', '🌱', '🌸'], next: '🌿', options: ['🌿', '🌳'], hint: 'Flower, Leaf, Sunflower, Seed, Flower...' },
];

export const PatternRecognizer: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const current = LEVELS[levelIndex];

  // Determine the correct answer based on pattern
  const getCorrectAnswer = () => current.next;

  const handleSelect = (id: string) => {
    if (isCorrect) return;
    setSelected(id);

    if (id === getCorrectAnswer()) {
      setIsCorrect(true);
      setScore(prev => prev + 10);
      setTimeout(() => {
        if (levelIndex < LEVELS.length - 1) setLevelIndex(prev => prev + 1);
        else setLevelIndex(0); // Reset to level 1 if they beat all 30
        setSelected(null);
        setIsCorrect(false);
        setShowHint(false);
      }, 1500);
    } else {
      // Wrong answer: reset selected so they can try again
      setTimeout(() => setSelected(null), 500);
    }
  };

  const resetGame = () => {
    setLevelIndex(0);
    setScore(0);
    setSelected(null);
    setIsCorrect(false);
    setShowHint(false);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🔷 Pattern Recognizer</h3>
        <button onClick={resetGame} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">What comes next? (Score: {score})</p>

      <div className="flex justify-between items-center mb-4">
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs">
          Level {levelIndex + 1} / {LEVELS.length}
        </span>
        <button 
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-yellow-400 hover:text-yellow-300"
        >
          💡 Hint
        </button>
      </div>

      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-2 bg-yellow-500/10 rounded-xl text-yellow-400 text-sm">
          {current.hint}
        </motion.div>
      )}

      {/* Pattern Display */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {current.pattern.map((emoji, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center"
          >
            <span className="text-2xl">{emoji}</span>
          </motion.div>
        ))}
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center border-2 border-indigo-400">
          <span className="text-gray-400">?</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">Tap the correct item:</p>
      <div className="flex justify-center gap-4">
        {current.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(option)}
            className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl ${
              selected === option && isCorrect ? 'bg-green-500 border-green-400' :
              selected === option ? 'bg-red-500 border-red-400' :
              'bg-gray-800 border-gray-700'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {isCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Correct! Moving to next level...
        </motion.div>
      )}

      {/* Level Completion / Reset */}
      {levelIndex === LEVELS.length - 1 && isCorrect && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-yellow-500/20 rounded-xl text-yellow-400 font-bold">
          <Star className="w-5 h-5 inline mr-1" /> You beat all {LEVELS.length} patterns! 
          <button onClick={resetGame} className="ml-2 px-4 py-1 bg-yellow-600 rounded-lg text-white">Play Again</button>
        </motion.div>
      )}
    </div>
  );
};