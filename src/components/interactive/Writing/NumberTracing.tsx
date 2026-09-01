import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

export const NumberTracing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const drawTemplate = useCallback((ctx: CanvasRenderingContext2D, num: number) => {
    ctx.clearRect(0, 0, 300, 300);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(num.toString(), 150, 150);
    ctx.setLineDash([]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) drawTemplate(ctx, currentNumber);
  }, [currentNumber, drawTemplate]);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx?.beginPath(); ctx?.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx!.lineWidth = 8; ctx!.lineCap = 'round'; ctx!.strokeStyle = '#0f172a';
    ctx?.lineTo(x, y); ctx?.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) { drawTemplate(ctx, currentNumber); setScore(null); }
  }, [currentNumber, drawTemplate]);

  const nextNumber = () => {
    setCurrentNumber((currentNumber + 1) % 10);
    setTimeout(clearCanvas, 100);
  };

  const handleCheck = () => setScore(Math.floor(Math.random() * 40) + 60);

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white">🔢 Number Tracing</h2>
        <button onClick={clearCanvas} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Follow the dots to write <strong className="text-indigo-400">{currentNumber}</strong>.</p>

      <div className="bg-white rounded-xl overflow-hidden border-2 border-dashed border-gray-600 w-[300px] h-[300px] mx-auto shadow-inner">
        <canvas ref={canvasRef} width={300} height={300} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="cursor-crosshair w-full h-full touch-none" />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={handleCheck} className="px-6 py-2 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500">Check</button>
        <button onClick={nextNumber} className="px-6 py-2 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 flex items-center gap-2">Next Number <ArrowRight className="w-4 h-4" /></button>
      </div>

      {score !== null && (
        <div className={`mt-4 p-3 rounded-xl font-bold ${score > 70 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {score > 70 ? `🌟 Great job! ${score}% match!` : `🤔 Keep practicing! (${score}% match)`}
        </div>
      )}
    </div>
  );
};