import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { ROBOT_PARTS } from './roboticsData';

export const RobotExplorer: React.FC = () => {
  const [partIndex, setPartIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [learned, setLearned] = useState<string[]>([]);

  const part = ROBOT_PARTS[partIndex];

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(part.name);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (!learned.includes(part.id)) {
      setLearned([...learned, part.id]);
      setScore(score + 5);
    }
    setPartIndex((partIndex + 1) % ROBOT_PARTS.length);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🤖 Robot Explorer</h3>
        <button onClick={() => { setPartIndex(0); setScore(0); setLearned([]); }} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Learn the parts of a robot! (Score: {score})</p>

      <div className="flex justify-between items-center mb-4">
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs">Part {partIndex + 1} / {ROBOT_PARTS.length}</span>
        <span className="text-yellow-400 font-bold text-xs">⭐ {learned.length} / {ROBOT_PARTS.length} Learned</span>
      </div>

      <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-6">
        <div className="text-7xl mb-4">{part.emoji}</div>
        <h4 className="text-2xl font-bold text-white mb-2">{part.name}</h4>
        <div className="flex justify-center gap-2 mb-4">
          <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs">Type: {part.type}</span>
          <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs">Cost: {part.cost} coins</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={speak} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold flex items-center gap-2">
          <Volume2 className="w-4 h-4" /> Hear
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold flex items-center gap-2">
          Next Part <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {learned.length === ROBOT_PARTS.length && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> You learned all {ROBOT_PARTS.length} parts!
        </motion.div>
      )}
    </div>
  );
};