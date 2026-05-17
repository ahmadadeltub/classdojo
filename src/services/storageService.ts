const STORAGE_KEYS = {
  CLASSES: 'icp_classes',
  STUDENTS: 'icp_students',
  POINTS: 'icp_points',
  BADGES: 'icp_badges',
  SETTINGS: 'icp_settings',
};

export const storageService = {
  get: <T>(key: keyof typeof STORAGE_KEYS): T[] => {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : [];
  },

  set: <T>(key: keyof typeof STORAGE_KEYS, data: T[]): void => {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  },

  getOne: <T>(key: keyof typeof STORAGE_KEYS): T | null => {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : null;
  },

  setOne: <T>(key: keyof typeof STORAGE_KEYS, data: T): void => {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};
