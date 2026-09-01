import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';

const PRISMS = [
  { id: 10, size: 10 }, { id: 9, size: 9 }, { id: 8, size: 8 }, { id: 7, size: 7 },
  { id: 6, size: 6 }, { id: 5, size: 5 }, { id: 4, size: 4 }, { id: 3, size: 3 },
  { id: 2, size: 2 }, { id: 1, size: 1 }
];

export const BrownStair: React.FC = () => {
  const [placed, setPlaced] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);

  const handlePlace = (id: number) => {
    if (placed.length === 0 && id !== 10) return;
    if (placed.length > 0 && id >= placed[placed.length - 1]) return;
    setPlaced([...placed, id]);
  };

  useEffect(() => {
    if (placed.length === 10) setComplete(true);
  }, [placed]);

  const reset = () => {
    setPlaced([]);
    setComplete(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">🟫 Brown Stair</h3>
        <button onClick={reset} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Build the stair! <span className="text-indigo-400">Thickest first, thinnest last!</span></p>

      <div className="w-full h-64 bg-[#1a1a1a] rounded-xl border-2 border-dashed border-gray-700 flex items-end justify-center p-2">
        {complete ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-400 font-bold flex flex-col items-center mb-2">
            <CheckCircle className="w-12 h-12 mb-2" />
            <span>Perfect Stair!</span>
          </motion.div>
        ) : (
          <div className="flex flex-col-reverse items-center w-full">
            {placed.map((id, index) => (
              <motion.div
                key={`${id}-${index}`}
                initial={{ scale: 0, y: -30 }} animate={{ scale: 1, y: 0 }}
                className="bg-amber-700 border-2 border-amber-900 rounded-sm w-full"
                style={{ height: `${id * 5}px`, maxWidth: '100%' }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-4 p-4 bg-[#111] rounded-lg">
        {PRISMS.filter(p => !placed.includes(p.id)).map((prism) => (
          <motion.button
            key={prism.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handlePlace(prism.id)}
            className="bg-amber-700 border-2 border-amber-900 rounded-sm"
            style={{ width: `${prism.size * 4}px`, height: `${prism.size * 3}px` }}
          />
        ))}
      </div>
    </div>
  );
};