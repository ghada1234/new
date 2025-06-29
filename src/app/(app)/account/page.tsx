
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
  const { targetCalories, setTargetCalories } = usePreferences();
  const [calories, setCalories] = useState(targetCalories.toString());
  const { toast } = useToast();

  useEffect(() => {
    // Update local state when the context value changes (e.g., on initial load)
    setCalories(targetCalories.toString());
  }, [targetCalories]);

  if (!user) {
    return null;
  }
  
  const handleGoalsSaveChanges = () => {
    const newTarget = parseInt(calories, 10);
    if (!isNaN(newTarget) && newTarget > 0) {
      setTargetCalories(newTarget);
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
          <div className="grid gap-2">
            <Label htmlFor="targetCalories">{t('targetDailyCalories')}</Label>
            <Input
              id="targetCalories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <Button onClick={handleGoalsSaveChanges}>{t('saveChanges')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
