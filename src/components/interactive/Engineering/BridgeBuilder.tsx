import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, Blocks } from 'lucide-react';

export const BridgeBuilder: React.FC = () => {
  const [planks, setPlanks] = useState(0);
  const [wheels, setWheels] = useState(0);
  const [pillars, setPillars] = useState(0);
  const [isTested, setIsTested] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleBuild = (type: 'plank' | 'wheel' | 'pillar') => {
    setIsTested(false);
    setPassed(false);
    if (type === 'plank') setPlanks(p => Math.min(p + 1, 4));
    if (type === 'wheel') setWheels(w => Math.min(w + 1, 2));
    if (type === 'pillar') setPillars(p => Math.min(p + 1, 4));
  };

  const handleReset = () => {
    setPlanks(0); setWheels(0); setPillars(0); setIsTested(false); setPassed(false);
  };

  const handleTest = () => {
    setIsTested(true);
    // Success if: 3 planks, 2 pillars, and at least 1 wheel
    setPassed(planks >= 3 && pillars >= 2 && wheels >= 1);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🌉 Bridge Builder</h3>
      <p className="text-gray-400 text-sm mb-4">Build a bridge that can hold 3 blocks! <br/> <span className="text-indigo-400">Use: 3+ planks, 2+ pillars, 1+ wheel.</span></p>

      <div className="flex justify-center items-end gap-2 mb-6 min-h-[100px] bg-[#1a1a1a] rounded-xl border border-gray-800 p-4">
        {/* Visual Bridge */}
        <div className="flex gap-1 items-end">
          {Array.from({ length: pillars }).map((_, i) => <div key={i} className="w-4 h-12 bg-gray-500 rounded-t-sm" />)}
        </div>
        <div className="flex flex-col items-center gap-1">
          {Array.from({ length: planks }).map((_, i) => <div key={i} className="w-24 h-4 bg-amber-600 rounded-sm" />)}
          <div className="flex gap-1">
            {Array.from({ length: wheels }).map((_, i) => <div key={i} className="w-6 h-6 rounded-full bg-gray-600" />)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => handleBuild('plank')} className="p-3 bg-amber-600 rounded-xl text-white font-bold hover:bg-amber-500">+ Plank</button>
        <button onClick={() => handleBuild('pillar')} className="p-3 bg-gray-600 rounded-xl text-white font-bold hover:bg-gray-500">+ Pillar</button>
        <button onClick={() => handleBuild('wheel')} className="p-3 bg-gray-400 rounded-xl text-white font-bold hover:bg-gray-300">+ Wheel</button>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={handleReset} className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
        <button onClick={handleTest} className="flex-1 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500">Test Bridge</button>
      </div>

      {isTested && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 p-3 rounded-xl font-bold ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {passed ? <><CheckCircle className="w-5 h-5 inline mr-1" /> Great job! Your bridge is strong!</> : 'Oops! The bridge collapsed. Try adding more parts.'}
        </motion.div>
      )}
    </div>
  );
};