import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { pageView } from '@/lib/analytics';

export default function OAuth2Callback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { refetchUser } = useAuth();
  
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  useEffect(() => {
    pageView("/auth/callback");
    
    // If there's an error parameter, set error status
    if (error) {
      setStatus('error');
      setErrorMessage('Authentication failed: ' + error);
      return;
    }
    
    // If there's no code, it's an error
    if (!code) {
      setStatus('error');
      setErrorMessage('No authentication code received');
      return;
    }
    
    // Process the OAuth code
    const processOAuth = async () => {
      try {
        // Exchange the code for tokens
        const response = await fetch('/api/auth/google/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Authentication failed');
        }
        
        // Refetch user data to update auth state
        await refetchUser();
        
        // Success!
        setStatus('success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          setLocation('/');
        }, 1500);
      } catch (error) {
        console.error('OAuth processing error:', error);
        setStatus('error');
        setErrorMessage((error as Error).message || 'Authentication failed');
      }
    };
    
    processOAuth();
  }, [code, error, refetchUser, setLocation]);
  
  return (
    <>
      <Helmet>
        <title>Authentication | TariffSmart</title>
      </Helmet>
      
      <div className="container max-w-md py-16">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
            {status === 'processing' && (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-center">Processing your authentication...</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="rounded-full bg-green-100 p-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-10 w-10 text-green-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-center font-medium text-lg">Successfully authenticated!</p>
                <p className="text-center text-sm text-gray-500">Redirecting you to the homepage...</p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <Alert variant="destructive" className="w-full">
                  <AlertTitle>Authentication Failed</AlertTitle>
                  <AlertDescription>
                    {errorMessage || 'An error occurred during authentication. Please try again.'}
                  </AlertDescription>
                </Alert>
                
                <Button onClick={() => setLocation('/auth/login')} className="mt-4">
                  Return to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}