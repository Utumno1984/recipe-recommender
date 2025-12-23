import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HistoryPage from './pages/HistoryPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-full w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
        <div className='w-full'>
          <Navbar />
        </div>
        <div className='flex flex-col flex-1 h-full min-h-0'>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;