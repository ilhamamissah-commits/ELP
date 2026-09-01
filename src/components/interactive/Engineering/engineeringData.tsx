import React from 'react';

// --- INTERFACES ---
export interface LegoChallenge {
  id: number;
  title: string;
  color1: string;
  color2: string;
  color3: string;
  levels: number; // Amount of layers
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PuzzleChallenge {
  id: number;
  title: string;
  emoji: string;
  gridSize: number; // e.g., 3x3, 4x4
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// --- 50 LEGO BUILD CHALLENGES (Progressive) ---
export const LEGO_CHALLENGES: LegoChallenge[] = [
  // 10 Easy (2-3 layers)
  { id: 1, title: 'Single Block', color1: '#ef4444', color2: '#ef4444', color3: '#ef4444', levels: 1, difficulty: 'Easy' },
  { id: 2, title: 'Two Stack', color1: '#3b82f6', color2: '#3b82f6', color3: '#3b82f6', levels: 2, difficulty: 'Easy' },
  { id: 3, title: 'Red Tower', color1: '#ef4444', color2: '#ef4444', color3: '#ef4444', levels: 3, difficulty: 'Easy' },
  { id: 4, title: 'Blue Tower', color1: '#3b82f6', color2: '#3b82f6', color3: '#3b82f6', levels: 3, difficulty: 'Easy' },
  { id: 5, title: 'Green Tower', color1: '#22c55e', color2: '#22c55e', color3: '#22c55e', levels: 3, difficulty: 'Easy' },
  { id: 6, title: 'Yellow Tower', color1: '#f59e0b', color2: '#f59e0b', color3: '#f59e0b', levels: 3, difficulty: 'Easy' },
  { id: 7, title: 'Red & Blue', color1: '#ef4444', color2: '#3b82f6', color3: '#ef4444', levels: 2, difficulty: 'Easy' },
  { id: 8, title: 'Blue & Red', color1: '#3b82f6', color2: '#ef4444', color3: '#3b82f6', levels: 2, difficulty: 'Easy' },
  { id: 9, title: 'Green & Yellow', color1: '#22c55e', color2: '#f59e0b', color3: '#22c55e', levels: 2, difficulty: 'Easy' },
  { id: 10, title: 'Tri-Color', color1: '#ef4444', color2: '#3b82f6', color3: '#22c55e', levels: 3, difficulty: 'Easy' },

  // 20 Medium (4-6 layers)
  { id: 11, title: 'Blue Pyramid', color1: '#3b82f6', color2: '#60a5fa', color3: '#3b82f6', levels: 4, difficulty: 'Medium' },
  { id: 12, title: 'Red Pyramid', color1: '#ef4444', color2: '#f87171', color3: '#ef4444', levels: 4, difficulty: 'Medium' },
  { id: 13, title: 'Green Pyramid', color1: '#22c55e', color2: '#4ade80', color3: '#22c55e', levels: 4, difficulty: 'Medium' },
  { id: 14, title: 'Mixed Tower', color1: '#ef4444', color2: '#3b82f6', color3: '#22c55e', levels: 4, difficulty: 'Medium' },
  { id: 15, title: 'Yellow & Red', color1: '#f59e0b', color2: '#ef4444', color3: '#f59e0b', levels: 4, difficulty: 'Medium' },
  { id: 16, title: 'Purple Tower', color1: '#a855f7', color2: '#a855f7', color3: '#a855f7', levels: 5, difficulty: 'Medium' },
  { id: 17, title: 'Blue & Green', color1: '#3b82f6', color2: '#22c55e', color3: '#3b82f6', levels: 5, difficulty: 'Medium' },
  { id: 18, title: 'Rainbow', color1: '#ef4444', color2: '#f59e0b', color3: '#22c55e', levels: 5, difficulty: 'Medium' },
  { id: 19, title: 'Tall Blue', color1: '#3b82f6', color2: '#3b82f6', color3: '#3b82f6', levels: 6, difficulty: 'Medium' },
  { id: 20, title: 'Tall Red', color1: '#ef4444', color2: '#ef4444', color3: '#ef4444', levels: 6, difficulty: 'Medium' },
  { id: 21, title: 'Tall Green', color1: '#22c55e', color2: '#22c55e', color3: '#22c55e', levels: 6, difficulty: 'Medium' },
  { id: 22, title: 'Alternating', color1: '#ef4444', color2: '#3b82f6', color3: '#22c55e', levels: 6, difficulty: 'Medium' },
  { id: 23, title: 'Blue Base', color1: '#3b82f6', color2: '#60a5fa', color3: '#93c5fd', levels: 5, difficulty: 'Medium' },
  { id: 24, title: 'Red Base', color1: '#ef4444', color2: '#f87171', color3: '#fca5a5', levels: 5, difficulty: 'Medium' },
  { id: 25, title: 'Mixed 5', color1: '#ef4444', color2: '#3b82f6', color3: '#22c55e', levels: 5, difficulty: 'Medium' },
  { id: 26, title: 'Purple Stack', color1: '#a855f7', color2: '#c084fc', color3: '#a855f7', levels: 5, difficulty: 'Medium' },
  { id: 27, title: 'Yellow Tall', color1: '#f59e0b', color2: '#fbbf24', color3: '#f59e0b', levels: 6, difficulty: 'Medium' },
  { id: 28, title: 'Orange Tower', color1: '#f97316', color2: '#fb923c', color3: '#f97316', levels: 6, difficulty: 'Medium' },
  { id: 29, title: 'Blue & Yellow', color1: '#3b82f6', color2: '#f59e0b', color3: '#3b82f6', levels: 6, difficulty: 'Medium' },
  { id: 30, title: 'Red & Green', color1: '#ef4444', color2: '#22c55e', color3: '#ef4444', levels: 6, difficulty: 'Medium' },

  // 20 Hard (7-8 layers)
  { id: 31, title: 'Tall Rainbow', color1: '#ef4444', color2: '#f59e0b', color3: '#22c55e', levels: 7, difficulty: 'Hard' },
  { id: 32, title: 'Tall Mixed', color1: '#3b82f6', color2: '#a855f7', color3: '#22c55e', levels: 7, difficulty: 'Hard' },
  { id: 33, title: 'Red & Blue Tall', color1: '#ef4444', color2: '#3b82f6', color3: '#ef4444', levels: 7, difficulty: 'Hard' },
  { id: 34, title: 'Blue & Green Tall', color1: '#3b82f6', color2: '#22c55e', color3: '#3b82f6', levels: 7, difficulty: 'Hard' },
  { id: 35, title: 'Green Tall', color1: '#22c55e', color2: '#22c55e', color3: '#22c55e', levels: 8, difficulty: 'Hard' },
  { id: 36, title: 'Blue Tall', color1: '#3b82f6', color2: '#3b82f6', color3: '#3b82f6', levels: 8, difficulty: 'Hard' },
  { id: 37, title: 'Red Tall', color1: '#ef4444', color2: '#ef4444', color3: '#ef4444', levels: 8, difficulty: 'Hard' },
  { id: 38, title: 'Purple Tall', color1: '#a855f7', color2: '#a855f7', color3: '#a855f7', levels: 8, difficulty: 'Hard' },
  { id: 39, title: 'Orange Tall', color1: '#f97316', color2: '#f97316', color3: '#f97316', levels: 8, difficulty: 'Hard' },
  { id: 40, title: 'Yellow Tall', color1: '#f59e0b', color2: '#f59e0b', color3: '#f59e0b', levels: 8, difficulty: 'Hard' },
  { id: 41, title: 'Challenging Mix 1', color1: '#ef4444', color2: '#3b82f6', color3: '#22c55e', levels: 8, difficulty: 'Hard' },
  { id: 42, title: 'Challenging Mix 2', color1: '#3b82f6', color2: '#a855f7', color3: '#f59e0b', levels: 8, difficulty: 'Hard' },
  { id: 43, title: 'Challenging Mix 3', color1: '#22c55e', color2: '#f59e0b', color3: '#f97316', levels: 8, difficulty: 'Hard' },
  { id: 44, title: 'Challenging Mix 4', color1: '#a855f7', color2: '#ef4444', color3: '#3b82f6', levels: 8, difficulty: 'Hard' },
  { id: 45, title: 'Challenging Mix 5', color1: '#f97316', color2: '#22c55e', color3: '#a855f7', levels: 8, difficulty: 'Hard' },
  { id: 46, title: 'Challenging Mix 6', color1: '#f59e0b', color2: '#3b82f6', color3: '#ef4444', levels: 8, difficulty: 'Hard' },
  { id: 47, title: 'Challenging Mix 7', color1: '#3b82f6', color2: '#f97316', color3: '#22c55e', levels: 8, difficulty: 'Hard' },
  { id: 48, title: 'Challenging Mix 8', color1: '#ef4444', color2: '#a855f7', color3: '#f59e0b', levels: 8, difficulty: 'Hard' },
  { id: 49, title: 'Challenging Mix 9', color1: '#22c55e', color2: '#3b82f6', color3: '#ef4444', levels: 8, difficulty: 'Hard' },
  { id: 50, title: 'The Mega Tower', color1: '#ef4444', color2: '#3b82f6', color3: '#22c55e', levels: 8, difficulty: 'Hard' },
];

// --- 50 PUZZLE CHALLENGES (Grid Sizes change) ---
export const PUZZLE_CHALLENGES: PuzzleChallenge[] = [
  { id: 1, title: 'Red Block', emoji: '🟥', gridSize: 2, difficulty: 'Easy' },
  { id: 2, title: 'Blue Block', emoji: '🟦', gridSize: 2, difficulty: 'Easy' },
  { id: 3, title: 'Green Block', emoji: '🟩', gridSize: 2, difficulty: 'Easy' },
  { id: 4, title: 'Yellow Block', emoji: '🟨', gridSize: 2, difficulty: 'Easy' },
  { id: 5, title: 'Smiley Face', emoji: '😊', gridSize: 3, difficulty: 'Easy' },
  { id: 6, title: 'Sun', emoji: '☀️', gridSize: 3, difficulty: 'Easy' },
  { id: 7, title: 'Heart', emoji: '❤️', gridSize: 3, difficulty: 'Easy' },
  { id: 8, title: 'Star', emoji: '⭐', gridSize: 3, difficulty: 'Easy' },
  { id: 9, title: 'Happy Cat', emoji: '🐱', gridSize: 3, difficulty: 'Easy' },
  { id: 10, title: 'Dog', emoji: '🐶', gridSize: 3, difficulty: 'Easy' },

  { id: 11, title: 'Apple', emoji: '🍎', gridSize: 3, difficulty: 'Medium' },
  { id: 12, title: 'Banana', emoji: '🍌', gridSize: 3, difficulty: 'Medium' },
  { id: 13, title: 'Grapes', emoji: '🍇', gridSize: 3, difficulty: 'Medium' },
  { id: 14, title: 'Train', emoji: '🚂', gridSize: 4, difficulty: 'Medium' },
  { id: 15, title: 'Airplane', emoji: '✈️', gridSize: 4, difficulty: 'Medium' },
  { id: 16, title: 'Car', emoji: '🚗', gridSize: 4, difficulty: 'Medium' },
  { id: 17, title: 'Tree', emoji: '🌳', gridSize: 4, difficulty: 'Medium' },
  { id: 18, title: 'Flower', emoji: '🌸', gridSize: 4, difficulty: 'Medium' },
  { id: 19, title: 'Frog', emoji: '🐸', gridSize: 4, difficulty: 'Medium' },
  { id: 20, title: 'Butterfly', emoji: '🦋', gridSize: 4, difficulty: 'Medium' },
  { id: 21, title: 'Lion', emoji: '🦁', gridSize: 4, difficulty: 'Medium' },
  { id: 22, title: 'Elephant', emoji: '🐘', gridSize: 4, difficulty: 'Medium' },
  { id: 23, title: 'Rocket', emoji: '🚀', gridSize: 4, difficulty: 'Medium' },
  { id: 24, title: 'Dolphin', emoji: '🐬', gridSize: 4, difficulty: 'Medium' },
  { id: 25, title: 'Pizza', emoji: '🍕', gridSize: 4, difficulty: 'Medium' },
  { id: 26, title: 'Ice Cream', emoji: '🍦', gridSize: 4, difficulty: 'Medium' },
  { id: 27, title: 'Panda', emoji: '🐼', gridSize: 4, difficulty: 'Medium' },
  { id: 28, title: 'Robot', emoji: '🤖', gridSize: 4, difficulty: 'Medium' },
  { id: 29, title: 'Dinosaur', emoji: '🦕', gridSize: 4, difficulty: 'Medium' },
  { id: 30, title: 'Castle', emoji: '🏰', gridSize: 4, difficulty: 'Medium' },

  { id: 31, title: 'Unicorn', emoji: '🦄', gridSize: 5, difficulty: 'Hard' },
  { id: 32, title: 'Dragon', emoji: '🐉', gridSize: 5, difficulty: 'Hard' },
  { id: 33, title: 'Rainbow', emoji: '🌈', gridSize: 5, difficulty: 'Hard' },
  { id: 34, title: 'Earth', emoji: '🌍', gridSize: 5, difficulty: 'Hard' },
  { id: 35, title: 'Planet', emoji: '🪐', gridSize: 5, difficulty: 'Hard' },
  { id: 36, title: 'Astronaut', emoji: '👨‍🚀', gridSize: 5, difficulty: 'Hard' },
  { id: 37, title: 'Tiger', emoji: '🐯', gridSize: 5, difficulty: 'Hard' },
  { id: 38, title: 'Whale', emoji: '🐋', gridSize: 5, difficulty: 'Hard' },
  { id: 39, title: 'Dolphin 2', emoji: '🐬', gridSize: 5, difficulty: 'Hard' },
  { id: 40, title: 'Shark', emoji: '🦈', gridSize: 5, difficulty: 'Hard' },
  { id: 41, title: 'Spider', emoji: '🕷️', gridSize: 5, difficulty: 'Hard' },
  { id: 42, title: 'Snake', emoji: '🐍', gridSize: 5, difficulty: 'Hard' },
  { id: 43, title: 'Eagle', emoji: '🦅', gridSize: 5, difficulty: 'Hard' },
  { id: 44, title: 'Penguin', emoji: '🐧', gridSize: 5, difficulty: 'Hard' },
  { id: 45, title: 'Owl', emoji: '🦉', gridSize: 5, difficulty: 'Hard' },
  { id: 46, title: 'Spaceship', emoji: '🛸', gridSize: 5, difficulty: 'Hard' },
  { id: 47, title: 'Volcano', emoji: '🌋', gridSize: 5, difficulty: 'Hard' },
  { id: 48, title: 'Waterfall', emoji: '🏞️', gridSize: 5, difficulty: 'Hard' },
  { id: 49, title: 'City', emoji: '🌆', gridSize: 5, difficulty: 'Hard' },
  { id: 50, title: 'World Map', emoji: '🗺️', gridSize: 5, difficulty: 'Hard' },
];