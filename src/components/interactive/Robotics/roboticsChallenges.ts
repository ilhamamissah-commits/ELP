import type { RoboticsSkill } from './roboticsData';

/* =========================================================
   ROBOTICS CHALLENGE TYPES
   ========================================================= */

export type SequenceCommand =
  | 'Forward'
  | 'Backward'
  | 'TurnLeft'
  | 'TurnRight'
  | 'Wait'
  | 'Stop';

export type ChallengeType =
  | 'build-sequence'
  | 'copy-sequence'
  | 'complete-sequence'
  | 'find-mistake'
  | 'shortest-path'
  | 'maze'
  | 'predict'
  | 'debug'
  | 'sensor-decision'
  | 'engineering';

export type RoboticsLevel = 1 | 2 | 3 | 4 | 5;

export interface GridPosition {
  x: number;
  y: number;
}

export interface ChallengeQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

export interface SensorScenario {
  sensor: string;
  condition: string;
  expectedAction: string;
}

export interface DebugScenario {
  incorrectSequence: SequenceCommand[];
  problem: string;
  correction: SequenceCommand[];
}

export interface EngineeringMission {
  goal: string;
  constraints: string[];
  successCriteria: string[];
}

/* =========================================================
   MAIN CHALLENGE INTERFACE
   ========================================================= */

export interface RoboticsChallenge {
  id: number;

  level: RoboticsLevel;

  title: string;

  description: string;

  emoji: string;

  type: ChallengeType;

  /*
   * Sequence expected to solve the challenge.
   * The current Sequencer can also allow alternative
   * solutions when the final robot position is correct.
   */
  targetSequence?: SequenceCommand[];

  /*
   * Maximum number of commands allowed.
   */
  maxSteps?: number;

  /*
   * Grid configuration.
   */
  gridSize?: number;

  /*
   * Robot starting position.
   */
  robot?: GridPosition;

  /*
   * Target position.
   */
  target?: GridPosition;

  /*
   * Target visual.
   */
  targetEmoji?: string;

  /*
   * Learning metadata.
   */
  skills: RoboticsSkill[];

  learningObjective: string;

  vocabulary: string[];

  story?: string;

  hint?: string;

  successMessage: string;

  realWorldConnection?: string;

  question?: ChallengeQuestion;

  sensorScenario?: SensorScenario;

  debugScenario?: DebugScenario;

  engineeringMission?: EngineeringMission;

  stars?: number;
}

/* =========================================================
   LEVEL DEFINITIONS
   ========================================================= */

export const ROBOTICS_LEVELS = [
  {
    level: 1 as RoboticsLevel,
    name: 'Robot Explorer',
    description: 'Discover robots, movement and simple instructions.',
    emoji: '🤖',
    color: 'blue',
    skills: [
      'observation',
      'classification',
      'sequencing',
      'spatial-reasoning',
    ] as RoboticsSkill[],
  },

  {
    level: 2 as RoboticsLevel,
    name: 'Robot Builder',
    description: 'Learn how robot parts work together.',
    emoji: '🔧',
    color: 'emerald',
    skills: [
      'classification',
      'systems-thinking',
      'problem-solving',
      'engineering-design',
    ] as RoboticsSkill[],
  },

  {
    level: 3 as RoboticsLevel,
    name: 'Algorithm Engineer',
    description: 'Plan, predict and debug robot programs.',
    emoji: '💻',
    color: 'purple',
    skills: [
      'algorithms',
      'sequencing',
      'prediction',
      'debugging',
      'spatial-reasoning',
    ] as RoboticsSkill[],
  },

  {
    level: 4 as RoboticsLevel,
    name: 'Robotics Engineer',
    description: 'Use sensors, decisions and engineering thinking.',
    emoji: '⚙️',
    color: 'amber',
    skills: [
      'systems-thinking',
      'sensors',
      'automation',
      'engineering-design',
      'problem-solving',
    ] as RoboticsSkill[],
  },

  {
    level: 5 as RoboticsLevel,
    name: 'Mission Designer',
    description: 'Design complete robotic solutions for real-world missions.',
    emoji: '🚀',
    color: 'cyan',
    skills: [
      'engineering-design',
      'programming',
      'debugging',
      'creativity',
      'communication',
    ] as RoboticsSkill[],
  },
];

/* =========================================================
   LEVEL 1 — ROBOT EXPLORER
   ========================================================= */

