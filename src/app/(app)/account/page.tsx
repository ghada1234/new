
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
import { useHealthGoals, type HealthGoals } from '@/contexts/health-goals-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { user, updateUserProfile } = useAuth();
  const { t } = useLocale();
  const { healthGoals, setHealthGoals, isLoading: goalsLoading } = useHealthGoals();
  const { toast } = useToast();

  const profileSchema = useMemo(() => z.object({
    name: z.string().min(2, t('nameMin2Chars')),
  }), [t]);
  
  type ProfileFormData = z.infer<typeof profileSchema>;

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
    },
  });

  const healthGoalsSchema = useMemo(() => z.object({
    calories: z.coerce.number().min(0, t('negativeValueError')),
    protein: z.coerce.number().min(0, t('negativeValueError')),
    carbs: z.coerce.number().min(0, t('negativeValueError')),
    fat: z.coerce.number().min(0, t('negativeValueError')),
  }), [t]);

  const healthGoalsForm = useForm<HealthGoals>({
    resolver: zodResolver(healthGoalsSchema),
    defaultValues: healthGoals,
  });
  
  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.displayName ?? '' });
    }
    if(!goalsLoading) {
      healthGoalsForm.reset(healthGoals);
    }
  }, [user, healthGoals, profileForm, healthGoalsForm, goalsLoading]);

  if (!user) {
    return null;
  }
  
  const onProfileSubmit = async (data: ProfileFormData) => {
    await updateUserProfile({ displayName: data.name });
    toast({
      title: t('profileUpdatedTitle'),
      description: t('profileUpdatedDescription'),
    });
  };

  const onGoalsSubmit = (data: HealthGoals) => {
    setHealthGoals(data);
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
        <CardContent>
           <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photoURL ?? ''} />
                <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="grid gap-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input id="name" {...profileForm.register('name')} />
                {profileForm.formState.errors.name && <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" readOnly defaultValue={user.email ?? ''} />
              </div>
              <Button type="submit" disabled={profileForm.formState.isSubmitting}>{t('saveChanges')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('healthGoals')}</CardTitle>
          <CardDescription>
            {t('healthGoalsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {goalsLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          ) : (
            <form onSubmit={healthGoalsForm.handleSubmit(onGoalsSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="calories">{t('caloriesGoal')}</Label>
                  <Input id="calories" type="number" {...healthGoalsForm.register('calories')} />
                  {healthGoalsForm.formState.errors.calories && <p className="text-sm text-destructive">{healthGoalsForm.formState.errors.calories.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="protein">{t('proteinGoal')}</Label>
                  <Input id="protein" type="number" {...healthGoalsForm.register('protein')} />
                  {healthGoalsForm.formState.errors.protein && <p className="text-sm text-destructive">{healthGoalsForm.formState.errors.protein.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="carbs">{t('carbsGoal')}</Label>
                  <Input id="carbs" type="number" {...healthGoalsForm.register('carbs')} />
                   {healthGoalsForm.formState.errors.carbs && <p className="text-sm text-destructive">{healthGoalsForm.formState.errors.carbs.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fat">{t('fatGoal')}</Label>
                  <Input id="fat" type="number" {...healthGoalsForm.register('fat')} />
                  {healthGoalsForm.formState.errors.fat && <p className="text-sm text-destructive">{healthGoalsForm.formState.errors.fat.message}</p>}
                </div>
              </div>
              <Button type="submit" disabled={healthGoalsForm.formState.isSubmitting}>
                {t('saveGoals')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
