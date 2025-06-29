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
  1. Your entire response MUST be only a single, valid JSON object that conforms to the specified schema. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
  2. If the provided dish name is clearly not food (e.g., "a rock", "un rocher"), you MUST return a JSON object with an empty "foodItems" array and all nutritional values as 0 or omitted, e.g., '{"foodItems": [], "estimatedCalories": 0}'.
  3. For any recognizable food, you MUST provide an "estimatedCalories" value greater than 0. Do not return 0 calories for an actual food item.
  4. If you cannot estimate a specific nutrient, omit its key from the JSON object instead of providing a value of 0. The only exception is 'estimatedCalories', which must be present for recognizable food.`,
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
     // Basic validation to prevent "zero calorie" issue
    if (output.foodItems && output.foodItems.length > 0 && output.estimatedCalories === 0) {
        throw new Error('Analysis failed: AI returned zero calories for an identified food item.');
    }
    return output;
  }
);
