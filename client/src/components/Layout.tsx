// src/components/Layout.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LogOut, User, Home, CreditCard, ArrowUpDown, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/authContext';

interface LayoutProps {
    children: React.ReactNode;
}

const NAV_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Accounts', path: '/accounts', icon: CreditCard },
    { name: 'Transactions', path: '/transactions', icon: ArrowUpDown },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <CreditCard className="h-6 w-6" />
                            <span className="text-xl font-bold">SmartBank</span>
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex items-center space-x-4">
                            {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                                <NavItem
                                    key={name}
                                    name={name}
                                    to={path}
                                    Icon={Icon}
                                    active={isActive(path)}
                                />
                            ))}

                            {/* User Info */}
                            {user && (
                                <div className="flex items-center space-x-2 px-3 py-2 text-sm">
                                    <User className="h-4 w-4" />
                                    <span>{user.name}</span>
                                </div>
                            )}

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </nav>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden focus:outline-none"
                            aria-label="Toggle Menu"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden px-4 pb-4 space-y-2 bg-blue-700">
                        {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                            <NavItem
                                key={name}
                                name={name}
                                to={path}
                                Icon={Icon}
                                active={isActive(path)}
                                onClick={() => setMenuOpen(false)}
                            />
                        ))}

                        {user && (
                            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-white">
                                <User className="h-4 w-4" />
                                <span>{user.name}</span>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full text-left flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-600 text-white transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {children}
            </main>
        </div>
    );
};

// Reusable Nav Item
const NavItem = ({
    name,
    to,
    Icon,
    active,
    onClick,
}: {
    name: string;
    to: string;
    Icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
    onClick?: () => void;
}) => {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${active ? 'bg-blue-800 font-semibold' : 'hover:bg-blue-700'
                }`}
        >
            <Icon className="h-4 w-4" />
            <span>{name}</span>
        </Link>
    );
};

export default Layout;
