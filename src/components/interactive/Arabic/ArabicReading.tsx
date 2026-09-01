import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { ARABIC_PHRASES } from '../../../data/arabicPhrases';
import { speakArabic } from '../../../services/arabicSpeech';

export const ArabicReading: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [learned, setLearned] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const current = ARABIC_PHRASES[index];

  // --- ✅ AUTO-PLAY: Speak the phrase when it loads ---
  useEffect(() => {
    const timer = setTimeout(() => {
      speakArabic(current.arabic);
    }, 600);
    return () => clearTimeout(timer);
  }, [index]);

  const speak = () => {
    speakArabic(current.arabic);
  };

  const handleNext = () => {
    if (!learned.includes(current.id)) {
      setLearned([...learned, current.id]);
      setScore(score + 10);
    }
    setRevealed(false);

    if (index < ARABIC_PHRASES.length - 1) {
      setIndex(index + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setIndex(0);
    setRevealed(false);
    setScore(0);
    setLearned([]);
    setIsComplete(false);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">📚 Arabic Reading</h3>
        <button onClick={handleReset} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Practice reading 100 progressive phrases & sentences! (Audio plays automatically)</p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-500">Phrase <span className="text-emerald-400 font-bold">{index + 1}</span> / {ARABIC_PHRASES.length}</span>
        <span className="text-yellow-400 font-bold text-xs">⭐ Score: {score}</span>
      </div>

      {!isComplete ? (
        <>
          <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-6">
            <div className="text-5xl mb-4">{current.emoji}</div>
            <div className="text-4xl text-emerald-400 leading-loose mb-3">{current.arabic}</div>
            {revealed && (
              <>
                <div className="text-xl text-white mb-1">{current.meaning}</div>
                <div className="text-xs text-gray-400 mt-1">Category: {current.category} | Level: {current.level}</div>
              </>
            )}
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button onClick={speak} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Listen
            </button>
            <button onClick={() => setRevealed(!revealed)} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold">
              {revealed ? 'Hide Meaning' : 'Show Meaning'}
            </button>
            <button onClick={handleNext} className="px-4 py-2 bg-gray-700 rounded-lg text-white font-bold flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl mb-4">🎉</motion.div>
          <p className="text-2xl font-bold text-emerald-400 mb-2">Masha'Allah!</p>
          <p className="text-gray-300 mb-4">You mastered <strong>{learned.length}</strong> Arabic phrases & sentences!</p>
          <div className="text-2xl text-yellow-400 font-bold mb-6">Score: {score}</div>
          <button onClick={handleReset} className="px-6 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500">
            Learn Again
          </button>
        </div>
      )}
    </div>
  );
};