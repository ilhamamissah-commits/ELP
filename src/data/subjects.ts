import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Brain,
  Languages,
} from 'lucide-react';

export type SubjectDomain =
  | 'literacy'
  | 'numeracy'
  | 'language'
  | 'science'
  | 'reasoning';

export interface SubjectDefinition {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  domain: SubjectDomain;
  skillAreas: readonly string[];
  isFoundational: boolean;
}

/**
 * Subject metadata only.
 *
 * This file does NOT determine:
 * - learner level
 * - readiness
 * - prerequisites
 * - mastery
 * - lesson availability
 *
 * Those decisions belong to the Learning Engine.
 */
export const SUBJECTS: readonly SubjectDefinition[] = [
  {
    id: 'english',
    label: 'English',
    description: 'Phonics, vocabulary, reading, writing and communication.',
    icon: BookOpen,
    colorClass: 'bg-blue-500',
    domain: 'literacy',
    skillAreas: [
      'phonological-awareness',
      'phonics',
      'vocabulary',
      'reading',
      'writing',
      'comprehension',
    ],
    isFoundational: true,
  },
  {
    id: 'maths',
    label: 'Mathematics',
    description: 'Numbers, operations, patterns, measurement and geometry.',
    icon: Calculator,
    colorClass: 'bg-yellow-500',
    domain: 'numeracy',
    skillAreas: [
      'number-sense',
      'counting',
      'operations',
      'patterns',
      'measurement',
      'geometry',
      'mathematical-reasoning',
    ],
    isFoundational: true,
  },
  {
    id: 'science',
    label: 'Science',
    description: 'Nature, observation, experiments, evidence and discovery.',
    icon: FlaskConical,
    colorClass: 'bg-red-500',
    domain: 'science',
    skillAreas: [
      'observation',
      'classification',
      'experimentation',
      'scientific-reasoning',
      'living-things',
      'physical-world',
    ],
    isFoundational: false,
  },
  {
    id: 'abacus',
    label: 'Abacus',
    description: 'Soroban technique, number representation and mental calculation.',
    icon: Calculator,
    colorClass: 'bg-orange-500',
    domain: 'numeracy',
    skillAreas: [
      'number-representation',
      'place-value',
      'abacus-technique',
      'mental-calculation',
      'calculation-fluency',
    ],
    isFoundational: false,
  },
  {
    id: 'language',
    label: 'Languages',
    description: 'Additional language development through vocabulary and communication.',
    icon: Languages,
    colorClass: 'bg-indigo-500',
    domain: 'language',
    skillAreas: [
      'vocabulary',
      'listening',
      'speaking',
      'sentence-formation',
      'language-comprehension',
    ],
    isFoundational: false,
  },
  {
    id: 'thinking',
    label: 'Thinking & Reasoning',
    description: 'Logic, memory, patterns, problem solving and critical thinking.',
    icon: Brain,
    colorClass: 'bg-cyan-500',
    domain: 'reasoning',
    skillAreas: [
      'pattern-recognition',
      'classification',
      'memory',
      'logic',
      'problem-solving',
      'critical-thinking',
    ],
    isFoundational: false,
  },
];

export const SUBJECT_BY_ID: Readonly<Record<string, SubjectDefinition>> =
  Object.fromEntries(
    SUBJECTS.map((subject) => [subject.id, subject]),
  );

export function getSubjectById(
  subjectId: string,
): SubjectDefinition | undefined {
  return SUBJECT_BY_ID[subjectId];
}

export function getSubjectsByDomain(
  domain: SubjectDomain,
): readonly SubjectDefinition[] {
  return SUBJECTS.filter((subject) => subject.domain === domain);
}