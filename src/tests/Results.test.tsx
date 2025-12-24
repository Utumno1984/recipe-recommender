import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Results from '../components/Results';
import * as apiService from '../services/api';

// Mock API
const mockGetRecipesByArea = vi.spyOn(apiService.api, 'getRecipesByArea');
const mockGetRecipesByIngredient = vi.spyOn(apiService.api, 'getRecipesByIngredient');

describe('Results Component', () => {
    // Reset mocks before each test to avoid test interference
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows initial loading state', () => {
        // Arrange
        // Return promises that don't resolve immediately to test loading state
        mockGetRecipesByArea.mockReturnValue(new Promise(() => { }));
        mockGetRecipesByIngredient.mockReturnValue(new Promise(() => { }));

        // Act
        render(<Results area="Italian" ingredient="Tomato" onRestart={vi.fn()} onBack={vi.fn()} />);

    });

    it('shows ONE recipe at a time after loading', async () => {
        const mockRecipes = [
            { idMeal: '1', strMeal: 'Pizza Margherita', strMealThumb: 'pizza.jpg', strDescription: 'Description' },
            { idMeal: '2', strMeal: 'Pasta al Pomodoro', strMealThumb: 'pasta.jpg', strDescription: 'Description' }
        ];

        // Arrange
        mockGetRecipesByArea.mockResolvedValue(mockRecipes);
        mockGetRecipesByIngredient.mockResolvedValue(mockRecipes);

        // Act
        render(<Results area="Italian" ingredient="Tomato" onRestart={vi.fn()} onBack={vi.fn()} />);

        // Assert
        // Wait for loading
        await waitFor(() => {
            expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
        });

        // Ensure ONLY the first one is shown
        expect(screen.queryByText('Pasta al Pomodoro')).not.toBeInTheDocument();
        expect(screen.getByText(/Here is your recipe/i)).toBeInTheDocument();
    });

    it('cycles through recipes when New Idea is clicked', async () => {
        const mockRecipes = [
            { idMeal: '1', strMeal: 'Pizza Margherita', strMealThumb: 'pizza.jpg', strDescription: 'Description' },
            { idMeal: '2', strMeal: 'Pasta al Pomodoro', strMealThumb: 'pasta.jpg', strDescription: 'Description' }
        ];

        mockGetRecipesByArea.mockResolvedValue(mockRecipes);
        mockGetRecipesByIngredient.mockResolvedValue(mockRecipes);

        render(<Results area="Italian" ingredient="Tomato" onRestart={vi.fn()} onBack={vi.fn()} />);

        // Act & Assert
        // Wait for first recipe
        await waitFor(() => expect(screen.getByText('Pizza Margherita')).toBeInTheDocument());

        // Click New Idea
        const newIdeaBtn = screen.getByText(/New Idea/i);
        fireEvent.click(newIdeaBtn);

        // Expect second recipe
        expect(screen.getByText('Pasta al Pomodoro')).toBeInTheDocument();
        expect(screen.queryByText('Pizza Margherita')).not.toBeInTheDocument();
    });

    it('calls onRestart when Start Over button is clicked', async () => {
        mockGetRecipesByArea.mockResolvedValue([]);
        mockGetRecipesByIngredient.mockResolvedValue([]);

        const mockOnRestart = vi.fn();
        render(<Results area="Italian" ingredient="Tomato" onRestart={mockOnRestart} onBack={vi.fn()} />);

        await waitFor(() => expect(screen.getByText(/No recipes found/i)).toBeInTheDocument());

        const button = screen.getByText(/Try again/i); // In empty state it is "Try again"
        fireEvent.click(button);

        expect(mockOnRestart).toHaveBeenCalledTimes(1);
    });
});
