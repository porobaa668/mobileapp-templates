import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base app state interface - extend this for your specific app needs
interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Generic data store - use for app-specific data
  data: Record<string, unknown>;
  setData: (key: string, value: unknown) => void;
  getData: (key: string) => unknown;
  clearData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Loading
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      
      // Error
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Data
      data: {},
      setData: (key, value) => set((state) => ({ 
        data: { ...state.data, [key]: value } 
      })),
      getData: (key) => get().data[key],
      clearData: () => set({ data: {} }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        theme: state.theme,
        data: state.data,
      }),
    }
  )
);

// Export types for use in components
export type { AppState };
