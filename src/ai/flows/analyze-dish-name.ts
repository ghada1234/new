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
  prompt: `You are a world-class nutritional AI assistant. Your primary function is to analyze a dish name, which can be in any language, and provide a detailed nutritional estimate. You must always identify a food unless the input is clearly not food.

Dish Name: {{{dishName}}}
{{#if portionSize}}Portion Size: {{{portionSize}}}{{/if}}

Follow these instructions with absolute precision:
1.  **Output Format**: Your entire output must be a single, valid JSON object that strictly adheres to the provided schema. Do not add any extra text or markdown.
2.  **Food Identification is Mandatory**: You MUST identify a food item in the \`foodItems\` array if the input is even remotely a food.
3.  **No Zero-Calorie Foods**: If you identify a food, the \`estimatedCalories\` MUST be greater than 0. The only exception is 'water'. If you think a food is low-calorie, provide a low, non-zero estimate. For example, for 'green salad', estimate at least 15-20 calories, not 0.
4.  **Be Comprehensive**: Provide estimates for as many nutrients (macro and micro) as possible. If a nutrient value is genuinely zero, you can omit the key.
5.  **Explain Your Reasoning**: Briefly explain your analysis in the \`explanation\` field. For example: "Based on 'Koshary', a common Egyptian dish, this estimate is for a standard serving size. It contains rice, lentils, and pasta, contributing to the carbs, and is topped with a tomato-vinegar sauce."
6.  **Handle Non-Food**: Only if the input is unambiguously NOT a food item (e.g., "a pencil", "running shoes"), you must return \`{"foodItems": [], "estimatedCalories": 0}\`.
7.  **Educated Guesses**: If a dish name is ambiguous or you're unsure, make a well-reasoned guess based on the most likely interpretation. It is better to provide a reasonable estimate for a plausible food than to fail the request.

Example of a good response for the input "Falafel wrap":
{
  "foodItems": [{"name": "Falafel Wrap"}],
  "estimatedCalories": 450,
  "estimatedProtein": 15,
  "estimatedCarbs": 55,
  "estimatedFat": 20,
  "explanation": "Estimate for a standard falafel wrap with tahini sauce and vegetables. Calories come from the fried falafel, pita bread, and sauce."
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
