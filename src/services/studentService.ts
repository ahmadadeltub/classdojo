import { Student } from '../types';
import { storageService } from './storageService';

export const studentService = {
  getStudents: (): Student[] => {
    return storageService.get<Student>('STUDENTS');
  },

  getStudentsByClass: (classId: string): Student[] => {
    return studentService.getStudents().filter(s => s.classId === classId);
  },

  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'positivePoints' | 'improvementPoints' | 'badges' | 'notes'>): Student => {
    const students = studentService.getStudents();
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      positivePoints: 0,
      improvementPoints: 0,
      badges: [],
      notes: [],
      createdAt: new Date().toISOString(),
    };
    storageService.set('STUDENTS', [...students, newStudent]);
    return newStudent;
  },

  updateStudent: (id: string, updatedStudent: Partial<Student>): void => {
    const students = studentService.getStudents();
    const updated = students.map(s => s.id === id ? { ...s, ...updatedStudent } : s);
    storageService.set('STUDENTS', updated);
  },

  deleteStudent: (id: string): void => {
    const students = studentService.getStudents();
    storageService.set('STUDENTS', students.filter(s => s.id !== id));
  }
};
