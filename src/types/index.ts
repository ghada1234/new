
import { z } from 'zod';

// We use a function to generate the schema so we can pass the translation function `t`
export const getRegisterSchema = (t: (key: 'nameMin2Chars' | 'passwordMin6Chars') => string) => z.object({
  name: z.string().min(2, t('nameMin2Chars')),
  email: z.string().email(),
  password: z.string().min(6, t('passwordMin6Chars')),
});

export type RegisterData = z.infer<ReturnType<typeof getRegisterSchema>>;

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  saturatedFat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminB1?: number;
  vitaminB2?: number;
  vitaminB3?: number;
  vitaminB5?: number;
  vitaminB6?: number;
  vitaminB7?: number;
  vitaminB9?: number;
  vitaminB12?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  zinc?: number;
  createdAt: string; // ISO 8601 date string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}
