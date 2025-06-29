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
  prompt: `You are a nutritional expert AI with deep knowledge of international cuisines. Your task is to analyze the provided dish name and return a detailed, estimated nutritional breakdown. The dish name can be in any language, including Arabic.

Dish Name: {{{dishName}}}
{{#if portionSize}}Portion Size: {{{portionSize}}}{{/if}}

CRITICAL RULES FOR YOUR RESPONSE:
1.  **JSON Only**: Your entire response MUST be a single, valid JSON object that conforms to the schema. Do not include any text, explanations, or markdown formatting like \`\`\`json.
2.  **Identify Food**: You MUST recognize a wide variety of international dishes. If the input is plausibly a food item (e.g., 'pizza', 'sushi', 'falafel', 'koshary', 'سلطة'), you MUST identify it.
3.  **NO ZERO CALORIES FOR FOOD**: If you identify a food item, the "estimatedCalories" field MUST be a number greater than 0. There are no exceptions for items that are clearly food. For example, a "pizza" cannot have 0 calories.
4.  **Exception for Zero-Calorie Items**: It is only acceptable to return 0 calories if the item is genuinely zero-calorie, such as 'water' or 'black coffee'. In these cases, you must still identify the item in the "foodItems" array.
5.  **Handle Non-Food**: Only return an empty "foodItems" array and 0 calories if the input is unambiguously NOT a food item (e.g., "a car" or "a rock").
6.  **Nutrient Omission**: If a specific nutrient cannot be estimated, omit its key from the JSON. Do not use a value of 0 unless it is truly zero (like sugar in water).`,
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
        // Exception for water
        const isWater = output.foodItems.some(item => item.name.toLowerCase().includes('water'));
        if (!isWater) {
            throw new Error('Analysis failed: AI returned zero or no calories for an identified food item.');
        }
    }
    return output;
  }
);
