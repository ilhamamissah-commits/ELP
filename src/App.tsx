import { useState, useEffect } from 'react';
import { AgeGate } from './components/onboarding/AgeGate';
import { LearningWorld } from './components/dashboard/LearningWorld';
import { SubjectDashboard } from './components/dashboard/SubjectDashboard';
import { SubjectLessonList, LessonItem } from './components/dashboard/SubjectLessonList';
import { SentenceBuilder } from './components/interactive/Reading/SentenceBuilder';
import { SoundLottery } from './components/interactive/Reading/SoundLottery';
import { VocabularyBuilder } from './components/interactive/Reading/VocabularyBuilder';
import { WordFamilies } from './components/interactive/Reading/WordFamilies';
import { PhonicsBlender } from './components/interactive/Reading/PhonicsBlender';
import { StoryReader } from './components/interactive/Reading/StoryReader';
import { GoldenBeads } from './components/interactive/Maths/GoldenBeads';
import { AbacusWidget } from './components/interactive/Maths/AbacusWidget';
import { NumberOperations } from './components/interactive/Maths/NumberOperations';
import { TracingNumbers } from './components/interactive/Maths/TracingNumbers';
import { NumberSense } from './components/interactive/Maths/NumberSense';
import { AdditionGame } from './components/interactive/Maths/AdditionGame';
import { SubtractionGame } from './components/interactive/Maths/SubtractionGame';
import { MultiplicationGame } from './components/interactive/Maths/MultiplicationGame';
import { DivisionGame } from './components/interactive/Maths/DivisionGame';
import { FractionsGame } from './components/interactive/Maths/FractionsGame';
import { MoneyGame } from './components/interactive/Maths/MoneyGame';
import { ClockGame } from './components/interactive/Maths/ClockGame';
import { ScienceLab } from './components/interactive/Science/ScienceLab';
import { TracingCanvas } from './components/interactive/Writing/TracingCanvas';
import { LetterTracing } from './components/interactive/Writing/LetterTracing';
import { NumberTracing } from './components/interactive/Writing/NumberTracing';
import { WordBuilder } from './components/interactive/Writing/WordBuilder';
import { SightWords } from './components/interactive/Writing/SightWords';
import { CreativeWriting } from './components/interactive/Writing/CreativeWriting';
import { HandwritingPractice } from './components/interactive/Writing/HandwritingPractice';
import { WashingHands } from './components/interactive/PracticalLife/WashingHands';
import { BrushingTeeth } from './components/interactive/PracticalLife/BrushingTeeth';
import { SettingTable } from './components/interactive/PracticalLife/SettingTable';
import { FoldingClothes } from './components/interactive/PracticalLife/FoldingClothes';
import { TyingShoes } from './components/interactive/PracticalLife/TyingShoes';
import { WateringPlants } from './components/interactive/PracticalLife/WateringPlants';
import { PinkTower } from './components/interactive/Sensorial/PinkTower';
import { BrownStair } from './components/interactive/Sensorial/BrownStair';
import { RedRods } from './components/interactive/Sensorial/RedRods';
import { ColorTablets } from './components/interactive/Sensorial/ColorTablets';
import { SoundBoxes } from './components/interactive/Sensorial/SoundBoxes';
import { RoughSmooth } from './components/interactive/Sensorial/RoughSmooth';
import { ThermicTablets } from './components/interactive/Sensorial/ThermicTablets';
import { ContinentExplorer } from './components/interactive/Geography/ContinentExplorer';
import { Landforms } from './components/interactive/Geography/Landforms';
import { FlagMatch } from './components/interactive/Geography/FlagMatch';
import { MapReader } from './components/interactive/Geography/MapReader';
import { OceanExplorer } from './components/interactive/Geography/OceanExplorer';
import { NaturalWonders } from './components/interactive/Geography/NaturalWonders';
import { GlobeExplorer } from './components/interactive/Geography/GlobeExplorer';
import { ColorMixer } from './components/interactive/Art/ColorMixer';
import { ShapesPainter } from './components/interactive/Art/ShapesPainter';
import { DrawingCanvas } from './components/interactive/Art/DrawingCanvas';
import { StickerBoard } from './components/interactive/Art/StickerBoard';
import { PatternMaker } from './components/interactive/Art/PatternMaker';
import { ArtGallery } from './components/interactive/Art/ArtGallery';
import { ParentPortal } from './components/dashboard/ParentPortal';
import { EmotionCheck } from './components/core/EmotionCheck';
import { useProgressStore } from './store/useProgressStore';
import { useProfileStore } from './store/useProfileStore';
import { BackButton } from './components/core/BackButton';
import { HelpGuide } from './components/core/HelpGuide';
import { PatternRecognizer } from './components/interactive/Logic/PatternRecognizer';
import { SpatialPuzzle } from './components/interactive/Logic/SpatialPuzzle';
import { ClassificationSorter } from './components/interactive/Logic/ClassificationSorter';
import { MemoryMatch } from './components/interactive/Logic/MemoryMatch';
import { BridgeBuilder } from './components/interactive/Engineering/BridgeBuilder';
import { TowerBuilder } from './components/interactive/Engineering/TowerBuilder';
import { AnimalCrossing } from './components/interactive/Engineering/AnimalCrossing';
import { ArabicLetters } from './components/interactive/Arabic/ArabicLetters';
import { ArabicWords } from './components/interactive/Arabic/ArabicWords';
import { ArabicReading } from './components/interactive/Arabic/ArabicReading';
import { EmotionMatch } from './components/interactive/Wellbeing/EmotionMatch';
import { FeelingsJournal } from './components/interactive/Wellbeing/FeelingsJournal';
import { EmpathyBuilder } from './components/interactive/Wellbeing/EmpathyBuilder';
import { CalmCorner } from './components/interactive/Wellbeing/CalmCorner';
import { RobotExplorer } from './components/interactive/Robotics/RobotExplorer';
import { Sequencer } from './components/interactive/Robotics/Sequencer';
import { RobotDesigner } from './components/interactive/Robotics/RobotDesigner';
import { LegoBuilder } from './components/interactive/Engineering/LegoBuilder';
import { PuzzleBuilder } from './components/interactive/Engineering/PuzzleBuilder';
import { ComputationalThinking } from './components/interactive/DigitalWorld/ComputationalThinking';
import { CodingBasics } from './components/interactive/DigitalWorld/CodingBasics';
import { DigitalSafety } from './components/interactive/DigitalWorld/DigitalSafety';
import { ComputerBasics } from './components/interactive/DigitalWorld/ComputerBasics';

