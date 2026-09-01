import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Activity, Dna, Bug, Home, Flower2, Apple, Bone, 
  Brain, Wind, Magnet, Waves, TreePine, Sun, Snowflake, 
  Heart, Droplets, Shield, Microscope, Sprout, Bird, Fish, Cat, 
  Globe, FlaskConical, Atom, Rocket, Star, Moon, Cloud, TestTube2, 
  Thermometer, Zap, Building2, Flame, Sparkles, 
  ArrowRight, ArrowDown, Rainbow
} from 'lucide-react';
import { BIOLOGY_EXPERIMENTS, PHYSICS_EXPERIMENTS, CHEMISTRY_EXPERIMENTS, Experiment } from '../../../data/scienceData';

// Map the string name to the actual React Component
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, Activity, Dna, Bug, Home, Flower2, Apple, Bone, 
  Brain, Wind, Magnet, Waves, TreePine, Sun, Snowflake, 
  Heart, Droplets, Shield, Microscope, Sprout, Bird, Fish, Cat, 
  Globe, FlaskConical, Atom, Rocket, Star, Moon, Cloud, TestTube2, 
  Thermometer, Zap, Building2, Flame, Sparkles, 
  ArrowRight, ArrowDown, Rainbow
};

interface ScienceLabProps {
  type: 'biology' | 'physics' | 'chemistry';
}

export const ScienceLab: React.FC<ScienceLabProps> = ({ type }) => {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  // Keep hooks unconditional: the list-to-detail transition must not change
  // the number or order of hooks used by this component.
  const [step, setStep] = useState(0);

  const experiments = 
    type === 'biology' ? BIOLOGY_EXPERIMENTS : 
    type === 'physics' ? PHYSICS_EXPERIMENTS : 
    CHEMISTRY_EXPERIMENTS;
    
  const title = 
    type === 'biology' ? '🔬 Biology Lab' : 
    type === 'physics' ? '⚛️ Physics Lab' : 
    '🧪 Chemistry Lab';

  // Resolve the icon from the string
  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon ? <Icon className="w-8 h-8" /> : <FlaskConical className="w-8 h-8" />;
  };

  const selectExperiment = (experiment: Experiment) => {
    setStep(0);
    setSelectedExperiment(experiment);
  };

  const returnToExperimentList = () => {
    setStep(0);
    setSelectedExperiment(null);
  };

  if (selectedExperiment) {
    return (
      <div className="max-w-2xl w-full mx-auto bg-app-card/80 backdrop-blur-md border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
        <h2 className="text-2xl font-bold text-white mb-4">{selectedExperiment.title}</h2>
        <p className="text-gray-400 mb-4">{selectedExperiment.description}</p>
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 min-h-[200px] flex flex-col justify-center mb-6">
          <div className="text-4xl mb-3">{getIcon(selectedExperiment.iconName)}</div>
          <p className="text-lg text-white font-bold">{selectedExperiment.steps[step]}</p>
          <p className="text-xs text-gray-500 mt-2">Step {step + 1} of {selectedExperiment.steps.length}</p>
        </div>
        <div className="flex justify-between gap-4">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 bg-gray-800 rounded-lg text-white font-bold hover:bg-gray-700 disabled:opacity-30">← Back</button>
          {step < selectedExperiment.steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500">Next Step →</button>
          ) : (
            <button onClick={returnToExperimentList} className="px-4 py-2 bg-green-600 rounded-lg text-white font-bold hover:bg-green-500">✔ Done!</button>
          )}
        </div>
        {step === selectedExperiment.steps.length - 1 && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold">🧪 {selectedExperiment.conclusion}</div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full mx-auto bg-app-card/80 backdrop-blur-md border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 relative overflow-hidden">
      <div className={`absolute inset-0 ${type === 'biology' ? 'bg-emerald-500/5' : type === 'physics' ? 'bg-blue-500/5' : 'bg-purple-500/5'} blur-[100px] -z-10`} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">{title}</h2>
        <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">{experiments.length} Experiments</div>
      </div>
      <p className="text-gray-400 text-sm mb-6">Choose an experiment to begin your discovery!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiments.map((exp) => (
          <motion.button key={exp.id} whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => selectExperiment(exp)} className={`${exp.bgColor} border border-white/10 hover:border-white/30 p-5 rounded-xl text-left transition-all relative overflow-hidden group`}>
            <div className={`absolute inset-0 ${exp.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
            <div className={`${exp.color} mb-3 flex justify-between items-center`}>{getIcon(exp.iconName)}<span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">Level {exp.level}</span></div>
            <h4 className="text-white font-bold text-lg">{exp.title}</h4>
            <p className="text-gray-400 text-sm line-clamp-2 mt-1">{exp.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
