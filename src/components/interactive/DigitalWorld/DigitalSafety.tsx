import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Lock,
  User,
  MessageCircle,
  MousePointer,
  Heart,
} from 'lucide-react';

type SafetyCategory =
  | 'Personal Information'
  | 'Passwords'
  | 'Strangers'
  | 'Cyberbullying'
  | 'Links & Pop-ups'
  | 'Media Sharing'
  | 'Trusted Adults';

interface Scenario {
  id: number;
  category: SafetyCategory;
  scenario: string;
  question: string;
  safe: boolean;
  correctAction: string;
  explanation: string;
  hint: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    category: 'Personal Information',
    scenario: 'Someone you do not know online asks for your home address.',
    question: 'Should you give them your address?',
    safe: false,
    correctAction: 'Do not share it. Tell a trusted adult.',
    explanation:
      'Your home address is personal information. People online do not need to know where you live.',
    hint: 'Think about information that helps someone find you.',
  },
  {
    id: 2,
    category: 'Personal Information',
    scenario: 'A website asks for your full name, school, phone number, and home address.',
    question: 'Should you enter all of this information by yourself?',
    safe: false,
    correctAction: 'Stop and ask a parent or trusted adult first.',
    explanation:
      'Websites can ask for personal information. A child should always check with a trusted adult before sharing it.',
    hint: 'Personal information should be protected.',
  },
  {
    id: 3,
    category: 'Passwords',
    scenario: 'A website asks you to create a password for your account.',
    question: 'Should you create and share the password with your friends?',
    safe: false,
    correctAction: 'Create it with adult guidance and keep it secret.',
    explanation:
      'Passwords protect accounts. Never share your password with friends or strangers.',
    hint: 'A password is like a key. Who should have your key?',
  },
  {
    id: 4,
    category: 'Strangers',
    scenario: 'Someone you have never met sends you a message asking to meet in person.',
    question: 'Should you agree to meet them?',
    safe: false,
    correctAction: 'Do not meet them. Tell a trusted adult immediately.',
    explanation:
      'Someone online may not be who they say they are. Never arrange to meet an online stranger by yourself.',
    hint: 'Online friends are still people you may not really know.',
  },
  {
    id: 5,
    category: 'Cyberbullying',
    scenario: 'Someone sends you a mean message online and tells you to keep it secret.',
    question: 'Should you keep it secret?',
    safe: false,
    correctAction: 'Save the evidence and tell a trusted adult.',
    explanation:
      'You do not have to handle online bullying alone. A trusted adult can help.',
    hint: 'When something online makes you feel unsafe, who can help?',
  },
  {
    id: 6,
    category: 'Links & Pop-ups',
    scenario: 'A pop-up says: "Congratulations! You won a FREE tablet! Click here now!"',
    question: 'Should you click the button?',
    safe: false,
    correctAction: 'Do not click. Close it and tell an adult.',
    explanation:
      'Unexpected prizes and urgent messages can be tricks. Do not click suspicious pop-ups.',
    hint: 'If something seems too good to be true, stop and ask first.',
  },
  {
    id: 7,
    category: 'Links & Pop-ups',
    scenario: 'A game asks you to click a strange link to unlock free coins.',
    question: 'Should you click the link?',
    safe: false,
    correctAction: 'Do not click. Ask a trusted adult.',
    explanation:
      'Strange links can lead to unsafe websites or unwanted downloads.',
    hint: 'Free rewards are not always really free.',
  },
  {
    id: 8,
    category: 'Media Sharing',
    scenario: 'A friend wants to post a photo of you online without asking you.',
    question: 'Is it okay for them to post it without your permission?',
    safe: false,
    correctAction: 'Ask them not to post it without your permission.',
    explanation:
      'People should respect each other before sharing photos or videos of others.',
    hint: 'Would you want someone to post your picture without asking?',
  },
  {
    id: 9,
    category: 'Trusted Adults',
    scenario: 'You see something online that makes you uncomfortable or scared.',
    question: 'Should you hide it and keep browsing?',
    safe: false,
    correctAction: 'Stop and tell a trusted adult.',
    explanation:
      'You should never feel embarrassed about asking for help. Trusted adults can help you stay safe.',
    hint: 'When something feels wrong, you do not have to solve it alone.',
  },
  {
    id: 10,
    category: 'Trusted Adults',
    scenario: 'You want to download a new game and ask your parent first.',
    question: 'Is asking a trusted adult a safe choice?',
    safe: true,
    correctAction: 'Yes. Ask before downloading new apps or games.',
    explanation:
      'Trusted adults can help you check whether an app, game, or website is appropriate and safe.',
    hint: 'Asking first is a great safety habit.',
  },
  {
    id: 11,
    category: 'Personal Information',
    scenario: 'You are learning to type your first name on a computer with your teacher.',
    question: 'Is learning to type with a teacher safe?',
    safe: true,
    correctAction: 'Yes. Learn with a trusted adult or teacher.',
    explanation:
      'Learning computer skills is positive. Teachers and parents can help children use technology safely.',
    hint: 'Who is helping you?',
  },
  {
    id: 12,
    category: 'Media Sharing',
    scenario: 'You want to take a picture of your friend for a school project and ask permission first.',
    question: 'Is asking permission a good choice?',
    safe: true,
    correctAction: 'Yes. Ask permission before taking or sharing someone’s photo.',
    explanation:
      'Respecting other people’s privacy is an important part of being a good digital citizen.',
    hint: 'Ask before you share.',
  },
];

const CATEGORY_INFO: Record<
  SafetyCategory,
  {
    icon: React.ReactNode;
    description: string;
  }
