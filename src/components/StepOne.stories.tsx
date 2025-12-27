import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import StepOne from './StepOne';

const meta = {
    title: 'Components/StepOne',
    component: StepOne,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ height: '600px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StepOne>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        selectedArea: '',
        onSelect: (area) => alert(`Selected Area: ${area}`),
        onNext: () => alert('Next clicked'),
    },
};

export const WithSelection: Story = {
    args: {
        selectedArea: 'Italian',
        onSelect: (area) => console.log(`Changed Area: ${area}`),
        onNext: () => console.log('Next clicked'),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Simulate user interaction: Click next
        // Note: In a real test we might select an area first if it wasn't pre-selected
        // Here we assume 'Italian' is selected via args, so Next should be enabled.
        const nextButton = canvas.getByRole('button', { name: /Next/i });

        await expect(nextButton).toBeEnabled();

        await userEvent.click(nextButton);
    }
};
