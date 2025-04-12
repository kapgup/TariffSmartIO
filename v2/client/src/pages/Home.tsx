import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  PATHS, 
  DIFFICULTY_LEVELS, 
  MODULE_CATEGORIES,
  DICTIONARY_CATEGORIES,
  APP_NAME
} from '../lib/constants';
import { ModulesResponse, DailyChallengeResponse } from '../lib/types';
import { useAuth } from '../hooks/useAuth';

/**
 * Home page component
 */
export default function Home() {
  const { isAuthenticated, user } = useAuth();

  // Query featured modules
  const { 
    data: modulesData,
    isLoading: isLoadingModules,
    isError: isModulesError,
  } = useQuery<ModulesResponse>({
    queryKey: ['modules'],
    queryFn: async () => {
      // Add query params to fetch only featured modules
      const response = await fetch('/v2/api/modules?limit=3&featured=true');
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      return response.json();
    },
    initialData: {
      modules: [],
      categories: [],
      totalModules: 0
    }
  });

  // Query daily challenge (only if authenticated)
  const {
    data: challengeData,
    isLoading: isLoadingChallenge,
    isError: isChallengeError,
  } = useQuery<DailyChallengeResponse>({
    queryKey: ['challenges', 'today'],
    queryFn: async () => {
      const response = await fetch('/v2/api/challenges/today');
      if (!response.ok) {
        throw new Error('Failed to fetch daily challenge');
      }
      return response.json();
    },
    enabled: isAuthenticated,
    initialData: {
      challenge: null,
      completed: false
    }
  });

  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative py-16 sm:py-24 lg:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-gray-900">Trade Education</span>
                <span className="block text-blue-600">Simplified.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl">
                Master international trade and tariff policies through interactive learning modules, 
                comprehensive trade dictionary, and daily challenges.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={PATHS.MODULES}>
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Explore Modules
                  </a>
                </Link>
                <Link href={PATHS.DICTIONARY}>
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Trade Dictionary
                  </a>
                </Link>
                {!isAuthenticated && (
                  <Link href={PATHS.REGISTER}>
                    <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100">
                      Register Free Account
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured modules section */}
      <section className="bg-white py-12 rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Learning Modules</h2>
            <Link href={PATHS.MODULES}>
              <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all modules →
              </a>
            </Link>
          </div>

          {isLoadingModules ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : isModulesError ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load modules. Please try again later.</p>
            </div>
          ) : modulesData.modules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No modules available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modulesData.modules.map((module) => {
                const difficulty = Object.values(DIFFICULTY_LEVELS).find(
                  (d) => d.value === module.difficulty
                );
                
                return (
                  <div key={module.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
                            Learn more →
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dictionary categories section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trade Dictionary</h2>
            <Link href={PATHS.DICTIONARY}>
              <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Browse full dictionary →
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {Object.entries(DICTIONARY_CATEGORIES).map(([key, value]) => (
              <Link key={key} href={`${PATHS.DICTIONARY}?category=${key.toLowerCase()}`}>
                <a className="bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <h3 className="font-medium text-gray-900">{value}</h3>
                  <p className="mt-2 text-sm text-gray-500">Browse terms</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits/Features section */}
      <section className="bg-gray-50 py-16 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Use {APP_NAME} Learning Platform?</h2>
            <p className="mt-4 text-lg text-gray-500">
              Our platform provides comprehensive resources to help you navigate the complex world of international trade.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Structured Learning</h3>
              <p className="text-gray-500">
                Progress through our curated learning modules designed by trade policy experts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Dictionary</h3>
              <p className="text-gray-500">
                Access a vast dictionary of trade terms and concepts with detailed explanations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Challenges</h3>
              <p className="text-gray-500">
                Test your knowledge with daily trade challenges and earn badges to track your progress.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trade Agreements</h3>
              <p className="text-gray-500">
                Explore detailed information about global trade agreements and their provisions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 20.25h-9a1.5 1.5 0 01-1.5-1.5v-10.5a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievements & Certificates</h3>
              <p className="text-gray-500">
                Earn certificates by completing learning tracks to demonstrate your trade knowledge.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-500">
                Track your learning progress and see which areas you've mastered or need improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily challenge section (shown only to authenticated users) */}
      {isAuthenticated && (
        <section className="bg-white py-12 rounded-lg shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Today's Challenge</h2>

            {isLoadingChallenge ? (
              <div className="bg-gray-100 animate-pulse rounded-lg h-56"></div>
            ) : isChallengeError ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Failed to load today's challenge. Please try again later.</p>
              </div>
            ) : !challengeData.challenge ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-500">No challenge available for today. Check back tomorrow!</p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{challengeData.challenge.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{challengeData.challenge.description}</p>
                    <div className="mt-4 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {challengeData.challenge.difficulty}
                      </span>
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {challengeData.challenge.points} points
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-0 sm:ml-6 flex-shrink-0">
                    {challengeData.completed ? (
                      <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600">
                        Completed ✓
                      </span>
                    ) : (
                      <Link href={PATHS.CHALLENGE}>
                        <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                          Take Challenge
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="bg-blue-700 py-16 rounded-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to become a trade expert?</span>
            <span className="block">Start your learning journey today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Join thousands of professionals who use our platform to enhance their knowledge of international trade.
          </p>
          <div className="mt-8 flex justify-center">
            {isAuthenticated ? (
              <Link href={PATHS.MODULES}>
                <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                  Browse Learning Modules
                </a>
              </Link>
            ) : (
              <Link href={PATHS.REGISTER}>
                <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                  Sign Up Free
                </a>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}