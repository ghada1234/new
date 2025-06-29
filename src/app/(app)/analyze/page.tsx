'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CameraInput } from '@/components/analysis/camera-input';
import { DishNameInput } from '@/components/analysis/dish-name-input';

export default function AnalyzePage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">تحليل الوجبة</h1>
      <p className="text-muted-foreground">
        احصل على المعلومات الغذائية عن طريق التقاط صورة لوجبتك أو إدخال اسمها.
      </p>
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">الكاميرا</TabsTrigger>
          <TabsTrigger value="text">اسم الطبق</TabsTrigger>
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
