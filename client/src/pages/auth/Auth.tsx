import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useFeatureFlag } from '@/lib/featureFlags';
import { pageView } from '@/lib/analytics';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for error parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam === 'authentication_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, []);
  const { toast } = useToast();
  const authEnabled = useFeatureFlag('authentication', true);
  
  useEffect(() => {
    pageView("/auth");
  }, []);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = '/auth/google';
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An error occurred during sign in. Please try again.');
      setIsLoading(false);
    }
  };

  // Redirect if auth is disabled
  if (!authEnabled) {
    toast({
      title: 'Authentication Disabled',
      description: 'The authentication feature is currently disabled.',
      variant: 'destructive',
    });
    setLocation('/');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Sign In | TariffSmart</title>
      </Helmet>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Sign in to TariffSmart</CardTitle>
            <CardDescription className="text-center text-base">
              Sign in or create an account to access tariff insights
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-3 py-6 text-base border-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className="w-6 h-6"
                >
                  <path 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                    fill="#4285F4" 
                  />
                  <path 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                    fill="#34A853" 
                  />
                  <path 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                    fill="#FBBC05" 
                  />
                  <path 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                    fill="#EA4335" 
                  />
                </svg>
                <span className="font-medium">{isLoading ? 'Processing...' : 'Continue with Google'}</span>
              </Button>
            </div>
            
            <div>
              <p className="text-sm text-center text-muted-foreground">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </CardContent>
          
          <Separator className="my-2" />
          
          <CardFooter className="flex flex-col space-y-2 items-center pb-6">
            <p className="text-sm text-center text-muted-foreground">
              TariffSmart uses Google for secure authentication.
              <br />We never store your password.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}