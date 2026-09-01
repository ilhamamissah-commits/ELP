import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { ARABIC_WORDS } from '../../../data/arabicVocabulary';
import { speakArabic } from '../../../services/arabicSpeech';

export const ArabicWords: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [learned, setLearned] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const current = ARABIC_WORDS[index];

  // --- ✅ 1. AUTO-PLAY: Speak the word immediately when it loads ---
  useEffect(() => {
    if (current) {
      // Small delay so the card animation finishes before speaking
      const timer = setTimeout(() => {
        speakArabic(current.arabic);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [index]);

  // --- ✅ 2. Use the professional speakArabic service ---
  const speak = () => {
    speakArabic(current.arabic);
  };

  const handleNext = () => {
    if (!learned.includes(current.id)) {
      setLearned([...learned, current.id]);
      setScore(score + 10);
    }
    if (index < ARABIC_WORDS.length - 1) {
      setIndex(index + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setIndex(0);
    setScore(0);
    setLearned([]);
    setIsComplete(false);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🗣️ Arabic Words</h3>
        <button onClick={handleReset} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Learn everyday Arabic words! (Audio plays automatically)</p>
      <div className="text-xs text-gray-500 mb-4">
        Word <span className="text-emerald-400 font-bold">{index + 1}</span> / {ARABIC_WORDS.length} | Score: <span className="text-yellow-400 font-bold">{score}</span>
      </div>

      {!isComplete ? (
        <>
          <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-6">
            <div className="text-6xl mb-4">{current.emoji}</div>
            <div className="text-5xl text-white mb-3">{current.arabic}</div>
            <div className="text-gray-400">Meaning: {current.meaning}</div>
            <div className="mt-4 inline-block bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full">
              Category: {current.category}
            </div>
          </motion.div>

          <div className="flex justify-center gap-4 mb-4">
            <button onClick={speak} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Hear
            </button>
            <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold flex items-center gap-2">
              Next Word <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button onClick={speak} className="text-xs text-gray-500 hover:text-white">
            Tap "Hear" to listen to the correct pronunciation with Harakat.
          </button>
        </>
      ) : (
        <div className="text-center py-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl mb-4">🎉</motion.div>
          <p className="text-2xl font-bold text-emerald-400 mb-2">Masha'Allah!</p>
          <p className="text-gray-300 mb-4">You learned <strong>{learned.length}</strong> Arabic words!</p>
          <div className="text-2xl text-yellow-400 font-bold mb-6">Score: {score}</div>
          <button onClick={handleReset} className="px-6 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500">
            Learn Again
          </button>
        </div>
      )}
    </div>
  );
};