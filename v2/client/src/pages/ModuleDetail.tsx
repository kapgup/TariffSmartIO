import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PATHS } from '../lib/constants';
import { marked } from 'marked';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Define TypeScript interfaces
interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ModuleResponse {
  module: Module;
  related: Module[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

interface Quiz {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface QuizzesResponse {
  quizzes: Quiz[];
}

// Custom renderer for markdown code blocks with syntax highlighting
const renderer = {
  code(code: string, language: string) {
    return (
      <SyntaxHighlighter
        style={a11yDark}
        language={language}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    );
  },
};

marked.use({ renderer });

export default function ModuleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Fetch module details
  const {
    data: moduleData,
    isLoading: isLoadingModule,
    error: moduleError
  } = useQuery<ModuleResponse>({
    queryKey: ['/v2/api/modules/' + slug],
    retry: 1,
  });
  
  // Complete module mutation
  const completeModuleMutation = useMutation({
    mutationFn: () => {
      return fetch(`/v2/api/modules/${moduleData?.module.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json());
    },
    onSuccess: () => {
      setIsCompleting(false);
      // Update the module data in cache
      queryClient.invalidateQueries({ queryKey: [`/v2/api/modules/${slug}`] });
      queryClient.invalidateQueries({ queryKey: ['/v2/api/progress'] });
    },
    onError: () => {
      setIsCompleting(false);
    }
  });
  
  // Handle complete button click
  const handleCompleteModule = () => {
    if (!moduleData?.module.id) return;
    setIsCompleting(true);
    completeModuleMutation.mutate();
  };
  
  // Create HTML from markdown content
  const createMarkup = (content: string) => {
    return { __html: marked(content) };
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Module Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            {isLoadingModule ? (
              <div className="animate-pulse">
                <div className="h-8 bg-blue-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-blue-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-blue-300 rounded w-5/6"></div>
              </div>
            ) : moduleError ? (
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Error Loading Module</h1>
                <p className="mb-6">Sorry, we couldn't load this module content.</p>
                <button 
                  className="px-6 py-2 bg-white text-primary rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : moduleData?.module ? (
              <>
                <div className="flex items-center mb-6">
                  <Link href={PATHS.MODULES}>
                    <a className="inline-flex items-center text-sm font-medium text-blue-100 hover:text-white">
                      <svg className="mr-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Back to Modules
                    </a>
                  </Link>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-200 text-indigo-800`}>
                    {moduleData.module.category}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800`}>
                    {moduleData.module.difficulty}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{moduleData.module.title}</h1>
                <p className="text-lg mb-6">{moduleData.module.description}</p>
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Estimated time: {moduleData.module.estimatedMinutes} minutes</span>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Module Not Found</h1>
                <p className="mb-6">Sorry, we couldn't find the module you're looking for.</p>
                <Link href={PATHS.MODULES}>
                  <a className="px-6 py-2 bg-white text-primary rounded-md">
                    Back to Modules
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Module Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoadingModule ? (
          <div className="animate-pulse space-y-6">
            {Array(5).fill(0).map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
              </div>
            ))}
          </div>
        ) : moduleError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load module content</p>
            <button 
              className="px-6 py-2 bg-primary text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        ) : moduleData?.module ? (
          <div className="prose prose-blue max-w-none">
            <div dangerouslySetInnerHTML={createMarkup(moduleData.module.content)} />
            
            {/* Module Actions */}
            <div className="my-16 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Module Complete?</h3>
              <p className="text-blue-600 mb-4">
                Once you've finished this module, mark it as complete to track your progress.
              </p>
              <div className="flex justify-between items-center">
                <button 
                  onClick={handleCompleteModule}
                  disabled={isCompleting}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompleting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Marking Complete...
                    </span>
                  ) : "Mark as Complete"}
                </button>
              </div>
            </div>
            
            {/* Related Modules */}
            {moduleData.related && moduleData.related.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {moduleData.related.map(relatedModule => (
                    <div key={relatedModule.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-3`}>
                        {relatedModule.category}
                      </span>
                      <h3 className="text-lg font-semibold mb-2">
                        <Link href={PATHS.MODULE_DETAIL.replace(':slug', relatedModule.slug)}>
                          <a className="text-gray-900 hover:text-blue-600">{relatedModule.title}</a>
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">{relatedModule.description.substring(0, 100)}...</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{relatedModule.estimatedMinutes} min</span>
                        <Link href={PATHS.MODULE_DETAIL.replace(':slug', relatedModule.slug)}>
                          <a className="text-blue-600 hover:text-blue-800 font-medium">Read more →</a>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">No content available for this module.</p>
            <Link href={PATHS.MODULES}>
              <a className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-md">
                Back to Modules
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}