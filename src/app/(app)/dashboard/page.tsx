
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
  Droplets,
} from 'lucide-react';
import { useLocale } from '@/contexts/locale-context';

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
  const { loggedMeals, isLoading } = useLoggedMeals();
  const { t, locale } = useLocale();
  
  const todayMeals = useMemo(() => {
    const today = startOfDay(new Date());
    return loggedMeals.filter(meal => isSameDay(new Date(meal.createdAt), today));
  }, [loggedMeals]);

  const dailyStats = useMemo(() => {
    return todayMeals.reduce(
      (acc, meal) => {
        acc.totalCalories += meal.calories;
        acc.totalProtein += meal.protein;
        acc.totalCarbs += meal.carbs;
        acc.totalFat += meal.fat;
        return acc;
      },
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
  }, [todayMeals]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">{t('dashboardToday')}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t('totalCalories')} value={`${dailyStats.totalCalories.toFixed(0)} ${t('calories')}`} icon={Flame} />
        <StatCard title={t('protein')} value={`${dailyStats.totalProtein.toFixed(0)} ${t('grams')}`} icon={Beef} />
        <StatCard title={t('carbohydrates')} value={`${dailyStats.totalCarbs.toFixed(0)} ${t('grams')}`} icon={Wheat} />
        <StatCard title={t('fat')} value={`${dailyStats.totalFat.toFixed(0)} ${t('grams')}`} icon={Droplets} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
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
        <Card className="col-span-4 lg:col-span-3">
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
      </div>
    </div>
  );
}
