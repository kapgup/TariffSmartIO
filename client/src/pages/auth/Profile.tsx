import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { pageView } from '@/lib/analytics';
import { 
  User, CreditCard, Calendar, Clock, 
  Settings, Shield, ShieldCheck
} from 'lucide-react';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    pageView("/profile");
  }, []);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth?from=/profile');
    }
  }, [user, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!user) return null;
  
  // Get role badge display and text
  const getRoleBadge = () => {
    switch (user.role) {
      case 'admin':
        return <ShieldCheck className="h-5 w-5 text-red-500" />;
      case 'editor':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'premium':
        return <CreditCard className="h-5 w-5 text-amber-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getRoleText = () => {
    switch (user.role) {
      case 'admin':
        return 'Administrator';
      case 'editor':
        return 'Content Editor';
      case 'premium':
        return 'Premium User';
      default:
        return 'Standard User';
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.username.substring(0, 2).toUpperCase();
  };
  
  return (
    <>
      <Helmet>
        <title>My Profile | TariffSmart</title>
      </Helmet>
      
      <div className="container py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-12">
          {/* Profile Overview Card */}
          <Card className="md:col-span-4">
            <CardHeader className="pb-4">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 pb-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profilePicture || ''} alt={user.displayName || user.username} />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium text-xl">{user.displayName || user.username}</h3>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm">
                {getRoleBadge()}
                <span className="font-medium">{getRoleText()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button variant="outline" className="w-full" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
          
          {/* Account Details Card */}
          <div className="md:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Information about your TariffSmart account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Username</div>
                    <div className="font-medium">{user.username}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{user.email || 'Not provided'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Account Type</div>
                    <div className="font-medium flex items-center gap-1">
                      {getRoleBadge()}
                      <span>{getRoleText()}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Subscription</div>
                    <div className="font-medium">
                      {user.subscriptionTier || 'Standard'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Your activity on TariffSmart</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background border rounded-lg flex items-center gap-3">
                      <Calendar className="text-primary h-8 w-8" />
                      <div>
                        <div className="text-sm text-muted-foreground">Calculations</div>
                        <div className="text-2xl font-semibold">12</div>
                      </div>
                    </div>
                    <div className="p-4 bg-background border rounded-lg flex items-center gap-3">
                      <Clock className="text-primary h-8 w-8" />
                      <div>
                        <div className="text-sm text-muted-foreground">Recent Activity</div>
                        <div className="text-2xl font-semibold">3 days ago</div>
                      </div>
                    </div>
                    <div className="p-4 bg-background border rounded-lg flex items-center gap-3">
                      <CreditCard className="text-primary h-8 w-8" />
                      <div>
                        <div className="text-sm text-muted-foreground">Saved Items</div>
                        <div className="text-2xl font-semibold">5</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}