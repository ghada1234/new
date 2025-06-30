
'use client';
import React, { useMemo } from 'react';
import { useLoggedMeals } from '@/contexts/logged-meal-context';
import { startOfDay, isSameDay } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Flame,
  Beef,
  Wheat,
  Target,
} from 'lucide-react';
import { useLocale } from '@/contexts/locale-context';
import { NutrientDisplay } from '@/components/analysis/nutrient-display';
import { useHealthGoals } from '@/contexts/health-goals-context';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
  const { loggedMeals, isLoading: mealsLoading } = useLoggedMeals();
  const { healthGoals, isLoading: goalsLoading } = useHealthGoals();
  const { t, locale } = useLocale();
  
  const todayMeals = useMemo(() => {
    const today = startOfDay(new Date());
    return loggedMeals.filter(meal => isSameDay(new Date(meal.createdAt), today));
  }, [loggedMeals]);

  const dailyStats = useMemo(() => {
    const initialStats = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalSaturatedFat: 0,
      totalFiber: 0,
      totalSugar: 0,
      totalSodium: 0,
      totalVitaminA: 0,
      totalVitaminC: 0,
      totalVitaminD: 0,
      totalVitaminE: 0,
      totalVitaminK: 0,
      totalVitaminB1: 0,
      totalVitaminB2: 0,
      totalVitaminB3: 0,
      totalVitaminB5: 0,
      totalVitaminB6: 0,
      totalVitaminB7: 0,
      totalVitaminB9: 0,
      totalVitaminB12: 0,
      totalCalcium: 0,
      totalIron: 0,
      totalMagnesium: 0,
      totalZinc: 0,
    };
    
    return todayMeals.reduce(
      (acc, meal) => {
        acc.totalCalories += meal.calories || 0;
        acc.totalProtein += meal.protein || 0;
        acc.totalCarbs += meal.carbs || 0;
        acc.totalFat += meal.fat || 0;
        acc.totalSaturatedFat += meal.saturatedFat || 0;
        acc.totalFiber += meal.fiber || 0;
        acc.totalSugar += meal.sugar || 0;
        acc.totalSodium += meal.sodium || 0;
        acc.totalIron += meal.iron || 0;
        acc.totalCalcium += meal.calcium || 0;
        acc.totalMagnesium += meal.magnesium || 0;
        acc.totalZinc += meal.zinc || 0;
        acc.totalVitaminA += meal.vitaminA || 0;
        acc.totalVitaminC += meal.vitaminC || 0;
        acc.totalVitaminD += meal.vitaminD || 0;
        acc.totalVitaminE += meal.vitaminE || 0;
        acc.totalVitaminK += meal.vitaminK || 0;
        acc.totalVitaminB1 += meal.vitaminB1 || 0;
        acc.totalVitaminB2 += meal.vitaminB2 || 0;
        acc.totalVitaminB3 += meal.vitaminB3 || 0;
        acc.totalVitaminB5 += meal.vitaminB5 || 0;
        acc.totalVitaminB6 += meal.vitaminB6 || 0;
        acc.totalVitaminB7 += meal.vitaminB7 || 0;
        acc.totalVitaminB9 += meal.vitaminB9 || 0;
        acc.totalVitaminB12 += meal.vitaminB12 || 0;
        return acc;
      },
      initialStats
    );
  }, [todayMeals]);
  
  const remainingCalories = useMemo(() => {
    return healthGoals.calories - dailyStats.totalCalories;
  }, [healthGoals.calories, dailyStats.totalCalories]);

  const chartData = [
    { name: t('breakfast'), calories: todayMeals.filter(m => m.mealType === 'breakfast').reduce((sum, m) => sum + m.calories, 0) },
    { name: t('lunch'), calories: todayMeals.filter(m => m.mealType === 'lunch').reduce((sum, m) => sum + m.calories, 0) },
    { name: t('dinner'), calories: todayMeals.filter(m => m.mealType === 'dinner').reduce((sum, m) => sum + m.calories, 0) },
    { name: t('snack'), calories: todayMeals.filter(m => m.mealType === 'snack').reduce((sum, m) => sum + m.calories, 0) },
  ];

  const mealTypeTranslations = {
      breakfast: t('breakfast'),
      lunch: t('lunch'),
      dinner: t('dinner'),
      snack: t('snack')
  }

  const isLoading = mealsLoading || goalsLoading;

  if (isLoading) {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-5">
                <Skeleton className="xl:col-span-3 h-[400px]" />
                <div className="space-y-4 xl:col-span-2">
                    <Skeleton className="h-48" />
                    <Skeleton className="h-72" />
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">{t('dashboardToday')}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t('totalCalories')} value={`${dailyStats.totalCalories.toFixed(0)} / ${healthGoals.calories.toFixed(0)}`} icon={Flame} />
        <StatCard title={t('remainingCalories')} value={`${remainingCalories.toFixed(0)} ${t('calories')}`} icon={Target} />
        <StatCard title={t('protein')} value={`${dailyStats.totalProtein.toFixed(0)} / ${healthGoals.protein.toFixed(0)}g`} icon={Beef} />
        <StatCard title={t('carbohydrates')} value={`${dailyStats.totalCarbs.toFixed(0)} / ${healthGoals.carbs.toFixed(0)}g`} icon={Wheat} />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>{t('caloriesByMealType')}</CardTitle>
          </CardHeader>
          <CardContent className={locale === 'ar' ? 'pr-2' : 'pl-2'}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis orientation={locale === 'ar' ? "right" : "left"} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} ${t('calories')}`} />
                <Tooltip />
                <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('todaysMeals')}</CardTitle>
              <CardDescription>
                {t('mealsLoggedToday', { count: todayMeals.length })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayMeals.length > 0 ? (
                  todayMeals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{meal.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{mealTypeTranslations[meal.mealType]}</p>
                      </div>
                      <div className={locale === 'ar' ? "text-left" : "text-right"}>
                         <p className="font-semibold">{meal.calories.toFixed(0)} {t('calories')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">{t('noMealsLogged')}</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>{t('nutrientBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <NutrientDisplay label={t('fat')} value={dailyStats.totalFat} unit={`${t('grams')} / ${healthGoals.fat.toFixed(0)}g`} />
                  <NutrientDisplay label={t('saturatedFat')} value={dailyStats.totalSaturatedFat} unit={t('grams')} />
                  <NutrientDisplay label={t('fiber')} value={dailyStats.totalFiber} unit={t('grams')} />
                  <NutrientDisplay label={t('sugar')} value={dailyStats.totalSugar} unit={t('grams')} />
                  <NutrientDisplay label={t('sodium')} value={dailyStats.totalSodium} unit={t('milligrams')} />
                  <NutrientDisplay label={t('iron')} value={dailyStats.totalIron} unit={t('milligrams')} />
                  <NutrientDisplay label={t('calcium')} value={dailyStats.totalCalcium} unit={t('milligrams')} />
                  <NutrientDisplay label={t('magnesium')} value={dailyStats.totalMagnesium} unit={t('milligrams')} />
                  <NutrientDisplay label={t('zinc')} value={dailyStats.totalZinc} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminA')} value={dailyStats.totalVitaminA} unit={t('micrograms')} />
                  <NutrientDisplay label={t('vitaminC')} value={dailyStats.totalVitaminC} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminD')} value={dailyStats.totalVitaminD} unit={t('micrograms')} />
                  <NutrientDisplay label={t('vitaminE')} value={dailyStats.totalVitaminE} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminK')} value={dailyStats.totalVitaminK} unit={t('micrograms')} />
                  <NutrientDisplay label={t('vitaminB1')} value={dailyStats.totalVitaminB1} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminB2')} value={dailyStats.totalVitaminB2} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminB3')} value={dailyStats.totalVitaminB3} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminB5')} value={dailyStats.totalVitaminB5} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminB6')} value={dailyStats.totalVitaminB6} unit={t('milligrams')} />
                  <NutrientDisplay label={t('vitaminB7')} value={dailyStats.totalVitaminB7} unit={t('micrograms')} />
                  <NutrientDisplay label={t('vitaminB9')} value={dailyStats.totalVitaminB9} unit={t('micrograms')} />
                  <NutrientDisplay label={t('vitaminB12')} value={dailyStats.totalVitaminB12} unit={t('micrograms')} />
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
