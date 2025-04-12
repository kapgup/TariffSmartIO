import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  DictionaryTerm, 
  DictionaryTermsResponse 
} from '../lib/types';
import { DICTIONARY_CATEGORIES } from '../lib/constants';

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Fetch dictionary terms
  const { 
    data: dictionaryData,
    isLoading,
    error
  } = useQuery<DictionaryTermsResponse>({ 
    queryKey: ['/dictionary'],
    enabled: true
  });
  
  // Filter terms based on search query and selected category
  const filteredTerms = useMemo(() => {
    if (!dictionaryData?.terms) return [];
    
    return dictionaryData.terms.filter(term => {
      const matchesSearch = 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = 
        selectedCategory === 'All Categories' || 
        term.category === selectedCategory;
        
      return matchesSearch && matchesCategory;
    });
  }, [dictionaryData, searchQuery, selectedCategory]);
  
  // Group terms alphabetically
  const groupedTerms = useMemo(() => {
    const groups: Record<string, DictionaryTerm[]> = {};
    
    filteredTerms.forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });
    
    // Sort each group
    Object.keys(groups).forEach(letter => {
      groups[letter].sort((a, b) => a.term.localeCompare(b.term));
    });
    
    return groups;
  }, [filteredTerms]);
  
  // Get unique categories from the data
  const availableCategories = useMemo(() => {
    const categories = new Set<string>(['All Categories']);
    
    dictionaryData?.terms?.forEach(term => {
      if (term.category) {
        categories.add(term.category);
      }
    });
    
    return Array.from(categories);
  }, [dictionaryData]);
  
  const alphabetLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-title">Trade Dictionary</h1>
          <p className="page-description">
            Your guide to understanding trade terminology
          </p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="content-container py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search terms or definitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {(availableCategories.length > 0 ? availableCategories : DICTIONARY_CATEGORIES).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alphabet Jump Navigation */}
      <div className="bg-neutral-100 border-b overflow-auto">
        <div className="content-container py-2">
          <div className="flex justify-center md:justify-start space-x-1 md:space-x-2">
            {alphabetLetters.map(letter => {
              const hasTerms = !!groupedTerms[letter];
              return (
                <a
                  key={letter}
                  href={hasTerms ? `#letter-${letter}` : undefined}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                    hasTerms 
                      ? 'text-primary hover:bg-primary hover:text-white cursor-pointer' 
                      : 'text-neutral-400 cursor-default'
                  }`}
                >
                  {letter}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Dictionary List */}
      <div className="bg-white py-12">
        <div className="content-container">
          {isLoading ? (
            <div className="space-y-8">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-8 bg-neutral-200 rounded w-8 mb-4"></div>
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-20 bg-neutral-100 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-500 mb-4">Error loading dictionary terms</h3>
              <p className="text-neutral-600 mb-6">Sorry, we couldn't load the dictionary at this time.</p>
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : Object.keys(groupedTerms).length === 0 ? (
            <div className="text-center py-12">
              {searchQuery || selectedCategory !== 'All Categories' ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">No terms found</h3>
                  <p className="text-neutral-600 mb-6">
                    No terms match your search criteria. Try a different search or category.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-6 py-2 bg-primary text-white rounded-md"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Categories');
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4">No terms available</h3>
                  <p className="text-neutral-600">
                    There are no dictionary terms available at this time. Please check back later.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedTerms)
                .sort()
                .map(letter => (
                  <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-4 text-primary">{letter}</h2>
                    <div className="space-y-1">
                      {groupedTerms[letter].map(term => (
                        <Link key={term.id} href={`/v2/dictionary/${term.id}`}>
                          <a className="dictionary-term block">
                            <div className="flex justify-between">
                              <h3 className="font-semibold">{term.term}</h3>
                              {term.category && (
                                <span className="dictionary-category-badge">
                                  {term.category}
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-600 mt-1 line-clamp-2">
                              {term.definition}
                            </p>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Daily Term Challenge CTA */}
      <div className="bg-neutral-50 py-12 border-t">
        <div className="content-container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Challenge yourself with our daily trade term quiz to reinforce your learning.
            </p>
            <Link href="/v2/challenge">
              <a className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                Take Today's Challenge
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}