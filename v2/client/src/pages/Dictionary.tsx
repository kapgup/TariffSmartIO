import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { PATHS, DICTIONARY_CATEGORIES } from '../lib/constants';
import { DictionaryTermsResponse } from '../lib/types';

/**
 * Dictionary page displaying trade-related terms
 */
export default function Dictionary() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Extract category from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  // Query dictionary terms with filters
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery<DictionaryTermsResponse>({
    queryKey: ['dictionary'],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      params.append('page', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      
      const response = await fetch(`/v2/api/dictionary?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dictionary terms');
      }
      return response.json();
    },
    initialData: {
      terms: [],
      categories: Object.values(DICTIONARY_CATEGORIES).map(c => c.toLowerCase()),
      totalTerms: 0
    }
  });

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  // Handle category filter click
  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    
    // Update URL with category param
    if (category) {
      setLocation(`${PATHS.DICTIONARY}?category=${category}`);
    } else {
      setLocation(PATHS.DICTIONARY);
    }
    
    refetch();
  };

  // Calculate total pages
  const totalPages = Math.ceil((data?.totalTerms || 0) / pageSize);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900">Trade Dictionary</h1>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Browse our comprehensive dictionary of trade terms, concepts, and definitions to enhance your understanding of international trade.
        </p>
        
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="mt-6">
          <div className="flex w-full md:max-w-md gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dictionary terms..."
              className="px-4 py-2 flex-grow border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Categories filter */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          
          {Object.entries(DICTIONARY_CATEGORIES).map(([key, name]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key.toLowerCase())}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key.toLowerCase()
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Dictionary terms */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-24 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center">
            <p className="text-red-500">Failed to load dictionary terms. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : data.terms.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              {searchTerm 
                ? `No terms found matching "${searchTerm}"` 
                : selectedCategory 
                  ? `No terms found in the ${
                      DICTIONARY_CATEGORIES[selectedCategory.toUpperCase()] || selectedCategory
                    } category` 
                  : 'No dictionary terms available yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {data.totalTerms} {data.totalTerms === 1 ? 'Result' : 'Results'}
              {selectedCategory && (
                <span className="text-gray-600 font-normal">
                  {' '}in {DICTIONARY_CATEGORIES[selectedCategory.toUpperCase()] || selectedCategory}
                </span>
              )}
              {searchTerm && <span className="text-gray-600 font-normal"> for "{searchTerm}"</span>}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {data.terms.map((term) => (
                <Link key={term.id} href={PATHS.DICTIONARY_TERM.replace(':slug', term.slug)}>
                  <a className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{term.term}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {DICTIONARY_CATEGORIES[term.category.toUpperCase()] || term.category}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-3">{term.definition}</p>
                    <span className="mt-2 inline-block text-sm text-blue-600">View details →</span>
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                      refetch();
                      window.scrollTo(0, 0);
                    }}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isCurrentPage = page === currentPage;
                      const isNearCurrentPage = 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1;
                      
                      if (!isNearCurrentPage && page !== 1 && page !== totalPages && page !== currentPage - 2 && page !== currentPage + 2) {
                        return i === 2 || i === totalPages - 3 ? (
                          <span key={i} className="px-3 py-1 text-gray-500">...</span>
                        ) : null;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(page);
                            refetch();
                            window.scrollTo(0, 0);
                          }}
                          className={`px-3 py-1 rounded-md ${
                            isCurrentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      refetch();
                      window.scrollTo(0, 0);
                    }}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}