import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';

const RODS = [
  { id: 10, length: 10 }, { id: 9, length: 9 }, { id: 8, length: 8 }, { id: 7, length: 7 },
  { id: 6, length: 6 }, { id: 5, length: 5 }, { id: 4, length: 4 }, { id: 3, length: 3 },
  { id: 2, length: 2 }, { id: 1, length: 1 }
];

export const RedRods: React.FC = () => {
  const [placed, setPlaced] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);

  const handlePlace = (id: number) => {
    if (placed.length === 0 && id !== 10) return;
    if (placed.length > 0 && id >= placed[placed.length - 1]) return;
    setPlaced([...placed, id]);
  };

  useEffect(() => { if (placed.length === 10) setComplete(true); }, [placed]);

  const reset = () => { setPlaced([]); setComplete(false); };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">🔴 Red Rods</h3>
        <button onClick={reset} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Arrange from longest to shortest!</p>

      <div className="w-full h-64 bg-[#1a1a1a] rounded-xl border-2 border-dashed border-gray-700 flex items-start justify-center p-2">
        {complete ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-400 font-bold flex flex-col items-center mt-10">
            <CheckCircle className="w-12 h-12 mb-2" />
            <span>Perfect Rods!</span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center w-full gap-1 mt-2">
            {placed.map((id, index) => (
              <motion.div key={`${id}-${index}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                className="bg-red-500 rounded h-3"
                style={{ width: `${id * 20}px` }} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-4 p-4 bg-[#111] rounded-lg">
        {RODS.filter(r => !placed.includes(r.id)).map((rod) => (
          <motion.button key={rod.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handlePlace(rod.id)}
            className="bg-red-500 rounded h-3" style={{ width: `${rod.length * 15}px` }} />
        ))}
      </div>
    </div>
  );
};