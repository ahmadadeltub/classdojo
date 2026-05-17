import { Settings } from '../types';
import { storageService } from './storageService';

const DEFAULT_SETTINGS: Settings = {
  teacherName: 'أحمد الطويشات',
  schoolName: 'مدرسة التميز العالمية',
  academicYear: '2025/2026',
  language: 'ar'
};

export const settingsService = {
  getSettings: (): Settings => {
    const stored = storageService.getOne<Settings>('SETTINGS');
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: Settings): void => {
    storageService.setOne('SETTINGS', settings);
  },

  getDefault: (): Settings => {
    return { ...DEFAULT_SETTINGS };
  }
};
