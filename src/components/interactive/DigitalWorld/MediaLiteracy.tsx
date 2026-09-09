import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Eye,
  FileText,
  Megaphone,
  RotateCcw,
  Search,
  Shield,
  Star,
  Target,
  ThumbsUp,
  XCircle,
} from 'lucide-react';

type ActivityId =
  | 'fact'
  | 'advertising'
  | 'sources'
  | 'clickbait'
  | 'evidence'
  | 'images'
  | 'privacy'
  | 'sharing';

type AnswerValue = string | boolean;

interface Activity {
  id: ActivityId;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}

interface Question {
  text: string;
  emoji: string;
  answer: AnswerValue;
  explanation: string;
  lesson: string;
}

interface ActivityResult {
  correct: boolean;
  selected: AnswerValue;
  answer: AnswerValue;
  explanation: string;
  lesson: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: 'fact',
    title: 'Fact or Opinion',
    description: 'Learn the difference between something that can be checked and something someone believes.',
    icon: <Shield className="w-7 h-7" />,
    iconClass: 'bg-blue-500',
  },
  {
    id: 'advertising',
    title: 'Spot the Ad',
    description: 'Discover how advertisements try to persuade people.',
    icon: <Megaphone className="w-7 h-7" />,
    iconClass: 'bg-orange-500',
  },
  {
    id: 'sources',
    title: 'Check the Source',
    description: 'Learn what makes information more trustworthy.',
    icon: <Search className="w-7 h-7" />,
    iconClass: 'bg-green-500',
  },
  {
    id: 'clickbait',
    title: 'Clickbait Detective',
    description: 'Recognise headlines designed mainly to make you click.',
    icon: <Eye className="w-7 h-7" />,
    iconClass: 'bg-purple-500',
  },
  {
    id: 'evidence',
    title: 'Where Is the Evidence?',
    description: 'Look for reasons, evidence and sources behind a claim.',
    icon: <FileText className="w-7 h-7" />,
    iconClass: 'bg-cyan-500',
  },
  {
    id: 'images',
    title: 'Look Closely',
    description: 'Learn why pictures and videos should also be checked carefully.',
    icon: <Eye className="w-7 h-7" />,
    iconClass: 'bg-pink-500',
  },
  {
    id: 'privacy',
    title: 'Protect Your Information',
    description: 'Practise deciding what information should stay private.',
    icon: <Shield className="w-7 h-7" />,
    iconClass: 'bg-red-500',
  },
  {
    id: 'sharing',
    title: 'Think Before Sharing',
    description: 'Learn how to pause, check and think before passing information on.',
    icon: <ThumbsUp className="w-7 h-7" />,
    iconClass: 'bg-emerald-500',
  },
];

