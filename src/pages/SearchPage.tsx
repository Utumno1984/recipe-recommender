import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Results from "../components/Results";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";

const DEFAULT_PARAMS = {
    step: '1',
    area: '',
    ingredient: ''
};

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived State - Single Source of Truth (The URL)
    const step = parseInt(searchParams.get('step') || '1');
    const area = searchParams.get('area') || '';
    const ingredient = searchParams.get('ingredient') || '';

    // Helper to update search params while preserving existing ones
    const updateParams = (updates: Record<string, string>) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                newParams.set(key, value);
            });
            return newParams;
        });
    };

    useEffect(() => {
        const currentStep = searchParams.get('step');

        // Only run this effect to set defaults if the URL is completely empty or invalid
        // logic: if 'step' is missing, likely everything is missing or initial load
        if (!currentStep) {
            const newParams = new URLSearchParams(searchParams);
            if (!newParams.has('step')) newParams.set('step', DEFAULT_PARAMS.step);
            if (!newParams.has('area')) newParams.set('area', DEFAULT_PARAMS.area);
            if (!newParams.has('ingredient')) newParams.set('ingredient', DEFAULT_PARAMS.ingredient);

            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const setStepHandler = (newStep: number) => {
        updateParams({ step: String(newStep) });
    };

    const updateArea = (newArea: string) => {
        updateParams({ area: newArea });
    };

    const updateIngredient = (newIngredient: string) => {
        updateParams({ ingredient: newIngredient });
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
                            selectedArea={area}
                            onSelect={updateArea}
                            onNext={() => setStepHandler(2)}
                        />
                    )}

                    {step === 2 && (
                        <StepTwo
                            selectedIngredient={ingredient}
                            onSelect={updateIngredient}
                            onBack={() => setStepHandler(1)}
                            onNext={() => setStepHandler(3)} // We will go to the results page
                        />
                    )}

                    {step === 3 && (
                        <Results
                            area={area}
                            ingredient={ingredient}
                            onRestart={() => setStepHandler(1)}
                            onBack={() => setStepHandler(2)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;