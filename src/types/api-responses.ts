// src/types/api-responses.ts


export interface ApiAreaResponse {
  meals: {
    strArea: string;
  }[];
}

export interface ApiIngredientResponse {
  meals: {
    idIngredient: string;
    strIngredient: string;
    strDescription: string | null;
    strType: string | null;
  }[];
}

export interface Ingredient {
  id: string;
  name: string;
  description: string | null;
}

export interface SimpleRecipe {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

export interface RecipeDetails extends SimpleRecipe {
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
}