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
  Users,
  Globe2,
  Droplets,
  Heart,
  Shield,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

type LearningMode = 'guided' | 'practice' | 'mastery';

type GlobalSkill =
  | 'Observation'
  | 'Communication'
  | 'Collaboration'
  | 'Culture'
  | 'Geography'
  | 'Environment'
  | 'Problem Solving'
  | 'Perspective'
  | 'Research'
  | 'Evidence'
  | 'Reflection'
  | 'Decision Making'
  | 'Global Awareness';

type ChallengeType = 'choice' | 'perspective' | 'observation' | 'reflection';

interface GlobalQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface GlobalChallenge {
  id: number;
  level: number;
  title: string;
  category: string;
  difficulty: Difficulty;
  skill: GlobalSkill;
  type: ChallengeType;
  emoji: string;
  objective: string;
  introduction: string;
  question: string;
  options?: string[];
  answer?: number;
  explanation: string;
  keyPoints: string[];
  hint: string;
  reflection?: string;
}

interface ChallengeProgress {
  attempts: number;
  mastered: boolean;
  usedHint: boolean;
  bestScore: number;
}

interface GlobalPerspectivesProps {
  onComplete?: (score: number) => void;
}

const CHALLENGES: GlobalChallenge[] = [
  {
    id: 1,
    level: 1,
    title: 'My Community',
    category: 'Me & My World',
    difficulty: 'Easy',
    skill: 'Global Awareness',
    type: 'choice',
    emoji: '🏘️',
    objective: 'Understand that a community is made up of people and places.',
    introduction:
      'A community is a group of people who live, learn, work, or spend time together.',
    question: 'Which could be part of your community?',
    options: ['A school', 'A cloud on another planet', 'A star'],
    answer: 0,
    explanation:
      'A school can be an important part of a community because people learn and work there together.',
    keyPoints: [
      'Communities contain people.',
      'Communities contain places.',
      'People in communities can help one another.',
    ],
    hint: 'Think about a place you might visit every week.',
    reflection: 'What is one place in your community that is important to you?',
  },
  {
    id: 2,
    level: 1,
    title: 'People Who Help Us',
    category: 'Me & My World',
    difficulty: 'Easy',
    skill: 'Global Awareness',
    type: 'choice',
    emoji: '🤝',
    objective: 'Recognize different ways people contribute to communities.',
    introduction:
      'Different people have different jobs and responsibilities that help communities work.',
    question: 'Who might help children learn at school?',
    options: ['A teacher', 'A pilot on an airplane', 'A mountain'],
    answer: 0,
    explanation:
      'Teachers help children learn, ask questions, practise skills, and understand new ideas.',
    keyPoints: [
      'People have different roles.',
      'Different roles can support a community.',
      'Everyone can contribute in different ways.',
    ],
    hint: 'Think about who helps you during a lesson.',
    reflection: 'How could you help someone in your community?',
  },
  {
    id: 3,
    level: 1,
    title: 'Needs and Wants',
    category: 'Me & My World',
    difficulty: 'Easy',
    skill: 'Decision Making',
    type: 'choice',
    emoji: '🧺',
    objective: 'Begin distinguishing between needs and wants.',
    introduction:
      'A need is something important for living and staying safe. A want is something we would like to have.',
    question: 'Which is a basic need?',
    options: ['Clean water', 'A new toy every day', 'A shiny sticker'],
    answer: 0,
    explanation:
      'Clean water is a basic need because people need water to live.',
    keyPoints: [
      'Needs are important for life and wellbeing.',
      'Wants are things we would like.',
      'Good decisions consider our needs first.',
    ],
    hint: 'Which option helps your body stay healthy?',
    reflection: 'What is one thing you need and one thing you simply want?',
  },
  {
    id: 4,
    level: 1,
    title: 'Listening to Others',
    category: 'Me & My World',
    difficulty: 'Easy',
    skill: 'Communication',
    type: 'perspective',
    emoji: '👂',
    objective: 'Understand why listening matters when people share ideas.',
    introduction:
      'People may have different experiences and ideas. Listening helps us understand them.',
    question:
      'A classmate has a different idea from you. What is a good first step?',
    options: [
      'Listen to their idea',
      'Tell them they are wrong immediately',
      'Walk away without listening',
    ],
    answer: 0,
    explanation:
      "Listening gives you a chance to understand another person's thinking before making a decision.",
    keyPoints: [
      'People can have different ideas.',
      'Listening helps us understand.',
      'Disagreement does not mean someone should be ignored.',
    ],
    hint: 'What helps you understand what someone is saying?',
    reflection: 'How do you feel when someone listens carefully to you?',
  },
  {
    id: 5,
    level: 2,
    title: 'Community Rules',
    category: 'People & Communities',
    difficulty: 'Easy',
    skill: 'Decision Making',
    type: 'choice',
    emoji: '📋',
    objective: 'Understand why communities create rules.',
    introduction:
      'Rules can help people stay safe, cooperate, and understand what is expected.',
    question: 'Why might a school have rules?',
    options: [
      'To help people learn and stay safe',
      'To make everyone unhappy',
      'Because rules are decorations',
    ],
    answer: 0,
    explanation:
      'Good rules can support safety, fairness, cooperation, and learning.',
    keyPoints: [
      'Rules can protect people.',
      'Rules can support cooperation.',
      'Rules should have a useful purpose.',
    ],
    hint: 'Think about what happens when everyone knows how to behave safely.',
    reflection: 'What is one school rule that helps people?',
  },
  {
    id: 6,
    level: 2,
    title: 'Working Together',
    category: 'People & Communities',
    difficulty: 'Easy',
    skill: 'Collaboration',
    type: 'choice',
    emoji: '🧩',
    objective: 'Recognize the value of cooperation.',
    introduction:
      'Some problems are easier when people share ideas, skills, and responsibilities.',
    question:
      'Your group needs to build a large model. What is a good approach?',
    options: [
      'Share jobs and work together',
      'Let one person do everything',
      'Hide the materials',
    ],
    answer: 0,
    explanation:
      "Sharing responsibilities can help a group use everyone's strengths.",
    keyPoints: [
      'Teams can share responsibilities.',
      'People have different strengths.',
      'Cooperation can help solve problems.',
    ],
    hint: 'What would make the work easier for everyone?',
    reflection: 'What is something you enjoy doing as part of a team?',
  },
  {
    id: 7,
    level: 2,
    title: 'A Community Problem',
    category: 'People & Communities',
    difficulty: 'Medium',
    skill: 'Problem Solving',
    type: 'perspective',
    emoji: '🗑️',
    objective: 'Identify a problem and begin thinking about solutions.',
    introduction:
      'Imagine that rubbish is collecting around a community playground.',
    question: 'What should people do first?',
    options: [
      'Observe the problem and understand why it is happening',
      'Blame someone immediately',
      'Ignore it forever',
    ],
    answer: 0,
    explanation:
      'Understanding a problem helps people choose solutions that address its cause.',
    keyPoints: [
      'First identify the problem.',
      'Observe what is happening.',
      'Good solutions should address real causes.',
    ],
    hint: 'Before solving a problem, what should you understand?',
    reflection: 'What is one small problem you could help solve?',
  },
  {
    id: 8,
    level: 2,
    title: 'Fairness',
    category: 'People & Communities',
    difficulty: 'Medium',
    skill: 'Perspective',
    type: 'perspective',
    emoji: '⚖️',
    objective: 'Explore fairness from different perspectives.',
    introduction:
      "Fairness means thinking carefully about people's needs, responsibilities, and circumstances.",
    question:
      'Two children need the same book for their homework at the same time. What could be a fair solution?',
    options: [
      'Take turns using the book',
      'One child keeps it forever',
      'Hide the book',
    ],
    answer: 0,
    explanation:
      'Taking turns can give both children an opportunity to use the shared resource.',
    keyPoints: [
      'Fair solutions consider everyone involved.',
      'Sharing resources can require cooperation.',
      'Different situations may need different solutions.',
    ],
    hint: 'How could both children get a chance?',
    reflection: 'What does fairness mean to you?',
  },
  {
    id: 9,
    level: 3,
    title: 'Water Around Us',
    category: 'Our Planet',
    difficulty: 'Easy',
    skill: 'Environment',
    type: 'choice',
    emoji: '💧',
    objective: 'Understand why water is important.',
    introduction:
      'Water is important for people, animals, plants, farming, and many everyday activities.',
    question: 'Why is clean water important?',
    options: [
      'Living things need water',
      'Only because it looks beautiful',
      'Because water is always blue',
    ],
    answer: 0,
    explanation: 'Living things need water to survive and stay healthy.',
    keyPoints: [
      'Water supports life.',
      'People need safe drinking water.',
      'Water should be used carefully.',
    ],
    hint: 'Think about what happens if a living thing has no water.',
    reflection: 'What is one way your family could save water?',
  },
  {
    id: 10,
    level: 3,
    title: 'Saving Water',
    category: 'Our Planet',
    difficulty: 'Easy',
    skill: 'Environment',
    type: 'choice',
    emoji: '🚰',
    objective: 'Identify responsible ways to use water.',
    introduction:
      'Small actions can help reduce unnecessary water use.',
    question: 'Which action saves water?',
    options: [
      'Turn off the tap while brushing your teeth',
      'Leave the tap running',
      'Play with running water',
    ],
    answer: 0,
    explanation:
      'Turning off the tap when water is not needed reduces unnecessary water use.',
    keyPoints: [
      'Use only the water you need.',
      'Turn taps off when finished.',
      'Small actions can make a difference.',
    ],
    hint: 'Which choice stops water flowing when you do not need it?',
    reflection: 'Where could you save water today?',
  },
  {
    id: 11,
    level: 3,
    title: 'Where Does Food Come From?',
    category: 'Our Planet',
    difficulty: 'Easy',
    skill: 'Global Awareness',
    type: 'choice',
    emoji: '🌱',
    objective: 'Connect food with farming, plants, animals, and communities.',
    introduction:
      'Much of the food we eat comes from farms, gardens, trees, animals, or the sea.',
    question: 'Where can tomatoes come from?',
    options: ['A plant', 'A computer', 'A cloud'],
    answer: 0,
    explanation:
      'Tomatoes grow on plants and can be produced by farmers or gardeners.',
    keyPoints: [
      'Plants provide many foods.',
      'Farmers help produce food.',
      'Food connects people with nature.',
    ],
    hint: 'Think about where a tomato grows.',
    reflection: 'What food have you seen growing?',
  },
  {
    id: 12,
    level: 3,
    title: 'Reducing Waste',
    category: 'Our Planet',
    difficulty: 'Medium',
    skill: 'Environment',
    type: 'choice',
    emoji: '♻️',
    objective: 'Understand simple ways to reduce waste.',
    introduction:
      'Reducing unnecessary waste can help communities care for the environment.',
    question: 'Which action can reduce waste?',
    options: [
      'Reuse an item when it is safe to do so',
      'Throw everything away immediately',
      'Use a new item every time',
    ],
    answer: 0,
    explanation:
      'Reusing suitable items can reduce the amount of waste we produce.',
    keyPoints: [
      'Think before throwing something away.',
      'Some items can be reused.',
      'Waste affects our environment.',
    ],
    hint: 'Can an item sometimes be used again?',
    reflection: 'What is something you could reuse instead of throwing away?',
  },
  {
    id: 13,
    level: 4,
    title: 'Different Homes',
    category: 'Cultures & Diversity',
    difficulty: 'Easy',
    skill: 'Culture',
    type: 'perspective',
    emoji: '🏠',
    objective: 'Recognize that people live in different kinds of homes.',
    introduction:
      'Homes can look different depending on climate, materials, traditions, location, and family needs.',
    question: 'Is there only one correct kind of home?',
    options: ['No', 'Yes', 'Only in one country'],
    answer: 0,
    explanation:
      'People live in many kinds of homes adapted to their environment and way of life.',
    keyPoints: [
      'Homes can be different.',
      'Environment can influence homes.',
      'Difference does not mean better or worse.',
    ],
    hint: 'Think about homes in cities, villages, hot places, and cold places.',
    reflection: 'What is special about your home?',
  },
  {
    id: 14,
    level: 4,
    title: 'Languages Around Us',
    category: 'Cultures & Diversity',
    difficulty: 'Easy',
    skill: 'Culture',
    type: 'choice',
    emoji: '🗣️',
    objective: 'Understand that people communicate in many languages.',
    introduction:
      'The world has thousands of languages. Language is an important part of culture and identity.',
    question: 'What can language help people do?',
    options: [
      'Communicate ideas',
      'Make mountains move',
      'Stop the weather',
    ],
    answer: 0,
    explanation:
      'Language allows people to communicate thoughts, feelings, information, stories, and traditions.',
    keyPoints: [
      'Languages can be different.',
      'Language carries ideas and traditions.',
      'Learning languages can help us connect.',
    ],
    hint: 'What are you using when you talk to someone?',
    reflection: 'What languages can you hear around you?',
  },
  {
    id: 15,
    level: 4,
    title: 'Food & Traditions',
    category: 'Cultures & Diversity',
    difficulty: 'Medium',
    skill: 'Culture',
    type: 'perspective',
    emoji: '🍲',
    objective:
      'Explore how food can be connected to culture and tradition.',
    introduction:
      'Families and communities may have foods that are connected to celebrations, places, history, and traditions.',
    question:
      'Why might two families eat different foods at a celebration?',
    options: [
      'Their traditions may be different',
      'One family must be wrong',
      'Food can only be eaten in one country',
    ],
    answer: 0,
    explanation:
      'Different families and cultures can have different traditions and favourite foods.',
    keyPoints: [
      'Food can be part of culture.',
      'Traditions vary between communities.',
      'Differences can be explored respectfully.',
    ],
    hint: 'Think about family traditions.',
    reflection: 'What food is special in your family?',
  },
  {
    id: 16,
    level: 4,
    title: 'Respecting Differences',
    category: 'Cultures & Diversity',
    difficulty: 'Medium',
    skill: 'Perspective',
    type: 'perspective',
    emoji: '🌍',
    objective: 'Practise respectful responses to differences.',
    introduction:
      'People may have different languages, clothing, foods, customs, and traditions.',
    question:
      'You see a tradition that is unfamiliar to you. What is a respectful response?',
    options: [
      'Ask politely and learn about it',
      'Make fun of it',
      'Say it must be wrong',
    ],
    answer: 0,
    explanation:
      'Asking respectful questions can help us understand traditions we do not already know.',
    keyPoints: [
      'Unfamiliar does not mean wrong.',
      'Ask respectful questions.',
      'Learning can reduce misunderstanding.',
    ],
    hint: 'What could help you understand something new?',
    reflection:
      'What is something about another culture you would like to learn?',
  },
  {
    id: 17,
    level: 5,
    title: 'Our Continents',
    category: 'Geography & Our World',
    difficulty: 'Easy',
    skill: 'Geography',
    type: 'choice',
    emoji: '🗺️',
    objective: 'Begin identifying continents as large land areas.',
    introduction:
      'Continents are large areas of land. Different models group them in different ways.',
    question: 'Which is a continent?',
    options: ['Africa', 'Atlantic Ocean', 'The Moon'],
    answer: 0,
    explanation: 'Africa is one of the commonly taught continents.',
    keyPoints: [
      'Continents are large land areas.',
      'Africa is a continent.',
      'Maps help us study places.',
    ],
    hint: 'Which option is a large land area?',
    reflection: 'Which continent would you like to learn more about?',
  },
  {
    id: 18,
    level: 5,
    title: 'Land & Water',
    category: 'Geography & Our World',
    difficulty: 'Easy',
    skill: 'Geography',
    type: 'choice',
    emoji: '🌊',
    objective: 'Distinguish major land and water features.',
    introduction:
      "Earth contains both land and water, including mountains, rivers, lakes, seas, and oceans.",
    question: 'Which is mainly a body of water?',
    options: ['Ocean', 'Mountain', 'Desert'],
    answer: 0,
    explanation: 'An ocean is a very large body of salt water.',
    keyPoints: [
      'Earth has land and water.',
      'Oceans are large bodies of water.',
      "Geography helps us understand Earth's features.",
    ],
    hint: 'Which option can contain a huge amount of water?',
    reflection: 'What land or water feature have you seen?',
  },
  {
    id: 19,
    level: 5,
    title: 'Reading a Map',
    category: 'Geography & Our World',
    difficulty: 'Medium',
    skill: 'Geography',
    type: 'choice',
    emoji: '🧭',
    objective: 'Understand that maps represent places.',
    introduction:
      'A map is a representation of a place. Symbols can help show roads, buildings, water, and other features.',
    question: 'What can a map help us do?',
    options: [
      'Understand where places are',
      'Change the weather',
      'Grow plants instantly',
    ],
    answer: 0,
    explanation:
      'Maps help us understand locations and relationships between places.',
    keyPoints: [
      'Maps represent places.',
      'Symbols can represent real things.',
      'Maps can help with navigation.',
    ],
    hint: 'What do you use when you want to know where a place is?',
    reflection: 'What place would you like to find on a map?',
  },
  {
    id: 20,
    level: 5,
    title: 'Climate & Place',
    category: 'Geography & Our World',
    difficulty: 'Medium',
    skill: 'Geography',
    type: 'perspective',
    emoji: '☀️',
    objective: 'Begin connecting climate with how people live.',
    introduction:
      'Places around Earth can have different climates. Climate can influence clothing, homes, farming, and daily life.',
    question: 'Why might people in very cold places need warm clothing?',
    options: [
      'To help protect them from the cold',
      'Because all people wear the same clothes',
      'Because clothing controls the sun',
    ],
    answer: 0,
    explanation:
      'Warm clothing helps people stay comfortable and protect themselves in cold conditions.',
    keyPoints: [
      'Places can have different climates.',
      'Climate can influence daily life.',
      'People adapt to their environments.',
    ],
    hint: 'What would help your body stay warm?',
    reflection: 'How does the weather affect what you wear?',
  },
  {
    id: 21,
    level: 6,
    title: 'Clean Water for Everyone',
    category: 'Global Issues',
    difficulty: 'Medium',
    skill: 'Global Awareness',
    type: 'perspective',
    emoji: '🚰',
    objective:
      'Understand that access to safe water matters to communities.',
    introduction:
      'Communities need reliable access to safe water for drinking, cooking, hygiene, farming, and other needs.',
    question:
      'If a community has difficulty getting safe water, what should people investigate?',
    options: [
      'Where the water comes from and what is causing the problem',
      'Only what colour the water is',
      'Nothing',
    ],
    answer: 0,
    explanation:
      'Understanding the source and causes of a water problem can help communities consider appropriate solutions.',
    keyPoints: [
      'Water access affects communities.',
      'Problems should be investigated.',
      'Solutions should respond to real needs.',
    ],
    hint: 'What would you need to understand before choosing a solution?',
    reflection: 'Why should communities care about safe water?',
  },
  {
    id: 22,
    level: 6,
    title: 'Protecting Nature',
    category: 'Global Issues',
    difficulty: 'Medium',
    skill: 'Environment',
    type: 'choice',
    emoji: '🌳',
    objective: 'Explore ways people can care for natural environments.',
    introduction:
      'Plants, animals, water, soil, and people are connected within ecosystems.',
    question: 'Which action can help protect a local natural area?',
    options: [
      'Avoid littering and care for the area',
      'Leave rubbish everywhere',
      'Destroy plants for fun',
    ],
    answer: 0,
    explanation:
      'Reducing litter and caring for natural spaces can help protect habitats and community environments.',
    keyPoints: [
      'Nature supports living things.',
      'Human actions affect environments.',
      'Responsible behaviour can protect shared spaces.',
    ],
    hint: 'Which choice leaves the environment cleaner and safer?',
    reflection: 'What natural place would you like to protect?',
  },
  {
    id: 23,
    level: 6,
    title: 'Education Matters',
    category: 'Global Issues',
    difficulty: 'Medium',
    skill: 'Global Awareness',
    type: 'perspective',
    emoji: '📚',
    objective:
      'Understand why education can be important to communities.',
    introduction:
      'Education can help people develop knowledge, skills, confidence, and opportunities to contribute to society.',
    question: 'Why can education be valuable?',
    options: [
      'It can help people learn skills and understand the world',
      'It only teaches people how to play',
      'It prevents people from asking questions',
    ],
    answer: 0,
    explanation:
      'Education can develop knowledge, skills, communication, reasoning, and understanding.',
    keyPoints: [
      'Education develops knowledge and skills.',
      'Learning can support communities.',
      'Questions are an important part of learning.',
    ],
    hint: 'What do you gain when you learn something new?',
    reflection: 'What is something you have learned that helps you?',
  },
  {
    id: 24,
    level: 6,
    title: 'Shared Resources',
    category: 'Global Issues',
    difficulty: 'Hard',
    skill: 'Decision Making',
    type: 'perspective',
    emoji: '🌍',
    objective:
      'Think about how communities make decisions about shared resources.',
    introduction:
      'Some resources are shared by many people. Decisions about them can affect different groups.',
    question:
      'Before making a decision about a shared resource, what should a community consider?',
    options: [
      'How the decision affects different people',
      'Only what one person wants',
      'Nothing except speed',
    ],
    answer: 0,
    explanation:
      'Considering different people and possible effects can lead to more thoughtful decisions.',
    keyPoints: [
      'Shared resources affect multiple people.',
      'Different perspectives matter.',
      'Good decisions consider consequences.',
    ],
    hint: 'Who might be affected by the decision?',
    reflection: "Why is it useful to hear more than one person's view?",
  },
  {
    id: 25,
    level: 7,
    title: 'Same Event, Different Views',
    category: 'Perspectives',
    difficulty: 'Medium',
    skill: 'Perspective',
    type: 'perspective',
    emoji: '👀',
    objective:
      'Understand that people can experience the same situation differently.',
    introduction:
      'Two people can see the same event but describe it differently because they have different experiences or roles.',
    question:
      'Two children disagree about whether a game was fair. What should they do?',
    options: [
      'Explain their reasons and listen to each other',
      'Refuse to listen',
      'Assume one person must be lying',
    ],
    answer: 0,
    explanation:
      'Explaining reasons and listening can help people understand why they see a situation differently.',
    keyPoints: [
      'Perspectives can differ.',
      'Listening helps reveal reasons.',
      'A disagreement can be investigated respectfully.',
    ],
    hint: "How can they understand each other's thinking?",
    reflection:
      'Have you ever understood something differently from a friend?',
  },
  {
    id: 26,
    level: 7,
    title: 'Fact or Opinion?',
    category: 'Perspectives',
    difficulty: 'Medium',
    skill: 'Evidence',
    type: 'choice',
    emoji: '🔎',
    objective: 'Begin distinguishing factual claims from opinions.',
    introduction:
      "A fact is a claim that can be checked with reliable evidence. An opinion expresses a person's view or preference.",
    question: 'Which is most clearly an opinion?',
    options: [
      'Chocolate ice cream is the best flavour',
      'Water freezes at a low temperature',
      'The Sun is a star',
    ],
    answer: 0,
    explanation:
      "Calling one flavour the 'best' expresses a preference rather than a universally verifiable fact.",
    keyPoints: [
      'Opinions express views or preferences.',
      'Facts can be checked.',
      'Evidence helps us evaluate claims.',
    ],
    hint: "Which statement depends on someone's personal preference?",
    reflection: 'What is one opinion you have?',
  },
  {
    id: 27,
    level: 7,
    title: 'What Is the Evidence?',
    category: 'Perspectives',
    difficulty: 'Hard',
    skill: 'Evidence',
    type: 'choice',
    emoji: '🔍',
    objective: 'Understand that claims should be supported by evidence.',
    introduction:
      'When someone makes a claim, we can ask what information or observations support it.',
    question:
      "Someone says, 'The playground is always empty.' What would be useful evidence?",
    options: [
      'Observe the playground at different times',
      'Guess',
      'Ask someone who has never visited it',
    ],
    answer: 0,
    explanation:
      'Observing at different times gives evidence that can help test whether the claim is accurate.',
    keyPoints: [
      'Claims can be investigated.',
      'Observation can provide evidence.',
      'One guess is not enough to establish a pattern.',
    ],
    hint: 'How could you check whether the playground is really empty?',
    reflection: 'What is something you could investigate by observing?',
  },
  {
    id: 28,
    level: 7,
    title: 'Considering Another Perspective',
    category: 'Perspectives',
    difficulty: 'Hard',
    skill: 'Perspective',
    type: 'perspective',
    emoji: '🔄',
    objective:
      'Practise considering how different people may experience an issue.',
    introduction:
      'A decision that helps one person may create a challenge for someone else.',
    question:
      'A park is going to be redesigned. Who should the community consider?',
    options: [
      'Children, families, older people, and people with disabilities',
      'Only one person',
      'Only people who live far away',
    ],
    answer: 0,
    explanation:
      'Considering different groups can help a community design a space that works for more people.',
    keyPoints: [
      'Different people have different needs.',
      'Inclusive decisions consider different groups.',
      'Listening to perspectives improves understanding.',
    ],
    hint: 'Who might use the park?',
    reflection: 'What would make a public place welcoming to more people?',
  },
  {
    id: 29,
    level: 8,
    title: 'Ask a Good Question',
    category: 'Research & Investigation',
    difficulty: 'Medium',
    skill: 'Research',
    type: 'choice',
    emoji: '❓',
    objective: 'Learn that research begins with useful questions.',
    introduction:
      'A good investigation often starts with a question that can actually be explored.',
    question: 'Which is a useful investigation question?',
    options: [
      'Which plants grow best in our school garden?',
      'Is everything interesting?',
      'Why is the universe nice?',
    ],
    answer: 0,
    explanation:
      'The first question can be investigated by observing and collecting information about plants.',
    keyPoints: [
      'Research begins with questions.',
      'Useful questions can be investigated.',
      'Good questions guide observation and evidence gathering.',
    ],
    hint: 'Which question could you investigate by observing plants?',
    reflection: 'What would you like to investigate?',
  },
  {
    id: 30,
    level: 8,
    title: 'Observe Carefully',
    category: 'Research & Investigation',
    difficulty: 'Medium',
    skill: 'Observation',
    type: 'observation',
    emoji: '👁️',
    objective: 'Practise careful observation.',
    introduction:
      'Researchers observe carefully and record what they actually see rather than guessing.',
    question: 'You are studying a plant. What is useful to record?',
    options: [
      'Its height, number of leaves, and changes over time',
      'Only whether you like it',
      'A random guess',
    ],
    answer: 0,
    explanation:
      'Recording observable information creates useful evidence for comparison.',
    keyPoints: [
      'Observe carefully.',
      'Record what you see.',
      'Repeated observations can reveal changes.',
    ],
    hint: 'What can you actually see and measure?',
    reflection: 'What could you observe over one week?',
  },
  {
    id: 31,
    level: 8,
    title: 'Compare Information',
    category: 'Research & Investigation',
    difficulty: 'Hard',
    skill: 'Research',
    type: 'choice',
    emoji: '📊',
    objective: 'Understand why researchers compare information.',
    introduction:
      'Comparing information can help us notice similarities, differences, and patterns.',
    question:
      'You record how much water three plants receive. What could comparison help you discover?',
    options: [
      'Whether the plants respond differently',
      'What every plant in the world will do',
      'Nothing',
    ],
    answer: 0,
    explanation:
      'Comparing observations can help identify patterns within the plants being studied.',
    keyPoints: [
      'Comparison reveals differences.',
      'Patterns can guide conclusions.',
      'Evidence should match the investigation.',
    ],
    hint: 'What could you notice by looking at the three plants together?',
    reflection: 'What two things could you compare?',
  },
  {
    id: 32,
    level: 8,
    title: 'Draw a Conclusion',
    category: 'Research & Investigation',
    difficulty: 'Hard',
    skill: 'Evidence',
    type: 'choice',
    emoji: '🧠',
    objective: 'Connect evidence to conclusions.',
    introduction:
      'A conclusion should be based on the evidence collected during an investigation.',
    question:
      'If repeated observations show that a plant grows taller when it receives enough water, what is a reasonable conclusion?',
    options: [
      "Water availability affected the plant's growth",
      'Water makes every plant grow exactly the same',
      'The observations do not matter',
    ],
    answer: 0,
    explanation:
      'The conclusion matches the evidence from the investigation without claiming more than was observed.',
    keyPoints: [
      'Conclusions should use evidence.',
      'Avoid claiming more than the evidence supports.',
      'Repeated observations can strengthen understanding.',
    ],
    hint: 'What did the observations actually show?',
    reflection: 'Why should conclusions be connected to evidence?',
  },
  {
    id: 33,
    level: 9,
    title: 'Share Ideas',
    category: 'Collaboration & Communication',
    difficulty: 'Medium',
    skill: 'Communication',
    type: 'choice',
    emoji: '💬',
    objective: 'Practise communicating ideas clearly.',
    introduction:
      'Good communication means expressing ideas clearly and giving others a chance to respond.',
    question: 'What can help a team understand your idea?',
    options: [
      'Explain it clearly and show an example',
      'Keep it secret',
      'Speak without allowing questions',
    ],
    answer: 0,
    explanation:
      'Clear explanations and examples help others understand an idea.',
    keyPoints: [
      'Explain ideas clearly.',
      'Examples can help communication.',
      'Good communication includes listening too.',
    ],
    hint: 'What would help another person understand your idea?',
    reflection: 'How do you like people to explain new ideas to you?',
  },
  {
    id: 34,
    level: 9,
    title: 'Team Decision',
    category: 'Collaboration & Communication',
    difficulty: 'Hard',
    skill: 'Collaboration',
    type: 'perspective',
    emoji: '🤝',
    objective: 'Practise making decisions together.',
    introduction:
      'Teams may disagree. They can compare ideas and choose a solution based on reasons and evidence.',
    question:
      'Your team has two possible solutions. What should you do?',
    options: [
      'Compare the ideas and discuss their strengths',
      'Choose randomly without thinking',
      'Stop the project',
    ],
    answer: 0,
    explanation:
      'Comparing options helps a team make a reasoned decision.',
    keyPoints: [
      'Teams can compare alternatives.',
      'Reasons matter.',
      'Disagreement can lead to better thinking.',
    ],
    hint: 'How can you decide which idea works better?',
    reflection: 'What makes someone a good teammate?',
  },
  {
    id: 35,
    level: 9,
    title: 'Explain Your Solution',
    category: 'Collaboration & Communication',
    difficulty: 'Hard',
    skill: 'Communication',
    type: 'perspective',
    emoji: '📣',
    objective: 'Learn to explain the reasoning behind a solution.',
    introduction:
      'A strong presentation does more than state an answer. It explains how and why the solution was chosen.',
    question: 'What should you include when presenting a solution?',
    options: [
      'The problem, your idea, and why you chose it',
      'Only the final answer',
      'Nothing except a picture',
    ],
    answer: 0,
    explanation:
      'Explaining the problem, solution, and reasoning helps other people understand your thinking.',
    keyPoints: [
      'Explain the problem.',
      'Describe the solution.',
      'Give reasons for your decision.',
    ],
    hint: 'What would someone need to know to understand your solution?',
    reflection: 'How would you explain one of your ideas to a group?',
  },
  {
    id: 36,
    level: 9,
    title: 'Reflect on Teamwork',
    category: 'Collaboration & Communication',
    difficulty: 'Hard',
    skill: 'Reflection',
    type: 'reflection',
    emoji: '🪞',
    objective: 'Reflect on what helped or challenged a team.',
    introduction:
      'Reflection helps us think about what worked, what did not, and what we could improve.',
    question: 'After a team project, what is useful to ask?',
    options: [
      'What worked well and what could we improve?',
      'Who should get all the credit?',
      'Why should we never try again?',
    ],
    answer: 0,
    explanation:
      'Reflection helps teams learn from their experience and improve future projects.',
    keyPoints: [
      'Reflection supports learning.',
      'Teams can identify strengths.',
      'Teams can identify improvements.',
    ],
    hint: 'What could help the team do better next time?',
    reflection: 'What would you improve after your next group activity?',
  },
  {
    id: 37,
    level: 10,
    title: 'Choose a Global Problem',
    category: 'Global Challenge',
    difficulty: 'Hard',
    skill: 'Problem Solving',
    type: 'choice',
    emoji: '🌎',
    objective: 'Identify a real-world issue that can be investigated.',
    introduction:
      'Global challenges can affect people and environments in different places.',
    question: 'Which is an example of a real-world challenge?',
    options: [
      'Access to clean water',
      'Choosing a favourite colour',
      'Deciding which toy is prettiest',
    ],
    answer: 0,
    explanation:
      'Access to clean water is a real-world issue that affects communities.',
    keyPoints: [
      'Global challenges affect real people and environments.',
      'Problems can be investigated.',
      'Understanding a problem comes before proposing solutions.',
    ],
    hint: "Which option can affect people's health and daily lives?",
    reflection: 'Which global issue would you like to understand better?',
  },
  {
    id: 38,
    level: 10,
    title: 'Understand the Problem',
    category: 'Global Challenge',
    difficulty: 'Hard',
    skill: 'Research',
    type: 'perspective',
    emoji: '🔎',
    objective: 'Practise investigating a problem before solving it.',
    introduction:
      'Before designing a solution, we should understand who is affected, what is happening, and why.',
    question:
      'A community wants to reduce plastic waste. What should they investigate?',
    options: [
      'What plastic waste is produced and where it comes from',
      'Only what colour the rubbish is',
      'Nothing',
    ],
    answer: 0,
    explanation:
      'Understanding what waste is produced and where it comes from helps identify possible causes and solutions.',
    keyPoints: [
      'Investigate before solving.',
      'Identify causes.',
      'Understand who and what is affected.',
    ],
    hint: 'What information would help explain the problem?',
    reflection: 'What question would you ask about plastic waste?',
  },
  {
    id: 39,
    level: 10,
    title: 'Design a Solution',
    category: 'Global Challenge',
    difficulty: 'Hard',
    skill: 'Problem Solving',
    type: 'perspective',
    emoji: '💡',
    objective:
      'Connect evidence and perspectives to a possible solution.',
    introduction:
      'A good solution should respond to the problem and consider the people affected by it.',
    question: 'What makes a proposed solution stronger?',
    options: [
      "It responds to the problem and considers people's needs",
      'It is chosen without investigation',
      'It ignores everyone affected',
    ],
    answer: 0,
    explanation:
      "Strong solutions are connected to the problem and consider evidence and people's needs.",
    keyPoints: [
      'Solutions should respond to real problems.',
      'Consider evidence.',
      'Consider different perspectives.',
    ],
    hint: 'What should a solution actually solve?',
    reflection: 'What would make your solution useful to people?',
  },
  {
    id: 40,
    level: 10,
    title: 'Test, Reflect & Improve',
    category: 'Global Challenge',
    difficulty: 'Hard',
    skill: 'Reflection',
    type: 'reflection',
    emoji: '🔄',
    objective: 'Understand that solutions can be tested and improved.',
    introduction:
      'Good problem solving does not always happen perfectly the first time. Testing and reflection help us improve.',
    question: 'Your first solution does not work well. What should you do?',
    options: [
      'Study what happened and improve the solution',
      'Give up immediately',
      'Pretend it worked',
    ],
    answer: 0,
    explanation:
      'Testing gives information. Reflecting on the result can help you make the next version better.',
    keyPoints: [
      'Solutions can be improved.',
      'Testing gives useful information.',
      'Reflection helps guide the next step.',
    ],
    hint: 'What can you learn from a solution that did not work?',
    reflection:
      'What would you change if you could try your solution again?',
  },
];

