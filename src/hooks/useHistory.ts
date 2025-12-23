// src/hooks/useHistory.ts
import { useEffect, useState } from 'react';
import type { SimpleRecipe } from '../types/api-responses';
import type { HistoryItem } from '../types/recipe';


export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('recipe-history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // The function now accepts TWO things: the recipe and the vote (true/false)
    const saveInteraction = (recipe: SimpleRecipe, liked: boolean, criteria: { area: string, ingredient: string }) => {
        setHistory((prev) => {
            // Create the new object
            const newItem: HistoryItem = {
                ...recipe,
                savedAt: Date.now(),
                liked,
                criteria
            };

            // Add to top and keep the last 20
            const newHistory = [newItem, ...prev].slice(0, 20);

            localStorage.setItem('recipe-history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const clearHistory = () => {
        localStorage.removeItem('recipe-history');
        setHistory([]);
    };

    return { history, saveInteraction, clearHistory };
};