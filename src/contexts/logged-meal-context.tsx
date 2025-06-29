'use client';
import type { LoggedMeal } from '@/types';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from 'react';

interface LoggedMealContextType {
  loggedMeals: LoggedMeal[];
  addLoggedMeal: (meal: Omit<LoggedMeal, 'id' | 'createdAt'>) => void;
  updateLoggedMeal: (meal: LoggedMeal) => void;
  deleteLoggedMeal: (mealId: string) => void;
  isLoading: boolean;
}

const LoggedMealContext = createContext<LoggedMealContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'nutrisnap_logged_meals';

export const LoggedMealProvider = ({ children }: PropsWithChildren) => {
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (items) {
        setLoggedMeals(JSON.parse(items));
      }
    } catch (error) {
      console.error('Failed to load logged meals from localStorage', error);
    }
    setIsLoading(false);
  }, []);

  const persistMeals = (meals: LoggedMeal[]) => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meals));
    } catch (error) {
      console.error('Failed to save logged meals to localStorage', error);
    }
  };

  const addLoggedMeal = useCallback(
    (meal: Omit<LoggedMeal, 'id' | 'createdAt'>) => {
      setLoggedMeals((prevMeals) => {
        const newMeal: LoggedMeal = {
          ...meal,
          id: new Date().getTime().toString(),
          createdAt: new Date().toISOString(),
        };
        const updatedMeals = [...prevMeals, newMeal];
        persistMeals(updatedMeals);
        return updatedMeals;
      });
    },
    []
  );

  const updateLoggedMeal = useCallback((updatedMeal: LoggedMeal) => {
    setLoggedMeals((prevMeals) => {
      const updatedMeals = prevMeals.map((meal) =>
        meal.id === updatedMeal.id ? updatedMeal : meal
      );
      persistMeals(updatedMeals);
      return updatedMeals;
    });
  }, []);

  const deleteLoggedMeal = useCallback((mealId: string) => {
    setLoggedMeals((prevMeals) => {
      const updatedMeals = prevMeals.filter((meal) => meal.id !== mealId);
      persistMeals(updatedMeals);
      return updatedMeals;
    });
  }, []);

  return (
    <LoggedMealContext.Provider
      value={{
        loggedMeals,
        addLoggedMeal,
        updateLoggedMeal,
        deleteLoggedMeal,
        isLoading,
      }}
    >
      {children}
    </LoggedMealContext.Provider>
  );
};

export const useLoggedMeals = () => {
  const context = useContext(LoggedMealContext);
  if (context === undefined) {
    throw new Error('useLoggedMeals must be used within a LoggedMealProvider');
  }
  return context;
};
