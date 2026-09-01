// GLOBAL ARABIC SPEECH ENGINE
let arabicVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

// Load Arabic voices
const loadVoices = () => {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  arabicVoice = voices.find(v => v.lang.includes('ar') || v.name.includes('Arabic')) || null;
  voicesLoaded = true;
};

// Initialize voices when they load
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const speakArabic = (text: string, rate: number = 0.8) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel any previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA'; // Set to Saudi Arabic (Clear, standard pronunciation)
  utterance.rate = rate; // Slow down for kids
  utterance.pitch = 1.1; // Friendly, engaging pitch
  
  // Try to use the specific Arabic voice
  if (!voicesLoaded) loadVoices();
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  window.speechSynthesis.speak(utterance);
};