import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WONDERS = [
  { id: 1, name: 'Grand Canyon', emoji: '🏜️', location: 'USA' },
  { id: 2, name: 'Great Wall of China', emoji: '🏯', location: 'China' },
  { id: 3, name: 'Mount Everest', emoji: '⛰️', location: 'Nepal' },
  { id: 4, name: 'Amazon Rainforest', emoji: '🌳', location: 'South America' },
  { id: 5, name: 'Niagara Falls', emoji: '💦', location: 'Canada/USA' },
  { id: 6, name: 'Eiffel Tower', emoji: '🗼', location: 'France' },
  { id: 7, name: 'Pyramids of Giza', emoji: '🔺', location: 'Egypt' },
  { id: 8, name: 'Great Barrier Reef', emoji: '🐠', location: 'Australia' },
];

export const NaturalWonders: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🌟 Natural Wonders</h3>
      <p className="text-gray-400 text-sm mb-6">Tap to learn about amazing places!</p>

      <div className="grid grid-cols-2 gap-4">
        {WONDERS.map((wonder) => (
          <motion.button
            key={wonder.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(wonder.id)}
            className={`p-4 rounded-xl border-2 transition-all ${selected === wonder.id ? 'bg-purple-500/20 border-purple-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-4xl block mb-2">{wonder.emoji}</span>
            <span className="font-bold text-white">{wonder.name}</span>
            {selected === wonder.id && (
              <p className="text-xs text-gray-400 mt-1">{wonder.location}</p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};