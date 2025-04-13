import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { NAV_ITEMS, PATHS, APP_NAME } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';

/**
 * Application header with navigation
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and title */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={PATHS.HOME}>
                <a className="flex items-center">
                  <svg width="40" height="32" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:"#3B82F6", stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:"#1E40AF", stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                    
                    {/* Graph Line and Arrow */}
                    <g transform="translate(25, 40)">
                      {/* Line Graph */}
                      <path d="M0,20 L15,15 L30,25 L45,10 L60,0" 
                            stroke="url(#blueGradient)" 
                            strokeWidth="4" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" />
                      
                      {/* Arrow */}
                      <path d="M45,10 L60,0 L55,15" 
                            stroke="url(#blueGradient)" 
                            strokeWidth="4" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" />
                    </g>
                  </svg>
                  <span className="text-2xl font-bold text-blue-600">{APP_NAME}</span>
                  <span className="ml-2 text-sm text-gray-500 font-medium rounded-full bg-blue-50 px-2 py-0.5">v2</span>
                </a>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            {NAV_ITEMS.map((item) => {
              // Skip non-public items if user is not authenticated
              if (!item.public && !isAuthenticated) return null;

              // Check if current path matches this nav item (accounting for parameters)
              const isActive = location === item.path || 
                (item.path !== PATHS.HOME && location.startsWith(item.path.split(':')[0]));

              return (
                <Link key={item.path} href={item.path}>
                  <a 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* User menu / Auth buttons */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user?.displayName || user?.username}
                </span>
                <Link href={PATHS.DASHBOARD}>
                  <a className="text-sm px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Dashboard
                  </a>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-sm px-3 py-1.5 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href={PATHS.LOGIN}>
                  <a className="text-sm px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Login
                  </a>
                </Link>
                <Link href={PATHS.REGISTER}>
                  <a className="text-sm px-3 py-1.5 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Register
                  </a>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              // Skip non-public items if user is not authenticated
              if (!item.public && !isAuthenticated) return null;

              // Check if current path matches this nav item
              const isActive = location === item.path || 
                (item.path !== PATHS.HOME && location.startsWith(item.path.split(':')[0]));

              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile authentication buttons */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <div className="text-base font-medium text-gray-800">
                    {user?.displayName || user?.username}
                  </div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
                <Link href={PATHS.DASHBOARD}>
                  <a
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                </Link>
                <Link href={PATHS.PROFILE}>
                  <a
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </a>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link href={PATHS.LOGIN}>
                  <a
                    className="block py-2 px-3 text-base font-medium rounded-md text-center text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </a>
                </Link>
                <Link href={PATHS.REGISTER}>
                  <a
                    className="block py-2 px-3 text-base font-medium rounded-md text-center text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}