const LEVEL_1_CHALLENGES: RoboticsChallenge[] = [
  {
    id: 1,
    level: 1,
    title: 'Robo Says Hello',
    description: 'Move Robo one step forward to the star.',
    emoji: '👋',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 2, y: 4 },
    target: { x: 2, y: 3 },
    targetEmoji: '⭐',

    targetSequence: ['Forward'],
    maxSteps: 1,

    skills: ['sequencing', 'spatial-reasoning'],

    learningObjective:
      'Understand that robots follow instructions in sequence.',

    vocabulary: [
      'robot',
      'instruction',
      'forward',
      'sequence',
    ],

    story:
      'Robo wants to reach the star and say hello. Give Robo one instruction.',

    hint:
      'Robo is facing the star. Which command moves Robo forward?',

    successMessage:
      'Excellent! Robo followed your instruction.',

    realWorldConnection:
      'Robots use programmed instructions to control their movement.',

    stars: 1,
  },

  {
    id: 2,
    level: 1,
    title: 'Two Steps Forward',
    description: 'Move Robo two spaces forward.',
    emoji: '⬆️',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 0, y: 2 },
    targetEmoji: '⭐',

    targetSequence: ['Forward', 'Forward'],
    maxSteps: 2,

    skills: ['sequencing', 'spatial-reasoning'],

    learningObjective:
      'Understand that multiple instructions are performed in order.',

    vocabulary: [
      'forward',
      'sequence',
      'step',
      'algorithm',
    ],

    hint:
      'One Forward command moves Robo one space. How many spaces must Robo travel?',

    successMessage:
      'Great sequencing! Two instructions moved Robo two spaces.',

    realWorldConnection:
      'Robot programs are made from individual instructions executed in order.',

    stars: 1,
  },

  {
    id: 3,
    level: 1,
    title: 'Back to Base',
    description: 'Robo needs to move backward to the base.',
    emoji: '🏠',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 2, y: 2 },
    target: { x: 2, y: 4 },
    targetEmoji: '🏠',

    targetSequence: ['Backward', 'Backward'],
    maxSteps: 2,

    skills: ['sequencing', 'spatial-reasoning'],

    learningObjective:
      'Understand that backward movement is relative to the robot.',

    vocabulary: [
      'backward',
      'base',
      'direction',
      'movement',
    ],

    hint:
      'Robo is facing North. The base is behind Robo.',

    successMessage:
      'Well done! Robo safely returned to base.',

    realWorldConnection:
      'Mobile robots often need to reverse away from an area or return to a known location.',

    stars: 1,
  },

  {
    id: 4,
    level: 1,
    title: 'Turn Right',
    description: 'Turn Robo toward the star.',
    emoji: '➡️',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 1, y: 3 },
    target: { x: 1, y: 3 },
    targetEmoji: '⭐',

    targetSequence: ['TurnRight'],
    maxSteps: 1,

    skills: ['spatial-reasoning', 'sequencing'],

    learningObjective:
      'Understand that turning changes a robot’s direction.',

    vocabulary: [
      'turn',
      'right',
      'direction',
      'orientation',
    ],

    hint:
      'Robo does not need to move. It only needs to change direction.',

    successMessage:
      'Correct! Robo turned to face East.',

    realWorldConnection:
      'Robots use motors and programmed commands to change direction.',

    stars: 1,
  },

  {
    id: 5,
    level: 1,
    title: 'Turn Left',
    description: 'Turn Robo toward the star on the left.',
    emoji: '⬅️',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 3, y: 3 },
    target: { x: 3, y: 3 },
    targetEmoji: '⭐',

    targetSequence: ['TurnLeft'],
    maxSteps: 1,

    skills: ['spatial-reasoning', 'sequencing'],

    learningObjective:
      'Understand that turning left changes robot orientation.',

    vocabulary: [
      'turn',
      'left',
      'direction',
      'orientation',
    ],

    hint:
      'Robo only needs to turn. It does not need to move.',

    successMessage:
      'Excellent! Robo turned to face West.',

    realWorldConnection:
      'Robot navigation systems track orientation as well as position.',

    stars: 1,
  },

  {
    id: 6,
    level: 1,
    title: 'Visit the Star',
    description: 'Turn right, then move two spaces to the star.',
    emoji: '⭐',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 2, y: 4 },
    targetEmoji: '⭐',

    targetSequence: [
      'TurnRight',
      'Forward',
      'Forward',
    ],

    maxSteps: 3,

    skills: [
      'sequencing',
      'spatial-reasoning',
    ],

    learningObjective:
      'Combine turning and movement instructions.',

    vocabulary: [
      'turn',
      'forward',
      'direction',
      'sequence',
    ],

    hint:
      'The star is to Robo’s right. Turn first, then move forward twice.',

    successMessage:
      'Fantastic! Robo changed direction and reached the star.',

    realWorldConnection:
      'Autonomous robots combine orientation commands with movement commands.',

    stars: 2,
  },

  {
    id: 7,
    level: 1,
    title: 'Change Direction',
    description:
      'Move forward, turn right, then move forward again.',

    emoji: '🔄',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 1, y: 4 },
    target: { x: 2, y: 3 },
    targetEmoji: '⭐',

    targetSequence: [
      'Forward',
      'TurnRight',
      'Forward',
    ],

    maxSteps: 3,

    skills: [
      'sequencing',
      'spatial-reasoning',
    ],

    learningObjective:
      'Understand that the meaning of Forward depends on robot orientation.',

    vocabulary: [
      'direction',
      'orientation',
      'turn',
      'sequence',
    ],

    hint:
      'First move North. Then turn East. Then move forward.',

    successMessage:
      'Excellent! You used orientation to plan Robo’s route.',

    realWorldConnection:
      'Navigation algorithms must continuously track a robot’s direction.',

    stars: 2,
  },

  {
    id: 8,
    level: 1,
    title: 'Treasure Trail',
    description:
      'Guide Robo to the treasure using a turn and three movements.',

    emoji: '💎',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 2, y: 3 },
    targetEmoji: '💎',

    targetSequence: [
      'TurnRight',
      'Forward',
      'Forward',
      'TurnLeft',
      'Forward',
    ],

    maxSteps: 5,

    skills: [
      'sequencing',
      'spatial-reasoning',
      'problem-solving',
    ],

    learningObjective:
      'Plan a multi-step route using turns and movements.',

    vocabulary: [
      'route',
      'sequence',
      'turn',
      'movement',
    ],

    hint:
      'Move East twice, then turn North and move once.',

    successMessage:
      'Treasure found! Your route was correct.',

    realWorldConnection:
      'Robots use planned routes to navigate warehouses, farms and other environments.',

    stars: 2,
  },

  {
    id: 9,
    level: 1,
    title: 'Copy Robo',
    description:
      'Copy the demonstrated movement pattern.',

    emoji: '📋',

    type: 'copy-sequence',

    gridSize: 5,

    robot: { x: 2, y: 4 },
    target: { x: 3, y: 3 },
    targetEmoji: '⭐',

    targetSequence: [
      'Forward',
      'TurnRight',
      'Forward',
    ],

    maxSteps: 3,

    skills: [
      'memory',
      'sequencing',
      'spatial-reasoning',
    ],

    learningObjective:
      'Remember and reproduce a sequence of robot instructions.',

    vocabulary: [
      'copy',
      'pattern',
      'sequence',
      'memory',
    ],

    hint:
      'Remember the pattern: move, turn, move.',

    successMessage:
      'Great memory! You reproduced Robo’s sequence.',

    realWorldConnection:
      'Programmers often reproduce tested instruction patterns in new programs.',

    stars: 2,
  },

  {
    id: 10,
    level: 1,
    title: 'Robot Dance',
    description:
      'Make Robo complete a simple movement pattern.',

    emoji: '💃',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 2, y: 2 },
    target: { x: 2, y: 2 },
    targetEmoji: '🎵',

    targetSequence: [
      'TurnRight',
      'TurnRight',
      'TurnLeft',
      'TurnLeft',
    ],

    maxSteps: 4,

    skills: [
      'sequencing',
      'memory',
      'creativity',
    ],

    learningObjective:
      'Understand that a program can contain multiple commands that change orientation.',

    vocabulary: [
      'pattern',
      'sequence',
      'turn',
      'program',
    ],

    hint:
      'The dance uses two right turns followed by two left turns.',

    successMessage:
      'Robot dance complete! Great sequencing.',

    realWorldConnection:
      'Robots can be programmed to perform repeated movement patterns.',

    stars: 2,
  },
];

