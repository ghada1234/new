import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'يجب أن يتكون الاسم من حرفين على الأقل.'),
  email: z.string().email(),
  password: z.string().min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'),
});

export type RegisterData = z.infer<typeof registerSchema>;

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
