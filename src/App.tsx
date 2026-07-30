import { useState, useEffect } from 'react';
import { AgeGate } from './components/onboarding/AgeGate';
import { LearningWorld } from './components/dashboard/LearningWorld';
import { SubjectLessonList, LessonItem } from './components/dashboard/SubjectLessonList';
import { SentenceBuilder } from './components/interactive/Reading/SentenceBuilder';
import { SoundLottery } from './components/interactive/Reading/SoundLottery';
import { VocabularyBuilder } from './components/interactive/Reading/VocabularyBuilder';
import { WordFamilies } from './components/interactive/Reading/WordFamilies';
import { GoldenBeads } from './components/interactive/Maths/GoldenBeads';
import { AbacusWidget } from './components/interactive/Maths/AbacusWidget';
import { ScienceLab } from './components/interactive/Science/ScienceLab';
import { VirtualLab } from './components/interactive/Science/VirtualLab';
import { TracingCanvas } from './components/interactive/Writing/TracingCanvas';
import { ProfileSwitcher } from './components/onboarding/ProfileSwitcher';
import { useProgressStore } from './store/useProgressStore';
import { useProfileStore } from './store/useProfileStore';
import { BackButton } from './components/core/BackButton';
import { HelpGuide } from './components/core/HelpGuide';
import { PhonicsBlender } from './components/interactive/Reading/PhonicsBlender';
import { StoryReader } from './components/interactive/Reading/StoryReader';
import { WashingHands } from './components/interactive/PracticalLife/WashingHands';
import { PinkTower } from './components/interactive/Sensorial/PinkTower';
import { GlobeExplorer } from './components/interactive/Geography/GlobeExplorer';
import { ColorMixer } from './components/interactive/Art/ColorMixer';
import { ParentPortal } from './components/dashboard/ParentPortal';
import { EmotionCheck } from './components/core/EmotionCheck';
import { NumberOperations } from './components/interactive/Maths/NumberOperations';
import { TracingNumbers } from './components/interactive/Maths/TracingNumbers';


type Screen = 'age' | 'subjects' | 'list' | 'activity' | 'profiles' | 'portal';

