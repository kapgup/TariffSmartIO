import { Router, Route, Switch } from 'wouter';
import { Suspense, lazy } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/Home';

// Lazy-loaded pages
const ModulesPage = lazy(() => import('./pages/Modules'));
const ModuleDetailPage = lazy(() => import('./pages/ModuleDetail'));
const DictionaryPage = lazy(() => import('./pages/Dictionary'));
const DictionaryTermPage = lazy(() => import('./pages/DictionaryTerm'));
const AgreementsPage = lazy(() => import('./pages/Agreements'));
const AgreementDetailPage = lazy(() => import('./pages/AgreementDetail'));
const ChallengePage = lazy(() => import('./pages/Challenge'));
const QuizPage = lazy(() => import('./pages/Quiz'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export function App() {
  return (
    <Router base="/v2">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/modules" component={ModulesPage} />
              <Route path="/modules/:id" component={ModuleDetailPage} />
              <Route path="/dictionary" component={DictionaryPage} />
              <Route path="/dictionary/:id" component={DictionaryTermPage} />
              <Route path="/agreements" component={AgreementsPage} />
              <Route path="/agreements/:id" component={AgreementDetailPage} />
              <Route path="/challenge" component={ChallengePage} />
              <Route path="/quiz/:id" component={QuizPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}