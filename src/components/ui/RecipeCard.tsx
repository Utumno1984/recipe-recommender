import { ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';
import type { RecipeDetails, SimpleRecipe } from '../../types/api-responses';
import ImageWithLoader from './ImageWithLoader';

interface RecipeCardProps {
    recipe: SimpleRecipe | RecipeDetails;
    isVoted: boolean;
    onVote: (liked: boolean) => void;
    isLoadingDetails: boolean;
    areaFallback?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    isVoted,
    onVote,
    isLoadingDetails,
    areaFallback
}) => {
    return (
        <div key={recipe.idMeal} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500 h-auto md:h-full md:max-h-[450px] shrink-0">

            <div className="relative w-full h-48 sm:h-64 md:h-full md:w-1/2 bg-gray-100 flex items-center justify-center group overflow-hidden shrink-0">
                <ImageWithLoader
                    src={recipe.strMealThumb} // High quality
                    previewSrc={`${recipe.strMealThumb}/preview`} // Low quality preview
                    alt={recipe.strMeal}
                    containerClassName="w-full h-full"
                    imageClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Category Badge with reserved space/animation */}
                <div className={`absolute top-4 right-4 transition-opacity duration-500 ${isLoadingDetails || !(recipe as RecipeDetails).strCategory ? 'opacity-0' : 'opacity-100'}`}>
                    {(recipe as RecipeDetails).strCategory && (
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm">
                            {(recipe as RecipeDetails).strCategory}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 md:w-1/2 justify-center">
                {/* Title & Area Container - Fixed height to prevent jumps */}
                <div className="mb-4">
                    <div className="h-16 flex items-center justify-center mb-1">
                        <h3 className="font-bold text-2xl line-clamp-2 leading-tight px-2">{recipe.strMeal}</h3>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Area: {(recipe as RecipeDetails).strArea || areaFallback}
                    </p>
                </div>

                <div className="h-6 mb-6"> {/* Fixed space for link */}
                    <div className={`transition-opacity duration-500 ${isLoadingDetails ? 'opacity-0' : 'opacity-100'}`}>
                        {(recipe as RecipeDetails).strSource && (
                            <a href={(recipe as RecipeDetails).strSource || '#'} target="_blank" rel="noopener noreferrer" className="inline-block text-orange-500 font-semibold hover:underline text-sm">
                                View Full Recipe ↗
                            </a>
                        )}
                    </div>
                </div>

                <div className="mt-auto"> {/* Push buttons to bottom */}
                    {!isVoted ? (
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="font-medium mb-3 text-slate-600">Is this what you were looking for?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => onVote(false)}
                                    className="px-6 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
                                >
                                    No <ThumbsDown className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onVote(true)}
                                    className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-bold shadow-lg shadow-green-200 transition-all flex items-center gap-2"
                                >
                                    Yes, perfect! <ThumbsUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl font-medium animate-pulse">
                            Thanks for the feedback! Saved to history.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
