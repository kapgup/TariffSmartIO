import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { initGA, pageView } from "@/lib/analytics";

import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import Products from "@/pages/Products";
import Countries from "@/pages/Countries";
import Timeline from "@/pages/Timeline";
import About from "@/pages/About";
import AdMockup from "@/pages/AdMockup";
import NotFound from "@/pages/not-found";
import ComingSoon from "@/pages/ComingSoon";

import { Header } from '@/components/layout/Header';
import { AdManager } from '@/components/ads/AdManager';

function Router() {
  const [location] = useLocation();
  
  // Track page views when location changes
  useEffect(() => {
    pageView(location);
    console.log("Page view tracked:", location);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AdManager showFooter={false} />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/products" component={Products} />
          <Route path="/countries" component={Countries} />
          <Route path="/timeline" component={Timeline} />
          <Route path="/about" component={About} />
          <Route path="/ad-mockup" component={AdMockup} />
          {/* Placeholder routes for unimplemented features */}
          <Route path="/api-docs" component={ComingSoon} />
          <Route path="/savings-tips" component={ComingSoon} />
          <Route path="/help-center" component={ComingSoon} />
          <Route path="/pricing" component={ComingSoon} />
          {/* v2 Education Platform Redirect */}
          <Route path="/education" component={() => {
            useEffect(() => {
              window.location.href = "/v2";
            }, []);
            return <div className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Redirecting to TariffSmart Education Platform...</h2>
              <p>If you are not redirected automatically, <a href="/v2" className="text-primary underline">click here</a>.</p>
            </div>;
          }} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
