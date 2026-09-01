import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';
import { speakWord } from '../../../services/audioEngine';

interface WordFamily {
  family: string;
  words: string[];
  emoji: string;
  level: number;
}

// 50 Word Families organized by level
const WORD_FAMILIES: WordFamily[] = [
  // --- LEVEL 1: Simple CVC (Ages 2-4) ---
  { family: 'at', words: ['cat', 'bat', 'hat', 'mat', 'rat'], emoji: '🐱', level: 1 },
  { family: 'an', words: ['can', 'fan', 'pan', 'ran', 'van'], emoji: '🥫', level: 1 },
  { family: 'ig', words: ['big', 'dig', 'fig', 'pig', 'wig'], emoji: '🐷', level: 1 },
  { family: 'op', words: ['cop', 'hop', 'mop', 'pop', 'top'], emoji: '🧹', level: 1 },
  { family: 'en', words: ['hen', 'men', 'pen', 'ten', 'den'], emoji: '🐔', level: 1 },
  { family: 'ed', words: ['bed', 'red', 'fed', 'led', 'wed'], emoji: '🛏️', level: 1 },
  { family: 'ot', words: ['cot', 'dot', 'hot', 'lot', 'pot'], emoji: '🍲', level: 1 },
  { family: 'in', words: ['bin', 'fin', 'pin', 'tin', 'win'], emoji: '🏆', level: 1 },
  { family: 'ug', words: ['bug', 'hug', 'jug', 'mug', 'rug'], emoji: '🐛', level: 1 },
  { family: 'et', words: ['jet', 'net', 'pet', 'set', 'wet'], emoji: '✈️', level: 1 },

  // --- LEVEL 2: More CVC (Ages 4-5) ---
  { family: 'ag', words: ['bag', 'hag', 'lag', 'rag', 'tag'], emoji: '🎒', level: 2 },
  { family: 'am', words: ['ham', 'jam', 'ram', 'yam', 'dam'], emoji: '🥪', level: 2 },
  { family: 'ap', words: ['cap', 'gap', 'lap', 'map', 'nap'], emoji: '🗺️', level: 2 },
  { family: 'ax', words: ['fax', 'lax', 'max', 'tax', 'wax'], emoji: '📠', level: 2 },
  { family: 'ub', words: ['cub', 'hub', 'rub', 'sub', 'tub'], emoji: '🛁', level: 2 },
  { family: 'un', words: ['bun', 'fun', 'gun', 'nun', 'run'], emoji: '🎉', level: 2 },
  { family: 'ut', words: ['but', 'cut', 'gut', 'hut', 'nut'], emoji: '🥜', level: 2 },
  { family: 'ug', words: ['bug', 'hug', 'jug', 'mug', 'rug'], emoji: '🐛', level: 2 },
  { family: 'id', words: ['bid', 'did', 'hid', 'kid', 'lid'], emoji: '🧒', level: 2 },
  { family: 'ob', words: ['cob', 'job', 'mob', 'rob', 'sob'], emoji: '🌽', level: 2 },

  // --- LEVEL 3: Digraphs & Blends (Ages 5-6) ---
  { family: 'ack', words: ['back', 'pack', 'rack', 'sack', 'tack'], emoji: '🎒', level: 3 },
  { family: 'ick', words: ['kick', 'lick', 'pick', 'sick', 'tick'], emoji: '🤒', level: 3 },
  { family: 'ock', words: ['block', 'clock', 'dock', 'lock', 'rock'], emoji: '🪨', level: 3 },
  { family: 'uck', words: ['duck', 'luck', 'muck', 'suck', 'tuck'], emoji: '🦆', level: 3 },
  { family: 'ash', words: ['cash', 'dash', 'flash', 'rash', 'trash'], emoji: '💸', level: 3 },
  { family: 'ish', words: ['dish', 'fish', 'wish', 'swish', 'squish'], emoji: '🐟', level: 3 },
  { family: 'ush', words: ['brush', 'crush', 'hush', 'rush', 'flush'], emoji: '🧹', level: 3 },
  { family: 'ing', words: ['king', 'ring', 'sing', 'wing', 'thing'], emoji: '👑', level: 3 },
  { family: 'ang', words: ['bang', 'fang', 'hang', 'rang', 'sang'], emoji: '🦷', level: 3 },
  { family: 'ong', words: ['long', 'song', 'strong', 'wrong', 'gong'], emoji: '🎵', level: 3 },

  // --- LEVEL 4: Long Vowels & Magic E (Ages 6-7) ---
  { family: 'ake', words: ['bake', 'cake', 'lake', 'make', 'take'], emoji: '🎂', level: 4 },
  { family: 'ike', words: ['bike', 'hike', 'like', 'pike', 'spike'], emoji: '🚲', level: 4 },
  { family: 'ame', words: ['came', 'game', 'lame', 'name', 'same'], emoji: '🎮', level: 4 },
  { family: 'ane', words: ['cane', 'lane', 'mane', 'pane', 'plane'], emoji: '🛩️', level: 4 },
  { family: 'ate', words: ['date', 'gate', 'late', 'mate', 'plate'], emoji: '🚪', level: 4 },
  { family: 'ole', words: ['hole', 'mole', 'pole', 'role', 'whole'], emoji: '🕳️', level: 4 },
  { family: 'one', words: ['bone', 'cone', 'stone', 'tone', 'zone'], emoji: '🦴', level: 4 },
  { family: 'ine', words: ['dine', 'fine', 'line', 'mine', 'nine'], emoji: '9️⃣', level: 4 },
  { family: 'ore', words: ['bore', 'core', 'more', 'score', 'store'], emoji: '🏪', level: 4 },
  { family: 'ute', words: ['cute', 'flute', 'mute', 'route', 'shute'], emoji: '😊', level: 4 },

  // --- LEVEL 5: Advanced Blends (Ages 7-8) ---
  { family: 'ay', words: ['day', 'may', 'play', 'say', 'stay'], emoji: '☀️', level: 5 },
  { family: 'oy', words: ['boy', 'joy', 'roy', 'soy', 'toy'], emoji: '🧸', level: 5 },
  { family: 'ee', words: ['bee', 'fee', 'see', 'tree', 'three'], emoji: '🐝', level: 5 },
  { family: 'ea', words: ['beach', 'each', 'peach', 'reach', 'teach'], emoji: '🏖️', level: 5 },
  { family: 'ar', words: ['car', 'far', 'star', 'tar', 'jar'], emoji: '🚗', level: 5 },
  { family: 'or', words: ['corn', 'fork', 'storm', 'torn', 'worn'], emoji: '🌽', level: 5 },
  { family: 'er', words: ['her', 'perk', 'term', 'fern', 'germ'], emoji: '🌿', level: 5 },
  { family: 'ir', words: ['bird', 'dirt', 'fir', 'girl', 'skirt'], emoji: '🐦', level: 5 },
  { family: 'ur', words: ['burn', 'curl', 'fur', 'hurt', 'nurse'], emoji: '🔥', level: 5 },
  { family: 'ow', words: ['cow', 'how', 'now', 'plow', 'snow'], emoji: '🐄', level: 5 },
];

