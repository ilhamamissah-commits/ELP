import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const WORDS = [
  { word: 'cat', emoji: '🐱' },
  { word: 'dog', emoji: '🐶' },
  { word: 'sun', emoji: '☀️' },
  { word: 'car', emoji: '🚗' },
  { word: 'pen', emoji: '🖊️' },
];

export const WordBuilder: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  const currentWord = WORDS[wordIndex];

  React.useEffect(() => {
    setBuilt([]);
    setAvailableLetters(currentWord.word.split('').sort(() => Math.random() - 0.5));
  }, [wordIndex]);

  const addLetter = (letter: string) => {
    setBuilt([...built, letter]);
    setAvailableLetters(availableLetters.filter(l => l !== letter));
  };

  const removeLetter = (index: number) => {
    const letter = built[index];
    setBuilt(built.filter((_, i) => i !== index));
    setAvailableLetters([...availableLetters, letter]);
  };

  const isCorrect = built.join('') === currentWord.word;

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🛠️ Word Builder</h3>
      <p className="text-gray-400 text-sm mb-6">Build the word: <span className="text-indigo-400 font-bold">{currentWord.emoji}</span></p>

      <div className="flex justify-center gap-2 min-h-[60px] p-4 bg-[#1a1a1a] rounded-xl border border-gray-800 mb-6">
        {built.map((letter, index) => (
          <motion.button
            key={index} initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={() => removeLetter(index)}
            className="w-12 h-12 bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600"
          >
            {letter}
          </motion.button>
        ))}
        {built.length === 0 && <span className="text-gray-500 italic self-center">Tap letters below...</span>}
      </div>

      <div className="flex justify-center gap-2">
        {availableLetters.map((letter, index) => (
          <motion.button
            key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => addLetter(letter)}
            className="w-12 h-12 bg-indigo-600 rounded-lg text-white text-2xl font-bold"
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {isCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-6 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" /> Great job!
          <button onClick={() => setWordIndex((wordIndex + 1) % WORDS.length)} className="ml-2 px-4 py-1 bg-green-600 rounded-lg text-white">Next Word <ArrowRight className="w-4 h-4 inline" /></button>
        </motion.div>
      )}
    </div>
  );
};