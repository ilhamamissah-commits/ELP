import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Monitor,
  Globe2,
  Palette,
  HeartPulse,
  Wallet,
  Brain,
  Sprout,
  Moon,
  Puzzle,
} from 'lucide-react';

interface LearningAcademy {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const LEARNING_ACADEMIES: LearningAcademy[] = [
  {
    id: 'language',
    title: 'Language & Literacy',
    icon: BookOpen,
    color: 'bg-blue-500/20 text-blue-300 border-blue-400/20',
    description: 'English, Arabic, reading & writing',
  },
  {
    id: 'maths',
    title: 'Mathematics & Thinking',
    icon: Calculator,
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/20',
    description: 'Mathematics, abacus & logic',
  },
  {
    id: 'stem',
    title: 'STEM Discovery',
    icon: FlaskConical,
    color: 'bg-red-500/20 text-red-300 border-red-400/20',
    description: 'Science, engineering & robotics',
  },
  {
    id: 'digital',
    title: 'Computing & Digital',
    icon: Monitor,
    color: 'bg-purple-500/20 text-purple-300 border-purple-400/20',
    description: 'Computing, digital literacy & media',
  },
  {
    id: 'global',
    title: 'Global Perspectives',
    icon: Globe2,
    color: 'bg-teal-500/20 text-teal-300 border-teal-400/20',
    description: 'Geography, history & civics',
  },
  {
    id: 'creative',
    title: 'Creative Arts',
    icon: Palette,
    color: 'bg-pink-500/20 text-pink-300 border-pink-400/20',
    description: 'Art, design & creative studio',
  },
  {
    id: 'life',
    title: 'Life & Wellbeing',
    icon: HeartPulse,
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/20',
    description: 'Practical life, health & PE',
  },
  {
    id: 'finance',
    title: 'Financial Literacy',
    icon: Wallet,
    color: 'bg-amber-600/20 text-amber-300 border-amber-500/20',
    description: 'Money, saving & budgeting',
  },
  {
    id: 'thinking',
    title: 'Thinking Lab',
    icon: Brain,
    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/20',
    description: 'Critical thinking, memory & puzzles',
  },
  {
    id: 'nature',
    title: 'Nature & Agriculture',
    icon: Sprout,
    color: 'bg-green-600/20 text-green-300 border-green-500/20',
    description: 'Plants, soil & farming',
  },
  {
    id: 'islamic',
    title: 'Islamic Studies',
    icon: Moon,
    color: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/20',
    description: 'Aqeedah, Seerah & Adab',
  },
  {
    id: 'montessori',
    title: 'Montessori Foundations',
    icon: Puzzle,
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/20',
    description: 'Practical life, sensorial & independence',
  },
];

interface LearningWorldProps {
  onSelect: (academyId: string) => void;
}

export const LearningWorld: React.FC<LearningWorldProps> = ({
  onSelect,
}) => {
  return (
    <div className="relative flex min-h-[70vh] w-full max-w-6xl flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0b132b] px-4 py-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8 max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Learning Environment
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Choose an Academy
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-gray-400 md:text-base">
          Explore different areas of learning. Your progress in each academy
          develops independently as your skills grow.
        </p>
      </div>

      {/* Academy Grid */}
      <div className="relative z-10 grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {LEARNING_ACADEMIES.map((academy, index) => {
          const Icon = academy.icon;

          return (
            <motion.button
              key={academy.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.04,
              }}
              whileHover={{
                y: -3,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.985,
              }}
              onClick={() => onSelect(academy.id)}
              className={`group min-h-[150px] rounded-2xl border p-4 text-left transition-all duration-200 hover:border-white/30 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${academy.color}`}
              aria-label={`Open ${academy.title} Academy`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/20">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <span className="text-xs text-white/30 transition-colors group-hover:text-white/60">
                  →
                </span>
              </div>

              <h3 className="text-sm font-bold leading-tight text-white">
                {academy.title}
              </h3>

              <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                {academy.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="relative z-10 mt-8 text-center text-xs text-gray-500">
        Learning adapts to demonstrated ability — not age alone.
      </p>
    </div>
  );
};
