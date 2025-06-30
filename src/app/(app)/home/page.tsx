'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLoggedMeals } from '@/contexts/logged-meal-context';
import { useHealthGoals } from '@/contexts/health-goals-context';
import { useLocale } from '@/contexts/locale-context';
import { startOfDay, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Utensils, LayoutDashboard, Lightbulb, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, unit }: { title: string; value: string; unit: string }) => (
    <div className="bg-muted p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{unit}</p>
    </div>
);

const ActionCard = ({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string; }) => {
    const { t } = useLocale();
    return (
        <Link href={href} className="block group">
            <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">{description}</p>
                    <Button variant="ghost" className="p-0 h-auto text-primary">
                        {t('getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </Link>
    )
}


export default function HomePage() {
    const { user } = useAuth();
    const { t } = useLocale();
    const { loggedMeals, isLoading: mealsLoading } = useLoggedMeals();
    const { healthGoals, isLoading: goalsLoading } = useHealthGoals();

    const todayMeals = useMemo(() => {
        const today = startOfDay(new Date());
        return loggedMeals.filter(meal => isSameDay(new Date(meal.createdAt), today));
    }, [loggedMeals]);

    const totalCaloriesToday = useMemo(() => {
        return todayMeals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
    }, [todayMeals]);

    const remainingCalories = useMemo(() => {
        return healthGoals.calories - totalCaloriesToday;
    }, [healthGoals.calories, totalCaloriesToday]);

    const isLoading = mealsLoading || goalsLoading;
    
    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col gap-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold">{t('welcomeBack', { name: user?.displayName?.split(' ')[0] || '' })}</h1>
                <p className="text-muted-foreground text-lg">{t('homeSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <StatCard title={t('caloriesConsumed')} value={totalCaloriesToday.toFixed(0)} unit={t('calories')} />
                 <StatCard title={t('remainingCalories')} value={remainingCalories.toFixed(0)} unit={t('calories')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionCard 
                    href="/analyze"
                    icon={Utensils}
                    title={t('analyzeMeal')}
                    description={t('analyzeMealCardDescription')}
                />
                <ActionCard 
                    href="/dashboard"
                    icon={LayoutDashboard}
                    title={t('viewDashboard')}
                    description={t('viewDashboardCardDescription')}
                />
                <ActionCard 
                    href="/suggestions"
                    icon={Lightbulb}
                    title={t('getSuggestions')}
                    description={t('getSuggestionsCardDescription')}
                />
            </div>
        </div>
    );
}
