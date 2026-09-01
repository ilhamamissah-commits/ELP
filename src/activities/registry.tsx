import React from 'react';
import { AbacusWidget } from '../components/interactive/Maths/AbacusWidget';
import { GoldenBeads } from '../components/interactive/Maths/GoldenBeads';
import { NumberOperations } from '../components/interactive/Maths/NumberOperations';
import { TracingNumbers } from '../components/interactive/Maths/TracingNumbers';
import { SentenceBuilder } from '../components/interactive/Reading/SentenceBuilder';
import { SoundLottery } from '../components/interactive/Reading/SoundLottery';
import { VocabularyBuilder } from '../components/interactive/Reading/VocabularyBuilder';
import { WordFamilies } from '../components/interactive/Reading/WordFamilies';
import { PhonicsBlender } from '../components/interactive/Reading/PhonicsBlender';
import { StoryReader } from '../components/interactive/Reading/StoryReader';
import { ScienceLab } from '../components/interactive/Science/ScienceLab';
import { VirtualLab } from '../components/interactive/Science/VirtualLab';
import { TracingCanvas } from '../components/interactive/Writing/TracingCanvas';
import { WashingHands } from '../components/interactive/PracticalLife/WashingHands';
import { PinkTower } from '../components/interactive/Sensorial/PinkTower';
import { GlobeExplorer } from '../components/interactive/Geography/GlobeExplorer';
import { ColorMixer } from '../components/interactive/Art/ColorMixer';
import { EarlyExplorerActivity } from '../components/interactive/EarlyExplorer/EarlyExplorerActivity';
import { ActivityProps } from './types';

const score = (onComplete: ActivityProps['onComplete']) => (value: number) => onComplete({ score: value });
const staticActivity = (Component: React.ComponentType) => ({ onComplete: _ }: ActivityProps) => <Component />;

const activityRegistry: Record<string, React.ComponentType<ActivityProps>> = {
  SentenceBuilder: ({ onComplete }) => <SentenceBuilder onComplete={score(onComplete)} />,
  SoundLottery: ({ onComplete }) => <SoundLottery onComplete={score(onComplete)} />,
  VocabularyBuilder: ({ onComplete }) => <VocabularyBuilder onComplete={score(onComplete)} />,
  GoldenBeads: ({ onComplete }) => <GoldenBeads onComplete={score(onComplete)} />,
  AbacusWidget: ({ onComplete }) => <AbacusWidget _onComplete={score(onComplete)} />,
  VirtualLab: ({ onComplete }) => <VirtualLab onComplete={score(onComplete)} />,
  BiologyLab: ({ onComplete }) => <ScienceLab type="biology" onSelectExperiment={() => onComplete({ score: 100 })} />,
  PhysicsLab: ({ onComplete }) => <ScienceLab type="physics" onSelectExperiment={() => onComplete({ score: 100 })} />,
  NumberOperations: staticActivity(NumberOperations),
  TracingNumbers: staticActivity(TracingNumbers),
  WordFamilies: staticActivity(WordFamilies),
  PhonicsBlender: staticActivity(PhonicsBlender),
  StoryReader: staticActivity(StoryReader),
  TracingCanvas: staticActivity(TracingCanvas),
  WashingHands: staticActivity(WashingHands),
  PinkTower: staticActivity(PinkTower),
  GlobeExplorer: staticActivity(GlobeExplorer),
  ColorMixer: staticActivity(ColorMixer),
  EarlyExplorerActivity: ({ onComplete, lessonId }) => <EarlyExplorerActivity lessonId={lessonId} onComplete={score(onComplete)} />
};

export function ActivityRenderer({ activityId, onComplete, lessonId }: ActivityProps & { activityId: string }) {
  const Component = activityRegistry[activityId];
  return Component ? <Component onComplete={onComplete} lessonId={lessonId} /> : <p className="text-red-300">This activity is not available yet.</p>;
}
