import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { pageView } from "@/lib/analytics";

export default function ComingSoon() {
  const [location] = useLocation();
  
  useEffect(() => {
    pageView(location);
  }, [location]);

  // Extract feature name from URL path
  const getFeatureName = () => {
    const path = location.split('/').filter(p => p);
    if (path.length === 0) return "This feature";
    
    // Convert path to readable format: 'api-docs' -> 'API Docs'
    const featureName = path[path.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return featureName;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 pb-6">
          <div className="flex mb-4 gap-2 items-center">
            <Clock className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Coming Soon</h1>
          </div>

          <p className="mt-4 mb-6 text-gray-600">
            {getFeatureName()} is currently under development and will be available soon. 
            We're working hard to bring you the best experience possible.
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/">
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}