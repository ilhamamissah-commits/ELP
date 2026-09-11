import { useCallback } from 'react';
import { useSettingsStore, VoiceAccent } from '../store/useSettingsStore';

interface ReadAloudOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Pick the best voice based on the requested accent.
 */
const pickVoice = (accent: VoiceAccent): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Auto: prefer device language, then US, then GB, then any English
  if (accent === 'auto') {
    const browserLang = navigator.language;
    const exact = voices.find((v) => v.lang === browserLang);
    if (exact) return exact;

    const us = voices.find((v) => v.lang === 'en-US');
    if (us) return us;

    const gb = voices.find((v) => v.lang === 'en-GB');
    if (gb) return gb;

    return voices.find((v) => v.lang.startsWith('en')) || null;
  }

  // Specific accent
  const exact = voices.find((v) => v.lang === accent);
  if (exact) return exact;

  // Fallback chains
  const chains: Record<string, string[]> = {
    'en-US': ['en-US', 'en-GB', 'en'],
    'en-GB': ['en-GB', 'en-US', 'en'],
    'en-AU': ['en-AU', 'en-GB', 'en-US', 'en'],
    
  };

  for (const code of chains[accent] || ['en-US', 'en']) {
    const match = code.length === 2
      ? voices.find((v) => v.lang.startsWith(code))
      : voices.find((v) => v.lang === code);
    if (match) return match;
  }

  return null;
};

export const useReadAloud = () => {
  const accent = useSettingsStore((s) => s.voiceAccent);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const speak = useCallback((text: string, options: ReadAloudOptions = {}) => {
    if (!soundEnabled) return; // Respect the sound setting
    if (!('speechSynthesis' in window)) return;
    if (!text || text.trim().length === 0) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 1.05;
    utterance.lang = options.lang ?? (accent === 'auto' ? navigator.language : accent);
    utterance.volume = 1.0;

    const voice = pickVoice((options.lang as VoiceAccent) ?? accent);
    if (voice) utterance.voice = voice;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;

    window.speechSynthesis.speak(utterance);
  }, [accent, soundEnabled]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stopSpeaking };
};

/**
 * Triggers voice list loading in browsers that need it.
 */
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}