/* =========================================================
   LEVEL 2 — ROBOT BUILDER
   ========================================================= */

const LEVEL_2_CHALLENGES: RoboticsChallenge[] = [
  {
    id: 11,
    level: 2,
    title: 'What Does Robo Need?',
    description:
      'Choose the part that helps Robo move.',

    emoji: '🔧',

    type: 'engineering',

    skills: [
      'classification',
      'systems-thinking',
    ],

    learningObjective:
      'Identify the role of actuators in a robot.',

    vocabulary: [
      'motor',
      'actuator',
      'movement',
      'robot',
    ],

    question: {
      prompt: 'Which part helps a robot move?',
      options: [
        'Motor',
        'Camera',
        'Speaker',
        'Battery',
      ],
      answer: 0,
    },

    hint:
      'Think about the part that creates movement.',

    successMessage:
      'Correct! Motors create movement in many robots.',

    realWorldConnection:
      'Electric motors are widely used to drive robot wheels, arms and other mechanisms.',

    stars: 1,
  },

  {
    id: 12,
    level: 2,
    title: 'Give Robo Energy',
    description:
      'Choose the part that supplies electrical energy.',

    emoji: '🔋',

    type: 'engineering',

    skills: [
      'classification',
      'systems-thinking',
    ],

    learningObjective:
      'Understand the role of a robot power source.',

    vocabulary: [
      'battery',
      'energy',
      'power',
      'electricity',
    ],

    question: {
      prompt: 'Which part can provide electrical energy to Robo?',
      options: [
        'Battery',
        'Wheel',
        'Camera',
        'Gripper',
      ],
      answer: 0,
    },

    hint:
      'Robo needs stored electrical energy to operate.',

    successMessage:
      'Exactly! A battery can provide electrical energy.',

    realWorldConnection:
      'Mobile robots often use rechargeable batteries as their power source.',

    stars: 1,
  },

  {
    id: 13,
    level: 2,
    title: 'Find the Brain',
    description:
      'Choose the component that processes instructions.',

    emoji: '🧠',

    type: 'engineering',

    skills: [
      'classification',
      'systems-thinking',
    ],

    learningObjective:
      'Understand the role of a controller or processor.',

    vocabulary: [
      'controller',
      'processor',
      'program',
      'decision',
    ],

    question: {
      prompt: 'Which part processes instructions?',
      options: [
        'Controller',
        'Wheel',
        'Battery',
        'Shell',
      ],
      answer: 0,
    },

    hint:
      'Think about the part that acts like Robo’s brain.',

    successMessage:
      'Correct! The controller processes programmed instructions.',

    realWorldConnection:
      'Robot controllers run software that coordinates sensors, decisions and actions.',

    stars: 1,
  },

  {
    id: 14,
    level: 2,
    title: 'Build a Moving Robot',
    description:
      'Choose the essential parts for a simple moving robot.',

    emoji: '🤖',

    type: 'engineering',

    skills: [
      'classification',
      'systems-thinking',
      'engineering-design',
    ],

    learningObjective:
      'Recognize that robots are systems made from interacting components.',

    vocabulary: [
      'system',
      'motor',
      'battery',
      'controller',
    ],

    question: {
      prompt:
        'Which combination could make a simple wheeled robot move?',
      options: [
        'Battery + Controller + Motors',
        'Camera + Speaker + Shell',
        'LED + Shell + Gripper',
        'GPS + Speaker + Camera',
      ],
      answer: 0,
    },

    hint:
      'A moving robot needs energy, control and something that produces movement.',

    successMessage:
      'Excellent systems thinking! Those parts work together.',

    realWorldConnection:
      'Robotic systems combine power, control and actuation to perform tasks.',

    stars: 2,
  },

  {
    id: 15,
    level: 2,
    title: 'Protect the Brain',
    description:
      'Choose the component that protects sensitive robot electronics.',

    emoji: '🛡️',

    type: 'engineering',

    skills: [
      'classification',
      'engineering-design',
    ],

    learningObjective:
      'Understand that engineering includes protecting important components.',

    vocabulary: [
      'protection',
      'chassis',
      'shell',
      'electronics',
    ],

    question: {
      prompt: 'What can help protect robot electronics?',
      options: [
        'Protective shell',
        'Speaker',
        'Wheel',
        'GPS',
      ],
      answer: 0,
    },

    hint:
      'Look for the part designed to provide physical protection.',

    successMessage:
      'Correct! A protective structure can shield sensitive components.',

    realWorldConnection:
      'Industrial robots often use protective housings and frames around electronics.',

    stars: 1,
  },

  {
    id: 16,
    level: 2,
    title: 'Can Robo See Light?',
    description:
      'Choose the sensor Robo needs to detect light.',

    emoji: '💡',

    type: 'sensor-decision',

    skills: [
      'classification',
      'sensors',
      'systems-thinking',
    ],

    learningObjective:
      'Understand that sensors provide information about the environment.',

    vocabulary: [
      'sensor',
      'light',
      'input',
      'environment',
    ],

    question: {
      prompt: 'Which sensor can detect changes in light?',
      options: [
        'Light sensor',
        'Touch sensor',
        'Temperature sensor',
        'Speaker',
      ],
      answer: 0,
    },

    sensorScenario: {
      sensor: 'Light Sensor',
      condition: 'The environment becomes dark.',
      expectedAction: 'Turn on a light.',
    },

    hint:
      'Use a sensor designed to detect brightness.',

    successMessage:
      'Correct! The light sensor gives Robo information about brightness.',

    realWorldConnection:
      'Light sensors are used in automatic lighting systems and many smart devices.',

    stars: 2,
  },

  {
    id: 17,
    level: 2,
    title: 'Obstacle Alert',
    description:
      'Choose the sensor that can help Robo detect an object ahead.',

    emoji: '🚧',

    type: 'sensor-decision',

    skills: [
      'sensors',
      'problem-solving',
      'systems-thinking',
    ],

    learningObjective:
      'Understand how sensors can help robots detect obstacles.',

    vocabulary: [
      'obstacle',
      'distance',
      'sensor',
      'detect',
    ],

    question: {
      prompt:
        'Which sensor is useful for detecting how close an obstacle is?',
      options: [
        'Distance sensor',
        'Speaker',
        'LED',
        'Battery',
      ],
      answer: 0,
    },

    sensorScenario: {
      sensor: 'Distance Sensor',
      condition: 'An obstacle is very close.',
      expectedAction: 'Stop or change direction.',
    },

    hint:
      'Robo needs to know how far away the obstacle is.',

    successMessage:
      'Great! A distance sensor can help Robo detect obstacles.',

    realWorldConnection:
      'Robots use distance sensors for collision avoidance and navigation.',

    stars: 2,
  },

  {
    id: 18,
    level: 2,
    title: 'Listen, Robo!',
    description:
      'Choose the sensor that detects sound.',

    emoji: '👂',

    type: 'sensor-decision',

    skills: [
      'classification',
      'sensors',
      'observation',
    ],

    learningObjective:
      'Identify sound as information that can be detected by a sensor.',

    vocabulary: [
      'sound',
      'microphone',
      'sensor',
      'input',
    ],

    question: {
      prompt: 'Which sensor can detect sound?',
      options: [
        'Sound sensor',
        'Light sensor',
        'GPS sensor',
        'Temperature sensor',
      ],
      answer: 0,
    },

    hint:
      'Think about what your ears detect.',

    successMessage:
      'Correct! Sound sensors allow robots to respond to sounds.',

    realWorldConnection:
      'Robots can use microphones and sound sensors to detect voices, alarms and other sounds.',

    stars: 1,
  },

  {
    id: 19,
    level: 2,
    title: 'Hot or Cold?',
    description:
      'Choose the sensor that measures temperature.',

    emoji: '🌡️',

    type: 'sensor-decision',

    skills: [
      'classification',
      'sensors',
      'observation',
    ],

    learningObjective:
      'Understand that different sensors measure different environmental properties.',

    vocabulary: [
      'temperature',
      'sensor',
      'measure',
      'environment',
    ],

    question: {
      prompt: 'Which sensor can measure temperature?',
      options: [
        'Temperature sensor',
        'Camera',
        'Speaker',
        'Touch sensor',
      ],
      answer: 0,
    },

    hint:
      'Think about the sensor that answers: How hot or cold is it?',

    successMessage:
      'Exactly! A temperature sensor measures temperature.',

    realWorldConnection:
      'Temperature sensors are used in robots, factories, vehicles and smart homes.',

    stars: 1,
  },

  {
    id: 20,
    level: 2,
    title: 'Predict Robo',
    description:
      'Predict what Robo will do next.',

    emoji: '🔮',

    type: 'predict',

    gridSize: 5,

    robot: { x: 1, y: 4 },
    target: { x: 2, y: 3 },
    targetEmoji: '⭐',

    targetSequence: [
      'Forward',
      'TurnRight',
      'Forward',
    ],

    maxSteps: 3,

    skills: [
      'prediction',
      'memory',
      'spatial-reasoning',
    ],

    learningObjective:
      'Predict the result of a sequence before it is executed.',

    vocabulary: [
      'predict',
      'sequence',
      'result',
      'algorithm',
    ],

    question: {
      prompt:
        'Robo moves Forward, turns Right, then moves Forward. Where does Robo finish?',
      options: [
        'One space East and one space North',
        'Two spaces North',
        'Two spaces East',
        'Back at the starting point',
      ],
      answer: 0,
    },

    hint:
      'Track Robo’s position after every command.',

    successMessage:
      'Excellent prediction! You thought through the algorithm before running it.',

    realWorldConnection:
      'Programmers often predict how an algorithm will behave before testing it.',

    stars: 2,
  },
];

