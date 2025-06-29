
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
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
  prompt: `You are a nutritional analysis AI with expertise in a wide variety of international cuisines, including Middle Eastern and specifically Iraqi food. Your task is to analyze the provided dish name, which can be in any language including Arabic, and return a detailed nutritional estimate.

Your response MUST be a single, valid JSON object and nothing else. Do not include markdown formatting like \`\`\`json.

Dish Name: {{{dishName}}}
{{#if portionSize}}Portion Size: {{{portionSize}}}{{/if}}

CRITICAL INSTRUCTIONS:
1.  **Identify the Food**: You MUST identify at least one food item in the \`foodItems\` array. The input is always a food item. Make a best-effort guess if you are unsure (e.g., if the input is "مسكوف", identify it as "Masgouf (Iraqi grilled fish)"). Do not return an empty array for \`foodItems\`. If the input is not a food, identify it as what it is (e.g., "a chair").
2.  **List Ingredients**: If possible, provide a list of estimated ingredients in the \`ingredients\` array.
3.  **Estimate Calories**: You MUST provide an \`estimatedCalories\` value. If the input is not a food, return 0.
4.  **Explain**: You MUST provide a brief \`explanation\` for your analysis.
5.  **Confidence Score**: If possible, provide a \`confidence\` score between 0 and 1, representing your confidence in the accuracy of the overall analysis.
6.  **Full Nutrition**: Fill out as many of the other nutritional fields (protein, fat, vitamins, etc.) as you can based on the identified food.
`
});

const analyzeDishNameFlow = ai.defineFlow(
  {
    name: 'analyzeDishNameFlow',
    inputSchema: AnalyzeDishNameInputSchema,
    outputSchema: NutritionalInfoSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        // This can happen if the model call fails, is blocked, or returns JSON that doesn't match the required schema.
        throw new Error('AI model failed to return a valid analysis.');
      }
      return output;
    } catch (e) {
      console.error('[NutriSnap] Error in analyzeDishNameFlow:', e);
      throw new Error(
        'An error occurred during AI analysis. Please try again.'
      );
    }
  }
);
