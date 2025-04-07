import { useState } from "react";
import { Link, useLocation } from "wouter";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { useAuthenticationFeature } from "@/lib/featureFlags";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const isAuthEnabled = useAuthenticationFeature();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6zm-1-8C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
              </svg>
              <span className="ml-2 text-xl font-heading font-bold text-primary">{APP_NAME}</span>
            </Link>
          </div>
          
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`px-3 py-2 text-sm font-medium ${
                  location === item.path 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-neutral-600 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center">
            {isAuthEnabled && (
              <Button variant="secondary" className="bg-secondary hover:bg-secondary/80 text-white font-medium">
                Sign Up
              </Button>
            )}
            
            <button
              className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === item.path
                    ? "text-primary bg-neutral-100"
                    : "text-neutral-600 hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
