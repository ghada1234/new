'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from 'react';

interface PreferencesContextType {
  targetCalories: number;
  setTargetCalories: (calories: number) => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'nutrisnap_preferences';
const DEFAULT_TARGET_CALORIES = 2000;

export const PreferencesProvider = ({ children }: PropsWithChildren) => {
  const [targetCalories, setTargetCaloriesState] = useState<number>(DEFAULT_TARGET_CALORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        const preferences = JSON.parse(item);
        setTargetCaloriesState(preferences.targetCalories || DEFAULT_TARGET_CALORIES);
      }
    } catch (error) {
      console.error('Failed to load preferences from localStorage', error);
    }
    setIsLoading(false);
  }, []);

  const setTargetCalories = (calories: number) => {
      try {
          const preferences = { targetCalories: calories };
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
          setTargetCaloriesState(calories);
      } catch (error) {
          console.error('Failed to save preferences to localStorage', error);
      }
  };


  return (
    <PreferencesContext.Provider
      value={{
        targetCalories,
        setTargetCalories,
        isLoading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
