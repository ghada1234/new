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
                    <h4 className="font-semibold">Ingredients</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.ingredients}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Instructions</h4>
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
        title: "Suggestion Failed",
        description: "Could not get meal suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">AI Meal Suggestions</h1>
      <p className="text-muted-foreground">
        Get meal ideas based on your dietary needs and preferences.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
          <CardDescription>
            Tell us a bit about what you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
            <Input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder="e.g., Vegetarian, Gluten-Free"
              value={preferences.dietaryRestrictions}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              name="allergies"
              placeholder="e.g., Peanuts, Dairy"
              value={preferences.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caloricIntake">Target Daily Calories</Label>
            <Input
              id="caloricIntake"
              name="caloricIntake"
              type="number"
              placeholder="e.g., 2000"
              value={preferences.caloricIntake}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={getSuggestions} disabled={isLoading} className="w-full md:w-auto">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Get Suggestions
      </Button>

      {suggestions && (
        <div className="mt-6 space-y-4">
            <h2 className="font-headline text-xl font-bold">Here are your suggestions:</h2>
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
