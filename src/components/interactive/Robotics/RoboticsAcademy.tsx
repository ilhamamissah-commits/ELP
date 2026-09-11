import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  ChevronRight,
  Cpu,
  Lock,
  RotateCcw,
  ScanEye,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  Wrench,
  Zap,
} from 'lucide-react';

import { RobotExplorer } from './RobotExplorer';
import { RobotDesigner } from './RobotDesigner';
import { Sequencer } from './Sequencer';
import { ROBOTICS_CHALLENGES } from './roboticsChallenges';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

/* =========================================================
   TYPES
   ========================================================= */

type RoboticsModule =
  | 'home'
  | 'explore'
  | 'build'
  | 'program'
  | 'sensors'
  | 'debug'
  | 'missions'
  | 'engineering';

interface ModuleDefinition {
  id: RoboticsModule;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  level: number;
  available: boolean;
}

interface ProgressState {
  completedChallenges: number[];
  completedModules: RoboticsModule[];
  xp: number;
}

/* =========================================================
   ACADEMY DATA
   ========================================================= */

const MODULES: ModuleDefinition[] = [
  {
    id: 'explore',
    title: 'Robot Explorer',
    subtitle: 'Discover',
    description:
      'Learn what robots are made of and discover how each part helps a robot work.',
    icon: ScanEye,
    colorClass: 'indigo',
    level: 1,
    available: true,
  },
  {
    id: 'build',
    title: 'Robot Builder',
    subtitle: 'Build',
    description:
      'Choose the right parts and build a robot that can operate and move.',
    icon: Wrench,
    colorClass: 'emerald',
    level: 2,
    available: true,
  },
  {
    id: 'program',
    title: 'Robot Programmer',
    subtitle: 'Program',
    description:
      'Create sequences of instructions and guide your robot through missions.',
    icon: Cpu,
    colorClass: 'blue',
    level: 3,
    available: true,
  },
  {
    id: 'sensors',
    title: 'Sensor Scientist',
    subtitle: 'Sense',
    description:
      'Discover how robots use sensors to understand the world around them.',
    icon: ScanEye,
    colorClass: 'cyan',
    level: 4,
    available: false,
  },
  {
    id: 'debug',
    title: 'Debugging Engineer',
    subtitle: 'Debug',
    description:
      'Find mistakes, understand why they happen, and improve robot programs.',
    icon: Settings,
    colorClass: 'amber',
    level: 5,
    available: false,
  },
  {
    id: 'missions',
    title: 'Mission Lab',
    subtitle: 'Solve',
    description:
      'Apply your robotics knowledge to real-world inspired missions.',
    icon: Target,
    colorClass: 'rose',
    level: 6,
    available: false,
  },
  {
    id: 'engineering',
    title: 'Engineering Lab',
    subtitle: 'Create',
    description:
      'Design, test, evaluate and improve complete robotic systems.',
    icon: Brain,
    colorClass: 'violet',
    level: 7,
    available: false,
  },
];

const ACADEMY_LEVELS = [
  {
    level: 1,
    title: 'Robot Explorer',
    description: 'Understand robot parts and their jobs.',
    skill: 'Observation',
  },
  {
    level: 2,
    title: 'Robot Builder',
    description: 'Understand how robot systems work together.',
    skill: 'Engineering',
  },
  {
    level: 3,
    title: 'Robot Thinker',
    description: 'Use sequences and algorithms to solve problems.',
    skill: 'Algorithms',
  },
  {
    level: 4,
    title: 'Sensor Scientist',
    description: 'Use information from sensors to make decisions.',
    skill: 'Sensing',
  },
  {
    level: 5,
    title: 'Robot Programmer',
    description: 'Create reliable programs for robotic tasks.',
    skill: 'Programming',
  },
  {
    level: 6,
    title: 'Debugging Engineer',
    description: 'Find, explain and fix programming errors.',
    skill: 'Debugging',
  },
  {
    level: 7,
    title: 'Robotics Engineer',
    description: 'Design complete robotic systems.',
    skill: 'Systems Thinking',
  },
  {
    level: 8,
    title: 'Mission Designer',
    description: 'Create solutions for complex real-world missions.',
    skill: 'Innovation',
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

const getModuleColor = (colorClass: string) => {
  const colors: Record<
    string,
    { bg: string; border: string; text: string; icon: string }
  > = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-300',
      icon: 'bg-indigo-500/15',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
      icon: 'bg-emerald-500/15',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      icon: 'bg-blue-500/15',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-300',
      icon: 'bg-cyan-500/15',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      icon: 'bg-amber-500/15',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-300',
      icon: 'bg-rose-500/15',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      text: 'text-violet-300',
      icon: 'bg-violet-500/15',
    },
  };

  return colors[colorClass] ?? colors.indigo;
};

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-app-border bg-app-card p-4">
    <div className="mb-2 flex items-center gap-2 text-gray-400">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>

    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

