import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const STICKERS = [
  { id: 1, name: 'Sun', emoji: '☀️' },
  { id: 2, name: 'Cloud', emoji: '☁️' },
  { id: 3, name: 'Tree', emoji: '🌳' },
  { id: 4, name: 'Flower', emoji: '🌸' },
  { id: 5, name: 'Star', emoji: '⭐' },
  { id: 6, name: 'Rainbow', emoji: '🌈' },
  { id: 7, name: 'Butterfly', emoji: '🦋' },
  { id: 8, name: 'Fish', emoji: '🐟' },
  { id: 9, name: 'Ball', emoji: '⚽' },
  { id: 10, name: 'Bird', emoji: '🐦' },
];

export const StickerBoard: React.FC = () => {
  const [placed, setPlaced] = useState<{ sticker: typeof STICKERS[0], x: number, y: number }[]>([]);
  const [selectedSticker, setSelectedSticker] = useState(STICKERS[0]);

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlaced([...placed, { sticker: selectedSticker, x, y }]);
  };

  const clearBoard = () => setPlaced([]);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">🧩 Sticker Board</h2>
        <button onClick={clearBoard} className="p-2 bg-gray-800 rounded-lg text-gray-300">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-4">Create a beautiful scene with stickers!</p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {STICKERS.map(sticker => (
          <motion.button
            key={sticker.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedSticker(sticker)}
            className={`p-2 rounded-xl border-2 text-3xl ${selectedSticker.id === sticker.id ? 'bg-indigo-500/20 border-indigo-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            {sticker.emoji}
          </motion.button>
        ))}
      </div>

      <div 
        className="w-full h-64 bg-[#1a1a1a] rounded-xl border-2 border-dashed border-gray-700 relative overflow-hidden cursor-crosshair mb-4"
        onClick={handleBoardClick}
      >
        {placed.map((item, index) => (
          <div key={index} className="absolute text-3xl" style={{ left: item.x - 20, top: item.y - 20 }}>
            {item.sticker.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};