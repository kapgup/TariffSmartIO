import { GoogleAd } from './GoogleAd';
import { useAuth } from '@/hooks/useAuth';

export const FooterAd = () => {
  const { user } = useAuth();
  const isPremiumUser = user?.subscriptionTier === 'premium';

  if (isPremiumUser) {
    return null; // Don't show ads to premium users
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-indigo-50 p-2 border-t">
      <div className="max-w-7xl mx-auto">
        <GoogleAd 
          slot="0987654321" // Replace with your actual ad slot ID
          className="w-full overflow-hidden rounded-md shadow-sm"
          format="horizontal"
          responsive={true}
        />
      </div>
    </div>
  );
};