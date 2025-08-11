import { Config } from '@/types/config';

const STORAGE_KEY = 'rustdesk-config';

export const storage = {
  save: (config: Config): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  },

  load: (): Config | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading config from localStorage:', error);
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing config from localStorage:', error);
    }
  }
};