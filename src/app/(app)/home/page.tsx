
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/contexts/locale-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Utensils, Lightbulb } from 'lucide-react';
import { useLoggedMeals } from '@/contexts/logged-meal-context';
import { usePreferences } from '@/contexts/preferences-context';
import { useMemo } from 'react';
import { isSameDay, startOfDay } from 'date-fns';
import { Progress } from '@/components/ui/progress';

function QuickStatCard() {
    const { loggedMeals, isLoading: mealsLoading } = useLoggedMeals();
    const { preferences, isLoading: prefsLoading } = usePreferences();
    const { t } = useLocale();

    const todayMeals = useMemo(() => {
        const today = startOfDay(new Date());
        return loggedMeals.filter(meal => isSameDay(new Date(meal.createdAt), today));
    }, [loggedMeals]);

    const consumedCalories = useMemo(() => {
        return todayMeals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
    }, [todayMeals]);

    if (mealsLoading || prefsLoading) {
        return null;
    }

    const progress = preferences.targetCalories > 0 ? (consumedCalories / preferences.targetCalories) * 100 : 0;

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>{t('todaysProgress')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm font-medium">
                        <span>{t('consumed')}: {consumedCalories.toFixed(0)} {t('calories')}</span>
                        <span className="text-muted-foreground">{t('target')}: {preferences.targetCalories} {t('calories')}</span>
                    </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard">
                        {t('viewFullDashboard')}
                        <ArrowRight className="ms-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function ActionCard({ title, href, icon: Icon }: { title: string, href: string, icon: React.ElementType }) {
    return (
        <Link href={href} className="block group">
            <Card className="h-full hover:border-primary transition-colors">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
            </Card>
        </Link>
    )
}

const actionCards = [
    { labelKey: 'analyzeMeal' as const, href: '/analyze', icon: Utensils },
    { labelKey: 'aiMealSuggestions' as const, href: '/suggestions', icon: Lightbulb },
];

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useLocale();
  
  return (
    <div className="flex flex-1 flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">
            {t('welcomeBack', { name: user?.displayName?.split(' ')[0] || '' })}
        </h1>
        <p className="text-muted-foreground">{t('homeSubtitle')}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <QuickStatCard />
          {actionCards.map(card => (
              <ActionCard key={card.href} title={t(card.labelKey)} href={card.href} icon={card.icon} />
          ))}
      </div>

    </div>
  );
}
