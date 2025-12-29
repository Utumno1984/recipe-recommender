import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Ingredient } from '../types/api-responses';
import ImageWithLoader from './ui/ImageWithLoader';
import VirtualCombobox from './ui/VirtualCombobox';

interface StepTwoProps {
    selectedIngredient: string;
    onSelect: (ingredient: string, description?: string) => void;
    onBack: () => void;
    onNext: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ selectedIngredient, onSelect, onBack, onNext }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getIngredients();
                setIngredients(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const selectedIngredientObj = useMemo(() =>
        ingredients.find(i => i.name === selectedIngredient),
        [ingredients, selectedIngredient]);

    return (
        <div className="flex h-full flex-col gap-6">
            <header>
                <h2 className="text-2xl font-bold">Step 2: Main Ingredient</h2>
                <p className="text-gray-600">Type and select an ingredient you have available.</p>
            </header>

            <div className="flex flex-1 relative p-2">
                <VirtualCombobox
                    items={ingredients}
                    selectedItem={selectedIngredient}
                    onSelect={onSelect}
                    loading={loading}
                    placeholder="Search ingredient (e.g. Chicken, Tomato...)"
                />
            </div>

            {selectedIngredient && selectedIngredientObj && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg p-2 shadow-sm">
                        <ImageWithLoader
                            src={`https://www.themealdb.com/images/ingredients/${selectedIngredient.replace(/ /g, '_')}.png`}
                            alt={selectedIngredient}
                            containerClassName="w-full h-full"
                            imageClassName="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-orange-900 mb-1">
                            {selectedIngredient}
                        </h3>
                        {selectedIngredientObj.description ? (
                            <p className="text-sm text-gray-600 leading-relaxed max-h-32 overflow-y-auto pr-2">
                                {selectedIngredientObj.description}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No description available.</p>
                        )}
                    </div>
                </div>
            )}

            <footer className="mt-8 flex justify-between">
                <button onClick={onBack} className="text-gray-500 font-medium">Back</button>
                <button
                    onClick={onNext}
                    disabled={!selectedIngredient}
                    className={`px-8 py-3 rounded-full font-semibold text-white ${selectedIngredient ? 'bg-orange-600' : 'bg-gray-300'
                        }`}
                >
                    Find Recipe
                </button>
            </footer>
        </div >
    );
};

export default StepTwo;