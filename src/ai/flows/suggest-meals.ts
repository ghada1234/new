'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { NutritionalInfoSchema } from '../schemas';

const SuggestMealsInputSchema = z.object({
  dietaryRestrictions: z.string().describe('Dietary restrictions (e.g., vegetarian, gluten-free).').optional(),
  allergies: z.string().describe('Allergies to consider (e.g., peanuts, dairy).').optional(),
  caloricIntake: z.number().describe('Target daily caloric intake for context, or a target for the suggested meal itself.').optional(),
  numSuggestions: z.number().default(3).describe('Number of meal suggestions to generate.'),
  language: z.string().optional().describe('The language for the meal suggestions (e.g., "en", "ar").')
});

export type SuggestMealsInput = z.infer<typeof SuggestMealsInputSchema>;

const SuggestMealsOutputSchema = z.array(
  z.object({
    name: z.string().describe('Name of the suggested meal, in the requested language.'),
    ingredients: z.string().describe('List of ingredients for the meal, in the requested language.'),
    instructions: z.string().describe('Instructions for preparing the meal, in the requested language.'),
    nutrition: NutritionalInfoSchema.describe('Estimated nutritional information for one serving of the meal, including macro and micro nutrients.')
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
  prompt: `You are an AI chef and nutritionist that suggests healthy meals from a wide variety of international cuisines, with a special emphasis on delicious and healthy Iraqi cuisine.
  Suggest {{numSuggestions}} healthy meals. The suggestions should be diverse and creative.
  
  CRITICAL: The entire response, including meal names, ingredients, and instructions, MUST be in the following language: '{{#if language}}{{language}}{{else}}en{{/if}}'.

  Consider the following user preferences:

  {{#if dietaryRestrictions}}Dietary Restrictions: {{{dietaryRestrictions}}}{{/if}}
  {{#if allergies}}Allergies: {{{allergies}}}{{/if}}
  {{#if caloricIntake}}The user is aiming for around {{{caloricIntake}}} calories. The suggested meal(s) should fit within this budget.{{/if}}

  CRITICAL RULES:
  1. Your entire response MUST be a single, valid JSON array of meal objects. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
  2. For each meal, provide a name, a list of ingredients, and preparation instructions. All of this text MUST be in the requested language ('{{#if language}}{{language}}{{else}}en{{/if}}').
  3. For each meal, you MUST provide a detailed estimated nutritional breakdown for one serving under a "nutrition" key. This "nutrition" object must adhere to the following:
      a. It MUST contain a 'foodItems' array listing the primary components of the meal (e.g., [{ "name": "Chicken Breast" }, { "name": "Brown Rice" }]). This array MUST NOT be empty.
      b. It MUST contain an 'estimatedCalories' value. This value MUST be greater than 0.
      c. It MUST contain a brief 'explanation' string describing how you arrived at the nutritional estimate.
      d. Fill out as many of the other nutritional fields (protein, fat, vitamins, etc.) as you can.
  4. Unless it is impossible to meet the user's constraints, you MUST return the requested number of suggestions. If you absolutely cannot generate suggestions, you MUST return an empty JSON array: [].`,
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
      throw new Error('Suggestion generation failed: AI returned no output or it was in the wrong format.');
    }
    return output;
  }
);
