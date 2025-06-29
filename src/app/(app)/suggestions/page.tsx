
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
import { useLocale } from '@/contexts/locale-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { NutrientDisplay } from '@/components/analysis/nutrient-display';

function SuggestionCard({ suggestion }: { suggestion: SuggestMealsOutput[0] }) {
  const { t } = useLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{suggestion.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger>{t('ingredients')}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {suggestion.ingredients}
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger>{t('instructions')}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {suggestion.instructions}
              </p>
            </AccordionContent>
          </AccordionItem>
          {suggestion.nutrition && (
            <AccordionItem value="nutrition">
              <AccordionTrigger>{t('nutritionalInformation')}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <NutrientDisplay label={t('totalCalories')} value={suggestion.nutrition.estimatedCalories} unit={t('caloriesUnit')} />
                    <NutrientDisplay label={t('protein')} value={suggestion.nutrition.estimatedProtein} unit={t('grams')} />
                    <NutrientDisplay label={t('carbohydrates')} value={suggestion.nutrition.estimatedCarbs} unit={t('grams')} />
                    <NutrientDisplay label={t('fat')} value={suggestion.nutrition.estimatedFat} unit={t('grams')} />
                    <NutrientDisplay label={t('saturatedFat')} value={suggestion.nutrition.estimatedSaturatedFat} unit={t('grams')} />
                    <NutrientDisplay label={t('fiber')} value={suggestion.nutrition.estimatedFiber} unit={t('grams')} />
                    <NutrientDisplay label={t('sugar')} value={suggestion.nutrition.estimatedSugar} unit={t('grams')} />
                    <NutrientDisplay label={t('sodium')} value={suggestion.nutrition.estimatedSodium} unit={t('milligrams')} />
                    <NutrientDisplay label={t('iron')} value={suggestion.nutrition.estimatedIron} unit={t('milligrams')} />
                    <NutrientDisplay label={t('calcium')} value={suggestion.nutrition.estimatedCalcium} unit={t('milligrams')} />
                    <NutrientDisplay label={t('magnesium')} value={suggestion.nutrition.estimatedMagnesium} unit={t('milligrams')} />
                    <NutrientDisplay label={t('zinc')} value={suggestion.nutrition.estimatedZinc} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminA')} value={suggestion.nutrition.estimatedVitaminA} unit={t('micrograms')} />
                    <NutrientDisplay label={t('vitaminC')} value={suggestion.nutrition.estimatedVitaminC} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminD')} value={suggestion.nutrition.estimatedVitaminD} unit={t('micrograms')} />
                    <NutrientDisplay label={t('vitaminE')} value={suggestion.nutrition.estimatedVitaminE} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminK')} value={suggestion.nutrition.estimatedVitaminK} unit={t('micrograms')} />
                    <NutrientDisplay label={t('vitaminB1')} value={suggestion.nutrition.estimatedVitaminB1} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminB2')} value={suggestion.nutrition.estimatedVitaminB2} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminB3')} value={suggestion.nutrition.estimatedVitaminB3} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminB5')} value={suggestion.nutrition.estimatedVitaminB5} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminB6')} value={suggestion.nutrition.estimatedVitaminB6} unit={t('milligrams')} />
                    <NutrientDisplay label={t('vitaminB7')} value={suggestion.nutrition.estimatedVitaminB7} unit={t('micrograms')} />
                    <NutrientDisplay label={t('vitaminB9')} value={suggestion.nutrition.estimatedVitaminB9} unit={t('micrograms')} />
                    <NutrientDisplay label={t('vitaminB12')} value={suggestion.nutrition.estimatedVitaminB12} unit={t('micrograms')} />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

const sampleSuggestionsEn: SuggestMealsOutput = [
    {
      name: 'Iraqi Dolma (Stuffed Vegetables)',
      ingredients: 'Onions, tomatoes, bell peppers, zucchini, rice, minced lamb or beef, parsley, dill, mint, pomegranate molasses, lemon juice.',
      instructions: '1. Prepare the vegetables by hollowing them out.\n2. Mix rice, meat, herbs, and spices for the filling.\n3. Stuff the vegetables with the mixture.\n4. Arrange stuffed vegetables in a pot, add water and pomegranate molasses.\n5. Simmer until cooked through.',
      nutrition: {
        foodItems: [{ name: 'Dolma' }],
        estimatedCalories: 350,
        estimatedProtein: 15,
        estimatedCarbs: 40,
        estimatedFat: 15,
        explanation: 'Estimated nutrition for a medium serving of homemade Dolma.'
      }
    },
    {
      name: 'Tabbouleh Salad',
      ingredients: 'Fine bulgur, parsley, mint, tomatoes, onions, lemon juice, olive oil.',
      instructions: '1. Soak bulgur wheat.\n2. Finely chop parsley, mint, tomatoes, and onions.\n3. Combine all ingredients.\n4. Dress with lemon juice and olive oil.',
      nutrition: {
        foodItems: [{ name: 'Tabbouleh' }],
        estimatedCalories: 150,
        estimatedProtein: 4,
        estimatedCarbs: 20,
        estimatedFat: 7,
        explanation: 'Estimated nutrition for a standard side salad portion.'
      }
    },
    {
      name: 'Quzi (Slow-Roasted Lamb)',
      ingredients: 'Lamb shoulder or leg, rice, vermicelli noodles, peas, carrots, raisins, almonds, spices (cardamom, cinnamon, allspice).',
      instructions: '1. Slow-roast the lamb with spices until tender.\n2. Cook rice with vermicelli.\n3. Garnish with fried nuts, raisins, and vegetables.\n4. Serve the lamb on a bed of the prepared rice.',
      nutrition: {
        foodItems: [{ name: 'Quzi' }],
        estimatedCalories: 600,
        estimatedProtein: 40,
        estimatedCarbs: 55,
        estimatedFat: 25,
        explanation: 'Estimated nutrition for a generous serving of Quzi.'
      }
    }
  ];

