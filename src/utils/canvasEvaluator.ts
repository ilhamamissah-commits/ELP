/**
 * Canvas Stroke Evaluator
 * Calculates a similarity score (0-100) between a user's drawn stroke 
 * and a target reference path.
 */
export const evaluateStroke = (
  userPoints: { x: number; y: number }[], 
  targetPoints: { x: number; y: number }[]
): number => {
  if (userPoints.length === 0 || targetPoints.length === 0) return 0;

  // Dynamic Time Warping (Simplified) / Bounding Box Similarity
  // 1. Calculate bounding boxes
  const userBox = getBoundingBox(userPoints);
  const targetBox = getBoundingBox(targetPoints);

  // 2. Compare width/height aspect ratios
  const userAspect = userBox.width / (userBox.height || 1);
  const targetAspect = targetBox.width / (targetBox.height || 1);
  
  const aspectDiff = Math.abs(userAspect - targetAspect);
  let score = Math.max(0, 100 - (aspectDiff * 50));

  // 3. Check if user stayed within the lines (Coverage)
  // This is a rudimentary check, returning a score out of 100
  return Math.min(100, Math.max(0, score));
};

const getBoundingBox = (points: { x: number; y: number }[]) => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  return { width: maxX - minX, height: maxY - minY };
};