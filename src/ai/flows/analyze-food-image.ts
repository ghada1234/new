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

**ABSOLUTE, CRITICAL, UNBREAKABLE RULES FOR YOUR RESPONSE:**
1.  **JSON ONLY**: Your entire response MUST be a single, valid JSON object that conforms to the schema. Do not include any text, explanations, or markdown formatting like \`\`\`json.
2.  **IDENTIFY FOOD**: You MUST make your best effort to identify food items in the image. If the image contains something that is plausibly food (e.g., pizza, an apple, a salad), you MUST identify it in the "foodItems" array.
3.  **NO ZERO CALORIES FOR REAL FOOD**: This is the most important rule. If you identify one or more food items in the "foodItems" array, the "estimatedCalories" field MUST be a number greater than 0. A dish like 'pizza' or 'salad' cannot have 0 calories. There are no exceptions to this rule, other than plain 'water'.
4.  **IF UNSURE, STILL GUESS**: If you are not 100% sure what the food is, make an educated guess based on visual evidence. It is better to provide a reasonable estimate than to return 0 calories for something that is clearly food.
5.  **NON-FOOD IMAGES**: Only if the image unambiguously contains NO food items (e.g., a picture of a car or a rock), should you return a JSON object with an empty "foodItems" array and an "estimatedCalories" of 0.
6.  **NUTRIENT OMISSION**: If a specific nutrient cannot be estimated, omit its key from the JSON. Do not use a value of 0 unless it is truly zero (like sugar in water).`,
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
