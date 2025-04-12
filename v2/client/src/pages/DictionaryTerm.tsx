import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { DictionaryTermResponse } from '../lib/types';

export default function DictionaryTermPage() {
  const { id } = useParams<{ id: string }>();
  const termId = parseInt(id);
  
  // Fetch term details
  const {
    data: termData,
    isLoading,
    error
  } = useQuery<DictionaryTermResponse>({
    queryKey: [`/dictionary/${termId}`],
    enabled: !!termId,
  });
  
  const term = termData?.term;
  
  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="content-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Link href="/v2/dictionary">
                <a className="text-white/80 hover:text-white flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  Back to Dictionary
                </a>
              </Link>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
                </div>
              ) : error ? (
                <h1 className="page-title">Term Not Found</h1>
              ) : term ? (
                <h1 className="page-title">{term.term}</h1>
              ) : (
                <h1 className="page-title">Term Details</h1>
              )}
            </div>
            {!isLoading && !error && term?.category && (
              <span className="inline-block mt-2 md:mt-0 px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                {term.category}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Term Content */}
      <div className="bg-white py-12">
        <div className="content-container">
          {isLoading ? (
            <div className="max-w-3xl animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-full mb-4"></div>
              <div className="h-6 bg-neutral-200 rounded w-5/6 mb-4"></div>
              <div className="h-6 bg-neutral-200 rounded w-4/6 mb-8"></div>
              
              <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-500 mb-4">Error Loading Term</h3>
              <p className="text-neutral-600 mb-6">
                Sorry, we couldn't load this dictionary term. It may not exist or there was a problem with the server.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  className="px-6 py-2 bg-primary text-white rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
                <Link href="/v2/dictionary">
                  <a className="px-6 py-2 border border-neutral-300 rounded-md">
                    Back to Dictionary
                  </a>
                </Link>
              </div>
            </div>
          ) : term ? (
            <div>
              <div className="max-w-3xl bg-neutral-50 rounded-lg p-8 mb-8 border shadow-sm">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">{term.term}</h2>
                <p className="text-lg text-neutral-700">{term.definition}</p>
              </div>
              
              {/* Related Terms (Placeholder for future feature) */}
              <div className="max-w-3xl mt-8">
                <h3 className="text-xl font-semibold mb-4">Related Terms</h3>
                <p className="text-neutral-500 italic">
                  This feature is coming soon. We'll show related dictionary terms here.
                </p>
              </div>
              
              {/* Example Usage (Placeholder for future feature) */}
              <div className="max-w-3xl mt-8">
                <h3 className="text-xl font-semibold mb-4">Example Usage</h3>
                <p className="text-neutral-500 italic">
                  This feature is coming soon. We'll show examples of how this term is used in real-world trade contexts.
                </p>
              </div>
              
              {/* Navigation */}
              <div className="max-w-3xl border-t mt-12 pt-8">
                <div className="flex justify-between">
                  <Link href="/v2/dictionary">
                    <a className="inline-flex items-center text-primary hover:underline">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                      Back to Dictionary
                    </a>
                  </Link>
                  <Link href="/v2/challenge">
                    <a className="inline-flex items-center text-primary hover:underline">
                      Test Your Knowledge
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Term Not Found</h3>
              <p className="text-neutral-600 mb-6">
                Sorry, we couldn't find the term you're looking for.
              </p>
              <Link href="/v2/dictionary">
                <a className="px-6 py-2 bg-primary text-white rounded-md">
                  Back to Dictionary
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Daily Challenge CTA */}
      <div className="bg-neutral-50 py-12 border-t">
        <div className="content-container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready for a Challenge?</h2>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Test your trade terminology knowledge with our daily challenge.
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