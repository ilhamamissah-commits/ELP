import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { ROBOT_PARTS } from './roboticsData';

export const RobotDesigner: React.FC = () => {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [budget] = useState(100);

  const handleAddPart = (id: string, cost: number) => {
    if (totalCost + cost > budget) {
      alert("Budget exceeded! Choose a cheaper part.");
      return;
    }
    if (selectedParts.includes(id)) return;
    
    setSelectedParts([...selectedParts, id]);
    setTotalCost(totalCost + cost);
  };

  const handleRemovePart = (id: string, cost: number) => {
    setSelectedParts(selectedParts.filter(part => part !== id));
    setTotalCost(totalCost - cost);
  };

  const getPartById = (id: string) => ROBOT_PARTS.find(part => part.id === id);

  const completed = totalCost === budget;

  const reset = () => {
    setSelectedParts([]);
    setTotalCost(0);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🛠️ Robot Designer</h3>
        <button onClick={reset} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Build your ultimate robot with a budget of ${budget}!</p>

      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-4">
        <p className="text-gray-400 text-sm mb-2">Your Robot:</p>
        <div className="flex gap-2 justify-center mb-2">
          {selectedParts.length === 0 ? <span className="text-gray-500 italic">No parts yet!</span> : selectedParts.map((id, idx) => {
            const part = getPartById(id);
            return part ? <span key={idx} className="text-3xl">{part.emoji}</span> : null;
          })}
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Spent: <span className="text-yellow-400 font-bold">${totalCost}</span></span>
          <span className="text-sm text-gray-400">Remaining: <span className="text-white font-bold">${budget - totalCost}</span></span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${(totalCost / budget) * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto">
        {ROBOT_PARTS.map((part) => {
          const isSelected = selectedParts.includes(part.id);
          return (
            <motion.button
              key={part.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => isSelected ? handleRemovePart(part.id, part.cost) : handleAddPart(part.id, part.cost)}
              className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all ${
                isSelected ? 'bg-green-500/10 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-indigo-400'
              }`}
            >
              <span className="text-3xl mb-1">{part.emoji}</span>
              <span className="text-xs text-white font-bold">{part.name}</span>
              <span className="text-[10px] text-gray-400">${part.cost}</span>
            </motion.button>
          );
        })}
      </div>

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Perfect Robot!
          <button onClick={reset} className="ml-2 px-4 py-1 bg-green-600 rounded-lg text-white">Build Again</button>
        </motion.div>
      )}
    </div>
  );
};