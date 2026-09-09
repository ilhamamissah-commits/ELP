import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Star,
  Target,
  Lightbulb,
  Shield,
  Brain,
  Compass,
  Route,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";
type LearningMode = "guided" | "practice" | "mastery";

type Direction = "Up" | "Down" | "Left" | "Right";

type Position = {
  x: number;
  y: number;
};

interface SpatialChallenge {
  id: number;
  stage: number;
  title: string;
  difficulty: Difficulty;
  skill:
    | "Directions"
    | "Coordinates"
    | "Planning"
    | "Sequencing"
    | "Obstacle Avoidance"
    | "Spatial Reasoning"
    | "Problem Solving"
    | "Efficiency"
    | "Debugging";
  gridSize: number;
  start: Position;
  target: Position;
  obstacles: Position[];
  objective: string;
  hint: string;
  learningPoint: string;
  minimumMoves: number;
  maxMoves: number;
}

interface ProgressData {
  attempts: number;
  completed: boolean;
  bestMoves: number | null;
  usedHint: boolean;
}

interface SpatialPuzzleProps {
  onComplete?: (score: number) => void;
}

const MOVE_DELTAS: Record<Direction, Position> = {
  Up: { x: 0, y: -1 },
  Down: { x: 0, y: 1 },
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
};

/*
 * Spatial Reasoning progression
 *
 * 1. Directions
 * 2. Coordinates
 * 3. Simple Obstacles
 * 4. Planning
 * 5. Efficient Paths
 * 6. Multi-Step Routes
 * 7. Maze Logic
 * 8. Debugging
 * 9. Shortest Path
 * 10. Master Challenge
 */
