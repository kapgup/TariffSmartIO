import { HeaderAd } from './HeaderAd';
import { FooterAd } from './FooterAd';
import { useAuth } from '@/hooks/useAuth';
import { useAdsEnabled } from '@/hooks/useAdsEnabled';

interface AdManagerProps {
  showHeader?: boolean;
  showFooter?: boolean;
}

export const AdManager = ({ 
  showHeader = true, 
  showFooter = true 
}: AdManagerProps) => {
  const { user } = useAuth();
  const isPremiumUser = user?.subscriptionTier === 'premium';
  const adsEnabled = useAdsEnabled();

  // Don't show ads to premium users or when ads are disabled globally
  if (isPremiumUser || !adsEnabled) {
    return null;
  }

  return (
    <>
      {showHeader && (
        <div className="w-full bg-gradient-to-r from-indigo-50 to-amber-50 p-2 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="w-full h-[90px] rounded-md overflow-hidden shadow-sm bg-white/60 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="font-semibold">Advertisement</p>
                <p className="text-xs">Top Banner Ad (728×90)</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFooter && (
        <div className="w-full bg-gradient-to-r from-amber-50 to-indigo-50 p-2 border-t mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className="w-full h-[90px] rounded-md overflow-hidden shadow-sm bg-white/60 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="font-semibold">Advertisement</p>
                <p className="text-xs">Bottom Banner Ad (728×90)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};