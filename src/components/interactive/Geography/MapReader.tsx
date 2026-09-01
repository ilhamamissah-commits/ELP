import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Map } from 'lucide-react';

const DIRECTIONS = [
  { name: 'North', direction: 'Up', emoji: '⬆️' },
  { name: 'South', direction: 'Down', emoji: '⬇️' },
  { name: 'East', direction: 'Right', emoji: '➡️' },
  { name: 'West', direction: 'Left', emoji: '⬅️' },
];

export const MapReader: React.FC = () => {
  const [selectedDirection, setSelectedDirection] = useState<string>('');

  const handleClick = (name: string) => {
    setSelectedDirection(name);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
        <Compass className="w-6 h-6 text-red-400" /> Map Reader
      </h3>
      <p className="text-gray-400 text-sm mb-6">Learn the four main directions on a map!</p>

      <div className="grid grid-cols-2 gap-4">
        {DIRECTIONS.map((direction) => (
          <motion.button
            key={direction.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(direction.name)}
            className={`p-4 rounded-xl border-2 transition-all ${selectedDirection === direction.name ? 'bg-blue-500/20 border-blue-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-4xl block mb-2">{direction.emoji}</span>
            <span className="font-bold text-white">{direction.name}</span>
            <p className="text-xs text-gray-400">Points {direction.direction}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-gray-300 text-sm">
          💡 A compass helps you find your way! North is always pointing up on a map.
        </p>
      </div>
    </div>
  );
};