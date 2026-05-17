export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  createdAt: string;
}

export interface Student {
  id: string;
  fullName: string;
  classId: string;
  avatarColor: string;
  positivePoints: number;
  improvementPoints: number;
  badges: string[];
  notes: string[];
  createdAt: string;
}

export type PointType = 'positive' | 'improvement';

export interface PointRecord {
  id: string;
  studentId: string;
  classId: string;
  type: PointType;
  reason: string;
  value: number;
  note?: string;
  date: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Settings {
  teacherName: string;
  schoolName: string;
  academicYear: string;
  language: 'ar' | 'en';
}
