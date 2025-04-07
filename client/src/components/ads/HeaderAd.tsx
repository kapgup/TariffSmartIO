import { GoogleAd } from './GoogleAd';
import { useAuth } from '@/hooks/useAuth';

export const HeaderAd = () => {
  const { user } = useAuth();
  const isPremiumUser = user?.subscriptionTier === 'premium';

  if (isPremiumUser) {
    return null; // Don't show ads to premium users
  }

  return (
    <div className="w-full bg-gradient-to-r from-indigo-50 to-amber-50 p-2 border-b">
      <div className="max-w-7xl mx-auto">
        <GoogleAd 
          slot="1234567890" // Replace with your actual ad slot ID
          className="w-full overflow-hidden rounded-md shadow-sm"
          format="horizontal"
          responsive={true}
        />
      </div>
    </div>
  );
};