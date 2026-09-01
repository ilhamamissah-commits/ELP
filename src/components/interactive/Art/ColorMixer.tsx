import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export const ColorMixer: React.FC = () => {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  const mixedColor = `rgb(${red}, ${green}, ${blue})`;

  const handleReset = () => {
    setRed(0);
    setGreen(0);
    setBlue(0);
  };

  const handleColor = (color: 'red' | 'green' | 'blue', value: number) => {
    if (color === 'red') setRed(value);
    if (color === 'green') setGreen(value);
    if (color === 'blue') setBlue(value);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">🎨 Color Mixer</h2>
        <button onClick={handleReset} className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-6">Slide to mix your perfect color!</p>

      <div className="mb-6 flex items-center justify-center">
        <div 
          className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl transition-all duration-300" 
          style={{ backgroundColor: mixedColor }}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-red-400 font-bold w-12">🔴 Red</span>
          <input 
            type="range" min="0" max="255" value={red}
            onChange={(e) => handleColor('red', Number(e.target.value))}
            className="flex-1 accent-red-500"
          />
          <span className="text-white w-8 text-right">{red}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-green-400 font-bold w-12">🟢 Green</span>
          <input 
            type="range" min="0" max="255" value={green}
            onChange={(e) => handleColor('green', Number(e.target.value))}
            className="flex-1 accent-green-500"
          />
          <span className="text-white w-8 text-right">{green}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-blue-400 font-bold w-12">🔵 Blue</span>
          <input 
            type="range" min="0" max="255" value={blue}
            onChange={(e) => handleColor('blue', Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <span className="text-white w-8 text-right">{blue}</span>
        </div>
      </div>

      <div className="mt-6 text-white text-sm font-bold bg-gray-800 p-3 rounded-xl">
        RGB: ({red}, {green}, {blue})
      </div>
    </div>
  );
};