const LEVELS = [
  {
    level: 1,
    title: 'Me & My World',
    description:
      'Understand yourself, your community, and everyday decisions.',
    icon: <Users className="w-5 h-5" />,
  },
  {
    level: 2,
    title: 'People & Communities',
    description:
      'Explore cooperation, fairness, rules, and community problems.',
    icon: <Users className="w-5 h-5" />,
  },
  {
    level: 3,
    title: 'Our Planet',
    description: 'Discover water, food, waste, and caring for nature.',
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    level: 4,
    title: 'Cultures & Diversity',
    description:
      'Learn about languages, traditions, homes, and respectful curiosity.',
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    level: 5,
    title: 'Geography & Our World',
    description: 'Explore maps, land, water, continents, and climate.',
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    level: 6,
    title: 'Global Issues',
    description:
      'Think about challenges that affect people and environments.',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    level: 7,
    title: 'Perspectives',
    description: 'Compare viewpoints, evidence, facts, and opinions.',
    icon: <Target className="w-5 h-5" />,
  },
  {
    level: 8,
    title: 'Research & Investigation',
    description: 'Ask questions, observe, compare, and draw conclusions.',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    level: 9,
    title: 'Collaboration & Communication',
    description:
      'Work with others, explain ideas, and reflect on teamwork.',
    icon: <Users className="w-5 h-5" />,
  },
  {
    level: 10,
    title: 'Global Challenge',
    description: 'Investigate, design, test, and improve solutions.',
    icon: <Shield className="w-5 h-5" />,
  },
];

