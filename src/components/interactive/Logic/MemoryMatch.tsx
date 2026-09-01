import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowRight, Star } from 'lucide-react';

// --- 100 Emojis for progressive levels ---
const EMOJI_BANK = [
  '🍎', '🍌', '🐶', '🐱', '🚗', '🎈', '⭐', '🌙', '🐟', '🌸',
  '🍓', '🍊', '🐸', '🦋', '🚀', '🎁', '⚽', '🎨', '🍕', '🧸',
  '🍔', '🍟', '🐷', '🐰', '🚲', '✈️', '🎵', '🌈', '🍦', '🐧',
  '🥕', '🌽', '🐢', '🦁', '🚢', '🪁', '🎮', '📚', '🍪', '🐝',
  '🍇', '🍒', '🦄', '🐬', '🚜', '🛸', '🎪', '🎸', '🍬', '🦉',
  '🥦', '🍄', '🦚', '🐊', '🚁', '🛴', '🎺', '🎨', '🍩', '🐙',
  '🍍', '🥝', '🦩', '🐋', '🚃', '🛶', '🎤', '🎬', '🍫', '🐜',
  '🍉', '🫐', '🦒', '🐘', '🚔', '🛵', '🎧', '🎯', '🍰', '🐚',
  '🍑', '🍋', '🦘', '🦥', '🚚', '🏎️', '🎼', '🎭', '🍭', '🦔',
  '🍐', '🥥', '🦜', '🐆', '🚕', '🚲', '🎬', '🎲', '🍮', '🐌'
];

// --- 5 Progressive Levels ---
const LEVELS = [
  { id: 1, name: 'Beginner', gridCols: 3, pairs: 3 },  // 6 cards (3x2)
  { id: 2, name: 'Easy', gridCols: 4, pairs: 6 },     // 12 cards (4x3)
  { id: 3, name: 'Medium', gridCols: 4, pairs: 8 },   // 16 cards (4x4)
  { id: 4, name: 'Hard', gridCols: 5, pairs: 10 },    // 20 cards (5x4)
  { id: 5, name: 'Master', gridCols: 5, pairs: 12 },  // 24 cards (6x4)
];

export const MemoryMatch: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);

  const level = LEVELS[currentLevel];

  // Generate cards for the current level
  const generateCards = () => {
    // Pick random emojis from the bank
    const shuffledBank = [...EMOJI_BANK].sort(() => Math.random() - 0.5);
    const selected = shuffledBank.slice(0, level.pairs);
    // Duplicate them and shuffle
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);
    
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    generateCards();
  }, [currentLevel]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWon(true);
      setScore(score + (level.pairs * 10));
    }
  }, [matched, cards]);

  const handleFlip = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setTimeout(() => {
          setMatched([...matched, first, second]);
          setFlipped([]);
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setCurrentLevel(0);
      setScore(0);
    }
  };

  const resetGame = () => {
    generateCards();
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🧠 Memory Match</h3>
        <button onClick={resetGame} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs">
            Level {level.id}: {level.name}
          </span>
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold">
            ⭐ Score: {score}
          </span>
        </div>
        <span className="text-gray-400 text-sm">Moves: {moves}</span>
      </div>

      {/* Grid */}
      <div 
        className="grid gap-2 mb-4"
        style={{ gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))` }}
      >
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(index)}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl sm:text-3xl transition-all ${
                isFlipped ? 'bg-indigo-500/20 border-indigo-400' : 'bg-gray-800 border-gray-700'
              }`}
            >
              {isFlipped ? emoji : '❓'}
            </motion.button>
          );
        })}
      </div>

      {/* Win Message */}
      {won && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-4 bg-green-500/20 rounded-xl mb-4">
          <div className="text-green-400 font-bold text-lg mb-1">
            <CheckCircle className="w-5 h-5 inline mr-1" /> Level {level.name} Complete!
          </div>
          <div className="text-gray-300 text-sm mb-3">
            You won in <strong>{moves}</strong> moves! 
            {moves <= level.pairs * 2 ? ' 🏆 Amazing!' : moves <= level.pairs * 3 ? ' 👏 Great job!' : ' 💪 Keep practicing!'}
          </div>
          <button 
            onClick={nextLevel}
            className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 mx-auto hover:bg-indigo-500"
          >
            {currentLevel < LEVELS.length - 1 ? 'Next Level' : 'Play Again'} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};