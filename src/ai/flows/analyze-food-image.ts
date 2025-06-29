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
  prompt: `You are an expert nutritionist. Analyze the image of the meal and provide estimated nutritional information for the entire meal shown.
  
Your response MUST be a single, valid JSON object that conforms to the specified schema.

Photo: {{media url=photoDataUri}}

CRITICAL RULES:
1. Your entire response MUST be only the JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
2. If the image does not contain food, or you cannot identify any food, you MUST return a JSON object with an empty "foodItems" array and all nutritional values as 0 or omitted, e.g., '{"foodItems": [], "estimatedCalories": 0}'.
3. For any recognizable food, you MUST provide an "estimatedCalories" value greater than 0. Do not return 0 calories for an actual food item.
4. If you cannot estimate a specific nutrient, omit its key from the JSON object instead of providing a value of 0. The only exception is 'estimatedCalories', which must be present for recognizable food.`,
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
      throw new Error('Analysis failed: AI returned no output.');
    }
    // Basic validation to prevent "zero calorie" issue
    if (output.foodItems && output.foodItems.length > 0 && output.estimatedCalories === 0) {
        throw new Error('Analysis failed: AI returned zero calories for an identified food item.');
    }
    return output;
  }
);
