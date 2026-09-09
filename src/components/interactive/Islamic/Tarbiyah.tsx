import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  RotateCcw,
  Star,
  Target,
  Lightbulb,
  Heart,
  Shield,
} from "lucide-react";

type LearningMode = "guided" | "practice" | "mastery";

interface TarbiyahQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface TarbiyahLesson {
  id: string;
  title: string;
  emoji: string;
  principle: string;
  explanation: string;
  practice: string;
  reflection: string;
  keyPoints: string[];
  question: TarbiyahQuestion;
}

interface TarbiyahProgress {
  id: string;
  attempts: number;
  mastered: boolean;
}

interface TarbiyahProps {
  onComplete?: (score: number) => void;
}

const LESSONS: TarbiyahLesson[] = [
  {
    id: "sincerity",
    title: "Sincerity",
    emoji: "💚",
    principle: "Do good for the sake of Allah.",
    explanation:
      "A Muslim learns to make good actions sincerely for Allah and not only to receive praise from people.",
    practice:
      "Do one good action today without telling anyone about it.",
    reflection:
      "Why is it good to do something kind even when nobody notices?",
    keyPoints: [
      "Try to have a good intention.",
      "Good actions should not depend only on praise.",
      "Allah knows what is in our hearts.",
    ],
    question: {
      question:
        "You help someone, but nobody sees you. What is a good intention?",
      options: [
        "To help because it is good and pleasing to Allah",
        "To make sure everyone praises you",
        "To get a prize every time",
        "To make other people jealous",
      ],
      answer: "To help because it is good and pleasing to Allah",
      explanation:
        "Sincerity means trying to do good for Allah rather than only seeking people's praise.",
    },
  },
  {
    id: "truthfulness",
    title: "Truthfulness",
    emoji: "🗣️",
    principle: "Always try to tell the truth.",
    explanation:
      "Truthfulness is an important part of good character. A Muslim should be honest in words and actions.",
    practice:
      "Tell the truth even when it is difficult.",
    reflection:
      "How can telling the truth help people trust you?",
    keyPoints: [
      "Speak truthfully.",
      "Be honest about your actions.",
      "Admit mistakes instead of hiding them.",
    ],
    question: {
      question:
        "You accidentally break something. What should you do?",
      options: [
        "Tell the truth and take responsibility",
        "Blame somebody else",
        "Hide the broken item",
        "Tell a different story",
      ],
      answer: "Tell the truth and take responsibility",
      explanation:
        "Truthfulness means being honest, including when we make mistakes.",
    },
  },
  {
    id: "patience",
    title: "Patience",
    emoji: "🌱",
    principle: "Be patient when things are difficult.",
    explanation:
      "Sometimes learning, waiting, or dealing with problems can be difficult. Islam teaches us to develop patience and trust Allah.",
    practice:
      "When something frustrates you today, pause before reacting.",
    reflection:
      "What can you do when you feel impatient?",
    keyPoints: [
      "Pause before reacting.",
      "Keep trying when learning is difficult.",
      "Ask Allah for help and remain patient.",
    ],
    question: {
      question:
        "You cannot solve a difficult puzzle immediately. What shows patience?",
      options: [
        "Keep trying calmly",
        "Throw the puzzle away",
        "Shout at someone",
        "Give up immediately",
      ],
      answer: "Keep trying calmly",
      explanation:
        "Patience includes remaining calm and continuing to try when something is difficult.",
    },
  },
  {
    id: "gratitude",
    title: "Gratitude",
    emoji: "🤲",
    principle: "Be thankful for Allah's blessings.",
    explanation:
      "Muslims should recognize the blessings Allah gives them and respond with gratitude.",
    practice:
      "Name three blessings you are thankful for.",
    reflection:
      "What is one blessing you sometimes forget to appreciate?",
    keyPoints: [
      "Notice the blessings around you.",
      "Thank Allah for His blessings.",
      "Show gratitude through good actions.",
    ],
    question: {
      question:
        "Which action shows gratitude?",
      options: [
        "Thanking Allah and using blessings responsibly",
        "Complaining about everything",
        "Wasting food",
        "Ignoring people who help you",
      ],
      answer: "Thanking Allah and using blessings responsibly",
      explanation:
        "Gratitude includes recognizing blessings, thanking Allah, and using blessings responsibly.",
    },
  },
  {
    id: "kindness",
    title: "Kindness",
    emoji: "❤️",
    principle: "Treat others with kindness.",
    explanation:
      "A Muslim should show kindness to parents, family, friends, neighbours, animals, and other people.",
    practice:
      "Do something kind for another person today.",
    reflection:
      "How does kindness make a community better?",
    keyPoints: [
      "Use kind words.",
      "Help others when you can.",
      "Treat people and animals gently.",
    ],
    question: {
      question:
        "A classmate drops their books. What is a kind response?",
      options: [
        "Help them pick the books up",
        "Laugh at them",
        "Walk away while they struggle",
        "Hide one of their books",
      ],
      answer: "Help them pick the books up",
      explanation:
        "Kindness means looking for appropriate ways to help and care for others.",
    },
  },
  {
    id: "forgiveness",
    title: "Forgiveness",
    emoji: "🌿",
    principle: "Learn to forgive others.",
    explanation:
      "Holding onto anger can hurt our hearts. Islam teaches forgiveness and good character while also teaching us to seek help when a situation is serious or unsafe.",
    practice:
      "If someone makes a small mistake, try to respond calmly.",
    reflection:
      "Why can forgiveness sometimes be difficult?",
    keyPoints: [
      "Try not to hold onto unnecessary anger.",
      "Forgiveness can be a form of good character.",
      "Serious harm should be shared with a trusted adult.",
    ],
    question: {
      question:
        "A friend makes a small mistake and apologizes. What is a good response?",
      options: [
        "Try to forgive and respond calmly",
        "Insult the friend",
        "Keep trying to embarrass them",
        "Never speak to anyone again",
      ],
      answer: "Try to forgive and respond calmly",
      explanation:
        "Forgiving small mistakes can be an expression of good character.",
    },
  },
  {
    id: "responsibility",
    title: "Responsibility",
    emoji: "🎯",
    principle: "Take responsibility for your actions.",
    explanation:
      "Growing as a Muslim means learning to make responsible choices and correct our mistakes.",
    practice:
      "Complete one responsibility without being reminded.",
    reflection:
      "What responsibility can you take more seriously?",
    keyPoints: [
      "Complete tasks you are responsible for.",
      "Own your mistakes.",
      "Try to correct problems you cause.",
    ],
    question: {
      question:
        "You forget to complete an assigned task. What shows responsibility?",
      options: [
        "Admit it and work to complete it",
        "Blame another person",
        "Pretend you completed it",
        "Hide the task",
      ],
      answer: "Admit it and work to complete it",
      explanation:
        "Responsibility includes being honest about mistakes and trying to correct them.",
    },
  },
  {
    id: "courage",
    title: "Courage",
    emoji: "🦁",
    principle: "Have courage to do what is right.",
    explanation:
      "Courage does not mean never feeling afraid. It means trying to do what is right even when something is difficult.",
    practice:
      "Stand up for what is right in a respectful way.",
    reflection:
      "Can someone be afraid and still be courageous?",
    keyPoints: [
      "Courage does not mean having no fear.",
      "Choose what is right even when it is difficult.",
      "Ask a trusted adult for help when needed.",
    ],
    question: {
      question:
        "You see someone being treated unfairly. What can show courage?",
      options: [
        "Seek help and respond respectfully",
        "Join in the unfair behaviour",
        "Laugh at the person",
        "Make the situation worse",
      ],
      answer: "Seek help and respond respectfully",
      explanation:
        "Courage can mean doing the right thing and seeking appropriate help.",
    },
  },
  {
    id: "respect",
    title: "Respect",
    emoji: "🤝",
    principle: "Treat people with dignity and good manners.",
    explanation:
      "Respect means treating parents, teachers, friends, neighbours, and other people with appropriate kindness and good manners.",
    practice:
      "Listen carefully when someone is speaking to you.",
    reflection:
      "What does respectful listening look like?",
    keyPoints: [
      "Listen when others speak.",
      "Use appropriate manners.",
      "Respect differences without mocking people.",
    ],
    question: {
      question:
        "Someone is speaking to you. What shows respect?",
      options: [
        "Listen without interrupting unnecessarily",
        "Mock them",
        "Turn away and shout",
        "Ignore everything they say",
      ],
      answer: "Listen without interrupting unnecessarily",
      explanation:
        "Respect includes listening carefully and treating others with good manners.",
    },
  },
  {
    id: "self-control",
    title: "Self-Control",
    emoji: "🛡️",
    principle: "Learn to control your words and actions.",
    explanation:
      "A growing Muslim learns to pause, think, and choose a better response instead of immediately following every emotion.",
    practice:
      "When you become angry, pause and take a moment before speaking.",
    reflection:
      "What helps you calm down when you are upset?",
    keyPoints: [
      "Pause before reacting.",
      "Choose words carefully.",
      "Ask for help when emotions feel difficult to manage.",
    ],
    question: {
      question:
        "Someone makes you angry. What is a good first step?",
      options: [
        "Pause before responding",
        "Immediately shout",
        "Insult them",
        "Break something",
      ],
      answer: "Pause before responding",
      explanation:
        "Pausing gives you time to choose a better and more respectful response.",
    },
  },
  {
    id: "helpfulness",
    title: "Helpfulness",
    emoji: "🌟",
    principle: "Look for appropriate ways to help others.",
    explanation:
      "Good character includes being willing to help family members, classmates, neighbours, and others when it is safe and appropriate.",
    practice:
      "Offer useful help with one task today.",
    reflection:
      "What is one helpful thing you can do without being asked?",
    keyPoints: [
      "Look for appropriate opportunities to help.",
      "Do not expect praise for every good action.",
      "Ask before helping with something that may be unsafe.",
    ],
    question: {
      question:
        "Your parent is carrying several safe items. What could you do?",
      options: [
        "Offer to help",
        "Make the task harder",
        "Ignore them",
        "Hide the items",
      ],
      answer: "Offer to help",
      explanation:
        "Being helpful is a practical way to show good character and care for others.",
    },
  },
  {
    id: "humility",
    title: "Humility",
    emoji: "🌾",
    principle: "Be thankful without thinking you are better than others.",
    explanation:
      "Humility helps a person appreciate blessings without becoming arrogant or looking down on other people.",
    practice:
      "When you do something well, thank Allah and encourage someone else.",
    reflection:
      "How can you be proud of good work without looking down on others?",
    keyPoints: [
      "Be thankful for abilities and achievements.",
      "Do not look down on others.",
      "Encourage people around you.",
    ],
    question: {
      question:
        "You win a competition. What shows humility?",
      options: [
        "Be thankful and congratulate others",
        "Tell everyone they are worse than you",
        "Mock the other competitors",
        "Refuse to thank anyone",
      ],
      answer: "Be thankful and congratulate others",
      explanation:
        "Humility means appreciating success without becoming arrogant or disrespectful.",
    },
  },
];

