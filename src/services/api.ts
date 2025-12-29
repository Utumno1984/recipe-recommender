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

    // Use intersection logic if both filters are present
    if (area && ingredient) {
      const cacheKey = `recipes-intersection-${area}-${ingredient}`;

      return fetchWithCache(cacheKey, async () => {
        // Fetch both lists in parallel
        const [areaResponse, ingredientResponse] = await Promise.all([
          fetch(`${BASE_URL}/filter.php?a=${area}`).then(r => r.json()),
          fetch(`${BASE_URL}/filter.php?i=${ingredient}`).then(r => r.json())
        ]);

        const areaRecipes: SimpleRecipe[] = areaResponse.meals || [];
        const ingredientRecipes: SimpleRecipe[] = ingredientResponse.meals || [];

        // Create a Set of IDs from the smaller list for efficiency
        // (Optimization: intersection is faster if we iterate the smaller list against the Set of the larger, 
        // but here we just use Set for O(1) lookups)
        const ingredientIds = new Set(ingredientRecipes.map(r => r.idMeal));

        // Filter area recipes to keep only those present in ingredient list
        const intersection = areaRecipes.filter(recipe => ingredientIds.has(recipe.idMeal));

        return intersection;
      });
    }

    // Existing single-filter logic fallback
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