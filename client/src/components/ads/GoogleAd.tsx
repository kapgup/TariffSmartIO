import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface GoogleAdProps {
  className?: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  layout?: string;
}

export const GoogleAd = ({ className, slot, format = 'auto', responsive = true, style, layout = 'in-article' }: GoogleAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Don't show ads to premium users
  const isPremiumUser = user?.subscriptionTier === 'premium';

  useEffect(() => {
    // Skip ad loading for premium users
    if (isPremiumUser) return;

    // Handle ads after the component mounts
    const adsbygoogle = (window as any).adsbygoogle || [];
    
    try {
      if (adRef.current && adsbygoogle) {
        adsbygoogle.push({});
        console.log('Ad pushed to queue', { slot });
      }
    } catch (error) {
      console.error('Failed to load ad', error);
    }
    
    // Cleanup function
    return () => {
      // Optional: Add cleanup if needed
    };
  }, [slot, isPremiumUser]);

  if (isPremiumUser) {
    return null; // Don't render anything for premium users
  }

  return (
    <div className={className} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-ad-layout={layout}
      />
    </div>
  );
};