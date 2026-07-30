import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WORD_FAMILIES = [
  { family: 'at', words: ['cat', 'bat', 'hat', 'mat', 'rat'] },
  { family: 'an', words: ['can', 'fan', 'pan', 'ran', 'van'] },
  { family: 'ig', words: ['big', 'dig', 'fig', 'pig', 'wig'] },
  { family: 'op', words: ['cop', 'hop', 'mop', 'pop', 'top'] },
];

export const WordFamilies: React.FC = () => {
  const [currentFamily, setCurrentFamily] = useState(WORD_FAMILIES[0]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const nextFamily = () => {
    const currentIndex = WORD_FAMILIES.indexOf(currentFamily);
    const nextIndex = (currentIndex + 1) % WORD_FAMILIES.length;
    setCurrentFamily(WORD_FAMILIES[nextIndex]);
    setSelectedWords([]);
  };

  const isComplete = selectedWords.length === currentFamily.words.length;

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-2">📚 Word Families</h3>
      <p className="text-gray-400 text-sm mb-4">Find all words ending in <strong className="text-indigo-400">"{currentFamily.family}"</strong></p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {currentFamily.words.map((word) => (
          <motion.button
            key={word}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWord(word)}
            className={`p-3 rounded-xl text-sm font-bold transition-all ${
              selectedWords.includes(word) 
                ? 'bg-green-600 text-white shadow-lg scale-105' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {word}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button 
          onClick={nextFamily}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500 flex-1"
        >
          Next Family
        </button>
      </div>

      {isComplete && (
        <div className="mt-4 p-2 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm font-bold">
          🌟 You found them all!
        </div>
      )}
    </div>
  );
};