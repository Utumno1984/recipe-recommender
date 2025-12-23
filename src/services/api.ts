import type { ApiAreaResponse, ApiIngredientResponse, Ingredient, SimpleRecipe } from "../types/api-responses";

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const api = {
  /**
   * Fetches the list of culinary areas (cuisines).
   * @returns An array of area names (e.g. "Italian", "Mexican").
   */
  getAreas: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/list.php?a=list`);
    const data: ApiAreaResponse = await response.json();
    // Transform the array of objects [{strArea: "Italian"}] into an array of strings ["Italian"]
    return data.meals.map((meal) => meal.strArea);
  },

  /**
   * Fetches the list of ingredients.
   * @returns An array of Ingredient objects.
   */
  getIngredients: async (): Promise<Ingredient[]> => {
    const response = await fetch(`${BASE_URL}/list.php?i=list`);
    const data: ApiIngredientResponse = await response.json();
    return data.meals.map((meal) => ({
      id: meal.idIngredient,
      name: meal.strIngredient,
      description: meal.strDescription
    }));
  },

  /**
   * Fetches recipes filtered by a specific area.
   * @param area - The area name (e.g. "Italian")
   * @returns An array of SimpleRecipe objects
   */
  getRecipesByArea: async (area: string): Promise<SimpleRecipe[]> => {
    const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals || [];
  },

  /**
   * Fetches recipes filtered by a main ingredient.
   * @param ing - The ingredient name
   * @returns An array of SimpleRecipe objects
   */
  getRecipesByIngredient: async (ing: string): Promise<SimpleRecipe[]> => {
    const response = await fetch(`${BASE_URL}/filter.php?i=${ing}`);
    const data = await response.json();
    return data.meals || [];
  }
};