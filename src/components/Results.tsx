import { Frown, Lightbulb, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { api } from '../services/api';
import type { RecipeDetails, SimpleRecipe } from '../types/api-responses';
import ImageWithLoader from './ui/ImageWithLoader';


interface ResultsProps {
  area: string;
  ingredient: string;
  onRestart: () => void;
  onBack: () => void;
  randomize?: boolean;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Results: React.FC<ResultsProps> = ({ area, ingredient, onRestart, onBack, randomize = true }) => {
  const [matches, setMatches] = useState<SimpleRecipe[]>([]);
  const [fullRecipe, setFullRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { saveInteraction, history } = useHistory();

  useEffect(() => {
    let ignore = false;
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        // Fetch using the new combined endpoint
        const recipes = await api.filterRecipes({ area, ingredient });
        // Randomize the order of recipes if requested
        if (!ignore) {
          setMatches(randomize ? shuffleArray(recipes) : recipes);
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (area || ingredient) {
      fetchRecipes();
    } else {
      setMatches([]);
    }

    return () => {
      ignore = true;
    };
  }, [area, ingredient, randomize]);

  // Fetch full details when current index changes
  useEffect(() => {
    let ignore = false;
    const fetchDetails = async () => {
      if (matches.length > 0) {
        setDetailsLoading(true);
        try {
          const details = await api.getRecipeById(matches[currentIndex].idMeal);
          if (!ignore) setFullRecipe(details);
        } catch (error) {
          console.error("Failed to fetch recipe details:", error);
        } finally {
          if (!ignore) setDetailsLoading(false);
        }
      }
    };
    fetchDetails();
    return () => { ignore = true; };
  }, [currentIndex, matches]);

  const handleVote = (recipe: SimpleRecipe | RecipeDetails, liked: boolean) => {
    saveInteraction(recipe, liked, { area, ingredient });
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
  // Use fullRecipe if available and matching, otherwise fallback to simple data (prevents flickering)
  const displayRecipe = (fullRecipe && fullRecipe.idMeal === currentRecipe.idMeal) ? fullRecipe : currentRecipe;
  const isVoted = history.some(item => item.idMeal === currentRecipe.idMeal);

  return (
    <div className="flex flex-col h-full text-center items-center">
      <h2 className="text-3xl font-bold mb-6">Here is your recipe!</h2>

      <div className="flex-1 w-full max-w-md md:max-w-3xl min-h-0 overflow-y-auto p-2 self-center">
        <div key={currentRecipe.idMeal} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500 h-auto md:h-full md:max-h-[450px] shrink-0">

          <div className="relative w-full h-48 sm:h-64 md:h-full md:w-1/2 bg-gray-100 flex items-center justify-center group overflow-hidden shrink-0">
            <ImageWithLoader
              src={displayRecipe.strMealThumb} // High quality
              previewSrc={`${displayRecipe.strMealThumb}/preview`} // Low quality preview
              alt={displayRecipe.strMeal}
              containerClassName="w-full h-full"
              imageClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Category Badge with reserved space/animation */}
            <div className={`absolute top-4 right-4 transition-opacity duration-500 ${detailsLoading || !(displayRecipe as RecipeDetails).strCategory ? 'opacity-0' : 'opacity-100'}`}>
              {(displayRecipe as RecipeDetails).strCategory && (
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm">
                  {(displayRecipe as RecipeDetails).strCategory}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 flex flex-col flex-1 md:w-1/2 justify-center">
            {/* Title & Area Container - Fixed height to prevent jumps */}
            <div className="mb-4">
              <div className="h-16 flex items-center justify-center mb-1">
                <h3 className="font-bold text-2xl line-clamp-2 leading-tight px-2">{displayRecipe.strMeal}</h3>
              </div>
              <p className="text-gray-500 text-sm">
                Area: {(displayRecipe as RecipeDetails).strArea || area}
              </p>
            </div>

            <div className="h-6 mb-6"> {/* Fixed space for link */}
              <div className={`transition-opacity duration-500 ${detailsLoading ? 'opacity-0' : 'opacity-100'}`}>
                {(displayRecipe as RecipeDetails).strSource && (
                  <a href={(displayRecipe as RecipeDetails).strSource || '#'} target="_blank" rel="noopener noreferrer" className="inline-block text-orange-500 font-semibold hover:underline text-sm">
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
                      onClick={() => handleVote(displayRecipe, false)}
                      className="px-6 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
                    >
                      No <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleVote(displayRecipe, true)}
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