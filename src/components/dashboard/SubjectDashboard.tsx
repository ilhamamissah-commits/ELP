import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Sigma,
  Palette,
  PenTool,
  Globe2,
  Leaf,
  HeartPulse,
  Brain,
  Wrench,
  Bot,
  Languages,
  Cpu,
  Coins,
  Recycle,
  Landmark,
  Lightbulb,
  Sprout,
  Volume2,
} from 'lucide-react';
import { useReadAloud } from '../../hooks/useReadAloud';

interface Subject {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface AcademyInfo {
  title: string;
  description: string;
}

interface SubjectDashboardProps {
  worldId: string;
  onSelect: (subjectId: string) => void;
  onBack: () => void;
}

const ACADEMY_INFO: Record<string, AcademyInfo> = {
  language: { title: 'Language & Literacy', description: 'Build communication, reading and writing skills.' },
  maths: { title: 'Mathematics & Thinking', description: 'Develop mathematical understanding, logic and problem-solving.' },
  stem: { title: 'STEM Discovery', description: 'Explore science, engineering and robotics through investigation.' },
  digital: { title: 'Computing & Digital', description: 'Develop digital literacy, computing and responsible technology use.' },
  global: { title: 'Global Perspectives', description: 'Explore people, places, cultures, history and our shared world.' },
  creative: { title: 'Creative Arts', description: 'Express ideas through art, design, writing and creativity.' },
  life: { title: 'Life & Wellbeing', description: 'Develop independence, healthy habits and practical life skills.' },
  finance: { title: 'Financial Literacy', description: 'Learn about money, saving, spending and responsible choices.' },
  thinking: { title: 'Thinking Lab', description: 'Strengthen reasoning, memory, problem-solving and critical thinking.' },
  nature: { title: 'Nature & Agriculture', description: 'Discover plants, animals, ecosystems, soil and agriculture.' },
  islamic: { title: 'Islamic Studies', description: 'Develop knowledge of Islam, Seerah, Aqeedah and Adab.' },
  montessori: { title: 'Montessori Foundations', description: 'Build independence through practical life and sensorial learning.' },
};

const ACADEMY_SUBJECTS: Record<string, Subject[]> = {
  language: [
    { id: 'english', label: 'English', description: 'Language, phonics, reading and comprehension', icon: <BookOpen className="h-6 w-6" />, color: 'bg-blue-500/15 text-blue-300' },
    { id: 'arabic', label: 'Arabic', description: 'Arabic literacy, vocabulary and reading', icon: <Languages className="h-6 w-6" />, color: 'bg-emerald-500/15 text-emerald-300' },
    { id: 'writing', label: 'Writing', description: 'Handwriting, composition and written expression', icon: <PenTool className="h-6 w-6" />, color: 'bg-indigo-500/15 text-indigo-300' },
  ],
  maths: [
    { id: 'maths', label: 'Mathematics', description: 'Number, measurement, patterns and problem-solving', icon: <Calculator className="h-6 w-6" />, color: 'bg-yellow-500/15 text-yellow-300' },
    { id: 'abacus', label: 'Abacus', description: 'Mental arithmetic and numerical fluency', icon: <Sigma className="h-6 w-6" />, color: 'bg-orange-500/15 text-orange-300' },
    { id: 'logic', label: 'Logic', description: 'Patterns, reasoning and mathematical thinking', icon: <Brain className="h-6 w-6" />, color: 'bg-teal-500/15 text-teal-300' },
  ],
  stem: [
    { id: 'science', label: 'Science', description: 'Observation, investigation and scientific thinking', icon: <FlaskConical className="h-6 w-6" />, color: 'bg-red-500/15 text-red-300' },
    { id: 'engineering', label: 'Engineering', description: 'Design, building and problem-solving', icon: <Wrench className="h-6 w-6" />, color: 'bg-green-500/15 text-green-300' },
    { id: 'robotics', label: 'Robotics', description: 'Machines, automation and computational systems', icon: <Bot className="h-6 w-6" />, color: 'bg-purple-500/15 text-purple-300' },
  ],
  digital: [
    { id: 'digital', label: 'Digital World', description: 'Digital literacy, devices and responsible technology', icon: <Cpu className="h-6 w-6" />, color: 'bg-purple-500/15 text-purple-300' },
  ],
  global: [
    { id: 'geography', label: 'Geography', description: 'Places, people, environments and the world', icon: <Globe2 className="h-6 w-6" />, color: 'bg-cyan-500/15 text-cyan-300' },
    { id: 'history', label: 'History', description: 'People, events, communities and change over time', icon: <Landmark className="h-6 w-6" />, color: 'bg-amber-500/15 text-amber-300' },
  ],
  creative: [
    { id: 'art', label: 'Art & Design', description: 'Visual expression, creativity and design', icon: <Palette className="h-6 w-6" />, color: 'bg-pink-500/15 text-pink-300' },
    { id: 'writing', label: 'Creative Writing', description: 'Stories, imagination and creative expression', icon: <PenTool className="h-6 w-6" />, color: 'bg-indigo-500/15 text-indigo-300' },
  ],
  life: [
    { id: 'practical-life', label: 'Practical Life', description: 'Independence, coordination and everyday skills', icon: <Leaf className="h-6 w-6" />, color: 'bg-green-500/15 text-green-300' },
    { id: 'wellbeing', label: 'Wellbeing', description: 'Health, movement, emotions and healthy habits', icon: <HeartPulse className="h-6 w-6" />, color: 'bg-red-500/15 text-red-300' },
  ],
  finance: [
    { id: 'finance', label: 'Money & Saving', description: 'Needs, wants, saving, spending and budgeting', icon: <Coins className="h-6 w-6" />, color: 'bg-amber-600/15 text-amber-300' },
  ],
  thinking: [
    { id: 'logic', label: 'Logic & Puzzles', description: 'Reasoning, memory, patterns and problem-solving', icon: <Brain className="h-6 w-6" />, color: 'bg-cyan-500/15 text-cyan-300' },
  ],
  nature: [
    { id: 'environment', label: 'Environment', description: 'Nature, ecosystems, sustainability and conservation', icon: <Recycle className="h-6 w-6" />, color: 'bg-green-600/15 text-green-300' },
    { id: 'agriculture', label: 'Agriculture', description: 'Plants, soil, food production and farming', icon: <Sprout className="h-6 w-6" />, color: 'bg-lime-600/15 text-lime-300' },
  ],
  islamic: [
    { id: 'islamic', label: 'Islamic Studies', description: 'Aqeedah, Seerah, Adab and Islamic knowledge', icon: <BookOpen className="h-6 w-6" />, color: 'bg-indigo-600/15 text-indigo-300' },
  ],
  montessori: [
    { id: 'sensorial', label: 'Sensorial', description: 'Explore the world through the senses', icon: <Lightbulb className="h-6 w-6" />, color: 'bg-orange-500/15 text-orange-300' },
    { id: 'practical-life', label: 'Practical Life', description: 'Independence, coordination and everyday activities', icon: <Leaf className="h-6 w-6" />, color: 'bg-green-500/15 text-green-300' },
  ],
};

export const SubjectDashboard: React.FC<SubjectDashboardProps> = ({
  worldId,
  onSelect,
  onBack,
}) => {
  // ✅ Move hook inside the component
  const { speak } = useReadAloud();

  const academy = ACADEMY_INFO[worldId];
  const subjects = ACADEMY_SUBJECTS[worldId] ?? [];

  // ✅ Move handleReadWorld inside the component so it can access worldId, academy, subjects
  const handleReadWorld = () => {
    if (!academy) return;
    const subjectNames = subjects.map((s) => s.label).join(', ');
    speak(`${academy.title}. ${academy.description} You can choose: ${subjectNames}.`);
  };

  if (!academy) {
    return (
      <div className="mx-auto w-full max-w-lg p-6 text-center">
        <p className="text-sm text-gray-400">This academy is not available yet.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-emerald-300 hover:text-emerald-200"
        >
          ← Back to Academies
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      {/* Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm text-gray-400 transition-colors hover:text-white"
      >
        ← Back to Academies
      </button>

      {/* Academy Header */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Academy
        </p>

        {/* ✅ Header with Read Aloud button */}
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {academy.title}
          </h2>

          <button
            type="button"
            onClick={handleReadWorld}
            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md"
            aria-label="Read this academy aloud"
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-400">
          {academy.description}
        </p>
      </div>

      {/* Subjects */}
      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-app-card p-8 text-center">
          <p className="text-sm text-gray-400">Subjects for this academy are coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {subjects.map((subject, index) => (
            <motion.button
              key={subject.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                // ✅ Speak the subject title when clicked
                speak(subject.label);
                onSelect(subject.id);
              }}
              className="group flex min-h-[150px] flex-col rounded-2xl border border-white/10 bg-app-card p-5 text-left transition-all duration-200 hover:border-white/25 hover:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${subject.color}`}>
                  {subject.icon}
                </div>

                <span className="text-sm text-white/20 transition-colors group-hover:text-white/60">
                  →
                </span>
              </div>

              <h3 className="font-bold text-white">{subject.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {subject.description}
              </p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Learning principle */}
      <p className="mt-8 text-center text-xs text-gray-600">
        Lessons adapt to demonstrated mastery and learning needs.
      </p>
    </div>
  );
};