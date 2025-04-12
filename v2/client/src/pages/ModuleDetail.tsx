import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Module, ModuleResponse, ModuleContent, ModuleSection, QuizzesResponse } from '../lib/types';
import { queryClient, apiMutation } from '../lib/queryClient';

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const moduleId = parseInt(id);
  
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Fetch module details
  const {
    data: moduleData,
    isLoading: isLoadingModule,
    error: moduleError
  } = useQuery<ModuleResponse>({
    queryKey: [`/modules/${moduleId}`],
    enabled: !!moduleId,
  });
  
  // Fetch quizzes associated with this module
  const {
    data: quizzesData,
    isLoading: isLoadingQuizzes
  } = useQuery<QuizzesResponse>({
    queryKey: [`/modules/${moduleId}/quizzes`],
    enabled: !!moduleId,
  });
  
  // Complete module mutation
  const completeModuleMutation = useMutation({
    mutationFn: () => apiMutation<any, any>(`/modules/${moduleId}/complete`, 'POST'),
    onSuccess: () => {
      setIsCompleting(false);
      // Update the module data in cache
      queryClient.invalidateQueries({ queryKey: [`/modules/${moduleId}`] });
      queryClient.invalidateQueries({ queryKey: ['/progress'] });
    },
    onError: () => {
      setIsCompleting(false);
    }
  });
  
  // Parse module content
  const moduleContent: ModuleContent | null = moduleData?.module?.content 
    ? JSON.parse(moduleData.module.content as string) 
    : null;
  
  // Handle complete button click
  const handleCompleteModule = () => {
    setIsCompleting(true);
    completeModuleMutation.mutate();
  };
  
  // Render a module section based on its type
  const renderModuleSection = (section: ModuleSection, index: number) => {
    switch (section.type) {
      case 'text':
        return (
          <div key={index} className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        );
      case 'image':
        return (
          <figure key={index} className="my-6">
            <img 
              src={section.url} 
              alt={section.caption} 
              className="w-full rounded-lg"
            />
            <figcaption className="text-center text-sm text-neutral-500 mt-2">
              {section.caption}
            </figcaption>
          </figure>
        );
      case 'video':
        return (
          <figure key={index} className="my-6">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={section.url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
            <figcaption className="text-center text-sm text-neutral-500 mt-2">
              {section.caption}
            </figcaption>
          </figure>
        );
      case 'simulation':
        return (
          <div key={index} className="my-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            <p className="mb-4">
              Interactive simulation to help you understand this concept.
            </p>
            <Link href={`/v2/simulations/${section.id}`}>
              <a className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
                Launch Simulation
              </a>
            </Link>
          </div>
        );
      case 'quiz':
        return (
          <div key={index} className="my-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            <p className="mb-4">
              Test your understanding of this concept with a quick quiz.
            </p>
            <Link href={`/v2/quiz/${section.id}`}>
              <a className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Take Quiz
              </a>
            </Link>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white min-h-screen">
      {/* Module Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoadingModule ? (
            <div className="animate-pulse">
              <div className="h-10 bg-white/20 rounded w-3/4 mb-6"></div>
              <div className="h-6 bg-white/20 rounded w-full mb-2"></div>
              <div className="h-6 bg-white/20 rounded w-5/6"></div>
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
              <Link href="/v2/modules">
                <a className="px-6 py-2 bg-white text-primary rounded-md">
                  Back to Modules
                </a>
              </Link>
            </div>
          )}
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
        ) : moduleContent ? (
          <div className="space-y-8">
            {moduleContent.sections.map((section, index) => 
              renderModuleSection(section, index)
            )}
            
            {/* Quizzes Section */}
            {!isLoadingQuizzes && quizzesData?.quizzes?.length > 0 && (
              <div className="border-t pt-8 mt-12">
                <h2 className="text-2xl font-bold mb-6">Test Your Understanding</h2>
                <div className="space-y-4">
                  {quizzesData.quizzes.map(quiz => (
                    <div key={quiz.id} className="bg-neutral-50 p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-neutral-600 mb-4">{quiz.description}</p>
                      )}
                      <Link href={`/v2/quiz/${quiz.id}`}>
                        <a className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
                          Take Quiz
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Module Completion */}
            <div className="border-t pt-8 mt-12">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Module Complete?</h2>
                <div className="flex space-x-4">
                  <Link href="/v2/modules">
                    <a className="px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition">
                      Back to Modules
                    </a>
                  </Link>
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
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">No content available for this module.</p>
            <Link href="/v2/modules">
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