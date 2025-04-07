import { ReactNode } from "react";
import { SidebarAd, FooterAd, useAds } from "@/components/ads";

interface ContentWithAdsProps {
  children: ReactNode;
  sidebar?: boolean;
  footer?: boolean;
}

// Layout component that incorporates ads in standard positions
export function ContentWithAds({ 
  children, 
  sidebar = true, 
  footer = true 
}: ContentWithAdsProps) {
  const { showAds } = useAds();
  
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container py-6 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1">
            {children}
          </div>
          
          {/* Sidebar ad (on larger screens) */}
          {showAds && sidebar && (
            <div className="w-[160px] flex-shrink-0">
              <SidebarAd />
            </div>
          )}
        </div>
      </div>
      
      {/* Footer ad */}
      {showAds && footer && <FooterAd />}
    </div>
  );
}