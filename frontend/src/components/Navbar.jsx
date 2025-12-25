import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">SH</span>
                        </div>
                        <span className="text-xl font-bold text-gray-100">Shiva's Hub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-300 hover:text-primary-500 transition-colors">
                            Home
                        </Link>

                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="flex items-center space-x-1 text-gray-300 hover:text-primary-500 transition-colors"
                                    >
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300">Hi, {user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-300 hover:text-primary-500 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-100 transition-colors touch-target"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-700 bg-gray-900">
                        <Link
                            to="/"
                            className="block py-3 px-4 text-gray-300 hover:text-primary-500 hover:bg-gray-800 rounded-lg mx-2 transition-colors touch-target"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="block py-3 px-4 text-gray-300 hover:text-primary-500 hover:bg-gray-800 rounded-lg mx-2 transition-colors touch-target"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <div className="py-3 px-4 text-gray-300 mx-2">Hi, {user.name}</div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-3 px-4 text-red-500 hover:bg-gray-800 rounded-lg mx-2 transition-colors touch-target"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block py-3 px-4 text-gray-300 hover:text-primary-500 hover:bg-gray-800 rounded-lg mx-2 transition-colors touch-target"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block py-3 px-4 mx-2 mt-2 text-center bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors touch-target"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
