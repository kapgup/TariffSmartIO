import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { pageView } from '@/lib/analytics';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthRedirect() {
  const [, setLocation] = useLocation();
  const { user, refetchUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    // Track the page view
    pageView('/auth/redirect');
    
    const checkAuthStatus = async () => {
      try {
        console.log('Checking authentication status...');
        await refetchUser();
        
        // Check URL for error parameters
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        
        if (errorParam) {
          setStatus('error');
          setMessage(`Authentication error: ${errorParam}`);
          // Redirect to auth page after a delay
          setTimeout(() => setLocation('/auth?error=authentication_failed'), 2000);
          return;
        }
        
        // If we have a user, authentication was successful
        if (user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting to homepage...');
          setTimeout(() => setLocation('/'), 1000);
        } else {
          // Try one more time after a delay
          setTimeout(async () => {
            await refetchUser();
            if (user) {
              setStatus('success');
              setMessage('Authentication successful! Redirecting to homepage...');
              setTimeout(() => setLocation('/'), 1000);
            } else {
              setStatus('error');
              setMessage('Authentication failed. Please try again.');
              setTimeout(() => setLocation('/auth?error=authentication_failed'), 2000);
            }
          }, 1500);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setStatus('error');
        setMessage('An error occurred during authentication.');
        setTimeout(() => setLocation('/auth?error=authentication_failed'), 2000);
      }
    };
    
    checkAuthStatus();
  }, [setLocation, user, refetchUser]);

  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-center">
            {status === 'loading' && 'Processing Authentication...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Error'}
          </h2>
          
          {status === 'loading' && (
            <>
              <p className="text-center text-muted-foreground">Please wait while we verify your credentials.</p>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mx-auto" />
                <Skeleton className="h-4 w-3/5 mx-auto" />
              </div>
            </>
          )}
          
          {status === 'success' && (
            <Alert variant="default" className="border-green-600 bg-green-50 dark:bg-green-900/20">
              <InfoIcon className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}