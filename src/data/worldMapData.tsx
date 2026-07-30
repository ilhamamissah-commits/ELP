import { BookOpen, Calculator, FlaskConical, Sigma, Layers, Leaf, Paintbrush, Blocks, Globe } from 'lucide-react';

export interface WorldBuilding {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number; 
  y: number; 
  color: string;
}

export const WORLD_BUILDINGS: WorldBuilding[] = [
  { id: 'english', label: 'School House', icon: <BookOpen size={32} />, x: 20, y: 20, color: 'bg-blue-500' },
  { id: 'maths', label: 'Math Castle', icon: <Calculator size={32} />, x: 75, y: 15, color: 'bg-yellow-500' },
  { id: 'science', label: 'Science Lab', icon: <FlaskConical size={32} />, x: 50, y: 50, color: 'bg-red-500' },
  { id: 'abacus', label: 'Number Tower', icon: <Sigma size={32} />, x: 85, y: 75, color: 'bg-orange-500' },
  { id: 'vocabulary', label: 'Library', icon: <Layers size={32} />, x: 10, y: 75, color: 'bg-purple-500' },
  { id: 'practical-life', label: 'The Garden', icon: <Leaf size={32} />, x: 35, y: 85, color: 'bg-green-500' },
  { id: 'art', label: 'Art Studio', icon: <Paintbrush size={32} />, x: 65, y: 35, color: 'bg-pink-500' },
  
  // --- NEW BUILDINGS ---
  { id: 'sensorial', label: 'Sensorial Room', icon: <Blocks size={32} />, x: 50, y: 15, color: 'bg-indigo-500' },
  { id: 'geography', label: 'Globe Corner', icon: <Globe size={32} />, x: 20, y: 55, color: 'bg-cyan-600' },
];