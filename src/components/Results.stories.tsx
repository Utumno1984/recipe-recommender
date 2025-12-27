import type { Meta, StoryObj } from '@storybook/react';
import Results from './Results';

const meta = {
    title: 'Components/Results',
    component: Results,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        area: { control: 'text' },
        ingredient: { control: 'text' },
        randomize: { control: 'boolean' },
    },
} satisfies Meta<typeof Results>;

export default meta;
type Story = StoryObj<typeof meta>;

// This story will actually fetch data from TheMealDB!
export const ItalianWithBasil: Story = {
    args: {
        area: "Algerian",
        ingredient: "Mascarpone",
        randomize: true, // deterministic for visual test
        onRestart: () => alert('onRestart triggered'),
        onBack: () => alert('onBack triggered'),
    },
};

// This one should show the "No recipes found" state
export const NoResultsFound: Story = {
    args: {
        area: 'Antarctica',
        ingredient: 'Ice',
        onRestart: () => console.log('Try Again'),
        onBack: () => console.log('Back'),
    },
};
