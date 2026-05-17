import { ClassRoom } from '../types';
import { storageService } from './storageService';

export const classService = {
  getClasses: (): ClassRoom[] => {
    return storageService.get<ClassRoom>('CLASSES');
  },

  addClass: (newClass: Omit<ClassRoom, 'id' | 'createdAt'>): ClassRoom => {
    const classes = classService.getClasses();
    const createdClass: ClassRoom = {
      ...newClass,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storageService.set('CLASSES', [...classes, createdClass]);
    return createdClass;
  },

  updateClass: (id: string, updatedClass: Partial<ClassRoom>): void => {
    const classes = classService.getClasses();
    const updated = classes.map(c => c.id === id ? { ...c, ...updatedClass } : c);
    storageService.set('CLASSES', updated);
  },

  deleteClass: (id: string): void => {
    const classes = classService.getClasses();
    storageService.set('CLASSES', classes.filter(c => c.id !== id));
  }
};
