
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
  prompt: `You are a nutritional analysis AI. Your task is to analyze the provided dish name and return a nutritional estimate in JSON format.

Dish Name: {{{dishName}}}
{{#if portionSize}}Portion Size: {{{portionSize}}}{{/if}}

CRITICAL RULES:
1.  **JSON ONLY**: Your entire response MUST be a single, valid JSON object matching the output schema. No extra text.
2.  **ALWAYS IDENTIFY FOOD**: You MUST make a best-effort guess to identify a food item. If the input is "Torsken", guess it's "Cod fish". For any plausible food, you MUST identify it.
3.  **NEVER ZERO CALORIES FOR FOOD**: If \`foodItems\` is not empty, \`estimatedCalories\` MUST be a number greater than 0. A green salad is not 0 calories, it's at least 15. The only exception is plain "water".
4.  **HANDLE NON-FOOD**: Only if the input is definitively NOT a food item (e.g., "chair", "running"), return \`{"foodItems": [], "estimatedCalories": 0}\`.
5.  **EXPLAIN**: Briefly justify your estimate in the \`explanation\` field.

Example Input: "Koshary"
Example Output:
{
  "foodItems": [{"name": "Koshary"}],
  "estimatedCalories": 500,
  "estimatedProtein": 20,
  "estimatedCarbs": 90,
  "estimatedFat": 8,
  "explanation": "Estimate for a standard serving of Koshary, an Egyptian dish with rice, pasta, and lentils."
}
`
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
      // This can happen if the model call fails or is blocked by safety settings.
      // We will return an object that the frontend check will catch as invalid.
      return { foodItems: [], estimatedCalories: 0 };
    }
    return output;
  }
);
