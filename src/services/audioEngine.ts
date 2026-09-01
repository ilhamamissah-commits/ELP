// A bulletproof audio service that bypasses browser restrictions
let audioUnlocked = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// 1. Unlock audio on the very first user tap
export const unlockAudio = () => {
  if (!audioUnlocked && 'speechSynthesis' in window) {
    const silent = new SpeechSynthesisUtterance(" ");
    silent.volume = 0;
    silent.rate = 10;
    window.speechSynthesis.speak(silent);
    audioUnlocked = true;
  }
};

// 2. The reliable speak function
export const speakWord = (text: string, rate: number = 0.8) => {
  if (!('speechSynthesis' in window)) {
    console.error("Speech Synthesis not supported");
    return;
  }

  // Cancel previous speech safely
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    // Do nothing
  }

  // Create a new utterance and KEEP IT IN A VARIABLE
  currentUtterance = new SpeechSynthesisUtterance(text);

  // Set friendly parameters for kids
  currentUtterance.rate = rate;
  currentUtterance.pitch = 1.2;
  currentUtterance.volume = 1;

  // Try to get a specific English voice for clarity
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(voice => voice.lang.includes('en-US') && !voice.name.includes('Google UK'));
  if (englishVoice) {
    currentUtterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(currentUtterance);
};

// 3. Function to speak a series of words
export const speakSequence = (words: string[]) => {
  words.forEach((word, index) => {
    setTimeout(() => speakWord(word), index * 1200);
  });
};