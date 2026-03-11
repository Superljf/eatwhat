// 餐点类型
export type MealType = 'lunch' | 'dinner';

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  createdAt: number;
}
