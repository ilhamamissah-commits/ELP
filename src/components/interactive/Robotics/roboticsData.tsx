// roboticsData.ts
// ============================================================
// MINARA — ROBOTICS ACADEMY
// Core Robotics Knowledge & Parts Data
//
// Curriculum philosophy:
// Discover → Explore → Identify → Build → Program → Test
// → Debug → Improve → Explain
// ============================================================

/* ============================================================
   TYPES
   ============================================================ */

export type RobotPartType =
  | 'body'
  | 'brain'
  | 'power'
  | 'sensor'
  | 'actuator'
  | 'output'
  | 'communication'
  | 'accessory';

export type RoboticsDifficulty = 1 | 2 | 3 | 4 | 5;

export type RoboticsSkill =
  | 'observation'
  | 'classification'
  | 'spatial-reasoning'
  | 'sequencing'
  | 'problem-solving'
  | 'systems-thinking'
  | 'engineering-design'
  | 'algorithms'
  | 'programming'
  | 'debugging'
  | 'sensors'
  | 'automation'
  | 'creativity'
  | 'communication'
  | 'memory'
  | 'prediction';

export type RobotFunction =
  | 'structure'
  | 'power'
  | 'input'
  | 'processing'
  | 'movement'
  | 'output'
  | 'communication'
  | 'protection';

export type RealityLevel =
  | 'real'
  | 'simplified'
  | 'imagination';

export interface PartQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

export interface RobotPart {
  id: string;
  name: string;
  emoji: string;

  type: RobotPartType;

  cost: number;

  childDescription: string;
  technicalDescription: string;

  function: RobotFunction;

  skills: RoboticsSkill[];

  /**
   * IDs of parts that are needed for this part
   * to function meaningfully.
   */
  requires?: string[];

  /**
   * Important vocabulary introduced by this part.
   */
  vocabulary: string[];

  /**
   * Optional formative assessment.
   */
  question?: PartQuestion;

  /**
   * real       = based on real robotics
   * simplified = simplified educational representation
   * imagination = creative/imaginative robotics
   */
  reality: RealityLevel;

  /**
   * Suggested learning progression.
   */
  difficulty: RoboticsDifficulty;

  /**
   * Used for filtering and curriculum sequencing.
   */
  ageRange: [number, number];

  /**
   * Optional real-world example.
   */
  realWorldExample?: string;

  /**
   * Optional safety/ethics note.
   */
  safetyNote?: string;
}

/* ============================================================
   ROBOT PARTS
   ============================================================ */