interface FrameworkStepProps {
  number: number;
  title: string;
  description: string;
}

const FrameworkStep: React.FC<FrameworkStepProps> = ({
  number,
  title,
  description,
}) => (
  <div className="relative flex gap-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-sm font-bold text-cyan-300">
      {number}
    </div>

    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
        {description}
      </p>
    </div>
  </div>
);

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const RoboticsAcademy: React.FC = () => {
  const [activeModule, setActiveModule] = useState<RoboticsModule>('home');

  const [progress, setProgress] = useState<ProgressState>({
    completedChallenges: [],
    completedModules: [],
    xp: 0,
  });

  const [showRoadmap, setShowRoadmap] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  /* -------------------------------------------------------
     Challenge statistics
  ------------------------------------------------------- */

  const challengeStats = useMemo(() => {
    const total = ROBOTICS_CHALLENGES.length;

    const completed = progress.completedChallenges.filter((id) =>
      ROBOTICS_CHALLENGES.some((challenge) => challenge.id === id)
    ).length;

    return {
      total,
      completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [progress.completedChallenges]);

  /* -------------------------------------------------------
     Academy level
  ------------------------------------------------------- */

  const academyLevel = useMemo(() => {
    const completed = challengeStats.completed;

    if (completed >= 30) return 4;
    if (completed >= 20) return 3;
    if (completed >= 10) return 2;

    return 1;
  }, [challengeStats.completed]);

  /* -------------------------------------------------------
     Auto-read on home load + when a module opens
  ------------------------------------------------------- */

  useEffect(() => {
    if (!autoReadEnabled) return;

    if (activeModule === 'home') {
      const timer = window.setTimeout(() => {
        speak(
          'Robotics Academy. Learn to explore, build, program, test and improve robots through structured engineering challenges.',
        );
      }, 500);
      return () => window.clearTimeout(timer);
    }

    const definition = MODULES.find((m) => m.id === activeModule);
    if (!definition) return;

    const timer = window.setTimeout(() => {
      speak(`${definition.title}. ${definition.description}`);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [activeModule, speak, autoReadEnabled]);

  /* -------------------------------------------------------
     Module navigation
  ------------------------------------------------------- */

  const openModule = (module: RoboticsModule) => {
    const definition = MODULES.find((item) => item.id === module);

    if (!definition || !definition.available) {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(`Level ${definition?.level ?? 0}. This module is not unlocked yet.`);
      return;
    }

    if (soundEnabled) playSoundFeedback('move');
    setActiveModule(module);
  };

  const goHome = () => {
    setActiveModule('home');
    if (soundEnabled) playSoundFeedback('move');
  };

  /* -------------------------------------------------------
     Module completion
  ------------------------------------------------------- */

  const markModuleComplete = (module: RoboticsModule) => {
    setProgress((current) => {
      if (current.completedModules.includes(module)) {
        return current;
      }

      return {
        ...current,
        completedModules: [...current.completedModules, module],
        xp: current.xp + 50,
      };
    });
  };

  /* -------------------------------------------------------
     Reset academy
  ------------------------------------------------------- */

  const resetAcademy = () => {
    setProgress({
      completedChallenges: [],
      completedModules: [],
      xp: 0,
    });

    setActiveModule('home');

    speak('Academy progress has been reset.');
  };

  /* =======================================================
     ACTIVITY VIEW
  ======================================================= */

  if (activeModule !== 'home') {
    const currentModule = MODULES.find((module) => module.id === activeModule);

    return (
      <div className="min-h-full bg-app-background p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goHome}
              className="inline-flex items-center gap-2 rounded-xl border border-app-border bg-app-card px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-cyan-400/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Academy
            </button>

            <div className="flex items-center gap-2">
              {currentModule && (
                <div className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
                  <Bot className="h-4 w-4 text-cyan-400" />
                  {currentModule.title}
                </div>
              )}

              <button
                type="button"
                onClick={toggleSound}
                aria-label="Toggle sound"
                className="rounded-xl border border-app-border bg-app-card p-2 transition hover:bg-white/5"
              >
                <Volume2
                  className={`h-4 w-4 ${
                    soundEnabled ? 'text-amber-300' : 'text-gray-500'
                  }`}
                />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeModule === 'explore' && <RobotExplorer />}

              {activeModule === 'build' && <RobotDesigner />}

              {activeModule === 'program' && <Sequencer />}

              {activeModule !== 'explore' &&
                activeModule !== 'build' &&
                activeModule !== 'program' && (
                  <ComingSoon module={currentModule} onBack={goHome} />
                )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* =======================================================
     ACADEMY HOME
  ======================================================= */

  return (
    <div className="min-h-full bg-app-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 p-6 shadow-2xl md:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Early Robotics &amp; Engineering
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
                Robotics
                <span className="text-cyan-400"> Academy</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                Learn to explore, build, program, test and improve robots
                through structured engineering challenges.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openModule('explore')}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  Start Exploring
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowRoadmap(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  View Learning Path
                </button>

                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label="Toggle sound"
                  className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                >
                  <Volume2
                    className={`h-4 w-4 ${
                      soundEnabled ? 'text-amber-300' : 'text-gray-500'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Robot visual */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex h-48 w-48 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5"
              >
                <div className="absolute inset-5 rounded-full border border-cyan-400/10" />

                <div className="rounded-3xl border border-cyan-300/30 bg-slate-900 p-8 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
                  <Bot className="h-20 w-20 text-cyan-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={Trophy} label="Academy Level" value={academyLevel} />
          <StatCard icon={Zap} label="XP" value={progress.xp} />
          <StatCard
            icon={CheckCircle}
            label="Challenges"
            value={`${challengeStats.completed}/${challengeStats.total}`}
          />
          <StatCard
            icon={Sparkles}
            label="Progress"
            value={`${challengeStats.percentage}%`}
          />
        </div>

        {/* LEARNING ENGINE */}
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              The Robotics Learning Loop
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Think like an engineer
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Robotics is not just about building robots. Learners repeatedly
              observe, reason, create, test and improve.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {[
              'Discover',
              'Imagine',
              'Build',
              'Program',
              'Predict',
              'Test',
              'Debug',
              'Improve',
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-app-border bg-app-card p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">
                    0{index + 1}
                  </span>

                  {index < 7 && (
                    <ArrowRight className="hidden h-3 w-3 text-gray-600 xl:block" />
                  )}
                </div>

                <p className="text-sm font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CORE SYSTEM MODEL */}
        <section className="mt-8 rounded-2xl border border-app-border bg-app-card p-5 md:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Core Robotics Model
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                SENSE → THINK → ACT
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Learners gradually understand that a robot receives
                information, processes it and then performs an action.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <FrameworkStep
                number={1}
                title="SENSE"
                description="Sensors collect information from the environment."
              />

              <FrameworkStep
                number={2}
                title="THINK"
                description="The controller processes information and makes decisions."
              />

              <FrameworkStep
                number={3}
                title="ACT"
                description="Motors, lights, sounds and other outputs respond."
              />
            </div>
          </div>
        </section>

        {/* CONTINUE LEARNING */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Your Learning Path
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Continue learning
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowRoadmap(true)}
              className="hidden text-sm font-medium text-cyan-400 hover:text-cyan-300 sm:block"
            >
              Full roadmap
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => {
              const Icon = module.icon;
              const colors = getModuleColor(module.colorClass);

              const completed = progress.completedModules.includes(module.id);

              const unlocked = module.available || module.level <= academyLevel;

              return (
                <motion.button
                  key={module.id}
                  type="button"
                  whileHover={unlocked ? { y: -3 } : undefined}
                  whileTap={unlocked ? { scale: 0.99 } : undefined}
                  onClick={() => unlocked && openModule(module.id)}
                  disabled={!unlocked}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition ${
                    unlocked
                      ? `bg-app-card ${colors.border} hover:bg-white/[0.03]`
                      : 'cursor-not-allowed border-app-border bg-app-card/60 opacity-60'
                  }`}
                >
                  <div className="absolute right-4 top-4 flex items-center gap-1 text-xs font-semibold text-gray-500">
                    {completed && (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    )}

                    {unlocked ? (
                      <>Level {module.level}</>
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>

                  <div
                    className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${colors.icon} ${colors.text}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}
                  >
                    {module.subtitle}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    {module.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {module.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {unlocked
                        ? completed
                          ? 'Completed'
                          : 'Ready to learn'
                        : `Unlock at Level ${module.level}`}
                    </span>

                    {unlocked && (
                      <ChevronRight className="h-4 w-4 text-gray-500 transition group-hover:translate-x-1 group-hover:text-white" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* CURRENT SKILL FOCUS */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-app-border bg-app-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2.5">
                <Brain className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Current Focus
                </p>

                <h3 className="font-bold text-white">
                  {ACADEMY_LEVELS[academyLevel - 1]?.title ?? 'Robot Explorer'}
                </h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              {ACADEMY_LEVELS[academyLevel - 1]?.description ??
                'Understand how robots work and how their parts work together.'}
            </p>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-gray-500">Progress to next stage</span>

                <span className="font-semibold text-cyan-400">
                  {challengeStats.percentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${challengeStats.percentage}%` }}
                  className="h-full rounded-full bg-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-app-border bg-app-card p-6">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Quick Actions
              </p>

              <h3 className="mt-1 font-bold text-white">
                What do you want to do?
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <QuickAction
                icon={ScanEye}
                title="Explore"
                description="Learn robot parts"
                onClick={() => openModule('explore')}
              />

              <QuickAction
                icon={Wrench}
                title="Build"
                description="Design a robot"
                onClick={() => openModule('build')}
              />

              <QuickAction
                icon={Cpu}
                title="Program"
                description="Give Robo instructions"
                onClick={() => openModule('program')}
              />
            </div>
          </div>
        </section>

        {/* RESET */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={resetAcademy}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset academy progress
          </button>
        </div>
      </div>

      {/* ROADMAP MODAL */}
      <AnimatePresence>
        {showRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowRoadmap(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-app-border bg-slate-950 p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                    Robotics Progression
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Your Engineering Journey
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRoadmap(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
                  aria-label="Close learning roadmap"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                {ACADEMY_LEVELS.map((stage) => {
                  const unlocked = stage.level <= academyLevel;

                  const current = stage.level === academyLevel;

                  return (
                    <div
                      key={stage.level}
                      className={`flex items-center gap-4 rounded-2xl border p-4 ${
                        current
                          ? 'border-cyan-400/30 bg-cyan-400/5'
                          : 'border-app-border bg-app-card'
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                          unlocked
                            ? 'bg-cyan-500/10 text-cyan-300'
                            : 'bg-slate-800 text-gray-500'
                        }`}
                      >
                        {unlocked ? (
                          stage.level
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white">
                            {stage.title}
                          </h3>

                          {current && (
                            <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-400">
                          {stage.description}
                        </p>

                        <p className="mt-2 text-xs text-gray-600">
                          Core skill: {stage.skill}
                        </p>
                      </div>

                      {unlocked && (
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* =========================================================
   QUICK ACTION
   ========================================================= */

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-3 rounded-xl border border-app-border bg-slate-900/50 p-3 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.03]"
  >
    <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-300">
      <Icon className="h-4 w-4" />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-white">{title}</p>

      <p className="mt-0.5 text-xs text-gray-500">{description}</p>
    </div>

    <ChevronRight className="h-4 w-4 text-gray-600 transition group-hover:translate-x-1 group-hover:text-gray-300" />
  </button>
);

/* =========================================================
   COMING SOON
   ========================================================= */

interface ComingSoonProps {
  module?: ModuleDefinition;
  onBack: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ module, onBack }) => {
  const Icon = module?.icon ?? Bot;

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-app-border bg-app-card p-8 text-center shadow-xl md:p-12">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
        <Icon className="h-10 w-10 text-cyan-300" />
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
        Next Engineering Module
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        {module?.title ?? 'Coming Soon'}
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-400">
        {module?.description ??
          'This part of the Robotics Academy is being prepared.'}
      </p>

      <div className="mt-8 rounded-2xl border border-app-border bg-slate-950/60 p-5 text-left">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

          <div>
            <h3 className="font-semibold text-white">
              What you will learn
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              You will use the engineering cycle to observe a problem, form an
              idea, build a solution, test it, identify weaknesses and improve
              your design.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-app-border px-5 py-3 font-semibold text-white transition hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Academy
      </button>
    </div>
  );
};

export default RoboticsAcademy;