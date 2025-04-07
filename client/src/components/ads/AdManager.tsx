import { useEffect } from 'react';
import { HeaderAd } from './HeaderAd';
import { FooterAd } from './FooterAd';
import { useAuth } from '@/hooks/useAuth';

export const AdManager = () => {
  const { user } = useAuth();
  const isPremium = user?.subscriptionTier === 'premium';

  // Load Google AdSense script
  useEffect(() => {
    if (isPremium) return; // Don't load AdSense for premium users
    
    const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
    if (!clientId) {
      console.warn('AdSense Client ID not found. Ads will not be displayed.');
      return;
    }

    // Check if script is already added
    if (document.querySelector(`script[src*="adsbygoogle"]`)) return;

    // Load AdSense script
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      try {
        const scriptElement = document.querySelector(`script[src*="adsbygoogle"]`);
        if (scriptElement) {
          document.head.removeChild(scriptElement);
        }
      } catch (e) {
        console.error('Error removing AdSense script:', e);
      }
    };
  }, [isPremium]);

  // Don't render anything for premium users
  if (isPremium) return null;

  return (
    <>
      <HeaderAd />
      <FooterAd />
    </>
  );
};