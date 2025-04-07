import { AdComponent, AdSize } from "./AdComponent";
import { useAds } from "./AdProvider";

// Footer banner ad that spans the full width of the page
export function FooterAd() {
  const { showAds, adLevel } = useAds();
  
  if (!showAds) return null;
  
  return (
    <div className="w-full py-4 bg-gray-50">
      <div className="container mx-auto flex justify-center">
        <AdComponent 
          size="horizontal" 
          className="mx-auto" 
          slot="footer-slot" 
        />
      </div>
    </div>
  );
}

// Sidebar ad for wider screens
export function SidebarAd() {
  const { showAds, adLevel } = useAds();
  
  if (!showAds || adLevel === "minimal") return null;
  
  return (
    <div className="hidden lg:block">
      <AdComponent 
        size="skyscraper" 
        className="sticky top-20" 
        slot="sidebar-slot" 
      />
    </div>
  );
}

// In-content ad that appears between sections
export function InContentAd({ className = "" }) {
  const { showAds, adLevel } = useAds();
  
  if (!showAds || adLevel === "minimal") return null;
  
  return (
    <div className={`my-8 w-full flex justify-center ${className}`}>
      <AdComponent 
        size="square" 
        slot="in-content-slot" 
      />
    </div>
  );
}

// Ad that appears after a user completes a calculation
export function PostCalculationAd() {
  const { showAds } = useAds();
  
  if (!showAds) return null;
  
  return (
    <div className="mt-6 mb-2 w-full">
      <AdComponent 
        size="horizontal" 
        slot="post-calculation-slot" 
      />
    </div>
  );
}

// Responsive ad that adapts to container size
export function ResponsiveAd({ className = "", slot = "responsive-slot" }) {
  const { showAds, adLevel } = useAds();
  
  if (!showAds || adLevel === "minimal") return null;
  
  return (
    <div className={`w-full ${className}`}>
      <AdComponent 
        size="responsive" 
        slot={slot} 
      />
    </div>
  );
}