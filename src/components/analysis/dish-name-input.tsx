'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnalysisResult } from '@/components/analysis/analysis-result';
import { analyzeDishName, type AnalyzeDishNameOutput } from '@/ai/flows/analyze-dish-name';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function DishNameInput() {
  const [dishName, setDishName] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDishNameOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!dishName) return;
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeDishName({ dishName, portionSize });
      if ((!result.foodItems || result.foodItems.length === 0) && (!result.estimatedCalories || result.estimatedCalories <= 0)) {
          toast({
              title: "تعذر تحديد الطعام",
              description: `لم نتمكن من تحديد "${dishName}" كعنصر غذائي. يرجى تجربة اسم مختلف.`,
              variant: "destructive"
          });
          setIsLoading(false);
          return;
      }
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "فشل التحليل",
        description: "تعذر تحليل اسم الطبق. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setAnalysisResult(null);
    setDishName('');
    setPortionSize('');
  };

  if (analysisResult) {
    return <AnalysisResult result={analysisResult} onReset={reset} />;
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
            <CardTitle>تحليل حسب اسم الطبق</CardTitle>
            <CardDescription>أدخل اسم طبقك وحجم الحصة اختياريًا.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="dishName">اسم الطبق</Label>
                <Input
                    id="dishName"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="مثال: سباغيتي كاربونارا"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="portionSize">حجم الحصة (اختياري)</Label>
                <Input
                    id="portionSize"
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                    placeholder="مثال: وعاء واحد، 200 جرام"
                />
            </div>
            <Button onClick={handleAnalysis} disabled={isLoading || !dishName}>
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                تحليل الطبق
            </Button>
        </CardContent>
    </Card>
  );
}
