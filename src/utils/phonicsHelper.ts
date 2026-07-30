/**
 * Phonics Helper
 * Generates pure phonetic sounds for the SpeechSynthesis API.
 * Removes the 'schwa' sound (the 'uh' you accidentally get with normal TTS).
 */
export const getPhoneticUtterance = (letter: string): SpeechSynthesisUtterance | null => {
  if (!('speechSynthesis' in window)) return null;

  const utterance = new SpeechSynthesisUtterance();
  
  // Map letters to IPA-based phonetic approximations
  const phonemeMap: Record<string, string> = {
    'a': 'æ', // Short a (apple)
    'e': 'ɛ', // Short e (egg)
    'i': 'ɪ', // Short i (igloo)
    'o': 'ɒ', // Short o (octopus)
    'u': 'ʌ', // Short u (umbrella)
    's': 's', // Sss
    't': 't', // Tuh (hard stop)
    'p': 'p', // Puh (hard stop)
    'n': 'n', // Nnn
  };

  utterance.text = phonemeMap[letter.toLowerCase()] || letter;
  utterance.rate = 0.5; // Very slow
  utterance.pitch = 1.3; // High pitch for child attention
  
  return utterance;
};