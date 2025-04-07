import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { pageView } from '@/lib/analytics';

export default function AuthRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Track the page view
    pageView('/auth/redirect');
    
    // Add a small delay to show the loading state
    const timer = setTimeout(() => {
      // Redirect to the unified auth page
      setLocation('/auth');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-center">Redirecting...</h2>
          <p className="text-center text-muted-foreground">Please wait while we redirect you to the login page.</p>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5 mx-auto" />
            <Skeleton className="h-4 w-3/5 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}