import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle, ArrowRight } from 'lucide-react';
import { SENTENCE_CURRICULUM } from '../../../data/sentenceCurriculum';
import { speakWord } from '../../../services/audioEngine';

interface SentenceBuilderProps {
  onComplete?: (score: number) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const currentSentence = SENTENCE_CURRICULUM[currentIndex];
  const targetWords = currentSentence.text.split(' ');

  // Shuffle bank on new sentence
  useEffect(() => {
    const shuffled = [...targetWords].sort(() => Math.random() - 0.5);
    setBank(shuffled);
    setConstructed([]);
    setIsCorrect(false);
  }, [currentIndex]);

  // Auto-Check & Audio Celebration
  useEffect(() => {
    const currentBuilt = constructed.join(' ');
    if (currentBuilt === currentSentence.text) {
      setIsCorrect(true);
      setScore(prev => prev + 10);

      // Pronounce the full sentence
      speakWord(currentSentence.text, 0.8);

      // Track completion
      if (!completedIds.includes(currentSentence.id)) {
        setCompletedIds([...completedIds, currentSentence.id]);
      }

      // Move to next after 2.5 seconds
      setTimeout(() => {
        if (currentIndex < SENTENCE_CURRICULUM.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          if (onComplete) onComplete(score);
        }
      }, 2500);
    }
  }, [constructed]);

  const addWord = (word: string) => {
    if (isCorrect) return;
    setConstructed([...constructed, word]);
    setBank(bank.filter(w => w !== word));
  };

  const removeWord = (index: number) => {
    if (isCorrect) return;
    const word = constructed[index];
    setConstructed(constructed.filter((_, i) => i !== index));
    setBank([...bank, word]);
  };

  const speakEachSound = () => {
    targetWords.forEach((word, index) => {
      setTimeout(() => speakWord(word, 0.9), index * 500);
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      
      {/* HEADER & PROGRESS */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">📝 Sentence Builder</h3>
        <div className="flex gap-3 items-center">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
            Level {currentSentence.level}
          </span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
            {currentIndex + 1} / {SENTENCE_CURRICULUM.length}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-yellow-400 font-bold">⭐ {score}</div>
        <button 
          onClick={speakEachSound}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* QUESTION PROMPT */}
      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-4 text-center">
        <p className="text-gray-400 text-sm">Build the sentence: <span className="text-white font-bold">{currentSentence.pattern}</span></p>
      </div>

      {/* BUILT ZONE */}
      <div className="min-h-[80px] bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 mb-4 flex flex-wrap gap-2 items-center">
        <AnimatePresence>
          {constructed.map((word, i) => (
            <motion.button
              key={`${word}-${i}`}
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              onClick={() => removeWord(i)}
              className="px-3 py-1 bg-gray-700 rounded-lg text-white shadow hover:bg-gray-600 transition"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
        {constructed.length === 0 && <span className="text-gray-500 text-sm italic w-full text-center">Tap words below to build...</span>}
      </div>

      {/* WORD BANK */}
      <div className="flex flex-wrap gap-2 justify-center min-h-[60px] p-2 bg-[#111] rounded-lg">
        {bank.map((word, i) => (
          <motion.button
            key={`${word}-${i}`}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addWord(word)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium shadow border border-gray-700 hover:border-indigo-400 transition"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* FEEDBACK */}
      <div className="mt-4 flex justify-center h-10">
        {isCorrect && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} 
            className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 text-green-400 font-bold"
          >
            <CheckCircle className="w-5 h-5" /> Perfect! Moving to next...
          </motion.div>
        )}
        {constructed.length > 0 && !isCorrect && (
          <div className="text-gray-500 text-sm">Keep going... You're doing great!</div>
        )}
      </div>
    </div>
  );
};