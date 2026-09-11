import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type EmpathyStage = 'notice' | 'understand' | 'choose' | 'reflect' | 'complete';

type EmpathyResponse = {
  id: string;
  text: string;
  helpful: boolean;
  explanation: string;
};

type EmpathyScenario = {
  id: number;
  title: string;
  scenario: string;
  feeling: string;
  feelingEmoji: string;
  perspective: string;
  responses: EmpathyResponse[];
  reflection: string;
};

const SCENARIOS: EmpathyScenario[] = [
  {
    id: 1,
    title: 'The Dropped Ice Cream',
    scenario:
      'Your friend is crying because they dropped their ice cream on the ground.',
    feeling: 'Sad and disappointed',
    feelingEmoji: '😢',
    perspective:
      'They may feel upset because something they were enjoying was suddenly gone.',
    responses: [
      {
        id: 'laugh',
        text: 'Laugh at them.',
        helpful: false,
        explanation:
          'Laughing may make your friend feel even more embarrassed or upset.',
      },
      {
        id: 'share',
        text: 'Ask if they would like to share some of yours.',
        helpful: true,
        explanation:
          'Sharing is one kind way to show that you care about how your friend feels.',
      },
      {
        id: 'stop',
        text: 'Tell them to stop crying.',
        helpful: false,
        explanation:
          'It is okay for someone to feel sad. We can comfort them instead of telling them how to feel.',
      },
    ],
    reflection:
      'Sometimes a small act of kindness can help someone feel less alone.',
  },
  {
    id: 2,
    title: 'A New Student',
    scenario:
      'A new student is sitting alone at lunch and does not seem to know anyone.',
    feeling: 'Lonely or unsure',
    feelingEmoji: '😕',
    perspective:
      'Being somewhere new can feel strange or lonely when you do not know people yet.',
    responses: [
      {
        id: 'ignore',
        text: 'Ignore them.',
        helpful: false,
        explanation:
          'Ignoring someone who may feel alone does not help them feel welcome.',
      },
      {
        id: 'invite',
        text: 'Ask if they would like to sit with you.',
        helpful: true,
        explanation:
          'A friendly invitation can help someone feel welcomed and included.',
      },
      {
        id: 'mock',
        text: 'Make fun of them because they are alone.',
        helpful: false,
        explanation:
          'Making fun of someone can make an already difficult situation feel worse.',
      },
    ],
    reflection:
      'You do not need to be best friends with someone to make them feel welcome.',
  },
  {
    id: 3,
    title: 'Afraid of the Dark',
    scenario:
      'Your younger sibling is scared of the dark and asks you to stay with them.',
    feeling: 'Scared',
    feelingEmoji: '😨',
    perspective:
      'Fear can feel very real even when we know that we are safe.',
    responses: [
      {
        id: 'baby',
        text: 'Call them a baby.',
        helpful: false,
        explanation:
          'Making fun of someone for being afraid can make them feel ashamed of their feelings.',
      },
      {
        id: 'stay',
        text: 'Stay with them and help them feel safe.',
        helpful: true,
        explanation:
          'Staying nearby and offering reassurance shows care and understanding.',
      },
      {
        id: 'light',
        text: 'Turn off the light and leave.',
        helpful: false,
        explanation:
          'Leaving someone alone while they are frightened may make their fear stronger.',
      },
    ],
    reflection:
      'Think about a time you felt scared. What helped you feel safe? You can offer that same kind of kindness to someone else.',
  },
  {
    id: 4,
    title: 'A Friend Made a Mistake',
    scenario:
      'Your friend makes a mistake during a class activity and looks embarrassed.',
    feeling: 'Embarrassed or worried',
    feelingEmoji: '😳',
    perspective:
      'Making a mistake in front of other people can make us worry about what they think of us.',
    responses: [
      {
        id: 'laugh',
        text: 'Laugh so everyone notices the mistake.',
        helpful: false,
        explanation:
          'Drawing more attention to the mistake may increase your friend’s embarrassment.',
      },
      {
        id: 'encourage',
        text: 'Tell them that mistakes are part of learning.',
        helpful: true,
        explanation:
          'Encouragement can help your friend feel safe enough to keep trying.',
      },
      {
        id: 'leave',
        text: 'Tell everyone that your friend failed.',
        helpful: false,
        explanation:
          'Sharing someone’s embarrassing moment is not a kind way to support them.',
      },
    ],
    reflection:
      'Everyone makes mistakes. A supportive friend helps others keep learning.',
  },
];

