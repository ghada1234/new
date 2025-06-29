
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NutritionalInfoSchema } from '@/ai/schemas';

const AnalyzeFoodImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnalyzeFoodImageInput = z.infer<typeof AnalyzeFoodImageInputSchema>;
export type { AnalyzeFoodImageOutput } from '@/ai/schemas';

export async function analyzeFoodImage(input: AnalyzeFoodImageInput): Promise<z.infer<typeof NutritionalInfoSchema>> {
  return analyzeFoodImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodImagePrompt',
  input: { schema: AnalyzeFoodImageInputSchema },
  output: { schema: NutritionalInfoSchema },
  prompt: `You are a nutritional analysis AI. Your task is to analyze the provided image and return a nutritional estimate in JSON format.

Photo: {{media url=photoDataUri}}

CRITICAL RULES:
1.  **JSON ONLY**: Your entire response MUST be a single, valid JSON object matching the output schema. No extra text.
2.  **ALWAYS IDENTIFY FOOD**: You MUST make a best-effort guess to identify a food item in the image. For any plausible food, you MUST identify it in the \`foodItems\` array.
3.  **NEVER ZERO CALORIES FOR FOOD**: If \`foodItems\` is not empty, \`estimatedCalories\` MUST be a number greater than 0. A salad in the image is not 0 calories, it's at least 15. The only exception is a glass of plain "water".
4.  **HANDLE NON-FOOD**: Only if the image definitively contains NO food items (e.g., a picture of a car), return \`{"foodItems": [], "estimatedCalories": 0}\`.
5.  **EXPLAIN**: Briefly justify your estimate in the \`explanation\` field.

Example for an image of a pizza slice:
{
  "foodItems": [{"name": "Pizza Slice"}],
  "estimatedCalories": 285,
  "estimatedProtein": 12,
  "estimatedCarbs": 36,
  "estimatedFat": 10,
  "explanation": "Estimate for a standard slice of pepperoni pizza. Calories are from the crust, cheese, sauce, and pepperoni."
}
`,
});

const analyzeFoodImageFlow = ai.defineFlow(
  {
    name: 'analyzeFoodImageFlow',
    inputSchema: AnalyzeFoodImageInputSchema,
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
