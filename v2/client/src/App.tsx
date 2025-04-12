import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { queryClient } from './lib/queryClient';
import { PATHS } from './lib/constants';

// Layout components
import Layout from './components/layout/Layout';

// Page components
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Dictionary from './pages/Dictionary';
import DictionaryTerm from './pages/DictionaryTerm';
import Agreements from './pages/Agreements';
import AgreementDetail from './pages/AgreementDetail';
import Challenge from './pages/Challenge';
import Quiz from './pages/Quiz';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/auth/Dashboard';
import Profile from './pages/auth/Profile';
import Certificates from './pages/auth/Certificates';
import Badges from './pages/auth/Badges';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

/**
 * Main application component
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

/**
 * Application routes
 */
function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path={PATHS.HOME} component={Home} />
        <Route path={PATHS.MODULES} component={Modules} />
        <Route path={PATHS.MODULE_DETAIL} component={ModuleDetail} />
        <Route path={PATHS.DICTIONARY} component={Dictionary} />
        <Route path={PATHS.DICTIONARY_TERM} component={DictionaryTerm} />
        <Route path={PATHS.AGREEMENTS} component={Agreements} />
        <Route path={PATHS.AGREEMENT_DETAIL} component={AgreementDetail} />
        <Route path={PATHS.CHALLENGE} component={Challenge} />
        <Route path={PATHS.QUIZ} component={Quiz} />
        <Route path={PATHS.LOGIN} component={Login} />
        <Route path={PATHS.REGISTER} component={Register} />
        <Route path={PATHS.DASHBOARD} component={Dashboard} />
        <Route path={PATHS.PROFILE} component={Profile} />
        <Route path={PATHS.CERTIFICATES} component={Certificates} />
        <Route path={PATHS.BADGES} component={Badges} />
        <Route path={PATHS.ABOUT} component={About} />
        <Route path={PATHS.TERMS} component={Terms} />
        <Route path={PATHS.PRIVACY} component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}