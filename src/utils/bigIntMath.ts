/**
 * BigInt Math Utilities
 * Ensures floating-point precision errors don't happen in the Abacus 
 * when dealing with large numbers (e.g., 9999 + 1).
 */
export const bigIntAdd = (a: number, b: number): number => {
  return Number(BigInt(a) + BigInt(b));
};

export const bigIntSubtract = (a: number, b: number): number => {
  return Number(BigInt(a) - BigInt(b));
};

export const bigIntMultiply = (a: number, b: number): number => {
  return Number(BigInt(a) * BigInt(b));
};

export const bigIntDivide = (a: number, b: number): number => {
  if (b === 0) return 0;
  return Number(BigInt(a) / BigInt(b));
};