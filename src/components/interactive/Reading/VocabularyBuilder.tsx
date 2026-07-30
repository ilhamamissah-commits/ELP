import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Volume2 } from 'lucide-react';

const VOCAB_WORDS = [
  { word: 'Enormous', meaning: 'Very, very big!', emoji: '🐘' },
  { word: 'Tiny', meaning: 'Very small!', emoji: '🐜' },
  { word: 'Delicious', meaning: 'Tastes really, really good!', emoji: '🍕' },
  { word: 'Ancient', meaning: 'From a very long time ago.', emoji: '🏛️' },
  { word: 'Courageous', meaning: 'Brave and not afraid.', emoji: '🦁' },
  { word: 'Fragile', meaning: 'Easy to break, must be gentle.', emoji: '🥚' },
  { word: 'Gigantic', meaning: 'Huge, really big!', emoji: '🦕' },
  { word: 'Furious', meaning: 'Very, very angry!', emoji: '😡' },
];

interface VocabularyBuilderProps {
  onComplete?: (score: number) => void;
}

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const currentWord = VOCAB_WORDS[index % VOCAB_WORDS.length];

  // --- 1. AUTO-PLAY VOICE WHEN THE CARD CHANGES ---
  useEffect(() => {
    // Small delay to make sure the card animation starts before the voice
    const timer = setTimeout(() => {
      speakWord(currentWord.word);
    }, 300);

    return () => clearTimeout(timer);
  }, [index]);

  // --- 2. THE PRONUNCIATION ENGINE ---
  const speakWord = (text: string) => {
    // Cancel any currently speaking audio to prevent overlapping
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slightly slower so kids can catch the syllables
      utterance.pitch = 1.1; // Slightly brighter tone for child engagement
      
      // Try to find a US English voice, as it usually sounds clearer
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-US'));
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (!completed.includes(currentWord.word)) {
      setCompleted([...completed, currentWord.word]);
    }
    if (index < VOCAB_WORDS.length - 1) {
      setIndex(index + 1);
    } else {
      if (onComplete) onComplete(completed.length * 10);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">📚 Word Explorer</h3>
        <div className="text-xs text-gray-400">{completed.length} / {VOCAB_WORDS.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-6"
        >
          <div className="text-6xl mb-4">{currentWord.emoji}</div>
          
          {/* Word & Speaker Button */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-3xl font-bold text-white">{currentWord.word}</h2>
            <button 
              onClick={() => speakWord(currentWord.word)}
              className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors text-white"
              aria-label="Pronounce word"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-400 text-lg">"{currentWord.meaning}"</p>
        </motion.div>
      </AnimatePresence>

      <button 
        onClick={handleNext}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex justify-center items-center gap-2 transition-colors"
      >
        {index < VOCAB_WORDS.length - 1 ? 'Next Word' : 'Finish Lesson'} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};