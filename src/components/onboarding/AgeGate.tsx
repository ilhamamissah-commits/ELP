import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfileStore } from '../../store/useProfileStore';
import { Trash2 } from 'lucide-react';

interface AgeGateProps {
  onSelect: (age: number, name: string) => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onSelect }) => {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'home' | 'register'>('home');
  
  const { profiles, currentProfileId, setCurrentProfile, addProfile, removeProfile } = useProfileStore();

  const handleLogin = (id: string) => {
    const p = profiles[id];
    if(p) {
      setCurrentProfile(id);
      onSelect(p.age, p.name);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000 mix-blend-screen" />
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-float"
            style={{ 
              width: Math.random() * 4 + 2 + 'px', 
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%', 
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 10 + 10 + 's',
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <div className="text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">🌍</div>
        
        {mode === 'home' && (
          <>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Welcome Back!</h1>
            <p className="text-white/80 mb-8 text-lg font-medium">Who is learning today?</p>

            <button 
              onClick={() => setMode('register')}
              className="w-full mb-6 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg shadow-xl hover:bg-yellow-300 transition-colors"
            >
              ➕ New Learner
            </button>

            <div className="w-full space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
              {Object.entries(profiles).map(([id, p]) => (
                <div
                  key={id}
                  className={`relative w-full p-4 bg-black/40 backdrop-blur-md border-2 rounded-2xl flex items-center gap-4 transition-all shadow-lg ${id === currentProfileId ? 'border-yellow-300/80' : 'border-white/20 hover:border-white/50'}`}
                >
                  <button 
                    onClick={() => handleLogin(id)}
                    className="flex flex-1 items-center gap-4 text-left"
                  >
                    <span className="text-4xl">{p.avatar}</span>
                    <div>
                      <div className="text-xl font-bold text-white">{p.name}</div>
                      <div className="text-sm text-white/70">Age {p.age} • Continue Learning</div>
                    </div>
                    <span className="ml-auto text-yellow-300">→</span>
                  </button>

                  {/* Delete Button - NOW ACTUALLY WORKS */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to remove ${p.name}?`)) {
                        removeProfile(id);
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/40 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setMode('home')}
              className="w-full py-3 text-white/70 text-sm mt-2 hover:text-white transition-colors"
            >
              ← Refresh Profiles
            </button>
          </>
        )}

        {mode === 'register' && (
          <>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Start Your Adventure!</h1>
            <p className="text-white/80 mb-6 text-lg font-medium">Create your profile to begin learning.</p>

            <input 
              type="text" 
              placeholder="What is your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white text-center placeholder-white/60 focus:border-yellow-300 outline-none transition shadow-lg text-lg mb-4"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onSelect(3, name || "Explorer");
              }}
              className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold text-xl shadow-xl hover:bg-yellow-300 transition-colors"
            >
              Start Learning 
            </motion.button>

            <button 
              onClick={() => setMode('home')}
              className="w-full py-3 text-white/70 text-sm mt-2 hover:text-white transition-colors"
            >
              ← Back to Welcome
            </button>
          </>
        )}
      </div>
    </div>
  );
};