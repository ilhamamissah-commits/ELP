import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  RotateCcw,
  Star,
  Volume2,
  Heart,
  Target,
  Lightbulb,
  Globe,
  Clock,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type LearningMode = 'guided' | 'practice' | 'mastery';

interface HistoryQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface HistoryLesson {
  id: number;
  title: string;
  arabicTitle: string;
  emoji: string;
  era: string;
  approximatePeriod: string;
  introduction: string;
  explanation: string;
  keyPeople: string[];
  keyPoints: string[];
  lesson: string;
  reflection: string;
  question: HistoryQuestion;
}

interface HistoryProgress {
  id: number;
  attempts: number;
  mastered: boolean;
}

interface IslamicHistoryProps {
  onComplete?: (score: number) => void;
}

const LESSONS: HistoryLesson[] = [
  {
    id: 1,
    title: 'Arabia Before Islam',
    arabicTitle: 'الْجَاهِلِيَّة',
    emoji: '🏜️',
    era: 'Before Islam',
    approximatePeriod: 'Before 610 CE',
    introduction:
      "Before the beginning of the Prophet Muhammad's ﷺ mission, Arabia was home to many tribes, communities, cultures, and trade routes.",
    explanation:
      "Arabian society included many different beliefs and customs. People lived in towns, villages, and desert communities. Makkah was an important center of trade and was also home to the Ka'bah.",
    keyPeople: [
      'Arabian tribes',
      'Merchants of Makkah',
      "People living around the Ka'bah",
    ],
    keyPoints: [
      'Arabia contained many different tribes and communities.',
      'Makkah was an important trading center.',
      "The Ka'bah was already an important place in Makkah.",
      'Islam would later transform Arabian society.',
    ],
    lesson:
      'History helps us understand the world in which important events took place.',
    reflection:
      'Why do you think learning about the world before an event can help us understand the event?',
    question: {
      question: 'Which city was an important center in Arabia?',
      options: ['Makkah', 'Rome', 'Beijing', 'London'],
      answer: 'Makkah',
      explanation:
        'Makkah was an important center of trade and religious significance in Arabia.',
    },
  },
  {
    id: 2,
    title: 'The Birth of the Prophet Muhammad ﷺ',
    arabicTitle: 'مُحَمَّدٌ ﷺ',
    emoji: '🌙',
    era: 'Early Life',
    approximatePeriod: 'c. 570 CE',
    introduction:
      'Muhammad ibn Abdullah ﷺ was born in Makkah and belonged to the Quraysh tribe.',
    explanation:
      'The Prophet Muhammad ﷺ was born in Makkah around the year 570 CE. His father, Abdullah, died before his birth, and his mother was Aminah bint Wahb.',
    keyPeople: [
      'Muhammad ﷺ',
      'Abdullah ibn Abd al-Muttalib',
      'Aminah bint Wahb',
      'Abd al-Muttalib',
    ],
    keyPoints: [
      'The Prophet ﷺ was born in Makkah.',
      'He belonged to Quraysh.',
      'His father died before he was born.',
      'His early life prepared him for the mission that would later begin.',
    ],
    lesson:
      'Important lives can begin with ordinary childhood experiences and challenges.',
    reflection:
      'What qualities can help a person remain strong when facing difficulties?',
    question: {
      question: 'Where was Prophet Muhammad ﷺ born?',
      options: ['Madinah', 'Makkah', 'Cairo', 'Damascus'],
      answer: 'Makkah',
      explanation: 'The Prophet Muhammad ﷺ was born in Makkah.',
    },
  },
  {
    id: 3,
    title: 'The First Revelation',
    arabicTitle: 'أَوَّلُ الْوَحْيِ',
    emoji: '📖',
    era: 'Beginning of Prophethood',
    approximatePeriod: '610 CE',
    introduction:
      'At the age of forty, Muhammad ﷺ received the first revelation from Allah through the angel Jibril عليه السلام.',
    explanation:
      "The first revelation came while the Prophet ﷺ was in the Cave of Hira near Makkah. The beginning of Surah Al-'Alaq contains the first revealed verses.",
    keyPeople: [
      'Muhammad ﷺ',
      'Jibril عليه السلام',
      'Khadijah رضي الله عنها',
    ],
    keyPoints: [
      'The first revelation occurred in the Cave of Hira.',
      'Jibril عليه السلام brought revelation from Allah.',
      'The first revelation began with the command to read.',
      'Khadijah رضي الله عنها supported the Prophet ﷺ.',
    ],
    lesson:
      'Seeking knowledge and responding to truth are important parts of Islamic life.',
    reflection:
      'Why do you think the first revealed verses began with a command connected to reading?',
    question: {
      question: 'Who brought the revelation to Prophet Muhammad ﷺ?',
      options: [
        'Angel Jibril عليه السلام',
        'Angel Mikail عليه السلام',
        'A merchant',
        'A king',
      ],
      answer: 'Angel Jibril عليه السلام',
      explanation:
        "Jibril عليه السلام brought Allah's revelation to Prophet Muhammad ﷺ.",
    },
  },
  {
    id: 4,
    title: 'The Early Muslims',
    arabicTitle: 'الْمُسْلِمُونَ الأَوَّلُونَ',
    emoji: '🤝',
    era: 'Makkah',
    approximatePeriod: '610–622 CE',
    introduction:
      'The first Muslims accepted Islam during a difficult period in Makkah.',
    explanation:
      'The early Muslims came from different backgrounds. They faced opposition but remained committed to their faith. Their patience and courage became an important part of Islamic history.',
    keyPeople: [
      'Khadijah رضي الله عنها',
      'Abu Bakr رضي الله عنه',
      'Ali رضي الله عنه',
      'Bilal رضي الله عنه',
    ],
    keyPoints: [
      'The first Muslims came from different backgrounds.',
      'Many early Muslims faced persecution.',
      'They showed patience and courage.',
      'Their sacrifices helped preserve the early Muslim community.',
    ],
    lesson:
      'Faith, patience, courage, and loyalty are important qualities when facing difficulty.',
    reflection:
      'What can we learn from people who remain patient when something is difficult?',
    question: {
      question: 'What quality did many early Muslims show during difficult times?',
      options: ['Patience', 'Dishonesty', 'Carelessness', 'Cruelty'],
      answer: 'Patience',
      explanation:
        'The early Muslims demonstrated patience and perseverance during hardship.',
    },
  },
  {
    id: 5,
    title: 'The Hijrah',
    arabicTitle: 'الْهِجْرَةُ',
    emoji: '🐪',
    era: 'Migration',
    approximatePeriod: '622 CE',
    introduction:
      'The Hijrah was the migration of the Prophet Muhammad ﷺ and the Muslims from Makkah to Madinah.',
    explanation:
      'The migration to Madinah was a major turning point in Islamic history. Muslims were able to establish a stronger community where they could practise their faith more freely.',
    keyPeople: [
      'Muhammad ﷺ',
      'Abu Bakr رضي الله عنه',
      'The Muhajirun',
      'The Ansar',
    ],
    keyPoints: [
      'The Hijrah was a migration from Makkah to Madinah.',
      'It was a major turning point in Islamic history.',
      'The Muhajirun migrated from Makkah.',
      'The Ansar welcomed and supported them in Madinah.',
    ],
    lesson:
      'The Hijrah teaches courage, trust in Allah, sacrifice, planning, and community.',
    reflection:
      'What qualities might be needed when someone has to leave familiar surroundings for a better future?',
    question: {
      question: 'Where did the Muslims migrate during the Hijrah?',
      options: ['Madinah', 'Rome', 'Egypt', 'Persia'],
      answer: 'Madinah',
      explanation:
        'The Prophet ﷺ and his companions migrated from Makkah to Madinah.',
    },
  },
  {
    id: 6,
    title: 'The Madinah Community',
    arabicTitle: 'الْمَدِينَةُ',
    emoji: '🏡',
    era: 'Madinah',
    approximatePeriod: '622–632 CE',
    introduction:
      'In Madinah, the Prophet ﷺ helped build a community based on faith, cooperation, responsibility, and justice.',
    explanation:
      'The community included the Muhajirun who had migrated from Makkah and the Ansar who welcomed them. The Prophet ﷺ established relationships between members of the community and helped organize life in Madinah.',
    keyPeople: [
      'Muhammad ﷺ',
      'The Muhajirun',
      'The Ansar',
      'The people of Madinah',
    ],
    keyPoints: [
      'Madinah became the center of the growing Muslim community.',
      'The Ansar supported the Muhajirun.',
      'Community responsibility was important.',
      'The Prophet ﷺ guided the community in faith and conduct.',
    ],
    lesson:
      'Strong communities are built through cooperation, responsibility, justice, and care.',
    reflection:
      'What can you do to make your family, class, or community stronger?',
    question: {
      question: 'Who were the Ansar?',
      options: [
        'The people of Madinah who supported the migrants',
        'Roman soldiers',
        'Merchants from China',
        'People who lived in Egypt',
      ],
      answer: 'The people of Madinah who supported the migrants',
      explanation:
        'The Ansar were the Muslims of Madinah who welcomed and supported the Muhajirun.',
    },
  },
  {
    id: 7,
    title: 'The Farewell Pilgrimage',
    arabicTitle: 'حَجَّةُ الْوَدَاعِ',
    emoji: '🕋',
    era: 'Late Madinah Period',
    approximatePeriod: '632 CE',
    introduction:
      'Near the end of his life, Prophet Muhammad ﷺ performed the Farewell Pilgrimage and delivered an important sermon.',
    explanation:
      'The Farewell Pilgrimage brought many Muslims together. The Prophet ﷺ taught important principles concerning faith, responsibility, human dignity, justice, and the rights of others.',
    keyPeople: ['Muhammad ﷺ', 'The companions', 'Muslim pilgrims'],
    keyPoints: [
      'Many Muslims gathered for the pilgrimage.',
      'The Prophet ﷺ delivered the Farewell Sermon.',
      "The sermon included important guidance about people's rights and responsibilities.",
      'The pilgrimage demonstrated the unity of Muslims.',
    ],
    lesson:
      'Islam teaches responsibility, justice, dignity, and care for others.',
    reflection:
      'What does it mean to treat other people with dignity and fairness?',
    question: {
      question: 'What major act of worship took place during the Farewell Pilgrimage?',
      options: ['Hajj', 'Zakah only', "Jumu'ah only", 'Eid prayer only'],
      answer: 'Hajj',
      explanation:
        'The Farewell Pilgrimage was the Hajj performed by the Prophet ﷺ near the end of his life.',
    },
  },
  {
    id: 8,
    title: 'Abu Bakr رضي الله عنه',
    arabicTitle: 'أَبُو بَكْرٍ الصِّدِّيقُ',
    emoji: '⭐',
    era: 'Rightly Guided Caliphs',
    approximatePeriod: '632–634 CE',
    introduction:
      'After the death of Prophet Muhammad ﷺ, Abu Bakr رضي الله عنه became the first caliph.',
    explanation:
      'Abu Bakr رضي الله عنه was a close companion of the Prophet ﷺ and played an important role in the early Muslim community. During his leadership, he worked to preserve the unity of the Muslim community.',
    keyPeople: [
      'Abu Bakr رضي الله عنه',
      'Umar ibn al-Khattab رضي الله عنه',
      'The companions',
    ],
    keyPoints: [
      'Abu Bakr رضي الله عنه was the first caliph.',
      'He was a close companion of the Prophet ﷺ.',
      'He worked to maintain the unity of the Muslim community.',
      'He is remembered for his faith and loyalty.',
    ],
    lesson:
      'Leadership requires courage, responsibility, wisdom, and trust in Allah.',
    reflection: 'What qualities would make someone a trustworthy leader?',
    question: {
      question: 'Who was the first caliph after Prophet Muhammad ﷺ?',
      options: [
        'Abu Bakr رضي الله عنه',
        'Umar رضي الله عنه',
        'Uthman رضي الله عنه',
        'Ali رضي الله عنه',
      ],
      answer: 'Abu Bakr رضي الله عنه',
      explanation:
        'Abu Bakr رضي الله عنه was the first of the four Rightly Guided Caliphs.',
    },
  },
  {
    id: 9,
    title: 'Umar رضي الله عنه',
    arabicTitle: 'عُمَرُ بْنُ الْخَطَّابِ',
    emoji: '⚖️',
    era: 'Rightly Guided Caliphs',
    approximatePeriod: '634–644 CE',
    introduction:
      'Umar ibn al-Khattab رضي الله عنه was the second of the Rightly Guided Caliphs.',
    explanation:
      'Umar رضي الله عنه was known for his strength, justice, and concern for the Muslim community. During his caliphate, the Muslim state expanded significantly and systems of administration developed.',
    keyPeople: [
      'Umar ibn al-Khattab رضي الله عنه',
      'The companions',
      'Leaders and administrators of the early Muslim community',
    ],
    keyPoints: [
      'Umar رضي الله عنه was the second caliph.',
      'He was known for justice.',
      'Administration developed during his leadership.',
      'He emphasized responsibility toward people.',
    ],
    lesson:
      'Good leadership includes justice and responsibility toward those in your care.',
    reflection: 'Why is fairness important when making decisions?',
    question: {
      question: 'What quality is strongly associated with Umar رضي الله عنه?',
      options: ['Justice', 'Dishonesty', 'Laziness', 'Selfishness'],
      answer: 'Justice',
      explanation:
        'Umar رضي الله عنه is especially remembered for his justice and strong sense of responsibility.',
    },
  },
  {
    id: 10,
    title: 'Uthman رضي الله عنه',
    arabicTitle: 'عُثْمَانُ بْنُ عَفَّانَ',
    emoji: '📜',
    era: 'Rightly Guided Caliphs',
    approximatePeriod: '644–656 CE',
    introduction:
      'Uthman ibn Affan رضي الله عنه was the third of the Rightly Guided Caliphs.',
    explanation:
      "Uthman رضي الله عنه was known for his generosity and modesty. During his caliphate, copies of the Qur'an were standardized and distributed to help preserve a consistent written text across the expanding Muslim community.",
    keyPeople: [
      'Uthman ibn Affan رضي الله عنه',
      'The companions',
      "The scribes of the Qur'an",
    ],
    keyPoints: [
      'Uthman رضي الله عنه was the third caliph.',
      'He was known for generosity and modesty.',
      "Standardized copies of the Qur'an were distributed during his caliphate.",
      'He supported the preservation and unity of the Muslim community.',
    ],
    lesson:
      'Generosity, humility, and careful preservation of knowledge are valuable qualities.',
    reflection:
      'How can you help preserve something important that you have learned?',
    question: {
      question: 'Who was the third Rightly Guided Caliph?',
      options: [
        'Uthman رضي الله عنه',
        'Abu Bakr رضي الله عنه',
        'Umar رضي الله عنه',
        'Ali رضي الله عنه',
      ],
      answer: 'Uthman رضي الله عنه',
      explanation:
        'Uthman رضي الله عنه was the third of the Rightly Guided Caliphs.',
    },
  },
  {
    id: 11,
    title: 'Ali رضي الله عنه',
    arabicTitle: 'عَلِيُّ بْنُ أَبِي طَالِبٍ',
    emoji: '🕌',
    era: 'Rightly Guided Caliphs',
    approximatePeriod: '656–661 CE',
    introduction:
      'Ali ibn Abi Talib رضي الله عنه was the fourth of the Rightly Guided Caliphs and a close relative of the Prophet ﷺ.',
    explanation:
      'Ali رضي الله عنه was the cousin and son-in-law of the Prophet ﷺ. He was known for courage, knowledge, and devotion. His period of leadership occurred during a difficult time of internal conflict in the Muslim community.',
    keyPeople: [
      'Ali ibn Abi Talib رضي الله عنه',
      'Muhammad ﷺ',
      'The companions',
    ],
    keyPoints: [
      'Ali رضي الله عنه was the fourth caliph.',
      'He was the cousin and son-in-law of the Prophet ﷺ.',
      'He was known for courage and knowledge.',
      'His caliphate took place during a period of serious internal conflict.',
    ],
    lesson:
      'History should be studied carefully, respectfully, and with awareness that difficult events can have many dimensions.',
    reflection:
      'Why should we be careful and respectful when learning about disagreements in history?',
    question: {
      question: 'How was Ali رضي الله عنه related to Prophet Muhammad ﷺ?',
      options: [
        "He was the Prophet's cousin and son-in-law.",
        "He was the Prophet's teacher.",
        'He was a Roman emperor.',
        'He was a merchant from Egypt.',
      ],
      answer: "He was the Prophet's cousin and son-in-law.",
      explanation:
        'Ali رضي الله عنه was the cousin and son-in-law of Prophet Muhammad ﷺ.',
    },
  },
  {
    id: 12,
    title: 'Islamic Civilization and Knowledge',
    arabicTitle: 'الْحَضَارَةُ الإِسْلَامِيَّةُ',
    emoji: '🔭',
    era: 'Islamic Civilization',
    approximatePeriod: '7th century onward',
    introduction:
      'Muslim societies became centers of learning, scholarship, trade, architecture, medicine, mathematics, astronomy, and literature.',
    explanation:
      'Across different periods and regions, Muslim scholars contributed to many fields of knowledge. Cities such as Baghdad, Damascus, Cairo, Cordoba, and others became important centers of scholarship.',
    keyPeople: [
      'Al-Khwarizmi',
      'Ibn al-Haytham',
      'Al-Razi',
      'Ibn Sina',
    ],
    keyPoints: [
      'Muslim scholars studied many fields.',
      'Mathematics and astronomy developed significantly.',
      'Medicine and scientific observation were important areas of scholarship.',
      'Libraries and centers of learning supported knowledge.',
    ],
    lesson:
      'Seeking useful knowledge and using it responsibly can benefit communities.',
    reflection:
      'What kind of knowledge would you like to use to help people in the future?',
    question: {
      question: 'Which field did Muslim scholars contribute to?',
      options: [
        'Mathematics',
        'Only cooking',
        'Nothing outside religion',
        'None of these',
      ],
      answer: 'Mathematics',
      explanation:
        'Muslim scholars made important contributions to mathematics as well as many other fields.',
    },
  },
  {
    id: 13,
    title: 'Islamic Art and Architecture',
    arabicTitle: 'الْفَنُّ وَالْعِمَارَةُ',
    emoji: '🏛️',
    era: 'Islamic Civilization',
    approximatePeriod: '7th century onward',
    introduction:
      'Islamic civilizations developed distinctive forms of architecture, calligraphy, geometric design, gardens, and decorative arts.',
    explanation:
      'Mosques, schools, libraries, palaces, and public buildings were constructed across many regions. Islamic art developed many local styles while sharing important features such as calligraphy and geometric decoration.',
    keyPeople: [
      'Architects',
      'Calligraphers',
      'Artists',
      'Builders and craftsmen',
    ],
    keyPoints: [
      'Islamic architecture developed across many regions.',
      'Calligraphy became an important art form.',
      'Geometric patterns were widely used.',
      'Different cultures developed different Islamic artistic styles.',
    ],
    lesson:
      'Creative work can preserve culture, communicate ideas, and beautify shared spaces.',
    reflection: 'What type of design or art would you like to create?',
    question: {
      question: 'Which is an important feature of many Islamic artistic traditions?',
      options: [
        'Calligraphy',
        'Only portraits of rulers',
        'No decoration',
        'Only modern technology',
      ],
      answer: 'Calligraphy',
      explanation:
        'Arabic calligraphy became an important part of many Islamic artistic traditions.',
    },
  },
  {
    id: 14,
    title: 'Islam Around the World',
    arabicTitle: 'الإِسْلَامُ حَوْلَ الْعَالَمِ',
    emoji: '🌍',
    era: 'Global Muslim Communities',
    approximatePeriod: 'Across centuries',
    introduction:
      'Islam spread across many regions, creating diverse Muslim communities with different languages, cultures, foods, clothing, and traditions.',
    explanation:
      'Muslim communities developed across Africa, Asia, Europe, and other parts of the world. Islam became part of many different cultures while Muslims continued to share core beliefs and acts of worship.',
    keyPeople: [
      'Muslim scholars',
      'Traders',
      'Teachers',
      'Local Muslim communities',
    ],
    keyPoints: [
      'Muslims live in many parts of the world.',
      'Muslim cultures are diverse.',
      'Languages and traditions differ between communities.',
      'Core Islamic beliefs connect Muslims across cultures.',
    ],
    lesson:
      'Diversity is part of the human experience, and learning about different cultures can build understanding.',
    reflection:
      'What is one thing you would like to learn about a Muslim culture different from your own?',
    question: {
      question: 'Where do Muslims live today?',
      options: [
        'Only Arabia',
        'Only Africa',
        'Many parts of the world',
        'Only one country',
      ],
      answer: 'Many parts of the world',
      explanation:
        'Muslims live in communities across many countries and regions around the world.',
    },
  },
];

