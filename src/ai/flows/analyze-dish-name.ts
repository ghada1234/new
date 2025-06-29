'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NutritionalInfoSchema } from '@/ai/schemas';

const AnalyzeDishNameInputSchema = z.object({
  dishName: z.string().describe('The name of the dish to analyze. This can be in any language, including Arabic.'),
  portionSize: z
    .string()
    .optional()
    .describe(
      'The portion size of the dish (e.g., "1 slice", "100g", "طبق واحد"). If provided, the AI will adjust its estimate accordingly.'
    ),
});

export type AnalyzeDishNameInput = z.infer<typeof AnalyzeDishNameInputSchema>;
export type { AnalyzeDishNameOutput } from '@/ai/schemas';


export async function analyzeDishName(input: AnalyzeDishNameInput): Promise<z.infer<typeof NutritionalInfoSchema>> {
  return analyzeDishNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDishNamePrompt',
  input: { schema: AnalyzeDishNameInputSchema },
  output: { schema: NutritionalInfoSchema },
  prompt: `You are a nutritional expert AI. You are given the name of a dish, which may be in any language including Arabic, and an optional portion size.
  Based on this information, you will estimate the nutritional content of the dish.
  
  Dish Name: {{{dishName}}}
  {{#if portionSize}}Portion Size: {{{portionSize}}}{{/if}}
  
  CRITICAL RULES:
  1. Your entire response MUST be only a single, valid JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
  2. For any input that could plausibly be a food item (e.g., 'pizza', 'sushi', 'apple pie', 'سلطة'), you MUST identify it. This means the "foodItems" array must not be empty, and "estimatedCalories" MUST be a number greater than 0.
  3. You should only return an empty "foodItems" array and 0 calories if the input is unambiguously NOT a food item (e.g., "a rock", "un rocher", "a car").
  4. If you cannot estimate a specific nutrient for a food item, omit that nutrient's key from the JSON object. Do not use a value of 0, except for "estimatedCalories" in the case of non-food items as described in rule 3.`,
});

const analyzeDishNameFlow = ai.defineFlow(
  {
    name: 'analyzeDishNameFlow',
    inputSchema: AnalyzeDishNameInputSchema,
    outputSchema: NutritionalInfoSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Analysis failed: AI returned no output.');
    }
    // Better validation to prevent "zero calorie" issue for identified foods.
    if (output.foodItems && output.foodItems.length > 0 && (!output.estimatedCalories || output.estimatedCalories <= 0)) {
        throw new Error('Analysis failed: AI returned zero or no calories for an identified food item.');
    }
    return output;
  }
);
