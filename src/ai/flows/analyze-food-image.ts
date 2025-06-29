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
  prompt: `You are an expert nutritionist AI. Your task is to analyze the provided image of a meal and return a detailed, estimated nutritional breakdown.

Photo: {{media url=photoDataUri}}

CRITICAL RULES FOR YOUR RESPONSE:
1.  **JSON Only**: Your entire response MUST be a single, valid JSON object that conforms to the schema. Do not include any text, explanations, or markdown formatting like \`\`\`json.
2.  **Identify Food**: You MUST identify food items in the image. If the image contains something that is plausibly food (e.g., pizza, an apple, a salad), you MUST identify it.
3.  **NO ZERO CALORIES FOR FOOD**: If you identify a food item, the "estimatedCalories" field MUST be a number greater than 0. There are no exceptions for items that are clearly food. For example, a "pizza" cannot have 0 calories.
4.  **Exception for Zero-Calorie Items**: It is only acceptable to return 0 calories if the item is genuinely zero-calorie, such as 'water' or 'black coffee'. In these cases, you must still identify the item in the "foodItems" array.
5.  **Handle Non-Food**: Only return an empty "foodItems" array and 0 calories if the image unambiguously contains NO food (e.g., a picture of a car or a rock).
6.  **Nutrient Omission**: If a specific nutrient cannot be estimated, omit its key from the JSON. Do not use a value of 0 unless it is truly zero (like sugar in water).`,
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
        // Exception for water
        const isWater = output.foodItems.some(item => item.name.toLowerCase().includes('water'));
        if (!isWater) {
            throw new Error('Analysis failed: AI returned zero or no calories for an identified food item.');
        }
    }
    return output;
  }
);
