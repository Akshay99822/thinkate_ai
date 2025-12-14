import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, BrainCircuit, Settings, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '../constants';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleDarkMode } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', public: true },
    { name: 'About', path: '/about', public: true },
    { name: 'Contact', path: '/contact', public: true },
    { name: 'Chat', path: '/chat', public: false },
    { name: 'Tools', path: '/tools', public: false },
    { name: 'Features', path: '/features', public: false },
  ];

  const filteredNavItems = navItems.filter(item => item.public || isAuthenticated);

  const glassClass = theme.uiStyle === 'glass' ? 'bg-surface/60 backdrop-blur-xl border-b border-white/20' : 'bg-surface/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800';

  return (
    <header className={`sticky top-0 z-50 shadow-sm transition-all duration-300 ${glassClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <BrainCircuit className={`h-8 w-8 text-primary ${theme.uiStyle === 'neon' ? 'drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]' : ''}`} />
              <span className={`text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${theme.uiStyle === 'neon' ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]' : ''}`}>
                {APP_NAME}
              </span>
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200 dark:border-gray-700">
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-yellow-400">
                {theme.isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {isAuthenticated ? (
                <>
                    <NavLink to="/settings" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-primary">
                        <Settings className="h-5 w-5" />
                    </NavLink>
                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full pl-1 pr-3 py-1">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <button onClick={handleLogout} className="text-xs font-medium text-gray-500 hover:text-red-500">
                            Log Out
                        </button>
                    </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                    <NavLink to="/login" className="text-sm font-medium text-gray-500 hover:text-primary">Login</NavLink>
                    <NavLink to="/signup" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:opacity-90">Sign Up</NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
             <button onClick={toggleDarkMode} className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-yellow-400">
                {theme.isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            
            {isAuthenticated ? (
                <>
                    <NavLink
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                    Settings
                    </NavLink>
                    <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                        Log Out
                    </button>
                </>
            ) : (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-2 px-3">
                    <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2 rounded-lg border border-gray-200 dark:border-gray-700 font-medium">Login</NavLink>
                    <NavLink to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2 rounded-lg bg-primary text-white font-medium">Sign Up</NavLink>
                </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};