const createInitialProgress = (): TarbiyahProgress[] =>
  LESSONS.map((lesson) => ({
    id: lesson.id,
    attempts: 0,
    mastered: false,
  }));

export const Tarbiyah: React.FC<TarbiyahProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>("guided");
  const [progress, setProgress] =
    useState<TarbiyahProgress[]>(createInitialProgress);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reflectionShown, setReflectionShown] = useState(false);
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
    updater: (item: TarbiyahProgress) => TarbiyahProgress
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === current.id ? updater(item) : item
      )
    );
  };

  const markGuidedComplete = () => {
    if (currentProgress.mastered) {
      setReflectionShown(true);
      return;
    }

    updateCurrentProgress((item) => ({
      ...item,
      attempts: item.attempts + 1,
      mastered: true,
    }));

    setScore((previous) => previous + 10);
    setStreak((previous) => previous + 1);
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

  const showReflection = () => {
    setReflectionShown(true);
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
    setScore(0);
    setStreak(0);
    setReflectionShown(false);
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
        <div className="text-7xl mb-5">🌱</div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Islamic Studies
        </p>

        <h3 className="text-3xl font-bold text-emerald-400 mt-2">
          Masha'Allah!
        </h3>

        <p className="text-gray-300 mt-3">
          You completed this Tarbiyah learning journey.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="bg-gray-900 rounded-2xl p-4">
            <Target className="w-5 h-5 mx-auto mb-2 text-emerald-400" />

            <p className="text-2xl font-bold text-white">
              {masteredCount}
            </p>

            <p className="text-xs text-gray-500">
              Mastered
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
            <Heart className="w-5 h-5 text-emerald-400" />
            What you are building
          </h4>

          <ul className="mt-4 space-y-2 text-sm text-gray-300 leading-6">
            <li>• Sincerity and awareness of intention.</li>
            <li>• Truthfulness and responsibility.</li>
            <li>• Patience and self-control.</li>
            <li>• Gratitude, kindness, and forgiveness.</li>
            <li>• Courage, respect, humility, and helpfulness.</li>
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Islamic Studies
            </p>

            <h3 className="text-2xl font-bold text-white mt-1">
              Tarbiyah
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Character, habits, self-development & good conduct
            </p>
          </div>

          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs text-gray-500">
                Score
              </p>
              <p className="font-bold text-white">
                {score}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Streak
              </p>
              <p className="font-bold text-white">
                {streak}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Mastery
              </p>
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

      {/* Modes */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            id: "guided" as const,
            title: "Guided",
            description: "Learn",
          },
          {
            id: "practice" as const,
            title: "Practice",
            description: "Think",
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

      {/* Lesson */}
      <motion.div
        key={`${current.id}-${mode}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-app-card border border-app-border rounded-3xl p-6 shadow-xl"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">
            {current.emoji}
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Lesson {index + 1} of {LESSONS.length}
          </p>

          <h4 className="text-2xl font-bold text-white mt-2">
            {current.title}
          </h4>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mt-5">
            <p className="text-emerald-400 font-semibold">
              {current.principle}
            </p>
          </div>

          <p className="text-gray-300 text-sm leading-7 mt-5">
            {current.explanation}
          </p>
        </div>

        {/* Guided Mode */}
        {mode === "guided" && (
          <>
            <div className="grid gap-3 sm:grid-cols-3 mt-6">
              {current.keyPoints.map((point) => (
                <div
                  key={point}
                  className="bg-gray-900 rounded-xl p-4 text-left"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />

                  <p className="text-sm text-gray-300 leading-6">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 mt-5">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                Practice Today
              </p>

              <p className="text-gray-200 text-sm leading-7 mt-2">
                {current.practice}
              </p>
            </div>

            <button
              type="button"
              onClick={markGuidedComplete}
              className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold mt-5"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              {currentProgress.mastered
                ? "Lesson Reviewed"
                : "I Understand & Practiced"}
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
                  Think About the Situation
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
                        : "Let's learn from this."}
                    </p>

                    <p className="text-sm leading-6 mt-2">
                      {selectedAnswer === current.question.answer
                        ? current.question.explanation
                        : `The best answer is "${current.question.answer}". ${current.question.explanation}`}
                    </p>
                  </div>
                )}

                {answerChecked && (
                  <div className="mt-4 bg-gray-950 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-emerald-400 shrink-0" />

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                          Practice Today
                        </p>

                        <p className="text-sm text-gray-300 leading-6 mt-2">
                          {current.practice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {answerChecked && !reflectionShown && (
                  <button
                    type="button"
                    onClick={showReflection}
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
              : "Next"}

            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="bg-app-card border border-app-border rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-white">
              Character Growth
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Good character develops through repeated practice.
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

      {/* Safety note */}
      <div className="bg-app-card border border-app-border rounded-2xl p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0" />

          <p className="text-xs text-gray-500 leading-5">
            Tarbiyah teaches positive character and age-appropriate
            decision-making. Children should speak to a trusted adult
            when they experience serious harm, bullying, danger, or
            situations they do not know how to handle.
          </p>
        </div>
      </div>
    </motion.div>
  );
};