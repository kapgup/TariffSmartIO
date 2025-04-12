import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_FULL_NAME, MVP_MODULE_TOPICS, API_ENDPOINTS, ROUTES } from '../lib/constants';
import { ModulesResponse, DailyChallengeResponse } from '../lib/types';
import { BookOpen, Award, BookText, BarChart4, TrendingUp, Lightbulb } from 'lucide-react';

const Home: React.FC = () => {
  // Example queries - these would connect to the backend when ready
  const { data: modulesData, isLoading: isModulesLoading } = useQuery<ModulesResponse>({
    queryKey: [API_ENDPOINTS.MODULES],
    queryFn: () => {
      // Mock data for preview
      return Promise.resolve({
        modules: MVP_MODULE_TOPICS.map((title, idx) => ({
          id: idx + 1,
          title,
          description: `Learn about ${title.toLowerCase()} and how they impact global trade.`,
          difficulty: idx < 2 ? 'beginner' : idx < 4 ? 'intermediate' : 'advanced',
          estimatedMinutes: 20 + (idx * 5),
          category: ['tariffs', 'trade_policy', 'customs', 'treaties', 'compliance', 'shipping'][idx % 6],
          content: {},
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
      });
    },
    enabled: false // Disable actual API call for preview
  });

  // Daily challenge data - mock for preview
  const { data: challengeData } = useQuery<DailyChallengeResponse>({
    queryKey: [API_ENDPOINTS.DAILY_CHALLENGE],
    queryFn: () => {
      return Promise.resolve({
        challenge: {
          id: 1,
          title: "Tariff Classification Challenge",
          type: "quiz",
          difficulty: "intermediate",
          content: "Test your knowledge on correctly classifying products into HS Codes",
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        completed: false
      });
    },
    enabled: false // Disable actual API call for preview
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary/80 to-primary p-8 rounded-2xl text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to {APP_FULL_NAME}
            </h1>
            <p className="text-xl mb-6">
              Your comprehensive learning platform for understanding tariffs, trade policies, 
              and international commerce dynamics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Curriculum
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-none">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-2">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">12</h3>
            <p className="text-muted-foreground">Learning Modules</p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-none">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-2">
              <BookText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">150+</h3>
            <p className="text-muted-foreground">Dictionary Terms</p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-none">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-2">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">365</h3>
            <p className="text-muted-foreground">Daily Challenges</p>
          </CardContent>
        </Card>
      </section>

      {/* Featured Modules */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Modules</h2>
          <Link href={ROUTES.MODULES}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(modulesData?.modules || []).slice(0, 3).map((module) => (
            <Card key={module.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={
                    module.difficulty === 'beginner' ? 'default' : 
                    module.difficulty === 'intermediate' ? 'secondary' : 
                    'destructive'
                  }>
                    {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                  </Badge>
                  <Badge variant="outline">{module.estimatedMinutes} min</Badge>
                </div>
                <CardTitle className="mt-2">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button className="w-full">Start Module</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Daily Challenge */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Today's Challenge</h2>
        {challengeData?.challenge && (
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  <span>{challengeData.challenge.title}</span>
                </div>
              </CardTitle>
              <CardDescription className="text-white/80">
                Complete today's challenge to continue your learning streak!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{challengeData.challenge.content}</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-white/20">{challengeData.challenge.difficulty}</Badge>
                <Badge className="bg-white/20">{new Date().toLocaleDateString()}</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-white text-indigo-700 hover:bg-white/90">
                Take Challenge
              </Button>
            </CardFooter>
          </Card>
        )}
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Why TariffSmart Education?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>Comprehensive Learning</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Access structured modules that progressively build your knowledge of international trade concepts and practices.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart4 className="h-6 w-6 text-primary" />
                <CardTitle>Progress Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Track your learning journey with detailed progress statistics and achievement badges.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle>Skills Development</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Build practical skills in tariff classification, trade agreement analysis, and compliance management.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                <CardTitle>Daily Challenges</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Reinforce your learning with daily challenges that keep your knowledge fresh and test your understanding.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <Card className="bg-primary/10 border-none">
          <CardContent className="pt-6 text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to become a tariff expert?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Start your journey into understanding global trade policies, tariffs, and international commerce today.
            </p>
            <Button size="lg">Get Started Now</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;