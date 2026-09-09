import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Star,
  Heart,
  MessageCircle,
  Shield,
  Users,
  Sparkles,
  Target,
  Lightbulb,
} from "lucide-react";

type LearningMode = "guided" | "practice" | "mastery";

interface MannersQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface MannersLesson {
  id: string;
  title: string;
  arabicTitle: string;
  emoji: string;
  category: string;
  situation: string;
  goodChoice: string;
  explanation: string;
  keyPoints: string[];
  reflection: string;
  question: MannersQuestion;
}

interface MannersProgress {
  id: string;
  attempts: number;
  mastered: boolean;
}

interface IslamicMannersProps {
  onComplete?: (score: number) => void;
}

const LESSONS: MannersLesson[] = [
  {
    id: "parents",
    title: "Respecting Parents",
    arabicTitle: "بِرُّ الْوَالِدَيْنِ",
    emoji: "👨‍👩‍👧",
    category: "Family",
    situation:
      "Your parent asks you to help with something while you are playing.",
    goodChoice:
      "Pause respectfully, listen carefully, and try to help.",
    explanation:
      "Islam teaches children to treat their parents with kindness, respect, gratitude, and good speech. Children should obey their parents in what is good and appropriate.",
    keyPoints: [
      "Speak respectfully to your parents.",
      "Listen when they speak to you.",
      "Help with appropriate tasks.",
      "Show gratitude for the care they provide.",
    ],
    reflection:
      "What is one helpful thing you could do for your parent today?",
    question: {
      question:
        "What is a good way to respond when your parent asks for help?",
      options: [
        "Ignore them",
        "Speak rudely",
        "Respond respectfully and try to help",
        "Shout that you are busy",
      ],
      answer: "Respond respectfully and try to help",
      explanation:
        "Respectful speech and helping our parents with appropriate requests are important aspects of good character.",
    },
  },
  {
    id: "greeting",
    title: "Giving Salam",
    arabicTitle: "السَّلَامُ",
    emoji: "👋",
    category: "Greetings",
    situation:
      "You meet another Muslim at school, at home, or in your community.",
    goodChoice:
      "Greet them warmly with Assalamu Alaikum.",
    explanation:
      "Salam is a beautiful Islamic greeting. It is a way of wishing peace and goodness for another person.",
    keyPoints: [
      "Use the Islamic greeting respectfully.",
      "Return Salam when someone greets you.",
      "Greet people warmly.",
      "Use good manners when meeting others.",
    ],
    reflection:
      "Who could you greet with Salam today?",
    question: {
      question: "What should you say when greeting another Muslim?",
      options: [
        "Go away",
        "Assalamu Alaikum",
        "Be quiet",
        "Nothing",
      ],
      answer: "Assalamu Alaikum",
      explanation:
        "Assalamu Alaikum is the Islamic greeting meaning peace be upon you.",
    },
  },
  {
    id: "eating",
    title: "Eating with Good Manners",
    arabicTitle: "آدَابُ الطَّعَامِ",
    emoji: "🍽️",
    category: "Daily Life",
    situation:
      "You are about to eat a meal with your family.",
    goodChoice:
      "Remember Allah, use good manners, and eat respectfully.",
    explanation:
      "Islam teaches Muslims to remember Allah before eating, use the right hand, avoid waste, and show gratitude for food.",
    keyPoints: [
      "Remember Allah before eating.",
      "Eat with the right hand.",
      "Do not waste food.",
      "Be grateful for what you have.",
    ],
    reflection:
      "What can you remember to do before your next meal?",
    question: {
      question: "Which is an example of good eating manners?",
      options: [
        "Wasting food",
        "Throwing food",
        "Remembering Allah and eating respectfully",
        "Making a mess on purpose",
      ],
      answer: "Remembering Allah and eating respectfully",
      explanation:
        "Remembering Allah and eating respectfully are part of Islamic manners.",
    },
  },
  {
    id: "neighbour",
    title: "Being Good to Neighbours",
    arabicTitle: "حَقُّ الْجَارِ",
    emoji: "🏠",
    category: "Community",
    situation:
      "Your neighbour needs help carrying something that is safe for you to carry.",
    goodChoice:
      "Offer to help if you are able and it is safe.",
    explanation:
      "Islam places importance on treating neighbours well. Good neighbours show kindness, respect, consideration, and helpfulness.",
    keyPoints: [
      "Treat neighbours kindly.",
      "Respect their space.",
      "Help when you can.",
      "Avoid actions that disturb or harm others.",
    ],
    reflection:
      "What is one kind thing you could do for someone near your home?",
    question: {
      question: "How should a Muslim treat their neighbours?",
      options: [
        "With kindness and respect",
        "By disturbing them",
        "By ignoring every need",
        "By making their lives difficult",
      ],
      answer: "With kindness and respect",
      explanation:
        "Good treatment of neighbours is an important part of Islamic character.",
    },
  },
  {
    id: "cleanliness",
    title: "Cleanliness",
    arabicTitle: "النَّظَافَةُ",
    emoji: "🧼",
    category: "Purity",
    situation:
      "You notice that your learning area has become untidy.",
    goodChoice:
      "Help clean and organize the area.",
    explanation:
      "Cleanliness and purification are important in Muslim life. We learn to care for our bodies, clothing, homes, learning spaces, and places of worship.",
    keyPoints: [
      "Keep your body clean.",
      "Keep your belongings organized.",
      "Help care for shared spaces.",
      "Avoid unnecessary waste and mess.",
    ],
    reflection:
      "What space could you clean or organize today?",
    question: {
      question: "What should you do when you notice a shared space is dirty?",
      options: [
        "Make it dirtier",
        "Ignore it every time",
        "Help clean it when appropriate",
        "Blame someone else",
      ],
      answer: "Help clean it when appropriate",
      explanation:
        "Taking care of shared spaces is a practical way to practise cleanliness and responsibility.",
    },
  },
  {
    id: "kind-speech",
    title: "Kind Speech",
    arabicTitle: "حُسْنُ الْكَلَامِ",
    emoji: "💬",
    category: "Speech",
    situation:
      "A classmate makes a mistake while answering a question.",
    goodChoice:
      "Avoid laughing at them and respond with kindness.",
    explanation:
      "A Muslim should guard their speech and avoid insulting, mocking, embarrassing, or deliberately hurting other people.",
    keyPoints: [
      "Choose kind words.",
      "Do not mock people for mistakes.",
      "Encourage others.",
      "Think before speaking.",
    ],
    reflection:
      "What kind words could you say when someone makes a mistake?",
    question: {
      question: "What should you do when someone makes a mistake?",
      options: [
        "Laugh at them",
        "Mock them",
        "Encourage them kindly",
        "Tell everyone about their mistake",
      ],
      answer: "Encourage them kindly",
      explanation:
        "Good character means helping people feel respected rather than embarrassing them.",
    },
  },
  {
    id: "truth",
    title: "Being Truthful",
    arabicTitle: "الصِّدْقُ",
    emoji: "🛡️",
    category: "Character",
    situation:
      "You accidentally break something and nobody saw what happened.",
    goodChoice:
      "Tell the truth and take responsibility.",
    explanation:
      "Truthfulness is an important part of Islamic character. Being honest includes admitting mistakes rather than deliberately deceiving others.",
    keyPoints: [
      "Tell the truth.",
      "Admit mistakes.",
      "Take responsibility.",
      "Do not blame innocent people.",
    ],
    reflection:
      "Why is it important for people to trust you?",
    question: {
      question: "What should you do after accidentally breaking something?",
      options: [
        "Lie about it",
        "Blame someone else",
        "Tell the truth and take responsibility",
        "Hide forever",
      ],
      answer: "Tell the truth and take responsibility",
      explanation:
        "Honesty and responsibility help build trust and strong character.",
    },
  },
  {
    id: "sharing",
    title: "Sharing with Others",
    arabicTitle: "الإِيثَارُ",
    emoji: "🤲",
    category: "Generosity",
    situation:
      "You have more than enough of something useful and another child has none.",
    goodChoice:
      "Share when appropriate and when the item can safely be shared.",
    explanation:
      "Generosity means caring about others and sharing what we can. Children can practise generosity through small acts of giving and consideration.",
    keyPoints: [
      "Think about the needs of others.",
      "Share appropriate things.",
      "Give without demanding praise.",
      "Be grateful for what you have.",
    ],
    reflection:
      "What is something safe and appropriate that you could share?",
    question: {
      question: "What is an example of generosity?",
      options: [
        "Keeping everything for yourself",
        "Sharing something appropriate with someone who needs it",
        "Taking another person's belongings",
        "Refusing to help anyone",
      ],
      answer:
        "Sharing something appropriate with someone who needs it",
      explanation:
        "Sharing appropriate things with others is one way to practise generosity.",
    },
  },
  {
    id: "forgiveness",
    title: "Forgiving Others",
    arabicTitle: "الْعَفْوُ",
    emoji: "🤍",
    category: "Character",
    situation:
      "A friend makes a mistake and sincerely apologizes.",
    goodChoice:
      "Accept the apology when appropriate and try to forgive.",
    explanation:
      "Islam encourages forgiveness and mercy. Forgiving does not mean ignoring serious harm or staying silent about unsafe behaviour. Children should involve a trusted adult when needed.",
    keyPoints: [
      "Try to forgive sincere mistakes.",
      "Do not seek revenge.",
      "Ask for help when a situation is serious or unsafe.",
      "Learn from mistakes.",
    ],
    reflection:
      "How does forgiveness help friendships?",
    question: {
      question: "What is a good response to a sincere apology?",
      options: [
        "Seek revenge",
        "Try to forgive when appropriate",
        "Insult the person",
        "Tell everyone about the mistake",
      ],
      answer: "Try to forgive when appropriate",
      explanation:
        "Forgiveness can help repair relationships and develop good character.",
    },
  },
  {
    id: "respect",
    title: "Respecting Others",
    arabicTitle: "الاحْتِرَامُ",
    emoji: "🤝",
    category: "Relationships",
    situation:
      "Someone in your class has a different opinion from yours.",
    goodChoice:
      "Listen respectfully and respond without insulting them.",
    explanation:
      "Good manners include listening, speaking respectfully, and avoiding insults. We can disagree with someone while still treating them with dignity.",
    keyPoints: [
      "Listen when others speak.",
      "Disagree respectfully.",
      "Avoid insults.",
      "Give others a chance to explain themselves.",
    ],
    reflection:
      "How can you disagree with someone without being rude?",
    question: {
      question: "What should you do when someone has a different opinion?",
      options: [
        "Insult them",
        "Shout at them",
        "Listen and respond respectfully",
        "Refuse to let them speak",
      ],
      answer: "Listen and respond respectfully",
      explanation:
        "Respectful disagreement is an important social skill and part of good character.",
    },
  },
  {
    id: "asking-permission",
    title: "Asking Permission",
    arabicTitle: "الاسْتِئْذَانُ",
    emoji: "🚪",
    category: "Respect",
    situation:
      "You want to enter a room where someone is already inside.",
    goodChoice:
      "Knock or ask permission respectfully before entering.",
    explanation:
      "Islam teaches respect for privacy. Asking permission helps people feel safe and respected in their homes and personal spaces.",
    keyPoints: [
      "Respect people's privacy.",
      "Ask permission before entering.",
      "Do not secretly enter private spaces.",
      "Wait patiently for a response.",
    ],
    reflection:
      "Why is privacy important?",
    question: {
      question: "What should you do before entering someone's private room?",
      options: [
        "Enter without asking",
        "Ask permission",
        "Shout through the door",
        "Take their belongings",
      ],
      answer: "Ask permission",
      explanation:
        "Asking permission is a respectful way to protect another person's privacy.",
    },
  },
  {
    id: "gratitude",
    title: "Showing Gratitude",
    arabicTitle: "الشُّكْرُ",
    emoji: "🌟",
    category: "Character",
    situation:
      "Someone gives you something helpful or does something kind for you.",
    goodChoice:
      "Thank them sincerely and appreciate their kindness.",
    explanation:
      "Gratitude helps us recognize the good that Allah and other people bring into our lives.",
    keyPoints: [
      "Thank Allah for blessings.",
      "Thank people for their kindness.",
      "Do not take everything for granted.",
      "Show appreciation through words and actions.",
    ],
    reflection:
      "Who is someone you could thank today?",
    question: {
      question: "What is a good response when someone helps you?",
      options: [
        "Ignore them",
        "Say thank you",
        "Make fun of them",
        "Demand more",
      ],
      answer: "Say thank you",
      explanation:
        "Expressing gratitude is a simple way to show appreciation and good manners.",
    },
  },
];

