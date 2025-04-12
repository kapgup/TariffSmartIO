import { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QuizResponse, ClientQuizQuestion, QuizSubmission, QuizResult } from '../lib/types';
import { apiMutation, queryClient } from '../lib/queryClient';

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const quizId = parseInt(id);
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // Fetch quiz
  const {
    data: quizData,
    isLoading,
    error
  } = useQuery<QuizResponse>({
    queryKey: [`/quizzes/${quizId}`],
    enabled: !!quizId
  });
  
  const quiz = quizData?.quiz;
  const questions = quizData?.questions || [];
  
  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: (submission: QuizSubmission) => 
      apiMutation<QuizResult, QuizSubmission>(`/quizzes/${quizId}/submit`, 'POST', submission),
    onSuccess: (data) => {
      setQuizResult(data);
      setIsSubmitting(false);
      
      // Invalidate related queries
      if (quiz?.moduleId) {
        queryClient.invalidateQueries({ queryKey: [`/modules/${quiz.moduleId}`] });
      }
      queryClient.invalidateQueries({ queryKey: ['/progress'] });
    },
    onError: () => {
      setIsSubmitting(false);
    }
  });
  
  // Handle selecting an answer for current question
  const selectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Submit quiz
  const handleSubmitQuiz = () => {
    // Ensure all questions have answers
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      // In a real app, we'd show a proper confirmation dialog
      if (!window.confirm(`You have ${unansweredCount} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    // Format answers for submission
    const answers = Object.entries(selectedAnswers).map(([qId, answer]) => ({
      questionId: parseInt(qId),
      answer
    }));
    
    submitQuizMutation.mutate({ answers });
  };
  
  // Function to go back to module or modules list
  const goBack = () => {
    if (quiz?.moduleId) {
      setLocation(`/v2/modules/${quiz.moduleId}`);
    } else {
      setLocation('/v2/modules');
    }
  };
  
  // Get current question
  const currentQuestion = questions[currentStep];
  
  // Calculate progress percentage
  const progressPercentage = (currentStep / (questions.length - 1)) * 100;
  
  // Format options for current question
  const getOptions = (question: ClientQuizQuestion) => {
    try {
      return Array.isArray(question.options) ? question.options : JSON.parse(question.options);
    } catch (e) {
      return [];
    }
  };
  
  // Render quiz results
  const renderQuizResults = () => {
    if (!quizResult) return null;
    
    const score = quizResult.score;
    const results = quizResult.results;
    
    // Group questions by correct/incorrect
    const correctAnswers = results.filter(r => r.correct);
    const incorrectAnswers = results.filter(r => !r.correct);
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
          <div className="inline-block bg-neutral-100 px-6 py-3 rounded-full text-2xl font-bold">
            Score: {score}%
          </div>
          <p className="mt-4 text-neutral-600">
            You answered {correctAnswers.length} out of {results.length} questions correctly.
          </p>
        </div>
        
        {incorrectAnswers.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Review Incorrect Answers</h3>
            <div className="space-y-6">
              {incorrectAnswers.map(result => {
                const question = questions.find(q => q.id === result.questionId);
                if (!question) return null;
                
                return (
                  <div key={result.questionId} className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-medium mb-2">{question.question}</h4>
                    <p className="text-red-700 mb-2">
                      Your answer: {selectedAnswers[question.id]}
                    </p>
                    <p className="text-green-700 mb-2">
                      Correct answer: {result.correctAnswer}
                    </p>
                    {result.explanation && (
                      <div className="mt-2 text-neutral-600">
                        <span className="font-medium">Explanation:</span> {result.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={goBack}
            className="px-6 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition"
          >
            Back to {quiz?.moduleId ? 'Module' : 'Modules'}
          </button>
          
          {quiz?.moduleId && (
            <Link href={`/v2/modules/${quiz.moduleId}`}>
              <a className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
                Continue Learning
              </a>
            </Link>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Quiz Header */}
      <div className="bg-primary text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : error ? (
            <div>
              <h1 className="text-2xl font-bold mb-2">Error Loading Quiz</h1>
              <p>Sorry, we couldn't load this quiz.</p>
            </div>
          ) : quiz ? (
            <div>
              <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
              {quiz.description && <p>{quiz.description}</p>}
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-2">Quiz Not Found</h1>
              <p>Sorry, we couldn't find the quiz you're looking for.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      {!quizResult && !isLoading && questions.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="mt-2 w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quiz Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="h-14 bg-neutral-200 rounded"></div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <div className="h-10 w-24 bg-neutral-200 rounded"></div>
              <div className="h-10 w-24 bg-neutral-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load quiz content</p>
            <div className="flex justify-center gap-4">
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
              <button
                onClick={goBack}
                className="px-6 py-2 border border-neutral-300 rounded-md"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : !quiz ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">Quiz not found</p>
            <Link href="/v2/modules">
              <a className="px-6 py-2 bg-primary text-white rounded-md">
                Browse Modules
              </a>
            </Link>
          </div>
        ) : quizResult ? (
          renderQuizResults()
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">No questions available for this quiz</p>
            <button
              onClick={goBack}
              className="px-6 py-2 bg-primary text-white rounded-md"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-6">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-3">
                {getOptions(currentQuestion).map((option: string, index: number) => (
                  <div 
                    key={index}
                    className={`quiz-option ${
                      selectedAnswers[currentQuestion.id] === option ? 'selected' : ''
                    }`}
                    onClick={() => selectAnswer(currentQuestion.id, option)}
                  >
                    <div className={`w-5 h-5 rounded-full border ${
                      selectedAnswers[currentQuestion.id] === option ? 'bg-primary border-primary' : 'border-neutral-300'
                    } flex items-center justify-center`}>
                      {selectedAnswers[currentQuestion.id] === option && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>{option}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentStep === 0}
                className="px-6 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < questions.length - 1 ? (
                <button
                  onClick={goToNextQuestion}
                  disabled={!selectedAnswers[currentQuestion.id]}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : "Submit Quiz"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}