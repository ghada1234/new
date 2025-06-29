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
2. If the image contains what appears to be food, you MUST identify it. This means the "foodItems" array must not be empty, and "estimatedCalories" MUST be a number greater than 0.
3. You should only return an empty "foodItems" array and 0 calories if the image unambiguously contains NO food items.
4. If you cannot estimate a specific nutrient for a food item, omit that nutrient's key from the JSON object. Do not use a value of 0, except for "estimatedCalories" in the case of non-food items as described in rule 3.`,
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
    // Better validation to prevent "zero calorie" issue for identified foods.
    if (output.foodItems && output.foodItems.length > 0 && (!output.estimatedCalories || output.estimatedCalories <= 0)) {
        throw new Error('Analysis failed: AI returned zero or no calories for an identified food item.');
    }
    return output;
  }
);
