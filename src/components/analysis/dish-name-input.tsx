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
              title: "Could Not Identify Food",
              description: `We couldn't identify "${dishName}" as a food item. Please try a different name.`,
              variant: "destructive"
          });
          setIsLoading(false);
          return;
      }
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the dish name. Please try again.",
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
            <CardTitle>Analyze by Dish Name</CardTitle>
            <CardDescription>Enter the name of your dish and optionally the portion size.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="dishName">Dish Name</Label>
                <Input
                    id="dishName"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="e.g., Spaghetti Carbonara"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="portionSize">Portion Size (optional)</Label>
                <Input
                    id="portionSize"
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                    placeholder="e.g., 1 bowl, 200g"
                />
            </div>
            <Button onClick={handleAnalysis} disabled={isLoading || !dishName}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Dish
            </Button>
        </CardContent>
    </Card>
  );
}
