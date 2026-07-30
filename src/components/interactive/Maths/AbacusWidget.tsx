import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

// --- 1. Types & Interfaces ---
interface RodState {
  upper: number; // 0 or 1 (Heaven bead = 5)
  lower: number; // 0 to 4 (Earth beads = 1 each)
}

type ActivityMode = 'counting' | 'quiz' | 'mental';

interface AbacusWidgetProps {
_onComplete?: (score: number) => void;
}

// --- 2. The Soroban Engine ---
export const AbacusWidget: React.FC<AbacusWidgetProps> = ({ _onComplete: _ }) => {  const RODS = 4; // Th, H, T, U
  const [mode, setMode] = useState<ActivityMode>('counting');
  const [state, setState] = useState<RodState[]>(() => 
    Array(RODS).fill({ upper: 0, lower: 0 })
  );
  
  // -- Game State --
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  
  // Mental Math specific state
  const [mentalProblem, setMentalProblem] = useState<{ a: number, b: number, op: '+' | '-' } | null>(null);
  const [showMentalProblem, setShowMentalProblem] = useState(false);
  const [canAnswerMental, setCanAnswerMental] = useState(false);

  // --- 3. Helper Functions ---
  
  // Calculate the current value of the abacus
  const calculateValue = useCallback((rods: RodState[]): number => {
    let total = 0;
    rods.forEach((rod, i) => {
      const placeValue = Math.pow(10, rods.length - 1 - i);
      const rodValue = (rod.upper * 5) + rod.lower;
      total += rodValue * placeValue;
    });
    return total;
  }, []);

  // Generate a random number up to 9999
  const generateTarget = (): number => {
    return Math.floor(Math.random() * 99) + 1; // Kept low (0-99) for easier testing
  };

  // Reset rods to zero
  const resetAbacus = () => {
    setState(Array(RODS).fill({ upper: 0, lower: 0 }));
    setFeedback('idle');
  };

  // --- 4. Core Interaction Logic ---

  // Toggle Upper Bead (Heaven bead = 5)
  const toggleUpper = (rodIndex: number) => {
    if (feedback === 'correct') return;
    setState(prev => {
      const next = [...prev];
      next[rodIndex] = { 
        ...next[rodIndex], 
        upper: next[rodIndex].upper === 0 ? 1 : 0 
      };
      return next;
    });
  };

  // Toggle Lower Bead (Earth beads 1-4)
  const toggleLower = (rodIndex: number, beadIndex: number) => {
    if (feedback === 'correct') return;
    setState(prev => {
      const next = [...prev];
      const current = next[rodIndex].lower;
      if (current === beadIndex + 1) {
        next[rodIndex] = { ...next[rodIndex], lower: 0 };
      } else {
        next[rodIndex] = { ...next[rodIndex], lower: beadIndex + 1 };
      }
      return next;
    });
  };

  // --- 5. Mode Logic Handlers ---

  // COUNTING MODE: Just play freely
  const startCounting = () => {
    resetAbacus();
    setMode('counting');
    setTargetNumber(generateTarget());
    setRound(prev => prev + 1);
  };

  // QUIZ MODE: Build the target number
  const startQuiz = () => {
    resetAbacus();
    setMode('quiz');
    setTargetNumber(generateTarget());
    setRound(prev => prev + 1);
  };

  // MENTAL MODE (Anzan)
  const startMental = () => {
    resetAbacus();
    setMode('mental');
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 30) + 5;
    const op = Math.random() > 0.5 ? '+' : '-';
    setMentalProblem({ a, b, op });
    setShowMentalProblem(true);
    setCanAnswerMental(false);
    
    // Show the problem for 3 seconds, then hide it and allow answering
    setTimeout(() => {
      setShowMentalProblem(false);
      setCanAnswerMental(true);
    }, 3000);
  };

  // --- 6. Verify Logic ---
  const handleCheck = () => {
    const currentValue = calculateValue(state);

    if (mode === 'counting' || mode === 'quiz') {
      if (currentValue === targetNumber) {
        setFeedback('correct');
        setScore(prev => prev + 10);
        setTimeout(() => {
          if (mode === 'quiz') startQuiz(); // Auto-next for quiz
          else startCounting();
        }, 1500);
      } else {
        setFeedback('incorrect');
      }
    } 
    else if (mode === 'mental') {
      if (!mentalProblem || !canAnswerMental) return;
      const correctAnswer = mentalProblem.op === '+' 
        ? mentalProblem.a + mentalProblem.b 
        : mentalProblem.a - mentalProblem.b;
      
      if (currentValue === correctAnswer) {
        setFeedback('correct');
        setScore(prev => prev + 20);
        setTimeout(() => startMental(), 2000);
      } else {
        setFeedback('incorrect');
      }
    }
  };

  // --- 7. Render UI ---
  return (
    <div className="max-w-lg mx-auto p-6 bg-app-card rounded-2xl border border-app-border shadow-xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Soroban Abacus</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${mode === 'counting' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>Count</span>
            <span className={`text-xs px-2 py-1 rounded-full ${mode === 'quiz' ? 'bg-green-500/20 text-green-300' : 'bg-gray-800 text-gray-400'}`}>Quiz</span>
            <span className={`text-xs px-2 py-1 rounded-full ${mode === 'mental' ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'}`}>Mental</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-bold text-sm">⭐ {score}</span>
          <button onClick={resetAbacus} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div className="flex gap-3 mb-6 justify-center flex-wrap">
        <button onClick={startCounting} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mode === 'counting' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>🔢 Count</button>
        <button onClick={startQuiz} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mode === 'quiz' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>🎯 Quiz</button>
        <button onClick={startMental} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${mode === 'mental' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>🧠 Mental Math</button>
      </div>

      {/* TARGET DISPLAY */}
      <div className="h-16 flex items-center justify-center mb-4 rounded-xl bg-[#222222] border border-gray-800">
        <AnimatePresence mode="wait">
          {mode === 'counting' && (
            <motion.div key="count" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <span className="text-gray-400 text-sm block">Build this number:</span>
              <span className="text-4xl font-mono font-bold text-white">{targetNumber}</span>
            </motion.div>
          )}
          
          {mode === 'quiz' && (
            <motion.div key="quiz" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <span className="text-green-400 text-sm block">Round {round}</span>
              <span className="text-4xl font-mono font-bold text-green-400">{targetNumber}</span>
            </motion.div>
          )}

          {mode === 'mental' && mentalProblem && (
            <motion.div key="mental" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              {showMentalProblem ? (
                <span className="text-4xl font-mono font-bold text-purple-400">
                  {mentalProblem.a} {mentalProblem.op} {mentalProblem.b} = ?
                </span>
              ) : canAnswerMental ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm text-gray-400">Solve it on the abacus...</span>
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                </div>
              ) : (
                <span className="text-gray-500 text-sm">Memorizing...</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* THE SOROBAN WIDGET */}
      <div className="bg-[#1a1a1a] p-4 rounded-xl mb-6 relative overflow-hidden">
        <div className="flex justify-center gap-1 p-2">
          {state.map((rod, rodIdx) => (
            <div key={rodIdx} className="flex flex-col items-center w-10 bg-[#2a2a2a] rounded-lg py-2">
              
              {/* Heaven Bead */}
              <button 
                onClick={() => toggleUpper(rodIdx)}
                className={`w-8 h-8 rounded-full transition-all duration-300 cursor-pointer shadow-md
                  ${rod.upper === 1 ? 'bg-amber-500 translate-y-3' : 'bg-amber-700/50'}`}
              />
              
              {/* Beam */}
              <div className="w-full h-1 bg-gray-600 my-2 shadow-inner" />
              
              {/* Earth Beads */}
              <div className="flex flex-col-reverse gap-1">
                {[3, 2, 1, 0].map(beadIdx => (
                  <button 
                    key={beadIdx}
                    onClick={() => toggleLower(rodIdx, beadIdx)}
                    className={`w-8 h-8 rounded-full transition-all duration-300 cursor-pointer
                      ${rod.lower > beadIdx ? 'bg-amber-500 shadow-md' : 'bg-amber-700/30'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-1 mt-2 text-[10px] text-gray-500 font-mono">
          <span className="w-10 text-center">Th</span>
          <span className="w-10 text-center">H</span>
          <span className="w-10 text-center">T</span>
          <span className="w-10 text-center">U</span>
        </div>
      </div>

      {/* CURRENT VALUE DISPLAY */}
      <div className="text-center mb-4">
        <span className="text-gray-500 text-xs">Current Value</span>
        <div className="text-3xl font-mono font-bold text-amber-400">
          {calculateValue(state)}
        </div>
      </div>

      {/* ACTIONS & FEEDBACK */}
      <div className="flex flex-col items-center gap-3">
        <button 
          onClick={handleCheck}
          disabled={feedback === 'correct'}
          className="w-48 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          Check Answer
        </button>

        <div className="h-8 flex justify-center">
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 font-bold text-sm"
              >
                <CheckCircle className="w-4 h-4" /> Excellent!
              </motion.div>
            )}
            {feedback === 'incorrect' && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-4 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 font-bold text-sm"
              >
                <XCircle className="w-4 h-4" /> Try again!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};