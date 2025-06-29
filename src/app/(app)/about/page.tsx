'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocale } from '@/contexts/locale-context';

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">{t('aboutMe')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('myStory')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex flex-col md:flex-row gap-8 items-center">
            <Avatar className="h-32 w-32">
                <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="woman portrait" />
                <AvatarFallback>GA</AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground text-lg">
              {t('aboutMeDescription')}
            </p>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('whyNutriSnap')}</CardTitle>
          <CardDescription>
            {t('ourMission')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              {t('whyNutriSnapDescription')}
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
