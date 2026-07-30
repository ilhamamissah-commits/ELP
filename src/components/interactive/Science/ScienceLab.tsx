import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Dna, Atom, Activity, Wind, Leaf } from 'lucide-react';

// --- Define Experiments ---
interface Experiment {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

interface ScienceLabProps {
  type: 'biology' | 'physics'; // Which subject are we displaying?
  onSelectExperiment?: (expId: string) => void;
}

export const ScienceLab: React.FC<ScienceLabProps> = ({ type, onSelectExperiment }) => {
  // --- Mock Data for Biology ---
  const BIOLOGY_EXPERIMENTS: Experiment[] = [
    { id: 'bio-1', title: 'Plant Life Cycle', icon: <Leaf className="w-8 h-8" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', description: 'How does a tiny seed become a big plant?' },
    { id: 'bio-2', title: 'My Amazing Heart', icon: <Activity className="w-8 h-8" />, color: 'text-red-400', bgColor: 'bg-red-500/10', description: 'What does your heart do all day?' },
    { id: 'bio-3', title: '5 Senses Exploration', icon: <Dna className="w-8 h-8" />, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', description: 'How do we experience the world?' },
  ];

  // --- Mock Data for Physics ---
  const PHYSICS_EXPERIMENTS: Experiment[] = [
    { id: 'phy-1', title: 'Sink or Float?', icon: <FlaskConical className="w-8 h-8" />, color: 'text-blue-400', bgColor: 'bg-blue-500/10', description: 'Why do some objects sink and others float?' },
    { id: 'phy-2', title: 'Magnetic Force', icon: <Atom className="w-8 h-8" />, color: 'text-purple-400', bgColor: 'bg-purple-500/10', description: 'What sticks to a magnet?' },
    { id: 'phy-3', title: 'Water Cycle', icon: <Wind className="w-8 h-8" />, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', description: 'Where does rain come from?' },
  ];

  // Choose the right list based on prop
  const experiments = type === 'biology' ? BIOLOGY_EXPERIMENTS : PHYSICS_EXPERIMENTS;
  const title = type === 'biology' ? '🔬 Biology Lab' : '⚛️ Physics Lab';

  // --- ✅ NEW: Click Handler for Experiments ---
  const handleExperimentClick = (expId: string) => {
    // If the parent passed a function, call it to navigate to the experiment
    if (onSelectExperiment) {
      onSelectExperiment(expId);
    } else {
      // Fallback if the parent didn't provide a function
      alert(`Loading experiment: ${expId}. Imagine a beautiful Virtual Lab appearing here!`);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-app-card/80 backdrop-blur-md border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 relative overflow-hidden">
      
      {/* Deep Tech Background Glows */}
      <div className={`absolute inset-0 ${type === 'biology' ? 'bg-emerald-500/5' : 'bg-blue-500/5'} blur-[100px] -z-10`} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          {title}
        </h2>
        <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
          {experiments.length} Experiments
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-6">Choose an experiment to begin your discovery!</p>

      {/* Grid of Experiments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiments.map((exp) => (
          <motion.button
            key={exp.id}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            // ✅ This is where the click handler is added:
            onClick={() => handleExperimentClick(exp.id)}
            className={`${exp.bgColor} border border-white/10 hover:border-white/30 p-5 rounded-xl text-left transition-all relative overflow-hidden group`}
          >
            {/* Tech glow on hover */}
            <div className={`absolute inset-0 ${exp.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
            
            <div className={`${exp.color} mb-3`}>{exp.icon}</div>
            <h4 className="text-white font-bold text-lg">{exp.title}</h4>
            <p className="text-gray-400 text-sm line-clamp-2 mt-1">{exp.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};