const createInitialProgress = (): MannersProgress[] =>
  LESSONS.map((lesson) => ({
    id: lesson.id,
    attempts: 0,
    mastered: false,
  }));

export const IslamicManners: React.FC<IslamicMannersProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>("guided");
  const [progress, setProgress] =
    useState<MannersProgress[]>(createInitialProgress);
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

  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
  }, [index, mode]);

  const updateCurrentProgress = (
    updater: (item: MannersProgress) => MannersProgress
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === current.id ? updater(item) : item
      )
    );
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

  const markGuidedComplete = () => {
    if (currentProgress.mastered) {
      return;
    }

    updateCurrentProgress((item) => ({
      ...item,
      attempts: item.attempts + 1,
      mastered: true,
    }));

    setScore((previous) => previous + 10);
    setStreak((previous) => previous + 1);
  };

  const showReflection = () => {
    setReflectionShown(true);
  };

  const next = () => {
    if (index < LESSONS.length - 1) {
      setIndex((previous) => previous + 1);
    } else {
      setIsComplete(true);
    }
  };

  const previous = () => {
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
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <Sparkles className="h-10 w-10 text-amber-500" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Islamic Studies
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Adab Journey Complete
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            You explored practical ways to practise Islamic manners,
            kindness, respect, honesty, gratitude, and good character.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <Target className="mx-auto mb-2 h-6 w-6 text-slate-600" />
              <p className="text-2xl font-bold text-slate-900">
                {masteredCount}
              </p>
              <p className="text-sm text-slate-500">
                Topics mastered
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <Star className="mx-auto mb-2 h-6 w-6 text-amber-500" />
              <p className="text-2xl font-bold text-slate-900">
                {score}
              </p>
              <p className="text-sm text-slate-500">
                Learning points
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
              <p className="text-2xl font-bold text-slate-900">
                {masteryPercentage}%
              </p>
              <p className="text-sm text-slate-500">
                Mastery
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-6 text-left">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Learning outcomes
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Practise respectful behaviour toward parents.</li>
              <li>• Use Islamic greetings appropriately.</li>
              <li>• Develop good manners in everyday situations.</li>
              <li>• Practise kindness and respectful speech.</li>
              <li>• Understand honesty and responsibility.</li>
              <li>• Develop generosity, gratitude, forgiveness, and respect.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Learn Again
            </button>

            <button
              type="button"
              onClick={finish}
              disabled={hasFinished}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
              {hasFinished ? "Completed" : "Finish & Move Up"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Islamic Studies
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Islamic Manners
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Adab, character, relationships, and everyday Muslim behaviour.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-xs text-slate-500">Score</p>
              <p className="font-bold text-slate-900">{score}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Streak</p>
              <p className="font-bold text-slate-900">{streak}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Mastery</p>
              <p className="font-bold text-slate-900">
                {masteredCount}/{LESSONS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((index + 1) / LESSONS.length) * 100}%`,
            }}
            className="h-full rounded-full bg-slate-900"
          />
        </div>
      </div>

      {/* Modes */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            id: "guided" as const,
            title: "Guided",
            description: "Explore the situation with support.",
          },
          {
            id: "practice" as const,
            title: "Practice",
            description: "Think through the situation.",
          },
          {
            id: "mastery" as const,
            title: "Mastery",
            description: "Choose the best response independently.",
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === item.id
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <p className="font-semibold">{item.title}</p>

            <p
              className={`mt-1 text-xs ${
                mode === item.id
                  ? "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              {item.description}
            </p>
          </button>
        ))}
      </div>

      {/* Main lesson */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{current.emoji}</span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Adab {index + 1} of {LESSONS.length}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {current.title}
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {current.category}
                </span>

                <span
                  dir="rtl"
                  lang="ar"
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {current.arabicTitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Situation */}
        <div className="mt-7 rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Situation
              </p>

              <p className="mt-2 text-lg leading-7 text-slate-800">
                {current.situation}
              </p>
            </div>
          </div>
        </div>

        {/* Guided good choice */}
        {mode === "guided" && (
          <>
            <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                Good Choice
              </p>

              <p className="mt-2 leading-7 text-emerald-950">
                {current.goodChoice}
              </p>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Islamic Lesson
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {current.explanation}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {current.keyPoints.map((point) => (
                <div
                  key={point}
                  className="flex gap-3 rounded-xl bg-slate-50 p-4"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm leading-6 text-slate-600">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={markGuidedComplete}
              disabled={currentProgress.mastered}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              {currentProgress.mastered
                ? "Lesson Understood"
                : "I Understand"}
            </button>
          </>
        )}

        {/* Practice / Mastery */}
        {mode !== "guided" && (
          <>
            <div className="mt-7 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    What would you do?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {current.question.question}
                  </p>

                  <div className="mt-4 space-y-2">
                    {current.question.options.map((option) => {
                      const selected = selectedAnswer === option;
                      const correct =
                        answerChecked &&
                        option === current.question.answer;

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={answerChecked}
                          onClick={() => setSelectedAnswer(option)}
                          className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                            correct
                              ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                              : selected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 hover:border-slate-400"
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
                      className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Check Choice
                    </button>
                  )}

                  {answerChecked && (
                    <div
                      className={`mt-4 rounded-xl p-4 ${
                        selectedAnswer === current.question.answer
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-rose-50 text-rose-800"
                      }`}
                    >
                      <p className="font-semibold">
                        {selectedAnswer === current.question.answer
                          ? "Good thinking!"
                          : "Let's learn from this."}
                      </p>

                      <p className="mt-1 text-sm leading-6">
                        {selectedAnswer === current.question.answer
                          ? current.question.explanation
                          : `A better choice is "${current.question.answer}".`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {answerChecked && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Islamic Lesson
                </p>

                <p className="mt-2 leading-7 text-slate-700">
                  {current.explanation}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {current.keyPoints.map((point) => (
                    <div
                      key={point}
                      className="flex gap-3 rounded-xl bg-white p-4"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                      <p className="text-sm leading-6 text-slate-600">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {answerChecked && (
              <div className="mt-5">
                {!reflectionShown ? (
                  <button
                    type="button"
                    onClick={showReflection}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Heart className="h-4 w-4" />
                    Think About It
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-200 bg-amber-50 p-5"
                  >
                    <h3 className="font-semibold text-slate-900">
                      Reflection
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {current.reflection}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={previous}
            disabled={index === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            {LESSONS.map((lesson, lessonIndex) => {
              const lessonProgress = progress.find(
                (item) => item.id === lesson.id
              );

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setIndex(lessonIndex)}
                  aria-label={`Go to lesson ${lessonIndex + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    lessonIndex === index
                      ? "w-8 bg-slate-900"
                      : lessonProgress?.mastered
                        ? "w-2.5 bg-emerald-500"
                        : "w-2.5 bg-slate-200"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {index === LESSONS.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Your Adab progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Practise good character across different everyday situations.
            </p>
          </div>

          <p className="text-sm font-semibold text-slate-700">
            {masteredCount} of {LESSONS.length} mastered
          </p>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-12">
          {progress.map((item) => (
            <div
              key={item.id}
              className={`h-2 rounded-full ${
                item.mastered
                  ? "bg-emerald-500"
                  : item.attempts > 0
                    ? "bg-amber-300"
                    : "bg-slate-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Educational note */}
      <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Practising Adab
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Good manners are practised through real actions. Children should
            also learn to ask a trusted adult for help whenever a situation is
            unsafe, serious, or beyond what they can handle themselves.
          </p>
        </div>
      </div>

      {/* Keep the component ready for future social-learning expansion */}
      <div className="hidden">
        <Users />
      </div>
    </motion.div>
  );
};