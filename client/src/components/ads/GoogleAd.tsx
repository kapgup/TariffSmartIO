import { useEffect, useRef } from 'react';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const GoogleAd = ({
  slot,
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
}: GoogleAdProps) => {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  
  useEffect(() => {
    try {
      if (clientId) {
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  if (!clientId) {
    console.warn('AdSense Client ID is not configured');
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

// Add TypeScript declaration for adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}