import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, RefreshCw, 
  ArrowRight, Plus, Minus, Zap
} from 'lucide-react';

// --- 1. Types & Interfaces ---
type BeadType = 'unit' | 'ten' | 'hundred' | 'thousand';
type ActivityMode = 'explore' | 'build' | 'exchange';

interface GoldenBeadsProps {
  onComplete?: (score: number) => void;
}

// --- 2. Component Implementation ---
export const GoldenBeads: React.FC<GoldenBeadsProps> = ({ onComplete }) => {
  // -- State --
  const [mode, setMode] = useState<ActivityMode>('explore');
  const [units, setUnits] = useState(0);
  const [tens, setTens] = useState(0);
  const [hundreds, setHundreds] = useState(0);
  const [thousands, setThousands] = useState(0);
  
  const [targetNumber, setTargetNumber] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [score, setScore] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  // -- Derived State --
  const currentValue = units + (tens * 10) + (hundreds * 100) + (thousands * 1000);

  // --- 3. Core Mechanics ---

  // Logic to add a bead (with an optional "max" limit to prevent massive numbers)
  const addBead = (type: BeadType) => {
    if (feedback === 'correct') return;
    if (currentValue >= 9999) return; // Safety cap for 4 rods

    switch(type) {
      case 'unit': if (units < 9) setUnits(u => u + 1); break;
      case 'ten': if (tens < 9) setTens(t => t + 1); break;
      case 'hundred': if (hundreds < 9) setHundreds(h => h + 1); break;
      case 'thousand': if (thousands < 9) setThousands(t => t + 1); break;
    }
    setFeedback('idle');
  };

  // Logic to remove a bead (allows self-correction)
  const removeBead = (type: BeadType) => {
    if (feedback === 'correct') return;
    switch(type) {
      case 'unit': if (units > 0) setUnits(u => u - 1); break;
      case 'ten': if (tens > 0) setTens(t => t - 1); break;
      case 'hundred': if (hundreds > 0) setHundreds(h => h - 1); break;
      case 'thousand': if (thousands > 0) setThousands(t => t - 1); break;
    }
    setFeedback('idle');
  };

  // Reset everything
  const resetBeads = () => {
    setUnits(0);
    setTens(0);
    setHundreds(0);
    setThousands(0);
    setFeedback('idle');
  };

  // --- 4. Mode Specific Handlers ---

  // BUILD MODE: Generate a target number
  const startBuildRound = () => {
    resetBeads();
    // Generate a random number up to 9,999
    const newTarget = Math.floor(Math.random() * 9999) + 1;
    setTargetNumber(newTarget);
    setMode('build');
    setFeedback('idle');
  };

  // EXCHANGE MODE: Auto-exchange logic (Montessori "Carrying Over")
  const handleExchange = () => {
    let newUnits = units;
    let newTens = tens;
    let newHundreds = hundreds;
    let newThousands = thousands;

    // 1. Exchange 10 Units for 1 Ten
    if (newUnits >= 10) {
      newUnits -= 10;
      newTens += 1;
    }
    // 2. Exchange 10 Tens for 1 Hundred
    if (newTens >= 10) {
      newTens -= 10;
      newHundreds += 1;
    }
    // 3. Exchange 10 Hundreds for 1 Thousand
    if (newHundreds >= 10) {
      newHundreds -= 10;
      newThousands += 1;
    }

    setUnits(newUnits);
    setTens(newTens);
    setHundreds(newHundreds);
    setThousands(newThousands);
    setFeedback('idle');
  };

  // --- 5. Verification Logic ---

  const handleCheck = () => {
    if (mode === 'build') {
      if (currentValue === targetNumber) {
        setFeedback('correct');
        setScore(prev => prev + 10);
        setRoundsCompleted(prev => prev + 1);
        // Auto-start next round after short delay
        setTimeout(() => startBuildRound(), 2000);
      } else {
        setFeedback('incorrect');
      }
    }
  };

  // --- 6. Render UI ---

  // Helper to render a visual block for a place value
  const renderBeadBlock = (type: BeadType, count: number, label: string, visual: React.ReactNode, isGold: boolean = true) => (
    <div className="flex flex-col items-center gap-2 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800 w-full max-w-[140px]">
      <div className="flex gap-2">
        <button 
          onClick={() => addBead(type)} 
          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={() => removeBead(type)} 
          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
      
      <div className={`${isGold ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gray-500/10 border-gray-500/30'} border rounded-lg p-4 flex items-center justify-center h-20 w-full transition-all`}>
        {visual}
      </div>
      
      <div className="text-center">
        <div className="font-mono font-bold text-xl">{count}</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-app-card rounded-2xl border border-app-border shadow-xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Montessori Golden Beads</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${mode === 'explore' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>Explore</span>
            <span className={`text-xs px-2 py-1 rounded-full ${mode === 'build' ? 'bg-green-500/20 text-green-300' : 'bg-gray-800 text-gray-400'}`}>Build</span>
            <span className={`text-xs px-2 py-1 rounded-full ${mode === 'exchange' ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'}`}>Exchange</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {mode === 'build' && <span className="text-yellow-400 font-bold text-sm">⭐ {score}</span>}
          <button onClick={resetBeads} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div className="flex gap-3 mb-6 justify-center flex-wrap">
        <button 
          onClick={() => { setMode('explore'); resetBeads(); }} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mode === 'explore' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          🧱 Free Explore
        </button>
        <button 
          onClick={startBuildRound} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mode === 'build' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          🎯 Build It! (Quiz)
        </button>
        <button 
          onClick={() => { setMode('exchange'); resetBeads(); }} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mode === 'exchange' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          🔄 Exchange (Carry Over)
        </button>
      </div>

      {/* TARGET DISPLAY */}
      {(mode === 'build') && (
        <div className="h-16 flex items-center justify-center mb-4 rounded-xl bg-[#222222] border border-gray-800">
          <motion.div key={targetNumber} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
            <span className="text-gray-400 text-sm block">Build this number:</span>
            <span className="text-4xl font-mono font-bold text-white">{targetNumber}</span>
          </motion.div>
        </div>
      )}

      {/* GOLDEN BEADS DISPLAY (The 4 Place Values) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Units */}
        {renderBeadBlock('unit', units, 'Units', (
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: Math.min(units, 9) }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
            ))}
          </div>
        ))}

        {/* Tens */}
        {renderBeadBlock('ten', tens, 'Tens', (
          <div className="flex flex-wrap gap-0.5 justify-center">
            {Array.from({ length: Math.min(tens, 9) }).map((_, i) => (
              <div key={i} className="flex gap-0.5 bg-amber-500/20 p-1 rounded">
                 {Array.from({ length: 10 }).map((_, j) => (
                   <div key={j} className="w-1 h-1.5 rounded-full bg-amber-500" />
                 ))}
              </div>
            ))}
          </div>
        ))}

        {/* Hundreds */}
        {renderBeadBlock('hundred', hundreds, 'Hundreds', (
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: Math.min(hundreds, 9) }).map((_, i) => (
              <div key={i} className="w-8 h-8 border-2 border-amber-500 bg-amber-500/10 rounded-sm grid grid-cols-5 grid-rows-5 gap-0.5 p-0.5">
                 {Array.from({ length: 10 }).map((_, j) => (
                   <div key={j} className="bg-amber-500/50 rounded-[1px]" />
                 ))}
              </div>
            ))}
          </div>
        ))}

        {/* Thousands */}
        {renderBeadBlock('thousand', thousands, 'Thousands', (
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: Math.min(thousands, 9) }).map((_, i) => (
              <div key={i} className="w-8 h-8 border-2 border-amber-500 bg-amber-500/20 rounded-sm relative">
                 <div className="absolute inset-1 grid grid-cols-5 grid-rows-5 gap-0.5">
                   {Array.from({ length: 10 }).map((_, j) => (
                     <div key={j} className="bg-amber-500 rounded-[1px]" />
                   ))}
                 </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* CURRENT VALUE & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 text-xs">Current Value</span>
          <div className="text-3xl font-mono font-bold text-amber-400">
            {currentValue}
          </div>
        </div>

        <div className="flex gap-3">
          {mode === 'exchange' && (
            <button 
              onClick={handleExchange}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors"
            >
              Exchange 10s
            </button>
          )}

          {(mode === 'build') && (
            <button 
              onClick={handleCheck}
              disabled={feedback === 'correct'}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              Check Answer
            </button>
          )}

          {mode === 'explore' && (
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> Use + / - to experiment
            </div>
          )}
        </div>
      </div>

      {/* FEEDBACK AREA */}
      <div className="mt-4 h-12 flex justify-center">
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 font-bold"
            >
              <CheckCircle className="w-5 h-5" /> Amazing! You built it!
            </motion.div>
          )}
          {feedback === 'incorrect' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 font-bold"
            >
              <XCircle className="w-5 h-5" /> Try again. Count the beads carefully.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COMPLETION (After 5 successful build rounds) */}
      {mode === 'build' && roundsCompleted >= 5 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-green-900/30 border border-green-500/30 rounded-xl text-center"
        >
          <p className="text-green-400 font-bold text-xl mb-2">🌟 5 Numbers Built!</p>
          <p className="text-gray-300 text-sm mb-4">You have mastered place value with Golden Beads!</p>
          <button 
            onClick={() => { if(onComplete) onComplete(score); }}
            className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200"
          >
            Finish & Earn Stars
          </button>
        </motion.div>
      )}
    </div>
  );
};