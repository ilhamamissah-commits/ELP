import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const EMOTIONS = [
  { id: 1, name: 'Happy', emoji: '😊', description: 'When something makes you smile!', color: 'bg-yellow-500' },
  { id: 2, name: 'Sad', emoji: '😢', description: 'When you feel like crying.', color: 'bg-blue-500' },
  { id: 3, name: 'Angry', emoji: '😡', description: 'When you feel very mad!', color: 'bg-red-500' },
  { id: 4, name: 'Scared', emoji: '😨', description: 'When you feel afraid.', color: 'bg-purple-500' },
  { id: 5, name: 'Surprised', emoji: '😲', description: 'When something unexpected happens!', color: 'bg-orange-500' },
];

export const EmotionMatch: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [matched, setMatched] = useState(false);
  const [score, setScore] = useState(0);

  const emotion = EMOTIONS[currentEmotion];

  const handleMatch = () => {
    setMatched(true);
    setScore(score + 10);
    setTimeout(() => {
      setCurrentEmotion((currentEmotion + 1) % EMOTIONS.length);
      setMatched(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">😊 Emotion Match</h3>
      <p className="text-gray-400 text-sm mb-4">Learn to recognize your feelings! (Score: {score})</p>

      <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-6">
        <div className="text-8xl mb-4">{emotion.emoji}</div>
        <p className="text-white font-bold text-xl mb-2">{emotion.name}</p>
        <p className="text-gray-400">{emotion.description}</p>
      </div>

      <button 
        onClick={handleMatch}
        className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500"
      >
        I know this feeling!
      </button>

      {matched && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Great job!
        </motion.div>
      )}
    </div>
  );
};