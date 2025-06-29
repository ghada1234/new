'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { NutritionalInfoSchema } from '../schemas';

const SuggestMealsInputSchema = z.object({
  dietaryRestrictions: z.string().describe('Dietary restrictions (e.g., vegetarian, gluten-free).').optional(),
  allergies: z.string().describe('Allergies to consider (e.g., peanuts, dairy).').optional(),
  caloricIntake: z.number().describe('Target daily caloric intake for context, or a target for the suggested meal itself.').optional(),
  numSuggestions: z.number().default(3).describe('Number of meal suggestions to generate.')
});

export type SuggestMealsInput = z.infer<typeof SuggestMealsInputSchema>;

const SuggestMealsOutputSchema = z.array(
  z.object({
    name: z.string().describe('Name of the suggested meal.'),
    ingredients: z.string().describe('List of ingredients for the meal.'),
    instructions: z.string().describe('Instructions for preparing the meal.'),
    nutrition: NutritionalInfoSchema.optional().describe('Estimated nutritional information for one serving of the meal.')
  })
);

export type SuggestMealsOutput = z.infer<typeof SuggestMealsOutputSchema>;

export async function suggestMeals(input: SuggestMealsInput): Promise<SuggestMealsOutput> {
  return suggestMealsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMealsPrompt',
  input: { schema: SuggestMealsInputSchema },
  output: { schema: SuggestMealsOutputSchema },
  prompt: `Suggest {{numSuggestions}} healthy meals. Consider the following preferences:

  {{#if dietaryRestrictions}}Dietary Restrictions: {{{dietaryRestrictions}}}{{/if}}
  {{#if allergies}}Allergies: {{{allergies}}}{{/if}}
  {{#if caloricIntake}}The user is aiming for around {{{caloricIntake}}} calories. The suggested meal(s) should fit within this budget.{{/if}}

  CRITICAL RULES:
  1. Your entire response MUST be only a single, valid JSON array of meal objects. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
  2. For each meal, provide a name, a list of ingredients, and preparation instructions.
  3. For each meal, also provide an estimated nutritional breakdown for one serving under a "nutrition" key.
  4. If you cannot generate suggestions, you MUST return an empty JSON array: [].`,
});

const suggestMealsFlow = ai.defineFlow(
  {
    name: 'suggestMealsFlow',
    inputSchema: SuggestMealsInputSchema,
    outputSchema: SuggestMealsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Suggestion generation failed: AI returned no output.');
    }
    return output;
  }
);
