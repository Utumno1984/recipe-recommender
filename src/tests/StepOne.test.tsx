import { fireEvent, screen, waitFor } from '@storybook/test';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import StepOne from '../components/StepOne';
import * as apiService from '../services/api'; // Import our service

// Mock the API
const mockGetAreas = vi.spyOn(apiService.api, 'getAreas');

describe('StepOne Component', () => {

    it('shows areas and allows selection', async () => {
        // Arrange
        mockGetAreas.mockResolvedValue(['Italian', 'Mexican']);

        const mockOnSelect = vi.fn(); // A fake function to see if it gets called
        const mockOnNext = vi.fn();

        // Act
        render(
            <StepOne
                selectedArea=""
                onSelect={mockOnSelect}
                onNext={mockOnNext}
            />
        );

        // Assert
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Italian')).toBeInTheDocument();
            expect(screen.getByText('Mexican')).toBeInTheDocument();
        });


        const buttonItalian = screen.getByText('Italian');
        fireEvent.click(buttonItalian);


        expect(mockOnSelect).toHaveBeenCalledWith('Italian');
    });
});