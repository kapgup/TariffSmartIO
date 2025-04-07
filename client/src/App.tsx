import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { initGA, pageView } from "@/lib/analytics";
import { AuthProvider } from "@/hooks/useAuth";

import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import Products from "@/pages/Products";
import Countries from "@/pages/Countries";
import Timeline from "@/pages/Timeline";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import OAuth2Callback from "@/pages/auth/OAuth2Callback";

import { Header } from '@/components/layout/Header';

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
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/products" component={Products} />
        <Route path="/countries" component={Countries} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/about" component={About} />
        <Route path="/auth/register" component={Register} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/callback" component={OAuth2Callback} />
        <Route component={NotFound} />
      </Switch>
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
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
