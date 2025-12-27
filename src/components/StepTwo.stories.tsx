import type { Meta, StoryObj } from '@storybook/react';
import StepTwo from './StepTwo';

const meta = {
    title: 'Components/StepTwo',
    component: StepTwo,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ height: '600px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StepTwo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        selectedIngredient: '',
        onSelect: (ing) => console.log('Selected:', ing),
        onBack: () => console.log('Back'),
        onNext: () => console.log('Next'),
    },
};

export const WithSelection: Story = {
    args: {
        selectedIngredient: 'Chicken',
        onSelect: (ing) => console.log('Selected:', ing),
        onBack: () => console.log('Back'),
        onNext: () => console.log('Next'),
    },
};
