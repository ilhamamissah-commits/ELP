import React from 'react';
import { ActivityRenderer } from '../../activities/registry';
import { ActivityCompletion } from '../../activities/types';
import { ManagedActivity } from '../../curriculum/management';

interface CurriculumActivityProps {
  activity: ManagedActivity;
  onComplete: (completion: ActivityCompletion) => void;
}

/** Bridges catalog activities to the existing interactive components without embedding curriculum data in UI. */
export function CurriculumActivity({ activity, onComplete }: CurriculumActivityProps) {
  return <ActivityRenderer activityId={activity.rendererId} onComplete={onComplete} />;
}
