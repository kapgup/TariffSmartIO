import { useAuth } from '@/hooks/useAuth';
import { GoogleAd } from './GoogleAd';

export const FooterAd = () => {
  const { user } = useAuth();
  
  // Don't show ads to premium users
  if (user?.subscriptionTier === 'premium') {
    return null;
  }
  
  // Reduce ads for registered users (not showing both header and footer)
  if (user?.isAuthenticated && !user?.subscriptionTier) {
    // Registered but not premium - show fewer ads
    // This is a simple example: 50% chance to not show footer ad to registered users
    if (Math.random() > 0.5) {
      return null;
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-indigo-50 p-2 border-t mt-auto">
      <div className="max-w-7xl mx-auto">
        <GoogleAd 
          slot="0987654321" // Replace with your actual AdSense slot ID
          format="horizontal"
          className="w-full h-[90px] rounded-md overflow-hidden shadow-sm"
          style={{ minHeight: '90px' }}
        />
      </div>
    </div>
  );
};