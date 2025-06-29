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
    { name: 'Breakfast', calories: todayMeals.filter(m => m.mealType === 'breakfast').reduce((sum, m) => sum + m.calories, 0) },
    { name: 'Lunch', calories: todayMeals.filter(m => m.mealType === 'lunch').reduce((sum, m) => sum + m.calories, 0) },
    { name: 'Dinner', calories: todayMeals.filter(m => m.mealType === 'dinner').reduce((sum, m) => sum + m.calories, 0) },
    { name: 'Snacks', calories: todayMeals.filter(m => m.mealType === 'snack').reduce((sum, m) => sum + m.calories, 0) },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">Today's Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Calories" value={`${dailyStats.totalCalories.toFixed(0)} kcal`} icon={Flame} />
        <StatCard title="Protein" value={`${dailyStats.totalProtein.toFixed(0)} g`} icon={Beef} />
        <StatCard title="Carbohydrates" value={`${dailyStats.totalCarbs.toFixed(0)} g`} icon={Wheat} />
        <StatCard title="Fat" value={`${dailyStats.totalFat.toFixed(0)} g`} icon={Droplets} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Calories by Meal Type</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} kcal`} />
                <Tooltip />
                <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
            <CardDescription>
              You logged {todayMeals.length} meal(s) today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayMeals.length > 0 ? (
                todayMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{meal.mealType}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-semibold">{meal.calories.toFixed(0)} kcal</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No meals logged today.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
