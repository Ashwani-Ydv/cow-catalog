import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cow, CowFilters } from '@/types/cow';

const COWS_STORAGE_KEY = '@cow_catalog_cows';
const FILTERS_STORAGE_KEY = '@cow_catalog_filters';

export const storageService = {
  // Cow operations
  async getCows(): Promise<Cow[]> {
    try {
      const data = await AsyncStorage.getItem(COWS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading cows:', error);
      return [];
    }
  },

  async saveCows(cows: Cow[]): Promise<void> {
    try {
      await AsyncStorage.setItem(COWS_STORAGE_KEY, JSON.stringify(cows));
    } catch (error) {
      console.error('Error saving cows:', error);
      throw error;
    }
  },

  async addCow(cow: Cow): Promise<void> {
    try {
      const cows = await this.getCows();
      cows.push(cow);
      await this.saveCows(cows);
    } catch (error) {
      console.error('Error adding cow:', error);
      throw error;
    }
  },

  async updateCow(updatedCow: Cow): Promise<void> {
    try {
      const cows = await this.getCows();
      const index = cows.findIndex(c => c.id === updatedCow.id);
      if (index !== -1) {
        cows[index] = updatedCow;
        await this.saveCows(cows);
      }
    } catch (error) {
      console.error('Error updating cow:', error);
      throw error;
    }
  },

  async getCowByEarTag(earTag: string): Promise<Cow | null> {
    try {
      const cows = await this.getCows();
      return cows.find(c => c.earTag.toLowerCase() === earTag.toLowerCase()) || null;
    } catch (error) {
      console.error('Error finding cow:', error);
      return null;
    }
  },

  // Filter operations
  async getFilters(): Promise<CowFilters> {
    try {
      const data = await AsyncStorage.getItem(FILTERS_STORAGE_KEY);
      return data ? JSON.parse(data) : {
        searchQuery: '',
        statusFilter: 'all',
        penFilter: '',
      };
    } catch (error) {
      console.error('Error loading filters:', error);
      return {
        searchQuery: '',
        statusFilter: 'all',
        penFilter: '',
      };
    }
  },

  async saveFilters(filters: CowFilters): Promise<void> {
    try {
      await AsyncStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  },

  // Utility
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([COWS_STORAGE_KEY, FILTERS_STORAGE_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
