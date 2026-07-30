import React, { useRef, useState, useCallback, useEffect } from 'react';

export const TracingNumbers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);
  
  const drawTemplate = useCallback((ctx: CanvasRenderingContext2D, num: number) => {
    ctx.clearRect(0, 0, 300, 300);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#94a3b8'; 
    ctx.lineWidth = 3;
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
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    ctx?.beginPath();
    ctx?.moveTo(clientX - rect.left, clientY - rect.top);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    ctx!.lineWidth = 6;
    ctx!.lineCap = 'round';
    ctx!.strokeStyle = '#0f172a'; 
    ctx?.lineTo(clientX - rect.left, clientY - rect.top);
    ctx?.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) drawTemplate(ctx, currentNumber);
  }, [currentNumber, drawTemplate]);

  const nextNumber = () => {
    const next = (currentNumber + 1) % 10; // Loops 0 to 9
    setCurrentNumber(next);
    setTimeout(clearCanvas, 100);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-2">🔢 Trace the Number</h3>
      <p className="text-gray-400 text-sm mb-4">Follow the dots to write <span className="text-indigo-400 font-bold">{currentNumber}</span></p>
      
      <div className="bg-white p-2 rounded-xl border border-gray-700 mx-auto w-[300px]">
        <canvas 
          ref={canvasRef} 
          width={300} height={300} 
          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
          onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full h-full touch-none rounded-lg"
        />
      </div>
      
      <div className="mt-4 flex gap-3 justify-center">
        <button onClick={clearCanvas} className="px-4 py-2 bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">Clear</button>
        <button onClick={nextNumber} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500">Next ➜</button>
      </div>
    </div>
  );
};