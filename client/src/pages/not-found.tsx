import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { pageView } from "@/lib/analytics";

export default function NotFound() {
  useEffect(() => {
    pageView("/not-found");
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 mb-8">
        <CardContent className="pt-6 pb-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          </div>

          <p className="mt-4 mb-6 text-gray-600">
            We're sorry, but the page you were looking for doesn't exist or has been moved.
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

      <Card className="w-full max-w-3xl mx-4">
        <CardContent className="pt-6 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">TariffSmart Logo Options - Minimalist Design</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <h3 className="text-md font-semibold mb-2">Option 4: T with Chart Line</h3>
              <div className="border rounded-lg p-4 bg-white w-full">
                <img src="/logo-options/logo-option4.svg" alt="Logo Option 4" className="w-full h-auto" />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="text-md font-semibold mb-2">Option 5: Square with Arrows</h3>
              <div className="border rounded-lg p-4 bg-white w-full">
                <img src="/logo-options/logo-option5.svg" alt="Logo Option 5" className="w-full h-auto" />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="text-md font-semibold mb-2">Option 6: Circular T</h3>
              <div className="border rounded-lg p-4 bg-white w-full">
                <img src="/logo-options/logo-option6.svg" alt="Logo Option 6" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
