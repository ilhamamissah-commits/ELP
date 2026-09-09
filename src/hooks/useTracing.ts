import { useCallback, useRef, useState } from 'react';

export interface TracingOptions {
  strokeWidth?: number;
  strokeStyle?: string;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

export interface UseTracingReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isDrawing: boolean;
  startDrawing: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  draw: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
  clearCanvas: () => void;
}

/**
 * Provides canvas-based tracing input for ELP activities.
 *
 * This hook handles:
 * - Pointer input
 * - Canvas drawing
 * - Clearing the canvas
 * - Drawing state
 *
 * It does not determine whether tracing is correct.
 * Tracing assessment should be handled by a separate learning/
 * assessment engine.
 */
export const useTracing = (
  options: TracingOptions = {},
): UseTracingReturn => {
  const {
    strokeWidth = 6,
    strokeStyle = '#0f766e',
    lineCap = 'round',
    lineJoin = 'round',
  } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const getCanvasPoint = useCallback(
    (
      event: React.PointerEvent<HTMLCanvasElement>,
    ): { x: number; y: number } | null => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return null;
      }

      const rect = canvas.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        return null;
      }

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const configureContext = useCallback(
    (context: CanvasRenderingContext2D): void => {
      context.lineWidth = Math.max(1, strokeWidth);
      context.strokeStyle = strokeStyle;
      context.lineCap = lineCap;
      context.lineJoin = lineJoin;
    },
    [lineCap, lineJoin, strokeStyle, strokeWidth],
  );

  const startDrawing = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>): void => {
      if (event.button !== 0 && event.pointerType !== 'touch') {
        return;
      }

      const canvas = canvasRef.current;
      const point = getCanvasPoint(event);

      if (!canvas || !point) {
        return;
      }

      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      configureContext(context);

      canvas.setPointerCapture?.(event.pointerId);

      context.beginPath();
      context.moveTo(point.x, point.y);

      setIsDrawing(true);
    },
    [configureContext, getCanvasPoint],
  );

  const draw = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>): void => {
      if (!isDrawing) {
        return;
      }

      const context = canvasRef.current?.getContext('2d');
      const point = getCanvasPoint(event);

      if (!context || !point) {
        return;
      }

      configureContext(context);

      context.lineTo(point.x, point.y);
      context.stroke();
    },
    [configureContext, getCanvasPoint, isDrawing],
  );

  const stopDrawing = useCallback((): void => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      context?.closePath();
    }

    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback((): void => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    setIsDrawing(false);
  }, []);

  return {
    canvasRef,
    isDrawing,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  };
};


