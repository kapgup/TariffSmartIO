import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { PATHS, DIFFICULTY_LEVELS, MODULE_CATEGORIES } from '../lib/constants';
import { ModulesResponse } from '../lib/types';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

/**
 * Learning modules page
 */
export default function Modules() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  
  // Check if learning modules feature is enabled
  const { isEnabled: isModulesEnabled, isLoading: isCheckingFlag } = useFeatureFlag('enableLearningModules');

  // Extract filters from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const difficulty = urlParams.get('difficulty');
    
    if (category) {
      setSelectedCategory(category);
    }
    
    if (difficulty) {
      setSelectedDifficulty(difficulty);
    }
  }, [location]);

  // Query modules with filters
  const {
    data,
    isLoading: isLoadingModules,
    isError,
    refetch
  } = useQuery<ModulesResponse>({
    queryKey: ['modules'],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (selectedDifficulty) {
        params.append('difficulty', selectedDifficulty);
      }
      
      params.append('page', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      
      const response = await fetch(`/v2/api/modules?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      return response.json();
    },
    enabled: isModulesEnabled,
    initialData: {
      modules: [],
      categories: Object.values(MODULE_CATEGORIES).map(c => c.toLowerCase()),
      totalModules: 0
    }
  });

  const isLoading = isCheckingFlag || isLoadingModules;
  
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
    updateUrl(category, selectedDifficulty);
    
    refetch();
  };

  // Handle difficulty filter click
  const handleDifficultyClick = (difficulty: string | null) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage(1);
    
    // Update URL with difficulty param
    updateUrl(selectedCategory, difficulty);
    
    refetch();
  };

  // Update URL with filter params
  const updateUrl = (category: string | null, difficulty: string | null) => {
    const params = new URLSearchParams();
    
    if (category) {
      params.append('category', category);
    }
    
    if (difficulty) {
      params.append('difficulty', difficulty);
    }
    
    const queryString = params.toString();
    setLocation(queryString ? `${PATHS.MODULES}?${queryString}` : PATHS.MODULES);
  };

  // Calculate total pages
  const totalPages = Math.ceil((data?.totalModules || 0) / pageSize);

  if (!isModulesEnabled && !isCheckingFlag) {
    return (
      <div className="py-12 px-4 text-center bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Learning Modules Coming Soon</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We're currently working on creating comprehensive learning modules for your trade education.
          Please check back soon!
        </p>
        <Link href={PATHS.HOME}>
          <a className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Return to Home
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Modules</h1>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Explore our comprehensive learning modules designed to enhance your understanding of international trade,
          tariffs, and global trade policies. Each module includes detailed explanations, practical examples, and quizzes.
        </p>
        
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="mt-6">
          <div className="flex w-full md:max-w-md gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search modules..."
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
      
      {/* Filters section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
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
              
              {Object.entries(MODULE_CATEGORIES).map(([key, name]) => (
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
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Difficulty Level</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDifficultyClick(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedDifficulty === null
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                All Levels
              </button>
              
              {Object.values(DIFFICULTY_LEVELS).map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleDifficultyClick(level.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedDifficulty === level.value
                      ? level.color
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
          
          {(selectedCategory || selectedDifficulty) && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedDifficulty(null);
                  updateUrl(null, null);
                  refetch();
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modules grid */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-72"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center">
            <p className="text-red-500">Failed to load modules. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : data.modules.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              {searchTerm 
                ? `No modules found matching "${searchTerm}"` 
                : selectedCategory && selectedDifficulty
                  ? `No ${selectedDifficulty} modules found in the ${
                      MODULE_CATEGORIES[selectedCategory.toUpperCase()] || selectedCategory
                    } category`
                  : selectedCategory
                    ? `No modules found in the ${
                        MODULE_CATEGORIES[selectedCategory.toUpperCase()] || selectedCategory
                      } category`
                    : selectedDifficulty
                      ? `No ${selectedDifficulty} modules found`
                      : 'No modules available yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {data.totalModules} {data.totalModules === 1 ? 'Module' : 'Modules'}
                {selectedCategory && (
                  <span className="text-gray-600 font-normal">
                    {' '}in {MODULE_CATEGORIES[selectedCategory.toUpperCase()] || selectedCategory}
                  </span>
                )}
                {selectedDifficulty && (
                  <span className="text-gray-600 font-normal">
                    {selectedCategory ? ' at ' : ' in '}
                    {selectedDifficulty} level
                  </span>
                )}
              </h2>
              
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.modules.map((module) => {
                const difficulty = Object.values(DIFFICULTY_LEVELS).find(
                  (d) => d.value === module.difficulty
                );
                
                return (
                  <div key={module.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    {module.imageUrl && (
                      <div className="h-40 bg-gray-100 overflow-hidden">
                        <img 
                          src={module.imageUrl} 
                          alt={module.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficulty?.color}`}>
                          {difficulty?.name}
                        </span>
                        <span className="text-sm text-gray-500">{module.estimatedMinutes} min</span>
                      </div>
                      <Link href={PATHS.MODULE_DETAIL.replace(':slug', module.slug)}>
                        <a className="block">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
                            {module.title}
                          </h3>
                        </a>
                      </Link>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {module.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center text-sm font-medium text-blue-600">
                          {MODULE_CATEGORIES[module.category.toUpperCase()] || module.category}
                        </span>
                        <Link href={PATHS.MODULE_DETAIL.replace(':slug', module.slug)}>
                          <a className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                            Start learning →
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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