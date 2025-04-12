import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DailyChallengeResponse, DailyChallenge } from '../lib/types';
import { apiMutation, queryClient } from '../lib/queryClient';
import { CHALLENGE_TYPES } from '../lib/constants';

export default function ChallengePage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState<number | null>(null);
  
  // Fetch daily challenge
  const {
    data: challengeData,
    isLoading,
    error
  } = useQuery<DailyChallengeResponse>({
    queryKey: ['/daily-challenge'],
    enabled: true
  });
  
  const challenge = challengeData?.challenge as DailyChallenge;
  const isCompleted = challengeData?.completed || false;
  
  // Parse challenge content
  const challengeContent = challenge ? JSON.parse(challenge.content as string) : null;
  
  // Complete challenge mutation
  const completeMutation = useMutation({
    mutationFn: (score?: number) => 
      apiMutation(`/daily-challenge/${challenge.id}/complete`, 'POST', { score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/daily-challenge'] });
    }
  });
  
  // Handle submit answer
  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setSubmitted(true);
    let earnedScore = 0;
    
    // Calculate score based on challenge type
    if (challenge.type === CHALLENGE_TYPES.QUIZ) {
      const isCorrect = selectedAnswer === challengeContent.correctAnswer;
      earnedScore = isCorrect ? 10 : 0;
      setScore(earnedScore);
    } else if (challenge.type === CHALLENGE_TYPES.TERM) {
      // For term challenges, just mark as completed
      earnedScore = 5;
      setScore(earnedScore);
    }
    
    // Record completion
    completeMutation.mutate(earnedScore);
  };
  
  // Render challenge based on type
  const renderChallenge = () => {
    if (!challenge || !challengeContent) return null;
    
    switch (challenge.type) {
      case CHALLENGE_TYPES.QUIZ:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Daily Quiz Challenge</div>
            <h2 className="text-2xl font-bold mb-6">{challengeContent.question}</h2>
            
            <div className="space-y-3 mb-8">
              {challengeContent.options.map((option: string, index: number) => (
                <div 
                  key={index}
                  className={`quiz-option ${
                    selectedAnswer === option ? 'selected' : ''
                  } ${
                    submitted && option === challengeContent.correctAnswer ? 'correct' : ''
                  } ${
                    submitted && selectedAnswer === option && option !== challengeContent.correctAnswer ? 'incorrect' : ''
                  }`}
                  onClick={() => !submitted && !isCompleted && setSelectedAnswer(option)}
                >
                  <div className={`w-5 h-5 rounded-full border ${
                    selectedAnswer === option ? 'bg-primary border-primary' : 'border-neutral-300'
                  } flex items-center justify-center`}>
                    {selectedAnswer === option && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>{option}</div>
                </div>
              ))}
            </div>
            
            {submitted && (
              <div className={`p-4 rounded-lg mb-6 ${
                selectedAnswer === challengeContent.correctAnswer
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                <p className="font-medium mb-2">
                  {selectedAnswer === challengeContent.correctAnswer
                    ? 'Correct!'
                    : 'Not quite right.'}
                </p>
                <p>{challengeContent.explanation}</p>
              </div>
            )}
            
            {isCompleted && !submitted ? (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mb-6">
                <p className="font-medium">You've already completed today's challenge!</p>
                <p>Come back tomorrow for a new challenge.</p>
              </div>
            ) : null}
            
            <div className="flex justify-between items-center">
              <div>
                {submitted && score !== null && (
                  <span className="points-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                    </svg>
                    +{score} points
                  </span>
                )}
              </div>
              {!submitted && !isCompleted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <Link href="/v2/modules">
                  <a className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
                    Explore Modules
                  </a>
                </Link>
              )}
            </div>
          </div>
        );
        
      case CHALLENGE_TYPES.TERM:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Term of the Day</div>
            <h2 className="text-2xl font-bold mb-4">{challengeContent.term}</h2>
            <div className="bg-neutral-50 p-4 rounded-lg mb-6">
              <p>{challengeContent.definition}</p>
            </div>
            
            {challengeContent.example && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Example:</h3>
                <p className="italic text-neutral-700">{challengeContent.example}</p>
              </div>
            )}
            
            {isCompleted && !submitted ? (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mb-6">
                <p className="font-medium">You've already completed today's challenge!</p>
                <p>Come back tomorrow for a new challenge.</p>
              </div>
            ) : null}
            
            <div className="flex justify-between items-center">
              <div>
                {submitted && score !== null && (
                  <span className="points-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                    </svg>
                    +{score} points
                  </span>
                )}
              </div>
              
              {!submitted && !isCompleted ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition"
                >
                  Mark as Learned
                </button>
              ) : (
                <div className="flex gap-4">
                  <Link href={`/v2/dictionary/term/${challengeContent.term}`}>
                    <a className="px-6 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition">
                      View in Dictionary
                    </a>
                  </Link>
                  <Link href="/v2/modules">
                    <a className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
                      Explore Modules
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
        
      case CHALLENGE_TYPES.FACT:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Daily Trade Fact</div>
            <h2 className="text-2xl font-bold mb-6">{challengeContent.title}</h2>
            <div className="bg-neutral-50 p-4 rounded-lg mb-6">
              <p>{challengeContent.fact}</p>
            </div>
            
            {isCompleted && !submitted ? (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mb-6">
                <p className="font-medium">You've already completed today's challenge!</p>
                <p>Come back tomorrow for a new challenge.</p>
              </div>
            ) : null}
            
            <div className="flex justify-between items-center">
              <div>
                {submitted && (
                  <span className="points-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                    </svg>
                    +3 points
                  </span>
                )}
              </div>
              
              {!submitted && !isCompleted ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition"
                >
                  Mark as Read
                </button>
              ) : (
                <Link href="/v2/modules">
                  <a className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
                    Explore Modules
                  </a>
                </Link>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-neutral-500">Unsupported challenge type.</p>
          </div>
        );
    }
  };
  
  // Render no challenge placeholder
  const renderNoChallenge = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">No Challenge Today</h2>
      <p className="text-neutral-600 mb-6">
        There is no daily challenge available right now. Please check back later.
      </p>
      <Link href="/v2/modules">
        <a className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
          Explore Modules
        </a>
      </Link>
    </div>
  );
  
  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-title">Daily Challenge</h1>
          <p className="page-description">
            Test your knowledge and reinforce your learning
          </p>
        </div>
      </div>
      
      {/* Challenge Content */}
      <div className="bg-neutral-50 py-12">
        <div className="content-container">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-neutral-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4 mb-8">
                  <div className="h-12 bg-neutral-200 rounded"></div>
                  <div className="h-12 bg-neutral-200 rounded"></div>
                  <div className="h-12 bg-neutral-200 rounded"></div>
                  <div className="h-12 bg-neutral-200 rounded"></div>
                </div>
                <div className="flex justify-end">
                  <div className="h-10 bg-neutral-200 rounded w-32"></div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <h2 className="text-xl font-semibold text-red-500 mb-4">Error Loading Challenge</h2>
                <p className="text-neutral-600 mb-6">
                  Sorry, we couldn't load today's challenge. Please try again later.
                </p>
                <button 
                  className="px-6 py-2 bg-primary text-white rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : challenge ? (
              renderChallenge()
            ) : (
              renderNoChallenge()
            )}
            
            {/* Streak Information */}
            <div className="mt-8 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-medium">Your Challenge Streak</span>
                <span className="streak-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                  {submitted || isCompleted ? "1 day" : "0 days"}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                Complete daily challenges to build your streak and earn more points!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Resources Section */}
      <div className="bg-white py-12 border-t">
        <div className="content-container">
          <h2 className="text-2xl font-bold text-center mb-8">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-neutral-50 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Trade Modules</h3>
              <p className="text-neutral-600 mb-4">
                Explore in-depth modules on trade concepts and principles.
              </p>
              <Link href="/v2/modules">
                <a className="text-primary hover:underline flex items-center">
                  Browse Modules
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </Link>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Trade Dictionary</h3>
              <p className="text-neutral-600 mb-4">
                Look up key trade terms and concepts in our comprehensive dictionary.
              </p>
              <Link href="/v2/dictionary">
                <a className="text-primary hover:underline flex items-center">
                  Explore Dictionary
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </Link>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Trade Agreements</h3>
              <p className="text-neutral-600 mb-4">
                Learn about major trade agreements and their key provisions.
              </p>
              <Link href="/v2/agreements">
                <a className="text-primary hover:underline flex items-center">
                  View Agreements
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}