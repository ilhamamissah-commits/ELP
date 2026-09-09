import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Star,
  Target,
  Lightbulb,
  Heart,
  BookOpen,
} from "lucide-react";

type LearningMode = "guided" | "practice" | "mastery";

interface SeerahQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface SeerahLesson {
  id: string;
  title: string;
  emoji: string;
  period: string;
  summary: string;
  detail: string;
  lessons: string[];
  reflection: string;
  question: SeerahQuestion;
}

interface SeerahProgress {
  id: string;
  attempts: number;
  mastered: boolean;
}

interface SeerahProps {
  onComplete?: (score: number) => void;
}

const LESSONS: SeerahLesson[] = [
  {
    id: "birth",
    title: "The Birth of Muhammad ﷺ",
    emoji: "🌙",
    period: "Makkah",
    summary:
      "Prophet Muhammad ﷺ was born in Makkah into Quraysh.",
    detail:
      "Muhammad ﷺ was born in Makkah in the year known as the Year of the Elephant. His father, Abdullah, died before his birth. His mother was Aminah bint Wahb. He belonged to Quraysh, the tribe that lived in Makkah.",
    lessons: [
      "Muhammad ﷺ was born in Makkah.",
      "He belonged to Quraysh.",
      "Allah later chose him as His final messenger.",
    ],
    reflection:
      "What can we learn from knowing that every person's life has important beginnings?",
    question: {
      question: "Where was Prophet Muhammad ﷺ born?",
      options: ["Makkah", "Madinah", "Cairo", "Damascus"],
      answer: "Makkah",
      explanation:
        "Prophet Muhammad ﷺ was born in Makkah.",
    },
  },
  {
    id: "childhood",
    title: "His Childhood",
    emoji: "🌱",
    period: "Early Life",
    summary:
      "Muhammad ﷺ experienced hardship early in his life and was cared for by family members.",
    detail:
      "Muhammad ﷺ lost his father before he was born and later lost his mother while he was still young. His grandfather cared for him for a time, followed by his uncle Abu Talib. His early experiences included both care and hardship.",
    lessons: [
      "He experienced loss while young.",
      "His family cared for him.",
      "Hardship can be met with patience and trust in Allah.",
    ],
    reflection:
      "How can a person remain patient when life becomes difficult?",
    question: {
      question:
        "What is one lesson we can learn from difficulties in early life?",
      options: [
        "We can respond with patience",
        "We should give up immediately",
        "We should become unkind",
        "We should stop helping others",
      ],
      answer: "We can respond with patience",
      explanation:
        "Hardship can teach patience, resilience, and reliance upon Allah.",
    },
  },
  {
    id: "al-amin",
    title: "Al-Amin",
    emoji: "🤝",
    period: "Before Prophethood",
    summary:
      "Muhammad ﷺ became known among his people for honesty and trustworthiness.",
    detail:
      "Before receiving revelation, Muhammad ﷺ was known among his people as Al-Amin, meaning the trustworthy. His honesty and reliability were recognized by the people of Makkah.",
    lessons: [
      "He was known for honesty.",
      "People trusted him.",
      "Good character matters before leadership.",
    ],
    reflection:
      "Why is trust important in friendships and communities?",
    question: {
      question: "What does Al-Amin mean?",
      options: [
        "The trustworthy",
        "The strongest",
        "The fastest",
        "The wealthiest",
      ],
      answer: "The trustworthy",
      explanation:
        "Al-Amin means the trustworthy, a name associated with Muhammad ﷺ before his prophethood.",
    },
  },
  {
    id: "khadijah",
    title: "Khadijah رضي الله عنها",
    emoji: "🤍",
    period: "Family Life",
    summary:
      "Khadijah رضي الله عنها was the wife of Muhammad ﷺ and supported him during the early years of his mission.",
    detail:
      "Khadijah رضي الله عنها was a respected woman of Makkah and the first wife of Muhammad ﷺ. She supported him when he received the first revelation and remained an important source of comfort and encouragement.",
    lessons: [
      "Strong families can support one another.",
      "Khadijah رضي الله عنها showed courage and support.",
      "Supporting someone through difficulty is valuable.",
    ],
    reflection:
      "How can you support someone who is going through a difficult time?",
    question: {
      question:
        "How did Khadijah رضي الله عنها respond when Muhammad ﷺ experienced the first revelation?",
      options: [
        "She supported and comforted him",
        "She ignored him",
        "She laughed at him",
        "She told him to leave Makkah immediately",
      ],
      answer: "She supported and comforted him",
      explanation:
        "Khadijah رضي الله عنها supported and comforted Muhammad ﷺ during this important and difficult moment.",
    },
  },
  {
    id: "revelation",
    title: "The First Revelation",
    emoji: "📖",
    period: "Makkah",
    summary:
      "Allah began revealing the Qur'an to Muhammad ﷺ through Jibril عليه السلام.",
    detail:
      "When Muhammad ﷺ was forty years old, the first revelation came to him while he was in the Cave of Hira. Jibril عليه السلام brought revelation from Allah. The beginning of Surah Al-'Alaq contains the first revealed verses.",
    lessons: [
      "The Qur'an is revelation from Allah.",
      "Jibril عليه السلام brought revelation to the Prophet ﷺ.",
      "Muhammad ﷺ was chosen as Allah's messenger.",
    ],
    reflection:
      "Why is learning and reading important in Islam?",
    question: {
      question: "Who brought the revelation to Muhammad ﷺ?",
      options: [
        "Jibril عليه السلام",
        "Abu Talib",
        "Abu Bakr رضي الله عنه",
        "Bilal رضي الله عنه",
      ],
      answer: "Jibril عليه السلام",
      explanation:
        "Jibril عليه السلام brought Allah's revelation to Prophet Muhammad ﷺ.",
    },
  },
  {
    id: "makkah",
    title: "The Call in Makkah",
    emoji: "🕋",
    period: "Makkah",
    summary:
      "The Prophet ﷺ called people to worship Allah alone and leave false worship.",
    detail:
      "The message of the Prophet ﷺ began with calling people to worship Allah alone. He taught people about faith, accountability, righteous behaviour, and the coming of the Last Day. Many people opposed his message, but he remained patient.",
    lessons: [
      "Tawhid was central to his message.",
      "The Prophet ﷺ remained patient.",
      "He continued calling people to what is right.",
    ],
    reflection:
      "What can you do when people disagree with something you believe is right?",
    question: {
      question:
        "What was at the heart of the Prophet's message in Makkah?",
      options: [
        "Worship Allah alone",
        "Become wealthy",
        "Become famous",
        "Win every argument",
      ],
      answer: "Worship Allah alone",
      explanation:
        "Calling people to worship Allah alone was central to the Prophet's message.",
    },
  },
  {
    id: "persecution",
    title: "Patience Through Hardship",
    emoji: "🌿",
    period: "Makkah",
    summary:
      "The Prophet ﷺ and the early Muslims experienced opposition and hardship.",
    detail:
      "The early Muslims faced opposition, insults, persecution, and other hardships. Despite these difficulties, the Prophet ﷺ taught patience, faith, and perseverance. The believers continued to hold onto their faith.",
    lessons: [
      "Faith can be tested by difficulty.",
      "Patience is important.",
      "Believers should seek appropriate help during serious harm.",
    ],
    reflection:
      "Who can you speak to when you are facing a serious problem?",
    question: {
      question:
        "How did the Prophet ﷺ respond to opposition?",
      options: [
        "With patience and perseverance",
        "By abandoning his message",
        "By becoming dishonest",
        "By encouraging cruelty",
      ],
      answer: "With patience and perseverance",
      explanation:
        "The Prophet ﷺ remained patient and continued his mission despite opposition.",
    },
  },
  {
    id: "hijrah",
    title: "The Hijrah",
    emoji: "🐪",
    period: "Migration",
    summary:
      "The Prophet ﷺ and many believers migrated from Makkah to Madinah.",
    detail:
      "The Hijrah was the migration of the Prophet ﷺ and his companions from Makkah to Madinah. It was a major turning point in Islamic history. The migration involved planning, sacrifice, courage, and trust in Allah.",
    lessons: [
      "The believers made sacrifices for their faith.",
      "Trusting Allah goes together with taking responsible action.",
      "The Hijrah was a major turning point in Islamic history.",
    ],
    reflection:
      "What does it mean to trust Allah while also doing your best?",
    question: {
      question: "What does Hijrah refer to in the Seerah?",
      options: [
        "The migration from Makkah to Madinah",
        "The first revelation",
        "The birth of the Prophet ﷺ",
        "The building of the Ka'bah",
      ],
      answer: "The migration from Makkah to Madinah",
      explanation:
        "The Hijrah refers to the migration of the Prophet ﷺ and the believers from Makkah to Madinah.",
    },
  },
  {
    id: "madinah",
    title: "Building Madinah",
    emoji: "🏘️",
    period: "Madinah",
    summary:
      "The Prophet ﷺ helped establish a community based on faith, brotherhood, justice, and cooperation.",
    detail:
      "In Madinah, the Prophet ﷺ helped establish a Muslim community. The Muhajirun and Ansar were connected through bonds of brotherhood, and the community developed systems for worship, cooperation, justice, and social responsibility.",
    lessons: [
      "Strong communities need cooperation.",
      "Muslims should care for one another.",
      "Justice and responsibility matter in community life.",
    ],
    reflection:
      "What can you do to make your classroom, home, or community better?",
    question: {
      question:
        "What helped strengthen the community in Madinah?",
      options: [
        "Brotherhood and cooperation",
        "Constant arguments",
        "Selfishness",
        "Ignoring people in need",
      ],
      answer: "Brotherhood and cooperation",
      explanation:
        "Brotherhood, cooperation, faith, and responsibility helped strengthen the community in Madinah.",
    },
  },
  {
    id: "mercy",
    title: "The Mercy of the Prophet ﷺ",
    emoji: "❤️",
    period: "His Character",
    summary:
      "The Prophet ﷺ was known for mercy, patience, kindness, and good character.",
    detail:
      "The Prophet ﷺ showed mercy and kindness in many parts of his life. His character provides Muslims with an example of patience, generosity, forgiveness, gentleness, and concern for others.",
    lessons: [
      "Mercy is part of good character.",
      "Kindness should be shown to others.",
      "The Prophet ﷺ is an example for Muslims.",
    ],
    reflection:
      "How can you show mercy to someone today?",
    question: {
      question:
        "Which quality was an important part of the Prophet's character?",
      options: [
        "Mercy",
        "Cruelty",
        "Dishonesty",
        "Arrogance",
      ],
      answer: "Mercy",
      explanation:
        "Mercy and good character were important qualities in the life of Prophet Muhammad ﷺ.",
    },
  },
  {
    id: "conquest-makkah",
    title: "The Return to Makkah",
    emoji: "🕋",
    period: "Later Madinah",
    summary:
      "The Muslims eventually returned to Makkah, and the Prophet ﷺ demonstrated mercy and forgiveness.",
    detail:
      "After years of difficulty and conflict, the Muslims entered Makkah. The Prophet ﷺ demonstrated humility and mercy, and the event became an important part of the later history of Islam.",
    lessons: [
      "Success should not make a person arrogant.",
      "Forgiveness can be powerful.",
      "The Prophet ﷺ demonstrated mercy.",
    ],
    reflection:
      "How can you remain humble when you succeed?",
    question: {
      question:
        "What character lesson can we learn from the Prophet ﷺ during the return to Makkah?",
      options: [
        "Mercy and humility",
        "Arrogance",
        "Revenge for every mistake",
        "Mocking others",
      ],
      answer: "Mercy and humility",
      explanation:
        "The return to Makkah provides important lessons about mercy, forgiveness, and humility.",
    },
  },
  {
    id: "final-sermon",
    title: "The Final Sermon",
    emoji: "📜",
    period: "Madinah",
    summary:
      "During his final Hajj, the Prophet ﷺ delivered an important sermon reminding people of major principles of Islam.",
    detail:
      "During the Farewell Hajj, the Prophet ﷺ addressed the Muslims and taught important principles concerning faith, responsibility, justice, rights, and human dignity. The event is an important part of the final period of his mission.",
    lessons: [
      "People have responsibilities toward one another.",
      "Justice and good treatment matter.",
      "The Prophet ﷺ taught Muslims important principles for community life.",
    ],
    reflection:
      "What is one way you can treat other people fairly?",
    question: {
      question:
        "What is one important theme connected with the Prophet's final sermon?",
      options: [
        "Responsibility and good treatment of others",
        "Making fun of others",
        "Being selfish",
        "Ignoring justice",
      ],
      answer: "Responsibility and good treatment of others",
      explanation:
        "The Prophet's final sermon included important teachings concerning responsibilities, rights, and good treatment.",
    },
  },
  {
    id: "final-prophet",
    title: "The Final Prophet",
    emoji: "🌙",
    period: "His Mission",
    summary:
      "Muhammad ﷺ is the final prophet and messenger of Allah.",
    detail:
      "Muslims believe that Muhammad ﷺ is the final prophet and messenger of Allah. Muslims love and respect him and follow his authentic Sunnah as part of following Allah's guidance.",
    lessons: [
      "Muhammad ﷺ is the final prophet.",
      "Muslims love and respect him.",
      "Muslims learn from his authentic Sunnah.",
    ],
    reflection:
      "How can learning about the Prophet ﷺ influence your character?",
    question: {
      question: "What do Muslims believe about Prophet Muhammad ﷺ?",
      options: [
        "He is the final prophet and messenger of Allah",
        "He was the first human being",
        "He was an angel",
        "He was a king of every country",
      ],
      answer: "He is the final prophet and messenger of Allah",
      explanation:
        "Muslims believe that Muhammad ﷺ is the final prophet and messenger of Allah.",
    },
  },
];