const QUESTIONS: Record<ActivityId, Question[]> = {
  fact: [
    {
      text: 'Water freezes at 0°C under normal conditions.',
      emoji: '💧',
      answer: 'Fact',
      explanation: 'This is a fact because it can be tested and checked.',
      lesson: 'A fact is information that can be checked with evidence.',
    },
    {
      text: 'Mangoes are the tastiest fruit.',
      emoji: '🥭',
      answer: 'Opinion',
      explanation: 'Taste is personal. Different people can have different preferences.',
      lesson: 'An opinion expresses a belief, preference or judgement.',
    },
    {
      text: 'The Earth travels around the Sun.',
      emoji: '🌍',
      answer: 'Fact',
      explanation: 'This can be supported by scientific evidence and observation.',
      lesson: 'Facts can be supported by reliable evidence.',
    },
    {
      text: 'Blue is the most beautiful colour.',
      emoji: '🎨',
      answer: 'Opinion',
      explanation: 'Beauty is a personal judgement.',
      lesson: 'Words such as best, beautiful and boring often signal opinions.',
    },
    {
      text: 'Plants need water to grow.',
      emoji: '🌱',
      answer: 'Fact',
      explanation: 'Plant growth and water requirements can be observed and studied.',
      lesson: 'A claim can be checked by observation or evidence.',
    },
    {
      text: 'Reading books is more fun than playing games.',
      emoji: '📚',
      answer: 'Opinion',
      explanation: 'People can reasonably disagree about what is more fun.',
      lesson: 'When reasonable people can disagree because of personal preference, it is often an opinion.',
    },
  ],

  advertising: [
    {
      text: 'A video says, "Buy our new toy today! Everyone will love it!"',
      emoji: '🧸',
      answer: true,
      explanation: 'The message is encouraging people to buy a product.',
      lesson: 'Advertising is designed to persuade people to choose a product or service.',
    },
    {
      text: 'A teacher explains how the water cycle works.',
      emoji: '👩‍🏫',
      answer: false,
      explanation: 'The teacher is providing educational information rather than asking you to buy something.',
      lesson: 'Not every persuasive or informative message is an advertisement.',
    },
    {
      text: 'A video creator shows a snack and says, "Use my code to get yours!"',
      emoji: '🍿',
      answer: true,
      explanation: 'The creator is encouraging viewers to purchase something.',
      lesson: 'Advertisements can appear inside videos and social-media content.',
    },
    {
      text: 'A library displays a poster explaining how to find books.',
      emoji: '📚',
      answer: false,
      explanation: 'The poster gives instructions about using the library.',
      lesson: 'Look at the purpose of a message before deciding what it is.',
    },
    {
      text: 'A company says, "Our drink is the number-one choice for everyone!"',
      emoji: '🥤',
      answer: true,
      explanation: 'The company is promoting its product and trying to influence buyers.',
      lesson: 'Advertising often uses exciting claims to persuade us.',
    },
    {
      text: 'A science page explains how clouds form.',
      emoji: '☁️',
      answer: false,
      explanation: 'The main purpose is to teach about clouds.',
      lesson: 'Ask: Is this message mainly trying to inform me, entertain me or persuade me?',
    },
  ],

  sources: [
    {
      text: 'A health article identifies its author, date, evidence and sources.',
      emoji: '📄',
      answer: true,
      explanation: 'These details make it easier to investigate where the information came from.',
      lesson: 'A useful source usually makes its author, evidence or sources clear.',
    },
    {
      text: 'A post has no author and says, "Trust me! I know everything."',
      emoji: '📱',
      answer: false,
      explanation: 'There is not enough information to judge who created or supported the claim.',
      lesson: 'Ask who created the information and what evidence supports it.',
    },
    {
      text: 'A science resource explains a claim and links to research supporting it.',
      emoji: '🔬',
      answer: true,
      explanation: 'Evidence and supporting sources give you something to investigate.',
      lesson: 'Reliable information should be supported by evidence.',
    },
    {
      text: 'A post says, "Everyone knows this is true!" but gives no evidence.',
      emoji: '💬',
      answer: false,
      explanation: 'Saying that everyone agrees does not prove a claim.',
      lesson: 'Popularity is not the same thing as evidence.',
    },
    {
      text: 'Two independent, trustworthy sources give the same information.',
      emoji: '🔎',
      answer: true,
      explanation: 'Checking more than one good source can increase confidence in information.',
      lesson: 'Cross-check important information using more than one reliable source.',
    },
    {
      text: 'A page makes a surprising claim but gives no date, author or supporting evidence.',
      emoji: '❓',
      answer: false,
      explanation: 'There are important details missing that would help you evaluate the claim.',
      lesson: 'Missing source information is a reason to pause and investigate.',
    },
  ],

  clickbait: [
    {
      text: 'You Won’t Believe What Happened Next!!!',
      emoji: '😱',
      answer: true,
      explanation: 'The headline uses suspense and excitement to make you curious enough to click.',
      lesson: 'Clickbait often uses dramatic language while hiding important details.',
    },
    {
      text: 'How Rainbows Form: A Science Explanation',
      emoji: '🌈',
      answer: false,
      explanation: 'The headline clearly tells you what the article is about.',
      lesson: 'A clear headline usually gives useful information about the content.',
    },
    {
      text: 'This One Simple Trick Will Make You SUPER SMART!!!',
      emoji: '🧠',
      answer: true,
      explanation: 'The headline makes a dramatic promise designed to attract attention.',
      lesson: 'Be cautious when a headline makes an extraordinary promise without details.',
    },
    {
      text: 'Five Ways to Save Water at Home',
      emoji: '💧',
      answer: false,
      explanation: 'The headline clearly describes the information you will find.',
      lesson: 'Specific headlines are easier to evaluate than vague sensational ones.',
    },
    {
      text: 'Doctors HATE This Amazing Secret!!!',
      emoji: '🩺',
      answer: true,
      explanation: 'The dramatic wording is designed to create curiosity and encourage clicks.',
      lesson: 'Strong emotional language can be a clue that you should investigate further.',
    },
    {
      text: 'How Solar Panels Turn Sunlight Into Electricity',
      emoji: '☀️',
      answer: false,
      explanation: 'This headline directly describes its topic.',
      lesson: 'A headline should help you understand what information is actually being offered.',
    },
  ],

  evidence: [
    {
      text: 'A post says, "This plant grows twice as fast," and shows no experiment or source.',
      emoji: '🌿',
      answer: false,
      explanation: 'The claim is not supported by evidence in the message.',
      lesson: 'A strong claim needs evidence that can be examined.',
    },
    {
      text: 'A student says, "I think this seed grew faster," and shows measurements from two plants.',
      emoji: '📏',
      answer: true,
      explanation: 'Measurements provide evidence that can be compared.',
      lesson: 'Evidence can include observations, measurements, records and trustworthy sources.',
    },
    {
      text: 'A post says, "My friend told me, so it must be true."',
      emoji: '🗣️',
      answer: false,
      explanation: 'Someone repeating a claim does not automatically prove it.',
      lesson: 'Ask what evidence supports the original claim.',
    },
    {
      text: 'A report explains how information was collected and gives the results.',
      emoji: '📊',
      answer: true,
      explanation: 'The reader can examine how the conclusion was reached.',
      lesson: 'Good evidence should be understandable and connected to the claim.',
    },
    {
      text: 'A picture is posted with the caption, "This proves everything!" but no context is given.',
      emoji: '🖼️',
      answer: false,
      explanation: 'A picture alone may not explain when, where or why it was created.',
      lesson: 'Evidence needs context as well as appearance.',
    },
    {
      text: 'A claim is supported by data from a clearly explained investigation.',
      emoji: '🔬',
      answer: true,
      explanation: 'The investigation provides evidence that can be examined.',
      lesson: 'Evidence becomes stronger when we know how it was collected.',
    },
  ],

  images: [
    {
      text: 'A photo is shared with no date, location or source.',
      emoji: '📷',
      answer: false,
      explanation: 'Without context, it is difficult to know what the image actually shows.',
      lesson: 'Images can be misunderstood when their context is missing.',
    },
    {
      text: 'You check when and where a picture was originally published before sharing it.',
      emoji: '🔍',
      answer: true,
      explanation: 'Checking the original context can help you understand the image.',
      lesson: 'Pause and investigate an image before trusting or sharing its message.',
    },
    {
      text: 'A dramatic picture automatically proves that the caption is true.',
      emoji: '😲',
      answer: false,
      explanation: 'Pictures can be edited, reused or given misleading captions.',
      lesson: 'Seeing something in a picture does not automatically prove the accompanying claim.',
    },
    {
      text: 'A news report explains the original source and context of a photograph.',
      emoji: '📰',
      answer: true,
      explanation: 'The added context helps readers understand where the image came from.',
      lesson: 'Source and context help us evaluate visual information.',
    },
    {
      text: 'A picture looks strange, so you immediately share it with friends.',
      emoji: '📲',
      answer: false,
      explanation: 'Something surprising is a reason to pause, not a reason to share immediately.',
      lesson: 'Strong emotions can make us react before we check information.',
    },
    {
      text: 'You compare an image with information from another trustworthy source.',
      emoji: '🔎',
      answer: true,
      explanation: 'Cross-checking can reveal whether the image and its claim make sense together.',
      lesson: 'Comparing sources is a useful way to check visual information.',
    },
  ],

  privacy: [
    {
      text: 'Your full home address',
      emoji: '🏠',
      answer: 'Keep Private',
      explanation: 'Your home address is personal information and should not be shared publicly.',
      lesson: 'Personal information should be protected.',
    },
    {
      text: 'Your favourite colour',
      emoji: '🎨',
      answer: 'Usually Safe',
      explanation: 'A favourite colour is generally not sensitive personal information.',
      lesson: 'Not every piece of information about you needs the same level of protection.',
    },
    {
      text: 'Your password',
      emoji: '🔐',
      answer: 'Keep Private',
      explanation: 'Passwords should be kept secret and never posted publicly.',
      lesson: 'Never share your password with strangers or online audiences.',
    },
    {
      text: 'A photo of your school uniform with your school name clearly visible',
      emoji: '🎒',
      answer: 'Ask First',
      explanation: 'The image could reveal information about where you study.',
      lesson: 'Before sharing identifying information, talk to a trusted adult.',
    },
    {
      text: 'Your favourite animal',
      emoji: '🐼',
      answer: 'Usually Safe',
      explanation: 'A favourite animal is normally harmless information to share.',
      lesson: 'Think about whether information could identify, locate or harm you.',
    },
    {
      text: 'Your live location while travelling',
      emoji: '📍',
      answer: 'Keep Private',
      explanation: 'Sharing your location can reveal where you are right now.',
      lesson: 'Location information can be sensitive and should be handled carefully.',
    },
  ],

  sharing: [
    {
      text: 'You see a surprising story. You check another trustworthy source before sharing it.',
      emoji: '🔎',
      answer: 'Good Choice',
      explanation: 'You paused and checked the information first.',
      lesson: 'Check before you share.',
    },
    {
      text: 'You share a scary message because it says, "SEND THIS TO EVERYONE NOW!"',
      emoji: '🚨',
      answer: 'Poor Choice',
      explanation: 'Urgency is not proof that information is true.',
      lesson: 'Pressure to share quickly is a reason to slow down and check.',
    },
    {
      text: 'You are unsure whether a message is true, so you ask a trusted adult.',
      emoji: '🧑‍🏫',
      answer: 'Good Choice',
      explanation: 'Asking for help is a responsible response to uncertainty.',
      lesson: 'You do not have to solve every information question alone.',
    },
    {
      text: 'You forward a rumour about another child without checking it.',
      emoji: '💬',
      answer: 'Poor Choice',
      explanation: 'Unverified rumours can hurt people and spread false information.',
      lesson: 'Think about accuracy and people’s feelings before sharing.',
    },
    {
      text: 'You read the whole article instead of judging it only from the headline.',
      emoji: '📖',
      answer: 'Good Choice',
      explanation: 'The full context can be very different from a short headline.',
      lesson: 'Read beyond the headline before deciding what something means.',
    },
    {
      text: 'You find a claim that makes you very angry and share it immediately.',
      emoji: '😡',
      answer: 'Poor Choice',
      explanation: 'Strong emotions can make us react before checking.',
      lesson: 'Pause when something makes you angry, excited or afraid.',
    },
  ],
};

