import { Frown, Lightbulb } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { api } from '../services/api';
import type { RecipeDetails, SimpleRecipe } from '../types/api-responses';
import RecipeCard from './ui/RecipeCard';


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
        <span className="text-gray-500 font-medium mx-2">or</span>
        <button onClick={onBack} className="bg-black text-white px-6 py-2 rounded-full">Go Back</button>
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
        <RecipeCard
          recipe={displayRecipe}
          isVoted={isVoted}
          onVote={(liked) => handleVote(displayRecipe, liked)}
          isLoadingDetails={detailsLoading}
          areaFallback={area}
        />
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