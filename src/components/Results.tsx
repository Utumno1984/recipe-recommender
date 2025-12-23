import { Frown, Info, Lightbulb, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { api } from '../services/api';
import type { SimpleRecipe } from '../types/api-responses';
import ImageWithLoader from './ui/ImageWithLoader';


interface ResultsProps {
  area: string;
  ingredient: string;
  ingredientDescription?: string;
  onRestart: () => void;
  onBack: () => void;
}

const Results: React.FC<ResultsProps> = ({ area, ingredient, ingredientDescription, onRestart, onBack }) => {
  const [matches, setMatches] = useState<SimpleRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { saveInteraction } = useHistory();
  const [votedItems, setVotedItems] = useState<Record<string, boolean>>({});
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    setShowDescription(false);
  }, [currentIndex]);

  useEffect(() => {
    const findRecipes = async () => {
      setLoading(true);
      try {
        // The API doesn't support filtering by Area AND Ingredient simultaneously.
        // We fetch both lists and perform an intersection on the client side.
        const [areaRecipes, ingRecipes] = await Promise.all([
          api.getRecipesByArea(area),
          api.getRecipesByIngredient(ingredient)
        ]);


        const intersect = areaRecipes.filter(a =>
          ingRecipes.some(i => i.idMeal === a.idMeal)
        );

        // Prioritize perfect matches (intersect), but include others from the area to offer variety
        const others = areaRecipes.filter(a => !intersect.some(i => i.idMeal === a.idMeal));
        const combined = [...intersect, ...others];

        setMatches(combined.slice(0, 10));
      } finally {
        setLoading(false);
      }
    };
    findRecipes();
  }, [area, ingredient]);

  const handleVote = (recipe: SimpleRecipe, liked: boolean) => {
    saveInteraction(recipe, liked, { area, ingredient });
    setVotedItems(prev => ({ ...prev, [recipe.idMeal]: true }));
    // excludes the voted recipe from the list
    /* setMatches(prev => prev.filter(r => r.idMeal !== recipe.idMeal)); */
  };

  const handleNextIdea = () => {
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  };



  if (loading) return <div className="text-center p-10">We are cooking your results...</div>;

  if (matches.length === 0) {
    return (
      <div className="text-center p-10">
        <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
          No recipes found! <Frown className="w-6 h-6" />
        </h3>
        <button onClick={onRestart} className="bg-black text-white px-6 py-2 rounded-full">
          Try again with different criteria
        </button>
      </div>
    );
  }

  const currentRecipe = matches[currentIndex];
  const isVoted = votedItems[currentRecipe.idMeal];

  return (
    <div className="flex flex-col h-full text-center items-center">
      <h2 className="text-3xl font-bold mb-6">Here is your recipe!</h2>

      <div className="flex-1 w-full max-w-md min-h-0 overflow-y-auto p-2">
        <div key={currentRecipe.idMeal} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl flex flex-col">

          <div className="relative w-full h-48 sm:h-64 bg-gray-100 flex items-center justify-center group overflow-hidden">
            <ImageWithLoader
              src={currentRecipe.strMealThumb}
              alt={currentRecipe.strMeal}
              containerClassName="w-full h-full"
            />

            {/* Info Icon for Description */}
            {ingredientDescription && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowDescription(!showDescription); }}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full backdrop-blur-sm shadow-md hover:bg-white transition-all z-10"
                title="Ingredient Info"
              >
                <Info className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* Description Overlay */}
            {showDescription && ingredientDescription && (
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm p-6 text-white text-left overflow-y-auto z-20 transition-all animate-in fade-in cursor-pointer"
                onClick={() => setShowDescription(false)}
              >
                <h4 className="font-bold text-lg mb-2 text-orange-400">{ingredient}</h4>
                <p className="text-sm leading-relaxed text-gray-200">{ingredientDescription}</p>
                <p className="text-xs text-gray-400 mt-4 italic">Tap to close</p>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="font-bold text-2xl mb-2">{currentRecipe.strMeal}</h3>
            <p className="text-gray-500 mb-6">Area: {area}</p>


            {!isVoted ? (
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="font-medium mb-3 text-slate-600">Is this what you were looking for?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleVote(currentRecipe, false)}
                    className="px-6 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
                  >
                    No <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleVote(currentRecipe, true)}
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

      <div className="mt-8 flex gap-4">
        <button onClick={onBack} className="text-gray-500 font-medium">Back</button>
        <button onClick={onRestart} className="text-gray-500 font-medium hover:text-black transition-colors px-4 py-2">
          Start Over
        </button>
        {matches.length > 1 && (
          <button onClick={handleNextIdea} className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition-transform transform active:scale-95 flex items-center gap-2">
            New Idea <Lightbulb className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Results;