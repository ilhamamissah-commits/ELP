import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIFeedback, getLessonModifiers } from '../../../services/AITeacher';

interface SentenceBuilderProps {
  onComplete?: (score: number) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ onComplete }) => {
  const TARGET = "the cat sat on the mat";
  const [constructed, setConstructed] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [aiMessage, setAiMessage] = useState("Build the sentence by tapping words...");
  const [isTiredMode, setIsTiredMode] = useState(false);

  // Load the AI Mood Modifier when component mounts
  useEffect(() => {
    const modifiers = getLessonModifiers();
    if (modifiers.theme === 'calm-mode') setIsTiredMode(true);
  }, []);

  // Setup on load (Shorter words if tired)
  useEffect(() => {
    const modifiers = getLessonModifiers();
    let targetWords = TARGET.split(' ');
    // If tired, only use the first 4 words
    if (modifiers.questionCount === 3) {
      targetWords = targetWords.slice(0, 4);
    }
    const shuffled = targetWords.sort(() => Math.random() - 0.5);
    setBank(shuffled);
  }, []);

  // Auto-Check
  useEffect(() => {
    const current = constructed.join(' ');
    const targetCheck = TARGET.split(' ').slice(0, constructed.length).join(' ');
    
    // Check logic
    if (current === TARGET || (isTiredMode && current === TARGET.split(' ').slice(0, 4).join(' '))) {
      setIsCorrect(true);
      setAiMessage(getAIFeedback(true));
      setTimeout(() => {
        if(onComplete) onComplete(100);
      }, 2000);
    } else {
      setIsCorrect(false);
    }
  }, [constructed]);

  const addWord = (word: string) => {
    setConstructed([...constructed, word]);
    setBank(bank.filter(w => w !== word));
  };

  const removeWord = (index: number) => {
    const word = constructed[index];
    setConstructed(constructed.filter((_, i) => i !== index));
    setBank([...bank, word]);
  };

  return (
    <div className={`w-full max-w-xl mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl ${isTiredMode ? 'bg-blue-900/50 border-blue-500/30' : ''}`}>
      <h3 className="text-xl font-bold mb-4 text-center text-white">Build the Sentence</h3>
      
      {/* AI Teacher Message Display */}
      <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-center">
        <span className="text-sm text-indigo-300">🧑‍🏫 {aiMessage}</span>
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