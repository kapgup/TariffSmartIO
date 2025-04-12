import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { APP_FULL_NAME, NAV_ITEMS } from '../../lib/constants';

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/v2">
                <a className="flex items-center">
                  <span className="text-primary font-bold text-xl">{APP_FULL_NAME}</span>
                </a>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-6">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                      location === item.path
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* User/Auth section (placeholder) */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/v2/profile">
                <a className="text-sm text-gray-700 hover:text-primary">
                  My Progress
                </a>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {/* Menu icon */}
                <svg 
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                
                {/* X icon */}
                <svg 
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
        <div className="pt-2 pb-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location === item.path
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            </Link>
          ))}
          
          {/* Mobile auth/user links */}
          <Link href="/v2/profile">
            <a
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Progress
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}