/* =========================================================
   LEVEL 3 — ALGORITHM ENGINEER
   ========================================================= */

const LEVEL_3_CHALLENGES: RoboticsChallenge[] = [
  {
    id: 21,
    level: 3,
    title: 'Fix Robo’s Route',
    description:
      'Find the missing turn in Robo’s route.',

    emoji: '🧭',

    type: 'debug',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 2, y: 3 },
    targetEmoji: '⭐',

    targetSequence: [
      'TurnRight',
      'Forward',
      'Forward',
      'TurnLeft',
      'Forward',
    ],

    maxSteps: 5,

    skills: [
      'debugging',
      'algorithms',
      'spatial-reasoning',
    ],

    learningObjective:
      'Identify and correct an incorrect or incomplete sequence.',

    vocabulary: [
      'debug',
      'error',
      'algorithm',
      'route',
    ],

    debugScenario: {
      incorrectSequence: [
        'TurnRight',
        'Forward',
        'Forward',
        'Forward',
      ],
      problem:
        'Robo reaches the correct column but moves too far North.',
      correction: [
        'TurnRight',
        'Forward',
        'Forward',
        'TurnLeft',
        'Forward',
      ],
    },

    hint:
      'Robo needs to change direction before the final movement.',

    successMessage:
      'Bug fixed! You corrected Robo’s route.',

    realWorldConnection:
      'Debugging means finding and correcting errors in a program.',

    stars: 2,
  },

  {
    id: 22,
    level: 3,
    title: 'The Missing Command',
    description:
      'Complete the sequence to reach the target.',

    emoji: '🧩',

    type: 'complete-sequence',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 2, y: 3 },
    targetEmoji: '⭐',

    targetSequence: [
      'TurnRight',
      'Forward',
      'Forward',
      'TurnLeft',
      'Forward',
    ],

    maxSteps: 5,

    skills: [
      'algorithms',
      'problem-solving',
      'sequencing',
    ],

    learningObjective:
      'Complete a partially known algorithm using spatial reasoning.',

    vocabulary: [
      'algorithm',
      'sequence',
      'missing',
      'command',
    ],

    hint:
      'After moving East twice, Robo needs to face North.',

    successMessage:
      'Perfect! You found the missing instruction.',

    realWorldConnection:
      'Programs often contain repeated patterns that programmers must complete or extend.',

    stars: 2,
  },

  {
    id: 23,
    level: 3,
    title: 'Shortest Route',
    description:
      'Reach the target using the fewest commands possible.',

    emoji: '📍',

    type: 'shortest-path',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 3, y: 2 },
    targetEmoji: '⭐',

    targetSequence: [
      'TurnRight',
      'Forward',
      'Forward',
      'Forward',
      'TurnLeft',
      'Forward',
      'Forward',
    ],

    maxSteps: 7,

    skills: [
      'algorithms',
      'spatial-reasoning',
      'problem-solving',
    ],

    learningObjective:
      'Plan an efficient route and recognize unnecessary instructions.',

    vocabulary: [
      'shortest',
      'efficient',
      'route',
      'algorithm',
    ],

    hint:
      'Move East three spaces, then North two spaces.',

    successMessage:
      'Excellent! You found an efficient route.',

    realWorldConnection:
      'Route-planning algorithms help robots, vehicles and delivery systems find efficient paths.',

    stars: 3,
  },

  {
    id: 24,
    level: 3,
    title: 'Stop at the Wall',
    description:
      'Move Robo to the wall without leaving the grid.',

    emoji: '🧱',

    type: 'maze',

    gridSize: 5,

    robot: { x: 2, y: 4 },
    target: { x: 2, y: 0 },
    targetEmoji: '🧱',

    targetSequence: [
      'Forward',
      'Forward',
      'Forward',
      'Forward',
    ],

    maxSteps: 4,

    skills: [
      'spatial-reasoning',
      'algorithms',
      'problem-solving',
    ],

    learningObjective:
      'Understand grid boundaries and controlled movement.',

    vocabulary: [
      'boundary',
      'grid',
      'forward',
      'position',
    ],

    hint:
      'The wall is directly ahead. Count the spaces carefully.',

    successMessage:
      'Great navigation! Robo stopped exactly at the wall.',

    realWorldConnection:
      'Robots must understand environmental boundaries when navigating physical spaces.',

    stars: 2,
  },

  {
    id: 25,
    level: 3,
    title: 'Sense → Think → Act',
    description:
      'Choose what Robo should do after detecting an obstacle.',

    emoji: '👁️',

    type: 'sensor-decision',

    skills: [
      'sensors',
      'systems-thinking',
      'problem-solving',
    ],

    learningObjective:
      'Understand the basic robotics cycle: sense, think and act.',

    vocabulary: [
      'sense',
      'think',
      'act',
      'sensor',
      'decision',
    ],

    sensorScenario: {
      sensor: 'Distance Sensor',
      condition: 'An obstacle is detected directly ahead.',
      expectedAction: 'Turn to avoid the obstacle.',
    },

    question: {
      prompt:
        'Robo detects an obstacle directly ahead. What should it do next?',
      options: [
        'Use its program to choose an action',
        'Ignore the sensor',
        'Turn off the battery',
        'Delete its program',
      ],
      answer: 0,
    },

    hint:
      'After sensing information, a robot needs to process it and decide what to do.',

    successMessage:
      'Excellent! You understand Sense → Think → Act.',

    realWorldConnection:
      'Many autonomous robots continuously sense their environment, process information and act.',

    stars: 3,
  },

  {
    id: 26,
    level: 3,
    title: 'Four-Corner Mission',
    description:
      'Navigate Robo around a simple square route.',

    emoji: '⬛',

    type: 'build-sequence',

    gridSize: 5,

    robot: { x: 1, y: 3 },
    target: { x: 1, y: 3 },
    targetEmoji: '🏁',

    targetSequence: [
      'Forward',
      'Forward',
      'TurnRight',
      'Forward',
      'Forward',
      'TurnRight',
      'Forward',
      'Forward',
      'TurnRight',
      'Forward',
      'Forward',
      'TurnRight',
    ],

    maxSteps: 12,

    skills: [
      'sequencing',
      'algorithms',
      'spatial-reasoning',
      'memory',
    ],

    learningObjective:
      'Use a repeated instruction pattern to complete a closed route.',

    vocabulary: [
      'square',
      'pattern',
      'repeat',
      'route',
    ],

    hint:
      'Each side of the square has two Forward commands followed by a Right turn.',

    successMessage:
      'Mission complete! Robo returned to its starting point.',

    realWorldConnection:
      'Repeated movement patterns are useful in robot patrol and inspection routines.',

    stars: 3,
  },

  {
    id: 27,
    level: 3,
    title: 'Robo Delivery',
    description:
      'Guide Robo from the warehouse to the delivery point.',

    emoji: '📦',

    type: 'shortest-path',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 3, y: 1 },
    targetEmoji: '📦',

    targetSequence: [
      'TurnRight',
      'Forward',
      'Forward',
      'Forward',
      'TurnLeft',
      'Forward',
      'Forward',
      'Forward',
    ],

    maxSteps: 8,

    skills: [
      'algorithms',
      'spatial-reasoning',
      'problem-solving',
    ],

    learningObjective:
      'Apply route planning to a practical delivery scenario.',

    vocabulary: [
      'delivery',
      'warehouse',
      'route',
      'destination',
    ],

    hint:
      'Travel East three spaces, then North three spaces.',

    successMessage:
      'Delivery successful! Robo reached the destination.',

    realWorldConnection:
      'Warehouse robots can transport goods between storage and delivery locations.',

    stars: 3,
  },

  {
    id: 28,
    level: 3,
    title: 'Emergency Robot',
    description:
      'Send Robo to the emergency beacon as quickly as possible.',

    emoji: '🚨',

    type: 'shortest-path',

    gridSize: 5,

    robot: { x: 4, y: 4 },
    target: { x: 1, y: 2 },
    targetEmoji: '🚨',

    targetSequence: [
      'TurnLeft',
      'Forward',
      'Forward',
      'Forward',
      'TurnRight',
      'Forward',
      'Forward',
    ],

    maxSteps: 7,

    skills: [
      'algorithms',
      'problem-solving',
      'spatial-reasoning',
    ],

    learningObjective:
      'Apply efficient route planning to an emergency scenario.',

    vocabulary: [
      'emergency',
      'beacon',
      'route',
      'efficient',
    ],

    hint:
      'Travel West three spaces, then North two spaces.',

    successMessage:
      'Emergency mission successful! Robo reached the beacon.',

    realWorldConnection:
      'Robots can support emergency response by delivering supplies or locating signals.',

    stars: 3,
  },

  {
    id: 29,
    level: 3,
    title: 'Debug the Delivery',
    description:
      'Correct Robo’s delivery program.',

    emoji: '🐞',

    type: 'debug',

    gridSize: 5,

    robot: { x: 0, y: 4 },
    target: { x: 2, y: 2 },
    targetEmoji: '📦',

    targetSequence: [
      'TurnRight',
      'Forward',
      'Forward',
      'TurnLeft',
      'Forward',
      'Forward',
    ],

    maxSteps: 6,

    skills: [
      'debugging',
      'algorithms',
      'problem-solving',
    ],

    learningObjective:
      'Identify an incorrect movement and repair the program.',

    vocabulary: [
      'debug',
      'error',
      'correction',
      'program',
    ],

    debugScenario: {
      incorrectSequence: [
        'TurnRight',
        'Forward',
        'Forward',
        'TurnRight',
        'Forward',
        'Forward',
      ],
      problem:
        'Robo turns South instead of North before the final two movements.',
      correction: [
        'TurnRight',
        'Forward',
        'Forward',
        'TurnLeft',
        'Forward',
        'Forward',
      ],
    },

    hint:
      'Check the direction Robo should face before the final two movements.',

    successMessage:
      'Bug fixed! Robo can now complete the delivery.',

    realWorldConnection:
      'Software engineers test programs, identify errors and modify code to produce the intended result.',

    stars: 3,
  },

  {
    id: 30,
    level: 3,
    title: 'Build Your First Smart Robot',
    description:
      'Plan a robot that can sense, think and act.',

    emoji: '🧠',

    type: 'engineering',

    skills: [
      'engineering-design',
      'systems-thinking',
      'sensors',
      'programming',
      'creativity',
    ],

    learningObjective:
      'Combine robot components and computational thinking into a complete system.',

    vocabulary: [
      'sensor',
      'controller',
      'actuator',
      'system',
      'algorithm',
    ],

    engineeringMission: {
      goal:
        'Design a robot that can detect an obstacle and respond safely.',

      constraints: [
        'The robot must have a sensor.',
        'The robot must have a controller.',
        'The robot must have an actuator.',
        'The robot must have a power source.',
      ],

      successCriteria: [
        'The robot can detect information from its environment.',
        'The controller can process the information.',
        'The robot can perform an appropriate action.',
        'The design explains how the components work together.',
      ],
    },

    question: {
      prompt:
        'Which model best describes how a smart robot operates?',
      options: [
        'Sense → Think → Act',
        'Move → Sleep → Forget',
        'Battery → Shell → Wheel',
        'See → Stop → Delete',
      ],
      answer: 0,
    },

    hint:
      'Think about the three major stages of intelligent robot behavior.',

    successMessage:
      'Excellent engineering thinking! You connected sensing, processing and action.',

    realWorldConnection:
      'Modern autonomous robots combine sensors, computing and actuators to interact with the physical world.',

    stars: 3,
  },
];

