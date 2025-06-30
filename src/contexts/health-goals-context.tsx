'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from './locale-context';

export interface HealthGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface HealthGoalsContextType {
  healthGoals: HealthGoals;
  setHealthGoals: (goals: HealthGoals) => void;
  isLoading: boolean;
}

const HealthGoalsContext = createContext<HealthGoalsContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'nutrisnap_health_goals';

const defaultGoals: HealthGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

export const HealthGoalsProvider = ({ children }: PropsWithChildren) => {
  const [healthGoals, setHealthGoals] = useState<HealthGoals>(defaultGoals);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (items) {
        const parsedGoals = JSON.parse(items);
        if (
          parsedGoals.calories &&
          parsedGoals.protein &&
          parsedGoals.carbs &&
          parsedGoals.fat
        ) {
          setHealthGoals(parsedGoals);
        }
      }
    } catch (error) {
      console.error('Failed to load health goals from localStorage', error);
    }
    setIsLoading(false);
  }, []);

  const handleSetGoals = (goals: HealthGoals) => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
      setHealthGoals(goals);
      toast({
        title: t('goalsSavedTitle'),
        description: t('goalsSavedDescription'),
      });
    } catch (error) {
      console.error('Failed to save health goals to localStorage', error);
      toast({
        title: t('goalsSavedErrorTitle'),
        description: t('goalsSavedErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <HealthGoalsContext.Provider
      value={{
        healthGoals,
        setHealthGoals: handleSetGoals,
        isLoading,
      }}
    >
      {children}
    </HealthGoalsContext.Provider>
  );
};

export const useHealthGoals = () => {
  const context = useContext(HealthGoalsContext);
  if (context === undefined) {
    throw new Error('useHealthGoals must be used within a HealthGoalsProvider');
  }
  return context;
};
