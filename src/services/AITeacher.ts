// --- 1. AI ENCOURAGEMENT SYSTEM ---
const AI_PRAISE = [
  "Brilliant!", "You're a star!", "I knew you could do it!", 
  "Wow, so clever!", "Amazing work!", "You're on fire today!"
];

const AI_ENCOURAGE = [
  "Oops, try again.", "I believe in you!", "Let's read it once more.",
  "Almost! Try that one again.", "Don't worry, everyone makes mistakes!",
  "That was a good try! Let's look at it together."
];

export const getAIFeedback = (isCorrect: boolean): string => {
  const list = isCorrect ? AI_PRAISE : AI_ENCOURAGE;
  return list[Math.floor(Math.random() * list.length)];
};

// --- 2. EMOTION STATE (Global Variable to store child's mood) ---
// In a real app, this would be saved to a database, but for now we keep it in memory.
let currentEmotion: 'happy' | 'tired' | 'frustrated' | 'neutral' = 'neutral';

export const setEmotion = (emotion: 'happy' | 'tired' | 'frustrated' | 'neutral') => {
  currentEmotion = emotion;
};

export const getEmotion = () => currentEmotion;

// --- 3. LESSON ADJUSTMENTS BASED ON MOOD ---
export const getLessonModifiers = () => {
  switch(currentEmotion) {
    case 'tired':
      return { questionCount: 3, theme: 'calm-mode' }; // Fewer questions, calm UI
    case 'happy':
      return { questionCount: 10, theme: 'bright-mode', bonusSticker: true }; // Standard, but extra sticker reward
    case 'frustrated':
      return { questionCount: 5, theme: 'gentle-mode', autoHint: true }; // Medium questions, auto-hints
    default:
      return { questionCount: 7, theme: 'default' }; // Standard lesson length
  }
};