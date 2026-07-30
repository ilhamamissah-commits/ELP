import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Assignment {
  id: string;
  studentId: string;
  lessonId: string;
  assignedDate: string;
  completed: boolean;
}

interface ClassroomState {
  classCode: string;
  students: Record<string, string>; // studentId: studentName
  assignments: Assignment[];
  createClass: (code: string) => void;
  addStudent: (studentId: string, name: string) => void;
  assignLesson: (studentId: string, lessonId: string) => void;
  markCompleted: (studentId: string, lessonId: string) => void;
}

export const useClassroomStore = create<ClassroomState>()(
  persist(
    (set, ) => ({
      classCode: '',
      students: {},
      assignments: [],
      
      createClass: (code) => set({ classCode: code }),
      
      addStudent: (studentId, name) => set((state) => ({
        students: { ...state.students, [studentId]: name }
      })),
      
      assignLesson: (studentId, lessonId) => set((state) => ({
        assignments: [...state.assignments, {
          id: Date.now().toString(),
          studentId,
          lessonId,
          assignedDate: new Date().toISOString(),
          completed: false
        }]
      })),
      
      markCompleted: (studentId, lessonId) => set((state) => ({
        assignments: state.assignments.map(a => 
          a.studentId === studentId && a.lessonId === lessonId 
            ? { ...a, completed: true } 
            : a
        )
      }))
    }),
    { name: 'classroom-storage' }
  )
);