import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SHAPES = [
  { id: 1, name: 'Circle', emoji: '🔴', render: (color: string) => <div className="w-16 h-16 rounded-full" style={{ backgroundColor: color }} /> },
  { id: 2, name: 'Square', emoji: '🟥', render: (color: string) => <div className="w-16 h-16" style={{ backgroundColor: color }} /> },
  { id: 3, name: 'Triangle', emoji: '🔺', render: (color: string) => <div className="w-0 h-0 border-l-[32px] border-r-[32px] border-b-[56px]" style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} /> },
  { id: 4, name: 'Star', emoji: '⭐', render: (color: string) => <div className="text-5xl" style={{ color }}>★</div> },
];

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'];

export const ShapesPainter: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [placedShapes, setPlacedShapes] = useState<{ shape: typeof SHAPES[0], color: string, x: number, y: number }[]>([]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlacedShapes([...placedShapes, { shape: selectedShape, color: selectedColor, x, y }]);
  };

  const clear = () => setPlacedShapes([]);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h2 className="text-2xl font-bold text-white mb-2">🔷 Shapes Painter</h2>
      <p className="text-gray-400 text-sm mb-4">Choose a shape, pick a color, and tap the canvas to create art!</p>

      <div className="flex justify-center gap-2 mb-4">
        {SHAPES.map(shape => (
          <motion.button
            key={shape.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedShape(shape)}
            className={`p-2 rounded-xl border-2 ${selectedShape.id === shape.id ? 'bg-indigo-500/20 border-indigo-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            {shape.emoji}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {COLORS.map(color => (
          <motion.button
            key={color} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedColor(color)}
            className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div 
        className="w-full h-64 bg-[#1a1a1a] rounded-xl border-2 border-dashed border-gray-700 relative overflow-hidden cursor-crosshair mb-4"
        onClick={handleCanvasClick}
      >
        {placedShapes.map((item, index) => (
          <div key={index} className="absolute" style={{ left: item.x - 32, top: item.y - 32 }}>
            {item.shape.render(item.color)}
          </div>
        ))}
      </div>

      <button onClick={clear} className="px-4 py-2 bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">
        🗑️ Clear Canvas
      </button>
    </div>
  );
};