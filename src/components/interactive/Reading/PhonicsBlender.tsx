import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { PHONICS_CURRICULUM } from '../../../data/phonicsCurriculum';

export const PhonicsBlender: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [blended, setBlended] = useState(false);
  const [score, setScore] = useState(0);

  const level = PHONICS_CURRICULUM[currentLevel];
  const currentWord = level.words[currentWordIndex];

  const speak = (text: string, rate: number = 0.7) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakSounds = () => {
    currentWord.sounds.forEach((sound, index) => {
      setTimeout(() => speak(sound), index * 600);
    });
  };

  const handleBlend = () => {
    speakSounds();
    setTimeout(() => {
      speak(currentWord.word, 0.6);
      setBlended(true);
      setScore(score + 1);
    }, currentWord.sounds.length * 600);
  };

  const handleNextWord = () => {
    if (currentWordIndex < level.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setBlended(false);
    } else {
      setCurrentWordIndex(0);
      setBlended(false);
      if (currentLevel < PHONICS_CURRICULUM.length - 1) {
        setCurrentLevel(currentLevel + 1);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">🔊 {level.title}</h3>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{level.patternFocus}</span>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-6">
        {/* Sound Squares */}
        <div className="flex justify-center gap-3 mb-6">
          {currentWord.sounds.map((sound, index) => (
            <motion.button
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => speak(sound)}
              className="w-16 h-16 bg-indigo-600 rounded-xl text-white text-2xl font-bold flex items-center justify-center hover:bg-indigo-500 transition shadow-lg"
            >
              {sound}
            </motion.button>
          ))}
        </div>

        {/* Blended Word Display */}
        {blended && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-4"
          >
            <span className="text-5xl font-bold text-white">{currentWord.word}</span>
            <span className="block text-4xl mt-2">{currentWord.emoji}</span>
            <span className="mt-2 inline-block text-green-400 font-bold">
              <CheckCircle className="w-5 h-5 inline mr-1" /> Correctly blended!
            </span>
          </motion.div>
        )}

        {/* Word Bank (Learning Mode) */}
        {!blended && (
          <div className="text-center mb-4">
            <span className="text-gray-400 text-sm">Tap each sound, then blend them together!</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        {!blended ? (
          <button 
            onClick={handleBlend}
            className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> Blend Sounds
          </button>
        ) : (
          <button 
            onClick={handleNextWord}
            className="px-6 py-3 bg-green-600 rounded-xl text-white font-bold hover:bg-green-500 flex items-center gap-2"
          >
            Next Word <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={() => speak(currentWord.word)}
          className="px-4 py-3 bg-gray-700 rounded-xl text-white font-bold hover:bg-gray-600"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};