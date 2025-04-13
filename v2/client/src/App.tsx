import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { queryClient } from './lib/queryClient';
import { PATHS } from './lib/constants';

// Layout components
import Layout from './components/layout/Layout';

// Page components - only import what exists
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Main application component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path={PATHS.HOME} component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </QueryClientProvider>
  );
}