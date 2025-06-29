import { z } from 'zod';

// This is the most detailed output schema, which can be reused by all estimators.
export const NutritionalInfoSchema = z.object({
  foodItems: z.array(z.object({ name: z.string() })).min(1, { message: "AI must identify at least one food item." }).describe("An array of food items identified in the meal. This cannot be empty."),
  ingredients: z.array(z.string()).optional().describe("An estimated list of ingredients for the dish."),
  estimatedCalories: z.number().describe('The estimated calorie count of the dish. Must be greater than 0 for any food item.'),
  estimatedProtein: z.number().optional().describe('Estimated protein content in grams'),
  estimatedCarbs: z.number().optional().describe('Estimated carbohydrates content in grams'),
  estimatedFat: z.number().optional().describe('Estimated fat content in grams'),
  estimatedSaturatedFat: z.number().optional().describe('Estimated saturated fat content in grams'),
  estimatedFiber: z.number().optional().describe('Estimated fiber content in grams'),
  estimatedSugar: z.number().optional().describe('Estimated sugar content in grams'),
  estimatedSodium: z.number().optional().describe('Estimated sodium content in milligrams'),
  estimatedVitaminA: z.number().optional().describe('Estimated Vitamin A content in micrograms'),
  estimatedVitaminC: z.number().optional().describe('Estimated vitamin C content in milligrams'),
  estimatedVitaminD: z.number().optional().describe('Estimated Vitamin D content in micrograms'),
  estimatedVitaminE: z.number().optional().describe('Estimated Vitamin E content in milligrams'),
  estimatedVitaminK: z.number().optional().describe('Estimated Vitamin K content in micrograms'),
  estimatedVitaminB1: z.number().optional().describe('Estimated Vitamin B1 content in milligrams'),
  estimatedVitaminB2: z.number().optional().describe('Estimated Vitamin B2 content in milligrams'),
  estimatedVitaminB3: z.number().optional().describe('Estimated Vitamin B3 content in milligrams'),
  estimatedVitaminB5: z.number().optional().describe('Estimated Vitamin B5 content in milligrams'),
  estimatedVitaminB6: z.number().optional().describe('Estimated Vitamin B6 content in milligrams'),
  estimatedVitaminB7: z.number().optional().describe('Estimated Vitamin B7 content in micrograms'),
  estimatedVitaminB9: z.number().optional().describe('Estimated Vitamin B9 content in micrograms'),
  estimatedVitaminB12: z.number().optional().describe('Estimated Vitamin B12 content in micrograms'),
  estimatedCalcium: z.number().optional().describe('Estimated Calcium content in milligrams'),
  estimatedIron: z.number().optional().describe('Estimated iron content in milligrams'),
  estimatedMagnesium: z.number().optional().describe('Estimated Magnesium content in milligrams'),
  estimatedZinc: z.number().optional().describe('Estimated Zinc content in milligrams'),
  confidence: z.number().optional().describe('The confidence level of the AI in its estimation.'),
  explanation: z.string().describe('The explanation of how the AI arrived at its estimation. This field is required.'),
});

export type AnalyzeFoodImageOutput = z.infer<typeof NutritionalInfoSchema>;
export type AnalyzeDishNameOutput = z.infer<typeof NutritionalInfoSchema>;
