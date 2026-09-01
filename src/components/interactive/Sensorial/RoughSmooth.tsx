import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BOARDS = [
  { id: 1, name: 'Rough', emoji: '🪨', description: 'Feels bumpy and scratchy' },
  { id: 2, name: 'Smooth', emoji: '🪞', description: 'Feels flat and silky' },
  { id: 3, name: 'Bumpy', emoji: '🧽', description: 'Feels full of tiny bumps' },
  { id: 4, name: 'Soft', emoji: '🧸', description: 'Feels fluffy and gentle' },
];

export const RoughSmooth: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-2">🖐️ Rough & Smooth</h3>
      <p className="text-gray-400 text-sm mb-4">Tap to feel the texture!</p>

      <div className="grid grid-cols-2 gap-4">
        {BOARDS.map((board) => (
          <motion.button
            key={board.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(board.id)}
            className={`p-6 rounded-xl border-2 transition-all ${selected === board.id ? 'bg-yellow-500/20 border-yellow-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-4xl block mb-2">{board.emoji}</span>
            <span className="font-bold text-white">{board.name}</span>
            {selected === board.id && <p className="text-sm text-gray-400 mt-1">{board.description}</p>}
          </motion.button>
        ))}
      </div>
    </div>
  );
};