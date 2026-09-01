import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';

export const TowerBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<number[]>([]);
  const [tested, setTested] = useState(false);
  const [passed, setPassed] = useState(false);
  const [redBlockAdded, setRedBlockAdded] = useState(false);

  const addBlock = (color: string) => {
    setTested(false);
    setBlocks([...blocks, blocks.length + 1]);
    if (color === 'red') setRedBlockAdded(true);
  };

  const handleReset = () => {
    setBlocks([]); setTested(false); setPassed(false); setRedBlockAdded(false);
  };

  const handleTest = () => {
    setTested(true);
    setPassed(blocks.length >= 5 && redBlockAdded);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🗼 Tower Builder</h3>
      <p className="text-gray-400 text-sm mb-4">Build a tower taller than the red block! <br/> <span className="text-indigo-400">Use: 5+ blocks, 1 must be RED.</span></p>

      <div className="flex flex-col-reverse items-center gap-1 mb-6 min-h-[150px] bg-[#1a1a1a] rounded-xl border border-gray-800 p-4">
        {blocks.map((block, index) => (
          <motion.div
            key={block}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className={`w-20 h-6 rounded-sm ${index === 3 ? 'bg-red-500' : index % 2 === 0 ? 'bg-blue-500' : 'bg-yellow-400'}`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <button onClick={() => addBlock('red')} className="px-4 py-2 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500">Red Block</button>
        <button onClick={() => addBlock('blue')} className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-500">Blue Block</button>
        <button onClick={() => addBlock('yellow')} className="px-4 py-2 bg-yellow-600 rounded-lg text-white font-bold hover:bg-yellow-500">Yellow Block</button>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={handleReset} className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={handleTest} className="flex-1 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500">Test Tower</button>
      </div>

      {tested && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 p-3 rounded-xl font-bold ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {passed ? <><CheckCircle className="w-5 h-5 inline mr-1" /> Amazing! Your tower is super tall!</> : 'Not tall enough. Add more blocks and make sure there is a red one!'}
        </motion.div>
      )}
    </div>
  );
};