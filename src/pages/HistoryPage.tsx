import { ThumbsDown, ThumbsUp } from 'lucide-react';
import ImageWithLoader from '../components/ui/ImageWithLoader';
import { useHistory } from '../hooks/useHistory';

const HistoryPage = () => {
    const { history, clearHistory } = useHistory();

    if (history.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p>You haven't saved any recipes yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full items-center">
            <div className="flex flex-col h-full max-w-2xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your History</h2>
                    <button onClick={clearHistory} className="text-sm text-red-500 hover:underline">
                        Clear all
                    </button>
                </div>

                <div className="flex flex-col flex-1 min-h-0 space-y-4 overflow-y-auto">
                    {history.map((item) => (
                        <div key={item.savedAt} className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center gap-4">
                            <ImageWithLoader
                                src={item.strMealThumb}
                                alt={item.strMeal}
                                containerClassName="w-16 h-16 rounded-full shrink-0"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{item.strMeal}</h3>
                                <p className="text-xs text-gray-500">
                                    {new Date(item.savedAt).toLocaleDateString()} - {new Date(item.savedAt).toLocaleTimeString()}
                                </p>
                            </div>
                            {/* Badge Like/Dislike */}
                            <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${item.liked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {item.liked ? (
                                    <>Liked <ThumbsUp className="w-3 h-3" /></>
                                ) : (
                                    <>Disliked <ThumbsDown className="w-3 h-3" /></>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;