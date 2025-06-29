
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
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
  prompt: `You are a nutritional analysis AI with expertise in identifying a wide variety of international cuisines from images, including Middle Eastern and specifically Iraqi food. Your task is to analyze the provided image and return a detailed nutritional estimate.

Photo: {{media url=photoDataUri}}

CRITICAL INSTRUCTIONS:
1.  **Identify the Food**: You MUST identify at least one food item in the \`foodItems\` array. Make a best-effort guess if you are unsure (e.g., if you see a grilled fish on a platter, you might identify it as "Masgouf (Iraqi grilled fish)" if it matches the appearance). Do not return an empty array for \`foodItems\`. If the image does not contain food, identify the object (e.g., "a red car").
2.  **List Ingredients**: If possible, provide a list of estimated ingredients in the \`ingredients\` array based on the image.
3.  **Estimate Calories**: You MUST provide an \`estimatedCalories\` value. For any identified food, this value MUST be greater than zero. Only plain water can have zero calories. A small salad is at least 15 calories. If the image is not food, return 0.
4.  **Explain**: You MUST provide a brief \`explanation\` for your analysis.
5.  **Full Nutrition**: Fill out as many of the other nutritional fields (protein, fat, vitamins, etc.) as you can based on the identified food.
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
      // This can happen if the model call fails, is blocked, or returns JSON that doesn't match the required schema.
      throw new Error('AI model failed to return a valid analysis.');
    }
    return output;
  }
);
