import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Star,
  Target,
  Lightbulb,
  BookOpen,
  Globe2,
  Users,
  Clock,
  Search,
  MessageCircle,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

type LearningMode = 'guided' | 'practice' | 'mastery';

type HistorySkill =
  | 'Chronology'
  | 'Observation'
  | 'Cause and Effect'
  | 'Change and Continuity'
  | 'Historical Evidence'
  | 'Comparison'
  | 'Perspective'
  | 'Research'
  | 'Geography'
  | 'Cultural Awareness'
  | 'Reflection'
  | 'Critical Thinking';

interface HistoryChallenge {
  id: number;
  level: number;
  title: string;
  category: string;
  difficulty: Difficulty;
  skill: HistorySkill;
  emoji: string;
  objective: string;
  introduction: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  keyPoints: string[];
  hint: string;
  reflection: string;
}

interface HistoryProgress {
  attempts: number;
  mastered: boolean;
  usedHint: boolean;
  bestScore: number;
}

interface HistoryExplorerProps {
  onComplete?: (score: number) => void;
}

const CHALLENGES: HistoryChallenge[] = [
  {
    id: 1,
    level: 1,
    title: 'My Life Has a Story',
    category: 'My Story',
    difficulty: 'Easy',
    skill: 'Chronology',
    emoji: '👶',
    objective: 'Understand that personal history is made of events over time.',
    introduction:
      'History is not only about kings and famous events. Every person has a story made of events that happen over time.',
    question: "Which happened earlier in most people's lives?",
    options: ['Being born', 'Starting school', 'Learning to read'],
    answer: 0,
    explanation:
      'Being born happens before starting school and learning to read.',
    keyPoints: [
      'History is about events over time.',
      'Your own life has a history.',
      'Events can be placed in chronological order.',
    ],
    hint: "Think about the very beginning of a person's life.",
    reflection: 'What is one important event in your own life?',
  },
  {
    id: 2,
    level: 1,
    title: 'Then and Now',
    category: 'My Story',
    difficulty: 'Easy',
    skill: 'Change and Continuity',
    emoji: '🔄',
    objective: 'Recognize that things can change over time.',
    introduction:
      'People, places, tools, and communities can change over time.',
    question: 'Which pair shows something that can change over time?',
    options: [
      'A small child growing into an adult',
      'A number staying the same',
      "The word 'history'",
    ],
    answer: 0,
    explanation: 'People grow and develop over time, showing change.',
    keyPoints: [
      'Change happens over time.',
      'People and places can change.',
      'History helps us understand those changes.',
    ],
    hint: 'Think about something that looks different now than when you were younger.',
    reflection: 'What has changed in your life since you were very young?',
  },
  {
    id: 3,
    level: 1,
    title: 'Family Stories',
    category: 'My Story',
    difficulty: 'Easy',
    skill: 'Historical Evidence',
    emoji: '👨‍👩‍👧‍👦',
    objective:
      'Understand that family stories can provide information about the past.',
    introduction:
      'Families often remember events through stories, photographs, objects, and other records.',
    question: "Which could help you learn about your family's past?",
    options: ['An old family photograph', 'A random cloud', 'A new blank page'],
    answer: 0,
    explanation:
      'A photograph can provide information about people, places, clothing, objects, and events from the past.',
    keyPoints: [
      'Families can preserve memories.',
      'Photographs can provide historical evidence.',
      'Objects and stories can also tell us about the past.',
    ],
    hint: 'Which option is something that can preserve a memory?',
    reflection:
      'What family object or photograph would you like to learn about?',
  },
  {
    id: 4,
    level: 1,
    title: 'Putting Events in Order',
    category: 'My Story',
    difficulty: 'Easy',
    skill: 'Chronology',
    emoji: '⏳',
    objective: 'Practise chronological thinking.',
    introduction:
      'Chronology means putting events in the order in which they happened.',
    question: 'Which order makes sense?',
    options: [
      'Wake up → eat breakfast → go to school',
      'Go to school → wake up → eat breakfast',
      'Eat breakfast → wake up → go to school',
    ],
    answer: 0,
    explanation:
      'This sequence places the events in a reasonable chronological order.',
    keyPoints: [
      'Chronology means order in time.',
      'Words such as before and after help us think chronologically.',
      'Timelines can show events in order.',
    ],
    hint: 'Which event normally happens first?',
    reflection: 'Can you describe three events from your day in order?',
  },
  {
    id: 5,
    level: 2,
    title: 'A Community Changes',
    category: 'My Community',
    difficulty: 'Easy',
    skill: 'Change and Continuity',
    emoji: '🏘️',
    objective: 'Understand that communities change over time.',
    introduction:
      'A community today may look different from the same community many years ago.',
    question: 'Which could be an example of community change?',
    options: [
      'A new school being built',
      'The name of a place staying the same',
      'People remembering an old story',
    ],
    answer: 0,
    explanation:
      'Building a new school changes the physical features and services of a community.',
    keyPoints: [
      'Communities change.',
      'New buildings and services can change places.',
      'Some things can stay the same while others change.',
    ],
    hint: 'Which option adds something new to a place?',
    reflection: 'What has changed in your neighbourhood?',
  },
  {
    id: 6,
    level: 2,
    title: 'Important Places',
    category: 'My Community',
    difficulty: 'Easy',
    skill: 'Geography',
    emoji: '📍',
    objective: 'Understand that places can have historical importance.',
    introduction:
      'Some buildings, streets, markets, monuments, and other places become important because of what happened there.',
    question: 'Why might an old building be historically important?',
    options: [
      'Important events or people may be connected to it',
      'Old buildings are always magical',
      'It is important only because it is old',
    ],
    answer: 0,
    explanation:
      'A place can become historically important because of events, people, or activities connected to it.',
    keyPoints: [
      'Places can hold historical meaning.',
      'History happens in real locations.',
      'Age alone does not explain everything about a place.',
    ],
    hint: 'Think about what might have happened there.',
    reflection: 'Is there an old or important place near you?',
  },
  {
    id: 7,
    level: 2,
    title: 'Community Helpers Then and Now',
    category: 'My Community',
    difficulty: 'Medium',
    skill: 'Comparison',
    emoji: '👩‍⚕️',
    objective: 'Compare how community roles can change over time.',
    introduction:
      'People have always needed services, but the tools and methods used by workers can change.',
    question:
      "What could be different about a doctor's work today compared with long ago?",
    options: [
      'Doctors have access to modern medical tools and knowledge',
      'Doctors never help sick people',
      'People did not get sick in the past',
    ],
    answer: 0,
    explanation:
      'Medical knowledge, equipment, medicines, and technology have changed over time.',
    keyPoints: [
      'Jobs can change over time.',
      'Technology can change how people work.',
      'Some purposes of jobs remain similar.',
    ],
    hint: 'Think about modern medical equipment.',
    reflection:
      'Which job would you like to compare across different time periods?',
  },
  {
    id: 8,
    level: 2,
    title: 'Ask an Elder',
    category: 'My Community',
    difficulty: 'Medium',
    skill: 'Historical Evidence',
    emoji: '🗣️',
    objective:
      "Understand that people's memories can provide historical information.",
    introduction:
      'Older people may remember how a community looked or worked in the past.',
    question: 'What could you ask an older community member?',
    options: [
      'What was this community like when you were young?',
      'Can you remember the future?',
      'What colour is the sky on another planet?',
    ],
    answer: 0,
    explanation:
      "Questions about someone's experiences can help researchers learn about the past.",
    keyPoints: [
      'People can be sources of historical information.',
      'Researchers ask questions.',
      'Memories should be considered alongside other evidence.',
    ],
    hint: 'Ask about something the person actually experienced.',
    reflection: 'What would you ask an older person about the past?',
  },
  {
    id: 9,
    level: 3,
    title: 'Ancient Ghana',
    category: 'Ghanaian History',
    difficulty: 'Easy',
    skill: 'Cultural Awareness',
    emoji: '👑',
    objective: 'Introduce the ancient Ghana Empire and its role in trade.',
    introduction:
      'The Ghana Empire was a powerful West African state known for its role in regional trade, including trade connected with gold.',
    question: 'What helped make the Ghana Empire important?',
    options: [
      'Its role in trade',
      'Its location on the Moon',
      'Its invention of airplanes',
    ],
    answer: 0,
    explanation:
      'The Ghana Empire became important partly through its position in West African trade networks.',
    keyPoints: [
      'West Africa has a long and rich history.',
      'Trade connected different communities.',
      'Gold was an important part of regional trade.',
    ],
    hint: 'Think about what connects sellers, buyers, and different regions.',
    reflection: 'What would you like to learn about the Ghana Empire?',
  },
  {
    id: 10,
    level: 3,
    title: 'Gold and Trade',
    category: 'Ghanaian History',
    difficulty: 'Medium',
    skill: 'Cause and Effect',
    emoji: '🪙',
    objective: 'Understand the relationship between resources and trade.',
    introduction:
      'Gold was an important resource in West African history and was connected to trade across regions.',
    question: 'Why could a valuable resource make a trading region important?',
    options: [
      'Other communities may want to trade for it',
      'Resources automatically build houses',
      'Gold makes every person identical',
    ],
    answer: 0,
    explanation:
      'Valuable resources can attract trade because people and communities may want to exchange goods for them.',
    keyPoints: [
      'Resources can influence trade.',
      'Trade connects communities.',
      'Economic activity can affect the development of societies.',
    ],
    hint: 'Why would another community want something valuable?',
    reflection: 'What resources are important to your community today?',
  },
  {
    id: 11,
    level: 3,
    title: "Ghana's Independence",
    category: 'Ghanaian History',
    difficulty: 'Medium',
    skill: 'Chronology',
    emoji: '🇬🇭',
    objective:
      "Introduce Ghana's independence as an important historical event.",
    introduction:
      'Ghana became independent from British colonial rule on 6 March 1957.',
    question: 'Which event happened in 1957?',
    options: [
      'Ghana gained independence',
      'The first humans walked on the Moon',
      'The pyramids were built',
    ],
    answer: 0,
    explanation: 'Ghana gained independence on 6 March 1957.',
    keyPoints: [
      "6 March is Ghana's Independence Day.",
      '1957 is an important year in Ghanaian history.',
      'Historical events can be connected to specific dates.',
    ],
    hint: "Think about Ghana's Independence Day.",
    reflection: 'Why do you think independence is important to a country?',
  },
  {
    id: 12,
    level: 3,
    title: 'Kwame Nkrumah',
    category: 'Ghanaian History',
    difficulty: 'Medium',
    skill: 'Historical Evidence',
    emoji: '🇬🇭',
    objective:
      "Recognize Kwame Nkrumah's role in Ghana's independence history.",
    introduction:
      "Kwame Nkrumah became Ghana's first prime minister at independence and later the country's first president.",
    question: 'Why is Kwame Nkrumah important in Ghanaian history?',
    options: [
      "He played a major role in Ghana's independence movement",
      'He discovered the Moon',
      'He invented the pyramids',
    ],
    answer: 0,
    explanation:
      "Kwame Nkrumah was a major political leader in Ghana's independence movement.",
    keyPoints: [
      'Historical change involves people and movements.',
      'Nkrumah was an important Ghanaian political leader.',
      'History can be studied through people, events, and evidence.',
    ],
    hint: "Think about Ghana's journey toward independence.",
    reflection:
      "What would you like to learn about Ghana's independence movement?",
  },
  {
    id: 13,
    level: 4,
    title: 'Ancient Egypt',
    category: 'African Civilizations',
    difficulty: 'Easy',
    skill: 'Cultural Awareness',
    emoji: '🏺',
    objective: 'Introduce Ancient Egypt as an African civilization.',
    introduction:
      'Ancient Egypt developed along the Nile River in northeastern Africa and produced complex societies, writing, architecture, and systems of government.',
    question: 'Where did Ancient Egyptian civilization develop?',
    options: ['Along the Nile River', 'On the Moon', 'In Antarctica'],
    answer: 0,
    explanation:
      'The Nile River was central to life and civilization in Ancient Egypt.',
    keyPoints: [
      'Ancient Egypt was an African civilization.',
      'The Nile was extremely important.',
      'Civilizations develop through interconnected systems.',
    ],
    hint: 'Think about the famous river associated with Ancient Egypt.',
    reflection: 'What would you like to discover about Ancient Egypt?',
  },
  {
    id: 14,
    level: 4,
    title: 'The Pyramids',
    category: 'African Civilizations',
    difficulty: 'Easy',
    skill: 'Historical Evidence',
    emoji: '🔺',
    objective:
      'Understand that ancient structures provide evidence about past societies.',
    introduction:
      'The pyramids of Egypt are large ancient structures that provide evidence about the organisation, knowledge, beliefs, and resources of ancient Egyptian society.',
    question: 'What can ancient buildings help historians understand?',
    options: [
      'How people lived and what they could build',
      'Exactly what every person thought',
      'What will happen tomorrow',
    ],
    answer: 0,
    explanation:
      'Buildings and other physical remains can provide evidence about past societies.',
    keyPoints: [
      'Physical objects can be historical evidence.',
      'Buildings reveal information about societies.',
      'Historians use different kinds of evidence.',
    ],
    hint: 'What can a building tell you about the people who made it?',
    reflection: 'What can a very old building tell us about its builders?',
  },
  {
    id: 15,
    level: 4,
    title: 'Mali Empire',
    category: 'African Civilizations',
    difficulty: 'Medium',
    skill: 'Cultural Awareness',
    emoji: '👑',
    objective:
      'Introduce the Mali Empire and its role in West African history.',
    introduction:
      'The Mali Empire became a major West African power. It was connected to trade, learning, cities, and the movement of people and ideas.',
    question: 'What was the Mali Empire?',
    options: [
      'A major West African empire',
      'A European ocean',
      'A modern computer program',
    ],
    answer: 0,
    explanation:
      'The Mali Empire was an important historical state in West Africa.',
    keyPoints: [
      'Africa has a long history of powerful states.',
      'Trade supported connections between regions.',
      'Cities could become centres of learning and culture.',
    ],
    hint: 'Think about West African history.',
    reflection: 'What would you like to learn about the Mali Empire?',
  },
  {
    id: 16,
    level: 4,
    title: 'Great Zimbabwe',
    category: 'African Civilizations',
    difficulty: 'Medium',
    skill: 'Historical Evidence',
    emoji: '🧱',
    objective:
      'Recognize Great Zimbabwe as evidence of complex African societies.',
    introduction:
      'Great Zimbabwe is an important archaeological site in southern Africa, known for its impressive stone structures.',
    question: 'What can Great Zimbabwe help us understand?',
    options: [
      'The complexity and achievements of past African societies',
      'How airplanes were built',
      'What happens on other planets',
    ],
    answer: 0,
    explanation:
      'The remains of Great Zimbabwe provide evidence about organisation, construction, trade, and society in the past.',
    keyPoints: [
      'Archaeological sites provide historical evidence.',
      'African societies developed complex systems.',
      'History should include many regions of the world.',
    ],
    hint: 'Think about what large stone structures can tell historians.',
    reflection: 'Why is it important to learn African history?',
  },
  {
    id: 17,
    level: 5,
    title: 'Mesopotamia',
    category: 'Ancient World',
    difficulty: 'Medium',
    skill: 'Geography',
    emoji: '🏺',
    objective: 'Introduce Mesopotamia and the importance of rivers.',
    introduction:
      'Mesopotamia was a region associated with the Tigris and Euphrates rivers and some of the earliest known cities and writing systems.',
    question: 'Which rivers are strongly associated with Mesopotamia?',
    options: [
      'Tigris and Euphrates',
      'Nile and Amazon',
      'Thames and Seine',
    ],
    answer: 0,
    explanation:
      'The Tigris and Euphrates rivers were central to ancient Mesopotamian societies.',
    keyPoints: [
      'Rivers can support settlements.',
      'Mesopotamia had early cities.',
      'Geography can influence human development.',
    ],
    hint: 'Look for the pair of rivers associated with Mesopotamia.',
    reflection: 'Why do you think people often settled near rivers?',
  },
  {
    id: 18,
    level: 5,
    title: 'Ancient Greece',
    category: 'Ancient World',
    difficulty: 'Medium',
    skill: 'Comparison',
    emoji: '🏛️',
    objective: 'Explore an important ancient Mediterranean civilization.',
    introduction:
      'Ancient Greek societies contributed to philosophy, art, architecture, political ideas, science, and literature.',
    question: 'Which is associated with Ancient Greece?',
    options: ['Philosophy', 'Smartphones', 'Steam engines'],
    answer: 0,
    explanation:
      'Ancient Greek thinkers made influential contributions to philosophy and many other fields.',
    keyPoints: [
      'Ancient societies developed ideas that influenced later generations.',
      'Philosophy asks questions about knowledge, life, and society.',
      'History connects past ideas to later developments.',
    ],
    hint: 'Which option involves asking deep questions about life and knowledge?',
    reflection: 'What big question would you ask a philosopher?',
  },
  {
    id: 19,
    level: 5,
    title: 'Ancient Rome',
    category: 'Ancient World',
    difficulty: 'Medium',
    skill: 'Historical Evidence',
    emoji: '🏛️',
    objective: 'Explore Roman engineering and infrastructure.',
    introduction:
      'Roman societies built roads, bridges, aqueducts, and other structures that helped connect and support communities.',
    question: 'What can Roman roads tell historians?',
    options: [
      'How people connected places and transported goods',
      'What every Roman ate every day',
      'What the future will look like',
    ],
    answer: 0,
    explanation:
      'Infrastructure can reveal how societies travelled, traded, communicated, and organised their territories.',
    keyPoints: [
      'Infrastructure provides historical evidence.',
      'Roads can connect communities.',
      'Technology can influence societies.',
    ],
    hint: 'Think about why people build roads.',
    reflection: 'How do roads help your community today?',
  },
  {
    id: 20,
    level: 5,
    title: 'Ancient China',
    category: 'Ancient World',
    difficulty: 'Medium',
    skill: 'Cultural Awareness',
    emoji: '🏯',
    objective:
      'Recognize the long history and contributions of Chinese civilization.',
    introduction:
      'Chinese civilization developed over many centuries and made important contributions to writing, technology, philosophy, art, and government.',
    question: 'Which is an example of a historical Chinese contribution?',
    options: ['Paper-making', 'The internet', 'Modern satellites'],
    answer: 0,
    explanation:
      'Paper-making developed in ancient China and later spread to other parts of the world.',
    keyPoints: [
      'Civilizations develop technologies.',
      'Ideas and inventions can spread across regions.',
      'World history includes many interconnected societies.',
    ],
    hint: 'Which invention helped people record and share information?',
    reflection:
      "Which historical invention do you think changed people's lives?",
  },
  {
    id: 21,
    level: 6,
    title: 'The Printing Press',
    category: 'People & Change',
    difficulty: 'Medium',
    skill: 'Cause and Effect',
    emoji: '📰',
    objective: 'Understand how technology can influence society.',
    introduction:
      'Printing technology made it easier to produce and distribute written material in large numbers.',
    question: 'Why could printing have a major effect on society?',
    options: [
      'More people could access written information',
      'Books became invisible',
      'People stopped communicating',
    ],
    answer: 0,
    explanation:
      'Making written material easier to reproduce and distribute could help ideas and information spread more widely.',
    keyPoints: [
      'Technology can influence communication.',
      'Information can spread through new technologies.',
      'Historical change often has multiple causes.',
    ],
    hint: 'What happens when information becomes easier to share?',
    reflection: 'How does technology help people share information today?',
  },
  {
    id: 22,
    level: 6,
    title: 'The Industrial Revolution',
    category: 'People & Change',
    difficulty: 'Medium',
    skill: 'Cause and Effect',
    emoji: '🏭',
    objective: 'Introduce industrialisation and its effects on communities.',
    introduction:
      'Industrialisation changed manufacturing, transportation, work, cities, and everyday life in many places.',
    question: 'What was one effect of industrialisation?',
    options: [
      'Growth of factories and industrial cities',
      'The disappearance of all tools',
      'Everyone stopped working',
    ],
    answer: 0,
    explanation:
      'Industrialisation led to major growth in factory production and changed where and how many people worked.',
    keyPoints: [
      'Industrialisation changed work.',
      'Cities grew in many industrial regions.',
      'Historical changes can have benefits and challenges.',
    ],
    hint: 'Think about what happens when factories become important.',
    reflection: "What technology has changed people's work today?",
  },
  {
    id: 23,
    level: 6,
    title: 'Communication Then and Now',
    category: 'People & Change',
    difficulty: 'Easy',
    skill: 'Comparison',
    emoji: '📱',
    objective: 'Compare communication methods across time.',
    introduction:
      'People have communicated through speech, writing, letters, newspapers, telephones, radio, television, and digital technologies.',
    question: 'Which is a modern digital communication tool?',
    options: ['Messaging app', 'Stone tablet', 'Ancient scroll'],
    answer: 0,
    explanation:
      'Messaging apps are digital tools that allow people to communicate quickly.',
    keyPoints: [
      'Communication methods change.',
      'New technology can increase speed and reach.',
      'Older communication methods remain historically important.',
    ],
    hint: 'Which option uses modern digital technology?',
    reflection:
      'How would you send a message if there were no phones or internet?',
  },
  {
    id: 24,
    level: 6,
    title: 'An Invention Changes Life',
    category: 'People & Change',
    difficulty: 'Hard',
    skill: 'Cause and Effect',
    emoji: '💡',
    objective: 'Think about how inventions can create chains of change.',
    introduction:
      'An invention can affect how people work, travel, communicate, learn, or live.',
    question:
      'If a new transport system makes travel faster, what could happen?',
    options: [
      'People and goods may move more easily',
      'All roads disappear',
      'Nobody can travel',
    ],
    answer: 0,
    explanation:
      'Faster transportation can change trade, travel, work, and connections between places.',
    keyPoints: [
      'Inventions can have wider effects.',
      'Changes can create new opportunities.',
      'Historical cause and effect can involve several steps.',
    ],
    hint: 'What happens when travelling becomes easier?',
    reflection: 'Which invention has changed your daily life?',
  },
  {
    id: 25,
    level: 7,
    title: 'The Moon Landing',
    category: 'Modern History',
    difficulty: 'Easy',
    skill: 'Chronology',
    emoji: '🚀',
    objective: 'Place the first human Moon landing in modern history.',
    introduction:
      'Apollo 11 landed on the Moon in 1969, and Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface.',
    question: 'In which year did humans first walk on the Moon?',
    options: ['1969', '1900', '2005'],
    answer: 0,
    explanation: 'The Apollo 11 Moon landing happened in 1969.',
    keyPoints: [
      'Apollo 11 landed on the Moon in 1969.',
      'Space exploration is part of modern history.',
      'Technology can expand what humans are able to explore.',
    ],
    hint: 'The correct year is in the 20th century.',
    reflection:
      'What would you ask an astronaut who travelled to the Moon?',
  },
  {
    id: 26,
    level: 7,
    title: 'Independence Movements',
    category: 'Modern History',
    difficulty: 'Medium',
    skill: 'Cause and Effect',
    emoji: '✊',
    objective:
      'Understand that independence can result from organised movements and political change.',
    introduction:
      'During the 20th century, many countries experienced movements seeking independence from colonial rule.',
    question:
      'What is an independence movement generally trying to achieve?',
    options: [
      'Greater self-government or independence',
      'More control by another country',
      'The end of all communities',
    ],
    answer: 0,
    explanation:
      'Independence movements generally seek self-government or political independence.',
    keyPoints: [
      'Many countries experienced independence movements.',
      'Political change can involve many people.',
      'History should be studied from multiple perspectives.',
    ],
    hint: 'What does independence mean?',
    reflection:
      'Why might people want their community or country to govern itself?',
  },
  {
    id: 27,
    level: 7,
    title: 'Civil Rights',
    category: 'Modern History',
    difficulty: 'Hard',
    skill: 'Perspective',
    emoji: '⚖️',
    objective: 'Introduce the idea of movements for equal rights.',
    introduction:
      'Civil rights movements have challenged unfair treatment and worked toward greater equality and protection under the law.',
    question: 'What is a central idea in civil rights movements?',
    options: [
      'People should be treated with fairness and have their rights respected',
      'Only some people should have rights',
      'Rules should never change',
    ],
    answer: 0,
    explanation:
      'Civil rights movements have often focused on equality, dignity, and protection of rights.',
    keyPoints: [
      'Rights and equality are historical themes.',
      'People can organise to seek social change.',
      'Historical movements can have long-term effects.',
    ],
    hint: 'Think about equality and fair treatment.',
    reflection: 'Why is fairness important in a community?',
  },
  {
    id: 28,
    level: 7,
    title: 'History Is Connected',
    category: 'Modern History',
    difficulty: 'Hard',
    skill: 'Critical Thinking',
    emoji: '🔗',
    objective: 'Understand that historical events can influence later events.',
    introduction:
      'History is not a collection of unrelated events. Events can influence what happens later.',
    question:
      'Why do historians study events that happened before other events?',
    options: [
      'Earlier events can help explain later developments',
      'Dates are only for decoration',
      'The past never affects anything',
    ],
    answer: 0,
    explanation:
      'Understanding earlier events can help us understand causes, changes, and consequences.',
    keyPoints: [
      'Events can be connected.',
      'Causes can happen before effects.',
      'History helps explain change over time.',
    ],
    hint: 'What can happen when one event influences another?',
    reflection:
      'Can you think of something today that was influenced by something in the past?',
  },
  {
    id: 29,
    level: 8,
    title: 'Read a Timeline',
    category: 'Historical Thinking',
    difficulty: 'Medium',
    skill: 'Chronology',
    emoji: '📅',
    objective: 'Use timelines to understand sequence.',
    introduction:
      'A timeline places events in chronological order and helps us see relationships between dates.',
    question:
      'If Event A happened in 1957 and Event B happened in 1969, which happened first?',
    options: ['Event A', 'Event B', 'They happened at the same time'],
    answer: 0,
    explanation: '1957 comes before 1969.',
    keyPoints: [
      'Timelines show chronological order.',
      'Years help us place events.',
      'Chronology helps organise historical knowledge.',
    ],
    hint: 'Which number comes first when counting forward?',
    reflection: 'Choose three important events and put them on a timeline.',
  },
  {
    id: 30,
    level: 8,
    title: 'Cause and Effect',
    category: 'Historical Thinking',
    difficulty: 'Hard',
    skill: 'Cause and Effect',
    emoji: '➡️',
    objective: 'Identify simple cause-and-effect relationships.',
    introduction:
      'Historical events often have causes and consequences. Sometimes there are several causes and effects.',
    question:
      'If a new road connects two communities, what could be one consequence?',
    options: [
      'Travel and trade between them may become easier',
      'The communities disappear',
      'People forget how to walk',
    ],
    answer: 0,
    explanation:
      'A new road can make movement between communities easier, potentially affecting trade and communication.',
    keyPoints: [
      'Causes help explain why things happen.',
      'Consequences describe what happens afterward.',
      'Historical events can have multiple consequences.',
    ],
    hint: 'What might become easier when two places are connected?',
    reflection: 'What is one change in your community and what caused it?',
  },
  {
    id: 31,
    level: 8,
    title: 'Change and Continuity',
    category: 'Historical Thinking',
    difficulty: 'Hard',
    skill: 'Change and Continuity',
    emoji: '⚖️',
    objective: 'Identify what changes and what stays similar.',
    introduction:
      'Historians ask both what changed and what continued across time.',
    question:
      'A community gets smartphones but people still gather for family meals. What does this show?',
    options: [
      'Some things changed while some things continued',
      'Nothing changed',
      'Everything changed',
    ],
    answer: 0,
    explanation:
      'Technology changed, while the practice of gathering for family meals continued.',
    keyPoints: [
      'Change and continuity can happen together.',
      'Not everything changes at the same time.',
      'This helps historians describe societies accurately.',
    ],
    hint: 'Look for one thing that is new and one thing that stayed.',
    reflection:
      'What has changed and what has stayed the same in your family?',
  },
  {
    id: 32,
    level: 8,
    title: 'Compare Two Societies',
    category: 'Historical Thinking',
    difficulty: 'Hard',
    skill: 'Comparison',
    emoji: '🔍',
    objective:
      'Practise comparing historical societies without assuming one is automatically better.',
    introduction:
      'Historians can compare societies by looking at government, technology, trade, culture, environment, and daily life.',
    question: 'What is a useful way to compare two ancient societies?',
    options: [
      'Study how people lived and organised their societies',
      "Decide which society is 'better' immediately",
      'Look only at their clothing',
    ],
    answer: 0,
    explanation:
      'Comparing several aspects gives a fuller understanding of historical societies.',
    keyPoints: [
      'Comparison uses multiple criteria.',
      'Different societies can have different strengths and challenges.',
      'Historical comparison should be thoughtful.',
    ],
    hint: 'What different parts of society could you investigate?',
    reflection: 'What two historical societies would you like to compare?',
  },
  {
    id: 33,
    level: 9,
    title: 'A Photograph as Evidence',
    category: 'Perspectives & Evidence',
    difficulty: 'Medium',
    skill: 'Historical Evidence',
    emoji: '📷',
    objective: 'Understand what photographs can and cannot tell us.',
    introduction:
      'Photographs can provide evidence about people, clothing, places, objects, and activities.',
    question: 'What can a historical photograph help you investigate?',
    options: [
      'What people and places looked like at that time',
      'Exactly what everyone in the country thought',
      'Everything that happened that year',
    ],
    answer: 0,
    explanation:
      'A photograph can show what was captured in the image, but it cannot automatically tell us everything about the whole society.',
    keyPoints: [
      'Sources provide evidence.',
      'Evidence has limits.',
      'Historians ask careful questions about sources.',
    ],
    hint: 'What can you actually see in a photograph?',
    reflection:
      'What questions would you ask when looking at an old photograph?',
  },
  {
    id: 34,
    level: 9,
    title: 'Whose Story?',
    category: 'Perspectives & Evidence',
    difficulty: 'Hard',
    skill: 'Perspective',
    emoji: '👥',
    objective:
      'Understand that historical accounts can reflect different perspectives.',
    introduction:
      'Different people can experience the same event differently. Historians can examine multiple accounts.',
    question:
      'Why might two people describe the same historical event differently?',
    options: [
      'They may have different experiences or perspectives',
      'One person must automatically be lying',
      'History changes every second',
    ],
    answer: 0,
    explanation:
      'People may have different roles, experiences, information, or viewpoints.',
    keyPoints: [
      'Historical perspectives can differ.',
      'Multiple accounts can provide additional information.',
      'Historians compare evidence carefully.',
    ],
    hint: 'Think about two people standing in different places during an event.',
    reflection:
      'Why can listening to more than one person help us understand an event?',
  },
  {
    id: 35,
    level: 9,
    title: 'Primary or Secondary?',
    category: 'Perspectives & Evidence',
    difficulty: 'Hard',
    skill: 'Historical Evidence',
    emoji: '📚',
    objective:
      'Introduce the distinction between primary and secondary sources.',
    introduction:
      'A primary source comes directly from the time or event being studied. A secondary source is created later to interpret or explain the past.',
    question:
      'Which could be a primary source for studying a historical event?',
    options: [
      'A letter written by someone who experienced the event',
      'A textbook written many years later',
      'A modern cartoon about the event',
    ],
    answer: 0,
    explanation:
      'A letter written by someone who experienced an event can be a primary source.',
    keyPoints: [
      'Primary sources come directly from the period or experience.',
      'Secondary sources interpret or explain the past.',
      'Historians use different types of sources.',
    ],
    hint: 'Which person was actually there at the time?',
    reflection: 'What primary source would you like to examine?',
  },
  {
    id: 36,
    level: 9,
    title: 'Evidence Before Conclusion',
    category: 'Perspectives & Evidence',
    difficulty: 'Hard',
    skill: 'Critical Thinking',
    emoji: '🧠',
    objective: 'Practise avoiding conclusions without enough evidence.',
    introduction:
      'Good historical thinking requires evidence before making strong conclusions.',
    question:
      'You find one old photograph showing an empty street. Can you conclude the whole town was always empty?',
    options: [
      'No, one photograph is not enough',
      'Yes, definitely',
      'Only if the photograph is colourful',
    ],
    answer: 0,
    explanation:
      'One photograph captures one moment. More evidence would be needed to make a broader claim.',
    keyPoints: [
      'Evidence has limits.',
      'One source may not tell the whole story.',
      'Strong conclusions require appropriate evidence.',
    ],
    hint: 'Does one moment show everything that happened?',
    reflection: 'Why is it useful to look at more than one source?',
  },
  {
    id: 37,
    level: 10,
    title: 'What Can History Teach Us?',
    category: 'Past, Present & Future',
    difficulty: 'Hard',
    skill: 'Critical Thinking',
    emoji: '📖',
    objective:
      'Understand that studying the past can help people think about the present.',
    introduction:
      'History can help us understand how people responded to challenges, made decisions, created societies, and changed over time.',
    question: 'Why can studying history be useful?',
    options: [
      'It helps us understand people, change, and the consequences of decisions',
      'It tells us exactly what will happen tomorrow',
      'It means we never need to think for ourselves',
    ],
    answer: 0,
    explanation:
      'History gives us evidence and examples that can help us understand the world and think more carefully.',
    keyPoints: [
      'History helps us understand change.',
      'Past decisions can have consequences.',
      'History encourages thoughtful questions.',
    ],
    hint: 'Think about what we can learn from past experiences.',
    reflection: 'What is one lesson you think history can teach?',
  },
  {
    id: 38,
    level: 10,
    title: 'Investigate Your Community',
    category: 'Past, Present & Future',
    difficulty: 'Hard',
    skill: 'Research',
    emoji: '🔎',
    objective: 'Plan a simple historical investigation.',
    introduction:
      'You can investigate your own community by asking questions and examining evidence.',
    question:
      "What is a good first step when investigating your community's history?",
    options: [
      'Choose a question you want to investigate',
      'Make up the answer',
      'Ignore all evidence',
    ],
    answer: 0,
    explanation: 'A clear question gives your investigation direction.',
    keyPoints: [
      'Research begins with questions.',
      'Evidence helps answer questions.',
      'Local history can be investigated.',
    ],
    hint: 'What should guide your investigation?',
    reflection:
      "What question would you ask about your community's past?",
  },
  {
    id: 39,
    level: 10,
    title: 'Past and Present',
    category: 'Past, Present & Future',
    difficulty: 'Hard',
    skill: 'Change and Continuity',
    emoji: '🔄',
    objective: 'Connect historical changes with life today.',
    introduction:
      'The world today has been shaped by many earlier events, inventions, movements, and decisions.',
    question: 'How can the past affect the present?',
    options: [
      'Earlier events and inventions can influence how people live today',
      'The past has no connection to today',
      'Only ancient animals affect modern life',
    ],
    answer: 0,
    explanation:
      'Many features of modern society have developed from earlier events, ideas, technologies, and decisions.',
    keyPoints: [
      'The present has historical roots.',
      'Past inventions can remain influential.',
      "Historical understanding helps explain today's world.",
    ],
    hint: 'Think about something you use today that was developed over time.',
    reflection: "What part of today's world has a long history?",
  },
  {
    id: 40,
    level: 10,
    title: 'We Are Making History',
    category: 'Past, Present & Future',
    difficulty: 'Hard',
    skill: 'Reflection',
    emoji: '🌟',
    objective:
      "Understand that today's actions become part of tomorrow's history.",
    introduction:
      'History is not only something that happened long ago. People today are creating events that future generations may study.',
    question: 'Which statement best describes our lives today?',
    options: [
      'What we do today can become part of future history',
      'Only people from thousands of years ago made history',
      'Nothing happening today matters',
    ],
    answer: 0,
    explanation:
      "Today's events, choices, inventions, and experiences become part of the historical record of the future.",
    keyPoints: [
      'We are living through history.',
      "Today's decisions can affect the future.",
      'Everyone can contribute to their community.',
    ],
    hint: 'What will people in the future learn about our time?',
    reflection:
      'What would you like future generations to remember about your community?',
  },
];