> = {
  'Personal Information': {
  icon: <User className="w-5 h-5" />,
  description: 'Protect information about yourself.',
},
  Passwords: {
    icon: <Lock className="w-5 h-5" />,
    description: 'Keep your passwords private and secure.',
  },
  Strangers: {
    icon: <Shield className="w-5 h-5" />,
    description: 'Be careful when communicating with people online.',
  },
  Cyberbullying: {
  icon: <MessageCircle className="w-5 h-5" />,
  description: 'Know what to do when someone is unkind online.',
},
  'Links & Pop-ups': {
    icon: <MousePointer className="w-5 h-5" />,
    description: 'Think before clicking links and pop-ups.',
  },
  'Media Sharing': {
    icon: <Heart className="w-5 h-5" />,
    description: 'Respect privacy when sharing photos and videos.',
  },
  'Trusted Adults': {
    icon: <Heart className="w-5 h-5" />,
    description: 'Know when and how to ask for help.',
  },
};

export const DigitalSafety: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = SCENARIOS[index];
  const categoryInfo = CATEGORY_INFO[current.category];

  const progress = Math.round(
    (answered.length / SCENARIOS.length) * 100
  );

  const handleAnswer = (answer: boolean) => {
    if (selected !== null || answered.includes(current.id)) {
      return;
    }

    setSelected(answer);
    setAnswered((previous) => [...previous, current.id]);

    if (answer === current.safe) {
      setScore((previous) => previous + 10);
    }
  };

  const nextScenario = () => {
    if (answered.length >= SCENARIOS.length) {
      setCompleted(true);
      return;
    }

    const nextIndex = (index + 1) % SCENARIOS.length;

    setIndex(nextIndex);
    setSelected(null);
    setShowHint(false);
  };

  const resetModule = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered([]);
    setShowHint(false);
    setCompleted(false);
  };

  const isCorrect = selected === current.safe;

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-green-400" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Digital Safety Complete!
        </h3>

        <p className="text-gray-400 mb-5">
          Great work! You practiced important ways to stay safe and respectful
          while using technology.
        </p>

        <div className="bg-gray-900 rounded-xl p-4 mb-5">
          <p className="text-gray-400 text-sm">Your Score</p>
          <p className="text-4xl font-bold text-white mt-1">{score}</p>
          <p className="text-gray-500 text-sm mt-1">
            {SCENARIOS.length} safety situations completed
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-left mb-5">
          <p className="text-blue-300 font-bold mb-2">
            Remember the Safety Rule
          </p>
          <p className="text-gray-300 text-sm">
            If something online makes you uncomfortable, stop and tell a
            trusted adult.
          </p>
        </div>

        <button
          onClick={resetModule}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-colors"
        >
          Practice Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-semibold">Digital Citizenship</span>
          </div>

          <h3 className="text-2xl font-bold text-white">
            🔒 Digital Safety
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            Learn how to make safe and respectful choices online.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Score</p>
          <p className="text-xl font-bold text-white">{score}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Scenario {index + 1} of {SCENARIOS.length}
          </span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${Math.max(progress, 5)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 mb-4">
        <span className="text-blue-400">{categoryInfo.icon}</span>
        <div>
          <p className="text-white text-sm font-semibold">
            {current.category}
          </p>
          <p className="text-gray-500 text-xs">
            {categoryInfo.description}
          </p>
        </div>
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 mb-4"
      >
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">
          Situation
        </p>

        <p className="text-white font-semibold text-lg leading-relaxed mb-4">
          {current.scenario}
        </p>

        <div className="border-t border-gray-800 pt-4">
          <p className="text-gray-300 text-sm font-medium">
            {current.question}
          </p>
        </div>
      </motion.div>

      {!showHint && selected === null && (
        <button
          onClick={() => setShowHint(true)}
          className="w-full mb-4 py-2 text-sm text-yellow-300 hover:text-yellow-200 transition-colors"
        >
          💡 Need a hint?
        </button>
      )}

      {showHint && selected === null && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4"
        >
          <p className="text-yellow-300 text-sm">
            💡 {current.hint}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleAnswer(true)}
          disabled={selected !== null}
          className={`py-3 rounded-xl font-bold border-2 transition-all ${
            selected === true
              ? current.safe
                ? 'border-green-500 bg-green-500/20 text-green-400'
                : 'border-red-500 bg-red-500/20 text-red-400'
              : 'border-gray-700 bg-gray-800 text-white hover:border-green-500/50'
          } disabled:cursor-not-allowed`}
        >
          ✅ Safe
        </button>

        <button
          onClick={() => handleAnswer(false)}
          disabled={selected !== null}
          className={`py-3 rounded-xl font-bold border-2 transition-all ${
            selected === false
              ? !current.safe
                ? 'border-green-500 bg-green-500/20 text-green-400'
                : 'border-red-500 bg-red-500/20 text-red-400'
              : 'border-gray-700 bg-gray-800 text-white hover:border-red-500/50'
          } disabled:cursor-not-allowed`}
        >
          ❌ Unsafe
        </button>
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl p-4 border ${
            isCorrect
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Shield className="w-5 h-5 text-red-400" />
            )}

            <p
              className={`font-bold ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isCorrect ? 'Excellent choice!' : 'Let’s learn from this.'}
            </p>
          </div>

          <p className="text-gray-300 text-sm mb-2">
            <span className="font-semibold text-white">What to do: </span>
            {current.correctAction}
          </p>

          <p className="text-gray-400 text-sm">
            {current.explanation}
          </p>
        </motion.div>
      )}

      {selected !== null && (
        <button
          onClick={nextScenario}
          className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {answered.length >= SCENARIOS.length
            ? 'Finish Module'
            : 'Next Scenario'}

          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};