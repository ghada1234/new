
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
  prompt: `You are a nutritional analysis AI. Your task is to analyze the provided dish name and return a detailed nutritional estimate.

Dish Name: {{{dishName}}}
{{#if portionSize}}Portion Size: {{{portionSize}}}{{/if}}

CRITICAL INSTRUCTIONS:
1.  **Identify the Food**: You MUST identify at least one food item in the \`foodItems\` array. The input is always a food item. Make a best-effort guess if you are unsure (e.g., if the input is "Torsken", identify it as "Cod fish"). Do not return an empty array for \`foodItems\`. If the input is not a food, identify it as what it is (e.g., "a chair").
2.  **Estimate Calories**: You MUST provide an \`estimatedCalories\` value. For any identified food, this value MUST be greater than zero. Only plain water can have zero calories. If the input is not a food, return 0.
3.  **Explain**: You MUST provide a brief \`explanation\` for your analysis.
4.  **Full Nutrition**: Fill out as many of the other nutritional fields (protein, fat, vitamins, etc.) as you can based on the identified food.
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
      // This can happen if the model call fails, is blocked, or returns JSON that doesn't match the required schema.
      throw new Error('AI model failed to return a valid analysis.');
    }
    return output;
  }
);
