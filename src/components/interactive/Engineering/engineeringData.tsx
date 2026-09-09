// ============================================================
// ENGINEERING & DESIGN CURRICULUM DATA
// ============================================================

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type EngineeringSkill =
  | 'Observation'
  | 'Problem Solving'
  | 'Decomposition'
  | 'Planning'
  | 'Design'
  | 'Design Thinking'
  | 'Structure'
  | 'Structures'
  | 'Stability'
  | 'Balance'
  | 'Materials'
  | 'Pattern Recognition'
  | 'Patterns'
  | 'Sequencing'
  | 'Spatial Reasoning'
  | 'Logic'
  | 'Measurement'
  | 'Constraints'
  | 'Testing'
  | 'Evaluation'
  | 'Iteration'
  | 'Creativity'
  | 'Symmetry'
  | 'Construction'
  | 'Cause and Effect';

export interface LegoChallenge {
  id: number;
  title: string;
  difficulty: Difficulty;
  skill: EngineeringSkill;
  objective: string;
  instructions: string;
  levels: number;

  // LEGO materials and construction pattern
  materials: string[];
  pattern?: string[];

  // Engineering requirements
  constraints: string[];
  successCriteria: string[];
  hint: string;
  learningPoint: string;

  // Visual compatibility with the LEGO builder
  color1: string;
  color2: string;
  color3: string;
}

export interface PuzzleChallenge {
  id: number;
  title: string;
  emoji: string;
  gridSize: number;
  difficulty: Difficulty;
  skill: EngineeringSkill;
  objective: string;
  hint: string;
  learningPoint: string;
  pattern: number[];
}
// ============================================================
// LEGO CHALLENGES
// ============================================================

