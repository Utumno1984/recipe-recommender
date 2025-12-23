import { History, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path
        ? "text-orange-600 border-b-2 border-orange-600"
        : "text-gray-500 hover:text-orange-400";

    return (
        <nav className="flex justify-center gap-8 p-6 border-b border-gray-100 bg-white">
            <Link to="/" className={`font-bold pb-1 transition-all flex items-center gap-2 ${isActive('/')}`}>
                <Search className="w-5 h-5" /> New Search
            </Link>
            <Link to="/history" className={`font-bold pb-1 transition-all flex items-center gap-2 ${isActive('/history')}`}>
                <History className="w-5 h-5" /> History
            </Link>
        </nav>
    );
};

export default Navbar;