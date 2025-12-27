import type { ApiAreaResponse, ApiIngredientResponse, Ingredient, RecipeDetails, SimpleRecipe } from "../types/api-responses";

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Generic helper to handle fetching with local storage caching.
 * @param key The localStorage key to used for caching.
 * @param fetcher The function that performs the network request.
 * @returns The data from network (if success) or from cache (if offline).
 */
async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  try {
    const data = await fetcher();
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn(`[API] Network request failed for ${key}, trying cache...`, error);
    const cached = localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
}

export const api = {
  /**
   * Fetches the list of culinary areas (cuisines).
   * @returns An array of area names (e.g. "Italian", "Mexican").
   */
  getAreas: async (): Promise<string[]> => {
    return fetchWithCache('areas', async () => {
      const response = await fetch(`${BASE_URL}/list.php?a=list`);
      const data: ApiAreaResponse = await response.json();
      return data.meals.map((meal) => meal.strArea);
    });
  },

  /**
   * Fetches the list of ingredients.
   * @returns An array of Ingredient objects.
   */
  getIngredients: async (): Promise<Ingredient[]> => {
    return fetchWithCache('ingredients', async () => {
      const response = await fetch(`${BASE_URL}/list.php?i=list`);
      const data: ApiIngredientResponse = await response.json();
      return data.meals.map((meal) => ({
        id: meal.idIngredient,
        name: meal.strIngredient,
        description: meal.strDescription
      }));
    });
  },

  /**
   * Fetches recipes filtered by area and/or ingredient.
   * @param params Object containing optional area and ingredient.
   * @returns An array of SimpleRecipe objects.
   */
  filterRecipes: async (params: { area?: string; ingredient?: string }): Promise<SimpleRecipe[]> => {
    const { area, ingredient } = params;

    // Construct unique cache key based on params
    const cacheKey = `recipes-filter-${area || 'any'}-${ingredient || 'any'}`;

    return fetchWithCache(cacheKey, async () => {
      const urlParams = new URLSearchParams();
      if (area) urlParams.append('a', area);
      if (ingredient) urlParams.append('i', ingredient);

      const response = await fetch(`${BASE_URL}/filter.php?${urlParams.toString()}`);
      const data = await response.json();
      return data.meals || [];
    });
  },

  /**
   * Fetches full details for a specific recipe by ID.
   * @param id The meal ID.
   * @returns The full recipe details or null if not found.
   */
  getRecipeById: async (id: string): Promise<RecipeDetails | null> => {
    return fetchWithCache(`recipe-${id}`, async () => {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    });
  }
};