const CHALLENGES: SpatialChallenge[] = [
  // ---------------------------------------------------------
  // STAGE 1 — DIRECTIONS
  // ---------------------------------------------------------
  {
    id: 1,
    stage: 1,
    title: "One Step Right",
    difficulty: "Easy",
    skill: "Directions",
    gridSize: 3,
    start: { x: 0, y: 1 },
    target: { x: 1, y: 1 },
    obstacles: [],
    objective: "Move the robot one step to the star.",
    hint: "The star is directly to the right.",
    learningPoint: "You are learning to understand the direction Right.",
    minimumMoves: 1,
    maxMoves: 2,
  },
  {
    id: 2,
    stage: 1,
    title: "Go Down",
    difficulty: "Easy",
    skill: "Directions",
    gridSize: 3,
    start: { x: 1, y: 0 },
    target: { x: 1, y: 1 },
    obstacles: [],
    objective: "Move the robot down to the star.",
    hint: "Look below the robot.",
    learningPoint: "You are learning to understand the direction Down.",
    minimumMoves: 1,
    maxMoves: 2,
  },
  {
    id: 3,
    stage: 1,
    title: "Two Steps",
    difficulty: "Easy",
    skill: "Directions",
    gridSize: 3,
    start: { x: 0, y: 0 },
    target: { x: 2, y: 0 },
    obstacles: [],
    objective: "Reach the star using two moves.",
    hint: "The star is two spaces to the right.",
    learningPoint: "Directions can be combined into a sequence.",
    minimumMoves: 2,
    maxMoves: 3,
  },

  // ---------------------------------------------------------
  // STAGE 2 — COORDINATES
  // ---------------------------------------------------------
  {
    id: 4,
    stage: 2,
    title: "Find the Corner",
    difficulty: "Easy",
    skill: "Coordinates",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 3, y: 0 },
    obstacles: [],
    objective: "Plan a route to the star in the top-right.",
    hint: "Move right across the top row.",
    learningPoint: "Coordinates help us describe where things are.",
    minimumMoves: 3,
    maxMoves: 4,
  },
  {
    id: 5,
    stage: 2,
    title: "Reach the Bottom",
    difficulty: "Easy",
    skill: "Coordinates",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 0, y: 3 },
    obstacles: [],
    objective: "Reach the star at the bottom.",
    hint: "Move down three spaces.",
    learningPoint: "A position changes when we move along the grid.",
    minimumMoves: 3,
    maxMoves: 4,
  },
  {
    id: 6,
    stage: 2,
    title: "Across and Down",
    difficulty: "Easy",
    skill: "Sequencing",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 2, y: 2 },
    obstacles: [],
    objective: "Reach the star using a sequence of directions.",
    hint: "You need to go right and down.",
    learningPoint: "A sequence is an ordered list of steps.",
    minimumMoves: 4,
    maxMoves: 5,
  },

  // ---------------------------------------------------------
  // STAGE 3 — SIMPLE OBSTACLES
  // ---------------------------------------------------------
  {
    id: 7,
    stage: 3,
    title: "Avoid the Rock",
    difficulty: "Easy",
    skill: "Obstacle Avoidance",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 2, y: 0 },
    obstacles: [{ x: 1, y: 0 }],
    objective: "Reach the star without touching the rock.",
    hint: "You cannot move through the rock. Go around it.",
    learningPoint: "Problems sometimes have constraints that change our plan.",
    minimumMoves: 4,
    maxMoves: 6,
  },
  {
    id: 8,
    stage: 3,
    title: "Find Another Way",
    difficulty: "Medium",
    skill: "Problem Solving",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 3, y: 0 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    objective: "The direct path is blocked. Find another route.",
    hint: "Try moving down first.",
    learningPoint: "Good problem solvers look for alternative solutions.",
    minimumMoves: 5,
    maxMoves: 7,
  },
  {
    id: 9,
    stage: 3,
    title: "Around the Wall",
    difficulty: "Medium",
    skill: "Spatial Reasoning",
    gridSize: 4,
    start: { x: 0, y: 1 },
    target: { x: 3, y: 1 },
    obstacles: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    objective: "Get from one side of the wall to the other.",
    hint: "There is space above and below the wall.",
    learningPoint: "Spatial reasoning helps us imagine routes before moving.",
    minimumMoves: 5,
    maxMoves: 7,
  },

  // ---------------------------------------------------------
  // STAGE 4 — PLANNING
  // ---------------------------------------------------------
  {
    id: 10,
    stage: 4,
    title: "Plan Before You Move",
    difficulty: "Medium",
    skill: "Planning",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 3, y: 3 },
    obstacles: [{ x: 1, y: 0 }],
    objective: "Plan the complete route before making your moves.",
    hint: "The first space to the right is blocked.",
    learningPoint: "Planning helps us avoid unnecessary mistakes.",
    minimumMoves: 6,
    maxMoves: 8,
  },
  {
    id: 11,
    stage: 4,
    title: "Choose Your Route",
    difficulty: "Medium",
    skill: "Planning",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 3, y: 3 },
    obstacles: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    objective: "Find a safe route to the star.",
    hint: "You can travel around the blocked spaces.",
    learningPoint: "There can be more than one possible route.",
    minimumMoves: 6,
    maxMoves: 9,
  },
  {
    id: 12,
    stage: 4,
    title: "Corner Challenge",
    difficulty: "Medium",
    skill: "Spatial Reasoning",
    gridSize: 4,
    start: { x: 3, y: 0 },
    target: { x: 0, y: 3 },
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
    ],
    objective: "Reach the opposite corner without hitting an obstacle.",
    hint: "Move away from the top row when necessary.",
    learningPoint: "Changing direction can help us navigate around obstacles.",
    minimumMoves: 6,
    maxMoves: 9,
  },

  // ---------------------------------------------------------
  // STAGE 5 — EFFICIENCY
  // ---------------------------------------------------------
  {
    id: 13,
    stage: 5,
    title: "Use Fewer Moves",
    difficulty: "Medium",
    skill: "Efficiency",
    gridSize: 4,
    start: { x: 0, y: 0 },
    target: { x: 3, y: 2 },
    obstacles: [],
    objective: "Reach the star using the fewest possible moves.",
    hint: "Count how far right and down the star is.",
    learningPoint: "Efficient solutions solve a problem with fewer unnecessary steps.",
    minimumMoves: 5,
    maxMoves: 6,
  },
  {
    id: 14,
    stage: 5,
    title: "Shortest Safe Route",
    difficulty: "Hard",
    skill: "Efficiency",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    objective: "Find a short route that avoids the blocked spaces.",
    hint: "Compare going around the obstacle on different sides.",
    learningPoint: "The best route is often the shortest route that follows the rules.",
    minimumMoves: 8,
    maxMoves: 10,
  },
  {
    id: 15,
    stage: 5,
    title: "Route Optimizer",
    difficulty: "Hard",
    skill: "Efficiency",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 3 },
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    objective: "Find an efficient route around the obstacles.",
    hint: "Think about where the walls force you to turn.",
    learningPoint: "Optimization means looking for a better or more efficient solution.",
    minimumMoves: 9,
    maxMoves: 11,
  },

  // ---------------------------------------------------------
  // STAGE 6 — MULTI-STEP ROUTES
  // ---------------------------------------------------------
  {
    id: 16,
    stage: 6,
    title: "Long Journey",
    difficulty: "Hard",
    skill: "Sequencing",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 2 },
    ],
    objective: "Guide the robot across the grid using a careful sequence.",
    hint: "Move down before crossing the blocked top section.",
    learningPoint: "Long problems can be solved by breaking them into smaller steps.",
    minimumMoves: 8,
    maxMoves: 11,
  },
  {
    id: 17,
    stage: 6,
    title: "The Narrow Route",
    difficulty: "Hard",
    skill: "Planning",
    gridSize: 5,
    start: { x: 0, y: 4 },
    target: { x: 4, y: 0 },
    obstacles: [
      { x: 1, y: 4 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    objective: "Find the open path through the narrow route.",
    hint: "Look for where the obstacle wall ends.",
    learningPoint: "Careful observation helps us discover possible paths.",
    minimumMoves: 8,
    maxMoves: 12,
  },
  {
    id: 18,
    stage: 6,
    title: "Four Turns",
    difficulty: "Hard",
    skill: "Sequencing",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    objective: "Plan a route with several changes of direction.",
    hint: "Do not rush. Look at the entire grid first.",
    learningPoint: "Complex tasks become easier when we plan the sequence first.",
    minimumMoves: 8,
    maxMoves: 12,
  },

  // ---------------------------------------------------------
  // STAGE 7 — MAZE LOGIC
  // ---------------------------------------------------------
  {
    id: 19,
    stage: 7,
    title: "Mini Maze",
    difficulty: "Hard",
    skill: "Problem Solving",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    objective: "Solve the maze and reach the star.",
    hint: "Trace a possible route with your eyes before moving.",
    learningPoint: "Maze solving requires planning, observation and problem solving.",
    minimumMoves: 8,
    maxMoves: 14,
  },
  {
    id: 20,
    stage: 7,
    title: "Maze Explorer",
    difficulty: "Hard",
    skill: "Spatial Reasoning",
    gridSize: 5,
    start: { x: 0, y: 4 },
    target: { x: 4, y: 0 },
    obstacles: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ],
    objective: "Navigate through the maze without touching the walls.",
    hint: "The opening in the wall gives you the way through.",
    learningPoint: "Spatial reasoning helps us mentally map spaces and routes.",
    minimumMoves: 8,
    maxMoves: 15,
  },
  {
    id: 21,
    stage: 7,
    title: "Hidden Route",
    difficulty: "Hard",
    skill: "Problem Solving",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ],
    objective: "Find the hidden safe route to the star.",
    hint: "Look for gaps rather than trying to move through walls.",
    learningPoint: "Good problem solving means searching for possibilities.",
    minimumMoves: 8,
    maxMoves: 15,
  },

  // ---------------------------------------------------------
  // STAGE 8 — DEBUGGING
  // ---------------------------------------------------------
  {
    id: 22,
    stage: 8,
    title: "Fix the Route",
    difficulty: "Hard",
    skill: "Debugging",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 2 },
    ],
    objective: "Find a route that avoids the mistake in the blocked area.",
    hint: "If one route does not work, change the plan.",
    learningPoint: "Debugging means finding and correcting problems.",
    minimumMoves: 8,
    maxMoves: 14,
  },
  {
    id: 23,
    stage: 8,
    title: "Wrong Turn",
    difficulty: "Hard",
    skill: "Debugging",
    gridSize: 5,
    start: { x: 0, y: 4 },
    target: { x: 4, y: 0 },
    obstacles: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    objective: "Avoid the wrong turn and find a successful route.",
    hint: "Before each move, ask: does this keep me closer to a safe path?",
    learningPoint: "When a plan fails, we can inspect it and try a better plan.",
    minimumMoves: 8,
    maxMoves: 15,
  },
  {
    id: 24,
    stage: 8,
    title: "Debug the Maze",
    difficulty: "Hard",
    skill: "Debugging",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ],
    objective: "Test your route, notice mistakes, and correct them.",
    hint: "Do not be afraid to retry. Each attempt gives you information.",
    learningPoint: "Engineers and programmers improve solutions by testing and debugging.",
    minimumMoves: 8,
    maxMoves: 16,
  },

  // ---------------------------------------------------------
  // STAGE 9 — SHORTEST PATH
  // ---------------------------------------------------------
  {
    id: 25,
    stage: 9,
    title: "Shortest Path",
    difficulty: "Hard",
    skill: "Efficiency",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    objective: "Reach the star using the shortest safe route.",
    hint: "Compare possible routes before choosing one.",
    learningPoint: "Shortest-path problems are an important part of computer science and mathematics.",
    minimumMoves: 8,
    maxMoves: 10,
  },
  {
    id: 26,
    stage: 9,
    title: "Efficient Explorer",
    difficulty: "Hard",
    skill: "Efficiency",
    gridSize: 5,
    start: { x: 0, y: 4 },
    target: { x: 4, y: 0 },
    obstacles: [
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 1 },
    ],
    objective: "Find the most efficient route to the target.",
    hint: "Avoid making extra turns unless they help you bypass an obstacle.",
    learningPoint: "Efficiency means achieving the goal without unnecessary work.",
    minimumMoves: 8,
    maxMoves: 11,
  },
  {
    id: 27,
    stage: 9,
    title: "Route Master",
    difficulty: "Hard",
    skill: "Problem Solving",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ],
    objective: "Solve the route while keeping your moves efficient.",
    hint: "Break the problem into sections: start, obstacle area, then target.",
    learningPoint: "Decomposition helps us solve complicated problems step by step.",
    minimumMoves: 10,
    maxMoves: 14,
  },

  // ---------------------------------------------------------
  // STAGE 10 — MASTER CHALLENGE
  // ---------------------------------------------------------
  {
    id: 28,
    stage: 10,
    title: "Master Navigator",
    difficulty: "Hard",
    skill: "Spatial Reasoning",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    objective: "Use everything you have learned to solve the master route.",
    hint: "Observe first. Plan second. Move third.",
    learningPoint: "Strong problem solvers observe, plan, test and improve.",
    minimumMoves: 10,
    maxMoves: 16,
  },
  {
    id: 29,
    stage: 10,
    title: "Logic Navigator",
    difficulty: "Hard",
    skill: "Planning",
    gridSize: 5,
    start: { x: 4, y: 0 },
    target: { x: 0, y: 4 },
    obstacles: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    objective: "Plan carefully and navigate to the opposite corner.",
    hint: "Look at the whole maze before making the first move.",
    learningPoint: "Planning ahead reduces mistakes and improves decision making.",
    minimumMoves: 10,
    maxMoves: 17,
  },
  {
    id: 30,
    stage: 10,
    title: "Spatial Reasoning Master",
    difficulty: "Hard",
    skill: "Problem Solving",
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 3, y: 3 },
    ],
    objective:
      "Solve the final challenge using observation, planning, sequencing and spatial reasoning.",
    hint: "There may be more than one route. Find a safe and efficient one.",
    learningPoint:
      "Spatial reasoning combines observation, planning, logic, sequencing and problem solving.",
    minimumMoves: 10,
    maxMoves: 18,
  },
];

