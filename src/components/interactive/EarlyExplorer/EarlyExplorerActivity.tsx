import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Volume2 } from 'lucide-react';
import { EARLY_EXPLORER_ACTIVITIES } from '../../../data/earlyExplorerActivities';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useAudioPrompt } from '../../../hooks/useAudioPrompt';

interface Props { lessonId?: string; onComplete?: (score: number) => void; }

/** Shared low-reading, touch-first shell for Early Explorer curriculum activities. */
export const EarlyExplorerActivity: React.FC<Props> = ({ lessonId = 'early-sensorial-colours', onComplete }) => {
  const { speak } = useAudioPrompt();
  const definition = EARLY_EXPLORER_ACTIVITIES[lessonId] || EARLY_EXPLORER_ACTIVITIES['early-sensorial-colours'];
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'try' | 'done'>('idle');
  const steps = definition.steps || [];

  useEffect(() => {
    setStep(0); setComplete(false); setFeedback('idle');
    const timer = window.setTimeout(() => speak(definition.spokenInstruction, { rate: 0.78, pitch: 1.12 }), 350);
    return () => window.clearTimeout(timer);
  }, [definition.lessonId]);

  const finish = () => { setComplete(true); setFeedback('done'); playSoundFeedback('correct'); speak('Wonderful work!', { userInitiated: true }); onComplete?.(100); };
  const select = (id: string) => {
    if (complete) return;
    if (definition.correctOptionIds.includes(id)) finish();
    else { setFeedback('try'); playSoundFeedback('try-again'); speak('Let us try a different picture.', { userInitiated: true }); }
  };
  const next = () => {
    if (complete) return;
    if (step === steps.length - 1) finish();
    else { playSoundFeedback('move'); setStep((value) => value + 1); speak(steps[step + 1], { userInitiated: true }); }
  };
  const reset = () => { setStep(0); setComplete(false); setFeedback('idle'); speak(definition.spokenInstruction, { userInitiated: true }); };

  return <section className="mx-auto w-full max-w-xl rounded-3xl border border-app-border bg-app-card p-4 shadow-xl sm:p-6" style={{ touchAction: 'manipulation' }}>
    <div className="mb-4 flex items-center justify-between"><button onClick={() => speak(definition.spokenInstruction, { rate: 0.78, pitch: 1.12, userInitiated: true })} className="min-h-12 rounded-2xl bg-indigo-600 px-4 text-sm font-bold text-white active:scale-95"><Volume2 className="mr-2 inline h-5 w-5" />Listen</button><button onClick={reset} className="min-h-12 rounded-2xl bg-gray-800 px-4 text-gray-200" aria-label="Start again"><RotateCcw className="h-5 w-5" /></button></div>
    <div className="mb-5 rounded-3xl bg-gradient-to-br from-sky-500/15 to-emerald-500/10 p-5 text-center"><motion.div key={complete ? 'done' : `${definition.lessonId}-${step}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><div className="text-7xl leading-none">{complete ? '🌟' : definition.promptIcon}</div><p className="mt-3 text-lg font-bold text-white">{complete ? 'Well done!' : definition.kind === 'sequence' ? steps[step] : definition.prompt}</p></motion.div></div>
    {definition.kind === 'sequence' ? <button onClick={next} disabled={complete} className="min-h-24 w-full rounded-3xl bg-emerald-600 px-5 text-lg font-bold text-white shadow-lg active:scale-[.98] disabled:opacity-70">{complete ? 'All done!' : <><span className="mr-2 text-3xl">👆</span>Tap when you are ready</>}</button> : <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{definition.options.map((option) => <button key={option.id} onClick={() => select(option.id)} disabled={complete} className="min-h-28 rounded-3xl border-2 border-white/10 bg-gray-800 p-3 shadow-md active:scale-95 disabled:opacity-70"><span className="block text-5xl">{option.icon}</span><span className="mt-2 block text-sm font-bold text-white">{option.label}</span></button>)}</div>}
    <AnimatePresence>{feedback === 'try' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm text-sky-200">Try another picture.</motion.p>}{feedback === 'done' && <motion.p initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 text-center text-lg font-bold text-amber-200">You did it!</motion.p>}</AnimatePresence>
  </section>;
};
