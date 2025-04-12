import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
import { PATHS, DICTIONARY_CATEGORIES } from '../lib/constants';
import { DictionaryTermResponse } from '../lib/types';

/**
 * Dictionary term detail page
 */
export default function DictionaryTerm() {
  // Get the term slug from the URL
  const [match, params] = useRoute<{ slug: string }>(PATHS.DICTIONARY_TERM);
  const { slug } = params || { slug: '' };

  // Query the dictionary term data
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery<DictionaryTermResponse>({
    queryKey: ['dictionary', slug],
    queryFn: async () => {
      const response = await fetch(`/v2/api/dictionary/${slug}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch dictionary term: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (!match) {
    return <div>Term not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header with term and navigation */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href={PATHS.DICTIONARY}>
              <a className="text-sm font-medium text-blue-600 hover:text-blue-800">
                ← Back to Dictionary
              </a>
            </Link>
            {!isLoading && !isError && data?.term && (
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{data.term.term}</h1>
            )}
          </div>
          
          {!isLoading && !isError && data?.term && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {DICTIONARY_CATEGORIES[data.term.category.toUpperCase()] || data.term.category}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ) : isError ? (
          <div className="py-8 text-center">
            <p className="text-red-500">
              {error instanceof Error ? error.message : 'Failed to load dictionary term'}
            </p>
            <Link href={PATHS.DICTIONARY}>
              <a className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Return to Dictionary
              </a>
            </Link>
          </div>
        ) : data?.term ? (
          <div>
            <div className="prose max-w-none">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Definition</h2>
                <p className="text-gray-700">{data.term.definition}</p>
              </div>

              {data.term.examples && data.term.examples.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Examples</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {data.term.examples.map((example, index) => (
                      <li key={index} className="text-gray-700">{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Related terms */}
            {data.related && data.related.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Related Terms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.related.map((relatedTerm) => (
                    <Link key={relatedTerm.id} href={PATHS.DICTIONARY_TERM.replace(':slug', relatedTerm.slug)}>
                      <a className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                        <h3 className="text-lg font-medium text-gray-900">{relatedTerm.term}</h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{relatedTerm.definition}</p>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge source and last updated date */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500">
                <p>Source: TariffSmart Trade Knowledge Base</p>
                <p>Last updated: {new Date(data.term.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">Term not found</p>
            <Link href={PATHS.DICTIONARY}>
              <a className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Return to Dictionary
              </a>
            </Link>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Link href={PATHS.DICTIONARY}>
          <a className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Back to Dictionary
          </a>
        </Link>
        {data?.term && (
          <a
            href={`mailto:?subject=Trade%20Term:%20${encodeURIComponent(data.term.term)}&body=${encodeURIComponent(
              `Check out this trade term on TariffSmart:\n\n${data.term.term}\n\n${data.term.definition}\n\n`
            )}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Share via Email
          </a>
        )}
      </div>
    </div>
  );
}