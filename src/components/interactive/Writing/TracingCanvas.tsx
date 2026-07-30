import React, { useRef, useState, useCallback, useEffect } from 'react';

export const TracingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [currentLetter, setCurrentLetter] = useState('A');
  const [userPoints, setUserPoints] = useState<{ x: number; y: number }[]>([]);

  // Draw the dotted template letter onto the canvas
  const drawTemplate = useCallback((ctx: CanvasRenderingContext2D, letter: string) => {
    ctx.clearRect(0, 0, 300, 300);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 3;
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(letter, 150, 150);
    ctx.setLineDash([]); // Reset to solid line
  }, []);

  // Load template on mount or letter change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) drawTemplate(ctx, currentLetter);
  }, [currentLetter, drawTemplate]);

  // --- Drawing Logic ---
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx?.beginPath();
    ctx?.moveTo(x, y);
    setUserPoints([{ x, y }]);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx!.lineWidth = 6;
    ctx!.lineCap = 'round';
    ctx!.strokeStyle = '#333333';
    ctx?.lineTo(x, y);
    ctx?.stroke();
    setUserPoints(prev => [...prev, { x, y }]);
  }, [isDrawing]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawTemplate(ctx, currentLetter); // Re-draw template instead of clearing
      setScore(null);
      setUserPoints([]);
    }
  }, [currentLetter, drawTemplate]);

  // --- Evaluation Logic ---
  const handleCheck = () => {
    if (userPoints.length < 5) {
      alert("Please trace the letter first!");
      return;
    }
    // For now, we generate a random score (60-100) to simulate the AI 
    const result = Math.floor(Math.random() * 40) + 60; 
    setScore(result);
  };

  const nextLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currentIndex = letters.indexOf(currentLetter);
    const nextIndex = (currentIndex + 1) % letters.length;
    setCurrentLetter(letters[nextIndex]);
    clearCanvas();
  };

  return (
    <div className="text-center text-white p-6 bg-app-card rounded-2xl border border-app-border max-w-md mx-auto shadow-xl">
      <h2 className="text-2xl font-bold mb-2">✍️ Trace the Letter</h2>
      <p className="text-gray-400 text-sm mb-4">Follow the dotted line to write <strong className="text-white">{currentLetter}</strong>.</p>
      
      <div className="relative border-2 border-dashed border-gray-700 rounded-xl overflow-hidden bg-white mx-auto w-[300px] h-[300px] shadow-inner">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full h-full touch-none"
        />
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={handleCheck} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition shadow-lg">Check</button>
        <button onClick={clearCanvas} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition">Clear</button>
        <button onClick={nextLetter} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition">Next Letter ➜</button>
      </div>

      {score !== null && (
        <div className={`mt-4 p-3 rounded-xl font-bold transition-all ${
          score > 70 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
          'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {score > 70 ? `🌟 Great job! ${score}% match!` : `🤔 Keep practicing! (${score}% match)`}
        </div>
      )}
    </div>
  );
};