const createInitialProgress = (): SeerahProgress[] =>
  LESSONS.map((lesson) => ({
    id: lesson.id,
    attempts: 0,
    mastered: false,
  }));

export const Seerah: React.FC<SeerahProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>("guided");
  const [progress, setProgress] =
    useState<SeerahProgress[]>(createInitialProgress);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [reflectionShown, setReflectionShown] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const current = LESSONS[index];

  const currentProgress = useMemo(
    () =>
      progress.find((item) => item.id === current.id) ?? {
        id: current.id,
        attempts: 0,
        mastered: false,
      },
    [progress, current.id]
  );

  const masteredCount = progress.filter(
    (item) => item.mastered
  ).length;

  const masteryPercentage = Math.round(
    (masteredCount / LESSONS.length) * 100
  );

  const updateCurrentProgress = (
    updater: (item: SeerahProgress) => SeerahProgress
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === current.id ? updater(item) : item
      )
    );
  };

  const completeGuided = () => {
    if (!currentProgress.mastered) {
      updateCurrentProgress((item) => ({
        ...item,
        attempts: item.attempts + 1,
        mastered: true,
      }));

      setScore((previous) => previous + 10);
      setStreak((previous) => previous + 1);
    }

    setReflectionShown(true);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || answerChecked) {
      return;
    }

    const correct =
      selectedAnswer === current.question.answer;

    setAnswerChecked(true);

    updateCurrentProgress((item) => ({
      ...item,
      attempts: item.attempts + 1,
    }));

    if (!correct) {
      setStreak(0);
      return;
    }

    const nextStreak = streak + 1;

    setStreak(nextStreak);

    if (mode === "mastery" && !currentProgress.mastered) {
      const bonus = nextStreak >= 2 ? 5 : 0;

      setScore((previous) => previous + 10 + bonus);

      updateCurrentProgress((item) => ({
        ...item,
        mastered: true,
      }));
    }
  };

  const next = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);

    if (index < LESSONS.length - 1) {
      setIndex((previous) => previous + 1);
    } else {
      setIsComplete(true);
    }
  };

  const previous = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);

    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  };

  const reset = () => {
    setIndex(0);
    setMode("guided");
    setProgress(createInitialProgress());
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
    setHasFinished(false);
  };

  const finish = () => {
    if (hasFinished) {
      return;
    }

    setHasFinished(true);
    onComplete?.(score);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-app-card p-8 rounded-3xl border border-app-border shadow-xl text-center"
      >
        <div className="text-7xl mb-5">🌙</div>

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Islamic Studies
        </p>

        <h3 className="text-3xl font-bold text-emerald-400 mt-2">
          Masha'Allah!
        </h3>

        <p className="text-gray-300 mt-3">
          You completed the Seerah foundation journey.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="bg-gray-900 rounded-2xl p-4">
            <Target className="w-5 h-5 mx-auto mb-2 text-emerald-400" />

            <p className="text-2xl font-bold text-white">
              {masteredCount}
            </p>

            <p className="text-xs text-gray-500">
              Events mastered
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <Star className="w-5 h-5 mx-auto mb-2 text-yellow-400" />

            <p className="text-2xl font-bold text-white">
              {score}
            </p>

            <p className="text-xs text-gray-500">
              Points
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />

            <p className="text-2xl font-bold text-white">
              {masteryPercentage}%
            </p>

            <p className="text-xs text-gray-500">
              Mastery
            </p>
          </div>
        </div>

        <div className="text-left bg-gray-900 rounded-2xl p-5 mt-6">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Learning outcomes
          </h4>

          <ul className="mt-4 space-y-2 text-sm text-gray-300 leading-6">
            <li>• Understand key stages of the Prophet's life ﷺ.</li>
            <li>• Recognize important events in Makkah and Madinah.</li>
            <li>• Understand lessons of patience, mercy, and trust.</li>
            <li>• Recognize the importance of the Prophet's character.</li>
            <li>• Understand that Muhammad ﷺ is the final prophet.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button
            type="button"
            onClick={reset}
            className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-700 transition"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Learn Again
          </button>

          <button
            type="button"
            onClick={finish}
            disabled={hasFinished}
            className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold disabled:opacity-50"
          >
            {hasFinished
              ? "Completed"
              : "Finish & Move Up"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-4"
    >
      {/* Header */}
      <div className="bg-app-card p-6 rounded-3xl border border-app-border shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Islamic Studies
            </p>

            <h3 className="text-2xl font-bold text-white mt-1">
              Seerah
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              The life and mission of Prophet Muhammad ﷺ
            </p>
          </div>

          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs text-gray-500">Score</p>
              <p className="font-bold text-white">{score}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Streak</p>
              <p className="font-bold text-white">{streak}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Mastery</p>
              <p className="font-bold text-white">
                {masteredCount}/{LESSONS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((index + 1) / LESSONS.length) * 100}%`,
            }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Learning Modes */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            id: "guided" as const,
            title: "Guided",
            description: "Learn the story",
          },
          {
            id: "practice" as const,
            title: "Practice",
            description: "Check understanding",
          },
          {
            id: "mastery" as const,
            title: "Mastery",
            description: "Show what you know",
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`rounded-xl p-3 text-left border transition ${
              mode === item.id
                ? "bg-emerald-600 border-emerald-500 text-white"
                : "bg-app-card border-app-border text-gray-400 hover:border-gray-600"
            }`}
          >
            <p className="text-sm font-bold">
              {item.title}
            </p>

            <p className="text-xs mt-1 opacity-80">
              {item.description}
            </p>
          </button>
        ))}
      </div>

      {/* Main Lesson */}
      <motion.div
        key={`${current.id}-${mode}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-app-card border border-app-border rounded-3xl p-6 shadow-xl"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">
            {current.emoji}
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
            {current.period}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Event {index + 1} of {LESSONS.length}
          </p>

          <h4 className="text-2xl font-bold text-white mt-2">
            {current.title}
          </h4>

          <p className="text-gray-300 text-sm leading-7 mt-5">
            {current.summary}
          </p>
        </div>

        {/* Guided */}
        {mode === "guided" && (
          <>
            <div className="bg-gray-900 rounded-2xl p-5 mt-6">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                Explore
              </p>

              <p className="text-sm text-gray-300 leading-7 mt-2">
                {current.detail}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 mt-5">
              {current.lessons.map((lesson) => (
                <div
                  key={lesson}
                  className="bg-gray-900 rounded-xl p-4"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />

                  <p className="text-sm text-gray-300 leading-6">
                    {lesson}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={completeGuided}
              className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold mt-5"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />

              {currentProgress.mastered
                ? "Review Complete"
                : "I Understand This"}
            </button>

            {reflectionShown && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mt-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Think About It
                    </p>

                    <p className="text-sm text-gray-300 leading-6 mt-2">
                      {current.reflection}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Practice / Mastery */}
        {mode !== "guided" && (
          <div className="mt-6 bg-gray-900 rounded-2xl p-5">
            <div className="flex gap-3">
              <Target className="w-5 h-5 text-emerald-400 shrink-0" />

              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Check Your Understanding
                </p>

                <p className="text-sm text-gray-300 leading-6 mt-2">
                  {current.question.question}
                </p>

                <div className="space-y-2 mt-4">
                  {current.question.options.map((option) => {
                    const selected =
                      selectedAnswer === option;

                    const correct =
                      answerChecked &&
                      option === current.question.answer;

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={answerChecked}
                        onClick={() =>
                          setSelectedAnswer(option)
                        }
                        className={`w-full p-4 rounded-xl border text-left text-sm transition ${
                          correct
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                            : selected
                              ? "border-indigo-500 bg-indigo-500/10 text-white"
                              : "border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {!answerChecked && (
                  <button
                    type="button"
                    disabled={!selectedAnswer}
                    onClick={checkAnswer}
                    className="w-full mt-4 py-3 bg-indigo-600 rounded-xl text-white font-bold disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                )}

                {answerChecked && (
                  <div
                    className={`mt-4 p-4 rounded-xl ${
                      selectedAnswer === current.question.answer
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    <p className="font-semibold">
                      {selectedAnswer === current.question.answer
                        ? "Correct!"
                        : "Let's review this event."}
                    </p>

                    <p className="text-sm leading-6 mt-2">
                      {selectedAnswer === current.question.answer
                        ? current.question.explanation
                        : `The best answer is "${current.question.answer}". ${current.question.explanation}`}
                    </p>
                  </div>
                )}

                {answerChecked && !reflectionShown && (
                  <button
                    type="button"
                    onClick={() => setReflectionShown(true)}
                    className="w-full mt-4 py-3 border border-gray-700 rounded-xl text-gray-200 font-semibold hover:bg-gray-800 transition"
                  >
                    Reflect on This
                  </button>
                )}

                {reflectionShown && (
                  <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />

                      <div>
                        <p className="font-semibold text-white">
                          Reflection
                        </p>

                        <p className="text-sm text-gray-300 leading-6 mt-2">
                          {current.reflection}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-7 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={previous}
            disabled={index === 0}
            className="px-4 py-3 bg-gray-800 rounded-xl text-gray-300 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={next}
            className="flex-1 py-3 bg-indigo-600 rounded-xl text-white font-bold"
          >
            {index === LESSONS.length - 1
              ? "Complete"
              : "Next Event"}

            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="bg-app-card border border-app-border rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Seerah Progress
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Understanding grows through repeated learning and reflection.
            </p>
          </div>

          <p className="text-sm font-bold text-emerald-400">
            {masteredCount}/{LESSONS.length}
          </p>
        </div>

        <div className="grid grid-cols-8 gap-2 mt-4">
          {progress.map((item) => (
            <div
              key={item.id}
              className={`h-2 rounded-full ${
                item.mastered
                  ? "bg-emerald-500"
                  : item.attempts > 0
                    ? "bg-yellow-400"
                    : "bg-gray-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Curriculum Note */}
      <div className="bg-app-card border border-app-border rounded-2xl p-4">
        <div className="flex gap-3">
          <Heart className="w-5 h-5 text-emerald-400 shrink-0" />

          <p className="text-xs text-gray-500 leading-5">
            This is an introductory Seerah sequence designed for
            age-appropriate learning. Detailed historical narratives,
            dates, reports, and Hadith references should be expanded and
            reviewed against reliable Islamic sources before being used
            as advanced curriculum content.
          </p>
        </div>
      </div>
    </motion.div>
  );
};