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
          <Route component={NotFound} />
        </Switch>
      </div>
      <AdManager showHeader={false} />
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
