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
    name: z.string().describe('Name of the suggested meal. Can be in its original language (e.g., "Shakshuka").'),
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
  prompt: `You are an AI chef and nutritionist that suggests healthy meals from a wide variety of international cuisines.
  Suggest {{numSuggestions}} healthy meals. The suggestions should be diverse and creative.
  Consider the following user preferences:

  {{#if dietaryRestrictions}}Dietary Restrictions: {{{dietaryRestrictions}}}{{/if}}
  {{#if allergies}}Allergies: {{{allergies}}}{{/if}}
  {{#if caloricIntake}}The user is aiming for around {{{caloricIntake}}} calories. The suggested meal(s) should fit within this budget.{{/if}}

  CRITICAL RULES:
  1. Your entire response MUST be a single, valid JSON array of meal objects. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
  2. For each meal, provide a name, a list of ingredients, and preparation instructions.
  3. For each meal, you MUST provide an estimated nutritional breakdown for one serving under a "nutrition" key. This nutritional info should be as complete as possible.
  4. The meal names can be in their original language if appropriate (e.g., 'Shakshuka', 'Pad Thai').
  5. Unless it is impossible to meet the user's constraints, you MUST return the requested number of suggestions. If you absolutely cannot generate suggestions, you MUST return an empty JSON array: [].`,
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