// --- TYPES ---
// Added 'dashboard' to the list
type Screen = 'age' | 'subjects' | 'dashboard' | 'list' | 'activity' | 'profiles' | 'portal';

function App() {
  const [screen, setScreen] = useState<Screen>('age');
  const [currentList, setCurrentList] = useState<string>('');
  const [currentActivityId, setCurrentActivityId] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const [currentWorld, setCurrentWorld] = useState('');

  const { setProfile, childName, childAge } = useProgressStore();
  const { currentProfileId, profiles, setCurrentProfile, addProfile } = useProfileStore();
  const [showEmotionCheck, setShowEmotionCheck] = useState(true);

  // --- AUTO-LOGIN: If a profile exists, skip AgeGate and go straight to the map ---
  useEffect(() => {
    if (currentProfileId && profiles[currentProfileId]) {
      const p = profiles[currentProfileId];
      setProfile(p.age, p.name);
      setScreen('subjects');
    }
  }, [currentProfileId, profiles]);

  // --- HANDLERS ---
  const handleStartOver = () => {
    setCurrentProfile("");
    setScreen('age');
  };

  const handleAgeSelect = (age: number, name: string) => {
    const newId = `child-${Date.now()}`;
    const avatar = age <= 4 ? '🐣' : age <= 7 ? '🦊' : '🦉';
    addProfile(newId, name, age, avatar);
    setCurrentProfile(newId);
    setProfile(age, name);
    setScreen('subjects');
  };

  // World Select -> Go to Dashboard
  const handleSubjectSelect = (worldId: string) => {
    setCurrentWorld(worldId);
    setScreen('dashboard');
  };

  // Dashboard Subject Select -> Go to Lesson List
  const handleWorldSubjectSelect = (subjectId: string) => {
    setCurrentList(subjectId);
    setScreen('list');
  };

  const handleLessonSelect = (lesson: LessonItem) => {
    setCurrentActivityId(lesson.componentId);
    setScreen('activity');
  };

  const handleBack = () => {
    if (screen === 'activity') {
      setScreen('list');
    } else if (screen === 'list') {
      setScreen('dashboard');
    } else if (screen === 'dashboard') {
      setScreen('subjects');
    } else if (screen === 'subjects') {
      setScreen('age');
    }
  };

  const handleActivityComplete = () => {
    setTimeout(() => {
      if (currentList) setScreen('list');
      else setScreen('subjects');
    }, 2000);
  };

  const handleSwitchProfile = (id: string) => {
    const p = profiles[id];
    if(p) {
      setCurrentProfile(id);
      setProfile(p.age, p.name);
      setScreen('subjects');
    }
  };

  const handleOpenPortal = () => {
    setScreen('portal');
  };

  const handleExperimentSelect = (_expId: string) => { 
    setCurrentActivityId('VirtualLab'); 
    setScreen('activity');
  };

  // --- GET HELP STEPS ---
  const getHelpSteps = (id: string): string[] => {
    switch(id) {
      case 'SentenceBuilder': return ['Look at the target sentence.', 'Tap the words below to build.', 'The screen will turn green when you get it right!'];
      case 'SoundLottery': return ['Tap the speaker button to hear the sound.', 'Tap a card to flip it.', 'Find all 3 cards with the correct sound!'];
      case 'VocabularyBuilder': return ['Look at the word and emoji.', 'Listen to the pronunciation.', 'Tap "Next Word" to learn more!'];
      case 'GoldenBeads': return ['Use the + and - buttons.', 'Build the target number.', 'Click "Check Answer" to see if you are right!'];
      case 'AbacusWidget': return ['Click the beads to move them.', 'Heaven beads (top) = 5. Earth beads (bottom) = 1.', 'Use the Quiz mode to test your skills!'];
      default: return ['Select an activity and start learning!'];
    }
  };

  // --- MASTER CURRICULUM REGISTRY ---
  const getCurriculumForAge = (): Record<string, LessonItem[]> => {
    return {
      'english': [
        { id: '1', lessonId: '1', title: 'Sound Awareness', description: 'Level 1: Listen and identify sounds', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'SoundLottery' },
        { id: '2', lessonId: '2', title: 'Word Families', description: 'Level 1: Group words with similar endings', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'WordFamilies' },
        { id: '3', lessonId: '3', title: 'Sentence Builder', description: 'Level 2: Construct basic sentences', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'SentenceBuilder' },
        { id: '4', lessonId: '4', title: 'Phonics Blender', description: 'Level 2: Blend sounds to read', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'PhonicsBlender' },
        { id: '5', lessonId: '5', title: 'Story Time', description: 'Level 3: Read interactive stories', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'StoryReader' },
        { id: '6', lessonId: '6', title: 'Word Explorer', description: 'Level 3: Learn 100+ words', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'VocabularyBuilder' },
      ],
      'maths': [
        { id: '1', lessonId: '1', title: 'Number Sense', description: 'Count and compare numbers', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'NumberSense' },
        { id: '2', lessonId: '2', title: 'Golden Beads', description: 'Build numbers with beads', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'GoldenBeads' },
        { id: '3', lessonId: '3', title: 'Tracing Numbers', description: 'Write numbers 0-9', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'TracingNumbers' },
        { id: '4', lessonId: '4', title: 'Addition', description: 'Add groups together', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'AdditionGame' },
        { id: '5', lessonId: '5', title: 'Subtraction', description: 'Take away objects', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'SubtractionGame' },
        { id: '6', lessonId: '6', title: 'Multiplication', description: 'Count groups', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'MultiplicationGame' },
        { id: '7', lessonId: '7', title: 'Division', description: 'Share equally', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'DivisionGame' },
        { id: '8', lessonId: '8', title: 'Fractions', description: 'Pizza & shapes', tag: 'Level 4', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'FractionsGame' },
        { id: '9', lessonId: '9', title: 'Money', description: 'Count coins', tag: 'Level 4', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'MoneyGame' },
        { id: '10', lessonId: '10', title: 'Time', description: 'Read the clock', tag: 'Level 4', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'ClockGame' },
      ],
      'abacus': [
        { id: '1', lessonId: '1', title: 'Soroban Basics', description: 'Level 1: Move beads', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'AbacusWidget' },
        { id: '2', lessonId: '2', title: 'Mental Math', description: 'Level 3: Calculate in head', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'AbacusWidget' },
      ],
      'science': [
        { id: '1', lessonId: '1', title: 'Biology Lab', description: '50 Biology Experiments', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'BiologyLab' },
        { id: '2', lessonId: '2', title: 'Physics Lab', description: '50 Physics Experiments', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'PhysicsLab' },
        { id: '3', lessonId: '3', title: 'Chemistry Lab', description: '50 Chemistry Experiments', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'ChemistryLab' },
      ],
      'writing': [
        { id: '1', lessonId: '1', title: 'Letter Tracing', description: 'Trace A-Z', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'LetterTracing' },
        { id: '2', lessonId: '2', title: 'Number Tracing', description: 'Trace 0-9', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'NumberTracing' },
        { id: '3', lessonId: '3', title: 'Word Builder', description: 'Build words', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'WordBuilder' },
        { id: '4', lessonId: '4', title: 'Sight Words', description: 'Spell common words', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'SightWords' },
        { id: '5', lessonId: '5', title: 'Creative Writing', description: 'Build stories', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'CreativeWriting' },
        { id: '6', lessonId: '6', title: 'Handwriting', description: 'Write full words', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'HandwritingPractice' },
      ],
      'practical-life': [
        { id: '1', lessonId: '1', title: 'Washing Hands', description: 'Learn the 7 steps', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'WashingHands' },
        { id: '2', lessonId: '2', title: 'Brushing Teeth', description: 'Keep your teeth clean', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'BrushingTeeth' },
        { id: '3', lessonId: '3', title: 'Setting Table', description: 'Set the table right', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'SettingTable' },
        { id: '4', lessonId: '4', title: 'Folding Clothes', description: 'Fold neatly', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'FoldingClothes' },
        { id: '5', lessonId: '5', title: 'Tying Shoes', description: 'Tie your laces', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'TyingShoes' },
        { id: '6', lessonId: '6', title: 'Watering Plants', description: 'Care for nature', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'WateringPlants' },
      ],
      'art': [
        { id: '1', lessonId: '1', title: 'Color Mixer', description: 'Mix colors', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'ColorMixer' },
        { id: '2', lessonId: '2', title: 'Shapes Painter', description: 'Create with shapes', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'ShapesPainter' },
        { id: '3', lessonId: '3', title: 'Drawing Canvas', description: 'Free drawing', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'DrawingCanvas' },
        { id: '4', lessonId: '4', title: 'Sticker Board', description: 'Create scenes', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'StickerBoard' },
        { id: '5', lessonId: '5', title: 'Pattern Maker', description: 'Make patterns', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'PatternMaker' },
        { id: '6', lessonId: '6', title: 'Art Gallery', description: 'Showcase artwork', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'ArtGallery' },
      ],
      'geography': [
        { id: '1', lessonId: '1', title: 'Globe Explorer', description: 'Tap the world', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'GlobeExplorer' },
        { id: '2', lessonId: '2', title: 'Continents', description: 'Learn 7 continents', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'ContinentExplorer' },
        { id: '3', lessonId: '3', title: 'Landforms', description: 'Mountains & rivers', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'Landforms' },
        { id: '4', lessonId: '4', title: 'Flags', description: 'Countries & capitals', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'FlagMatch' },
        { id: '5', lessonId: '5', title: 'Map Reading', description: 'Find your way', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'MapReader' },
        { id: '6', lessonId: '6', title: 'Oceans', description: '5 oceans of the world', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'OceanExplorer' },
        { id: '7', lessonId: '7', title: 'Natural Wonders', description: 'Amazing places', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'NaturalWonders' },
      ],
      'sensorial': [
        { id: '1', lessonId: '1', title: 'Pink Tower', description: 'Build by size', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'PinkTower' },
        { id: '2', lessonId: '2', title: 'Brown Stair', description: 'Build thick to thin', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'BrownStair' },
        { id: '3', lessonId: '3', title: 'Red Rods', description: 'Sort by length', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'RedRods' },
        { id: '4', lessonId: '4', title: 'Color Tablets', description: 'Learn colors', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'ColorTablets' },
        { id: '5', lessonId: '5', title: 'Sound Boxes', description: 'Listen and learn', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'SoundBoxes' },
        { id: '6', lessonId: '6', title: 'Rough & Smooth', description: 'Feel the difference', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'RoughSmooth' },
        { id: '7', lessonId: '7', title: 'Thermic Tablets', description: 'Touch temperatures', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'ThermicTablets' },
      ],
      'logic': [
        { id: '1', lessonId: '1', title: 'Pattern Recognizer', description: 'What comes next?', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'PatternRecognizer' },
        { id: '2', lessonId: '2', title: 'Spatial Puzzle', description: 'Guide the robot', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'SpatialPuzzle' },
        { id: '3', lessonId: '3', title: 'Classification Sorter', description: 'Sort objects', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'ClassificationSorter' },
        { id: '4', lessonId: '4', title: 'Memory Match', description: 'Find matching pairs', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'MemoryMatch' },
      ],
      'engineering': [
        { id: '1', lessonId: '1', title: 'Bridge Builder', description: 'Build a strong bridge', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'BridgeBuilder' },
        { id: '2', lessonId: '2', title: 'Tower Builder', description: 'Build a tall tower', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'TowerBuilder' },
        { id: '3', lessonId: '3', title: 'Animal Crossing', description: 'Help the fox cross', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'AnimalCrossing' },
        { id: '4', lessonId: '4', title: 'Lego Builder', description: 'Build 50 Lego towers', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'LegoBuilder' },
        { id: '5', lessonId: '5', title: 'Puzzle Builder', description: 'Assemble 50 puzzles', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'PuzzleBuilder' },
      ],
      'arabic': [
        { id: '1', lessonId: '1', title: 'Arabic Letters', description: 'Learn the alphabet', tag: 'Level 1', tagColor: 'border-emerald-500 text-emerald-400', status: 'available', componentId: 'ArabicLetters' },
        { id: '2', lessonId: '2', title: 'Arabic Words', description: 'Learn basic vocabulary', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'ArabicWords' },
        { id: '3', lessonId: '3', title: 'Arabic Reading', description: 'Read with Harakat', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'ArabicReading' },
      ],
      'wellbeing': [
        { id: '1', lessonId: '1', title: 'Emotion Match', description: 'Recognize different feelings', tag: 'Level 1', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'EmotionMatch' },
        { id: '2', lessonId: '2', title: 'Feelings Journal', description: 'Express how you feel', tag: 'Level 1', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'FeelingsJournal' },
        { id: '3', lessonId: '3', title: 'Empathy Builder', description: 'Understanding others', tag: 'Level 2', tagColor: 'border-teal-500 text-teal-400', status: 'available', componentId: 'EmpathyBuilder' },
        { id: '4', lessonId: '4', title: 'Calm Corner', description: 'Practice mindful breathing', tag: 'Level 2', tagColor: 'border-teal-500 text-teal-400', status: 'available', componentId: 'CalmCorner' },
      ],
      'robotics': [
        { id: '1', lessonId: '1', title: 'Robot Explorer', description: 'Learn robot parts & sensors', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'RobotExplorer' },
        { id: '2', lessonId: '2', title: 'Robot Sequencer', description: 'Program the robot to move', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'Sequencer' },
        { id: '3', lessonId: '3', title: 'Robot Designer', description: 'Build a robot within budget', tag: 'Level 3', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'RobotDesigner' },
      ],
      'digital': [
        { id: '1', lessonId: '1', title: 'Computational Thinking', description: 'Solve code puzzles', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'ComputationalThinking' },
        { id: '2', lessonId: '2', title: 'Coding Basics', description: 'Program the robot', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'CodingBasics' },
        { id: '3', lessonId: '3', title: 'Digital Safety', description: 'Stay safe online', tag: 'Level 2', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'DigitalSafety' },
        { id: '4', lessonId: '4', title: 'Computer Basics', description: 'Learn computer parts', tag: 'Level 1', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'ComputerBasics' },
      ],
    };
  };

  // --- GET LESSONS ---
  const getLessonsForSubject = (subject: string): LessonItem[] => {
    return getCurriculumForAge()[subject] || [];
  };

  // --- RENDER ---
  return (
    <>
      {showEmotionCheck && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <EmotionCheck onComplete={() => setShowEmotionCheck(false)} />
        </div>
      )}

      <div className="min-h-screen bg-app-bg text-white font-sans pt-16 pb-20 relative">
        
        {/* Top Profile Info */}
        {screen !== 'age' && (
          <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-app-bg/90 backdrop-blur-md border-b border-app-border">
            <div className="min-w-[60px]">
              {(screen === 'list' || screen === 'activity' || screen === 'dashboard') && (
                <BackButton onClick={handleBack} label="Back" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg">{currentProfileId ? profiles[currentProfileId]?.avatar : '👤'}</span>
              <span className="font-bold">{childName || 'Guest'}</span>
              <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">Age {childAge}</span>
            </div>

            <div className="min-w-[60px] flex justify-end gap-2">
              {screen === 'subjects' && (
                <>
                  <button onClick={handleOpenPortal} className="text-xs bg-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-500 text-white">👨‍👩‍👧‍👦 Parents</button>
                  <button onClick={handleStartOver} className="text-xs bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600 text-white">🔄 Start Over</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SCREENS */}
        {screen === 'age' && <AgeGate onSelect={handleAgeSelect} />}
        {screen === 'subjects' && <LearningWorld onSelect={handleSubjectSelect} />}

        {/* NEW: Dashboard (Inside a World) */}
        {screen === 'dashboard' && (
          <SubjectDashboard 
            worldId={currentWorld} 
            onSelect={handleWorldSubjectSelect} 
            onBack={() => setScreen('subjects')}
          />
        )}

        {screen === 'list' && (
          <SubjectLessonList 
            subjectName={currentList === 'practical-life' ? 'The Garden' : currentList === 'art' ? 'Art Studio' : currentList === 'sensorial' ? 'Sensorial Room' : currentList === 'geography' ? 'Globe Corner' : currentList === 'writing' ? 'Writing Studio' : currentList === 'logic' ? 'Logic Lab' : currentList === 'engineering' ? 'Build Lab' : currentList === 'arabic' ? 'Arabic Language' : currentList === 'wellbeing' ? 'Wellbeing' : currentList.charAt(0).toUpperCase() + currentList.slice(1)} 
            lessons={getLessonsForSubject(currentList)} 
            onSelectLesson={handleLessonSelect} 
            onBack={() => setScreen('dashboard')}
          />
        )}

        {screen === 'activity' && (
          <div className="flex flex-col items-center justify-center pt-4 relative w-full min-h-[70vh]">
            <button 
              onClick={() => setShowHelp(true)}
              className="absolute top-0 right-0 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full text-white flex items-center justify-center text-xl font-bold transition"
            >
              ?
            </button>

            <div className="w-full flex justify-center">
              {currentActivityId === 'SentenceBuilder' && <SentenceBuilder onComplete={handleActivityComplete} />}
              {currentActivityId === 'SoundLottery' && <SoundLottery onComplete={handleActivityComplete} />}
              {currentActivityId === 'VocabularyBuilder' && <VocabularyBuilder onComplete={handleActivityComplete} />}
              {currentActivityId === 'WordFamilies' && <WordFamilies />}
              {currentActivityId === 'PhonicsBlender' && <PhonicsBlender />}
              {currentActivityId === 'StoryReader' && <StoryReader />}
              {currentActivityId === 'GoldenBeads' && <GoldenBeads onComplete={handleActivityComplete} />}
              {currentActivityId === 'NumberOperations' && <NumberOperations />}
              {currentActivityId === 'TracingNumbers' && <TracingNumbers />}
              {currentActivityId === 'AbacusWidget' && <AbacusWidget onComplete={handleActivityComplete} />}
              {currentActivityId === 'NumberSense' && <NumberSense />}
              {currentActivityId === 'AdditionGame' && <AdditionGame />}
              {currentActivityId === 'SubtractionGame' && <SubtractionGame />}
              {currentActivityId === 'MultiplicationGame' && <MultiplicationGame />}
              {currentActivityId === 'DivisionGame' && <DivisionGame />}
              {currentActivityId === 'FractionsGame' && <FractionsGame />}
              {currentActivityId === 'MoneyGame' && <MoneyGame />}
              {currentActivityId === 'ClockGame' && <ClockGame />}
              {currentActivityId === 'BiologyLab' && <ScienceLab type="biology" />}
              {currentActivityId === 'PhysicsLab' && <ScienceLab type="physics" />}
              {currentActivityId === 'ChemistryLab' && <ScienceLab type="chemistry" />}
              {currentActivityId === 'TracingCanvas' && <TracingCanvas />}
              {currentActivityId === 'LetterTracing' && <LetterTracing />}
              {currentActivityId === 'NumberTracing' && <NumberTracing />}
              {currentActivityId === 'WordBuilder' && <WordBuilder />}
              {currentActivityId === 'SightWords' && <SightWords />}
              {currentActivityId === 'CreativeWriting' && <CreativeWriting />}
              {currentActivityId === 'HandwritingPractice' && <HandwritingPractice />}
              {currentActivityId === 'WashingHands' && <WashingHands />}
              {currentActivityId === 'BrushingTeeth' && <BrushingTeeth />}
              {currentActivityId === 'SettingTable' && <SettingTable />}
              {currentActivityId === 'FoldingClothes' && <FoldingClothes />}
              {currentActivityId === 'TyingShoes' && <TyingShoes />}
              {currentActivityId === 'WateringPlants' && <WateringPlants />}
              {currentActivityId === 'PinkTower' && <PinkTower />}
              {currentActivityId === 'BrownStair' && <BrownStair />}
              {currentActivityId === 'RedRods' && <RedRods />}
              {currentActivityId === 'ColorTablets' && <ColorTablets />}
              {currentActivityId === 'SoundBoxes' && <SoundBoxes />}
              {currentActivityId === 'RoughSmooth' && <RoughSmooth />}
              {currentActivityId === 'ThermicTablets' && <ThermicTablets />}
              {currentActivityId === 'ContinentExplorer' && <ContinentExplorer />}
              {currentActivityId === 'Landforms' && <Landforms />}
              {currentActivityId === 'FlagMatch' && <FlagMatch />}
              {currentActivityId === 'MapReader' && <MapReader />}
              {currentActivityId === 'OceanExplorer' && <OceanExplorer />}
              {currentActivityId === 'NaturalWonders' && <NaturalWonders />}
              {currentActivityId === 'GlobeExplorer' && <GlobeExplorer />}
              {currentActivityId === 'ColorMixer' && <ColorMixer />}
              {currentActivityId === 'ShapesPainter' && <ShapesPainter />}
              {currentActivityId === 'DrawingCanvas' && <DrawingCanvas />}
              {currentActivityId === 'StickerBoard' && <StickerBoard />}
              {currentActivityId === 'PatternMaker' && <PatternMaker />}
              {currentActivityId === 'ArtGallery' && <ArtGallery />}
              {currentActivityId === 'PatternRecognizer' && <PatternRecognizer />}
              {currentActivityId === 'SpatialPuzzle' && <SpatialPuzzle />}
              {currentActivityId === 'ClassificationSorter' && <ClassificationSorter />}
              {currentActivityId === 'MemoryMatch' && <MemoryMatch />}
              {currentActivityId === 'BridgeBuilder' && <BridgeBuilder />}
              {currentActivityId === 'TowerBuilder' && <TowerBuilder />}
              {currentActivityId === 'AnimalCrossing' && <AnimalCrossing />}
              {currentActivityId === 'ArabicLetters' && <ArabicLetters />}
              {currentActivityId === 'ArabicWords' && <ArabicWords />}
              {currentActivityId === 'ArabicReading' && <ArabicReading />}
              {currentActivityId === 'EmotionMatch' && <EmotionMatch />}
              {currentActivityId === 'FeelingsJournal' && <FeelingsJournal />}
              {currentActivityId === 'EmpathyBuilder' && <EmpathyBuilder />}
              {currentActivityId === 'CalmCorner' && <CalmCorner />}
              {currentActivityId === 'RobotExplorer' && <RobotExplorer />}
              {currentActivityId === 'Sequencer' && <Sequencer />}
              {currentActivityId === 'RobotDesigner' && <RobotDesigner />}
              {currentActivityId === 'LegoBuilder' && <LegoBuilder />}
              {currentActivityId === 'PuzzleBuilder' && <PuzzleBuilder />}
              {currentActivityId === 'ComputationalThinking' && <ComputationalThinking />}
              {currentActivityId === 'CodingBasics' && <CodingBasics />}
              {currentActivityId === 'DigitalSafety' && <DigitalSafety />}
              {currentActivityId === 'ComputerBasics' && <ComputerBasics />}
            </div>
            
            <HelpGuide 
              isOpen={showHelp} 
              onClose={() => setShowHelp(false)} 
              title={currentActivityId}
              steps={getHelpSteps(currentActivityId)}
            />
          </div>
        )}

        {/* Parent Portal Screen */}
        {screen === 'portal' && (
          <div className="flex justify-center pt-4">
            <ParentPortal onBack={() => setScreen('subjects')} />
          </div>
        )}

        {/* Bottom Right Circular Switch Button */}
        {screen !== 'age' && screen !== 'portal' && (
          <button
            onClick={() => setScreen('age')}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-2xl border-2 border-white/20 text-white text-2xl font-bold flex items-center justify-center transition-all"
            title="Switch Profile"
          >
            👤
          </button>
        )}
      </div>
    </>
  );
}

export default App;