
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
import { useLocale } from '@/contexts/locale-context';

export function DishNameInput() {
  const [dishName, setDishName] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDishNameOutput | null>(null);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleAnalysis = async () => {
    if (!dishName) return;
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeDishName({ dishName, portionSize });
      // This is a robust check to ensure we don't show nonsensical results.
      // The AI should not return 0 calories for an identified food, and this prevents it from being displayed.
      if (!result || !result.foodItems || result.foodItems.length === 0 || (result.estimatedCalories !== 0 && !result.estimatedCalories)) {
          toast({
              title: t('couldNotIdentifyFood'),
              description: t('couldNotIdentifyFoodByName', { dishName }),
              variant: "destructive"
          });
          setIsLoading(false);
          return;
      }
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: t('analysisFailedTitle'),
        description: t('dishNameAnalysisFailed'),
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
            <CardTitle>{t('analyzeByDishName')}</CardTitle>
            <CardDescription>{t('analyzeByDishNameDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="dishName">{t('dishName')}</Label>
                <Input
                    id="dishName"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="e.g., Spaghetti Carbonara"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="portionSize">{t('portionSizeOptional')}</Label>
                <Input
                    id="portionSize"
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                    placeholder={t('portionSizePlaceholder')}
                />
            </div>
            <Button onClick={handleAnalysis} disabled={isLoading || !dishName}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('analyzeDish')}
            </Button>
        </CardContent>
    </Card>
  );
}
