import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIFeedback, getLessonModifiers } from '../../../services/AITeacher';

interface SentenceBuilderProps {
  onComplete?: (score: number) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ onComplete }) => {
  // --- EXPANDED SENTENCE BANK (12 Sentences) ---
  const SENTENCE_BANK = [
    { id: '1', text: "the cat sat on the mat" },
    { id: '2', text: "a dog ran in the park" },
    { id: '3', text: "the sun is hot today" },
    { id: '4', text: "i like to eat apples" },
    { id: '5', text: "the bird flies in the sky" },
    { id: '6', text: "we can go to the zoo" },
    { id: '7', text: "my mom cooks good food" },
    { id: '8', text: "the big fish swims fast" },
    { id: '9', text: "she has a red hat" },
    { id: '10', text: "he is reading a book" },
    { id: '11', text: "look at the funny monkey" },
    { id: '12', text: "the little frog jumped high" },
  ];

  // --- STATE ---
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [aiMessage, setAiMessage] = useState("Build the sentence by tapping words...");
  const [isTiredMode, setIsTiredMode] = useState(false);
  const [score, setScore] = useState(0);
  const [completedSentences, setCompletedSentences] = useState<string[]>([]);

  const TARGET = SENTENCE_BANK[currentSentenceIndex].text;

  // Load the AI Mood Modifier when component mounts
  useEffect(() => {
    const modifiers = getLessonModifiers();
    if (modifiers.theme === 'calm-mode') setIsTiredMode(true);
  }, []);

  // Setup new sentence on load or index change
  useEffect(() => {
    const modifiers = getLessonModifiers();
    let targetWords = TARGET.split(' ');
    if (modifiers.questionCount === 3) {
      targetWords = targetWords.slice(0, 4);
    }
    const shuffled = targetWords.sort(() => Math.random() - 0.5);
    setConstructed([]);
    setIsCorrect(false);
    setAiMessage("Build the sentence by tapping words...");
    setBank(shuffled);
  }, [currentSentenceIndex, TARGET]);

  // Auto-Check Logic
  useEffect(() => {
    const current = constructed.join(' ');
    const shortTarget = TARGET.split(' ').slice(0, 4).join(' ');
    
    if (current === TARGET || (isTiredMode && current === shortTarget)) {
      setIsCorrect(true);
      const feedback = getAIFeedback(true);
      setAiMessage(`🧑‍🏫 ${feedback}`);
      setScore(prev => prev + 10);
      
      // Mark as completed
      if (!completedSentences.includes(TARGET)) {
        setCompletedSentences([...completedSentences, TARGET]);
      }

      setTimeout(() => {
        // Move to next sentence
        const nextIndex = (currentSentenceIndex + 1) % SENTENCE_BANK.length;
        
        // If they finished all 12 sentences, trigger completion
        if (completedSentences.length >= SENTENCE_BANK.length - 1) {
          if(onComplete) onComplete(score);
          return;
        }
        
        setCurrentSentenceIndex(nextIndex);
      }, 2500);
    } else {
      setIsCorrect(false);
    }
  }, [constructed, isTiredMode, TARGET]);

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

  return (
    <div className={`w-full max-w-xl mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl ${isTiredMode ? 'bg-blue-900/50 border-blue-500/30' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">Build the Sentence</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Score: </span>
          <span className="text-yellow-400 font-bold">{score}</span>
        </div>
      </div>
      
      {/* AI Teacher Message Display */}
      <div className={`mb-4 p-3 rounded-xl text-center transition-all duration-300 ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-indigo-500/10 border border-indigo-500/30'}`}>
        <span className={`text-sm ${isCorrect ? 'text-green-400' : 'text-indigo-300'}`}>
          {isCorrect ? '🌟 ' : '🧑‍🏫 '}{aiMessage}
        </span>
      </div>

      {/* Built Zone */}
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

      {/* Word Bank */}
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
    </div>
  );
};