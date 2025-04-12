import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Module, ModulesResponse, UserProgressResponse, UserProgress } from '../lib/types';

export default function ModulesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch all modules
  const { 
    data: modulesData,
    isLoading: isLoadingModules,
    error: modulesError
  } = useQuery<ModulesResponse>({ 
    queryKey: ['/modules'],
    enabled: true
  });
  
  // Fetch user progress if user is authenticated
  const {
    data: progressData,
    isLoading: isLoadingProgress
  } = useQuery<UserProgressResponse>({
    queryKey: ['/progress'],
    // This would normally be enabled based on authentication status
    enabled: false // Disable for now since we haven't implemented auth yet
  });
  
  // Create a map of module ID to progress status
  const progressMap = new Map<number, UserProgress>();
  if (progressData?.progress) {
    progressData.progress.forEach(progress => {
      if (progress.moduleId) {
        progressMap.set(progress.moduleId, progress);
      }
    });
  }
  
  // Filter modules based on search query
  const filteredModules = modulesData?.modules 
    ? modulesData.modules.filter(module => 
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Get module status (not started, in progress, completed)
  const getModuleStatus = (module: Module) => {
    const progress = progressMap.get(module.id);
    if (!progress) return 'not-started';
    return progress.completed ? 'completed' : 'in-progress';
  };
  
  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-title">Learning Modules</h1>
          <p className="page-description">
            Interactive lessons to build your understanding of trade concepts
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
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modules List */}
      <div className="bg-neutral-50 py-12">
        <div className="content-container">
          {isLoadingModules ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="module-card bg-white animate-pulse">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6 mb-6"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    <div className="h-10 bg-neutral-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : modulesError ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-500 mb-4">Error loading modules</h3>
              <p className="text-neutral-600 mb-6">Sorry, we couldn't load the learning modules at this time.</p>
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">No modules found</h3>
                  <p className="text-neutral-600 mb-6">
                    No modules match your search query. Try a different search or browse all modules.
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
                  <h3 className="text-xl font-semibold mb-4">No modules available</h3>
                  <p className="text-neutral-600">
                    There are no learning modules available at this time. Please check back later.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((module) => {
                  const status = getModuleStatus(module);
                  return (
                    <div 
                      key={module.id} 
                      className={`module-card bg-white ${status !== 'not-started' ? status : ''}`}
                    >
                      <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                      <p className="text-neutral-600 mb-6">{module.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-neutral-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span>{module.estimatedMinutes} min</span>
                        </div>
                        {status === 'completed' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        ) : status === 'in-progress' ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            In Progress
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <Link href={`/v2/modules/${module.id}`}>
                          <a className="block text-center py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                            {status === 'completed' ? 'Review Module' : 
                             status === 'in-progress' ? 'Continue Module' : 
                             'Start Module'}
                          </a>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination placeholder - would be implemented in a real app */}
              {filteredModules.length > 9 && (
                <div className="flex justify-center mt-12">
                  <nav className="inline-flex rounded-md shadow">
                    <a
                      href="#"
                      className="py-2 px-4 border border-r-0 border-neutral-300 rounded-l-md bg-white text-neutral-500 hover:bg-neutral-50"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="py-2 px-4 border border-neutral-300 bg-primary text-white"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="py-2 px-4 border border-l-0 border-neutral-300 rounded-r-md bg-white text-neutral-500 hover:bg-neutral-50"
                    >
                      Next
                    </a>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}