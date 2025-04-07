import { GoogleAd } from './GoogleAd';
import { useAdsEnabled } from '@/hooks/useAdsEnabled';

export function PreFooterAd() {
  const adsEnabled = useAdsEnabled();

  if (!adsEnabled) {
    return null; // Don't show ads when disabled
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-indigo-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[90px] rounded-lg overflow-hidden shadow-md bg-white/80 flex items-center justify-center">
          <GoogleAd 
            slot="0987654321" // Replace with your actual ad slot ID
            className="w-full overflow-hidden"
            format="horizontal"
            responsive={true}
          />
        </div>
      </div>
    </div>
  );
}