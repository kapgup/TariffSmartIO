import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Module, ModulesResponse, DailyChallenge } from '../lib/types';
import { MVP_MODULE_TOPICS } from '../lib/constants';

export default function HomePage() {
  // Fetch featured modules
  const { 
    data: modulesData,
    isLoading: isLoadingModules,
    error: modulesError
  } = useQuery<ModulesResponse>({ 
    queryKey: ['/modules'],
    enabled: true 
  });
  
  // Fetch daily challenge
  const {
    data: challengeData,
    isLoading: isLoadingChallenge
  } = useQuery({
    queryKey: ['/daily-challenge'],
    enabled: true
  });

  // Get modules if available, or use placeholders while loading
  const modules = modulesData?.modules || [];
  const dailyChallenge = challengeData?.challenge as DailyChallenge;
  
  return (
    <>
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-600 py-16 md:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-tight">
            Understand International Trade & Tariffs
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Interactive learning modules, simulations, and reference tools to help you 
            understand the complex world of international trade.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/v2/modules">
              <a className="px-8 py-3 rounded-lg bg-white text-primary font-medium shadow-lg hover:shadow-xl transition">
                Start Learning
              </a>
            </Link>
            <Link href="/v2/dictionary">
              <a className="px-8 py-3 rounded-lg bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition">
                Explore Dictionary
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How TariffSmart v2 Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
              <p className="text-neutral-600">
                Engage with bite-sized modules featuring interactive simulations to understand 
                how tariffs and trade policies work.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trade Dictionary</h3>
              <p className="text-neutral-600">
                Access an easy-to-understand reference guide for all trade and tariff terminology, 
                with gamified elements to enhance learning.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Daily Challenges</h3>
              <p className="text-neutral-600">
                Test your knowledge with daily challenges that reinforce concepts and 
                track your learning progress over time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured modules section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Learning Modules</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Explore our most popular learning modules to build your understanding of international trade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingModules ? (
              // Loading placeholders
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="module-card bg-white animate-pulse">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                  <div className="mt-8 h-10 bg-neutral-200 rounded"></div>
                </div>
              ))
            ) : modulesError ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-red-500">Error loading modules</p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : modules.length > 0 ? (
              // Actual modules
              modules.slice(0, 3).map((module: Module) => (
                <div key={module.id} className="module-card bg-white">
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-neutral-600 mb-4">{module.description}</p>
                  <div className="flex items-center text-sm text-neutral-500 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>{module.estimatedMinutes} min</span>
                  </div>
                  <Link href={`/v2/modules/${module.id}`}>
                    <a className="block text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                      Start Module
                    </a>
                  </Link>
                </div>
              ))
            ) : (
              // Fallback to example modules if API returns empty
              MVP_MODULE_TOPICS.slice(0, 3).map((topic, index) => (
                <div key={index} className="module-card bg-white">
                  <h3 className="text-xl font-semibold mb-2">{topic}</h3>
                  <p className="text-neutral-600 mb-4">
                    Learn about the fundamentals of international trade and how it affects the global economy.
                  </p>
                  <div className="flex items-center text-sm text-neutral-500 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>5-10 min</span>
                  </div>
                  <Link href="/v2/modules">
                    <a className="block text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                      View Modules
                    </a>
                  </Link>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/v2/modules">
              <a className="inline-flex items-center px-6 py-3 border border-neutral-300 rounded-lg text-primary font-medium hover:bg-neutral-50 transition">
                View All Modules
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Daily challenge section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Daily Challenge</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Test your knowledge and reinforce your learning with our daily challenge
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="daily-challenge-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Today's Challenge</h3>
                <span className="badge-beginner">Quick Quiz</span>
              </div>
              
              {isLoadingChallenge ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6 mb-6"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
              ) : dailyChallenge ? (
                <>
                  <p className="mb-6">
                    {dailyChallenge.type === 'term' 
                      ? "Test your knowledge of a key trade term" 
                      : dailyChallenge.type === 'quiz'
                        ? "Answer today's trade question correctly"
                        : "Learn an interesting trade fact"}
                  </p>
                  <Link href="/v2/challenge">
                    <a className="block text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                      Take Today's Challenge
                    </a>
                  </Link>
                </>
              ) : (
                <>
                  <p className="mb-6">
                    Complete a quick quiz or learn a new trade term. New challenges every day!
                  </p>
                  <Link href="/v2/challenge">
                    <a className="block text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                      See Today's Challenge
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start learning?</h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-8">
            Dive into our interactive modules and build your understanding of international 
            trade concepts and policies.
          </p>
          <Link href="/v2/modules">
            <a className="inline-block px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors">
              Get Started Now
            </a>
          </Link>
        </div>
      </section>
    </>
  );
}