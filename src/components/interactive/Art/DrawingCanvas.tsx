import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#ffffff'];

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [penSize, setPenSize] = useState(6);
  const [drawingCount, setDrawingCount] = useState(0);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx!.lineWidth = penSize;
    ctx!.lineCap = 'round';
    ctx!.strokeStyle = selectedColor;
    ctx?.lineTo(x, y);
    ctx?.stroke();
  }, [isDrawing, penSize, selectedColor]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawingCount(0);
  };

  const addToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    // In a real app, you'd save this to a store
    setDrawingCount(prev => prev + 1);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">🎨 Drawing Canvas</h2>
        <button onClick={clearCanvas} className="p-2 bg-gray-800 rounded-lg text-gray-300">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-4">Draw anything you can imagine!</p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {COLORS.map(color => (
          <motion.button
            key={color} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {[2, 4, 6, 10].map(size => (
          <button
            key={size} onClick={() => setPenSize(size)}
            className={`px-3 py-1 rounded-full text-xs font-bold ${penSize === size ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            {size}px
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-700 mb-4">
        <canvas 
          ref={canvasRef} width={500} height={400}
          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
          onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full h-full touch-none"
        />
      </div>

      <button onClick={addToGallery} className="px-6 py-2 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500">
        💾 Add to Gallery ({drawingCount})
      </button>
    </div>
  );
};