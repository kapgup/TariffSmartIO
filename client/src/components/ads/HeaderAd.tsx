import { useAuth } from '@/hooks/useAuth';
import { GoogleAd } from './GoogleAd';

export const HeaderAd = () => {
  const { user } = useAuth();
  
  // Don't show ads to premium users
  if (user?.subscriptionTier === 'premium') {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-indigo-50 to-amber-50 p-2 border-b">
      <div className="max-w-7xl mx-auto">
        <GoogleAd 
          slot="1234567890" // Replace with your actual AdSense slot ID
          format="horizontal"
          className="w-full h-[90px] rounded-md overflow-hidden shadow-sm"
          style={{ minHeight: '90px' }}
        />
      </div>
    </div>
  );
};