const LEVELS = [
  {
    level: 1,
    title: 'My Story',
    description: 'Discover personal history, memories, time, and change.',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    level: 2,
    title: 'My Community',
    description: 'Explore places, people, memories, and community change.',
    icon: <Users className="w-5 h-5" />,
  },
  {
    level: 3,
    title: 'Ghanaian History',
    description:
      'Explore important people, places, events, and developments in Ghana.',
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    level: 4,
    title: 'African Civilizations',
    description: 'Discover the richness and diversity of African history.',
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    level: 5,
    title: 'Ancient World',
    description: 'Explore major civilizations and their contributions.',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    level: 6,
    title: 'People & Change',
    description:
      'Discover how inventions, technology, and ideas changed societies.',
    icon: <Target className="w-5 h-5" />,
  },
  {
    level: 7,
    title: 'Modern History',
    description: 'Explore important events and movements in recent history.',
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    level: 8,
    title: 'Historical Thinking',
    description:
      'Practise chronology, cause and effect, comparison, and change.',
    icon: <Search className="w-5 h-5" />,
  },
  {
    level: 9,
    title: 'Perspectives & Evidence',
    description:
      'Learn how historians use sources and consider different perspectives.',
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    level: 10,
    title: 'Past, Present & Future',
    description:
      "Connect historical knowledge with today's world and tomorrow.",
    icon: <Star className="w-5 h-5" />,
  },
];

