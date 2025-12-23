import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Ingredient } from '../types/api-responses';

interface StepTwoProps {
    selectedIngredient: string;
    onSelect: (ingredient: string, description?: string) => void;
    onBack: () => void;
    onNext: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ selectedIngredient, onSelect, onBack, onNext }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSearchTerm(selectedIngredient);
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


    const filteredIngredients = useMemo(() => {
        if (!searchTerm) return ingredients.slice(0, 10);
        return ingredients
            .filter(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 10);
    }, [searchTerm, ingredients]);

    return (
        <div className="flex h-full flex-col gap-6">
            <header>
                <h2 className="text-2xl font-bold">Step 2: Main Ingredient</h2>
                <p className="text-gray-600">Type and select an ingredient you have available.</p>
            </header>

            <div className="flex flex-1 relative p-2">
                <div className='w-full'>
                    <input
                        onFocus={() => setOpen(true)}
                        onBlur={() => setOpen(false)}
                        type="text"
                        placeholder="Search ingredient (e.g. Chicken, Tomato...)"
                        value={loading ? 'Loading...' : (searchTerm)}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setOpen(true);
                        }}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                    />


                    {open && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-2xl max-h-60 overflow-y-auto">
                            {filteredIngredients.map(ing => (
                                <li
                                    key={ing.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        onSelect(ing.name, ing.description || undefined);
                                        setSearchTerm(ing.name);
                                        setOpen(false);
                                    }}
                                    className="p-4 hover:bg-orange-50 cursor-pointer border-b last:border-0"
                                >
                                    {ing.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {(selectedIngredient && (searchTerm === selectedIngredient)) && (
                <div className="bg-orange-100 p-3 rounded-lg text-orange-800">
                    You selected: <strong>{selectedIngredient}</strong>
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
        </div>
    );
};

export default StepTwo;