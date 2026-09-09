// src/data/scienceData.ts

export type ScienceDifficulty = "Easy" | "Medium" | "Hard";

export type ScienceSkill =
  | "Observation"
  | "Classification"
  | "Life Processes"
  | "Plants"
  | "Animals"
  | "Human Body"
  | "Habitats"
  | "Ecosystems"
  | "Forces"
  | "Motion"
  | "Energy"
  | "Light"
  | "Sound"
  | "Magnetism"
  | "Heat"
  | "Matter"
  | "Materials"
  | "Mixtures"
  | "Solutions"
  | "Changes"
  | "Scientific Method"
  | "Problem Solving"
  | "Measurement"
  | "Cause and Effect";

export interface ScienceQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface Experiment {
  id: number;
  title: string;
  description: string;
  level: number;
  difficulty: ScienceDifficulty;
  skill: ScienceSkill;

  iconName: string;
  color: string;
  bgColor: string;

  question: string;
  objective: string;

  materials: string[];

  prediction?: ScienceQuestion;

  steps: string[];

  observation?: ScienceQuestion;

  challenge?: ScienceQuestion;

  explanation: string;

  conclusion: string;

  keyLearning: string[];
}

/* =========================================================
   BIOLOGY
   ========================================================= */

export const BIOLOGY_EXPERIMENTS: Experiment[] = [
  {
    id: 101,
    title: "Living or Non-Living?",
    description:
      "Discover some of the features that help us identify living things.",
    level: 1,
    difficulty: "Easy",
    skill: "Classification",
    iconName: "Leaf",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",

    question: "How can we tell whether something is living?",

    objective:
      "Learn that living things carry out life processes such as growing, needing energy, responding to their surroundings and reproducing.",

    materials: [
      "Pictures of a plant",
      "Picture of a rock",
      "Picture of a cat",
      "Picture of a toy car",
    ],

    prediction: {
      question: "Which one is a living thing?",
      options: ["A rock", "A cat", "A toy car"],
      answer: 1,
    },

    steps: [
      "Look carefully at each object.",
      "Ask whether it grows or changes by itself.",
      "Ask whether it needs energy or food.",
      "Decide which objects are living.",
    ],

    observation: {
      question: "Which feature is common to living things?",
      options: [
        "They can carry out life processes.",
        "They are always made of metal.",
        "They never change.",
      ],
      answer: 0,
    },

    challenge: {
      question: "A seed looks inactive. What can it become?",
      options: ["A plant", "A stone", "A machine"],
      answer: 0,
    },

    explanation:
      "Living things carry out life processes. Plants and animals grow, use energy and respond to their surroundings.",

    conclusion:
      "Living things are different from non-living things because they carry out life processes.",

    keyLearning: [
      "Living things carry out life processes.",
      "Plants and animals are living things.",
      "Non-living objects do not carry out life processes.",
    ],
  },

  {
    id: 102,
    title: "What Do Seeds Need?",
    description:
      "Investigate the conditions that help a seed begin growing.",
    level: 1,
    difficulty: "Easy",
    skill: "Plants",
    iconName: "Sprout",
    color: "text-green-400",
    bgColor: "bg-green-500/10",

    question: "What conditions help a seed germinate?",

    objective:
      "Explore how water, air and suitable warmth help seeds begin to grow.",

    materials: [
      "Bean seeds",
      "Cotton wool",
      "Small containers",
      "Water",
    ],

    prediction: {
      question: "What is likely to happen to a dry seed?",
      options: [
        "It may not begin germinating.",
        "It will immediately become a tree.",
        "It will turn into an animal.",
      ],
      answer: 0,
    },

    steps: [
      "Place cotton wool inside two containers.",
      "Place a seed in each container.",
      "Add water to one container.",
      "Leave the other container dry.",
      "Observe both containers over several days.",
    ],

    observation: {
      question: "Which seed is more likely to begin germinating?",
      options: [
        "The seed with suitable moisture.",
        "The completely dry seed.",
        "Neither seed can ever grow.",
      ],
      answer: 0,
    },

    challenge: {
      question: "What should you investigate next?",
      options: [
        "The effect of temperature or light.",
        "The name of the container.",
        "The colour of the table.",
      ],
      answer: 0,
    },

    explanation:
      "Seeds need suitable conditions, including moisture, air and an appropriate temperature, to germinate.",

    conclusion:
      "Seeds need suitable conditions before they can begin growing.",

    keyLearning: [
      "Seeds can germinate and develop into plants.",
      "Water is important for germination.",
      "Scientists can change one condition to investigate its effect.",
    ],
  },

  {
    id: 103,
    title: "Parts of a Plant",
    description:
      "Explore the main parts of a flowering plant and their jobs.",
    level: 2,
    difficulty: "Easy",
    skill: "Plants",
    iconName: "Flower2",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",

    question: "What jobs do different plant parts perform?",

    objective:
      "Identify roots, stems, leaves and flowers and understand their basic functions.",

    materials: [
      "A small plant",
      "Plant diagram",
      "Magnifying glass",
    ],

    prediction: {
      question: "Which part usually takes in water from the soil?",
      options: ["Roots", "Flowers", "Leaves"],
      answer: 0,
    },

    steps: [
      "Look at the whole plant.",
      "Find the roots.",
      "Find the stem.",
      "Find the leaves.",
      "Find the flowers if the plant has them.",
    ],

    observation: {
      question: "Which part helps transport water through the plant?",
      options: ["Stem", "Flower", "Seed"],
      answer: 0,
    },

    challenge: {
      question: "Why are leaves important?",
      options: [
        "They help the plant make food.",
        "They turn into rocks.",
        "They make the roots disappear.",
      ],
      answer: 0,
    },

    explanation:
      "Roots absorb water and minerals, stems support the plant and transport materials, and leaves help the plant make food using light.",

    conclusion:
      "Different parts of a plant have different jobs that help the plant survive.",

    keyLearning: [
      "Roots absorb water and minerals.",
      "Stems support plants and transport materials.",
      "Leaves help plants make food.",
    ],
  },

  {
    id: 104,
    title: "Plants and Light",
    description:
      "Explore why light is important to green plants.",
    level: 2,
    difficulty: "Easy",
    skill: "Plants",
    iconName: "Sun",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",

    question: "Why is light important to plants?",

    objective:
      "Discover that plants use light as part of the process of making food.",

    materials: [
      "Two similar plants",
      "Water",
      "A sunny location",
      "A darker location",
    ],

    prediction: {
      question: "What may happen to a plant kept without enough light?",
      options: [
        "Its growth may be affected.",
        "It will become a rock.",
        "It will never change at all.",
      ],
      answer: 0,
    },

    steps: [
      "Choose two similar plants.",
      "Give both plants suitable water.",
      "Place one where it receives light.",
      "Place the other where it receives much less light.",
      "Observe their growth over time.",
    ],

    observation: {
      question: "What variable were you investigating?",
      options: ["Light", "The plant's name", "The container's label"],
      answer: 0,
    },

    challenge: {
      question: "Why should both plants receive similar amounts of water?",
      options: [
        "To make the comparison fairer.",
        "To make the plants identical.",
        "Because water is not important.",
      ],
      answer: 0,
    },

    explanation:
      "Green plants use light to help make food. Changing the amount of light can affect plant growth.",

    conclusion:
      "Light is an important factor in the growth and life of green plants.",

    keyLearning: [
      "Plants need suitable light.",
      "Green plants use light when making food.",
      "Fair tests try to control other variables.",
    ],
  },

  {
    id: 105,
    title: "Animal Groups",
    description:
      "Learn how scientists classify animals using observable features.",
    level: 3,
    difficulty: "Easy",
    skill: "Animals",
    iconName: "Bug",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",

    question: "How can animals be grouped?",

    objective:
      "Use observable characteristics to classify animals into groups.",

    materials: [
      "Animal pictures",
      "Classification cards",
    ],

    prediction: {
      question: "Which animal is a mammal?",
      options: ["Cat", "Fish", "Butterfly"],
      answer: 0,
    },

    steps: [
      "Look at each animal.",
      "Observe its body covering.",
      "Look at how it moves.",
      "Look for features shared with other animals.",
      "Group animals with similar characteristics.",
    ],

    observation: {
      question: "Which feature is useful when classifying animals?",
      options: ["Observable characteristics", "Their favourite food only", "Their names"],
      answer: 0,
    },

    challenge: {
      question: "Which pair belongs to the same broad animal group?",
      options: ["Cat and dog", "Fish and butterfly", "Snake and whale"],
      answer: 0,
    },

    explanation:
      "Scientists classify animals by comparing characteristics such as body structures, coverings and ways of reproducing.",

    conclusion:
      "Classification helps scientists organize and compare living things.",

    keyLearning: [
      "Animals can be grouped by shared characteristics.",
      "Classification helps organize scientific knowledge.",
      "Scientists use evidence they can observe.",
    ],
  },

  {
    id: 106,
    title: "Our Five Senses",
    description:
      "Investigate how our senses help us learn about the world.",
    level: 3,
    difficulty: "Easy",
    skill: "Human Body",
    iconName: "Eye",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",

    question: "How do our senses help us investigate our surroundings?",

    objective:
      "Explore sight, hearing, smell, taste and touch as ways of receiving information.",

    materials: [
      "Safe textured objects",
      "Sound source",
      "Picture cards",
    ],

    prediction: {
      question: "Which sense helps you notice a sound?",
      options: ["Hearing", "Sight", "Touch"],
      answer: 0,
    },

    steps: [
      "Look at an object.",
      "Listen to a safe sound.",
      "Touch a safe textured object.",
      "Notice a safe smell with adult guidance.",
      "Discuss which sense provided each piece of information.",
    ],

    observation: {
      question: "Which organ is mainly used for hearing?",
      options: ["Ears", "Eyes", "Skin"],
      answer: 0,
    },

    challenge: {
      question: "Why do scientists use their senses during observations?",
      options: [
        "Senses provide information about what is happening.",
        "Senses always give perfect measurements.",
        "Senses replace every scientific instrument.",
      ],
      answer: 0,
    },

    explanation:
      "Our senses provide information about our surroundings. Scientific instruments can provide additional and more precise measurements.",

    conclusion:
      "Observation begins with noticing and describing what happens around us.",

    keyLearning: [
      "We have five main senses.",
      "Different senses provide different information.",
      "Scientific instruments can extend our ability to measure.",
    ],
  },

  {
    id: 107,
    title: "Animal Habitats",
    description:
      "Discover how animals are suited to the places where they live.",
    level: 4,
    difficulty: "Medium",
    skill: "Habitats",
    iconName: "Bird",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",

    question: "Why do different animals live in different habitats?",

    objective:
      "Understand that habitats provide organisms with resources and conditions needed for survival.",

    materials: [
      "Habitat pictures",
      "Animal cards",
    ],

    prediction: {
      question: "Where would a fish be best suited to live?",
      options: ["Water", "Dry desert sand", "A tall building"],
      answer: 0,
    },

    steps: [
      "Choose an animal.",
      "Identify its habitat.",
      "Look for food and water sources.",
      "Look for shelter.",
      "Consider how its body helps it survive there.",
    ],

    observation: {
      question: "What does a habitat provide?",
      options: [
        "Resources and suitable conditions for life.",
        "Only sunlight.",
        "Only shelter.",
      ],
      answer: 0,
    },

    challenge: {
      question: "What could happen if an animal loses an important part of its habitat?",
      options: [
        "Its survival may become more difficult.",
        "Nothing could ever change.",
        "It would automatically become a different species.",
      ],
      answer: 0,
    },

    explanation:
      "Habitats provide organisms with resources and conditions such as food, water, shelter and suitable environmental conditions.",

    conclusion:
      "Living things depend on their habitats for survival.",

    keyLearning: [
      "Habitats provide resources.",
      "Animals have features that help them survive.",
      "Changes to habitats can affect living things.",
    ],
  },

  {
    id: 108,
    title: "Food Chains",
    description:
      "Explore how energy and food relationships connect living things.",
    level: 5,
    difficulty: "Medium",
    skill: "Ecosystems",
    iconName: "Apple",
    color: "text-red-400",
    bgColor: "bg-red-500/10",

    question: "How are living things connected through food?",

    objective:
      "Build a simple food chain and identify producers and consumers.",

    materials: [
      "Plant cards",
      "Animal cards",
      "Arrow cards",
    ],

    prediction: {
      question: "Which usually begins a simple food chain?",
      options: ["A plant", "A lion", "A mushroom"],
      answer: 0,
    },

    steps: [
      "Choose a green plant.",
      "Find an animal that eats the plant.",
      "Find an animal that may eat that animal.",
      "Arrange them in order.",
      "Use arrows to show the feeding relationship.",
    ],

    observation: {
      question: "What does the arrow in a food chain represent?",
      options: [
        "The direction of energy transfer through feeding.",
        "The direction an animal walks.",
        "The size of an animal.",
      ],
      answer: 0,
    },

    challenge: {
      question: "What could happen if a producer disappeared from a food chain?",
      options: [
        "Consumers depending on it could be affected.",
        "Every animal would grow immediately.",
        "Nothing could change.",
      ],
      answer: 0,
    },

    explanation:
      "Food chains show feeding relationships. Energy enters most ecosystems through producers such as green plants.",

    conclusion:
      "Living things in ecosystems are connected through feeding relationships.",

    keyLearning: [
      "Plants are important producers.",
      "Animals can be consumers.",
      "Changes to one part of a food chain can affect other organisms.",
    ],
  },

  {
    id: 109,
    title: "Life Cycles",
    description:
      "Explore how living things change as they grow and develop.",
    level: 6,
    difficulty: "Medium",
    skill: "Life Processes",
    iconName: "Activity",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",

    question: "How do living things change during their life cycles?",

    objective:
      "Compare stages in the life cycles of plants and animals.",

    materials: [
      "Life cycle cards",
      "Plant growth pictures",
      "Butterfly life cycle pictures",
    ],

    prediction: {
      question: "What usually happens after a seed germinates?",
      options: [
        "The plant continues to grow.",
        "It becomes a stone.",
        "It disappears permanently.",
      ],
      answer: 0,
    },

    steps: [
      "Arrange the stages of a plant life cycle.",
      "Arrange the stages of a butterfly life cycle.",
      "Compare the two sequences.",
      "Identify changes that occur as organisms develop.",
    ],

    observation: {
      question: "What do life cycles show?",
      options: [
        "How organisms change and reproduce over time.",
        "Only the colour of an organism.",
        "Only where an organism lives.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Which sequence represents a plant life cycle?",
      options: [
        "Seed → seedling → mature plant → flowers/seeds",
        "Adult → rock → seed",
        "Flower → car → seed",
      ],
      answer: 0,
    },

    explanation:
      "Living things pass through stages of growth and development. Different organisms have different life cycles.",

    conclusion:
      "Life cycles help us describe how organisms grow, develop and reproduce.",

    keyLearning: [
      "Living things change as they grow.",
      "Different organisms have different life cycles.",
      "Life cycles include growth and reproduction.",
    ],
  },

  {
    id: 110,
    title: "Ecosystem Detective",
    description:
      "Investigate how plants, animals and the environment interact.",
    level: 7,
    difficulty: "Hard",
    skill: "Ecosystems",
    iconName: "Globe",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",

    question: "How do living and non-living parts of an ecosystem interact?",

    objective:
      "Explore relationships between organisms and environmental factors.",

    materials: [
      "Ecosystem picture",
      "Organism cards",
      "Environment cards",
    ],

    prediction: {
      question: "What could affect organisms in a habitat?",
      options: [
        "Food, water, temperature and shelter",
        "Only their names",
        "Nothing in their environment",
      ],
      answer: 0,
    },

    steps: [
      "Identify living things in the ecosystem.",
      "Identify non-living factors.",
      "Find feeding relationships.",
      "Identify resources organisms need.",
      "Predict what could happen if one factor changes.",
    ],

    observation: {
      question: "Which is a non-living environmental factor?",
      options: ["Temperature", "Rabbit", "Tree"],
      answer: 0,
    },

    challenge: {
      question: "If water becomes scarce, which organisms might be affected?",
      options: [
        "Many organisms in the ecosystem.",
        "Only rocks.",
        "No organisms.",
      ],
      answer: 0,
    },

    explanation:
      "Ecosystems contain living organisms and non-living environmental factors. These parts interact in many ways.",

    conclusion:
      "Ecosystems are interconnected systems in which organisms depend on resources and environmental conditions.",

    keyLearning: [
      "Ecosystems contain living and non-living components.",
      "Organisms depend on environmental resources.",
      "A change can affect connected parts of an ecosystem.",
    ],
  },
];

/* =========================================================
   PHYSICS
   ========================================================= */

export const PHYSICS_EXPERIMENTS: Experiment[] = [
  {
    id: 201,
    title: "Push and Pull",
    description:
      "Discover how pushes and pulls can change the movement of objects.",
    level: 1,
    difficulty: "Easy",
    skill: "Forces",
    iconName: "ArrowRight",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",

    question: "What happens when we push or pull an object?",

    objective:
      "Explore how forces can start, stop or change the movement of objects.",

    materials: ["Toy car", "Ball", "Small box"],

    prediction: {
      question: "What happens when you push a stationary toy car?",
      options: [
        "It may begin moving.",
        "It becomes invisible.",
        "It turns into water.",
      ],
      answer: 0,
    },

    steps: [
      "Place the toy car on a safe flat surface.",
      "Push it gently.",
      "Observe its movement.",
      "Try pushing it in a different direction.",
      "Try stopping it with your hand.",
    ],

    observation: {
      question: "What can a force do?",
      options: [
        "Change an object's motion.",
        "Only change its colour.",
        "Make every object disappear.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Which is an example of a pull?",
      options: ["Opening a drawer", "Kicking a ball", "Pushing a box"],
      answer: 0,
    },

    explanation:
      "A force is a push or pull. Forces can change the movement or direction of objects.",

    conclusion:
      "Pushes and pulls can change how objects move.",

    keyLearning: [
      "Forces can be pushes or pulls.",
      "Forces can change movement.",
      "The direction of a force matters.",
    ],
  },

  {
    id: 202,
    title: "Ramp Racers",
    description:
      "Investigate how a ramp affects the movement of an object.",
    level: 2,
    difficulty: "Easy",
    skill: "Motion",
    iconName: "ArrowRight",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",

    question: "How does the height of a ramp affect movement?",

    objective:
      "Explore how changing the height of a ramp can affect the motion of a rolling object.",

    materials: [
      "Toy car",
      "Ramp",
      "Books",
      "Measuring tape",
    ],

    prediction: {
      question: "What might happen when the ramp becomes steeper?",
      options: [
        "The car may move faster.",
        "The car must become heavier.",
        "The car stops being an object.",
      ],
      answer: 0,
    },

    steps: [
      "Make a gentle ramp.",
      "Place the toy car at the same starting position.",
      "Release it without pushing.",
      "Raise the ramp.",
      "Repeat the test.",
      "Compare the results.",
    ],

    observation: {
      question: "What variable did you change?",
      options: ["Ramp height", "Car colour", "The car's name"],
      answer: 0,
    },

    challenge: {
      question: "Why should you release the car without pushing it?",
      options: [
        "To make the test fairer.",
        "To make the car heavier.",
        "Because cars cannot be pushed.",
      ],
      answer: 0,
    },

    explanation:
      "Changing the slope of a ramp can affect how an object moves. Fair tests control other important variables.",

    conclusion:
      "The conditions of a ramp can affect the movement of a rolling object.",

    keyLearning: [
      "Motion can be investigated experimentally.",
      "Changing one variable helps make comparisons.",
      "Fair tests control important conditions.",
    ],
  },

  {
    id: 203,
    title: "Friction Investigators",
    description:
      "Compare how surfaces affect the movement of an object.",
    level: 3,
    difficulty: "Medium",
    skill: "Forces",
    iconName: "Shield",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",

    question: "Why do objects move differently on different surfaces?",

    objective:
      "Explore friction and how it affects motion.",

    materials: [
      "Toy car",
      "Smooth surface",
      "Fabric",
      "Cardboard",
    ],

    prediction: {
      question: "Which surface is likely to create more friction?",
      options: ["Rough fabric", "Smooth glass", "Very smooth plastic"],
      answer: 0,
    },

    steps: [
      "Place the car at the same starting point.",
      "Release it on the smooth surface.",
      "Measure or observe how far it travels.",
      "Repeat on the rougher surface.",
      "Compare the results.",
    ],

    observation: {
      question: "What does greater friction generally do to motion?",
      options: [
        "It makes movement more difficult.",
        "It always makes objects invisible.",
        "It removes gravity.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Where can friction be useful?",
      options: [
        "Walking without slipping",
        "Making everything weightless",
        "Stopping all movement forever",
      ],
      answer: 0,
    },

    explanation:
      "Friction is a force that resists motion between surfaces in contact.",

    conclusion:
      "Different surfaces can produce different amounts of friction.",

    keyLearning: [
      "Friction opposes motion.",
      "Different surfaces can produce different friction.",
      "Friction can be useful as well as inconvenient.",
    ],
  },

  {
    id: 204,
    title: "Magnet Mission",
    description:
      "Investigate which materials are attracted to a magnet.",
    level: 3,
    difficulty: "Easy",
    skill: "Magnetism",
    iconName: "Magnet",
    color: "text-red-400",
    bgColor: "bg-red-500/10",

    question: "Which materials are attracted to magnets?",

    objective:
      "Test different safe objects and identify magnetic materials.",

    materials: [
      "Magnet",
      "Paper clip",
      "Wooden block",
      "Plastic object",
      "Coin",
    ],

    prediction: {
      question: "Which object is most likely to be attracted to a magnet?",
      options: ["Steel paper clip", "Wooden block", "Plastic cup"],
      answer: 0,
    },

    steps: [
      "Place each object on a table.",
      "Bring the magnet near each object.",
      "Do not force the magnet toward the object.",
      "Record which objects are attracted.",
      "Compare your results.",
    ],

    observation: {
      question: "What did you test?",
      options: [
        "Whether different materials are attracted to a magnet.",
        "Whether objects can produce food.",
        "Whether magnets can become plants.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Are all metals automatically magnetic?",
      options: [
        "No. Only some materials are strongly attracted to magnets.",
        "Yes, every metal is magnetic.",
        "Only wooden objects are magnetic.",
      ],
      answer: 0,
    },

    explanation:
      "Magnets strongly attract some materials, including many objects containing iron or steel, but not all metals are magnetic.",

    conclusion:
      "Magnetism depends on the material an object is made from.",

    keyLearning: [
      "Magnets attract some materials.",
      "Not every metal is strongly magnetic.",
      "Scientists test materials rather than assuming.",
    ],
  },

  {
    id: 205,
    title: "Shadow Science",
    description:
      "Discover how light creates shadows.",
    level: 4,
    difficulty: "Medium",
    skill: "Light",
    iconName: "Sun",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",

    question: "How are shadows formed?",

    objective:
      "Investigate what happens when an object blocks light.",

    materials: [
      "Torch",
      "Small object",
      "White wall or paper",
    ],

    prediction: {
      question: "What happens when an opaque object blocks light?",
      options: [
        "A shadow can form.",
        "The light becomes food.",
        "The object disappears.",
      ],
      answer: 0,
    },

    steps: [
      "Turn on the torch.",
      "Place the object between the torch and the wall.",
      "Observe the shadow.",
      "Move the object closer to the torch.",
      "Move it closer to the wall.",
      "Compare the shadow sizes.",
    ],

    observation: {
      question: "What causes the shadow?",
      options: [
        "The object blocks some light.",
        "The wall creates darkness by itself.",
        "The torch produces a solid object.",
      ],
      answer: 0,
    },

    challenge: {
      question: "What could change the size of the shadow?",
      options: [
        "The distance between the light, object and screen.",
        "The object's name.",
        "The day of the week.",
      ],
      answer: 0,
    },

    explanation:
      "A shadow forms when an object blocks light from reaching a surface.",

    conclusion:
      "The position of a light source, object and surface can affect a shadow.",

    keyLearning: [
      "Light travels from a source.",
      "Objects can block light.",
      "Changing positions can change shadows.",
    ],
  },

  {
    id: 206,
    title: "Sound Vibrations",
    description:
      "Investigate how vibrations produce sound.",
    level: 4,
    difficulty: "Medium",
    skill: "Sound",
    iconName: "Waves",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",

    question: "Where does sound come from?",

    objective:
      "Explore the connection between vibration and sound.",

    materials: [
      "Rubber band",
      "Small box",
      "Wooden spoon",
    ],

    prediction: {
      question: "What happens when a stretched rubber band is plucked?",
      options: [
        "It vibrates and can produce sound.",
        "It becomes silent forever.",
        "It turns into light.",
      ],
      answer: 0,
    },

    steps: [
      "Stretch a rubber band safely around a small box.",
      "Pluck the rubber band gently.",
      "Look closely at it.",
      "Listen to the sound.",
      "Try changing the tension carefully.",
    ],

    observation: {
      question: "What can you observe when the rubber band makes sound?",
      options: [
        "It vibrates.",
        "It turns into water.",
        "It stops existing.",
      ],
      answer: 0,
    },

    challenge: {
      question: "What is an important source of sound?",
      options: ["Vibrating objects", "Still objects only", "Shadows"],
      answer: 0,
    },

    explanation:
      "Sound is produced by vibrations. The vibrations travel through a medium to reach our ears.",

    conclusion:
      "Vibrations are closely connected to the production of sound.",

    keyLearning: [
      "Vibrations can produce sound.",
      "Sound travels through materials.",
      "Different vibrations can produce different sounds.",
    ],
  },

  {
    id: 207,
    title: "Floating and Sinking",
    description:
      "Investigate why some objects float while others sink.",
    level: 5,
    difficulty: "Medium",
    skill: "Forces",
    iconName: "Droplets",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",

    question: "Why do some objects float while others sink?",

    objective:
      "Compare objects in water and investigate how material and shape affect floating.",

    materials: [
      "Container of water",
      "Small plastic object",
      "Stone",
      "Wooden object",
      "Metal object",
    ],

    prediction: {
      question: "Which is most likely to float?",
      options: ["A piece of dry wood", "A stone", "A solid metal block"],
      answer: 0,
    },

    steps: [
      "Fill a container with water.",
      "Predict what each object will do.",
      "Place one object in the water at a time.",
      "Observe whether it floats or sinks.",
      "Record your observations.",
    ],

    observation: {
      question: "What are you comparing?",
      options: [
        "How different objects behave in water.",
        "The colour of the water only.",
        "The names of the objects.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Can changing the shape of a material affect whether it floats?",
      options: [
        "Yes. Shape can affect how an object interacts with water.",
        "No object shape ever matters.",
        "Only colour matters.",
      ],
      answer: 0,
    },

    explanation:
      "Whether an object floats or sinks depends on factors including its density, shape and the upward force from the water.",

    conclusion:
      "Floating and sinking can be investigated by comparing objects and their properties.",

    keyLearning: [
      "Objects behave differently in water.",
      "Material and shape can affect floating.",
      "Scientists use observations to compare objects.",
    ],
  },

  {
    id: 208,
    title: "Heat Detective",
    description:
      "Explore how heat can move between objects.",
    level: 6,
    difficulty: "Medium",
    skill: "Heat",
    iconName: "Thermometer",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",

    question: "What happens when objects at different temperatures meet?",

    objective:
      "Understand that thermal energy can transfer from warmer objects to cooler objects.",

    materials: [
      "Warm water",
      "Cool water",
      "Two containers",
      "Thermometer with adult supervision",
    ],

    prediction: {
      question: "What happens when warm and cool water are mixed?",
      options: [
        "The final temperature becomes somewhere between the starting temperatures.",
        "It always becomes boiling.",
        "It turns into a solid immediately.",
      ],
      answer: 0,
    },

    steps: [
      "Prepare warm and cool water safely.",
      "Measure their temperatures if a suitable thermometer is available.",
      "Mix them carefully with adult supervision.",
      "Measure or compare the resulting temperature.",
      "Discuss what changed.",
    ],

    observation: {
      question: "In which direction does thermal energy naturally transfer?",
      options: [
        "From warmer objects toward cooler objects.",
        "Only from cold to hot.",
        "It never transfers.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Why should temperatures be measured rather than guessed?",
      options: [
        "Measurement provides evidence.",
        "Guessing is always more accurate.",
        "Thermometers cannot provide information.",
      ],
      answer: 0,
    },

    explanation:
      "Thermal energy transfers from warmer regions toward cooler regions until temperatures move toward equilibrium.",

    conclusion:
      "Temperature differences can cause thermal energy to transfer.",

    keyLearning: [
      "Temperature tells us how hot or cold something is.",
      "Thermal energy can transfer between objects.",
      "Measurements provide evidence.",
    ],
  },

  {
    id: 209,
    title: "Simple Machines",
    description:
      "Discover how simple machines can make tasks easier.",
    level: 7,
    difficulty: "Hard",
    skill: "Forces",
    iconName: "Building2",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",

    question: "How can simple machines help us do work?",

    objective:
      "Explore levers, ramps and other simple machines as tools that change how forces are applied.",

    materials: [
      "Small ruler",
      "Eraser",
      "Toy block",
      "Ramp",
    ],

    prediction: {
      question: "What can a lever help you do?",
      options: [
        "Move or lift a load using a force.",
        "Make matter disappear.",
        "Remove gravity from Earth.",
      ],
      answer: 0,
    },

    steps: [
      "Place an eraser under a ruler as a pivot.",
      "Place a small object near one end.",
      "Press the other end gently.",
      "Observe how the load moves.",
      "Try changing the position of the pivot.",
    ],

    observation: {
      question: "What is the pivot point of a lever called?",
      options: ["Fulcrum", "Battery", "Lens"],
      answer: 0,
    },

    challenge: {
      question: "Which is an example of a simple machine?",
      options: ["Ramp", "Cloud", "Cup of water"],
      answer: 0,
    },

    explanation:
      "Simple machines such as levers and inclined planes can change the way a force is applied and make tasks easier in useful ways.",

    conclusion:
      "Simple machines help people use forces more effectively.",

    keyLearning: [
      "Levers use a pivot point.",
      "Ramps are inclined planes.",
      "Simple machines change how forces are applied.",
    ],
  },

  {
    id: 210,
    title: "Energy Explorer",
    description:
      "Investigate different forms and transfers of energy.",
    level: 8,
    difficulty: "Hard",
    skill: "Energy",
    iconName: "Zap",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",

    question: "How does energy change from one form to another?",

    objective:
      "Identify examples of energy transfer and transformation in everyday systems.",

    materials: [
      "Torch",
      "Battery-powered toy",
      "Rubber band",
    ],

    prediction: {
      question: "What energy transformation occurs in a battery-powered torch?",
      options: [
        "Chemical energy is transformed into electrical energy and then light.",
        "Light becomes a plant.",
        "Sound becomes water.",
      ],
      answer: 0,
    },

    steps: [
      "Observe a battery-powered torch.",
      "Identify the battery as an energy source.",
      "Turn the torch on.",
      "Observe the light produced.",
      "Think about the sequence of energy changes.",
    ],

    observation: {
      question: "What does the torch produce that you can see?",
      options: ["Light", "Soil", "Food"],
      answer: 0,
    },

    challenge: {
      question: "Why is energy important in physical systems?",
      options: [
        "Energy enables changes and processes to occur.",
        "Energy only exists in food.",
        "Energy cannot move or change form.",
      ],
      answer: 0,
    },

    explanation:
      "Energy can be transferred and transformed between different forms. It is involved in movement, light, sound, heating and many other processes.",

    conclusion:
      "Energy can move between systems and change form.",

    keyLearning: [
      "Energy is involved in physical changes.",
      "Energy can be transferred.",
      "Energy can change from one form to another.",
    ],
  },
];

/* =========================================================
   CHEMISTRY
   ========================================================= */

export const CHEMISTRY_EXPERIMENTS: Experiment[] = [
  {
    id: 301,
    title: "What Is Matter?",
    description:
      "Explore materials around us and identify different forms of matter.",
    level: 1,
    difficulty: "Easy",
    skill: "Matter",
    iconName: "FlaskConical",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",

    question: "What is matter?",

    objective:
      "Recognize that the materials around us are made of matter and that matter can exist in different states.",

    materials: [
      "Cup of water",
      "Ice cube",
      "Small solid object",
    ],

    prediction: {
      question: "Which is a liquid?",
      options: ["Water", "Ice cube", "Stone"],
      answer: 0,
    },

    steps: [
      "Observe the solid object.",
      "Observe the ice.",
      "Observe the water.",
      "Compare their shapes.",
      "Discuss how their properties differ.",
    ],

    observation: {
      question: "Which state of matter takes the shape of its container?",
      options: ["Liquid", "Solid only", "None"],
      answer: 0,
    },

    challenge: {
      question: "Which is a solid?",
      options: ["Ice", "Water vapour", "Liquid water"],
      answer: 0,
    },

    explanation:
      "Matter is the material that makes up physical objects and substances. Common states include solids, liquids and gases.",

    conclusion:
      "Matter can exist in different states with different properties.",

    keyLearning: [
      "Matter makes up physical substances.",
      "Solids, liquids and gases have different properties.",
      "Scientists compare observable properties.",
    ],
  },

  {
    id: 302,
    title: "Solid, Liquid or Gas?",
    description:
      "Classify substances by their state of matter.",
    level: 1,
    difficulty: "Easy",
    skill: "Matter",
    iconName: "Beaker",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",

    question: "How can we identify different states of matter?",

    objective:
      "Compare the shape and volume behaviour of solids, liquids and gases.",

    materials: [
      "Ice",
      "Water",
      "Inflated balloon",
    ],

    prediction: {
      question: "Which state has no fixed shape and can spread through a container?",
      options: ["Gas", "Solid", "Only ice"],
      answer: 0,
    },

    steps: [
      "Observe the ice.",
      "Observe the water.",
      "Observe the air-filled balloon.",
      "Compare their shapes and how they occupy space.",
      "Classify each material.",
    ],

    observation: {
      question: "Which state can spread out to fill its available space?",
      options: ["Gas", "Solid", "Rock only"],
      answer: 0,
    },

    challenge: {
      question: "What happens when ice melts?",
      options: [
        "It changes from solid to liquid.",
        "It changes directly into metal.",
        "It disappears without changing state.",
      ],
      answer: 0,
    },

    explanation:
      "Solids generally keep their shape, liquids take the shape of their container, and gases spread through the available space.",

    conclusion:
      "The states of matter have different observable properties.",

    keyLearning: [
      "Solids have a fixed shape.",
      "Liquids take the shape of their container.",
      "Gases spread through available space.",
    ],
  },

  {
    id: 303,
    title: "Does It Dissolve?",
    description:
      "Investigate which substances dissolve in water.",
    level: 2,
    difficulty: "Easy",
    skill: "Solutions",
    iconName: "Droplets",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",

    question: "Do all substances dissolve in water?",

    objective:
      "Compare substances that dissolve in water with substances that remain visible.",

    materials: [
      "Water",
      "Salt",
      "Sugar",
      "Sand",
      "Transparent cups",
    ],

    prediction: {
      question: "Which substance is likely to dissolve in water?",
      options: ["Sugar", "Sand", "Small stone"],
      answer: 0,
    },

    steps: [
      "Fill separate cups with equal amounts of water.",
      "Add a small amount of each substance.",
      "Stir each cup equally.",
      "Observe what happens.",
      "Compare the results.",
    ],

    observation: {
      question: "What does it mean when a substance dissolves?",
      options: [
        "It spreads through the solvent and forms a solution.",
        "It turns into a solid rock.",
        "It disappears from the universe.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Which mixture is most likely to contain a dissolved substance?",
      options: ["Salt water", "Sand and water", "Pebbles and water"],
      answer: 0,
    },

    explanation:
      "Some substances dissolve in water and form solutions. Others remain as separate particles.",

    conclusion:
      "Different materials have different solubility properties.",

    keyLearning: [
      "Some substances dissolve in water.",
      "A dissolved substance forms part of a solution.",
      "Not everything dissolves in water.",
    ],
  },

  {
    id: 304,
    title: "Mixing Materials",
    description:
      "Explore what happens when different materials are mixed.",
    level: 2,
    difficulty: "Easy",
    skill: "Mixtures",
    iconName: "FlaskConical",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",

    question: "What happens when different materials are mixed?",

    objective:
      "Distinguish between mixtures and single substances using simple observations.",

    materials: [
      "Rice",
      "Beans",
      "Small container",
      "Spoon",
    ],

    prediction: {
      question: "What happens when rice and beans are mixed?",
      options: [
        "They form a mixture that can still contain both materials.",
        "They become a completely new element.",
        "Both materials disappear.",
      ],
      answer: 0,
    },

    steps: [
      "Place rice in a container.",
      "Add beans.",
      "Mix them together.",
      "Observe the mixture.",
      "Try separating the two materials by hand.",
    ],

    observation: {
      question: "Can you still identify the original materials?",
      options: ["Yes", "No, they vanished", "Only with a microscope"],
      answer: 0,
    },

    challenge: {
      question: "Which method could separate rice from beans?",
      options: ["Sorting", "Freezing", "Burning"],
      answer: 0,
    },

    explanation:
      "A mixture contains two or more materials together. In many mixtures, the original materials retain their properties.",

    conclusion:
      "Mixing materials does not always create a new substance.",

    keyLearning: [
      "Mixtures contain different materials together.",
      "Some mixtures can be separated physically.",
      "Scientists choose separation methods based on properties.",
    ],
  },

  {
    id: 305,
    title: "Separate the Mixture",
    description:
      "Discover how physical properties can help us separate materials.",
    level: 3,
    difficulty: "Medium",
    skill: "Materials",
    iconName: "Search",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",

    question: "How can we separate different materials?",

    objective:
      "Select appropriate physical separation methods for simple mixtures.",

    materials: [
      "Rice",
      "Beans",
      "Sand",
      "Water",
      "Filter paper",
    ],

    prediction: {
      question: "How could you separate rice and beans?",
      options: ["Hand sorting", "Melting them", "Turning them into gas"],
      answer: 0,
    },

    steps: [
      "Observe the mixture.",
      "Identify a property that is different between the materials.",
      "Choose a separation method.",
      "Separate the materials.",
      "Check whether the separation worked.",
    ],

    observation: {
      question: "What helps us choose a separation method?",
      options: [
        "Differences in physical properties.",
        "The name of the mixture only.",
        "Guessing randomly.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Which method can separate insoluble solid particles from water?",
      options: ["Filtration", "Drawing", "Shouting"],
      answer: 0,
    },

    explanation:
      "Physical properties such as particle size, solubility and magnetism can help us separate mixtures.",

    conclusion:
      "The properties of materials guide scientists in choosing separation methods.",

    keyLearning: [
      "Mixtures can sometimes be separated physically.",
      "Properties help determine the best method.",
      "Filtration can separate some insoluble solids from liquids.",
    ],
  },

  {
    id: 306,
    title: "Melting and Freezing",
    description:
      "Investigate how temperature can change the state of a substance.",
    level: 3,
    difficulty: "Easy",
    skill: "Changes",
    iconName: "Snowflake",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",

    question: "How can heating and cooling change matter?",

    objective:
      "Explore reversible changes between solid and liquid states.",

    materials: [
      "Ice cubes",
      "Container",
      "Warm location",
      "Freezer with adult supervision",
    ],

    prediction: {
      question: "What happens when ice is warmed?",
      options: [
        "It melts into liquid water.",
        "It becomes a metal.",
        "It becomes a plant.",
      ],
      answer: 0,
    },

    steps: [
      "Observe an ice cube.",
      "Place it somewhere warmer.",
      "Observe the changes over time.",
      "Allow the water to cool safely.",
      "Discuss how the state changed.",
    ],

    observation: {
      question: "What state change happens when ice melts?",
      options: [
        "Solid to liquid",
        "Liquid to solid",
        "Gas to solid",
      ],
      answer: 0,
    },

    challenge: {
      question: "Can liquid water freeze again?",
      options: [
        "Yes, under suitable cooling conditions.",
        "No substance can ever change back.",
        "Only metal can freeze.",
      ],
      answer: 0,
    },

    explanation:
      "Heating can cause a solid to melt into a liquid. Cooling can cause a liquid to freeze into a solid.",

    conclusion:
      "Temperature changes can cause reversible changes of state.",

    keyLearning: [
      "Heating can cause melting.",
      "Cooling can cause freezing.",
      "Some state changes are reversible.",
    ],
  },

  {
    id: 307,
    title: "Evaporation Detective",
    description:
      "Discover what happens when liquid water changes into water vapour.",
    level: 4,
    difficulty: "Medium",
    skill: "Changes",
    iconName: "Sun",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",

    question: "Where does water go when it evaporates?",

    objective:
      "Understand that evaporation changes liquid water into water vapour.",

    materials: [
      "Two shallow containers",
      "Small amount of water",
      "Warm location",
      "Cool location",
    ],

    prediction: {
      question: "Which container may lose water faster?",
      options: [
        "The one in a warmer suitable location.",
        "The sealed empty container.",
        "The container with no water.",
      ],
      answer: 0,
    },

    steps: [
      "Place equal amounts of water in two shallow containers.",
      "Put them in different suitable locations.",
      "Observe the water level over time.",
      "Compare the changes.",
      "Discuss evaporation.",
    ],

    observation: {
      question: "What is evaporation?",
      options: [
        "Liquid changing into gas at the surface.",
        "Gas becoming a solid.",
        "Solid becoming a metal.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Which factor can affect evaporation?",
      options: [
        "Temperature and exposed surface area.",
        "The colour of the label only.",
        "The name of the container.",
      ],
      answer: 0,
    },

    explanation:
      "Evaporation occurs when particles at the surface of a liquid gain enough energy to enter the gas state.",

    conclusion:
      "Liquid water can change into water vapour through evaporation.",

    keyLearning: [
      "Evaporation is a change from liquid to gas.",
      "Temperature can affect evaporation.",
      "Water vapour is water in the gas state.",
    ],
  },

  {
    id: 308,
    title: "Reversible or Irreversible?",
    description:
      "Compare changes that can be reversed with changes that form new substances.",
    level: 5,
    difficulty: "Medium",
    skill: "Changes",
    iconName: "RotateCcw",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",

    question: "Can every change be reversed?",

    objective:
      "Distinguish between simple reversible changes and changes that may produce new substances.",

    materials: [
      "Ice",
      "Paper",
      "Water",
      "Safe classroom examples",
    ],

    prediction: {
      question: "Which change is easily reversible?",
      options: [
        "Ice melting",
        "Paper burning",
        "Food cooking",
      ],
      answer: 0,
    },

    steps: [
      "Observe a reversible change such as melting ice.",
      "Think about whether the original material can be recovered.",
      "Compare this with examples of permanent changes.",
      "Discuss the evidence.",
    ],

    observation: {
      question: "What is a reversible change?",
      options: [
        "A change that can be changed back under suitable conditions.",
        "A change that always creates a new element.",
        "A change that cannot be observed.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Which is generally difficult to reverse to the original materials?",
      options: ["Burning paper", "Melting ice", "Freezing water"],
      answer: 0,
    },

    explanation:
      "Some physical changes can be reversed, while many chemical changes produce new substances and are not easily reversed.",

    conclusion:
      "Scientists compare the evidence from a change to understand whether it is reversible.",

    keyLearning: [
      "Some changes are reversible.",
      "Some changes produce new substances.",
      "Evidence helps scientists classify changes.",
    ],
  },

  {
    id: 309,
    title: "Acids and Bases",
    description:
      "Explore the idea that some substances are acidic or basic using safe indicators.",
    level: 6,
    difficulty: "Hard",
    skill: "Materials",
    iconName: "TestTube2",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",

    question: "How can we identify acidic and basic substances safely?",

    objective:
      "Introduce acids and bases through safe indicator experiments rather than tasting or directly handling unknown substances.",

    materials: [
      "Red cabbage indicator or approved classroom indicator",
      "Safe household samples approved by an adult",
      "Clear cups",
      "Gloves where required",
    ],

    prediction: {
      question: "What can an indicator help us identify?",
      options: [
        "Whether a substance is acidic, basic or near neutral.",
        "Whether an object is alive.",
        "Whether something can fly.",
      ],
      answer: 0,
    },

    steps: [
      "Prepare the indicator according to teacher or adult instructions.",
      "Place small amounts of approved samples in separate containers.",
      "Add the indicator safely.",
      "Observe any colour changes.",
      "Compare the results with the indicator guide.",
    ],

    observation: {
      question: "Why are indicators useful?",
      options: [
        "They can provide evidence about acidity or basicity.",
        "They make every substance safe to taste.",
        "They remove all chemicals.",
      ],
      answer: 0,
    },

    challenge: {
      question: "Should children taste an unknown chemical to identify it?",
      options: [
        "No. Chemicals should never be tasted.",
        "Yes, if it looks safe.",
        "Only if it has no smell.",
      ],
      answer: 0,
    },

    explanation:
      "Indicators can change colour depending on whether a substance is acidic, basic or near neutral. Unknown substances should never be tasted.",

    conclusion:
      "Indicators provide a safer way to investigate acid-base properties.",

    keyLearning: [
      "Acids and bases have different properties.",
      "Indicators can provide evidence about acidity.",
      "Unknown chemicals must never be tasted.",
    ],
  },

  {
    id: 310,
    title: "Design a Fair Chemistry Test",
    description:
      "Use scientific thinking to design and evaluate a simple investigation.",
    level: 8,
    difficulty: "Hard",
    skill: "Scientific Method",
    iconName: "Microscope",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",

    question: "How can scientists make an investigation fair?",

    objective:
      "Bring together prediction, controlled variables, observation, measurement and evidence.",

    materials: [
      "Two identical containers",
      "Water",
      "Two safe materials",
      "Timer",
      "Measuring tools",
    ],

    prediction: {
      question: "What makes a comparison more reliable?",
      options: [
        "Changing one main variable while keeping important conditions similar.",
        "Changing everything at once.",
        "Guessing the result before testing.",
      ],
      answer: 0,
    },

    steps: [
      "Choose one question to investigate.",
      "Make a prediction.",
      "Identify the variable you will change.",
      "Identify important variables to keep the same.",
      "Collect observations or measurements.",
      "Compare the evidence with your prediction.",
    ],

    observation: {
      question: "Why should scientists record results?",
      options: [
        "Results provide evidence that can be examined.",
        "Records make experiments less scientific.",
        "Results are only useful when they are guesses.",
      ],
      answer: 0,
    },

    challenge: {
      question: "What should you do if the result does not match your prediction?",
      options: [
        "Accept the evidence and investigate why.",
        "Change the result to match your prediction.",
        "Ignore the experiment.",
      ],
      answer: 0,
    },

    explanation:
      "Scientific investigations use questions, predictions, controlled variables, observations or measurements, evidence and reflection.",

    conclusion:
      "Good science is not about getting every prediction right. It is about learning from evidence.",

    keyLearning: [
      "Scientists ask questions and make predictions.",
      "Fair tests control important variables.",
      "Evidence can support or challenge a prediction.",
      "Unexpected results can lead to new questions.",
    ],
  },
];