const STAGE_LABELS: Record<EmpathyStage, string> = {
  notice: 'Notice',
  understand: 'Understand',
  choose: 'Choose',
  reflect: 'Reflect',
  complete: 'Complete',
};

const STAGE_ORDER: EmpathyStage[] = [
  'notice',
  'understand',
  'choose',
  'reflect',
  'complete',
];

export const EmpathyBuilder: React.FC = () => {
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);

  const { speak, stopSpeaking } = useReadAloud();

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stage, setStage] = useState<EmpathyStage>('notice');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState(0);

  const scenario = SCENARIOS[scenarioIndex];

  const stageProgress = useMemo(() => {
    const index = STAGE_ORDER.indexOf(stage);
    return ((index + 1) / STAGE_ORDER.length) * 100;
  }, [stage]);

  const selectedOption = scenario.responses.find(
    (response) => response.id === selectedResponse
  );

  /* =======================================================
     AUTO-READ — scenario + stage prompt
     Fires when the scenario changes OR the stage changes.
     Gates on autoReadEnabled; delays so UI paints first.
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage === 'complete') return;
    if (!scenario) return;

    const timer = window.setTimeout(() => {
      if (stage === 'notice') {
        speak(
          `${scenario.scenario} How might this person be feeling?`
        );
      } else if (stage === 'understand') {
        speak(
          `They might feel ${scenario.feeling.toLowerCase()}. ${scenario.perspective}`
        );
      } else if (stage === 'choose') {
        speak(
          'Choose a caring response. Think about how your choice might make the other person feel.'
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [scenarioIndex, stage, scenario, autoReadEnabled, speak]);

  /* =======================================================
     AUTO-READ — reflection on the reflect stage
     Fires after the child has chosen a response.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'reflect') return;
    if (!selectedOption) return;
    if (!scenario) return;

    const timer = window.setTimeout(() => {
      const opening = selectedOption.helpful
        ? 'That is a caring choice.'
        : 'Let us think about that choice.';
      speak(
        `${opening} ${selectedOption.explanation} ${scenario.reflection}`
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, selectedOption, scenario, speak]);

  /* =======================================================
     COMPLETION NARRATION — fires once on stage === 'complete'
  ======================================================= */

  useEffect(() => {
    if (stage !== 'complete') return;

    speak(
      'Empathy Builder complete. You practised noticing feelings, thinking about another person\'s perspective, choosing a caring response, and reflecting on kindness. Empathy means trying to understand, listening, and choosing a caring response.'
    );
  }, [stage, speak]);

  /* =======================================================
     CLEANUP — stop any in-flight speech on unmount
  ======================================================= */

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleChooseResponse = (response: EmpathyResponse) => {
    setSelectedResponse(response.id);
    setStage('reflect');
    // Narration is driven by the reflect-stage effect — do not speak here.
  };

  const handleNextScenario = () => {
    const nextCompleted = completedScenarios + 1;

    setCompletedScenarios(nextCompleted);

    if (scenarioIndex === SCENARIOS.length - 1) {
      setStage('complete');
      return;
    }

    setScenarioIndex((current) => current + 1);
    setSelectedResponse(null);
    setStage('notice');
  };

  const restart = () => {
    stopSpeaking();

    setScenarioIndex(0);
    setStage('notice');
    setSelectedResponse(null);
    setCompletedScenarios(0);
  };

  if (stage === 'complete') {
    return (
      <div className="max-w-2xl mx-auto bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto mb-5 rounded-full bg-pink-500/15 flex items-center justify-center"
          >
            <Heart className="w-10 h-10 text-pink-400 fill-pink-400/20" />
          </motion.div>

          <h3 className="text-3xl font-bold text-white mb-2">
            Empathy Builder Complete
          </h3>

          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            You practiced noticing feelings, thinking about another person's
            perspective, choosing a caring response, and reflecting on kindness.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl border border-app-border bg-black/20 p-4">
              <div className="text-2xl mb-1">👀</div>
              <p className="text-white font-semibold text-sm">Notice</p>
            </div>

            <div className="rounded-2xl border border-app-border bg-black/20 p-4">
              <div className="text-2xl mb-1">💭</div>
              <p className="text-white font-semibold text-sm">Understand</p>
            </div>

            <div className="rounded-2xl border border-app-border bg-black/20 p-4">
              <div className="text-2xl mb-1">❤️</div>
              <p className="text-white font-semibold text-sm">Respond</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-6">
            <p className="text-pink-200 text-sm leading-relaxed">
              Empathy does not mean knowing exactly how another person feels.
              It means trying to understand, listening, and choosing a caring
              response.
            </p>
          </div>

          <button
            onClick={restart}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Practise Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 md:p-7 rounded-3xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-pink-400" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                Empathy Builder
              </h3>
              <p className="text-xs text-gray-500">
                Notice • Understand • Choose • Reflect
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Scenario</p>
          <p className="text-sm font-bold text-white">
            {scenarioIndex + 1} / {SCENARIOS.length}
          </p>
        </div>
      </div>

      {/* Stage progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">
            {STAGE_LABELS[stage]}
          </span>
          <span className="text-gray-500">
            {completedScenarios} completed
          </span>
        </div>

        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${stageProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Scenario */}
      <motion.div
        key={scenario.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-800 bg-black/20 p-5 md:p-6 mb-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            {scenario.title}
          </span>
        </div>

        <p className="text-white text-lg md:text-xl font-semibold leading-relaxed">
          {scenario.scenario}
        </p>
      </motion.div>

      {/* NOTICE */}
      {stage === 'notice' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 mb-5">
            <p className="text-sm font-semibold text-indigo-200 mb-2">
              👀 First, notice the feeling
            </p>

            <p className="text-gray-300 text-sm leading-relaxed">
              Look at the situation. How might this person be feeling?
            </p>
          </div>

          <button
            onClick={() => setStage('understand')}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            I noticed the feeling
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* UNDERSTAND */}
      {stage === 'understand' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{scenario.feelingEmoji}</span>

              <div>
                <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                  They might feel
                </p>
                <p className="text-white font-bold text-lg">
                  {scenario.feeling}
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              {scenario.perspective}
            </p>
          </div>

          <button
            onClick={() => setStage('choose')}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            What could I do?
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* CHOOSE */}
      {stage === 'choose' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-pink-400" />
            <p className="text-white font-bold">
              Choose a caring response
            </p>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Think about how your choice might make the other person feel.
          </p>

          <div className="space-y-3">
            {scenario.responses.map((response) => (
              <motion.button
                key={response.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleChooseResponse(response)}
                className="w-full text-left p-4 rounded-2xl border border-gray-700 bg-black/20 hover:border-indigo-500/60 hover:bg-indigo-500/5 text-white transition-all"
              >
                {response.text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* REFLECT */}
      {stage === 'reflect' && selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className={`p-5 rounded-2xl border mb-5 ${
              selectedOption.helpful
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {selectedOption.helpful ? '❤️' : '💭'}
              </div>

              <div>
                <p
                  className={`font-bold mb-2 ${
                    selectedOption.helpful
                      ? 'text-green-300'
                      : 'text-amber-300'
                  }`}
                >
                  {selectedOption.helpful
                    ? 'That is a caring choice.'
                    : 'Let’s think about that choice.'}
                </p>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedOption.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
            <p className="text-xs uppercase tracking-wider text-indigo-300 font-bold mb-2">
              Reflect
            </p>

            <p className="text-gray-300 text-sm leading-relaxed">
              {scenario.reflection}
            </p>
          </div>

          <button
            onClick={handleNextScenario}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            {scenarioIndex === SCENARIOS.length - 1
              ? 'Finish Activity'
              : 'Next Scenario'}

            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>
      )}

      {/* Learning principle */}
      <div className="mt-6 pt-5 border-t border-gray-800">
        <p className="text-center text-xs text-gray-500">
          💡 Empathy means noticing another person's feelings, trying to
          understand their perspective, and responding with care.
        </p>
      </div>
    </div>
  );
};