export const HistoryExplorer: React.FC<HistoryExplorerProps> = ({
  onComplete,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');

  const [progress, setProgress] = useState<Record<number, HistoryProgress>>(
    {}
  );

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const levelChallenges = useMemo(() => {
    if (selectedLevel === null) return [];
    return CHALLENGES.filter((challenge) => challenge.level === selectedLevel);
  }, [selectedLevel]);

  const currentChallenge = levelChallenges[challengeIndex];

  const currentProgress: HistoryProgress = currentChallenge
    ? progress[currentChallenge.id] ?? {
        attempts: 0,
        mastered: false,
        usedHint: false,
        bestScore: 0,
      }
    : {
        attempts: 0,
        mastered: false,
        usedHint: false,
        bestScore: 0,
      };

  const masteredCount = Object.values(progress).filter(
    (item) => item.mastered
  ).length;

  const updateProgress = (
    challengeId: number,
    updates: Partial<HistoryProgress>
  ) => {
    setProgress((previous) => ({
      ...previous,
      [challengeId]: {
        ...(previous[challengeId] ?? {
          attempts: 0,
          mastered: false,
          usedHint: false,
          bestScore: 0,
        }),
        ...updates,
      },
    }));
  };

  const resetChallengeState = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setShowHint(false);
    setFeedback('');
  };

  /* Auto-read the challenge when it changes */
  useEffect(() => {
    if (!autoReadEnabled || !currentChallenge || isComplete) return;

    const timer = window.setTimeout(() => {
      speak(
        `${currentChallenge.title}. ${currentChallenge.introduction} ${currentChallenge.question}`,
      );
    }, 400);

    return () => window.clearTimeout(timer);
  }, [currentChallenge, isComplete, speak, autoReadEnabled]);

  /* Read the hint when it opens */
  useEffect(() => {
    if (showHint && currentChallenge && !answerChecked) {
      speak(currentChallenge.hint);
    }
  }, [showHint, currentChallenge, answerChecked, speak]);

  /* Announce level completion */
  useEffect(() => {
    if (!isComplete || selectedLevel === null) return;

    const levelMastered = levelChallenges.filter(
      (challenge) => progress[challenge.id]?.mastered
    ).length;

    speak(
      `Level complete! You mastered ${levelMastered} of ${levelChallenges.length} challenges. Well done!`,
    );
  }, [isComplete, selectedLevel, levelChallenges, progress, speak]);

  const startLevel = (level: number) => {
    if (soundEnabled) playSoundFeedback('move');

    setSelectedLevel(level);
    setChallengeIndex(0);
    resetChallengeState();
    setIsComplete(false);
    setHasFinished(false);
  };

  const handleHint = () => {
    if (!currentChallenge) return;

    setShowHint(true);

    updateProgress(currentChallenge.id, {
      usedHint: true,
    });
  };

  const awardPoints = () => {
    if (!currentChallenge || currentProgress.mastered) return;

    let earned = 10;

    if (mode === 'mastery' && streak >= 2) {
      earned += 5;
    }

    if (showHint || currentProgress.usedHint) {
      earned = Math.max(5, earned - 5);
    }

    setScore((previous) => previous + earned);

    updateProgress(currentChallenge.id, {
      mastered: true,
      bestScore: earned,
    });
  };

  const checkAnswer = (answerIndex: number) => {
    if (!currentChallenge || answerChecked) return;

    setSelectedAnswer(answerIndex);
    setAnswerChecked(true);

    const correct = answerIndex === currentChallenge.answer;

    updateProgress(currentChallenge.id, {
      attempts: currentProgress.attempts + 1,
    });

    if (correct) {
      if (soundEnabled) playSoundFeedback('correct');

      setStreak((previous) => previous + 1);
      setFeedback(currentChallenge.explanation);

      speak(`Excellent historical thinking! ${currentChallenge.explanation}`);

      awardPoints();
    } else {
      if (soundEnabled) playSoundFeedback('try-again');

      setStreak(0);

      const message =
        'Not quite. Read the question again and think about the evidence or clue that supports the answer.';

      setFeedback(message);
      speak(message);
    }
  };

  const nextChallenge = () => {
    if (challengeIndex < levelChallenges.length - 1) {
      setChallengeIndex((previous) => previous + 1);
      resetChallengeState();
    } else {
      setIsComplete(true);
    }
  };

  const previousChallenge = () => {
    if (challengeIndex <= 0) return;

    setChallengeIndex((previous) => previous - 1);
    resetChallengeState();
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);
  };

  const resetAll = () => {
    setSelectedLevel(null);
    setChallengeIndex(0);
    setProgress({});
    setScore(0);
    setStreak(0);
    resetChallengeState();
    setIsComplete(false);
    setHasFinished(false);

    speak("Let's explore history again!");
  };

  /* ============ LEVEL SELECTOR ============ */
  if (selectedLevel === null) {
    return (
      <div className="max-w-5xl mx-auto bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <BookOpen className="w-7 h-7 text-amber-400" />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                History &amp; Society
              </h2>

              <p className="text-gray-400 mt-1">
                Explore the past, understand change, and think like a historian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-yellow-400 font-bold">⭐ {score}</span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-400 font-bold">
                {masteredCount}/{CHALLENGES.length}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Volume2
                className={`w-5 h-5 ${
                  soundEnabled ? 'text-amber-300' : 'text-gray-500'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-7">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-white font-bold text-lg">
                Think like a historian
              </h3>

              <p className="text-gray-400 text-sm mt-2 leading-6">
                History is more than remembering dates. You will learn to
                organise events in time, investigate evidence, compare
                societies, understand cause and effect, consider different
                perspectives, and connect the past with the present.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-7">
          <h3 className="text-white font-bold text-lg mb-3">
            Choose your learning mode
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(
              [
                ['guided', 'Guided', 'Learn with explanations and support.'],
                [
                  'practice',
                  'Practice',
                  'Build your historical thinking skills.',
                ],
                [
                  'mastery',
                  'Mastery',
                  'Challenge yourself with less support.',
                ],
              ] as const
            ).map(([value, title, description]) => (
              <button
                key={value}
                onClick={() => {
                  setMode(value);
                  if (soundEnabled) playSoundFeedback('move');
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === value
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="text-white font-bold">{title}</div>
                <div className="text-gray-400 text-sm mt-1">
                  {description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEVELS.map((level) => {
            const total = CHALLENGES.filter(
              (challenge) => challenge.level === level.level
            ).length;

            const mastered = CHALLENGES.filter(
              (challenge) =>
                challenge.level === level.level &&
                progress[challenge.id]?.mastered
            ).length;

            const percentage = total === 0 ? 0 : (mastered / total) * 100;

            return (
              <motion.button
                key={level.level}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startLevel(level.level)}
                className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-400/40 hover:bg-amber-500/5 transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                    {level.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <span className="text-xs text-amber-400 font-bold">
                          LEVEL {level.level}
                        </span>

                        <h3 className="text-white font-bold text-lg mt-1">
                          {level.title}
                        </h3>
                      </div>

                      <span className="text-xs text-gray-500">
                        {mastered}/{total}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mt-2 leading-5">
                      {level.description}
                    </p>

                    <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-500" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>
      </div>
    );
  }

  /* ============ COMPLETION SCREEN ============ */
  if (isComplete) {
    const levelMastered = levelChallenges.filter(
      (challenge) => progress[challenge.id]?.mastered
    ).length;

    const masteryPercentage =
      levelChallenges.length === 0
        ? 0
        : Math.round((levelMastered / levelChallenges.length) * 100);

    return (
      <div className="max-w-3xl mx-auto bg-app-card p-8 rounded-3xl border border-app-border shadow-xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-amber-400" />
          </div>

          <h2 className="text-3xl font-bold text-white mt-6">
            Level Complete!
          </h2>

          <p className="text-gray-400 mt-2">
            You completed{' '}
            {LEVELS.find((level) => level.level === selectedLevel)?.title}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <Star className="w-6 h-6 text-yellow-400 mx-auto" />
              <div className="text-2xl font-bold text-white mt-2">{score}</div>
              <div className="text-gray-500 text-sm">Total Score</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <Target className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-2xl font-bold text-white mt-2">
                {levelMastered}/{levelChallenges.length}
              </div>
              <div className="text-gray-500 text-sm">Mastered</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <Clock className="w-6 h-6 text-blue-400 mx-auto" />
              <div className="text-2xl font-bold text-white mt-2">
                {masteryPercentage}%
              </div>
              <div className="text-gray-500 text-sm">Mastery</div>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left">
            <h3 className="text-white font-bold mb-3">
              Historical thinking skills practised
            </h3>

            <div className="space-y-2">
              {[
                'Understanding chronology',
                'Investigating historical evidence',
                'Understanding cause and effect',
                'Comparing societies and time periods',
                'Considering different perspectives',
                'Understanding change and continuity',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => {
                setChallengeIndex(0);
                resetChallengeState();
                setIsComplete(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              Learn Again
            </button>

            <button
              onClick={finishAndMoveUp}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-400"
            >
              Finish &amp; Move Up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedLevel(null);
              setIsComplete(false);
            }}
            className="mt-5 text-sm text-gray-500 hover:text-white"
          >
            Choose Another Level
          </button>
        </motion.div>
      </div>
    );
  }

  /* ============ ACTIVE CHALLENGE ============ */
  if (!currentChallenge) return null;

  const progressPercentage =
    levelChallenges.length === 0
      ? 0
      : ((challengeIndex + 1) / levelChallenges.length) * 100;

  const isCorrect =
    selectedAnswer !== null && selectedAnswer === currentChallenge.answer;

  return (
    <div className="max-w-3xl mx-auto bg-app-card p-5 md:p-7 rounded-3xl border border-app-border shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          onClick={() => {
            setSelectedLevel(null);
            resetChallengeState();
          }}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Levels
        </button>

        <div className="text-center">
          <div className="text-xs text-amber-400 font-bold">
            LEVEL {selectedLevel}
          </div>

          <h2 className="text-white font-bold">
            {LEVELS.find((level) => level.level === selectedLevel)?.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold">⭐ {score}</span>

          {streak > 0 && (
            <span className="text-orange-400 text-sm font-bold">
              🔥 {streak}
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Challenge {challengeIndex + 1} of {levelChallenges.length}
          </span>

          <span>{Math.round(progressPercentage)}%</span>
        </div>

        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
          {currentChallenge.category}
        </span>

        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">
          {currentChallenge.skill}
        </span>

        <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-bold">
          {currentChallenge.difficulty}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentChallenge.id}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
        >
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-5">
            <div className="text-5xl mb-4">{currentChallenge.emoji}</div>

            <h3 className="text-2xl font-bold text-white">
              {currentChallenge.title}
            </h3>

            <p className="text-gray-400 mt-3 leading-6">
              {currentChallenge.introduction}
            </p>

            <div className="mt-5 p-4 rounded-xl bg-black/20 border border-white/5">
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wide mb-2">
                Your challenge
              </div>

              <p className="text-white font-semibold text-lg leading-7">
                {currentChallenge.question}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {currentChallenge.options.map((option, optionIndex) => {
              const selected = selectedAnswer === optionIndex;

              const correct =
                answerChecked && currentChallenge.answer === optionIndex;

              return (
                <motion.button
                  key={option}
                  whileHover={!answerChecked ? { scale: 1.01 } : undefined}
                  whileTap={!answerChecked ? { scale: 0.99 } : undefined}
                  onClick={() => checkAnswer(optionIndex)}
                  disabled={answerChecked}
                  className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-all ${
                    correct
                      ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300'
                      : selected && answerChecked
                        ? 'bg-red-500/10 border-red-400 text-red-300'
                        : 'bg-white/[0.03] border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{option}</span>

                    {correct && (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {answerChecked && feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 p-5 rounded-2xl border ${
                isCorrect
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle
                  className={`w-6 h-6 flex-shrink-0 ${
                    isCorrect ? 'text-emerald-400' : 'text-red-400'
                  }`}
                />

                <div>
                  <h4
                    className={`font-bold ${
                      isCorrect ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isCorrect
                      ? 'Excellent historical thinking!'
                      : "Let's investigate again"}
                  </h4>

                  <p className="text-gray-300 text-sm mt-2 leading-6">
                    {feedback}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {answerChecked && (
            <div className="mt-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <h4 className="text-white font-bold mb-3">What you learned</h4>

              <ul className="space-y-2">
                {currentChallenge.keyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showHint && !answerChecked && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />

                <p className="text-yellow-100 text-sm">
                  {currentChallenge.hint}
                </p>
              </div>
            </motion.div>
          )}

          {answerChecked && (
            <div className="mt-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wide">
                Think &amp; Reflect
              </div>

              <p className="text-white font-semibold mt-2">
                {currentChallenge.reflection}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleHint}
              disabled={showHint || answerChecked}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 disabled:opacity-40"
            >
              <Lightbulb className="w-4 h-4" />
              Hint
            </button>

            <button
              onClick={previousChallenge}
              disabled={challengeIndex === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {answerChecked ? (
              <button
                onClick={nextChallenge}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-400"
              >
                {challengeIndex === levelChallenges.length - 1
                  ? 'Complete Level'
                  : 'Continue'}

                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={resetChallengeState}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HistoryExplorer;