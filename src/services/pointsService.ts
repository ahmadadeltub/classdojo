import { PointRecord, PointType } from '../types';
import { storageService } from './storageService';
import { studentService } from './studentService';

export const pointsService = {
  getPoints: (): PointRecord[] => {
    return storageService.get<PointRecord>('POINTS');
  },

  addPoint: (record: Omit<PointRecord, 'id' | 'date'>): PointRecord => {
    const points = pointsService.getPoints();
    const newRecord: PointRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    storageService.set('POINTS', [newRecord, ...points]);

    // Update student totals
    const student = studentService.getStudents().find(s => s.id === record.studentId);
    if (student) {
      const update: any = {};
      if (record.type === 'positive') {
        update.positivePoints = student.positivePoints + record.value;
      } else {
        update.improvementPoints = student.improvementPoints + record.value;
      }
      studentService.updateStudent(student.id, update);
    }

    return newRecord;
  },

  getStudentHistory: (studentId: string): PointRecord[] => {
    return pointsService.getPoints().filter(p => p.studentId === studentId);
  }
};
