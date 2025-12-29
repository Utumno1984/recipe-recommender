import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../services/api';

describe('API Service', () => {
    // Mock global fetch
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('filterRecipes intersects results when both area and ingredient are provided', async () => {
        // Mock responses
        const areaRecipes = {
            meals: [
                { idMeal: '1', strMeal: 'Pizza' },
                { idMeal: '2', strMeal: 'Pasta' },
                { idMeal: '3', strMeal: 'Risotto' }
            ]
        };

        const ingredientRecipes = {
            meals: [
                { idMeal: '2', strMeal: 'Pasta' },
                { idMeal: '3', strMeal: 'Risotto' },
                { idMeal: '4', strMeal: 'Lasagna' }
            ]
        };

        mockFetch
            .mockResolvedValueOnce({
                json: () => Promise.resolve(areaRecipes)
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve(ingredientRecipes)
            });

        // Act
        const result = await api.filterRecipes({ area: 'Italian', ingredient: 'Tomato' });

        // Assert
        // Should only contain ID 2 and 3 (Intersection)
        expect(result).toHaveLength(2);
        expect(result.map(r => r.idMeal)).toEqual(expect.arrayContaining(['2', '3']));

        // Verify both URLs were called
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('a=Italian'));
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('i=Tomato'));
    });

    it('filterRecipes falls back to single call if only one parameter is provided', async () => {
        const mockResponse = { meals: [{ idMeal: '1', strMeal: 'Pizza' }] };

        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockResponse)
        });

        await api.filterRecipes({ area: 'Italian' });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('filter.php?a=Italian'));
    });
});
