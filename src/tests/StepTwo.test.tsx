import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import StepTwo from '../components/StepTwo';
import * as apiService from '../services/api';

// Mock the API to return a list of ingredients
const mockGetIngredients = vi.spyOn(apiService.api, 'getIngredients');

describe('StepTwo - Dynamic Search', () => {
    it.skip("filters ingredients in real-time as the user types", async () => {
        // Arrange
        const ingredients = [
            { id: '1', name: 'Chicken', description: 'Chicken description' },
            { id: '2', name: 'Beef', description: 'Beef description' },
            { id: '3', name: 'Chocolate', description: 'Chocolate description' },
            { id: '4', name: 'Cheese', description: 'Cheese description' }
        ];
        mockGetIngredients.mockResolvedValue(ingredients);

        const user = userEvent.setup();

        // Wrapper to manage local state during test
        const TestWrapper = () => {
            const [selected, setSelected] = useState("");
            return (
                <StepTwo
                    selectedIngredient={selected}
                    onSelect={setSelected}
                    onBack={vi.fn()}
                    onNext={vi.fn()}
                />
            );
        };

        render(<TestWrapper />);

        // Act
        // Wait for loading to finish
        const input = screen.getByPlaceholderText(/search ingredient/i);
        await waitFor(() => expect(input).not.toHaveValue('Loading...'));

        // Type "Cho"
        await user.type(input, 'Cho');

        // Assert
        await waitFor(() => expect(screen.getByText('Chocolate')).toBeInTheDocument());
        expect(screen.queryByText('Beef')).not.toBeInTheDocument();
        expect(screen.queryByText('Chicken')).not.toBeInTheDocument();

        // Act - Select "Chocolate"
        fireEvent.click(screen.getByText('Chocolate'));

        // Assert - Selection message should appear
        const message = screen.getByText(/You selected:/i);
        expect(message).toBeInTheDocument();
        expect(message).toHaveTextContent(/Chocolate/i);
    });
});