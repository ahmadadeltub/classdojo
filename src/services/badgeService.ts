import { Badge } from '../types';
import { storageService } from './storageService';

export const DEFAULT_BADGES: Badge[] = [
  { id: '1', title: 'الطالب المبدع', description: 'يظهر مهارات إبداعية متميزة', icon: '🎨', color: '#f59e0b' },
  { id: '2', title: 'القائد الصغير', description: 'يتمتع بصفات قيادية', icon: '👑', color: '#0ea5e9' },
  { id: '3', title: 'نجم المشاركة', description: 'مشاركة فعالة ومستمرة', icon: '⭐', color: '#facc15' },
  { id: '4', title: 'المتعاون', description: 'يساعد زملائه دائماً', icon: '🤝', color: '#22c55e' },
  { id: '5', title: 'المحافظ على الوقت', description: 'دقيق في مواعيده', icon: '⏰', color: '#6366f1' },
  { id: '6', title: 'الباحث المتميز', description: 'يبحث ويستقصي المعلومات', icon: '🔍', color: '#ec4899' },
  { id: '7', title: 'قارئ الأسبوع', description: 'شغوف بالقراءة والمطالعة', icon: '📚', color: '#8b5cf6' },
  { id: '8', title: 'عبقري الرياضيات', description: 'مهارات حسابية مذهلة', icon: '🧮', color: '#10b981' },
];

export const badgeService = {
  getBadges: (): Badge[] => {
    const stored = storageService.get<Badge>('BADGES');
    return stored.length > 0 ? stored : DEFAULT_BADGES;
  },

  assignBadge: (studentId: string, badgeId: string): void => {
    // Logic handled in student update, but here for reference
  }
};
