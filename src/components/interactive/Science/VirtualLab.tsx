import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, FlaskConical, TestTube2 } from 'lucide-react';
import { BIOLOGY_EXPERIMENTS, PHYSICS_EXPERIMENTS, CHEMISTRY_EXPERIMENTS } from './ScienceLab';

interface Experiment {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  level: number;
  steps: string[];
  conclusion: string;
}

interface VirtualLabProps {
  experimentId?: string;
  scienceType?: 'biology' | 'physics' | 'chemistry';
  onComplete?: (score: number) => void;
}

export const VirtualLab: React.FC<VirtualLabProps> = ({ 
  experimentId, 
  scienceType = 'biology',
  onComplete 
}) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Combine all experiments into one lookup
  const ALL_EXPERIMENTS = [
    ...BIOLOGY_EXPERIMENTS,
    ...PHYSICS_EXPERIMENTS,
    ...CHEMISTRY_EXPERIMENTS
  ];

  // Find the specific experiment by ID
  const experiment = ALL_EXPERIMENTS.find(exp => exp.id === experimentId);

  // If no experiment is selected, show a friendly "Pick a Lab" screen
  if (!experiment) {
    return (
      <div className="max-w-lg mx-auto bg-app-card p-8 rounded-2xl border border-app-border shadow-xl text-center">
        <div className="text-6xl mb-4">🔬</div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to the Virtual Lab!</h2>
        <p className="text-gray-400 mb-6">Go back to the Science Lab and pick an experiment to begin!</p>
        <button 
          onClick={() => {
            // If you're in App.tsx routing, this will be handled by the parent
            // For now, just alert so the user knows they need to pick an experiment
            alert("Please pick an experiment from the Science Lab list!");
          }}
          className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 transition"
        >
          Back to Science Lab
        </button>
      </div>
    );
  }

  // Reset progress when experiment changes
  useEffect(() => {
    setStep(0);
    setScore(0);
    setIsComplete(false);
  }, [experimentId]);

  const handleNext = () => {
    if (step < experiment.steps.length - 1) {
      setStep(step + 1);
      setScore(prev => prev + 10);
    } else {
      setScore(prev => prev + 20); // Bonus for finishing
      setIsComplete(true);
      if (onComplete) onComplete(score + 20);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="max-w-lg w-full mx-auto bg-app-card/80 backdrop-blur-md border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 relative overflow-hidden text-center">
      
      {/* Deep Tech Glow */}
      <div className={`absolute inset-0 ${experiment.bgColor} blur-[100px] -z-10`} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-indigo-400" /> Virtual Lab
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
            Level {experiment.level}
          </span>
          <span className="text-yellow-400 font-bold text-xs">⭐ {score}</span>
        </div>
      </div>

      {/* Experiment Title */}
      <div className="mb-6">
        <div className="text-6xl mb-2">{experiment.icon}</div>
        <h2 className="text-2xl font-bold text-white">{experiment.title}</h2>
        <p className="text-gray-400 text-sm mt-1">{experiment.description}</p>
      </div>

      {/* Step Progress */}
      <div className="w-full bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / experiment.steps.length) * 100}%` }}
          className="h-full bg-indigo-500 rounded-full"
        />
      </div>

      {/* Step Content */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 min-h-[150px] flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <p className="text-lg text-white font-bold">{experiment.steps[step]}</p>
            <p className="text-xs text-gray-500 mt-2">Step {step + 1} of {experiment.steps.length}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4">
        <button 
          onClick={handleBack}
          disabled={step === 0 || isComplete}
          className="px-4 py-2 bg-gray-800 rounded-xl text-white font-bold hover:bg-gray-700 disabled:opacity-30 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button 
          onClick={handleNext}
          disabled={isComplete}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 flex items-center gap-2 disabled:opacity-50"
        >
          {isComplete ? 'Complete' : step < experiment.steps.length - 1 ? 'Next Step' : 'Finish'} 
          {!isComplete && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Conclusion */}
      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold"
        >
          <CheckCircle className="w-6 h-6 inline mr-2" />
          {experiment.conclusion}
          <div className="mt-2 text-white text-sm">You earned {score} points!</div>
        </motion.div>
      )}
    </div>
  );
};