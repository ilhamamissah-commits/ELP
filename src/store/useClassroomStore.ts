import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Assignment {
  id: string;
  studentId: string;
  lessonId: string;
  assignedDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  joinedDate: string;
}

interface ClassroomState {
  classCode: string;
  students: Record<string, ClassroomStudent>;
  assignments: Assignment[];

  createClass: (code: string) => void;

  addStudent: (
    studentId: string,
    name: string
  ) => void;

  removeStudent: (
    studentId: string
  ) => void;

  assignLesson: (
    studentId: string,
    lessonId: string
  ) => void;

  markCompleted: (
    studentId: string,
    lessonId: string
  ) => void;

  unmarkCompleted: (
    studentId: string,
    lessonId: string
  ) => void;

  clearClassroom: () => void;
}

const generateId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

export const useClassroomStore =
  create<ClassroomState>()(
    persist(
      (set) => ({
        classCode: '',
        students: {},
        assignments: [],

        createClass: (code) =>
          set({
            classCode: code.trim(),
          }),

        addStudent: (studentId, name) =>
          set((state) => {
            const trimmedId = studentId.trim();
            const trimmedName = name.trim();

            if (!trimmedId || !trimmedName) {
              return state;
            }

            // Do not create duplicate students.
            if (state.students[trimmedId]) {
              return state;
            }

            return {
              students: {
                ...state.students,
                [trimmedId]: {
                  id: trimmedId,
                  name: trimmedName,
                  joinedDate: new Date().toISOString(),
                },
              },
            };
          }),

        removeStudent: (studentId) =>
          set((state) => {
            const students = {
              ...state.students,
            };

            delete students[studentId];

            return {
              students,
              assignments: state.assignments.filter(
                (assignment) =>
                  assignment.studentId !== studentId
              ),
            };
          }),

        assignLesson: (studentId, lessonId) =>
          set((state) => {
            const student =
              state.students[studentId];

            const trimmedLessonId = lessonId.trim();

            if (!student || !trimmedLessonId) {
              return state;
            }

            // Prevent duplicate active assignments.
            const alreadyAssigned =
              state.assignments.some(
                (assignment) =>
                  assignment.studentId === studentId &&
                  assignment.lessonId === trimmedLessonId &&
                  !assignment.completed
              );

            if (alreadyAssigned) {
              return state;
            }

            const assignment: Assignment = {
              id: generateId(),
              studentId,
              lessonId: trimmedLessonId,
              assignedDate:
                new Date().toISOString(),
              completed: false,
            };

            return {
              assignments: [
                ...state.assignments,
                assignment,
              ],
            };
          }),

        markCompleted: (studentId, lessonId) =>
          set((state) => {
            const completedDate =
              new Date().toISOString();

            return {
              assignments:
                state.assignments.map(
                  (assignment) =>
                    assignment.studentId ===
                      studentId &&
                    assignment.lessonId ===
                      lessonId
                      ? {
                          ...assignment,
                          completed: true,
                          completedDate,
                        }
                      : assignment
                ),
            };
          }),

        unmarkCompleted: (studentId, lessonId) =>
          set((state) => ({
            assignments:
              state.assignments.map(
                (assignment) =>
                  assignment.studentId ===
                    studentId &&
                  assignment.lessonId ===
                    lessonId
                    ? {
                        ...assignment,
                        completed: false,
                        completedDate: undefined,
                      }
                    : assignment
              ),
          })),

        clearClassroom: () =>
          set({
            classCode: '',
            students: {},
            assignments: [],
          }),
      }),
      {
        name: 'classroom-storage',
      }
    )
  );