/* =========================================================
   MASTER CHALLENGE COLLECTION
   ========================================================= */

export const ROBOTICS_CHALLENGES: RoboticsChallenge[] = [
  ...LEVEL_1_CHALLENGES,
  ...LEVEL_2_CHALLENGES,
  ...LEVEL_3_CHALLENGES,
];

/* =========================================================
   CORE ROBOTICS MODEL
   ========================================================= */

export const ROBOTICS_SYSTEM_MODEL = [
  {
    step: 1,
    name: 'Sense',
    emoji: '👁️',
    description:
      'The robot collects information using sensors.',
  },

  {
    step: 2,
    name: 'Think',
    emoji: '🧠',
    description:
      'The controller processes information and chooses what to do.',
  },

  {
    step: 3,
    name: 'Act',
    emoji: '⚙️',
    description:
      'The robot uses motors, lights, arms or other actuators to respond.',
  },
];

/* =========================================================
   ROBOTICS VOCABULARY
   ========================================================= */

export const ROBOTICS_VOCABULARY = [
  {
    word: 'Robot',
    definition:
      'A machine that can perform actions using programmed instructions.',
  },

  {
    word: 'Sensor',
    definition:
      'A component that detects information about the environment.',
  },

  {
    word: 'Actuator',
    definition:
      'A component that creates physical action or movement.',
  },

  {
    word: 'Controller',
    definition:
      'The computing component that processes instructions and controls the robot.',
  },

  {
    word: 'Algorithm',
    definition:
      'A step-by-step method for solving a problem or completing a task.',
  },

  {
    word: 'Sequence',
    definition:
      'Instructions arranged and performed in a particular order.',
  },

  {
    word: 'Debug',
    definition:
      'To find and correct an error in a program.',
  },

  {
    word: 'Input',
    definition:
      'Information received by a system.',
  },

  {
    word: 'Output',
    definition:
      'The result or action produced by a system.',
  },

  {
    word: 'Automation',
    definition:
      'Using technology to perform a task with reduced human control.',
  },
];

