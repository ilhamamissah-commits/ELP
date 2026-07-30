import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';

export const PinkTower: React.FC = () => {
  // 10 Blocks (Sizes 1 to 10)
  const [blocks, setBlocks] = useState([
    { id: 10, size: 10, placed: false },
    { id: 9, size: 9, placed: false },
    { id: 8, size: 8, placed: false },
    { id: 7, size: 7, placed: false },
    { id: 6, size: 6, placed: false },
    { id: 5, size: 5, placed: false },
    { id: 4, size: 4, placed: false },
    { id: 3, size: 3, placed: false },
    { id: 2, size: 2, placed: false },
    { id: 1, size: 1, placed: false },
  ]);
  const [tower, setTower] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // --- 1. Reset Tower Function ---
  const resetTower = () => {
    setTower([]);
    setBlocks(blocks.map(b => ({ ...b, placed: false })));
    setIsComplete(false);
  };

  const handlePlace = (id: number) => {
    // Find the block
    const block = blocks.find(b => b.id === id);
    if (!block || block.placed) return;

    // Montessori Rule: You must place the LARGEST block FIRST.
    if (tower.length === 0) {
      // Can only start with the largest block (size 10)
      if (id === 10) {
        setTower([10]);
        setBlocks(blocks.map(b => b.id === 10 ? { ...b, placed: true } : b));
      }
    } else {
      const lastPlaced = tower[tower.length - 1];
      if (id < lastPlaced) {
        // Valid move!
        setTower([...tower, id]);
        setBlocks(blocks.map(b => b.id === id ? { ...b, placed: true } : b));
      } else {
        // --- 2. SELF CORRECTION ERROR HANDLING ---
        // Instead of an alert, we just "shake" the block and leave it in the bank.
        // The child simply tries again with a smaller block.
        // No popup to scare them!
      }
    }
  };

  // Check if tower is complete (All 10 blocks placed in order)
  useEffect(() => {
    if (tower.length === 10) {
      setIsComplete(true);
    }
  }, [tower]);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">🏗️ Pink Tower</h3>
        <button 
          onClick={resetTower}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        Tap the blocks to build the tower. <br/> 
        <span className="text-indigo-400">Start with the biggest block at the bottom!</span>
      </p>

      <div className="flex flex-col items-center gap-4">
        {/* The Tower Base */}
        <div className="w-full h-64 bg-[#1a1a1a] rounded-xl border-2 border-dashed border-gray-700 flex flex-col-reverse items-center justify-end p-2 relative">
          {isComplete ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-green-400 font-bold flex flex-col items-center">
              <CheckCircle className="w-12 h-12 mb-2" />
              <span>Perfect Tower!</span>
            </motion.div>
          ) : (
            tower.map((id) => (
              <motion.div 
                key={id}
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-pink-300 rounded shadow-md border-2 border-pink-400"
                style={{ width: `${id * 10}px`, height: `${id * 8}px` }}
              />
            ))
          )}
        </div>

        {/* The Block Bank */}
        <div className="flex flex-wrap justify-center gap-3 min-h-[60px] p-4 bg-[#111] rounded-lg w-full">
          {blocks.filter(b => !b.placed).map((block) => (
            <motion.button
              key={block.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePlace(block.id)}
              className="bg-pink-300 rounded shadow-md border-2 border-pink-400 hover:brightness-110 transition"
              style={{ width: `${block.size * 6}px`, height: `${block.size * 4}px` }}
            />
          ))}
          {/* If all blocks are placed, display a completion message in the bank */}
          {blocks.filter(b => !b.placed).length === 0 && !isComplete && (
            <div className="text-gray-500 text-sm w-full text-center italic animate-pulse">
              Loading your tower...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};