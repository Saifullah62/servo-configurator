import { MovementPattern } from '../types/servo';

const STORAGE_KEY = 'saved_patterns';

export const patternStorage = {
  savePattern: (pattern: MovementPattern) => {
    try {
      const savedPatterns = patternStorage.getSavedPatterns();
      const existingIndex = savedPatterns.findIndex(p => p.name === pattern.name);
      
      if (existingIndex >= 0) {
        savedPatterns[existingIndex] = pattern;
      } else {
        savedPatterns.push(pattern);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPatterns));
      return true;
    } catch (error) {
      console.error('Error saving pattern:', error);
      return false;
    }
  },

  getSavedPatterns: (): MovementPattern[] => {
    try {
      const savedPatterns = localStorage.getItem(STORAGE_KEY);
      return savedPatterns ? JSON.parse(savedPatterns) : [];
    } catch (error) {
      console.error('Error loading patterns:', error);
      return [];
    }
  },

  deletePattern: (patternName: string) => {
    try {
      const savedPatterns = patternStorage.getSavedPatterns();
      const filteredPatterns = savedPatterns.filter(p => p.name !== patternName);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPatterns));
      return true;
    } catch (error) {
      console.error('Error deleting pattern:', error);
      return false;
    }
  },

  exportPatterns: () => {
    try {
      const patterns = patternStorage.getSavedPatterns();
      const blob = new Blob([JSON.stringify(patterns, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `servo_patterns_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting patterns:', error);
      return false;
    }
  },

  importPatterns: async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const patterns = JSON.parse(text) as MovementPattern[];
      const existingPatterns = patternStorage.getSavedPatterns();
      
      // Merge patterns, overwriting existing ones with the same name
      const mergedPatterns = [
        ...existingPatterns.filter(ep => !patterns.some(p => p.name === ep.name)),
        ...patterns
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedPatterns));
      return true;
    } catch (error) {
      console.error('Error importing patterns:', error);
      return false;
    }
  }
};
