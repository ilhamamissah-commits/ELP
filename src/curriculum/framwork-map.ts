
export const FRAMEWORK_MAP: Record<string, string> = {
  'eng-sentences': 'Sentence Construction',
  'math-beads': 'Place Value (Golden Beads)',
  'sci-lab': 'Science Experiments',
  'math-abacus': 'Soroban Mental Math',
  'eng-phonics': 'Phonics Sound Lottery'
};

// Helper function to get a friendly name for an ID
export function getFrameworkName(id: string): string {
  return FRAMEWORK_MAP[id] || 'Unknown Activity';
}