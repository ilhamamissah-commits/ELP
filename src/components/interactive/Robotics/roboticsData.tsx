export interface RobotPart {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  type: 'sensor' | 'motor' | 'brain' | 'body';
}

export interface SequenceChallenge {
  id: number;
  level: 1 | 2 | 3;
  title: string;
  targetSequence: string[]; // e.g., ['Forward', 'Forward', 'TurnLeft']
  emoji: string;
  description: string;
}

// --- 50 Robot Parts ---
export const ROBOT_PARTS: RobotPart[] = [
  // Body
  { id: 'body-1', name: 'Small Body', emoji: '📦', cost: 10, type: 'body' },
  { id: 'body-2', name: 'Medium Body', emoji: '🧰', cost: 25, type: 'body' },
  { id: 'body-3', name: 'Large Body', emoji: '🛠️', cost: 50, type: 'body' },
  // Brain
  { id: 'brain-1', name: 'Tiny Chip', emoji: '🧠', cost: 20, type: 'brain' },
  { id: 'brain-2', name: 'Smart Chip', emoji: '💡', cost: 40, type: 'brain' },
  { id: 'brain-3', name: 'Super AI Chip', emoji: '🤖', cost: 80, type: 'brain' },
  // Sensors
  { id: 'sensor-1', name: 'Light Sensor', emoji: '🔆', cost: 15, type: 'sensor' },
  { id: 'sensor-2', name: 'Sound Sensor', emoji: '🎤', cost: 15, type: 'sensor' },
  { id: 'sensor-3', name: 'Touch Sensor', emoji: '🖐️', cost: 15, type: 'sensor' },
  { id: 'sensor-4', name: 'Distance Sensor', emoji: '📏', cost: 30, type: 'sensor' },
  { id: 'sensor-5', name: 'Camera Eyes', emoji: '👁️', cost: 45, type: 'sensor' },
  { id: 'sensor-6', name: 'Temperature Sensor', emoji: '🌡️', cost: 25, type: 'sensor' },
  // Motors
  { id: 'motor-1', name: 'Tiny Wheel', emoji: '🛞', cost: 10, type: 'motor' },
  { id: 'motor-2', name: 'Big Wheel', emoji: '⚙️', cost: 30, type: 'motor' },
  { id: 'motor-3', name: 'Arm', emoji: '🦾', cost: 40, type: 'motor' },
  { id: 'motor-4', name: 'Legs', emoji: '🦿', cost: 40, type: 'motor' },
  { id: 'motor-5', name: 'Propeller', emoji: '🚁', cost: 35, type: 'motor' },
  { id: 'motor-6', name: 'Claw', emoji: '🦀', cost: 25, type: 'motor' },
  { id: 'motor-7', name: 'Speaker', emoji: '🔊', cost: 20, type: 'motor' },
  { id: 'motor-8', name: 'LED Lights', emoji: '💡', cost: 10, type: 'motor' },
  // More Parts
  { id: 'body-4', name: 'Tank Treads', emoji: '🚜', cost: 60, type: 'body' },
  { id: 'sensor-7', name: 'Laser Scanner', emoji: '🔦', cost: 70, type: 'sensor' },
  { id: 'motor-9', name: 'Robotic Hand', emoji: '✋', cost: 50, type: 'motor' },
  { id: 'brain-4', name: 'Quantum Processor', emoji: '🧿', cost: 100, type: 'brain' },
  { id: 'body-5', name: 'Rocket Pack', emoji: '🚀', cost: 80, type: 'body' },
  { id: 'sensor-8', name: 'GPS Sensor', emoji: '🛰️', cost: 50, type: 'sensor' },
  { id: 'motor-10', name: 'Jet Engine', emoji: '🔥', cost: 90, type: 'motor' },
  // Extended Parts for 50
  { id: 'sensor-9', name: 'Smell Sensor', emoji: '👃', cost: 20, type: 'sensor' },
  { id: 'sensor-10', name: 'Taste Sensor', emoji: '👅', cost: 20, type: 'sensor' },
  { id: 'motor-11', name: 'Gripper', emoji: '🤏', cost: 30, type: 'motor' },
  { id: 'motor-12', name: 'Springs', emoji: '🪀', cost: 10, type: 'motor' },
  { id: 'body-6', name: 'Spider Legs', emoji: '🕷️', cost: 70, type: 'body' },
  { id: 'body-7', name: 'Turtle Shell', emoji: '🐢', cost: 40, type: 'body' },
  { id: 'body-8', name: 'Bird Wings', emoji: '🦅', cost: 50, type: 'body' },
  { id: 'brain-5', name: 'Memory Card', emoji: '💾', cost: 15, type: 'brain' },
  { id: 'brain-6', name: 'Wireless Antenna', emoji: '📡', cost: 25, type: 'brain' },
  { id: 'sensor-11', name: 'Heartbeat Sensor', emoji: '💓', cost: 30, type: 'sensor' },
  { id: 'motor-13', name: 'Water Jet', emoji: '💦', cost: 45, type: 'motor' },
  { id: 'motor-14', name: 'Fire Hose', emoji: '🧯', cost: 50, type: 'motor' },
  { id: 'body-9', name: 'Underwater Propeller', emoji: '⛵', cost: 60, type: 'body' },
  { id: 'body-10', name: 'Lunar Module', emoji: '🌙', cost: 90, type: 'body' },
  { id: 'sensor-12', name: 'Weather Sensor', emoji: '🌪️', cost: 40, type: 'sensor' },
  { id: 'motor-15', name: 'Robotic Tail', emoji: '🦎', cost: 30, type: 'motor' },
  { id: 'motor-16', name: 'Bubble Machine', emoji: '🫧', cost: 20, type: 'motor' },
  { id: 'body-11', name: 'Reinforced Armor', emoji: '🛡️', cost: 70, type: 'body' },
  { id: 'brain-7', name: 'Translation Chip', emoji: '🌐', cost: 60, type: 'brain' },
  { id: 'brain-8', name: 'Dream Module', emoji: '💭', cost: 50, type: 'brain' },
  { id: 'sensor-13', name: 'Spider Sense', emoji: '🕸️', cost: 90, type: 'sensor' },
  { id: 'motor-17', name: 'Dance Legs', emoji: '💃', cost: 35, type: 'motor' },
  { id: 'motor-18', name: 'Singing Voice', emoji: '🎤', cost: 40, type: 'motor' },
  { id: 'body-12', name: 'Ice Skates', emoji: '⛸️', cost: 25, type: 'body' },
  { id: 'body-13', name: 'Camo Skin', emoji: '🦎', cost: 30, type: 'body' },
  { id: 'body-14', name: 'Balloon Body', emoji: '🎈', cost: 20, type: 'body' },
  { id: 'body-15', name: 'Dirt Bike Tires', emoji: '🏍️', cost: 50, type: 'body' },
  { id: 'body-16', name: 'Tank Cannon', emoji: '🔫', cost: 80, type: 'body' },
  { id: 'motor-19', name: 'Robotic Fins', emoji: '🐠', cost: 30, type: 'motor' },
  { id: 'motor-20', name: 'Sneakers', emoji: '👟', cost: 15, type: 'motor' },
  { id: 'brain-9', name: 'Laughing Chip', emoji: '😄', cost: 25, type: 'brain' },
  { id: 'sensor-14', name: 'Privacy Shield', emoji: '🔒', cost: 40, type: 'sensor' },
  { id: 'sensor-15', name: 'Emotion Scanner', emoji: '😊', cost: 70, type: 'sensor' },
];

