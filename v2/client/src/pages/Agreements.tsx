import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TradeAgreement, TradeAgreementsResponse } from '../lib/types';

export default function AgreementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch trade agreements
  const {
    data: agreementsData,
    isLoading,
    error
  } = useQuery<TradeAgreementsResponse>({
    queryKey: ['/trade-agreements'],
    enabled: true
  });
  
  // Filter agreements based on search query
  const filteredAgreements = agreementsData?.agreements
    ? agreementsData.agreements.filter(agreement =>
        agreement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agreement.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-title">Trade Agreements</h1>
          <p className="page-description">
            Learn about major international trade agreements and what they mean
          </p>
        </div>
      </div>
      
      {/* Search */}
      <div className="bg-white border-b">
        <div className="content-container py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search agreements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Agreements List */}
      <div className="bg-neutral-50 py-12">
        <div className="content-container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-12 bg-neutral-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-500 mb-4">Error Loading Agreements</h3>
              <p className="text-neutral-600 mb-6">
                Sorry, we couldn't load the trade agreements at this time.
              </p>
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredAgreements.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">No Agreements Found</h3>
                  <p className="text-neutral-600 mb-6">
                    No agreements match your search query. Try a different search.
                  </p>
                  <button
                    className="px-6 py-2 bg-primary text-white rounded-md"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4">No Agreements Available</h3>
                  <p className="text-neutral-600">
                    There are no trade agreements available at this time. Please check back later.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAgreements.map((agreement: TradeAgreement) => (
                <Link key={agreement.id} href={`/v2/agreements/${agreement.id}`}>
                  <a className="trade-agreement-card block">
                    <div className="trade-agreement-card__header">
                      <h3 className="font-semibold">{agreement.name}</h3>
                    </div>
                    <div className="trade-agreement-card__body">
                      <p className="line-clamp-3 text-neutral-600">
                        {agreement.shortDescription}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Educational CTA */}
      <div className="bg-white py-12 border-t">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Understanding Trade Agreements</h2>
            <p className="text-neutral-600 mb-6">
              Trade agreements are complex documents that establish the rules of trade between countries. 
              Learn more about how they work and their impact on global commerce.
            </p>
            <Link href="/v2/modules">
              <a className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                Explore Learning Modules
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}