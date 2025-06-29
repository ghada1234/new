
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
import { useLocale } from '@/contexts/locale-context';
import { NutrientDisplay } from './nutrient-display';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type AnalysisResultProps = {
  result: AnalyzeFoodImageOutput;
  onReset: () => void;
};

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  const [mealType, setMealType] = useState<LoggedMeal['mealType']>('lunch');
  const { addLoggedMeal } = useLoggedMeals();
  const { toast } = useToast();
  const { t } = useLocale();

  const handleLogMeal = () => {
    const mealName = result.foodItems?.[0]?.name || t('identifiedMeal');
    const mealData = {
        name: mealName,
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
        title: t('mealLoggedTitle'),
        description: t('mealLoggedDescription', { mealName: mealData.name }),
    })
    onReset();
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('analysisResult')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">{result.foodItems?.[0]?.name || t('identifiedMeal')}</h3>
          
          <Accordion type="single" collapsible className="w-full" defaultValue="nutrition">
            {result.ingredients && result.ingredients.length > 0 && (
              <AccordionItem value="ingredients">
                <AccordionTrigger>{t('ingredients')}</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {result.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="nutrition">
                <AccordionTrigger>{t('nutritionalInformation')}</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pt-2">
                        <NutrientDisplay label={t('totalCalories')} value={result.estimatedCalories} unit={t('caloriesUnit')} />
                        <NutrientDisplay label={t('protein')} value={result.estimatedProtein} unit={t('grams')} />
                        <NutrientDisplay label={t('carbohydrates')} value={result.estimatedCarbs} unit={t('grams')} />
                        <NutrientDisplay label={t('fat')} value={result.estimatedFat} unit={t('grams')} />
                        <NutrientDisplay label={t('saturatedFat')} value={result.estimatedSaturatedFat} unit={t('grams')} />
                        <NutrientDisplay label={t('fiber')} value={result.estimatedFiber} unit={t('grams')} />
                        <NutrientDisplay label={t('sugar')} value={result.estimatedSugar} unit={t('grams')} />
                        <NutrientDisplay label={t('sodium')} value={result.estimatedSodium} unit={t('milligrams')} />
                        <NutrientDisplay label={t('iron')} value={result.estimatedIron} unit={t('milligrams')} />
                        <NutrientDisplay label={t('calcium')} value={result.estimatedCalcium} unit={t('milligrams')} />
                        <NutrientDisplay label={t('magnesium')} value={result.estimatedMagnesium} unit={t('milligrams')} />
                        <NutrientDisplay label={t('zinc')} value={result.estimatedZinc} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminA')} value={result.estimatedVitaminA} unit={t('micrograms')} />
                        <NutrientDisplay label={t('vitaminC')} value={result.estimatedVitaminC} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminD')} value={result.estimatedVitaminD} unit={t('micrograms')} />
                        <NutrientDisplay label={t('vitaminE')} value={result.estimatedVitaminE} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminK')} value={result.estimatedVitaminK} unit={t('micrograms')} />
                        <NutrientDisplay label={t('vitaminB1')} value={result.estimatedVitaminB1} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminB2')} value={result.estimatedVitaminB2} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminB3')} value={result.estimatedVitaminB3} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminB5')} value={result.estimatedVitaminB5} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminB6')} value={result.estimatedVitaminB6} unit={t('milligrams')} />
                        <NutrientDisplay label={t('vitaminB7')} value={result.estimatedVitaminB7} unit={t('micrograms')} />
                        <NutrientDisplay label={t('vitaminB9')} value={result.estimatedVitaminB9} unit={t('micrograms')} />
                        <NutrientDisplay label={t('vitaminB12')} value={result.estimatedVitaminB12} unit={t('micrograms')} />
                    </div>
                </AccordionContent>
            </AccordionItem>
          </Accordion>

        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={mealType}
          onValueChange={(value: LoggedMeal['mealType']) => setMealType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('chooseMealType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">{t('breakfast')}</SelectItem>
            <SelectItem value="lunch">{t('lunch')}</SelectItem>
            <SelectItem value="dinner">{t('dinner')}</SelectItem>
            <SelectItem value="snack">{t('snack')}</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleLogMeal} className="flex-grow">
          {t('logMeal')}
        </Button>
      </div>
      <Button onClick={onReset} variant="outline" className="w-full">
        {t('analyzeAnotherMeal')}
      </Button>
    </div>
  );
}