// --- 50 Sequence Challenges (Progressive) ---
export const SEQUENCE_CHALLENGES: SequenceChallenge[] = [
  // Level 1 - Very simple (2-3 steps)
  { id: 1, level: 1, title: 'Move Forward', targetSequence: ['Forward'], emoji: '⬆️', description: 'Move the robot forward!' },
  { id: 2, level: 1, title: 'Turn Right', targetSequence: ['TurnRight'], emoji: '➡️', description: 'Turn the robot to the right!' },
  { id: 3, level: 1, title: 'Turn Left', targetSequence: ['TurnLeft'], emoji: '⬅️', description: 'Turn the robot to the left!' },
  { id: 4, level: 1, title: 'Move Back', targetSequence: ['Backward'], emoji: '⬇️', description: 'Move the robot backwards!' },
  { id: 5, level: 1, title: 'Two Steps', targetSequence: ['Forward', 'Forward'], emoji: '⬆️⬆️', description: 'Move forward twice!' },
  { id: 6, level: 1, title: 'Go Right', targetSequence: ['Forward', 'TurnRight'], emoji: '⬆️➡️', description: 'Go forward and turn right!' },
  { id: 7, level: 1, title: 'Go Left', targetSequence: ['Forward', 'TurnLeft'], emoji: '⬆️⬅️', description: 'Go forward and turn left!' },
  { id: 8, level: 1, title: 'Square Corner', targetSequence: ['Forward', 'TurnRight', 'Forward'], emoji: '⬆️➡️⬆️', description: 'Move forward, right, and forward!' },
  { id: 9, level: 1, title: 'Return Home', targetSequence: ['Backward', 'Backward'], emoji: '⬇️⬇️', description: 'Move backwards twice!' },
  { id: 10, level: 1, title: 'Circle Half', targetSequence: ['TurnRight', 'TurnRight'], emoji: '➡️➡️', description: 'Turn right twice!' },
  { id: 11, level: 1, title: 'Zig Zag', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight'], emoji: '⬆️⬅️⬆️➡️', description: 'Move in a zig zag pattern!' },
  { id: 12, level: 1, title: 'Square Path', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬆️➡️', description: 'Move in a square pattern!' },
  { id: 13, level: 1, title: 'Three Forward', targetSequence: ['Forward', 'Forward', 'Forward'], emoji: '⬆️⬆️⬆️', description: 'Move forward three times!' },
  { id: 14, level: 1, title: 'Turn and Return', targetSequence: ['TurnRight', 'TurnRight', 'TurnRight', 'TurnRight'], emoji: '➡️➡️➡️➡️', description: 'Turn right four times!' },
  { id: 15, level: 1, title: 'L Shape', targetSequence: ['Forward', 'Forward', 'TurnLeft'], emoji: '⬆️⬆️⬅️', description: 'Move forward twice then turn left!' },
  { id: 16, level: 1, title: 'U Turn', targetSequence: ['Forward', 'TurnLeft', 'TurnLeft', 'Forward'], emoji: '⬆️⬅️⬅️⬆️', description: 'Make a U-turn!' },
  { id: 17, level: 1, title: 'Zig Zag 2', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnLeft'], emoji: '⬆️➡️⬆️⬅️', description: 'Zig zag the other way!' },
  { id: 18, level: 1, title: 'Circle', targetSequence: ['TurnRight', 'TurnRight', 'TurnRight', 'TurnRight', 'Forward'], emoji: '➡️➡️➡️➡️⬆️', description: 'Move in a circle!' },
  { id: 19, level: 1, title: 'Back and Forth', targetSequence: ['Forward', 'Backward'], emoji: '⬆️⬇️', description: 'Go forward then back!' },
  { id: 20, level: 1, title: 'Long Path', targetSequence: ['Forward', 'Forward', 'TurnRight', 'Forward'], emoji: '⬆️⬆️➡️⬆️', description: 'Take the long path!' },
  { id: 21, level: 1, title: 'Left Square', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnLeft'], emoji: '⬆️⬅️⬆️⬅️', description: 'Go left in a square!' },
  { id: 22, level: 1, title: 'Big L', targetSequence: ['Forward', 'Forward', 'Forward', 'TurnLeft'], emoji: '⬆️⬆️⬆️⬅️', description: 'Make a big L shape!' },
  { id: 23, level: 1, title: 'Right Return', targetSequence: ['Forward', 'TurnRight', 'Backward'], emoji: '⬆️➡️⬇️', description: 'Go right and come back!' },
  { id: 24, level: 1, title: 'Left Return', targetSequence: ['Forward', 'TurnLeft', 'Backward'], emoji: '⬆️⬅️⬇️', description: 'Go left and come back!' },
  { id: 25, level: 1, title: 'Big Square', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬆️➡️⬆️➡️', description: 'Make a big square!' },

  // Level 2 - Medium (4-6 steps)
  { id: 26, level: 2, title: 'Box Path', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬆️➡️⬆️➡️', description: 'Complete a box path!' },
  { id: 27, level: 2, title: 'Figure 8', targetSequence: ['Forward', 'TurnRight', 'TurnLeft', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬅️⬆️➡️', description: 'Draw a figure 8!' },
  { id: 28, level: 2, title: 'Spiral', targetSequence: ['Forward', 'TurnRight', 'Forward', 'Forward', 'TurnRight', 'Forward'], emoji: '⬆️➡️⬆️⬆️➡️⬆️', description: 'Make a spiral!' },
  { id: 29, level: 2, title: 'Box with Door', targetSequence: ['Forward', 'TurnRight', 'Forward', 'Backward', 'TurnRight', 'Forward'], emoji: '⬆️➡️⬆️⬇️➡️⬆️', description: 'Make a box with a door!' },
  { id: 30, level: 2, title: 'Maze Path', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'TurnLeft'], emoji: '⬆️⬅️⬆️➡️⬆️⬅️', description: 'Navigate a simple maze!' },
  { id: 31, level: 2, title: 'T Shape', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'Forward', 'TurnRight', 'Backward'], emoji: '⬆️⬅️⬆️⬆️➡️⬇️', description: 'Create a T shape!' },
  { id: 32, level: 2, title: 'Long Corridor', targetSequence: ['TurnRight', 'Forward', 'Forward', 'Forward', 'TurnLeft'], emoji: '➡️⬆️⬆️⬆️⬅️', description: 'Go down a long corridor!' },
  { id: 33, level: 2, title: 'Snake', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬆️⬅️⬆️➡️', description: 'Move like a snake!' },
  { id: 34, level: 2, title: 'Triangle', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬆️➡️', description: 'Make a triangle!' },
  { id: 35, level: 2, title: 'Full Circle', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward'], emoji: '⬆️➡️⬆️➡️⬆️➡️⬆️', description: 'Go around in a full circle!' },
  { id: 36, level: 2, title: 'Zig Zag 3', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️⬅️⬆️⬅️⬆️', description: 'Zig zag three times!' },
  { id: 37, level: 2, title: 'Back Maze', targetSequence: ['Backward', 'TurnRight', 'Backward', 'TurnLeft'], emoji: '⬇️➡️⬇️⬅️', description: 'Navigate a maze backwards!' },
  { id: 38, level: 2, title: 'Knight Move', targetSequence: ['Forward', 'Forward', 'TurnRight', 'Forward', 'Backward'], emoji: '⬆️⬆️➡️⬆️⬇️', description: 'Move like a knight in chess!' },
  { id: 39, level: 2, title: 'Follow Path', targetSequence: ['Forward', 'TurnRight', 'Forward', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️➡️⬆️⬆️⬅️⬆️', description: 'Follow the path!' },
  { id: 40, level: 2, title: 'S Path', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward'], emoji: '⬆️⬅️⬆️➡️⬆️', description: 'Create an S shape!' },
  { id: 41, level: 2, title: 'Return Trip', targetSequence: ['Forward', 'Forward', 'TurnRight', 'Backward', 'Backward'], emoji: '⬆️⬆️➡️⬇️⬇️', description: 'Go forward and return back!' },
  { id: 42, level: 2, title: 'Long U', targetSequence: ['Forward', 'Forward', 'TurnRight', 'Forward', 'Forward', 'TurnRight'], emoji: '⬆️⬆️➡️⬆️⬆️➡️', description: 'Make a long U shape!' },
  { id: 43, level: 2, title: 'Stairs', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬆️⬅️⬆️➡️', description: 'Climb the stairs!' },
  { id: 44, level: 2, title: 'Dance Move', targetSequence: ['TurnLeft', 'Forward', 'TurnRight', 'Backward'], emoji: '⬅️⬆️➡️⬇️', description: 'Do a dance move!' },
  { id: 45, level: 2, title: 'Grid Path', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️⬅️⬆️⬅️⬆️', description: 'Move across the grid!' },
  { id: 46, level: 2, title: 'Long Snake', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward'], emoji: '⬆️➡️⬆️⬅️⬆️➡️⬆️', description: 'Move like a long snake!' },
  { id: 47, level: 2, title: 'Maze 2', targetSequence: ['Forward', 'TurnRight', 'TurnLeft', 'Forward', 'TurnRight', 'Backward'], emoji: '⬆️➡️⬅️⬆️➡️⬇️', description: 'Solve a harder maze!' },
  { id: 48, level: 2, title: 'Interlock', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Backward', 'TurnLeft'], emoji: '⬆️⬅️⬆️➡️⬇️⬅️', description: 'Interlock the path!' },
  { id: 49, level: 2, title: 'Return Maze', targetSequence: ['Forward', 'Forward', 'TurnLeft', 'TurnLeft', 'Backward'], emoji: '⬆️⬆️⬅️⬅️⬇️', description: 'Return through the maze!' },
  { id: 50, level: 2, title: 'Double Zig Zag', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️➡️⬆️➡️⬆️⬅️⬆️', description: 'Do a double zig zag!' },

  // Level 3 - Hard (7+ steps)
  { id: 51, level: 3, title: 'Spiral 2', targetSequence: ['Forward', 'TurnRight', 'Forward', 'Forward', 'TurnRight', 'Forward', 'Forward', 'Forward'], emoji: '⬆️➡️⬆️⬆️➡️⬆️⬆️⬆️', description: 'Make a bigger spiral!' },
  { id: 52, level: 3, title: 'Mega Maze', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'TurnRight'], emoji: '⬆️⬅️⬆️➡️⬆️⬅️⬆️➡️', description: 'Solve the mega maze!' },
  { id: 53, level: 3, title: 'Hilbert Curve', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️⬅️⬆️➡️⬆️⬅️⬆️', description: 'Follow a Hilbert curve!' },
  { id: 54, level: 3, title: 'Knight Tour', targetSequence: ['Forward', 'TurnRight', 'Forward', 'Forward', 'TurnLeft', 'Forward', 'Backward'], emoji: '⬆️➡️⬆️⬆️⬅️⬆️⬇️', description: 'Complete a knight tour!' },
  { id: 55, level: 3, title: 'Corners', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward'], emoji: '⬆️➡️⬆️➡️⬆️➡️⬆️', description: 'Hit all four corners!' },
  { id: 56, level: 3, title: 'Complex Path', targetSequence: ['Forward', 'TurnLeft', 'Backward', 'TurnRight', 'Forward', 'Forward', 'TurnLeft'], emoji: '⬆️⬅️⬇️➡️⬆️⬆️⬅️', description: 'Take the complex path!' },
  { id: 57, level: 3, title: 'World Tour', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'TurnLeft', 'Forward', 'TurnRight'], emoji: '⬆️➡️⬆️⬅️⬆️⬅️⬆️➡️', description: 'Go around the world!' },
  { id: 58, level: 3, title: 'Ultimate Maze', targetSequence: ['Forward', 'TurnLeft', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'Backward', 'TurnRight'], emoji: '⬆️⬅️➡️⬆️⬅️⬆️⬇️➡️', description: 'Solve the ultimate maze!' },
  { id: 59, level: 3, title: 'Fractal', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'Forward'], emoji: '⬆️➡️⬆️➡️⬆️➡️⬆️⬆️', description: 'Draw a fractal!' },
  { id: 60, level: 3, title: 'Mega Snake', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️⬅️⬆️➡️⬆️➡️⬆️⬅️⬆️', description: 'Move like a mega snake!' },
  { id: 61, level: 3, title: 'Staircase', targetSequence: ['Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️➡️⬆️⬅️⬆️➡️⬆️⬅️⬆️', description: 'Climb the grand staircase!' },
  { id: 62, level: 3, title: 'Maze of Mazes', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'Backward'], emoji: '⬆️⬅️⬆️⬅️⬆️➡️⬆️⬇️', description: 'Navigate the maze of mazes!' },
  { id: 63, level: 3, title: 'Pyramid', targetSequence: ['Forward', 'Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward'], emoji: '⬆️⬆️➡️⬆️⬅️⬆️➡️⬆️', description: 'Draw a pyramid!' },
  { id: 64, level: 3, title: 'Mega Grid', targetSequence: ['Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'TurnRight', 'Forward', 'TurnLeft', 'Forward'], emoji: '⬆️⬅️⬆️➡️⬆️➡️⬆️⬅️⬆️', description: 'Cross the mega grid!' },
  { id: 65, level: 3, title: 'Infinite Path', targetSequence: ['Forward', 'TurnRight', 'Forward', 'Forward', 'TurnLeft', 'Forward', 'TurnRight', 'Forward', 'Forward'], emoji: '⬆️➡️⬆️⬆️⬅️⬆️➡️⬆️⬆️', description: 'Walk the infinite path!' },
];