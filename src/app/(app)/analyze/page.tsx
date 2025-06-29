
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CameraInput } from '@/components/analysis/camera-input';
import { DishNameInput } from '@/components/analysis/dish-name-input';
import { useLocale } from '@/contexts/locale-context';

export default function AnalyzePage() {
  const { t } = useLocale();
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">{t('analyzeMeal')}</h1>
      <p className="text-muted-foreground">
        {t('analyzeMealDescription')}
      </p>
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">{t('camera')}</TabsTrigger>
          <TabsTrigger value="text">{t('dishName')}</TabsTrigger>
        </TabsList>
        <TabsContent value="camera">
          <CameraInput />
        </TabsContent>
        <TabsContent value="text">
          <DishNameInput />
        </TabsContent>
      </Tabs>
    </div>
  );
}