const sampleSuggestionsAr: SuggestMealsOutput = [
    {
      name: 'دولمة عراقية (خضروات محشية)',
      ingredients: 'بصل، طماطم، فلفل حلو، كوسا، أرز، لحم مفروم (ضأن أو بقر)، بقدونس، شبت، نعناع، دبس رمان، عصير ليمون.',
      instructions: '1. تحضير الخضروات عن طريق تفريغها.\n2. خلط الأرز واللحم والأعشاب والتوابل للحشوة.\n3. حشو الخضروات بالخليط.\n4. ترتيب الخضروات المحشوة في قدر، وإضافة الماء ودبس الرمان.\n5. الطهي على نار هادئة حتى تنضج تمامًا.',
      nutrition: {
        foodItems: [{ name: 'دولمة' }],
        estimatedCalories: 350,
        estimatedProtein: 15,
        estimatedCarbs: 40,
        estimatedFat: 15,
        explanation: 'تقدير غذائي لحصة متوسطة من الدولمة المصنوعة منزليًا.'
      }
    },
    {
      name: 'سلطة تبولة',
      ingredients: 'برغل ناعم، بقدونس، نعناع، طماطم، بصل، عصير ليمون، زيت زيتون.',
      instructions: '1. نقع البرغل.\n2. فرم البقدونس والنعناع والطماطم والبصل ناعماً.\n3. خلط جميع المكونات.\n4. تتبيل السلطة بعصير الليمون وزيت الزيتون.',
      nutrition: {
        foodItems: [{ name: 'تبولة' }],
        estimatedCalories: 150,
        estimatedProtein: 4,
        estimatedCarbs: 20,
        estimatedFat: 7,
        explanation: 'تقدير غذائي لحصة سلطة جانبية قياسية.'
      }
    },
    {
      name: 'قوزي (لحم خروف مشوي ببطء)',
      ingredients: 'كتف أو فخذ خروف، أرز، شعيرية، بازلاء، جزر، زبيب، لوز، بهارات (هيل، قرفة، بهار حلو).',
      instructions: '1. شوي لحم الخروف ببطء مع البهارات حتى يصبح طريًا.\n2. طبخ الأرز مع الشعيرية.\n3. التزيين بالمكسرات المقلية والزبيب والخضروات.\n4. تقديم اللحم فوق طبقة من الأرز المحضر.',
      nutrition: {
        foodItems: [{ name: 'قوزي' }],
        estimatedCalories: 600,
        estimatedProtein: 40,
        estimatedCarbs: 55,
        estimatedFat: 25,
        explanation: 'تقدير غذائي لحصة سخية من القوزي.'
      }
    }
  ];


export default function SuggestionsPage() {
  const { t, locale } = useLocale();
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: '',
    allergies: '',
    caloricIntake: '2000',
  });
  const [isSample, setIsSample] = useState(true);
  const [suggestions, setSuggestions] = useState<SuggestMealsOutput | null>(
    locale === 'ar' ? sampleSuggestionsAr : sampleSuggestionsEn
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const getSuggestions = async () => {
    setIsLoading(true);
    setIsSample(false);
    setSuggestions(null);
    try {
      const result = await suggestMeals({
        dietaryRestrictions: preferences.dietaryRestrictions,
        allergies: preferences.allergies,
        caloricIntake: parseInt(preferences.caloricIntake, 10),
        language: locale,
      });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: t('suggestionFetchErrorTitle'),
        description: t('suggestionFetchErrorDescription'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">{t('aiMealSuggestions')}</h1>
      <p className="text-muted-foreground">
        {t('aiMealSuggestionsDescription')}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>{t('yourPreferences')}</CardTitle>
          <CardDescription>
            {t('yourPreferencesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="dietaryRestrictions">{t('dietaryRestrictions')}</Label>
            <Input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder={t('dietaryRestrictionsPlaceholder')}
              value={preferences.dietaryRestrictions}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergies">{t('allergies')}</Label>
            <Input
              id="allergies"
              name="allergies"
              placeholder={t('allergiesPlaceholder')}
              value={preferences.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caloricIntake">{t('targetDailyCalories')}</Label>
            <Input
              id="caloricIntake"
              name="caloricIntake"
              type="number"
              placeholder={t('targetDailyCaloriesPlaceholder')}
              value={preferences.caloricIntake}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={getSuggestions} disabled={isLoading} className="w-full md:w-auto">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('getSuggestions')}
      </Button>

      {suggestions && suggestions.length > 0 && (
        <div className="mt-6 space-y-4">
            <h2 className="font-headline text-xl font-bold">{isSample ? t('sampleSuggestions') : t('hereAreYourSuggestions')}</h2>
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