/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

export const getRoboticsChallengeById = (
  id: number,
): RoboticsChallenge | undefined => {
  return ROBOTICS_CHALLENGES.find(
    (challenge) => challenge.id === id,
  );
};

export const getRoboticsChallengesByLevel = (
  level: RoboticsLevel,
): RoboticsChallenge[] => {
  return ROBOTICS_CHALLENGES.filter(
    (challenge) => challenge.level === level,
  );
};

export const getRoboticsChallengesByType = (
  type: ChallengeType,
): RoboticsChallenge[] => {
  return ROBOTICS_CHALLENGES.filter(
    (challenge) => challenge.type === type,
  );
};

export const getRoboticsChallengesBySkill = (
  skill: RoboticsSkill,
): RoboticsChallenge[] => {
  return ROBOTICS_CHALLENGES.filter((challenge) =>
    challenge.skills.includes(skill),
  );
};

export const getNextRoboticsChallenge = (
  currentId: number,
): RoboticsChallenge | undefined => {
  return ROBOTICS_CHALLENGES.find(
    (challenge) => challenge.id === currentId + 1,
  );
};

export const getFirstChallengeForLevel = (
  level: RoboticsLevel,
): RoboticsChallenge | undefined => {
  return ROBOTICS_CHALLENGES.find(
    (challenge) => challenge.level === level,
  );
};

