import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, Trophy, Volume2, XCircle } from 'lucide-react';
import { ABACUS_LEVELS, AbacusLevelId, AbacusMode, createPrompt } from '../../../abacus/academy';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useAbacusAcademyStore } from '../../../store/useAbacusAcademyStore';

interface RodState { upper: 0 | 1; lower: 0 | 1 | 2 | 3 | 4; }
interface AbacusWidgetProps { onComplete?: (score: number) => void; }

const blankSoroban = (count: number): RodState[] => Array.from({ length: count }, () => ({ upper: 0, lower: 0 }));
const valueOf = (rods: RodState[]) => rods.reduce((total, rod, index) => total + (rod.upper * 5 + rod.lower) * 10 ** (rods.length - index - 1), 0);

interface SorobanProps {
  rods: RodState[];
  onChange: (rods: RodState[]) => void;
  disabled?: boolean;
  soundOn: boolean;
}

/** A tactile Soroban: every answer is built by moving heaven and earth beads. */
function Soroban({ rods, onChange, disabled, soundOn }: SorobanProps) {
  const updateRod = (index: number, patch: Partial<RodState>) => {
    if (disabled) return;
    if (soundOn) playSoundFeedback('move');
    onChange(rods.map((rod, rodIndex) => rodIndex === index ? { ...rod, ...patch } : rod));
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-x-auto rounded-3xl border border-amber-200/20 bg-gradient-to-b from-[#4a2512] to-[#1b0d08] p-3 shadow-2xl sm:p-5" style={{ touchAction: 'manipulation' }}>
      <div className="min-w-[320px] rounded-2xl border border-[#c8863c]/40 bg-[#2c160d] p-3 shadow-inner sm:p-5">
        <div className="relative flex min-h-[300px] justify-center gap-2 px-2 sm:gap-4">
          <div className="absolute left-0 right-0 top-[31%] z-20 h-4 rounded bg-gradient-to-b from-[#e6b45e] via-[#8d4c1b] to-[#4f240b] shadow-[0_4px_8px_rgba(0,0,0,.65)]" />
          {rods.map((rod, index) => (
            <div key={index} className="relative z-10 h-[285px] w-12 shrink-0 sm:w-14">
              <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded bg-[#24130c] shadow-[inset_0_0_2px_rgba(255,255,255,.35)]" />
              <motion.button
                type="button"
                aria-label={`Move five bead on rod ${index + 1}`}
                onPointerDown={(event) => { event.preventDefault(); updateRod(index, { upper: rod.upper ? 0 : 1 }); }}
                animate={{ y: rod.upper ? 48 : 0, scale: rod.upper ? 1.04 : 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                className={`absolute left-1/2 top-2 z-30 h-11 w-11 -translate-x-1/2 rounded-full border-2 shadow-lg sm:h-12 sm:w-12 ${rod.upper ? 'border-amber-100 bg-gradient-to-br from-[#ffd36c] to-[#b45b16]' : 'border-amber-900 bg-gradient-to-br from-[#a84b11] to-[#5f240d]'} ${disabled ? 'opacity-70' : 'active:scale-95'}`}
              />
              <motion.div animate={{ y: rod.lower ? -rod.lower * 9 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }} className="absolute left-0 right-0 top-[126px] z-30 flex flex-col gap-2">
                {[0, 1, 2, 3].map((bead) => {
                  const active = rod.lower > bead;
                  return (
                    <button
                      key={bead}
                      type="button"
                      aria-label={`Set ${bead + 1} earth beads on rod ${index + 1}`}
                      onPointerDown={(event) => { event.preventDefault(); updateRod(index, { lower: rod.lower === bead + 1 ? 0 : (bead + 1) as RodState['lower'] }); }}
                      className={`mx-auto h-10 w-10 rounded-full border-2 shadow-lg transition-colors sm:h-11 sm:w-11 ${active ? 'border-amber-100 bg-gradient-to-br from-[#ffd36c] to-[#b45b16]' : 'border-amber-900 bg-gradient-to-br from-[#a84b11] to-[#5f240d]'} ${disabled ? 'opacity-70' : 'active:scale-95'}`}
                    />
                  );
                })}
              </motion.div>
              <span className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-bold text-amber-200/70">{10 ** (rods.length - index - 1) === 1 ? 'Ones' : `${10 ** (rods.length - index - 1)}s`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const AbacusWidget: React.FC<AbacusWidgetProps> = ({ onComplete: onComplete }) => {
  const [mode, setMode] = useState<AbacusMode>('beginner');
  const [levelId, setLevelId] = useState<AbacusLevelId>('level-1');
  const level = ABACUS_LEVELS.find((candidate) => candidate.id === levelId)!;
  const [rods, setRods] = useState<RodState[]>(() => blankSoroban(level.rodCount));
  const [prompt, setPrompt] = useState(() => createPrompt('level-1', 'beginner'));
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [soundOn, setSoundOn] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [challengeScore, setChallengeScore] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [showMentalPrompt, setShowMentalPrompt] = useState(false);
  const { levels, certificates, recordAttempt } = useAbacusAcademyStore();
  const progress = levels[levelId];
  const currentValue = useMemo(() => valueOf(rods), [rods]);

  const startRound = (nextMode = mode, nextLevelId = levelId) => {
    const nextLevel = ABACUS_LEVELS.find((candidate) => candidate.id === nextLevelId)!;
    setRods(blankSoroban(nextLevel.rodCount));
    const nextPrompt = createPrompt(nextLevelId, nextMode);
    setPrompt(nextPrompt);
    setFeedback('idle');
    const shouldFlash = nextMode === 'mental' || nextLevelId === 'level-6' || Boolean(nextPrompt.flash);
    setShowMentalPrompt(shouldFlash);
    if (shouldFlash) window.setTimeout(() => setShowMentalPrompt(false), 2200);
  };

  useEffect(() => { startRound(mode, levelId); }, [mode, levelId]); // Reset only when mode/level changes.
  useEffect(() => {
    if (mode !== 'challenge' || secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [mode, secondsLeft]);

  const chooseMode = (nextMode: AbacusMode) => {
    setMode(nextMode);
    setSecondsLeft(60);
    setChallengeScore(0);
  };

  const checkAnswer = () => {
    if (feedback === 'correct' || (mode === 'challenge' && secondsLeft === 0)) return;
    const correct = currentValue === prompt.answer;
    recordAttempt(levelId, correct);
    setFeedback(correct ? 'correct' : 'incorrect');
    if (soundOn) playSoundFeedback(correct ? 'correct' : 'try-again');
    if (!correct) return;
    setSessionCorrect((value) => value + 1);
    if (mode === 'challenge') setChallengeScore((value) => value + 1);
    window.setTimeout(() => startRound(), 900);
  };

  const finishSession = () => onComplete?.(Math.min(100, Math.max(60, sessionCorrect * 20)));
  const certificateEarned = certificates.includes(levelId);

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-app-border bg-app-card p-3 shadow-xl sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div><h3 className="text-xl font-bold text-white sm:text-2xl">Abacus Academy</h3><p className="text-xs text-gray-400">Move the beads to build every answer.</p></div>
        <button onClick={() => setSoundOn((enabled) => !enabled)} className="min-h-11 rounded-xl bg-gray-800 px-3 text-sm text-gray-200" aria-label="Toggle sound"><Volume2 className={`inline h-4 w-4 ${soundOn ? 'text-amber-300' : 'text-gray-500'}`} /> Sound</button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(['beginner', 'practice', 'challenge', 'mental'] as AbacusMode[]).map((option) => <button key={option} onClick={() => chooseMode(option)} className={`min-h-12 rounded-xl px-2 text-xs font-bold capitalize transition ${mode === option ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{option === 'mental' ? 'Mental Abacus' : `${option} Mode`}</button>)}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ABACUS_LEVELS.map((candidate) => <button key={candidate.id} onClick={() => setLevelId(candidate.id)} className={`min-h-14 rounded-xl border p-2 text-left ${levelId === candidate.id ? 'border-amber-400 bg-amber-500/10' : 'border-gray-700 bg-gray-900/40'}`}><span className="block text-xs font-bold text-white">{candidate.title}</span><span className="text-[10px] text-gray-400">{levels[candidate.id]?.mastery || 0}% mastery</span></button>)}
      </div>

      <div className="mb-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center">
        {mode === 'challenge' && <p className="mb-1 text-xs font-bold text-amber-300">{secondsLeft}s left · {challengeScore} correct</p>}
        <p className="text-xs text-indigo-200">{level.subtitle}</p>
        <AnimatePresence mode="wait"><motion.p key={`${prompt.prompt}-${showMentalPrompt}`} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mt-1 text-3xl font-bold text-white sm:text-4xl">{showMentalPrompt ? prompt.prompt : mode === 'mental' || levelId === 'level-6' ? 'Build the answer from memory' : prompt.prompt}</motion.p></AnimatePresence>
      </div>

      <Soroban rods={rods} onChange={setRods} disabled={feedback === 'correct'} soundOn={soundOn} />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <div className="rounded-xl bg-gray-900 px-4 py-2 text-center"><span className="block text-[10px] text-gray-400">Your number</span><span className="text-2xl font-bold text-amber-300">{currentValue}</span></div>
        <button onClick={() => { setRods(blankSoroban(level.rodCount)); setFeedback('idle'); }} className="min-h-12 rounded-xl bg-gray-800 px-4 text-gray-200"><RotateCcw className="inline h-4 w-4" /> Clear</button>
        <button onClick={checkAnswer} className="min-h-12 rounded-xl bg-green-600 px-6 font-bold text-white hover:bg-green-500">Check beads</button>
      </div>
      <div className="mt-3 min-h-7 text-center"><AnimatePresence>{feedback === 'correct' && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 text-sm font-bold text-green-300"><CheckCircle2 className="h-5 w-5" /> Brilliant bead work!</motion.p>}{feedback === 'incorrect' && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 text-sm font-bold text-red-300"><XCircle className="h-5 w-5" /> Check each rod and try again.</motion.p>}</AnimatePresence></div>

      <div className="mt-4 grid gap-3 rounded-2xl bg-gray-900/60 p-4 text-sm sm:grid-cols-3"><div><span className="block text-xs text-gray-400">Mastery</span><strong className="text-white">{progress?.mastery || 0}%</strong></div><div><span className="block text-xs text-gray-400">Best streak</span><strong className="text-white">{progress?.bestStreak || 0}</strong></div><div><span className="block text-xs text-gray-400">Certificate</span><strong className={certificateEarned ? 'text-amber-300' : 'text-gray-400'}>{certificateEarned ? 'Earned!' : `${progress?.correct || 0}/${level.masteryTarget} correct`}</strong></div></div>
      {sessionCorrect > 0 && <button onClick={finishSession} className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-amber-400/60 px-4 text-sm font-bold text-amber-200"><Trophy className="h-4 w-4" /> Finish Academy session</button>}
    </div>
  );
};
