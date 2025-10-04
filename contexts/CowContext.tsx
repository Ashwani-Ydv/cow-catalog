import { storageService } from '@/services/storage';
import { Cow, CowFilters } from '@/types/cow';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface CowContextType {
  cows: Cow[];
  filters: CowFilters;
  isLoading: boolean;
  addCow: (cow: Cow) => Promise<void>;
  updateCow: (cow: Cow) => Promise<void>;
  getCowById: (id: string) => Cow | undefined;
  setFilters: (filters: CowFilters) => Promise<void>;
  getFilteredCows: () => Cow[];
  refreshCows: () => Promise<void>;
}

const CowContext = createContext<CowContextType | undefined>(undefined);

export function CowProvider({ children }: { children: ReactNode }) {
  const [cows, setCows] = useState<Cow[]>([]);
  const [filters, setFiltersState] = useState<CowFilters>({
    searchQuery: '',
    statusFilter: 'all',
    penFilter: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load cows and filters on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedCows, loadedFilters] = await Promise.all([
        storageService.getCows(),
        storageService.getFilters(),
      ]);
      setCows(loadedCows);
      setFiltersState(loadedFilters);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCows = async () => {
    try {
      const loadedCows = await storageService.getCows();
      setCows(loadedCows);
    } catch (error) {
      console.error('Error refreshing cows:', error);
    }
  };

  const addCow = async (cow: Cow) => {
    try {
      await storageService.addCow(cow);
      setCows(prev => [cow, ...prev]);
    } catch (error) {
      console.error('Error adding cow:', error);
      throw error;
    }
  };

  const updateCow = async (updatedCow: Cow) => {
    try {
      await storageService.updateCow(updatedCow);
      setCows(prev => prev.map(c => c.id === updatedCow.id ? updatedCow : c));
    } catch (error) {
      console.error('Error updating cow:', error);
      throw error;
    }
  };

  const getCowById = (id: string): Cow | undefined => {
    return cows.find(c => c.id === id);
  };

  const setFilters = async (newFilters: CowFilters) => {
    setFiltersState(newFilters);
    await storageService.saveFilters(newFilters);
  };

  const getFilteredCows = (): Cow[] => {
    return cows.filter(cow => {
      // Search by ear tag
      if (filters.searchQuery && !cow.earTag.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (filters.statusFilter !== 'all' && cow.status !== filters.statusFilter) {
        return false;
      }

      // Filter by pen
      if (filters.penFilter && cow.pen !== filters.penFilter) {
        return false;
      }

      return true;
    });
  };

  return (
    <CowContext.Provider
      value={{
        cows,
        filters,
        isLoading,
        addCow,
        updateCow,
        getCowById,
        setFilters,
        getFilteredCows,
        refreshCows,
      }}
    >
      {children}
    </CowContext.Provider>
  );
}

export function useCowContext() {
  const context = useContext(CowContext);
  if (context === undefined) {
    throw new Error('useCowContext must be used within a CowProvider');
  }
  return context;
}
