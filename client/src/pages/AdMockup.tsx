import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pageView } from "@/lib/analytics";
import { Link } from "wouter";

export default function AdMockup() {
  useEffect(() => {
    pageView("/ad-mockup");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AdSense Integration Mockups</h1>
      
      {/* Header Ad Mockup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Header Banner Ad</h2>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-2 font-bold text-indigo-700">Where this would appear:</div>
              <p className="text-gray-700">
                This ad would be shown below the navigation bar, spanning the full width of the page.
                It would be visible on all pages for non-premium users.
              </p>
            </div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-0">
            <CardTitle>Header Ad Example</CardTitle>
            <CardDescription>How the ad would appear at the top of the page</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Header with navigation */}
            <div className="mb-4 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="TariffSmart Logo" className="h-8 w-auto" />
                  <span className="text-xl font-bold">TariffSmart</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">Home</span>
                  <span className="text-gray-600">Products</span>
                  <span className="text-gray-600">Calculator</span>
                  <span className="text-gray-600">About</span>
                </div>
              </div>
            </div>
            
            {/* Advertisement Banner */}
            <div className="w-full overflow-hidden rounded mb-6">
              <img src="/ad-mockup-header.svg" alt="Header Ad Mockup" className="w-full" />
            </div>
            
            {/* Page Content Preview */}
            <div className="py-4">
              <h2 className="text-2xl font-bold mb-4">Page Content Would Start Here</h2>
              <p className="text-gray-700 mb-4">
                The actual content of the page would begin below the advertisement banner.
                This ensures the ad is visible without being too intrusive to the user experience.
              </p>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Content continues here...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Footer Ad Mockup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Footer Banner Ad</h2>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-2 font-bold text-indigo-700">Where this would appear:</div>
              <p className="text-gray-700">
                This ad would be displayed just above the footer section, spanning the full width of the page.
                It would be visible on all pages for non-premium users.
              </p>
            </div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-0">
            <CardTitle>Footer Ad Example</CardTitle>
            <CardDescription>How the ad would appear at the bottom of the page</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Page Content Preview */}
            <div className="py-4">
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center mb-8">
                <span className="text-gray-500">Content ends here...</span>
              </div>
            </div>
            
            {/* Advertisement Banner */}
            <div className="w-full overflow-hidden rounded mb-6">
              <img src="/ad-mockup-footer.svg" alt="Footer Ad Mockup" className="w-full" />
            </div>
            
            {/* Footer Preview */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  © 2025 TariffSmart. All rights reserved.
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Implementation Notes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Implementation Notes</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="list-disc pl-5 space-y-2">
              <li>Ads would only be shown to unregistered users and free tier users</li>
              <li>Premium users would have an ad-free experience</li>
              <li>Mobile responsiveness would be maintained with appropriately sized ad units</li>
              <li>Ad units would be implemented as React components that can be conditionally rendered</li>
              <li>We would include proper labeling as "Advertisement" for compliance</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}