function App() {
  const [screen, setScreen] = useState<Screen>('age');
  const [currentList, setCurrentList] = useState<string>('');
  const [currentActivityId, setCurrentActivityId] = useState<string>('');
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const { setProfile, childName, childAge } = useProgressStore();
  const { currentProfileId, profiles, setCurrentProfile, addProfile } = useProfileStore();
  const [showEmotionCheck, setShowEmotionCheck] = useState(true);
 
  // Auto-login logic
  useEffect(() => {
    if (currentProfileId && profiles[currentProfileId]) {
      const p = profiles[currentProfileId];
      setProfile(p.age, p.name);
      setScreen('subjects');
    }
  }, [currentProfileId, profiles]);

  // --- GET HELP STEPS ---
  const getHelpSteps = (id: string): string[] => {
    switch(id) {
      case 'SentenceBuilder': 
        return ['Look at the target sentence.', 'Tap the words below to build the sentence.', 'The screen will turn green when you get it right!'];
      case 'SoundLottery':
        return ['Tap the speaker button to hear the target sound.', 'Tap a card to flip it.', 'Find all 3 cards with the correct sound!'];
      case 'VocabularyBuilder':
        return ['Look at the word and emoji.', 'Listen to the pronunciation.', 'Tap "Next Word" to learn more!'];
      case 'GoldenBeads':
        return ['Use the + and - buttons to add or remove beads.', 'Build the target number shown at the top.', 'Click "Check Answer" to see if you are right!'];
      case 'AbacusWidget':
        return ['Click the beads to move them up and down.', 'Heaven beads (top) = 5. Earth beads (bottom) = 1.', 'Use the Quiz mode to test your skills!'];
      case 'VirtualLab':
        return ['Read the question.', 'Click "Next Step" to perform the experiment.', 'Read the conclusion at the end!'];
      default:
        return ['Select an activity and start learning!'];
    }
  };

     // --- MASTER CURRICULUM REGISTRY (AGE AWARE) ---
  const getCurriculumForAge = (): Record<string, LessonItem[]> => {
    const { childAge } = useProgressStore.getState();
    
    // SHARED ART CONTENT (Available to everyone - Perfectly Typed)
    const artLessons: LessonItem[] = [
      { id: '1', title: 'Color Mixing', description: 'Mix primary colors to make new ones', tag: 'Art', tagColor: 'border-pink-500 text-pink-400', status: 'available', componentId: 'ColorMixer' },
      { id: '2', title: 'Drawing Basics', description: 'Learn to draw basic shapes', tag: 'Art', tagColor: 'border-pink-500 text-pink-400', status: 'available', componentId: 'TracingCanvas' },
    ];

    // LITTLE EXPLORER (2-4)
    if (childAge <= 4) {
      return {
        'art': artLessons,
        'english': [
          { id: '1', title: 'Sound Awareness', description: 'Listen and identify sounds', tag: 'Phonics', tagColor: 'border-blue-500 text-blue-400', status: 'available', componentId: 'SoundLottery' },
          { id: '2', title: 'Word Families', description: 'Group words with similar endings', tag: 'Phonics', tagColor: 'border-blue-500 text-blue-400', status: 'available', componentId: 'WordFamilies' },
        ],
        'practical-life': [
          { id: '1', title: 'Washing Hands', description: 'Learn to clean your hands', tag: 'Hygiene', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'WashingHands' },
        ],
        'sensorial': [
          { id: '1', title: 'Pink Tower', description: 'Arrange blocks by size', tag: 'Sensorial', tagColor: 'border-pink-500 text-pink-400', status: 'available', componentId: 'PinkTower' },
        ]
      };
    }

    // CURIOUS THINKER (4-6)
    if (childAge <= 6) {
      return {
        'art': artLessons,
        'english': [
          { id: '1', title: 'Sentence Builder', description: 'Construct sentences', tag: 'Grammar', tagColor: 'border-red-500 text-red-400', status: 'available', componentId: 'SentenceBuilder' },
          { id: '2', title: 'Describing Words', description: 'Learn adjectives', tag: 'Vocabulary', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'VocabularyBuilder' },
        ],
        'maths': [
          { id: '1', title: 'Golden Beads', description: 'Build numbers', tag: 'Counting', tagColor: 'border-yellow-500 text-yellow-400', status: 'available', componentId: 'GoldenBeads' },
          { id: '2', title: 'Number Operations', description: 'Add and subtract', tag: 'Arithmetic', tagColor: 'border-green-500 text-green-400', status: 'available', componentId: 'NumberOperations' },
        ],
        'science': [
          { id: '1', title: 'Biology Lab', description: 'Explore plants and animals', tag: 'Life Science', tagColor: 'border-emerald-500 text-emerald-400', status: 'available', componentId: 'BiologyLab' },
        ],
        'geography': [
          { id: '1', title: 'Globe Explorer', description: 'Tap countries', tag: 'Geography', tagColor: 'border-cyan-500 text-cyan-400', status: 'available', componentId: 'GlobeExplorer' },
        ]
      };
    }

    // CONFIDENT SCHOLAR (6-8)
    if (childAge <= 8) {
      return {
        'art': artLessons,
        'english': [
          { id: '1', title: 'Phonics Blender', description: 'Blend sounds to read', tag: 'Reading', tagColor: 'border-blue-500 text-blue-400', status: 'available', componentId: 'PhonicsBlender' },
          { id: '2', title: 'Story Time', description: 'Interactive stories', tag: 'Reading', tagColor: 'border-pink-500 text-pink-400', status: 'available', componentId: 'StoryReader' },
        ],
        'maths': [
          { id: '1', title: 'Tracing Numbers', description: 'Write numbers 0-9', tag: 'Writing', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'TracingNumbers' },
        ],
        'geography': [
          { id: '1', title: 'Globe Explorer', description: 'Tap countries', tag: 'Geography', tagColor: 'border-cyan-500 text-cyan-400', status: 'available', componentId: 'GlobeExplorer' },
        ]
      };
    }

    // MASTER LEARNER (8-10)
    return {
      'art': artLessons,
      'abacus': [
        { id: '1', title: 'Mental Math', description: 'Solve sums in your head', tag: 'Mental', tagColor: 'border-purple-500 text-purple-400', status: 'available', componentId: 'AbacusWidget' },
      ],
      'english': [
        { id: '1', title: 'Creative Writing', description: 'Write your own stories', tag: 'Writing', tagColor: 'border-indigo-500 text-indigo-400', status: 'available', componentId: 'TracingCanvas' },
      ],
      'science': [
        { id: '1', title: 'Physics Lab', description: 'Sink/Float & Magnets', tag: 'Physical Science', tagColor: 'border-blue-500 text-blue-400', status: 'available', componentId: 'PhysicsLab' },
      ],
      'geography': [
          { id: '1', title: 'Globe Explorer', description: 'Tap countries', tag: 'Geography', tagColor: 'border-cyan-500 text-cyan-400', status: 'available', componentId: 'GlobeExplorer' },
        ]
    };
  };

  // --- GET LESSONS ---
  const getLessonsForSubject = (subject: string): LessonItem[] => {
    const curriculum = getCurriculumForAge();
    return curriculum[subject] || [];
  };
  // --- HANDLERS ---
  const handleAgeSelect = (age: number, name: string) => {
    const newId = `child-${Date.now()}`;
    const avatar = age <= 4 ? '🐣' : age <= 7 ? '🦊' : '🦉';
    addProfile(newId, name, age, avatar);
    setCurrentProfile(newId);
    setProfile(age, name);
    setScreen('subjects');
  };

  const handleSubjectSelect = (subjectId: string) => {
    setCurrentList(subjectId);
    setScreen('list');
  };

  const handleLessonSelect = (componentId: string) => {
    setCurrentActivityId(componentId);
    setScreen('activity');
  };

  const handleBack = () => {
    if (screen === 'activity') {
      setScreen('list');
    } else if (screen === 'list') {
      setScreen('subjects');
    } else if (screen === 'subjects') {
      setCurrentProfile(""); 
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
      setShowProfileSwitcher(false);
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

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-app-bg text-white font-sans pt-20 pb-20 relative">
      
      {/* --- TOP HEADER / PROFILE (Appears on ALL screens except Age) --- */}
      {screen !== 'age' && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-app-bg/90 backdrop-blur-md border-b border-app-border">
          
          {/* Left: Back Button (Only for List and Activity) */}
          <div className="min-w-[60px]">
            {(screen === 'list' || screen === 'activity') && (
              <BackButton onClick={handleBack} label="Back" />
            )}
            {screen === 'subjects' && (
              <button onClick={handleBack} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full text-gray-300 transition">
                Switch Child
              </button>
            )}
            {screen === 'portal' && (
              <BackButton onClick={() => setScreen('subjects')} label="Back to World" />
            )}
          </div>

          {/* Center: Profile Info */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentProfileId ? profiles[currentProfileId]?.avatar : '👤'}</span>
            <span className="font-bold">{childName || 'Guest'}</span>
            <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">Age {childAge}</span>
          </div>

          {/* Right: Switch Button */}
          <div className="min-w-[60px] flex justify-end">
            <button 
              onClick={() => setShowProfileSwitcher(true)}
              className="text-xs bg-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-500 transition text-white"
            >
              Switch
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN SCREENS --- */}
      {screen === 'age' && <AgeGate onSelect={handleAgeSelect} />}
      
      {screen === 'subjects' && (
        <LearningWorld 
          onSelect={handleSubjectSelect} 
          onOpenPortal={handleOpenPortal} 
        />
      )}

            {screen === 'list' && (
        <SubjectLessonList 
          subjectName={
            currentList === 'practical-life' ? 'The Garden' : 
            currentList === 'art' ? 'Art Studio' : 
            currentList === 'sensorial' ? 'Sensorial Room' : 
            currentList === 'geography' ? 'Globe Corner' : 
            currentList === 'vocabulary' ? 'Library' :
            currentList.charAt(0).toUpperCase() + currentList.slice(1)
          } 
          lessons={getLessonsForSubject(currentList)} 
          onSelectLesson={handleLessonSelect} 
          onBack={handleBack}
        />
      )}

      {screen === 'activity' && (
        <div className="flex flex-col items-center justify-center pt-4 relative w-full min-h-[70vh]">
          
          {/* Emotion Check */}
          {showEmotionCheck && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <EmotionCheck onComplete={() => setShowEmotionCheck(false)} />
            </div>
          )}

          <button 
            onClick={() => setShowHelp(true)}
            className="absolute top-0 right-0 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full text-white flex items-center justify-center text-xl font-bold transition"
          >
            ?
          </button>

          <div className="w-full flex justify-center">
            {/* Core Components */}
            {currentActivityId === 'SentenceBuilder' && <SentenceBuilder onComplete={handleActivityComplete} />}
            {currentActivityId === 'SoundLottery' && <SoundLottery onComplete={handleActivityComplete} />}
            {currentActivityId === 'VocabularyBuilder' && <VocabularyBuilder onComplete={handleActivityComplete} />}
            {currentActivityId === 'GoldenBeads' && <GoldenBeads onComplete={handleActivityComplete} />}
            {currentActivityId === 'NumberOperations' && <NumberOperations />}
            {currentActivityId === 'TracingNumbers' && <TracingNumbers />}
            {currentActivityId === 'AbacusWidget' && <AbacusWidget _onComplete={handleActivityComplete} />}
            {currentActivityId === 'VirtualLab' && <VirtualLab onComplete={handleActivityComplete} />}
            {currentActivityId === 'WordFamilies' && <WordFamilies />}
            {currentActivityId === 'BiologyLab' && <ScienceLab type="biology" onSelectExperiment={handleExperimentSelect} />}
            {currentActivityId === 'PhysicsLab' && <ScienceLab type="physics" onSelectExperiment={handleExperimentSelect} />}

            {/* Newly Connected Components */}
            {currentActivityId === 'PhonicsBlender' && <PhonicsBlender />}
            {currentActivityId === 'StoryReader' && <StoryReader />}
            {currentActivityId === 'TracingCanvas' && <TracingCanvas />}
            {currentActivityId === 'WashingHands' && <WashingHands />}
            {currentActivityId === 'PinkTower' && <PinkTower />}
            {currentActivityId === 'GlobeExplorer' && <GlobeExplorer />}
            {currentActivityId === 'ColorMixer' && <ColorMixer />}
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

      <ProfileSwitcher 
        isOpen={showProfileSwitcher} 
        onClose={() => setShowProfileSwitcher(false)} 
        onSwitch={handleSwitchProfile} 
      />
    </div>
  );
}

export default App;