export const ROBOT_PARTS: RobotPart[] = [

  /* ==========================================================
     BODY / STRUCTURE
     ========================================================== */

  {
    id: 'body-chassis-small',
    name: 'Small Chassis',
    emoji: '📦',
    type: 'body',
    cost: 10,

    childDescription:
      'The chassis is the main body that holds the robot parts together.',

    technicalDescription:
      'A structural frame that supports and protects the robot’s components.',

    function: 'structure',

    skills: [
      'classification',
      'engineering-design',
      'systems-thinking',
    ],

    vocabulary: [
      'chassis',
      'structure',
      'frame',
      'component',
    ],

    question: {
      prompt: 'What is the main job of a robot chassis?',
      options: [
        'Hold the robot parts together',
        'Tell jokes',
        'Measure temperature',
      ],
      answer: 0,
    },

    reality: 'real',
    difficulty: 1,
    ageRange: [3, 6],

    realWorldExample:
      'Small educational robots often use lightweight plastic chassis.',
  },

  {
    id: 'body-chassis-medium',
    name: 'Medium Chassis',
    emoji: '🧰',
    type: 'body',
    cost: 25,

    childDescription:
      'A medium-sized robot body gives your robot room for more components.',

    technicalDescription:
      'A medium structural platform designed to accommodate additional electronics and actuators.',

    function: 'structure',

    skills: [
      'engineering-design',
      'systems-thinking',
      'problem-solving',
    ],

    vocabulary: [
      'chassis',
      'frame',
      'structure',
      'component',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 7],

    realWorldExample:
      'Mobile robots use different chassis sizes depending on their payload.',
  },

  {
    id: 'body-heavy-duty-frame',
    name: 'Heavy-Duty Frame',
    emoji: '🛠️',
    type: 'body',
    cost: 50,

    childDescription:
      'This strong frame is designed to carry heavier robot equipment.',

    technicalDescription:
      'A reinforced structural platform designed to support higher loads and larger actuators.',

    function: 'structure',

    skills: [
      'engineering-design',
      'systems-thinking',
      'problem-solving',
    ],

    vocabulary: [
      'reinforced',
      'load',
      'structure',
      'frame',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [6, 10],

    realWorldExample:
      'Industrial robots require strong frames to support heavy equipment.',

    safetyNote:
      'Robots carrying heavy objects require careful engineering and safety controls.',
  },

  {
    id: 'body-tank-treads',
    name: 'Tank Treads',
    emoji: '🚜',
    type: 'body',
    cost: 60,

    childDescription:
      'Tank treads help a robot move across rough or uneven ground.',

    technicalDescription:
      'Continuous tracks distribute the robot’s weight across a larger contact area.',

    function: 'movement',

    skills: [
      'spatial-reasoning',
      'engineering-design',
      'problem-solving',
    ],

    vocabulary: [
      'traction',
      'treads',
      'movement',
      'surface',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [5, 10],

    realWorldExample:
      'Search-and-rescue robots can use tracks to travel over difficult terrain.',
  },

  {
    id: 'body-spider-legs',
    name: 'Spider Legs',
    emoji: '🕷️',
    type: 'body',
    cost: 70,

    childDescription:
      'Multiple legs can help a robot move in interesting ways.',

    technicalDescription:
      'A multi-legged locomotion system using coordinated actuators for movement.',

    function: 'movement',

    skills: [
      'spatial-reasoning',
      'sequencing',
      'systems-thinking',
    ],

    vocabulary: [
      'locomotion',
      'leg',
      'balance',
      'coordination',
    ],

    reality: 'simplified',
    difficulty: 3,
    ageRange: [6, 10],

    realWorldExample:
      'Researchers build legged robots that can walk over complex terrain.',
  },

  {
    id: 'body-protective-shell',
    name: 'Protective Shell',
    emoji: '🛡️',
    type: 'body',
    cost: 40,

    childDescription:
      'A protective shell helps keep important robot parts safe.',

    technicalDescription:
      'A protective enclosure designed to shield electronics and mechanical components.',

    function: 'protection',

    skills: [
      'classification',
      'engineering-design',
      'systems-thinking',
    ],

    vocabulary: [
      'protection',
      'enclosure',
      'shield',
      'component',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 8],

    realWorldExample:
      'Many robots use protective housings around sensitive electronics.',
  },

  {
    id: 'body-ice-skates',
    name: 'Ice Skates',
    emoji: '⛸️',
    type: 'body',
    cost: 25,

    childDescription:
      'These imaginative robot attachments help Robo glide across icy surfaces.',

    technicalDescription:
      'A simplified educational locomotion attachment representing specialized movement systems.',

    function: 'movement',

    skills: [
      'creativity',
      'spatial-reasoning',
      'engineering-design',
    ],

    vocabulary: [
      'glide',
      'surface',
      'friction',
      'movement',
    ],

    reality: 'imagination',
    difficulty: 2,
    ageRange: [4, 8],
  },

  {
    id: 'body-balloon',
    name: 'Balloon Body',
    emoji: '🎈',
    type: 'body',
    cost: 20,

    childDescription:
      'An imaginative floating robot body for exploring ideas about flight.',

    technicalDescription:
      'A conceptual model used to introduce buoyancy and lightweight robot designs.',

    function: 'movement',

    skills: [
      'creativity',
      'observation',
      'engineering-design',
    ],

    vocabulary: [
      'float',
      'buoyancy',
      'lightweight',
      'flight',
    ],

    reality: 'imagination',
    difficulty: 2,
    ageRange: [4, 8],
  },

  {
    id: 'body-ocean-frame',
    name: 'Underwater Frame',
    emoji: '🌊',
    type: 'body',
    cost: 60,

    childDescription:
      'A special robot body designed for underwater exploration.',

    technicalDescription:
      'A conceptual underwater vehicle frame that can house sensors and propulsion systems.',

    function: 'structure',

    skills: [
      'systems-thinking',
      'engineering-design',
      'problem-solving',
    ],

    vocabulary: [
      'underwater',
      'pressure',
      'exploration',
      'frame',
    ],

    reality: 'simplified',
    difficulty: 3,
    ageRange: [6, 10],

    realWorldExample:
      'Underwater robots are used to explore oceans and inspect underwater structures.',
  },

  /* ==========================================================
     BRAIN / PROCESSING
     ========================================================== */

  {
    id: 'brain-basic-controller',
    name: 'Basic Controller',
    emoji: '🧠',
    type: 'brain',
    cost: 20,

    childDescription:
      'The controller helps the robot decide what to do.',

    technicalDescription:
      'A programmable control unit that processes instructions and coordinates robot components.',

    function: 'processing',

    skills: [
      'classification',
      'systems-thinking',
      'programming',
    ],

    vocabulary: [
      'controller',
      'processor',
      'instruction',
      'program',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 7],

    question: {
      prompt: 'Which part helps a robot process instructions?',
      options: [
        'Controller',
        'Wheel',
        'Shell',
      ],
      answer: 0,
    },

    realWorldExample:
      'Educational robots often use microcontrollers such as Arduino-compatible boards.',
  },

  {
    id: 'brain-smart-controller',
    name: 'Smart Controller',
    emoji: '💡',
    type: 'brain',
    cost: 40,

    childDescription:
      'A smart controller can handle more complicated instructions.',

    technicalDescription:
      'A more capable programmable controller supporting multiple inputs, outputs and control routines.',

    function: 'processing',

    skills: [
      'algorithms',
      'programming',
      'systems-thinking',
    ],

    vocabulary: [
      'algorithm',
      'controller',
      'input',
      'output',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [6, 10],

    realWorldExample:
      'Modern robots combine processors with sensors and control software.',
  },

  {
    id: 'brain-ai-controller',
    name: 'AI Controller',
    emoji: '🤖',
    type: 'brain',
    cost: 80,

    childDescription:
      'This advanced controller represents a robot that can use intelligent computer systems.',

    technicalDescription:
      'An educational representation of computing hardware capable of supporting machine-learning or AI workloads.',

    function: 'processing',

    skills: [
      'systems-thinking',
      'programming',
      'automation',
      'problem-solving',
    ],

    vocabulary: [
      'artificial intelligence',
      'model',
      'data',
      'decision',
    ],

    reality: 'simplified',
    difficulty: 4,
    ageRange: [8, 10],

    realWorldExample:
      'Some advanced robots use AI models to interpret images, speech or sensor data.',
  },

  {
    id: 'brain-memory',
    name: 'Memory Module',
    emoji: '💾',
    type: 'brain',
    cost: 15,

    childDescription:
      'Memory helps a robot store information.',

    technicalDescription:
      'A storage component used to retain programs, configuration data or sensor information.',

    function: 'processing',

    skills: [
      'classification',
      'systems-thinking',
    ],

    vocabulary: [
      'memory',
      'storage',
      'data',
      'information',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [5, 9],

    realWorldExample:
      'Robots can store programs and sensor readings in memory.',
  },

  {
    id: 'brain-language-module',
    name: 'Language Module',
    emoji: '🌐',
    type: 'brain',
    cost: 60,

    childDescription:
      'A language module represents technology that helps a robot understand or produce language.',

    technicalDescription:
      'A conceptual natural-language processing component for interpreting or generating human language.',

    function: 'processing',

    skills: [
      'communication',
      'systems-thinking',
      'problem-solving',
    ],

    vocabulary: [
      'language',
      'speech',
      'communication',
      'processing',
    ],

    reality: 'simplified',
    difficulty: 4,
    ageRange: [7, 10],

    realWorldExample:
      'AI systems can process spoken and written language.',
  },

  /* ==========================================================
     POWER
     ========================================================== */

  {
    id: 'power-battery',
    name: 'Robot Battery',
    emoji: '🔋',
    type: 'power',
    cost: 20,

    childDescription:
      'The battery provides energy so the robot can work.',

    technicalDescription:
      'An electrical energy storage device that supplies power to robot electronics and actuators.',

    function: 'power',

    skills: [
      'classification',
      'systems-thinking',
      'problem-solving',
    ],

    vocabulary: [
      'battery',
      'energy',
      'power',
      'electricity',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [3, 7],

    question: {
      prompt: 'Why does a robot need a battery?',
      options: [
        'To provide energy',
        'To give it a name',
        'To make it heavier',
      ],
      answer: 0,
    },

    realWorldExample:
      'Mobile robots commonly use rechargeable batteries.',
  },

  {
    id: 'power-solar',
    name: 'Solar Panel',
    emoji: '☀️',
    type: 'power',
    cost: 35,

    childDescription:
      'A solar panel can turn sunlight into electrical energy.',

    technicalDescription:
      'A photovoltaic device that converts sunlight into electrical energy.',

    function: 'power',

    skills: [
      'observation',
      'systems-thinking',
      'engineering-design',
    ],

    vocabulary: [
      'solar',
      'energy',
      'sunlight',
      'electricity',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [5, 10],

    question: {
      prompt: 'What provides energy to a solar panel?',
      options: [
        'Sunlight',
        'Sound',
        'Water only',
      ],
      answer: 0,
    },

    realWorldExample:
      'Solar-powered robots can operate in environments with strong sunlight.',
  },

  /* ==========================================================
     SENSORS
     ========================================================== */

  {
    id: 'sensor-light',
    name: 'Light Sensor',
    emoji: '🔆',
    type: 'sensor',
    cost: 15,

    childDescription:
      'A light sensor helps a robot detect how bright or dark something is.',

    technicalDescription:
      'A sensor that measures the intensity of visible light.',

    function: 'input',

    skills: [
      'observation',
      'sensors',
      'problem-solving',
    ],

    vocabulary: [
      'sensor',
      'light',
      'brightness',
      'input',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 8],

    question: {
      prompt: 'What can a light sensor detect?',
      options: [
        'Brightness',
        'Taste',
        'Weight only',
      ],
      answer: 0,
    },

    realWorldExample:
      'Light sensors can help robots respond to changes in lighting.',
  },

  {
    id: 'sensor-sound',
    name: 'Sound Sensor',
    emoji: '🎤',
    type: 'sensor',
    cost: 15,

    childDescription:
      'A sound sensor helps a robot notice sounds around it.',

    technicalDescription:
      'A sensor that detects sound pressure or acoustic signals.',

    function: 'input',

    skills: [
      'observation',
      'sensors',
      'automation',
    ],

    vocabulary: [
      'sound',
      'sensor',
      'signal',
      'input',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 8],

    realWorldExample:
      'Robots can use microphones to detect voices or environmental sounds.',
  },

  {
    id: 'sensor-touch',
    name: 'Touch Sensor',
    emoji: '🖐️',
    type: 'sensor',
    cost: 15,

    childDescription:
      'A touch sensor lets a robot notice when something touches it.',

    technicalDescription:
      'A sensor that detects physical contact or changes in pressure.',

    function: 'input',

    skills: [
      'observation',
      'sensors',
      'problem-solving',
    ],

    vocabulary: [
      'touch',
      'contact',
      'pressure',
      'input',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 8],

    realWorldExample:
      'Robotic systems can use contact sensors to detect collisions.',
  },

  {
    id: 'sensor-distance',
    name: 'Distance Sensor',
    emoji: '📏',
    type: 'sensor',
    cost: 30,

    childDescription:
      'A distance sensor helps a robot know how close something is.',

    technicalDescription:
      'A sensor used to estimate the distance between the robot and an object.',

    function: 'input',

    skills: [
      'spatial-reasoning',
      'sensors',
      'problem-solving',
      'automation',
    ],

    vocabulary: [
      'distance',
      'obstacle',
      'sensor',
      'measurement',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [5, 10],

    question: {
      prompt: 'Why might a robot use a distance sensor?',
      options: [
        'To detect obstacles',
        'To choose its favourite colour',
        'To make food',
      ],
      answer: 0,
    },

    realWorldExample:
      'Autonomous robots can use distance sensors to avoid obstacles.',
  },

  {
    id: 'sensor-camera',
    name: 'Camera Sensor',
    emoji: '📷',
    type: 'sensor',
    cost: 45,

    childDescription:
      'A camera gives a robot visual information about its surroundings.',

    technicalDescription:
      'An imaging sensor that captures visual data for computer processing.',

    function: 'input',

    skills: [
      'observation',
      'sensors',
      'systems-thinking',
      'automation',
    ],

    vocabulary: [
      'camera',
      'image',
      'vision',
      'data',
    ],

    reality: 'real',
    difficulty: 3,
    ageRange: [6, 10],

    realWorldExample:
      'Robots can use cameras for navigation, inspection and object recognition.',
  },

  {
    id: 'sensor-temperature',
    name: 'Temperature Sensor',
    emoji: '🌡️',
    type: 'sensor',
    cost: 25,

    childDescription:
      'A temperature sensor helps a robot detect whether something is hot or cold.',

    technicalDescription:
      'A sensor that measures temperature in the robot’s environment or components.',

    function: 'input',

    skills: [
      'observation',
      'sensors',
      'automation',
      'problem-solving',
    ],

    vocabulary: [
      'temperature',
      'hot',
      'cold',
      'measurement',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [5, 9],

    realWorldExample:
      'Robots can monitor temperature in factories, laboratories and homes.',
  },

  {
    id: 'sensor-gps',
    name: 'GPS Sensor',
    emoji: '🛰️',
    type: 'sensor',
    cost: 50,

    childDescription:
      'GPS can help a robot understand where it is.',

    technicalDescription:
      'A positioning receiver that uses satellite signals to estimate geographic location.',

    function: 'input',

    skills: [
      'spatial-reasoning',
      'sensors',
      'systems-thinking',
    ],

    vocabulary: [
      'GPS',
      'location',
      'position',
      'satellite',
    ],

    reality: 'real',
    difficulty: 3,
    ageRange: [7, 10],

    realWorldExample:
      'Outdoor autonomous vehicles can use satellite positioning for navigation.',
  },

  /* ==========================================================
     ACTUATORS / MOVEMENT
     ========================================================== */

  {
    id: 'actuator-wheel-small',
    name: 'Small Motor Wheel',
    emoji: '🛞',
    type: 'actuator',
    cost: 10,

    childDescription:
      'A motor-powered wheel helps the robot move.',

    technicalDescription:
      'A wheel driven by an electric motor to convert electrical energy into rotational movement.',

    function: 'movement',

    skills: [
      'spatial-reasoning',
      'engineering-design',
      'systems-thinking',
    ],

    vocabulary: [
      'motor',
      'wheel',
      'rotation',
      'movement',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [3, 7],

    requires: ['power-battery'],

    realWorldExample:
      'Wheeled mobile robots commonly use electric motors for locomotion.',
  },

  {
    id: 'actuator-wheel-large',
    name: 'Large Motor Wheel',
    emoji: '⚙️',
    type: 'actuator',
    cost: 30,

    childDescription:
      'A larger motor wheel can help a robot move over different surfaces.',

    technicalDescription:
      'A larger powered wheel designed to provide traction and locomotion.',

    function: 'movement',

    skills: [
      'spatial-reasoning',
      'engineering-design',
      'problem-solving',
    ],

    vocabulary: [
      'traction',
      'motor',
      'wheel',
      'rotation',
    ],

    reality: 'real',
    difficulty: 2,
    ageRange: [5, 9],

    requires: ['power-battery'],

    realWorldExample:
      'Different wheel sizes affect robot speed, torque and terrain performance.',
  },

  {
    id: 'actuator-arm',
    name: 'Robot Arm',
    emoji: '🦾',
    type: 'actuator',
    cost: 40,

    childDescription:
      'A robot arm allows the robot to reach and move objects.',

    technicalDescription:
      'A mechanical manipulator consisting of joints and actuators used to position objects or tools.',

    function: 'movement',

    skills: [
      'engineering-design',
      'spatial-reasoning',
      'problem-solving',
      'systems-thinking',
    ],

    vocabulary: [
      'arm',
      'joint',
      'actuator',
      'manipulator',
    ],

    reality: 'real',
    difficulty: 3,
    ageRange: [6, 10],

    requires: [
      'power-battery',
      'brain-basic-controller',
    ],

    realWorldExample:
      'Industrial robots use robotic arms to move, assemble and inspect objects.',
  },

  {
    id: 'actuator-gripper',
    name: 'Robot Gripper',
    emoji: '🤏',
    type: 'actuator',
    cost: 30,

    childDescription:
      'A gripper helps a robot pick up and hold objects.',

    technicalDescription:
      'An end-effector designed to grasp and manipulate physical objects.',

    function: 'movement',

    skills: [
      'engineering-design',
      'problem-solving',
      'spatial-reasoning',
    ],

    vocabulary: [
      'gripper',
      'grasp',
      'object',
      'manipulation',
    ],

    reality: 'real',
    difficulty: 3,
    ageRange: [6, 10],

    requires: [
      'power-battery',
      'brain-basic-controller',
    ],

    realWorldExample:
      'Robotic grippers are used in manufacturing, logistics and research.',
  },

  {
    id: 'actuator-propeller',
    name: 'Propeller Motor',
    emoji: '🚁',
    type: 'actuator',
    cost: 35,

    childDescription:
      'A propeller can help a robot move through air or water in special designs.',

    technicalDescription:
      'A rotating propulsion device that generates thrust by moving air or water.',

    function: 'movement',

    skills: [
      'engineering-design',
      'spatial-reasoning',
      'systems-thinking',
    ],

    vocabulary: [
      'propeller',
      'thrust',
      'rotation',
      'propulsion',
    ],

    reality: 'real',
    difficulty: 3,
    ageRange: [6, 10],

    requires: ['power-battery'],

    realWorldExample:
      'Drones and underwater robots use propellers for propulsion.',
  },

  /* ==========================================================
     OUTPUTS
     ========================================================== */

  {
    id: 'output-led',
    name: 'LED Light',
    emoji: '💡',
    type: 'output',
    cost: 10,

    childDescription:
      'An LED lets the robot communicate using light.',

    technicalDescription:
      'A light-emitting diode used as a visual output device.',

    function: 'output',

    skills: [
      'classification',
      'systems-thinking',
      'communication',
    ],

    vocabulary: [
      'LED',
      'output',
      'signal',
      'light',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 8],

    requires: ['brain-basic-controller'],

    realWorldExample:
      'Robots use indicator lights to communicate status or warnings.',
  },

  {
    id: 'output-speaker',
    name: 'Robot Speaker',
    emoji: '🔊',
    type: 'output',
    cost: 20,

    childDescription:
      'A speaker allows a robot to make sounds or play messages.',

    technicalDescription:
      'An electroacoustic output device that converts electrical signals into sound.',

    function: 'output',

    skills: [
      'communication',
      'systems-thinking',
    ],

    vocabulary: [
      'speaker',
      'sound',
      'output',
      'signal',
    ],

    reality: 'real',
    difficulty: 1,
    ageRange: [4, 8],

    requires: ['brain-basic-controller'],

    realWorldExample:
      'Social robots can use speakers to communicate with people.',
  },

  /* ==========================================================
     COMMUNICATION
     ========================================================== */

  {
    id: 'communication-wireless',
    name: 'Wireless Link',
    emoji: '📡',
    type: 'communication',
    cost: 25,

    childDescription:
      'A wireless link helps a robot communicate without a physical cable.',

    technicalDescription:
      'A wireless communication interface for transmitting and receiving digital information.',

    function: 'communication',

    skills: [
      'systems-thinking',
      'communication',
      'problem-solving',
    ],

    vocabulary: [
      'wireless',
      'signal',
      'communication',
      'data',
    ],

    reality: 'real',
    difficulty: 3,
    ageRange: [7, 10],

    realWorldExample:
      'Robots can communicate with computers and other robots wirelessly.',
  },

  /* ==========================================================
     ACCESSORIES / LEARNING EXTENSIONS
     ========================================================== */

  {
    id: 'accessory-recycling-bin',
    name: 'Recycling Collector',
    emoji: '♻️',
    type: 'accessory',
    cost: 20,

    childDescription:
      'This attachment helps Robo collect objects for sorting and recycling.',

    technicalDescription:
      'An educational representation of a material collection system for environmental robotics.',

    function: 'structure',

    skills: [
      'problem-solving',
      'engineering-design',
      'systems-thinking',
      'creativity',
    ],

    vocabulary: [
      'recycling',
      'collect',
      'material',
      'environment',
    ],

    reality: 'simplified',
    difficulty: 2,
    ageRange: [5, 10],

    realWorldExample:
      'Robotics can support waste sorting and material recovery systems.',
  },

  {
    id: 'accessory-farm-tool',
    name: 'Farm Tool',
    emoji: '🌱',
    type: 'accessory',
    cost: 25,

    childDescription:
      'A farming attachment helps Robo explore how robots can support agriculture.',

    technicalDescription:
      'A conceptual agricultural robotics tool representing automated interaction with crops or soil.',

    function: 'movement',

    skills: [
      'engineering-design',
      'systems-thinking',
      'problem-solving',
      'creativity',
    ],

    vocabulary: [
      'agriculture',
      'crop',
      'automation',
      'robotics',
    ],

    reality: 'simplified',
    difficulty: 3,
    ageRange: [6, 10],

    realWorldExample:
      'Agricultural robots can monitor crops, remove weeds and assist with harvesting.',
  },

  {
    id: 'accessory-rescue-light',
    name: 'Rescue Beacon',
    emoji: '🚨',
    type: 'output',
    cost: 30,

    childDescription:
      'A rescue beacon helps a robot signal its location during an emergency mission.',

    technicalDescription:
      'A visual or audible signalling device used to communicate robot status or location.',

    function: 'output',

    skills: [
      'communication',
      'problem-solving',
      'systems-thinking',
    ],

    vocabulary: [
      'rescue',
      'beacon',
      'signal',
      'emergency',
    ],

    reality: 'simplified',
    difficulty: 2,
    ageRange: [5, 10],

    realWorldExample:
      'Search-and-rescue robots may use lights, sounds or wireless signals to communicate.',
  },

  /* ==========================================================
     IMAGINATION LAB
     ========================================================== */

  {
    id: 'imagination-rocket-booster',
    name: 'Rocket Booster',
    emoji: '🚀',
    type: 'accessory',
    cost: 80,

    childDescription:
      'Imagine a robot that could explore another planet with rocket-powered movement!',

    technicalDescription:
      'A fictional propulsion attachment used to encourage creative engineering scenarios.',

    function: 'movement',

    skills: [
      'creativity',
      'engineering-design',
      'spatial-reasoning',
    ],

    vocabulary: [
      'rocket',
      'propulsion',
      'space',
      'exploration',
    ],

    reality: 'imagination',
    difficulty: 4,
    ageRange: [6, 10],

    safetyNote:
      'This is an imaginative educational model and not a construction guide for propulsion systems.',
  },

  {
    id: 'imagination-dance-module',
    name: 'Dance Module',
    emoji: '💃',
    type: 'accessory',
    cost: 35,

    childDescription:
      'What if Robo could create its own dance routine?',

    technicalDescription:
      'A fictional actuator and programming concept used to explore movement sequences.',

    function: 'movement',

    skills: [
      'creativity',
      'sequencing',
      'programming',
      'communication',
    ],

    vocabulary: [
      'sequence',
      'movement',
      'routine',
      'program',
    ],

    reality: 'imagination',
    difficulty: 2,
    ageRange: [4, 9],
  },

  {
    id: 'imagination-emotion-module',
    name: 'Emotion Module',
    emoji: '😊',
    type: 'accessory',
    cost: 50,

    childDescription:
      'Imagine a robot that can recognize expressions and respond appropriately.',

    technicalDescription:
      'A fictional educational model representing affective computing and human-robot interaction.',

    function: 'processing',

    skills: [
      'communication',
      'systems-thinking',
      'creativity',
      'problem-solving',
    ],

    vocabulary: [
      'emotion',
      'expression',
      'interaction',
      'AI',
    ],

    reality: 'simplified',
    difficulty: 4,
    ageRange: [7, 10],

    realWorldExample:
      'Researchers study human-robot interaction and systems that interpret social signals.',
  },
];

/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

/**
 * Find a robot part by ID.
 */
export const getRobotPartById = (
  id: string
): RobotPart | undefined => {
  return ROBOT_PARTS.find((part) => part.id === id);
};

/**
 * Get all parts of a particular type.
 */
export const getRobotPartsByType = (
  type: RobotPartType
): RobotPart[] => {
  return ROBOT_PARTS.filter((part) => part.type === type);
};

/**
 * Get parts suitable for a particular age.
 */
export const getRobotPartsForAge = (
  age: number
): RobotPart[] => {
  return ROBOT_PARTS.filter(
    (part) =>
      age >= part.ageRange[0] &&
      age <= part.ageRange[1]
  );
};

/**
 * Get parts according to difficulty.
 */
export const getRobotPartsByDifficulty = (
  difficulty: RoboticsDifficulty
): RobotPart[] => {
  return ROBOT_PARTS.filter(
    (part) => part.difficulty === difficulty
  );
};

/**
 * Get real robotics parts.
 */
export const getRealRobotParts = (): RobotPart[] => {
  return ROBOT_PARTS.filter(
    (part) =>
      part.reality === 'real' ||
      part.reality === 'simplified'
  );
};

/**
 * Get imagination-lab parts.
 */
export const getImaginationParts = (): RobotPart[] => {
  return ROBOT_PARTS.filter(
    (part) => part.reality === 'imagination'
  );
};

/**
 * Check whether a part's prerequisites are satisfied.
 */
export const canUseRobotPart = (
  part: RobotPart,
  selectedPartIds: string[]
): boolean => {
  if (!part.requires || part.requires.length === 0) {
    return true;
  }

  return part.requires.every((requiredId) =>
    selectedPartIds.includes(requiredId)
  );
};

/**
 * Calculate total robot cost.
 */
export const calculateRobotCost = (
  selectedPartIds: string[]
): number => {
  return selectedPartIds.reduce((total, id) => {
    const part = getRobotPartById(id);

    return total + (part?.cost ?? 0);
  }, 0);
};

/**
 * Get all skills represented by a robot design.
 */
export const getRobotSkills = (
  selectedPartIds: string[]
): RoboticsSkill[] => {
  const skills = new Set<RoboticsSkill>();

  selectedPartIds.forEach((id) => {
    const part = getRobotPartById(id);

    part?.skills.forEach((skill) => {
      skills.add(skill);
    });
  });

  return Array.from(skills);
};

/**
 * Get vocabulary represented by a robot design.
 */
export const getRobotVocabulary = (
  selectedPartIds: string[]
): string[] => {
  const vocabulary = new Set<string>();

  selectedPartIds.forEach((id) => {
    const part = getRobotPartById(id);

    part?.vocabulary.forEach((word) => {
      vocabulary.add(word);
    });
  });

  return Array.from(vocabulary);
};

/* ============================================================
   CURRICULUM CATEGORIES
   ============================================================ */

export const ROBOT_PART_CATEGORIES: {
  type: RobotPartType;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    type: 'body',
    title: 'Structure',
    description: 'The parts that give a robot its shape and support.',
    emoji: '🧱',
  },
  {
    type: 'brain',
    title: 'Brain',
    description: 'The computing parts that process instructions.',
    emoji: '🧠',
  },
  {
    type: 'power',
    title: 'Power',
    description: 'The parts that provide or store energy.',
    emoji: '🔋',
  },
  {
    type: 'sensor',
    title: 'Sensors',
    description: 'The parts that help a robot sense the world.',
    emoji: '👁️',
  },
  {
    type: 'actuator',
    title: 'Movement',
    description: 'The parts that make the robot move.',
    emoji: '⚙️',
  },
  {
    type: 'output',
    title: 'Outputs',
    description: 'The parts a robot uses to communicate.',
    emoji: '💡',
  },
  {
    type: 'communication',
    title: 'Communication',
    description: 'The parts that help robots exchange information.',
    emoji: '📡',
  },
  {
    type: 'accessory',
    title: 'Mission Tools',
    description: 'Special tools for engineering missions.',
    emoji: '🛠️',
  },
];

/* ============================================================
   CORE ROBOTICS CONCEPTS
   ============================================================ */

export const ROBOTICS_CORE_CONCEPTS = [
  {
    id: 'sense',
    title: 'Sense',
    emoji: '👁️',
    description:
      'Robots use sensors to collect information about the world.',
    examples: [
      'Light sensor detects brightness.',
      'Distance sensor detects obstacles.',
      'Temperature sensor measures heat.',
    ],
  },

  {
    id: 'think',
    title: 'Think',
    emoji: '🧠',
    description:
      'A controller processes information and follows instructions.',
    examples: [
      'The robot receives sensor information.',
      'The program decides what should happen.',
      'The controller sends instructions to other parts.',
    ],
  },

  {
    id: 'act',
    title: 'Act',
    emoji: '⚙️',
    description:
      'Actuators allow robots to move or interact with the world.',
    examples: [
      'Motors turn wheels.',
      'Robot arms move objects.',
      'Speakers produce sound.',
    ],
  },
] as const;

/* ============================================================
   ROBOTICS LEARNING LOOP
   ============================================================ */

export const ROBOTICS_LEARNING_LOOP = [
  {
    step: 1,
    id: 'discover',
    title: 'Discover',
    emoji: '🔎',
    description: 'Meet a new robot idea or problem.',
  },

  {
    step: 2,
    id: 'explore',
    title: 'Explore',
    emoji: '🧭',
    description: 'Investigate parts and how they work.',
  },

  {
    step: 3,
    id: 'identify',
    title: 'Identify',
    emoji: '🧩',
    description: 'Choose the parts needed for the task.',
  },

  {
    step: 4,
    id: 'build',
    title: 'Build',
    emoji: '🔧',
    description: 'Put the robot system together.',
  },

  {
    step: 5,
    id: 'program',
    title: 'Program',
    emoji: '💻',
    description: 'Give the robot instructions.',
  },

  {
    step: 6,
    id: 'predict',
    title: 'Predict',
    emoji: '🔮',
    description: 'Think about what will happen before testing.',
  },

  {
    step: 7,
    id: 'test',
    title: 'Test',
    emoji: '🧪',
    description: 'Run the robot and observe the result.',
  },

  {
    step: 8,
    id: 'debug',
    title: 'Debug',
    emoji: '🐞',
    description: 'Find and fix mistakes.',
  },

  {
    step: 9,
    id: 'improve',
    title: 'Improve',
    emoji: '📈',
    description: 'Change the design to make it better.',
  },

  {
    step: 10,
    id: 'explain',
    title: 'Explain',
    emoji: '💬',
    description: 'Explain what the robot does and why.',
  },
] as const;