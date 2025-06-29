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
        name: result.foodItems[0]?.name || 'وجبة محددة',
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
        title: "تم تسجيل الوجبة",
        description: `تمت إضافة ${mealData.name} إلى سجلك اليومي.`,
    })
    onReset();
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>نتيجة التحليل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">{result.foodItems[0]?.name || 'الوجبة المحددة'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <NutrientDisplay label="السعرات الحرارية" value={result.estimatedCalories} unit="سعر حراري" />
            <NutrientDisplay label="بروتين" value={result.estimatedProtein} unit="غ" />
            <NutrientDisplay label="كربوهيدرات" value={result.estimatedCarbs} unit="غ" />
            <NutrientDisplay label="دهون" value={result.estimatedFat} unit="غ" />
            <NutrientDisplay label="الدهون المشبعة" value={result.estimatedSaturatedFat} unit="غ" />
            <NutrientDisplay label="الألياف" value={result.estimatedFiber} unit="غ" />
            <NutrientDisplay label="السكر" value={result.estimatedSugar} unit="غ" />
            <NutrientDisplay label="صوديوم" value={result.estimatedSodium} unit="ملغ" />
            <NutrientDisplay label="حديد" value={result.estimatedIron} unit="ملغ" />
            <NutrientDisplay label="كالسيوم" value={result.estimatedCalcium} unit="ملغ" />
            <NutrientDisplay label="مغنيسيوم" value={result.estimatedMagnesium} unit="ملغ" />
            <NutrientDisplay label="زنك" value={result.estimatedZinc} unit="ملغ" />
            <NutrientDisplay label="فيتامين أ" value={result.estimatedVitaminA} unit="مكغ" />
            <NutrientDisplay label="فيتامين ج" value={result.estimatedVitaminC} unit="ملغ" />
            <NutrientDisplay label="فيتامين د" value={result.estimatedVitaminD} unit="مكغ" />
            <NutrientDisplay label="فيتامين هـ" value={result.estimatedVitaminE} unit="ملغ" />
            <NutrientDisplay label="فيتامين ك" value={result.estimatedVitaminK} unit="مكغ" />
            <NutrientDisplay label="فيتامين ب1" value={result.estimatedVitaminB1} unit="ملغ" />
            <NutrientDisplay label="فيتامين ب2" value={result.estimatedVitaminB2} unit="ملغ" />
            <NutrientDisplay label="فيتامين ب3" value={result.estimatedVitaminB3} unit="ملغ" />
            <NutrientDisplay label="فيتامين ب5" value={result.estimatedVitaminB5} unit="ملغ" />
            <NutrientDisplay label="فيتامين ب6" value={result.estimatedVitaminB6} unit="ملغ" />
            <NutrientDisplay label="فيتامين ب7" value={result.estimatedVitaminB7} unit="مكغ" />
            <NutrientDisplay label="فيتامين ب9" value={result.estimatedVitaminB9} unit="مكغ" />
            <NutrientDisplay label="فيتامين ب12" value={result.estimatedVitaminB12} unit="مكغ" />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={mealType}
          onValueChange={(value: LoggedMeal['mealType']) => setMealType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الوجبة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">فطور</SelectItem>
            <SelectItem value="lunch">غداء</SelectItem>
            <SelectItem value="dinner">عشاء</SelectItem>
            <SelectItem value="snack">وجبة خفيفة</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleLogMeal} className="flex-grow">
          تسجيل الوجبة
        </Button>
      </div>
      <Button onClick={onReset} variant="outline" className="w-full">
        تحليل وجبة أخرى
      </Button>
    </div>
  );
}
