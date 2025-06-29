'use client';
import { useState } from 'react';
import { suggestMeals, type SuggestMealsOutput } from '@/ai/flows/suggest-meals';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SuggestionCard({ suggestion }: { suggestion: SuggestMealsOutput[0] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{suggestion.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">المكونات</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.ingredients}</p>
                </div>
                <div>
                    <h4 className="font-semibold">التعليمات</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.instructions}</p>
                </div>
            </CardContent>
        </Card>
    );
}


export default function SuggestionsPage() {
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: '',
    allergies: '',
    caloricIntake: '2000',
  });
  const [suggestions, setSuggestions] = useState<SuggestMealsOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const getSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestMeals({
        dietaryRestrictions: preferences.dietaryRestrictions,
        allergies: preferences.allergies,
        caloricIntake: parseInt(preferences.caloricIntake, 10),
      });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "فشل الاقتراح",
        description: "تعذر الحصول على اقتراحات وجبات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">اقتراحات وجبات بالذكاء الاصطناعي</h1>
      <p className="text-muted-foreground">
        احصل على أفكار لوجبات بناءً على احتياجاتك وتفضيلاتك الغذائية.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>تفضيلاتك</CardTitle>
          <CardDescription>
            أخبرنا قليلاً عما تبحث عنه.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="dietaryRestrictions">قيود غذائية</Label>
            <Input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder="مثال: نباتي، خالي من الغلوتين"
              value={preferences.dietaryRestrictions}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergies">الحساسية</Label>
            <Input
              id="allergies"
              name="allergies"
              placeholder="مثال: فول سوداني، ألبان"
              value={preferences.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caloricIntake">السعرات الحرارية اليومية المستهدفة</Label>
            <Input
              id="caloricIntake"
              name="caloricIntake"
              type="number"
              placeholder="مثال: 2000"
              value={preferences.caloricIntake}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={getSuggestions} disabled={isLoading} className="w-full md:w-auto">
        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        الحصول على اقتراحات
      </Button>

      {suggestions && (
        <div className="mt-6 space-y-4">
            <h2 className="font-headline text-xl font-bold">إليك اقتراحاتك:</h2>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {suggestions.map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
