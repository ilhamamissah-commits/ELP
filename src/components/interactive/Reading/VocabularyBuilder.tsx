import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { VOCABULARY_CURRICULUM } from '../../../data/vocabularyCurriculum';

interface VocabularyBuilderProps {
  onComplete?: (score: number) => void;
}

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({ onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const level = VOCABULARY_CURRICULUM[currentLevel];
  const currentWord = level.words[currentWordIndex];

  // --- AUDIO ---
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- LEARNING MODE ---
  const handleNextWord = () => {
    if (currentWordIndex < level.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      speak(level.words[currentWordIndex + 1].word);
    } else {
      setMode('quiz');
      setCurrentWordIndex(0);
      speak(`Let's see if you remember!`);
    }
  };

  // --- QUIZ MODE: WORD FAMILY SELECTION ---
  const shuffledWords = [...level.words].sort(() => Math.random() - 0.5);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const targetFamily = level.words[0].family; // e.g., "at"

  const toggleSelection = (id: string) => {
    if (feedback === 'correct') return;
    if (selectedWords.includes(id)) {
      setSelectedWords(selectedWords.filter(w => w !== id));
    } else {
      setSelectedWords([...selectedWords, id]);
    }
  };

  const handleCheck = () => {
    const correctIds = level.words.filter(w => w.family === targetFamily).map(w => w.id);
    const allCorrect = correctIds.every(id => selectedWords.includes(id)) && selectedWords.length === correctIds.length;
    
    if (allCorrect) {
      setFeedback('correct');
      setScore(score + 10);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextLevel = () => {
    // If it's the very last level, call onComplete
    if (currentLevel === VOCABULARY_CURRICULUM.length - 1) {
      if (onComplete) onComplete(score);
      return;
    }
    
    setCurrentLevel(currentLevel + 1);
    setMode('learn');
    setCurrentWordIndex(0);
    setScore(0);
    setFeedback('idle');
    setSelectedWords([]);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">📚 {level.title}</h3>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{level.syllabusFocus}</span>
      </div>

      {/* --- MODE 1: LEARN THE WORDS --- */}
      {mode === 'learn' && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 w-full">
            <div className="text-6xl mb-4">{currentWord.emoji}</div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="text-4xl font-bold text-white">{currentWord.word}</h2>
              <button onClick={() => speak(currentWord.word)} className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 text-white">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400">{currentWord.meaning}</p>
            <div className="mt-4 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full inline-block">
              Family: "{currentWord.family}"
            </div>
          </div>
          <button onClick={handleNextWord} className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 flex justify-center items-center gap-2">
            {currentWordIndex < level.words.length - 1 ? 'Next Word' : 'Begin Quiz!'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- MODE 2: QUIZ - FIND THE FAMILY --- */}
      {mode === 'quiz' && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 w-full">
            <h3 className="text-lg font-bold text-white mb-2">Find the words from the <span className="text-yellow-400">"{targetFamily}"</span> family!</h3>
            <p className="text-gray-400 text-sm mb-4">Tap all the words that belong to the family, then check.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {shuffledWords.map((word) => (
                <motion.button
                  key={word.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSelection(word.id)}
                  className={`p-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    selectedWords.includes(word.id) 
                      ? 'bg-green-600 border-green-400 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="text-2xl block mb-1">{word.emoji}</span>
                  {word.word}
                </motion.button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleCheck} 
            disabled={feedback === 'correct'}
            className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 disabled:opacity-50"
          >
            Check Answer
          </button>

          {feedback === 'correct' && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold">
              <CheckCircle className="w-6 h-6 inline mr-2" />
              Excellent! You found them all! Score: {score}
              <button onClick={handleNextLevel} className="w-full mt-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">
                {currentLevel === VOCABULARY_CURRICULUM.length - 1 ? 'Finish Course' : 'Next Level ➜'}
              </button>
            </motion.div>
          )}

          {feedback === 'incorrect' && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-bold">
              <XCircle className="w-6 h-6 inline mr-2" />
              Not quite. Try tapping different words.
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};