/* =========================================================
   PROGRESS HELPERS
   ========================================================= */

export interface RoboticsProgress {
  completed: number;
  total: number;
  percentage: number;
  stars: number;
  totalStars: number;
}

export const getTotalRoboticsStars = (): number => {
  return ROBOTICS_CHALLENGES.reduce(
    (total, challenge) =>
      total + (challenge.stars ?? 1),
    0,
  );
};

export const getEarnedRoboticsStars = (
  completedChallengeIds: number[],
): number => {
  return ROBOTICS_CHALLENGES.reduce(
    (total, challenge) => {
      if (!completedChallengeIds.includes(challenge.id)) {
        return total;
      }

      return total + (challenge.stars ?? 1);
    },
    0,
  );
};

export const getRoboticsProgress = (
  completedChallengeIds: number[],
): RoboticsProgress => {
  const total = ROBOTICS_CHALLENGES.length;

  const completed = ROBOTICS_CHALLENGES.filter(
    (challenge) =>
      completedChallengeIds.includes(challenge.id),
  ).length;

  const totalStars = getTotalRoboticsStars();

  const stars = getEarnedRoboticsStars(
    completedChallengeIds,
  );

  return {
    completed,
    total,
    percentage:
      total === 0
        ? 0
        : Math.round((completed / total) * 100),
    stars,
    totalStars,
  };
};