export const WordFamilies: React.FC = () => {
  const [currentFamilyIndex, setCurrentFamilyIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentFamily = WORD_FAMILIES[currentFamilyIndex];

  // Play the family sound when changing families
  useEffect(() => {
    speakWord(currentFamily.family, 0.8);
    setIsComplete(false);
    setSelectedWords([]);
  }, [currentFamilyIndex]);

  const toggleWord = (word: string) => {
    if (isComplete) return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
      // Pronounce word when tapped
      speakWord(word);
    }
  };

  const nextFamily = () => {
    if (currentFamilyIndex < WORD_FAMILIES.length - 1) {
      setCurrentFamilyIndex(currentFamilyIndex + 1);
      setScore(score + 10);
    } else {
      // Finished all 50
      setScore(score + 10);
      alert("You mastered all 50 word families! 🎉");
    }
  };

  // Auto-detect completion
  useEffect(() => {
    if (selectedWords.length === currentFamily.words.length) {
      setIsComplete(true);
      speakWord("Excellent! You found them all!");
    }
  }, [selectedWords]);

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">📚 Word Families</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
            Level {currentFamily.level}
          </span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
            {currentFamilyIndex + 1} / {WORD_FAMILIES.length}
          </span>
          <span className="text-yellow-400 font-bold text-xs">⭐ {score}</span>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        Find all words ending in <strong className="text-indigo-400">"{currentFamily.family}"</strong>
      </p>

      {/* Listen to the family */}
      <button 
        onClick={() => speakWord(currentFamily.family)}
        className="mb-4 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      {/* Word Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {currentFamily.words.map((word) => (
          <motion.button
            key={word}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWord(word)}
            className={`p-3 rounded-xl text-sm font-bold transition-all border-2 ${
              selectedWords.includes(word) 
                ? 'bg-green-600 border-green-400 text-white shadow-lg scale-105' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-4">
        <button 
          onClick={nextFamily}
          disabled={!isComplete}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500 flex-1 disabled:opacity-30 flex items-center justify-center gap-2"
        >
          Next Family <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-2 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm font-bold"
          >
            <CheckCircle className="w-4 h-4 inline mr-1" /> 🌟 You found them all!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};