import { GoogleAd } from './GoogleAd';
import { useAdsEnabled } from '@/hooks/useAdsEnabled';

export const InContentAd = () => {
  const adsEnabled = useAdsEnabled();

  if (!adsEnabled) {
    return null; // Don't show ads when disabled
  }

  return (
    <div className="my-8 rounded-lg overflow-hidden shadow-md bg-gradient-to-r from-indigo-50 to-amber-50 p-3">
      <div className="max-w-4xl mx-auto">
        <GoogleAd 
          slot="5678901234" // Replace with your actual ad slot ID
          className="w-full overflow-hidden rounded-md"
          format="fluid"
          layout="in-article"
          responsive={true}
        />
      </div>
    </div>
  );
};