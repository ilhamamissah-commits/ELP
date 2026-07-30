import { useCallback } from 'react';

export const useAudioPrompt = () => {
  const speak = useCallback((text: string, rate: number = 0.7, pitch: number = 1.2) => {
    // Cancel any currently speaking text to prevent overlapping audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate; // Slower for kids
      utterance.pitch = pitch; // Higher pitch is friendlier
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
};