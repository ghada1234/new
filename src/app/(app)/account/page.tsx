
'use client';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/locale-context';
import { usePreferences } from '@/contexts/preferences-context';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const { preferences, savePreferences } = usePreferences();
  const { toast } = useToast();
  
  const [goals, setGoals] = useState({
      targetCalories: preferences.targetCalories.toString(),
      targetProtein: preferences.targetProtein.toString(),
      targetCarbs: preferences.targetCarbs.toString(),
      targetFat: preferences.targetFat.toString(),
  });

  useEffect(() => {
    // Update local state when the context value changes (e.g., on initial load)
    setGoals({
      targetCalories: preferences.targetCalories.toString(),
      targetProtein: preferences.targetProtein.toString(),
      targetCarbs: preferences.targetCarbs.toString(),
      targetFat: preferences.targetFat.toString(),
    });
  }, [preferences]);

  if (!user) {
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoals(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalsSaveChanges = () => {
    const newGoals = {
      targetCalories: parseInt(goals.targetCalories, 10),
      targetProtein: parseInt(goals.targetProtein, 10),
      targetCarbs: parseInt(goals.targetCarbs, 10),
      targetFat: parseInt(goals.targetFat, 10),
    };
    if (Object.values(newGoals).every(v => !isNaN(v) && v >= 0)) {
      savePreferences(newGoals);
      toast({
        title: t('saveSuccessTitle'),
        description: t('saveSuccessDescription'),
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">{t('account')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('profile')}</CardTitle>
          <CardDescription>
            {t('profileDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.photoURL ?? ''} />
            <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="grid gap-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" defaultValue={user.displayName ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" readOnly defaultValue={user.email ?? ''} />
          </div>
          <Button>{t('saveChanges')}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('healthGoals')}</CardTitle>
          <CardDescription>{t('healthGoalsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="targetCalories">{t('targetDailyCalories')}</Label>
              <Input
                id="targetCalories"
                name="targetCalories"
                type="number"
                value={goals.targetCalories}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetProtein">{t('targetProtein')}</Label>
              <Input
                id="targetProtein"
                name="targetProtein"
                type="number"
                value={goals.targetProtein}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetCarbs">{t('targetCarbs')}</Label>
              <Input
                id="targetCarbs"
                name="targetCarbs"
                type="number"
                value={goals.targetCarbs}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetFat">{t('targetFat')}</Label>
              <Input
                id="targetFat"
                name="targetFat"
                type="number"
                value={goals.targetFat}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button onClick={handleGoalsSaveChanges}>{t('saveChanges')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
