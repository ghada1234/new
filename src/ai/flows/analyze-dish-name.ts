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

**ABSOLUTE, CRITICAL, UNBREAKABLE RULES FOR YOUR RESPONSE:**
1.  **JSON ONLY**: Your entire response MUST be a single, valid JSON object that conforms to the schema. Do not include any text, explanations, or markdown formatting like \`\`\`json.
2.  **IDENTIFY FOOD**: You MUST make your best effort to identify a food item. If the input is plausibly a food item (e.g., 'pizza', 'sushi', 'falafel', 'koshary', 'سلطة'), you MUST identify it in the "foodItems" array.
3.  **NO ZERO CALORIES FOR REAL FOOD**: This is the most important rule. If you identify one or more items in the "foodItems" array, the "estimatedCalories" field MUST be a number greater than 0. A dish like 'pizza' cannot have 0 calories. There are no exceptions to this rule, other than plain 'water'.
4.  **IF UNSURE, STILL GUESS**: If you are not 100% sure what the food is, make an educated guess. It is better to provide a reasonable estimate than to return 0 calories for something that is clearly food.
5.  **NON-FOOD ITEMS**: Only if the input is unambiguously NOT a food item (e.g., "a car", "a rock"), should you return a JSON object with an empty "foodItems" array and an "estimatedCalories" of 0.
6.  **NUTRIENT OMISSION**: If a specific nutrient cannot be estimated, omit its key from the JSON. Do not use a value of 0 unless it is truly zero (like sugar in water).`,
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