export const getRoboticsVocabulary = (
  completedChallengeIds: number[],
): string[] => {
  const vocabulary = ROBOTICS_CHALLENGES
    .filter((challenge) =>
      completedChallengeIds.includes(challenge.id),
    )
    .flatMap((challenge) => challenge.vocabulary);

  return [...new Set(vocabulary)];
};

export const getRoboticsSkills = (
  completedChallengeIds: number[],
): RoboticsSkill[] => {
  const skills = ROBOTICS_CHALLENGES
    .filter((challenge) =>
      completedChallengeIds.includes(challenge.id),
    )
    .flatMap((challenge) => challenge.skills);

  return [...new Set(skills)];
};

/* =========================================================
   VALIDATION
   ========================================================= */

export const validateRoboticsChallenges = (): string[] => {
  const errors: string[] = [];

  const ids = new Set<number>();

  for (const challenge of ROBOTICS_CHALLENGES) {
    if (ids.has(challenge.id)) {
      errors.push(
        `Duplicate challenge ID: ${challenge.id}`,
      );
    }

    ids.add(challenge.id);

    if (
      challenge.targetSequence &&
      challenge.maxSteps !== undefined &&
      challenge.targetSequence.length >
        challenge.maxSteps
    ) {
      errors.push(
        `Challenge ${challenge.id}: target sequence exceeds maxSteps.`,
      );
    }

    if (challenge.question) {
      if (
        challenge.question.answer < 0 ||
        challenge.question.answer >=
          challenge.question.options.length
      ) {
        errors.push(
          `Challenge ${challenge.id}: invalid question answer index.`,
        );
      }
    }

    if (challenge.gridSize !== undefined) {
      if (challenge.gridSize < 2) {
        errors.push(
          `Challenge ${challenge.id}: gridSize must be at least 2.`,
        );
      }
    }

    if (challenge.robot && challenge.gridSize) {
      if (
        challenge.robot.x < 0 ||
        challenge.robot.x >= challenge.gridSize ||
        challenge.robot.y < 0 ||
        challenge.robot.y >= challenge.gridSize
      ) {
        errors.push(
          `Challenge ${challenge.id}: robot position is outside grid.`,
        );
      }
    }

    if (challenge.target && challenge.gridSize) {
      if (
        challenge.target.x < 0 ||
        challenge.target.x >= challenge.gridSize ||
        challenge.target.y < 0 ||
        challenge.target.y >= challenge.gridSize
      ) {
        errors.push(
          `Challenge ${challenge.id}: target position is outside grid.`,
        );
      }
    }
  }

  return errors;
};