const createInitialProgress = (): HistoryProgress[] =>
  LESSONS.map((lesson) => ({
    id: lesson.id,
    attempts: 0,
    mastered: false,
  }));

export const IslamicHistory: React.FC<IslamicHistoryProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');
  const [progress, setProgress] =
    useState<HistoryProgress[]>(createInitialProgress);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [reflectionShown, setReflectionShown] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  // English narration uses the shared pipeline
  const { speak } = useReadAloud();

  const currentLesson = LESSONS[index];

  const currentProgress = useMemo(
    () =>
      progress.find((item) => item.id === currentLesson.id) ?? {
        id: currentLesson.id,
        attempts: 0,
        mastered: false,
      },
    [progress, currentLesson.id]
  );

  const masteredCount = progress.filter((item) => item.mastered).length;

  const masteryPercentage = Math.round(
    (masteredCount / LESSONS.length) * 100
  );

  // Arabic still uses its own voice, but gated on soundEnabled
  const speakArabic = (text: string) => {
    if (!soundEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Reset per-lesson state
  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
  }, [index, mode]);

  // Auto-read Arabic (or English question in mastery mode)
  useEffect(() => {
    if (!currentLesson || !autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      if (mode === 'mastery') {
        speak(`${currentLesson.title}. ${currentLesson.question.question}`);
      } else {
        speakArabic(currentLesson.arabicTitle);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [currentLesson, mode, speak, autoReadEnabled, soundEnabled]);

  // Read reflection when it opens
  useEffect(() => {
    if (reflectionShown && currentLesson) {
      speak(currentLesson.reflection);
    }
  }, [reflectionShown, currentLesson, speak]);

  const updateCurrentProgress = (
    updater: (item: HistoryProgress) => HistoryProgress
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === currentLesson.id ? updater(item) : item
      )
    );
  };

  const checkAnswer = () => {
    if (!selectedAnswer || answerChecked) {
      return;
    }

    const correct = selectedAnswer === currentLesson.question.answer;

    setAnswerChecked(true);

    updateCurrentProgress((item) => ({
      ...item,
      attempts: item.attempts + 1,
    }));

    if (!correct) {
      if (soundEnabled) playSoundFeedback('try-again');

      setStreak(0);

      speak(
        `Keep practising. The correct answer is: ${currentLesson.question.answer}. ${currentLesson.question.explanation}`,
      );

      return;
    }

    if (soundEnabled) playSoundFeedback('correct');

    speak(`Correct! ${currentLesson.question.explanation}`);

    const nextStreak = streak + 1;
    setStreak(nextStreak);

    if (mode === 'mastery' && !currentProgress.mastered) {
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

  const nextLesson = () => {
    if (index < LESSONS.length - 1) {
      setIndex((previous) => previous + 1);
    } else {
      setIsComplete(true);
    }
  };

  const previousLesson = () => {
    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  };

  const finishAndMoveUp = () => {
    if (hasFinished) {
      return;
    }

    setHasFinished(true);
    onComplete?.(score);

    speak(
      `Masha'Allah! You mastered ${masteredCount} of ${LESSONS.length} topics and earned ${score} points.`,
    );
  };

  const resetCourse = () => {
    setIndex(0);
    setMode('guided');
    setProgress(createInitialProgress());
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
    setHasFinished(false);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    speak("Let's explore Islamic history again!");
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <Globe className="h-10 w-10 text-amber-500" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Islamic History
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            History Journey Complete
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            You explored important events, people, communities, and
            developments in Islamic history.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <Target className="mx-auto mb-2 h-6 w-6 text-slate-600" />
              <p className="text-2xl font-bold text-slate-900">
                {masteredCount}
              </p>
              <p className="text-sm text-slate-500">Topics mastered</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <Star className="mx-auto mb-2 h-6 w-6 text-amber-500" />
              <p className="text-2xl font-bold text-slate-900">{score}</p>
              <p className="text-sm text-slate-500">Learning points</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
              <p className="text-2xl font-bold text-slate-900">
                {masteryPercentage}%
              </p>
              <p className="text-sm text-slate-500">Mastery</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-6 text-left">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Learning outcomes
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>
                • Understand the basic timeline of early Islamic history.
              </li>
              <li>
                • Recognize major events from the life of the Prophet ﷺ.
              </li>
              <li>• Learn about the Rightly Guided Caliphs.</li>
              <li>
                • Understand the importance of knowledge and civilization.
              </li>
              <li>
                • Recognize the diversity of Muslim communities around the
                world.
              </li>
              <li>
                • Practise respectful and thoughtful historical learning.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetCourse}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Learn Again
            </button>

            <button              type="button"
              onClick={finishAndMoveUp}
              disabled={hasFinished}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
              {hasFinished ? 'Completed' : 'Finish & Move Up'}
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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Islamic Studies
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Islamic History
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Explore important people, events, civilizations, and
              communities.
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

            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Volume2
                className={`w-5 h-5 ${
                  soundEnabled ? 'text-amber-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / LESSONS.length) * 100}%` }}
            className="h-full rounded-full bg-slate-900"
          />
        </div>
      </div>

      {/* Modes */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            id: 'guided' as const,
            title: 'Guided',
            description: 'Explore the history with support.',
          },
          {
            id: 'practice' as const,
            title: 'Practice',
            description: 'Check what you remember.',
          },
          {
            id: 'mastery' as const,
            title: 'Mastery',
            description: 'Answer independently.',
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);

              speak(
                item.id === 'guided'
                  ? 'Guided mode. Explore the history with support.'
                  : item.id === 'practice'
                    ? 'Practice mode. Check what you remember.'
                    : 'Mastery mode. Answer independently.',
              );
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === item.id
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <p className="font-semibold">{item.title}</p>
            <p
              className={`mt-1 text-xs ${
                mode === item.id ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {item.description}
            </p>
          </button>
        ))}
      </div>

      {/* Lesson card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{currentLesson.emoji}</span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Topic {index + 1} of {LESSONS.length}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {currentLesson.title}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {currentLesson.era}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  <Clock className="h-3 w-3" />
                  {currentLesson.approximatePeriod}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => speakArabic(currentLesson.arabicTitle)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Volume2 className="h-4 w-4" />
            Listen
          </button>
        </div>

        {/* Arabic title */}
        <div className="mt-7 rounded-2xl bg-slate-50 p-6 text-center">
          <p dir="rtl" lang="ar" className="text-3xl text-slate-900">
            {currentLesson.arabicTitle}
          </p>
        </div>

        {/* Introduction */}
        <div className="mt-7">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            <BookOpen className="h-5 w-5" />
            Let&apos;s explore
          </h3>

          <p className="mt-2 leading-7 text-slate-600">
            {currentLesson.introduction}
          </p>
        </div>

        {/* Explanation */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900">What happened?</h3>

          <p className="mt-2 leading-7 text-slate-600">
            {currentLesson.explanation}
          </p>
        </div>

        {/* Key people */}
        <div className="mt-6">
          <h3 className="font-semibold text-slate-900">People and groups</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {currentLesson.keyPeople.map((person) => (
              <span
                key={person}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
              >
                {person}
              </span>
            ))}
          </div>
        </div>

        {/* Key points */}
        <div className="mt-6">
          <h3 className="font-semibold text-slate-900">Key points</h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {currentLesson.keyPoints.map((point) => (
              <div
                key={point}
                className="flex gap-3 rounded-xl bg-slate-50 p-4"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-sm leading-6 text-slate-600">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Historical lesson */}
        <div className="mt-6 rounded-2xl bg-amber-50 p-5">
          <h3 className="font-semibold text-slate-900">What can we learn?</h3>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {currentLesson.lesson}
          </p>
        </div>

        {/* Question */}
        {mode !== 'guided' && (
          <div className="mt-7 rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">
              Check your understanding
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {currentLesson.question.question}
            </p>

            <div className="mt-4 space-y-2">
              {currentLesson.question.options.map((option) => {
                const selected = selectedAnswer === option;
                const correct =
                  answerChecked && option === currentLesson.question.answer;

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={answerChecked}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                      correct
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : selected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 hover:border-slate-400'
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
                Check Answer
              </button>
            )}

            {answerChecked && (
              <div
                className={`mt-4 rounded-xl p-4 ${
                  selectedAnswer === currentLesson.question.answer
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
              >
                <p className="font-semibold">
                  {selectedAnswer === currentLesson.question.answer
                    ? 'Correct!'
                    : 'Keep practising.'}
                </p>

                <p className="mt-1 text-sm leading-6">
                  {selectedAnswer === currentLesson.question.answer
                    ? currentLesson.question.explanation
                    : `The correct answer is "${currentLesson.question.answer}".`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reflection */}
        {mode !== 'guided' && answerChecked && (
          <div className="mt-6">
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
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="font-semibold text-slate-900">Reflection</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {currentLesson.reflection}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={previousLesson}
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
                  aria-label={`Go to topic ${lessonIndex + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    lessonIndex === index
                      ? 'w-8 bg-slate-900'
                      : lessonProgress?.mastered
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={nextLesson}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {index === LESSONS.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Your history progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Mastery is based on correct independent answers.
            </p>
          </div>

          <p className="text-sm font-semibold text-slate-700">
            {masteredCount} of {LESSONS.length} mastered
          </p>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-14">
          {progress.map((item) => (
            <div
              key={item.id}
              className={`h-2 rounded-full ${
                item.mastered
                  ? 'bg-emerald-500'
                  : item.attempts > 0
                    ? 'bg-amber-300'
                    : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};