export const GlobalPerspectives: React.FC<GlobalPerspectivesProps> = ({
  onComplete,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');
  const [progress, setProgress] = useState<Record<number, ChallengeProgress>>(
    {}
  );
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
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

  const currentProgress: ChallengeProgress = currentChallenge
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

  const totalChallenges = CHALLENGES.length;

  const updateProgress = (
    challengeId: number,
    updates: Partial<ChallengeProgress>
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
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setShowHint(false);
    setShowReflection(false);
    setFeedback('');
    setIsComplete(false);
    setHasFinished(false);
  };

  const resetChallengeState = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setShowHint(false);
    setShowReflection(false);
    setFeedback('');
  };

  const handleHint = () => {
    if (!currentChallenge) return;

    setShowHint(true);

    updateProgress(currentChallenge.id, {
      usedHint: true,
    });
  };

  const awardPoints = () => {
    if (!currentChallenge) return;

    const alreadyMastered = currentProgress.mastered;

    if (alreadyMastered) return;

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
    if (
      !currentChallenge ||
      answerChecked ||
      currentChallenge.answer === undefined
    ) {
      return;
    }

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
      setShowReflection(true);

      speak(`Good thinking! ${currentChallenge.explanation}`);

      if (mode === 'guided' || mode === 'practice') {
        awardPoints();
      }

      if (mode === 'mastery') {
        awardPoints();
      }
    } else {
      if (soundEnabled) playSoundFeedback('try-again');

      setStreak(0);
      const message =
        'Not quite. Think about the question again and look for the clue in the situation.';
      setFeedback(message);
      setShowReflection(false);

      speak(message);
    }
  };

  const continueToNext = () => {
    if (!currentChallenge) return;

    if (challengeIndex < levelChallenges.length - 1) {
      setChallengeIndex((previous) => previous + 1);
      resetChallengeState();
      return;
    }

    setIsComplete(true);
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
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setShowHint(false);
    setShowReflection(false);
    setFeedback('');
    setIsComplete(false);
    setHasFinished(false);

    speak("Let's explore Global Perspectives again!");
  };

  /* ============ HUB VIEW ============ */
  if (selectedLevel === null) {
    return (
      <div className="max-w-5xl mx-auto bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <Globe2 className="w-7 h-7 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Global Perspectives &amp; Society
                </h2>

                <p className="text-gray-400 mt-1">
                  Explore people, places, cultures, ideas, and real-world
                  challenges.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-yellow-400 font-bold">
                ⭐ {score} points
              </span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 font-bold">
                {masteredCount}/{totalChallenges} mastered
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

        <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-white font-bold text-lg">
                How Global Perspectives works
              </h3>

              <p className="text-gray-400 text-sm mt-2 leading-6">
                You will learn to ask questions, explore different
                perspectives, use evidence, solve problems, communicate ideas,
                and reflect on what you discover.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-bold text-lg mb-3">
            Choose a learning mode
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(
              [
                ['guided', 'Guided', 'Learn with explanations and support.'],
                [
                  'practice',
                  'Practice',
                  'Answer challenges and build confidence.',
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
                    ? 'border-emerald-400 bg-emerald-500/10'
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
            const levelTotal = CHALLENGES.filter(
              (challenge) => challenge.level === level.level
            ).length;

            const levelMastered = CHALLENGES.filter(
              (challenge) =>
                challenge.level === level.level &&
                progress[challenge.id]?.mastered
            ).length;

            return (
              <motion.button
                key={level.level}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startLevel(level.level)}
                className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-emerald-400/40 hover:bg-emerald-500/5 transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    {level.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-emerald-400 font-bold">
                          LEVEL {level.level}
                        </span>

                        <h3 className="text-white font-bold text-lg mt-1">
                          {level.title}
                        </h3>
                      </div>

                      <span className="text-xs text-gray-500">
                        {levelMastered}/{levelTotal}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mt-2 leading-5">
                      {level.description}
                    </p>

                    <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all"
                        style={{
                          width: `${
                            levelTotal === 0
                              ? 0
                              : (levelMastered / levelTotal) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-500 mt-1" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>
      </div>
    );
  }

  /* ============ COMPLETION VIEW ============ */
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
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-3xl font-bold text-white mt-6">
            Level Complete!
          </h2>

          <p className="text-gray-400 mt-2">
            You explored{' '}
            {LEVELS.find((level) => level.level === selectedLevel)?.title}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <Star className="w-6 h-6 text-yellow-400 mx-auto" />
              <div className="text-2xl font-bold text-white mt-2">{score}</div>
              <div className="text-gray-500 text-sm">Total Score</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <Target className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="text-2xl font-bold text-white mt-2">
                {levelMastered}/{levelChallenges.length}
              </div>
              <div className="text-gray-500 text-sm">Level Mastery</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <Globe2 className="w-6 h-6 text-blue-400 mx-auto" />
              <div className="text-2xl font-bold text-white mt-2">
                {masteryPercentage}%
              </div>
              <div className="text-gray-500 text-sm">Mastery Rate</div>
            </div>
          </div>

          <div className="text-left mt-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-white font-bold mb-3">What you practised</h3>

            <ul className="space-y-2">
              {[
                'Understanding people and communities',
                'Exploring different perspectives',
                'Using evidence and observation',
                'Thinking about real-world problems',
                'Communicating and reflecting on ideas',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-gray-300 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
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
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400"
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

  if (!currentChallenge) {
    return null;
  }

  /* ============ CHALLENGE VIEW ============ */
  const progressPercentage =
    levelChallenges.length === 0
      ? 0
      : ((challengeIndex + 1) / levelChallenges.length) * 100;

  const isCorrect =
    selectedAnswer !== null &&
    currentChallenge.answer !== undefined &&
    selectedAnswer === currentChallenge.answer;

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
          <div className="text-xs text-emerald-400 font-bold">
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
            className="h-full bg-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
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
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wide mb-2">
                Your challenge
              </div>

              <p className="text-white font-semibold text-lg leading-7">
                {currentChallenge.question}
              </p>
            </div>
          </div>

          {currentChallenge.options && (
            <div className="space-y-3">
              {currentChallenge.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isAnswer =
                  currentChallenge.answer === optionIndex && answerChecked;

                return (
                  <motion.button
                    key={option}
                    whileHover={!answerChecked ? { scale: 1.01 } : undefined}
                    whileTap={!answerChecked ? { scale: 0.99 } : undefined}
                    onClick={() => checkAnswer(optionIndex)}
                    disabled={answerChecked}
                    className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-all ${
                      isAnswer
                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300'
                        : isSelected && answerChecked
                          ? 'bg-red-500/10 border-red-400 text-red-300'
                          : 'bg-white/[0.03] border-white/10 text-white hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>{option}</span>

                      {isAnswer && (
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

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
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Target className="w-6 h-6 text-red-400 flex-shrink-0" />
                )}

                <div>
                  <h4
                    className={`font-bold ${
                      isCorrect ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isCorrect ? 'Good thinking!' : "Let's think again"}
                  </h4>

                  <p className="text-gray-300 text-sm mt-2 leading-6">
                    {feedback}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {showReflection && currentChallenge.reflection && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20"
            >
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wide">
                Think &amp; Reflect
              </div>

              <p className="text-white font-semibold mt-2">
                {currentChallenge.reflection}
              </p>
            </motion.div>
          )}

          {answerChecked && (
            <div className="mt-5 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <h4 className="text-white font-bold mb-3">What you learned</h4>

              <ul className="space-y-2">
                {currentChallenge.keyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
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
                onClick={continueToNext}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400"
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

export default GlobalPerspectives;