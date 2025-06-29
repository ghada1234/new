
'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from 'react';

const LOCAL_STORAGE_KEY = 'nutrisnap_preferences';

const DEFAULT_PREFERENCES = {
  targetCalories: 2000,
  targetProtein: 100,
  targetCarbs: 250,
  targetFat: 70,
};

type Preferences = typeof DEFAULT_PREFERENCES;

interface PreferencesContextType {
  preferences: Preferences;
  savePreferences: (prefs: Preferences) => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);


export const PreferencesProvider = ({ children }: PropsWithChildren) => {
  const [preferences, setPreferencesState] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        const savedPrefs = JSON.parse(item);
        setPreferencesState({ ...DEFAULT_PREFERENCES, ...savedPrefs});
      }
    } catch (error) {
      console.error('Failed to load preferences from localStorage', error);
    }
    setIsLoading(false);
  }, []);

  const savePreferences = (newPrefs: Preferences) => {
      try {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPrefs));
          setPreferencesState(newPrefs);
      } catch (error) {
          console.error('Failed to save preferences to localStorage', error);
      }
  };


  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        savePreferences,
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
