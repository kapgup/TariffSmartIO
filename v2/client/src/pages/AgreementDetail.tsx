import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TradeAgreementResponse } from '../lib/types';

export default function AgreementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const agreementId = parseInt(id);
  
  // Fetch agreement details
  const {
    data: agreementData,
    isLoading,
    error
  } = useQuery<TradeAgreementResponse>({
    queryKey: [`/trade-agreements/${agreementId}`],
    enabled: !!agreementId
  });
  
  const agreement = agreementData?.agreement;
  
  // Parse key points from JSON
  const keyPoints = agreement?.keyPoints
    ? (typeof agreement.keyPoints === 'string' ? JSON.parse(agreement.keyPoints) : agreement.keyPoints) 
    : [];
  
  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="content-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Link href="/v2/agreements">
                <a className="text-white/80 hover:text-white flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  Back to Agreements
                </a>
              </Link>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
                </div>
              ) : error ? (
                <h1 className="page-title">Agreement Not Found</h1>
              ) : agreement ? (
                <h1 className="page-title">{agreement.name}</h1>
              ) : (
                <h1 className="page-title">Agreement Details</h1>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Agreement Content */}
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
              <h3 className="text-xl font-semibold text-red-500 mb-4">Error Loading Agreement</h3>
              <p className="text-neutral-600 mb-6">
                Sorry, we couldn't load this trade agreement. It may not exist or there was a problem with the server.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  className="px-6 py-2 bg-primary text-white rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
                <Link href="/v2/agreements">
                  <a className="px-6 py-2 border border-neutral-300 rounded-md">
                    Back to Agreements
                  </a>
                </Link>
              </div>
            </div>
          ) : agreement ? (
            <div className="max-w-3xl">
              <div className="bg-neutral-50 p-6 rounded-lg border mb-8">
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className="text-neutral-700">{agreement.shortDescription}</p>
              </div>
              
              <div className="prose max-w-none mb-8">
                <h2>Details</h2>
                <p>{agreement.fullDescription}</p>
              </div>
              
              {keyPoints.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Key Points</h2>
                  <ul className="space-y-3">
                    {keyPoints.map((point: string, index: number) => (
                      <li key={index} className="key-point">
                        <span className="key-point-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Navigation */}
              <div className="border-t mt-12 pt-8">
                <div className="flex justify-between">
                  <Link href="/v2/agreements">
                    <a className="inline-flex items-center text-primary hover:underline">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                      Back to Agreements
                    </a>
                  </Link>
                  <Link href="/v2/modules">
                    <a className="inline-flex items-center text-primary hover:underline">
                      Learn More
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
              <h3 className="text-xl font-semibold mb-4">Agreement Not Found</h3>
              <p className="text-neutral-600 mb-6">
                Sorry, we couldn't find the trade agreement you're looking for.
              </p>
              <Link href="/v2/agreements">
                <a className="px-6 py-2 bg-primary text-white rounded-md">
                  Back to Agreements
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Content CTA */}
      <div className="bg-neutral-50 py-12 border-t">
        <div className="content-container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Deepen Your Understanding</h2>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Explore our learning modules to better understand how trade agreements impact global commerce and consumer prices.
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