const getActivityById = (id: ActivityId): Activity => {
  return ACTIVITIES.find((activity) => activity.id === id) ?? ACTIVITIES[0];
};

export const MediaLiteracy: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityId | null>(null);
  const [score, setScore] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<ActivityId[]>([]);

  const handleActivityComplete = (activityId: ActivityId, earned: number) => {
    setScore((previous) => previous + earned);

    setCompletedActivities((previous) => {
      if (previous.includes(activityId)) {
        return previous;
      }

      return [...previous, activityId];
    });
  };

  const resetProgress = () => {
    setScore(0);
    setCompletedActivities([]);
    setSelectedActivity(null);
  };

  if (selectedActivity) {
    const activity = getActivityById(selectedActivity);

    return (
      <MediaActivity
        activity={activity}
        questions={QUESTIONS[selectedActivity]}
        score={score}
        onBack={() => setSelectedActivity(null)}
        onComplete={(earned) => handleActivityComplete(selectedActivity, earned)}
      />
    );
  }

  const progressPercentage = Math.round(
    (completedActivities.length / ACTIVITIES.length) * 100,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <section className="bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-300">
                <Search className="w-7 h-7" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                  Information Literacy
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Media & Information Literacy
                </h2>
              </div>
            </div>

            <p className="text-gray-400 max-w-2xl">
              Learn how to question information, recognise persuasion,
              check evidence and make thoughtful decisions before sharing.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl px-5 py-3 min-w-[110px]">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Score
              </p>
              <p className="text-xl font-bold text-yellow-400 flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                {score}
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl px-5 py-3 min-w-[110px]">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Mastery
              </p>
              <p className="text-xl font-bold text-cyan-300">
                {progressPercentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Academy progress</span>
            <span>
              {completedActivities.length} / {ACTIVITIES.length} activities
            </span>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-full bg-cyan-500 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Core thinking rule */}
      <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-300">
            <HelpCircle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-white font-bold text-lg">
              The Information Detective Rule
            </h3>

            <p className="text-gray-400 mt-1">
              <span className="text-white font-semibold">Pause → Ask → Check → Think → Share</span>
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Good information detectives do not believe or share something
              simply because it looks exciting, popular or convincing.
            </p>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              Learning Activities
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Explore each skill and build your information-literacy toolkit.
            </p>
          </div>

          {completedActivities.length > 0 && (
            <button
              onClick={resetProgress}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTIVITIES.map((activity, index) => {
            const completed = completedActivities.includes(activity.id);

            return (
              <motion.button
                key={activity.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedActivity(activity.id)}
                className="relative text-left bg-app-card border border-app-border rounded-2xl p-5 hover:border-cyan-500/40 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`${activity.iconClass} text-white p-3 rounded-xl`}
                  >
                    {activity.icon}
                  </div>

                  {completed && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-600 font-semibold">
                    ACTIVITY {index + 1}
                  </p>

                  <h4 className="text-white font-bold text-lg mt-1">
                    {activity.title}
                  </h4>

                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-cyan-300 text-sm font-semibold">
                  {completed ? 'Practise again' : 'Start activity'}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

interface MediaActivityProps {
  activity: Activity;
  questions: Question[];
  score: number;
  onBack: () => void;
  onComplete: (earned: number) => void;
}

const MediaActivity: React.FC<MediaActivityProps> = ({
  activity,
  questions,
  score,
  onBack,
  onComplete,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<AnswerValue | null>(null);
  const [result, setResult] = useState<ActivityResult | null>(null);
  const [earnedScore, setEarnedScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[questionIndex];

  const answerOptions = useMemo(() => {
    switch (activity.id) {
      case 'fact':
        return ['Fact', 'Opinion'];

      case 'advertising':
        return [true, false];

      case 'sources':
      case 'evidence':
      case 'images':
        return [true, false];

      case 'clickbait':
        return [true, false];

      case 'privacy':
        return ['Keep Private', 'Usually Safe', 'Ask First'];

      case 'sharing':
        return ['Good Choice', 'Poor Choice'];

      default:
        return [];
    }
  }, [activity.id]);

  const getOptionLabel = (option: AnswerValue): string => {
    if (activity.id === 'advertising' || activity.id === 'sources') {
      return option === true ? 'Yes — I would trust this' : 'No — I would check it';
    }

    if (activity.id === 'evidence' || activity.id === 'images') {
      return option === true ? 'Strong / useful evidence' : 'Not enough to trust';
    }

    if (activity.id === 'clickbait') {
      return option === true ? 'Looks like clickbait' : 'Clear information';
    }

    return String(option);
  };

  const getOptionEmoji = (option: AnswerValue): string => {
    if (activity.id === 'fact') {
      return option === 'Fact' ? '🔎' : '💭';
    }

    if (
      activity.id === 'advertising' ||
      activity.id === 'sources' ||
      activity.id === 'evidence' ||
      activity.id === 'images' ||
      activity.id === 'clickbait'
    ) {
      return option === true ? '✓' : '○';
    }

    if (activity.id === 'privacy') {
      if (option === 'Keep Private') return '🔐';
      if (option === 'Ask First') return '🧑‍🏫';
      return '👍';
    }

    return option === 'Good Choice' ? '👍' : '⚠️';
  };

  const handleAnswer = (answer: AnswerValue) => {
    if (selected !== null || finished) {
      return;
    }

    const correct = answer === currentQuestion.answer;

    setSelected(answer);

    const newResult: ActivityResult = {
      correct,
      selected: answer,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
      lesson: currentQuestion.lesson,
    };

    setResult(newResult);

    if (correct) {
      setEarnedScore((previous) => previous + 10);
    }
  };

  const handleNext = () => {
    if (!result) {
      return;
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((previous) => previous + 1);
      setSelected(null);
      setResult(null);
      return;
    }

    setFinished(true);
    onComplete(earnedScore);
  };

  const restartActivity = () => {
    setQuestionIndex(0);
    setSelected(null);
    setResult(null);
    setEarnedScore(0);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round(
      (earnedScore / (questions.length * 10)) * 100,
    );

    return (
      <div className="max-w-2xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-5">
            <Target className="w-10 h-10" />
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
            Activity Complete
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {activity.title}
          </h2>

          <div className="mt-6 bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Activity score</p>

            <p className="text-5xl font-black text-yellow-400 mt-2">
              {earnedScore}
            </p>

            <p className="text-gray-500 mt-2">
              {percentage}% correct
            </p>
          </div>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-left">
            <p className="text-cyan-300 font-semibold">Information Detective Skill</p>
            <p className="text-gray-400 text-sm mt-1">
              {percentage >= 80
                ? 'Excellent work. You are building strong information-checking habits.'
                : percentage >= 60
                  ? 'Good work. Keep practising how to question and check information.'
                  : 'Keep practising. Remember: pause, ask, check, think, then share.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy
            </button>

            <button
              onClick={restartActivity}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Activity header */}
      <div className="bg-app-card rounded-2xl border border-app-border p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              QUESTION {questionIndex + 1} OF {questions.length}
            </p>

            <h3 className="text-lg font-bold text-white mt-1">
              {activity.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star className="w-4 h-4 fill-current" />
            {score}
          </div>
        </div>

        <div className="mt-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((questionIndex + 1) / questions.length) * 100}%`,
            }}
            className="h-full bg-cyan-500 rounded-full"
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-app-card rounded-3xl border border-app-border shadow-xl p-6 md:p-8"
      >
        <div className="text-center">
          <div className="text-6xl mb-5">
            {currentQuestion.emoji}
          </div>

          <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
            "{currentQuestion.text}"
          </p>

          <p className="text-gray-500 text-sm mt-4">
            Think carefully before choosing.
          </p>
        </div>

        {/* Answers */}
        <div
          className={`grid gap-3 mt-7 ${
            answerOptions.length === 3
              ? 'grid-cols-1'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {answerOptions.map((option, index) => {
            const isSelected = selected === option;
            const isCorrect = option === currentQuestion.answer;

            let stateClass =
              'bg-gray-900 border-gray-800 hover:border-cyan-500/50';

            if (selected !== null) {
              if (isCorrect) {
                stateClass =
                  'bg-green-500/10 border-green-500/50';
              } else if (isSelected) {
                stateClass =
                  'bg-red-500/10 border-red-500/50';
              } else {
                stateClass =
                  'bg-gray-900/50 border-gray-800 opacity-60';
              }
            }

            return (
              <motion.button
                key={`${String(option)}-${index}`}
                whileHover={selected === null ? { scale: 1.01 } : undefined}
                whileTap={selected === null ? { scale: 0.99 } : undefined}
                disabled={selected !== null}
                onClick={() => handleAnswer(option)}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all ${stateClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-lg">
                    {getOptionEmoji(option)}
                  </span>

                  <span className="text-white font-semibold">
                    {getOptionLabel(option)}
                  </span>

                  {selected !== null && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}

                  {selected !== null && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 rounded-2xl border p-5 ${
              result.correct
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-orange-500/10 border-orange-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.correct ? (
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-orange-400 shrink-0" />
              )}

              <div>
                <p
                  className={`font-bold ${
                    result.correct
                      ? 'text-green-300'
                      : 'text-orange-300'
                  }`}
                >
                  {result.correct
                    ? 'Great thinking!'
                    : 'Good attempt — let’s learn from it.'}
                </p>

                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  {result.explanation}
                </p>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Key idea
                  </p>

                  <p className="text-gray-300 text-sm mt-1">
                    {result.lesson}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors"
            >
              {questionIndex < questions.length - 1
                ? 'Next Question'
                : 'Finish Activity'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MediaLiteracy;