export const LEGO_CHALLENGES: LegoChallenge[] = [
  // ----------------------------------------------------------
  // FOUNDATION
  // ----------------------------------------------------------

  {
    id: 1,
    title: 'Single Block',
    difficulty: 'Easy',
    skill: 'Observation',
    objective: 'Build a structure using one block.',
    instructions: 'Choose one block and place it carefully.',
    levels: 1,
    materials: ['1 block'],
    constraints: ['Use exactly 1 block'],
    successCriteria: ['One block is placed correctly'],
    hint: 'Start with one simple block.',
    learningPoint: 'Engineers begin by understanding simple building pieces.',
    color1: '#ef4444',
    color2: '#ef4444',
    color3: '#ef4444',
  },

  {
    id: 2,
    title: 'Two Stack',
    difficulty: 'Easy',
    skill: 'Sequencing',
    objective: 'Build a two-block tower.',
    instructions: 'Place one block on top of another.',
    levels: 2,
    materials: ['2 blocks'],
    constraints: ['Use exactly 2 blocks'],
    successCriteria: ['Two blocks form one tower'],
    hint: 'Build from the bottom upward.',
    learningPoint: 'Structures can be created by combining simple parts.',
    color1: '#3b82f6',
    color2: '#3b82f6',
    color3: '#3b82f6',
  },

  {
    id: 3,
    title: 'Three-Level Tower',
    difficulty: 'Easy',
    skill: 'Structure',
    objective: 'Build a three-level tower.',
    instructions: 'Stack three blocks carefully.',
    levels: 3,
    materials: ['3 blocks'],
    constraints: ['Use exactly 3 blocks'],
    successCriteria: ['Tower has 3 levels'],
    hint: 'Keep each block centred.',
    learningPoint: 'Good structures depend on careful placement.',
    color1: '#ef4444',
    color2: '#ef4444',
    color3: '#ef4444',
  },

  {
    id: 4,
    title: 'Colour Sequence',
    difficulty: 'Easy',
    skill: 'Pattern Recognition',
    objective: 'Create a repeating colour pattern.',
    instructions: 'Alternate blue and red blocks.',
    levels: 4,
    materials: ['Red blocks', 'Blue blocks'],
    pattern: ['red', 'blue', 'red', 'blue'],
    constraints: ['Follow the colour sequence'],
    successCriteria: ['The colours alternate correctly'],
    hint: 'What colour comes after blue?',
    learningPoint: 'Patterns help engineers organise information and designs.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#ef4444',
  },

  {
    id: 5,
    title: 'Strong Foundation',
    difficulty: 'Easy',
    skill: 'Stability',
    objective: 'Build a tower with a strong foundation.',
    instructions: 'Place the first blocks carefully before building upward.',
    levels: 4,
    materials: ['4 blocks'],
    constraints: ['Foundation must support the tower'],
    successCriteria: ['Tower remains upright'],
    hint: 'A strong building starts at the bottom.',
    learningPoint: 'Engineers design foundations to support structures.',
    color1: '#3b82f6',
    color2: '#22c55e',
    color3: '#3b82f6',
  },

  // ----------------------------------------------------------
  // PATTERNS & STRUCTURES
  // ----------------------------------------------------------

  {
    id: 6,
    title: 'Red and Blue Rhythm',
    difficulty: 'Easy',
    skill: 'Pattern Recognition',
    objective: 'Build a repeating red-blue pattern.',
    instructions: 'Repeat the same colour sequence.',
    levels: 5,
    materials: ['Red blocks', 'Blue blocks'],
    pattern: ['red', 'blue', 'red', 'blue', 'red'],
    constraints: ['Maintain the pattern'],
    successCriteria: ['Pattern is correct'],
    hint: 'Repeat what you started.',
    learningPoint: 'Repeating patterns are useful in design and construction.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#ef4444',
  },

  {
    id: 7,
    title: 'Three-Colour Pattern',
    difficulty: 'Easy',
    skill: 'Pattern Recognition',
    objective: 'Use three colours in a repeating sequence.',
    instructions: 'Repeat red, blue and green.',
    levels: 6,
    materials: ['Red', 'Blue', 'Green'],
    pattern: ['red', 'blue', 'green', 'red', 'blue', 'green'],
    constraints: ['Repeat the three-colour sequence'],
    successCriteria: ['Sequence is maintained'],
    hint: 'Look for the group of three.',
    learningPoint: 'Complex patterns can be built from smaller repeating units.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  {
    id: 8,
    title: 'Balanced Tower',
    difficulty: 'Easy',
    skill: 'Balance',
    objective: 'Build a tower while keeping every level aligned.',
    instructions: 'Keep each block centred above the one below.',
    levels: 5,
    materials: ['5 blocks'],
    constraints: ['Keep the tower aligned'],
    successCriteria: ['Tower remains balanced'],
    hint: 'Look at the centre of each block.',
    learningPoint: 'Balance is important when engineers build upward.',
    color1: '#22c55e',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  {
    id: 9,
    title: 'Tall Structure',
    difficulty: 'Medium',
    skill: 'Structure',
    objective: 'Build a tall structure using six levels.',
    instructions: 'Build carefully from the foundation upward.',
    levels: 6,
    materials: ['6 blocks'],
    constraints: ['Use no more than 6 blocks'],
    successCriteria: ['Six levels are completed'],
    hint: 'Do not rush the upper levels.',
    learningPoint: 'As structures become taller, stability becomes more important.',
    color1: '#3b82f6',
    color2: '#60a5fa',
    color3: '#3b82f6',
  },

  {
    id: 10,
    title: 'Rainbow Tower',
    difficulty: 'Medium',
    skill: 'Pattern Recognition',
    objective: 'Build a six-level tower using a repeating colour pattern.',
    instructions: 'Repeat the three-colour sequence twice.',
    levels: 6,
    materials: ['Red', 'Yellow', 'Green'],
    pattern: [
      'red',
      'yellow',
      'green',
      'red',
      'yellow',
      'green',
    ],
    constraints: ['Maintain the pattern'],
    successCriteria: ['All six levels follow the sequence'],
    hint: 'Think in groups of three.',
    learningPoint: 'Patterns can guide the construction of larger designs.',
    color1: '#ef4444',
    color2: '#f59e0b',
    color3: '#22c55e',
  },

  // ----------------------------------------------------------
  // DESIGN THINKING
  // ----------------------------------------------------------

  {
    id: 11,
    title: 'Build With a Constraint',
    difficulty: 'Medium',
    skill: 'Design Thinking',
    objective: 'Build a tower using limited materials.',
    instructions: 'Create the tallest structure possible with six blocks.',
    levels: 6,
    materials: ['6 blocks'],
    constraints: [
      'Use exactly 6 blocks',
      'No extra blocks',
    ],
    successCriteria: [
      'All 6 blocks are used',
      'Tower is upright',
    ],
    hint: 'Plan before placing your first block.',
    learningPoint: 'Engineers often have limited materials and must design within constraints.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  {
    id: 12,
    title: 'Symmetry Challenge',
    difficulty: 'Medium',
    skill: 'Symmetry',
    objective: 'Create a structure with matching sides.',
    instructions: 'Build the left and right sides so they match.',
    levels: 6,
    materials: ['6 blocks'],
    constraints: ['Both sides must match'],
    successCriteria: ['Design is symmetrical'],
    hint: 'Compare the left side with the right side.',
    learningPoint: 'Symmetry is used in architecture, engineering and design.',
    color1: '#a855f7',
    color2: '#c084fc',
    color3: '#a855f7',
  },

  {
    id: 13,
    title: 'Stable Tower',
    difficulty: 'Medium',
    skill: 'Stability',
    objective: 'Build a stable tower at least six levels high.',
    instructions: 'Think carefully about the foundation before adding height.',
    levels: 6,
    materials: ['6 blocks'],
    constraints: [
      'At least 6 levels',
      'Tower must remain upright',
    ],
    successCriteria: [
      'Tower reaches 6 levels',
      'Foundation is stable',
    ],
    hint: 'Tall does not always mean stable.',
    learningPoint: 'Engineers must balance height with stability.',
    color1: '#22c55e',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  {
    id: 14,
    title: 'Engineering Pattern',
    difficulty: 'Medium',
    skill: 'Planning',
    objective: 'Follow a predefined construction sequence.',
    instructions: 'Study the required pattern before building.',
    levels: 7,
    materials: ['Mixed blocks'],
    constraints: ['Follow the sequence'],
    successCriteria: ['All levels follow the design'],
    hint: 'Plan the whole tower before starting.',
    learningPoint: 'Engineers often create plans before construction begins.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  {
    id: 15,
    title: 'Tower Architect',
    difficulty: 'Medium',
    skill: 'Problem Solving',
    objective: 'Design a tower that satisfies several requirements.',
    instructions: 'Build at least seven levels and include three colours.',
    levels: 7,
    materials: ['Red', 'Blue', 'Green'],
    constraints: [
      'At least 7 levels',
      'Use 3 colours',
    ],
    successCriteria: [
      'Tower reaches 7 levels',
      'All 3 colours are used',
    ],
    hint: 'Think about the requirements before building.',
    learningPoint: 'Engineering problems often have multiple requirements.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  // ----------------------------------------------------------
  // ADVANCED
  // ----------------------------------------------------------

  {
    id: 16,
    title: 'Precision Tower',
    difficulty: 'Hard',
    skill: 'Planning',
    objective: 'Construct an eight-level tower following a precise sequence.',
    instructions: 'Follow the colour sequence exactly.',
    levels: 8,
    materials: ['Red', 'Blue', 'Green'],
    constraints: [
      'Exactly 8 levels',
      'Follow the sequence',
    ],
    successCriteria: [
      '8 levels completed',
      'Sequence is correct',
    ],
    hint: 'Plan the sequence before building.',
    learningPoint: 'Precision is important when constructing complex designs.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  {
    id: 17,
    title: 'Stable High-Rise',
    difficulty: 'Hard',
    skill: 'Stability',
    objective: 'Build a tall structure without losing balance.',
    instructions: 'Build eight levels while keeping the structure aligned.',
    levels: 8,
    materials: ['8 blocks'],
    constraints: [
      '8 levels',
      'Stable foundation',
    ],
    successCriteria: [
      'Tower remains upright',
      'All levels are completed',
    ],
    hint: 'A strong foundation supports everything above it.',
    learningPoint: 'Structural engineers carefully consider stability in tall buildings.',
    color1: '#3b82f6',
    color2: '#60a5fa',
    color3: '#93c5fd',
  },

  {
    id: 18,
    title: 'Colour Architecture',
    difficulty: 'Hard',
    skill: 'Design Thinking',
    objective: 'Create a complex architectural pattern.',
    instructions: 'Use three colours while maintaining a repeating design.',
    levels: 8,
    materials: ['Red', 'Blue', 'Green'],
    constraints: [
      '8 levels',
      '3 colours',
      'Repeating pattern',
    ],
    successCriteria: [
      'Pattern is maintained',
      'All colours are used',
    ],
    hint: 'Find the smallest repeating pattern.',
    learningPoint: 'Designers use repeated patterns to create organised structures.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  // ----------------------------------------------------------
  // OPEN-ENDED ENGINEERING
  // ----------------------------------------------------------

  {
    id: 19,
    title: 'Design Challenge',
    difficulty: 'Hard',
    skill: 'Problem Solving',
    objective: 'Create your own tall structure using the available materials.',
    instructions: 'Plan, build and test your design.',
    levels: 8,
    materials: ['Mixed blocks'],
    constraints: [
      'At least 8 levels',
      'Use multiple colours',
    ],
    successCriteria: [
      'Structure is complete',
      'Structure remains upright',
    ],
    hint: 'There can be more than one good solution.',
    learningPoint: 'Engineering allows different solutions to the same problem.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },

  {
    id: 20,
    title: 'The Master Tower',
    difficulty: 'Hard',
    skill: 'Iteration',
    objective: 'Design, test and improve a complex tower.',
    instructions: 'Build your tower, test it, identify weaknesses and improve it.',
    levels: 8,
    materials: ['Mixed blocks'],
    constraints: [
      'At least 8 levels',
      'Must be stable',
      'Use at least 3 colours',
    ],
    successCriteria: [
      'Tower reaches required height',
      'Tower remains stable',
      'Design satisfies all constraints',
    ],
    hint: 'Engineers improve designs after testing them.',
    learningPoint: 'The engineering process is build, test, learn and improve.',
    color1: '#ef4444',
    color2: '#3b82f6',
    color3: '#22c55e',
  },
];

// ============================================================
// PUZZLE PATTERN HELPERS
// ============================================================

const puzzle = (
  id: number,
  title: string,
  emoji: string,
  gridSize: number,
  difficulty: Difficulty,
  skill: EngineeringSkill,
  pattern: number[],
  objective: string,
  hint: string,
  learningPoint: string
): PuzzleChallenge => ({
  id,
  title,
  emoji,
  gridSize,
  difficulty,
  skill,
  pattern,
  objective,
  hint,
  learningPoint,
});

// ============================================================
// 50 SPATIAL REASONING PUZZLES
// ============================================================

export const PUZZLE_CHALLENGES: PuzzleChallenge[] = [
  // FOUNDATION — 2x2
  puzzle(
    1,
    'Corner',
    '🟥',
    2,
    'Easy',
    'Spatial Reasoning',
    [1, 0, 0, 0],
    'Place the piece in the correct corner.',
    'Look at the top-left corner.',
    'You practised understanding position.'
  ),

  puzzle(
    2,
    'Opposite Corner',
    '🟦',
    2,
    'Easy',
    'Spatial Reasoning',
    [0, 0, 0, 1],
    'Find the opposite corner.',
    'Look at the bottom-right.',
    'Objects can be described by their position.'
  ),

  puzzle(
    3,
    'Two Together',
    '🟩',
    2,
    'Easy',
    'Pattern Recognition',
    [1, 1, 0, 0],
    'Build the two-piece row.',
    'Look across the top.',
    'Patterns can be represented visually.'
  ),

  puzzle(
    4,
    'Two Below',
    '🟨',
    2,
    'Easy',
    'Spatial Reasoning',
    [0, 0, 1, 1],
    'Build the bottom row.',
    'Look below the empty row.',
    'Position changes meaning.'
  ),

  // FOUNDATION — 3x3
  puzzle(
    5,
    'Centre',
    '😊',
    3,
    'Easy',
    'Spatial Reasoning',
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    'Place the piece in the centre.',
    'Find the middle square.',
    'You practised locating the centre.'
  ),

  puzzle(
    6,
    'Top Line',
    '☀️',
    3,
    'Easy',
    'Pattern Recognition',
    [1, 1, 1, 0, 0, 0, 0, 0, 0],
    'Rebuild the top line.',
    'Look across the first row.',
    'Rows create visual patterns.'
  ),

  puzzle(
    7,
    'L Shape',
    '❤️',
    3,
    'Easy',
    'Spatial Reasoning',
    [1, 0, 0, 1, 0, 0, 1, 1, 1],
    'Rebuild the L shape.',
    'Look for the vertical line and bottom line.',
    'Shapes can be broken into smaller parts.'
  ),

  puzzle(
    8,
    'Cross',
    '⭐',
    3,
    'Easy',
    'Pattern Recognition',
    [0, 1, 0, 1, 1, 1, 0, 1, 0],
    'Rebuild the cross.',
    'Find the centre first.',
    'You can construct a large shape from simple positions.'
  ),

  puzzle(
    9,
    'Top Corners',
    '🐱',
    3,
    'Easy',
    'Spatial Reasoning',
    [1, 0, 1, 0, 0, 0, 0, 0, 0],
    'Place pieces in both top corners.',
    'Check the two ends of the top row.',
    'Spatial relationships help us describe objects.'
  ),

  puzzle(
    10,
    'Bottom Corners',
    '🐶',
    3,
    'Easy',
    'Spatial Reasoning',
    [0, 0, 0, 0, 0, 0, 1, 0, 1],
    'Place pieces in the bottom corners.',
    'Look at the lowest row.',
    'You practised comparing positions.'
  ),

  // MEDIUM — 3x3
  puzzle(
    11,
    'Square Frame',
    '🍎',
    3,
    'Medium',
    'Pattern Recognition',
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    'Rebuild the square frame.',
    'The outside is filled while the centre is empty.',
    'Shapes can contain spaces and boundaries.'
  ),

  puzzle(
    12,
    'Diagonal',
    '🍌',
    3,
    'Medium',
    'Spatial Reasoning',
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    'Rebuild the diagonal.',
    'Start at one corner and move diagonally.',
    'Diagonal relationships are important in geometry and design.'
  ),

  puzzle(
    13,
    'Reverse Diagonal',
    '🍇',
    3,
    'Medium',
    'Spatial Reasoning',
    [0, 0, 1, 0, 1, 0, 1, 0, 0],
    'Build the opposite diagonal.',
    'Start at the top-right corner.',
    'You can recognise direction and orientation.'
  ),

  puzzle(
    14,
    'T Shape',
    '🚂',
    4,
    'Medium',
    'Spatial Reasoning',
    [1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    'Rebuild the T shape.',
    'Start with the top row.',
    'Complex shapes can be decomposed into simpler sections.'
  ),

  puzzle(
    15,
    'Arrow',
    '✈️',
    4,
    'Medium',
    'Spatial Reasoning',
    [0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    'Rebuild the arrow.',
    'Find the point first.',
    'Spatial reasoning helps us understand direction.'
  ),

  puzzle(
    16,
    'House',
    '🏠',
    4,
    'Medium',
    'Pattern Recognition',
    [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    'Rebuild the house shape.',
    'Look for the roof and walls.',
    'Large designs can be understood as smaller shapes.'
  ),

  puzzle(
    17,
    'Butterfly',
    '🦋',
    4,
    'Medium',
    'Symmetry',
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    'Rebuild the symmetrical butterfly.',
    'Compare the left and right sides.',
    'Symmetry is common in nature and design.'
  ),

  puzzle(
    18,
    'Flower',
    '🌸',
    4,
    'Medium',
    'Symmetry',
    [0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    'Rebuild the flower pattern.',
    'Find the centre and build around it.',
    'Symmetrical structures can be built around a centre.'
  ),

  puzzle(
    19,
    'Staircase',
    '🟪',
    4,
    'Medium',
    'Sequencing',
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    'Rebuild the staircase.',
    'Each row becomes longer.',
    'Sequences can describe how a structure changes.'
  ),

  puzzle(
    20,
    'Diamond',
    '💎',
    4,
    'Medium',
    'Symmetry',
    [0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0],
    'Rebuild the diamond.',
    'Look for matching sides.',
    'Symmetry helps us recognise shapes.'
  ),

  // HARD — 5x5
  puzzle(
    21,
    'Large Cross',
    '➕',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    'Build the large cross.',
    'Find the middle row and middle column.',
    'Two simple lines can form a complex shape.'
  ),

  puzzle(
    22,
    'Large Diamond',
    '💠',
    5,
    'Hard',
    'Symmetry',
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
    'Rebuild the diamond.',
    'Work from the centre outward.',
    'Complex symmetrical designs can be constructed systematically.'
  ),

  puzzle(
    23,
    'Arrow Up',
    '⬆️',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    'Build an arrow pointing upward.',
    'Start with the arrowhead.',
    'Shapes can communicate direction.'
  ),

  puzzle(
    24,
    'Arrow Right',
    '➡️',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0],
    'Build an arrow pointing right.',
    'Look for the point on the right.',
    'Orientation changes the meaning of a shape.'
  ),

  puzzle(
    25,
    'Symmetry Challenge',
    '🦋',
    5,
    'Hard',
    'Symmetry',
    [1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
    'Rebuild the symmetrical design.',
    'Build one side, then mirror it.',
    'Symmetry requires relationships between matching positions.'
  ),

  // MORE ADVANCED PATTERNS
  puzzle(
    26,
    'Checkerboard',
    '⬛',
    5,
    'Hard',
    'Pattern Recognition',
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    'Rebuild the checkerboard pattern.',
    'Every neighbouring square alternates.',
    'Alternating patterns are an important form of sequence.'
  ),

  puzzle(
    27,
    'Border',
    '🟩',
    5,
    'Hard',
    'Pattern Recognition',
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    'Build the outer border.',
    'Fill the edges but leave the centre empty.',
    'Boundaries are important in structures and design.'
  ),

  puzzle(
    28,
    'Four Corners',
    '🔷',
    5,
    'Hard',
    'Spatial Reasoning',
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    'Place pieces in the four corners.',
    'Check every corner.',
    'Location can be described using relationships.'
  ),

  puzzle(
    29,
    'Plus and Centre',
    '✚',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    'Rebuild the complete plus pattern.',
    'Find the centre first.',
    'Decomposition makes complicated patterns easier.'
  ),

  puzzle(
    30,
    'Frame and Centre',
    '🟨',
    5,
    'Hard',
    'Pattern Recognition',
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    'Build the frame and centre pattern.',
    'Compare the outer and inner shapes.',
    'Patterns can contain multiple layers.'
  ),

  // 31–50: ADVANCED DESIGN PATTERNS
  puzzle(
    31,
    'Rocket',
    '🚀',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    'Rebuild the rocket shape.',
    'Start at the nose and work downward.',
    'Large visual objects can be represented using simple cells.'
  ),

  puzzle(
    32,
    'Tree',
    '🌳',
    5,
    'Hard',
    'Decomposition',
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
    'Rebuild the tree.',
    'Separate the leaves from the trunk.',
    'Decomposition means breaking a problem into smaller parts.'
  ),

  puzzle(
    33,
    'House',
    '🏠',
    5,
    'Hard',
    'Decomposition',
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    'Rebuild the house.',
    'Think about roof, walls and base separately.',
    'Complex designs can be divided into components.'
  ),

  puzzle(
    34,
    'Castle',
    '🏰',
    5,
    'Hard',
    'Planning',
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    'Rebuild the castle.',
    'Look for the towers first.',
    'Planning helps organise complex construction.'
  ),

  puzzle(
    35,
    'Bridge',
    '🌉',
    5,
    'Hard',
    'Structure',
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    'Rebuild the bridge.',
    'Find the two supports first.',
    'Structures often depend on supports and connections.'
  ),

  puzzle(
    36,
    'Boat',
    '⛵',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    'Rebuild the boat.',
    'Find the sail and hull separately.',
    'Objects can be represented as combinations of shapes.'
  ),

  puzzle(
    37,
    'Fish',
    '🐟',
    5,
    'Hard',
    'Symmetry',
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0],
    'Rebuild the fish.',
    'Compare the upper and lower parts.',
    'Symmetry and proportion help us recognise forms.'
  ),

  puzzle(
    38,
    'Butterfly Wings',
    '🦋',
    5,
    'Hard',
    'Symmetry',
    [1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
    'Build matching butterfly wings.',
    'Build one side and mirror it.',
    'Symmetry helps designers create balanced forms.'
  ),

  puzzle(
    39,
    'Mountain',
    '⛰️',
    5,
    'Hard',
    'Pattern Recognition',
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    'Rebuild the mountain.',
    'The shape grows wider toward the bottom.',
    'Patterns can describe growth and structure.'
  ),

  puzzle(
    40,
    'Wave',
    '🌊',
    5,
    'Hard',
    'Pattern Recognition',
    [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    'Rebuild the wave pattern.',
    'Look for the repeated diagonal movement.',
    'Repeated movement can create visual patterns.'
  ),

  puzzle(
    41,
    'Planet',
    '🪐',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0],
    'Rebuild the planet and ring.',
    'Separate the planet from its ring.',
    'Objects can contain overlapping visual structures.'
  ),

  puzzle(
    42,
    'Spider',
    '🕷️',
    5,
    'Hard',
    'Symmetry',
    [1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    'Rebuild the spider.',
    'Check that both sides match.',
    'Symmetry appears frequently in living things.'
  ),

  puzzle(
    43,
    'Owl',
    '🦉',
    5,
    'Hard',
    'Symmetry',
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    'Rebuild the owl.',
    'Use the centre line to compare both sides.',
    'Symmetry helps us recognise faces and bodies.'
  ),

  puzzle(
    44,
    'Rocket Launch',
    '🚀',
    5,
    'Hard',
    'Sequencing',
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    'Rebuild the rocket launch design.',
    'Work from top to bottom.',
    'Sequences help us organise multi-step tasks.'
  ),

  puzzle(
    45,
    'Sun',
    '☀️',
    5,
    'Hard',
    'Symmetry',
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0],
    'Rebuild the sun.',
    'Look for matching rays.',
    'Symmetrical repetition creates balanced designs.'
  ),

  puzzle(
    46,
    'Map Pattern',
    '🗺️',
    5,
    'Hard',
    'Spatial Reasoning',
    [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
    'Rebuild the map-like pattern.',
    'Compare neighbouring regions.',
    'Maps represent spaces and relationships visually.'
  ),

  puzzle(
    47,
    'City',
    '🌆',
    5,
    'Hard',
    'Planning',
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    'Rebuild the city skyline.',
    'Look at the height of each building.',
    'Designs can represent real-world environments.'
  ),

  puzzle(
    48,
    'Volcano',
    '🌋',
    5,
    'Hard',
    'Decomposition',
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    'Rebuild the volcano.',
    'Start with the peak and expand downward.',
    'Large forms can be constructed from layers.'
  ),

  puzzle(
    49,
    'World',
    '🌍',
    5,
    'Hard',
    'Spatial Reasoning',
    [0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
    'Rebuild the world shape.',
    'Think about the outside boundary first.',
    'Spatial models help us represent the world around us.'
  ),

  puzzle(
    50,
    'Master Pattern',
    '⭐',
    5,
    'Hard',
    'Problem Solving',
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    'Complete the final master pattern.',
    'Break the design into rows and solve one section at a time.',
    'Complex problems become easier when we break them into smaller problems.',
  ),
];