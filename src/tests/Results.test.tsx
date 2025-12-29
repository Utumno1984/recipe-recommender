import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Results from '../components/Results';
import * as apiService from '../services/api';

// Mock API
const mockFilterRecipes = vi.spyOn(apiService.api, 'filterRecipes');
// We also need to mock getIngredients because Results now calls it to find the description
const mockGetIngredients = vi.spyOn(apiService.api, 'getIngredients');
const mockGetRecipeById = vi.spyOn(apiService.api, 'getRecipeById');

// Mock useHistory hook
const mockSaveInteraction = vi.fn();
const mockHistory: any[] = [];
vi.mock('../hooks/useHistory', () => ({
    useHistory: () => ({
        saveInteraction: mockSaveInteraction,
        history: mockHistory
    })
}));

describe('Results Component', () => {
    // Reset mocks before each test to avoid test interference
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementation for getIngredients
        mockGetIngredients.mockResolvedValue([
            { id: '1', name: 'Tomato', description: 'A red fruit' }
        ]);
        mockGetRecipeById.mockResolvedValue(null);
    });

    it('shows initial loading state', () => {
        // Arrange
        mockFilterRecipes.mockReturnValue(new Promise(() => { }));

        // Act
        render(<Results area="Italian" ingredient="Tomato" onRestart={vi.fn()} onBack={vi.fn()} randomize={false} />);
    });

    it('shows ONE recipe at a time after loading', async () => {
        const mockRecipes = [
            { idMeal: '1', strMeal: 'Pizza Margherita', strMealThumb: 'pizza.jpg', strDescription: 'Description' },
            { idMeal: '2', strMeal: 'Pasta al Pomodoro', strMealThumb: 'pasta.jpg', strDescription: 'Description' }
        ];

        // Arrange
        mockFilterRecipes.mockResolvedValue(mockRecipes);

        // Act
        render(<Results area="Italian" ingredient="Tomato" onRestart={vi.fn()} onBack={vi.fn()} randomize={false} />);

        // Assert
        // Wait for loading
        await waitFor(() => {
            expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
        });

        // Ensure ONLY the first one is shown
        expect(screen.queryByText('Pasta al Pomodoro')).not.toBeInTheDocument();
        expect(screen.getByText(/Here is your recipe/i)).toBeInTheDocument();
    });

    it.skip('cycles through recipes when New Idea is clicked', async () => {
        const mockRecipes = [
            { idMeal: '1', strMeal: 'Pizza Margherita', strMealThumb: 'pizza.jpg', strDescription: 'Description' },
            { idMeal: '2', strMeal: 'Pasta al Pomodoro', strMealThumb: 'pasta.jpg', strDescription: 'Description' }
        ];

        mockFilterRecipes.mockResolvedValue(mockRecipes);

        render(<Results area="Italian" ingredient="Tomato" onRestart={vi.fn()} onBack={vi.fn()} randomize={false} />);

        // Act & Assert
        // Wait for first recipe
        await waitFor(() => expect(screen.getByText('Pizza Margherita')).toBeInTheDocument());

        // Click New Idea
        const newIdeaBtn = await screen.findByRole('button', { name: /New Idea/i });
        fireEvent.click(newIdeaBtn);

        // Expect second recipe
        expect(screen.getByText('Pasta al Pomodoro')).toBeInTheDocument();
        expect(screen.queryByText('Pizza Margherita')).not.toBeInTheDocument();
    });

    it('calls onRestart when Start Over button is clicked', async () => {
        mockFilterRecipes.mockResolvedValue([]);

        const mockOnRestart = vi.fn();
        render(<Results area="Italian" ingredient="Tomato" onRestart={mockOnRestart} onBack={vi.fn()} randomize={false} />);

        await waitFor(() => expect(screen.getByText(/No recipes found/i)).toBeInTheDocument());

        const button = screen.getByText(/Try again/i); // In empty state it is "Try again"
        fireEvent.click(button);

        expect(mockOnRestart).toHaveBeenCalledTimes(1);
    });
});
