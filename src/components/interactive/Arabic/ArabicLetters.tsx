import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { speakArabic } from '../../../services/arabicSpeech';

// --- 1. THE 28 LETTERS ---
const LETTERS = [
  { letter: 'ا', name: 'Alif' }, { letter: 'ب', name: 'Ba' }, { letter: 'ت', name: 'Ta' },
  { letter: 'ث', name: 'Tha' }, { letter: 'ج', name: 'Jim' }, { letter: 'ح', name: 'Haa' },
  { letter: 'خ', name: 'Kha' }, { letter: 'د', name: 'Dal' }, { letter: 'ذ', name: 'Dhal' },
  { letter: 'ر', name: 'Ra' }, { letter: 'ز', name: 'Zay' }, { letter: 'س', name: 'Seen' },
  { letter: 'ش', name: 'Sheen' }, { letter: 'ص', name: 'Saad' }, { letter: 'ض', name: 'Daad' },
  { letter: 'ط', name: 'Taa' }, { letter: 'ظ', name: 'Zaa' }, { letter: 'ع', name: 'Ayn' },
  { letter: 'غ', name: 'Ghayn' }, { letter: 'ف', name: 'Fa' }, { letter: 'ق', name: 'Qaf' },
  { letter: 'ك', name: 'Kaf' }, { letter: 'ل', name: 'Lam' }, { letter: 'م', name: 'Meem' },
  { letter: 'ن', name: 'Noon' }, { letter: 'ه', name: 'Ha' }, { letter: 'و', name: 'Waw' },
  { letter: 'ي', name: 'Ya' },
];

// --- 2. THE 3 SHORT VOWELS (HARAKAT) ---
const HARAKAT = [
  { id: 'fatha', symbol: 'َ', name: 'Fatha', sound: 'a', exampleLetter: 'بَ', exampleSound: 'Ba', emoji: '⬆️', description: 'A short "a" sound like in "BAT"' },
  { id: 'kasra', symbol: 'ِ', name: 'Kasra', sound: 'i', exampleLetter: 'بِ', exampleSound: 'Bi', emoji: '⬇️', description: 'A short "i" sound like in "BIT"' },
  { id: 'damma', symbol: 'ُ', name: 'Damma', sound: 'u', exampleLetter: 'بُ', exampleSound: 'Bu', emoji: '⏫', description: 'A short "u" sound like in "BOOK"' },
];

export const ArabicLetters: React.FC = () => {
  const [mode, setMode] = useState<'letters' | 'harakat'>('letters');
  const [activeIndex, setActiveIndex] = useState(0);
  const [learned, setLearned] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // --- Audio Logic ---
  const speak = (text: string) => {
    speakArabic(text);
  };

  // Auto-speak on change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'letters') speak(LETTERS[activeIndex].letter);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeIndex, mode]);

  // --- Letter Mode Handlers ---
  const handleTapLetter = (index: number) => {
    setActiveIndex(index);
    speak(LETTERS[index].letter);
    
    if (!learned.includes(index)) {
      setLearned([...learned, index]);
      setScore(score + 5);
    }
  };

  // --- Harakat Mode Handlers ---
  const [harakatIndex, setHarakatIndex] = useState(0);
  const currentHaraka = HARAKAT[harakatIndex];

  const handleNextHaraka = () => {
    if (harakatIndex < HARAKAT.length - 1) {
      setHarakatIndex(harakatIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const resetAll = () => {
    setMode('letters');
    setActiveIndex(0);
    setHarakatIndex(0);
    setLearned([]);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-white">📖 Arabic Letters & Harakat</h3>
        <button onClick={resetAll} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>

      {/* MODE SWITCHER */}
      <div className="flex justify-center gap-2 mb-6 bg-gray-800 p-1 rounded-full">
        <button 
          onClick={() => { setMode('letters'); setActiveIndex(0); }}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === 'letters' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}
        >
          Step 1: Letters
        </button>
        <button 
          onClick={() => { setMode('harakat'); setHarakatIndex(0); setCompleted(false); }}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === 'harakat' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}
        >
          Step 2: Harakat
        </button>
      </div>

      {/* STEP 1: LETTERS */}
      {mode === 'letters' && (
        <>
          <p className="text-gray-400 text-sm mb-4">Tap a letter to hear it!</p>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs text-gray-500">Learned: <span className="text-emerald-400 font-bold">{learned.length}</span> / {LETTERS.length}</div>
            <span className="text-yellow-400 font-bold text-xs">⭐ Score: {score}</span>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
            {LETTERS.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTapLetter(index)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  activeIndex === index ? 'bg-emerald-500/20 border-emerald-400' : 
                  learned.includes(index) ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#1a1a1a] border-gray-700'
                }`}
              >
                <span className={`text-3xl md:text-4xl ${learned.includes(index) ? 'text-emerald-300' : 'text-white'}`}>{item.letter}</span>
                <span className="text-[10px] text-gray-400 mt-1">{item.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-4">
            <span className="text-gray-400 text-xs">Selected Letter</span>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span className="text-5xl text-emerald-400">{LETTERS[activeIndex].letter}</span>
              <div className="text-left">
                <p className="text-white font-bold">{LETTERS[activeIndex].name}</p>
                <p className="text-gray-400 text-xs">Tap speaker to hear</p>
              </div>
            </div>
          </div>

          <button onClick={() => speak(LETTERS[activeIndex].letter)} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 mx-auto">
            <Volume2 className="w-4 h-4" /> Hear Again
          </button>
        </>
      )}

      {/* STEP 2: HARAKAT */}
      {mode === 'harakat' && (
        <>
          {!completed ? (
            <>
              <p className="text-gray-400 text-sm mb-4">Learn the 3 short vowels (Harakat)!</p>
              
              <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-6">
                <div className="text-6xl mb-4">{currentHaraka.emoji}</div>
                <div className="text-8xl text-emerald-400 mb-4 leading-none">
                  {currentHaraka.exampleLetter}
                </div>
                <div className="text-3xl text-white font-bold mb-2">{currentHaraka.exampleSound}</div>
                <div className="text-2xl text-white mb-1">
                  {currentHaraka.symbol} <span className="text-gray-400 text-sm">({currentHaraka.name})</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{currentHaraka.description}</p>
              </div>

              <div className="flex justify-center gap-4 mb-4">
                <button 
                  onClick={() => speak(currentHaraka.exampleLetter)}
                  className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" /> Hear: {currentHaraka.exampleSound}
                </button>
                <button 
                  onClick={handleNextHaraka}
                  className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold flex items-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center gap-3 mb-4">
                {HARAKAT.map((h, idx) => (
                  <button 
                    key={h.id}
                    onClick={() => setHarakatIndex(idx)}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl ${
                      harakatIndex === idx ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-gray-800 border-gray-700 text-white'
                    }`}
                  >
                    {h.exampleLetter}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl mb-4">🎉</motion.div>
              <p className="text-2xl font-bold text-emerald-400 mb-2">Masha'Allah!</p>
              <p className="text-gray-300 mb-4">You learned the 3 Harakat!</p>
              <div className="text-2xl text-yellow-400 font-bold mb-6">Score: {score}</div>
              <button onClick={resetAll} className="px-6 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500">
                Start Over
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};