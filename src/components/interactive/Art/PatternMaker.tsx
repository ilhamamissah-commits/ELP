import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const PATTERN_ITEMS = [
  { id: 1, emoji: '🔴' },
  { id: 2, emoji: '🔵' },
  { id: 3, emoji: '🟡' },
  { id: 4, emoji: '🟢' },
  { id: 5, emoji: '⭐' },
  { id: 6, emoji: '🌸' },
];

export const PatternMaker: React.FC = () => {
  const [pattern, setPattern] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState(PATTERN_ITEMS[0]);

  const addToPattern = () => {
    setPattern([...pattern, selectedItem.emoji]);
  };

  const removeLast = () => {
    setPattern(pattern.slice(0, -1));
  };

  const clearPattern = () => setPattern([]);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">🔁 Pattern Maker</h2>
        <button onClick={clearPattern} className="p-2 bg-gray-800 rounded-lg text-gray-300">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-4">Create a repeating pattern!</p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {PATTERN_ITEMS.map(item => (
          <motion.button
            key={item.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedItem(item)}
            className={`p-2 rounded-xl border-2 text-3xl ${selectedItem.id === item.id ? 'bg-indigo-500/20 border-indigo-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            {item.emoji}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center gap-2 min-h-[60px] p-4 bg-[#1a1a1a] rounded-xl border border-gray-800 mb-6">
        {pattern.map((item, index) => (
          <span key={index} className="text-3xl">{item}</span>
        ))}
        {pattern.length === 0 && <span className="text-gray-500 italic self-center">Your pattern will appear here...</span>}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={addToPattern} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold">➕ Add</button>
        <button onClick={removeLast} className="px-4 py-2 bg-red-600 rounded-lg text-white font-bold">➖ Remove</button>
      </div>
    </div>
  );
};