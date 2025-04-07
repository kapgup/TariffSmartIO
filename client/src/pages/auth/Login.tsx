import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { pageView } from '@/lib/analytics';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');
  
  useEffect(() => {
    pageView('/auth/login');
    
    // If user is already logged in, redirect to home
    if (user && !isLoading) {
      setLocation('/');
    }
    
    // Fetch Google OAuth URL
    const fetchGoogleAuthUrl = async () => {
      try {
        const response = await fetch('/api/auth/google/url');
        if (response.ok) {
          const data = await response.json();
          setGoogleAuthUrl(data.url);
        } else {
          console.error('Failed to fetch Google auth URL');
        }
      } catch (error) {
        console.error('Error fetching Google auth URL:', error);
      }
    };
    
    fetchGoogleAuthUrl();
  }, [user, isLoading, setLocation]);
  
  const handleGoogleLogin = () => {
    if (googleAuthUrl) {
      window.location.href = googleAuthUrl;
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Login | TariffSmart</title>
      </Helmet>
      
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Login to TariffSmart</CardTitle>
            <CardDescription>
              Access personalized tariff information and premium features
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex items-center justify-center space-x-2" 
              onClick={handleGoogleLogin}
              disabled={!googleAuthUrl}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              <span>Sign in with Google</span>
            </Button>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-500">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setLocation('/auth/register')}
              >
                Register Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;