const createInitialProgress = (): Record<number, ProgressData> => {
  return Object.fromEntries(
    CHALLENGES.map((challenge) => [
      challenge.id,
      {
        attempts: 0,
        completed: false,
        bestMoves: null,
        usedHint: false,
      },
    ]),
  );
};

export const SpatialPuzzle: React.FC<SpatialPuzzleProps> = ({
  onComplete,
}) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [robotPos, setRobotPos] = useState<Position>(CHALLENGES[0].start);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState<LearningMode>("guided");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [progress, setProgress] =
    useState<Record<number, ProgressData>>(createInitialProgress);

  const challenge = CHALLENGES[challengeIndex];

  const stageChallenges = useMemo(
    () => CHALLENGES.filter((item) => item.stage === challenge.stage),
    [challenge.stage],
  );

  const isObstacle = (position: Position) =>
    challenge.obstacles.some(
      (obstacle) =>
        obstacle.x === position.x && obstacle.y === position.y,
    );

  const isInsideGrid = (position: Position) =>
    position.x >= 0 &&
    position.x < challenge.gridSize &&
    position.y >= 0 &&
    position.y < challenge.gridSize;

  const resetChallenge = () => {
    setRobotPos(challenge.start);
    setMoves(0);
    setCompleted(false);
    setShowHint(false);
    setFeedback(null);
  };

  const selectChallenge = (index: number) => {
    const nextChallenge = CHALLENGES[index];

    setChallengeIndex(index);
    setRobotPos(nextChallenge.start);
    setMoves(0);
    setCompleted(false);
    setShowHint(false);
    setFeedback(null);
  };

  const handleMove = (direction: Direction) => {
    if (completed) return;

    const delta = MOVE_DELTAS[direction];

    const nextPosition = {
      x: robotPos.x + delta.x,
      y: robotPos.y + delta.y,
    };

    if (!isInsideGrid(nextPosition)) {
      setFeedback("That move goes outside the grid. Try another direction.");
      setStreak(0);
      return;
    }

    if (isObstacle(nextPosition)) {
      setFeedback("There is an obstacle there. Find another route.");
      setStreak(0);
      return;
    }

    const nextMoves = moves + 1;

    setRobotPos(nextPosition);
    setMoves(nextMoves);
    setFeedback(null);

    if (
      nextPosition.x === challenge.target.x &&
      nextPosition.y === challenge.target.y
    ) {
      const currentProgress = progress[challenge.id];

      const efficiencyBonus =
        nextMoves <= challenge.minimumMoves
          ? 15
          : nextMoves <= challenge.minimumMoves + 1
            ? 10
            : 5;

      const hintPenalty = currentProgress.usedHint || showHint ? 0 : 5;

      const basePoints = mode === "guided" ? 10 : 15;
      const streakBonus = streak >= 2 ? 5 : 0;

      const earnedPoints =
        basePoints + efficiencyBonus + hintPenalty + streakBonus;

      setScore((previous) => previous + earnedPoints);
      setStreak((previous) => previous + 1);
      setCompleted(true);

      setProgress((previous) => ({
        ...previous,
        [challenge.id]: {
          ...previous[challenge.id],
          attempts: previous[challenge.id].attempts + 1,
          completed: true,
          bestMoves:
            previous[challenge.id].bestMoves === null
              ? nextMoves
              : Math.min(previous[challenge.id].bestMoves!, nextMoves),
        },
      }));

      setFeedback(
        nextMoves <= challenge.minimumMoves
          ? "Excellent! You found an efficient route."
          : "Great job! You reached the target.",
      );
    } else if (nextMoves >= challenge.maxMoves) {
      setFeedback(
        "You have used your move limit. Think about a different route and try again.",
      );

      setProgress((previous) => ({
        ...previous,
        [challenge.id]: {
          ...previous[challenge.id],
          attempts: previous[challenge.id].attempts + 1,
        },
      }));

      setStreak(0);
    }
  };

  const useHint = () => {
    setShowHint((previous) => !previous);

    if (!progress[challenge.id].usedHint) {
      setProgress((previous) => ({
        ...previous,
        [challenge.id]: {
          ...previous[challenge.id],
          usedHint: true,
        },
      }));
    }
  };

  const nextChallenge = () => {
    if (challengeIndex < CHALLENGES.length - 1) {
      selectChallenge(challengeIndex + 1);
      return;
    }

    setCompleted(true);
  };

  const previousChallenge = () => {
    if (challengeIndex > 0) {
      selectChallenge(challengeIndex - 1);
    }
  };

  const masteredCount = Object.values(progress).filter(
    (item) => item.completed,
  ).length;

  const masteryPercentage = Math.round(
    (masteredCount / CHALLENGES.length) * 100,
  );

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);
  };

  const resetAll = () => {
    const first = CHALLENGES[0];

    setChallengeIndex(0);
    setRobotPos(first.start);
    setMoves(0);
    setScore(0);
    setStreak(0);
    setMode("guided");
    setShowHint(false);
    setFeedback(null);
    setCompleted(false);
    setHasFinished(false);
    setProgress(createInitialProgress());
  };

  if (hasFinished) {
    return (
      <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-9 h-9 text-green-400" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            Spatial Reasoning Complete!
          </h3>

          <p className="text-gray-400 mb-5">
            You completed your current spatial reasoning journey.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-xl font-bold text-white">
                {masteredCount}
              </div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-xl font-bold text-yellow-400">
                {score}
              </div>
              <div className="text-xs text-gray-400">Score</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-xl font-bold text-indigo-400">
                {masteryPercentage}%
              </div>
              <div className="text-xs text-gray-400">Mastery</div>
            </div>
          </div>

          <div className="text-left bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-2">
              <Brain className="w-4 h-4" />
              Skills Developed
            </div>

            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Direction and coordinate awareness</li>
              <li>• Spatial reasoning</li>
              <li>• Planning and sequencing</li>
              <li>• Problem solving</li>
              <li>• Route optimization</li>
              <li>• Debugging and persistence</li>
            </ul>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={resetAll}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Learn Again
            </button>

            <button
              onClick={finishAndMoveUp}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold flex items-center gap-2"
            >
              Finish & Move Up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-app-card p-5 sm:p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-400" />
            <h3 className="text-2xl font-bold text-white">
              Spatial Navigator
            </h3>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            Logic & Reasoning • Spatial Reasoning
          </p>
        </div>

        <button
          onClick={resetAll}
          aria-label="Reset spatial reasoning"
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-800/70 rounded-xl p-2 text-center">
          <div className="text-xs text-gray-400">Challenge</div>
          <div className="text-sm font-bold text-white">
            {challengeIndex + 1}/{CHALLENGES.length}
          </div>
        </div>

        <div className="bg-gray-800/70 rounded-xl p-2 text-center">
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-sm font-bold text-yellow-400">
            {score}
          </div>
        </div>

        <div className="bg-gray-800/70 rounded-xl p-2 text-center">
          <div className="text-xs text-gray-400">Streak</div>
          <div className="text-sm font-bold text-indigo-400">
            {streak}
          </div>
        </div>
      </div>

      {/* Stage selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
        {Array.from({ length: 10 }).map((_, index) => {
          const stage = index + 1;
          const firstIndex = CHALLENGES.findIndex(
            (item) => item.stage === stage,
          );

          const stageCompleted = CHALLENGES.filter(
            (item) => item.stage === stage,
          ).every((item) => progress[item.id]?.completed);

          return (
            <button
              key={stage}
              onClick={() =>
                firstIndex >= 0 && selectChallenge(firstIndex)
              }
              className={`min-w-[76px] px-2 py-2 rounded-lg text-xs border ${
                challenge.stage === stage
                  ? "bg-indigo-600 border-indigo-400 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              <div className="font-bold">Stage {stage}</div>
              {stageCompleted && (
                <CheckCircle className="w-3 h-3 mx-auto mt-1 text-green-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Challenge information */}
      <div className="bg-gray-800/60 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                Stage {challenge.stage}
              </span>

              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                {challenge.difficulty}
              </span>

              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                {challenge.skill}
              </span>
            </div>

            <h4 className="text-lg font-bold text-white">
              {challenge.title}
            </h4>
          </div>

          <Target className="w-5 h-5 text-yellow-400 shrink-0" />
        </div>

        <p className="text-gray-300 text-sm mt-2">
          {challenge.objective}
        </p>
      </div>

      {/* Learning mode */}
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        {(["guided", "practice", "mastery"] as LearningMode[]).map(
          (item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`py-2 rounded-lg text-xs font-semibold capitalize ${
                mode === item
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      {/* Hint */}
      <div className="mb-4">
        <button
          onClick={useHint}
          className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm"
            >
              {challenge.hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div
        className="grid gap-1.5 max-w-[360px] mx-auto mb-5"
        style={{
          gridTemplateColumns: `repeat(${challenge.gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({
          length: challenge.gridSize * challenge.gridSize,
        }).map((_, index) => {
          const x = index % challenge.gridSize;
          const y = Math.floor(index / challenge.gridSize);

          const position = { x, y };

          const robotHere =
            robotPos.x === x && robotPos.y === y;

          const targetHere =
            challenge.target.x === x &&
            challenge.target.y === y;

          const obstacleHere = isObstacle(position);

          return (
            <motion.div
              key={index}
              layout
              className={`aspect-square rounded-lg flex items-center justify-center border ${
                obstacleHere
                  ? "bg-gray-600 border-gray-500"
                  : targetHere
                    ? "bg-yellow-500/20 border-yellow-500/40"
                    : "bg-gray-800 border-gray-700"
              }`}
            >
              {robotHere ? (
                <motion.span
                  key="robot"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="text-2xl sm:text-3xl"
                >
                  🤖
                </motion.span>
              ) : obstacleHere ? (
                <span className="text-xl">🧱</span>
              ) : targetHere ? (
                <span className="text-xl sm:text-2xl">⭐</span>
              ) : (
                <span className="text-[9px] text-gray-700">
                  {x},{y}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Move counter */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Route className="w-4 h-4" />
          Moves:
          <span className="font-bold text-white">
            {moves}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          Target: {challenge.minimumMoves} moves
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-[220px] mx-auto mb-5">
        <div className="flex justify-center mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMove("Up")}
            disabled={completed}
            className="w-14 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-bold"
          >
            ↑
          </motion.button>
        </div>

        <div className="flex justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMove("Left")}
            disabled={completed}
            className="w-14 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-bold"
          >
            ←
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMove("Down")}
            disabled={completed}
            className="w-14 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-bold"
          >
            ↓
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMove("Right")}
            disabled={completed}
            className="w-14 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-bold"
          >
            →
          </motion.button>
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-3 rounded-xl mb-4 text-sm ${
              completed
                ? "bg-green-500/15 border border-green-500/20 text-green-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}
          >
            {completed ? (
              <CheckCircle className="w-4 h-4 inline mr-1" />
            ) : (
              <Shield className="w-4 h-4 inline mr-1" />
            )}

            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion controls */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4"
        >
          <div className="flex justify-center items-center gap-2 text-green-300 font-bold mb-2">
            <Star className="w-5 h-5" />
            Challenge Complete!
          </div>

          <p className="text-sm text-gray-300 mb-3">
            {challenge.learningPoint}
          </p>

          <div className="flex justify-center gap-2">
            <button
              onClick={resetChallenge}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>

            {challengeIndex > 0 && (
              <button
                onClick={previousChallenge}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            {challengeIndex < CHALLENGES.length - 1 ? (
              <button
                onClick={nextChallenge}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={finishAndMoveUp}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm flex items-center gap-2"
              >
                Finish
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Bottom progress */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Stage {challenge.stage}: {stageChallenges.length} challenges
        </span>

        <span>
          {masteredCount}/{CHALLENGES.length} mastered
        </span>
      </div>
    </div>
  );
};