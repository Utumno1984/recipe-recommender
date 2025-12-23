import { useEffect, useState, type FC } from 'react';
import { api } from '../services/api';

interface StepOneProps {
  selectedArea: string;
  onSelect: (area: string) => void;
  onNext: () => void;
}

const StepOne: FC<StepOneProps> = ({ selectedArea, onSelect, onNext }) => {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAreas = async () => {
      try {
        setLoading(true);
        const data = await api.getAreas();
        setAreas(data);
      } catch {
        setError('Unable to load areas. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAreas();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading cuisines...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-full flex-col gap-6">
      <header className='flex flex-col'>
        <h2 className="text-2xl font-bold">Step 1: Cuisine Preference</h2>
        <p className="text-gray-600">Select a culinary tradition to start.</p>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-2 sm:grid-cols-3 gap-3 p-2 overflow-y-auto">
        {areas.map((area) => (
          <button
            key={area}
            onClick={() => onSelect(area)}
            className={`p-3 border rounded-lg transition-all ${selectedArea === area
              ? 'bg-orange-500 text-white border-orange-500 shadow-lg scale-105'
              : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
              }`}
          >
            {area}
          </button>
        ))}
      </div>

      <footer className="mt-4 flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedArea}
          className={`px-8 py-3 rounded-full font-semibold text-white transition-all ${selectedArea
            ? 'bg-black hover:bg-gray-800'
            : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default StepOne;