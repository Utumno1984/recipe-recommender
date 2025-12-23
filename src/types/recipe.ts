import type { SimpleRecipe } from "./api-responses";

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
}

export interface UserPreferences {
  area: string;
  category: string;
  ingredient: string;
}

export interface HistoryItem extends SimpleRecipe {
  savedAt: number;     // Quando è successo
  liked: boolean;      // True = Mi piace, False = Non mi piace
  // Opzionale: se vuoi salvare anche i criteri usati come chiede il requisito
  criteria?: {
    area: string;
    ingredient: string;
  };
}