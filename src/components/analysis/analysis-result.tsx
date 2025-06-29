'use client';
import type { AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image';
import { useLoggedMeals } from '@/contexts/logged-meal-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoggedMeal } from '@/types';

type AnalysisResultProps = {
  result: AnalyzeFoodImageOutput;
  onReset: () => void;
};

const NutrientDisplay = ({ label, value, unit }: { label: string, value?: number, unit: string }) => {
    if(value === undefined || value === null) return null;
    return (
        <div className="flex justify-between text-sm">
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium">{value.toFixed(1)} {unit}</p>
        </div>
    );
};

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  const [mealType, setMealType] = useState<LoggedMeal['mealType']>('lunch');
  const { addLoggedMeal } = useLoggedMeals();
  const { toast } = useToast();

  const handleLogMeal = () => {
    const mealData = {
        name: result.foodItems[0]?.name || 'Analyzed Meal',
        calories: result.estimatedCalories || 0,
        protein: result.estimatedProtein || 0,
        carbs: result.estimatedCarbs || 0,
        fat: result.estimatedFat || 0,
        saturatedFat: result.estimatedSaturatedFat,
        fiber: result.estimatedFiber,
        sugar: result.estimatedSugar,
        sodium: result.estimatedSodium,
        vitaminA: result.estimatedVitaminA,
        vitaminC: result.estimatedVitaminC,
        vitaminD: result.estimatedVitaminD,
        vitaminE: result.estimatedVitaminE,
        vitaminK: result.estimatedVitaminK,
        vitaminB1: result.estimatedVitaminB1,
        vitaminB2: result.estimatedVitaminB2,
        vitaminB3: result.estimatedVitaminB3,
        vitaminB5: result.estimatedVitaminB5,
        vitaminB6: result.estimatedVitaminB6,
        vitaminB7: result.estimatedVitaminB7,
        vitaminB9: result.estimatedVitaminB9,
        vitaminB12: result.estimatedVitaminB12,
        calcium: result.estimatedCalcium,
        iron: result.estimatedIron,
        magnesium: result.estimatedMagnesium,
        zinc: result.estimatedZinc,
        mealType: mealType,
    };
    addLoggedMeal(mealData);
    toast({
        title: "Meal Logged",
        description: `${mealData.name} has been added to your daily log.`,
    })
    onReset();
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">{result.foodItems[0]?.name || 'Identified Meal'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <NutrientDisplay label="Calories" value={result.estimatedCalories} unit="kcal" />
            <NutrientDisplay label="Protein" value={result.estimatedProtein} unit="g" />
            <NutrientDisplay label="Carbohydrates" value={result.estimatedCarbs} unit="g" />
            <NutrientDisplay label="Fat" value={result.estimatedFat} unit="g" />
            <NutrientDisplay label="Saturated Fat" value={result.estimatedSaturatedFat} unit="g" />
            <NutrientDisplay label="Fiber" value={result.estimatedFiber} unit="g" />
            <NutrientDisplay label="Sugar" value={result.estimatedSugar} unit="g" />
            <NutrientDisplay label="Sodium" value={result.estimatedSodium} unit="mg" />
            <NutrientDisplay label="Iron" value={result.estimatedIron} unit="mg" />
            <NutrientDisplay label="Calcium" value={result.estimatedCalcium} unit="mg" />
            <NutrientDisplay label="Magnesium" value={result.estimatedMagnesium} unit="mg" />
            <NutrientDisplay label="Zinc" value={result.estimatedZinc} unit="mg" />
            <NutrientDisplay label="Vitamin A" value={result.estimatedVitaminA} unit="µg" />
            <NutrientDisplay label="Vitamin C" value={result.estimatedVitaminC} unit="mg" />
            <NutrientDisplay label="Vitamin D" value={result.estimatedVitaminD} unit="µg" />
            <NutrientDisplay label="Vitamin E" value={result.estimatedVitaminE} unit="mg" />
            <NutrientDisplay label="Vitamin K" value={result.estimatedVitaminK} unit="µg" />
            <NutrientDisplay label="Vitamin B1" value={result.estimatedVitaminB1} unit="mg" />
            <NutrientDisplay label="Vitamin B2" value={result.estimatedVitaminB2} unit="mg" />
            <NutrientDisplay label="Vitamin B3" value={result.estimatedVitaminB3} unit="mg" />
            <NutrientDisplay label="Vitamin B5" value={result.estimatedVitaminB5} unit="mg" />
            <NutrientDisplay label="Vitamin B6" value={result.estimatedVitaminB6} unit="mg" />
            <NutrientDisplay label="Vitamin B7" value={result.estimatedVitaminB7} unit="µg" />
            <NutrientDisplay label="Vitamin B9" value={result.estimatedVitaminB9} unit="µg" />
            <NutrientDisplay label="Vitamin B12" value={result.estimatedVitaminB12} unit="µg" />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={mealType}
          onValueChange={(value: LoggedMeal['mealType']) => setMealType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleLogMeal} className="flex-grow">
          Log Meal
        </Button>
      </div>
      <Button onClick={onReset} variant="outline" className="w-full">
        Analyze Another Meal
      </Button>
    </div>
  );
}
