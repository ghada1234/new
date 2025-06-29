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
  prompt: `You are a world-class nutritional AI assistant. Your primary function is to analyze an image of a meal and provide a detailed nutritional estimate. You must always identify a food unless the image clearly contains no food.

Photo: {{media url=photoDataUri}}

Follow these instructions with absolute precision:
1.  **Output Format**: Your entire output must be a single, valid JSON object that strictly adheres to the provided schema. Do not add any extra text or markdown.
2.  **Food Identification is Mandatory**: You MUST identify food items in the \`foodItems\` array if the image contains anything that could be food.
3.  **No Zero-Calorie Foods**: If you identify a food, the \`estimatedCalories\` MUST be greater than 0. The only exception is a glass of plain 'water'. If you see a salad, estimate at least 15-20 calories, not 0.
4.  **Be Comprehensive**: Provide estimates for as many nutrients (macro and micro) as possible. If a nutrient value is genuinely zero, you can omit the key.
5.  **Explain Your Reasoning**: Briefly explain your analysis in the \`explanation\` field. For example: "The image shows a bowl of what appears to be lentil soup. The estimate is based on a standard serving and includes contributions from lentils, vegetables, and broth."
6.  **Handle Non-Food**: Only if the image is unambiguously NOT food (e.g., a picture of a laptop), you must return \`{"foodItems": [], "estimatedCalories": 0}\`.
7.  **Educated Guesses**: If an item is unclear, make a well-reasoned guess based on visual cues. It is better to provide a reasonable estimate for a plausible food than to fail the request.

Example of a good response for an image of a croissant:
{
  "foodItems": [{"name": "Croissant"}],
  "estimatedCalories": 300,
  "estimatedProtein": 5,
  "estimatedCarbs": 35,
  "estimatedFat": 15,
  "explanation": "Estimate for a standard butter croissant. Calories are primarily from flour, butter, and sugar."
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
