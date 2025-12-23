import { useState } from "react";
import Results from "../components/Results";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";

const SearchPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        area: '',
        ingredient: '',
        ingredientDescription: ''
    });

    // Functions to update state
    const updateArea = (area: string) => {
        setFormData(prev => ({ ...prev, area }));
    };

    const updateIngredient = (ingredient: string, description?: string) => {
        setFormData(prev => ({
            ...prev,
            ingredient,
            ingredientDescription: description || ''
        }));
    };

    return (
        <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center">
            <div className="flex flex-col max-w-xl max-h-[calc(100%-1rem)] h-full w-full bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">
                        Recipe <span className="text-orange-500">Lab.</span>
                    </h1>
                    <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-orange-500' : 'bg-slate-100'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className='flex flex-1 flex-col relative min-h-0 transition-all duration-300 ease-in-out'>
                    {step === 1 && (
                        <StepOne
                            selectedArea={formData.area}
                            onSelect={updateArea}
                            onNext={() => setStep(2)}
                        />
                    )}

                    {step === 2 && (
                        <StepTwo
                            selectedIngredient={formData.ingredient}
                            onSelect={updateIngredient}
                            onBack={() => setStep(1)}
                            onNext={() => setStep(3)} // We will go to the results page
                        />
                    )}

                    {step === 3 && (
                        <Results
                            area={formData.area}
                            ingredient={formData.ingredient}
                            ingredientDescription={formData.ingredientDescription}
                            onRestart={() => setStep(1)}
                            onBack={() => setStep(2)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;