import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

// Ad display level based on user subscription tier
type AdLevel = "none" | "minimal" | "standard";

// Context for managing ad visibility throughout the application
interface AdContextType {
  adLevel: AdLevel;
  showAds: boolean;
  initialLoadComplete: boolean;
}

const AdContext = createContext<AdContextType>({
  adLevel: "standard",
  showAds: true,
  initialLoadComplete: false,
});

export const useAds = () => useContext(AdContext);

interface AdProviderProps {
  children: ReactNode;
}

export function AdProvider({ children }: AdProviderProps) {
  const { user, isLoading } = useAuth();
  const [adLevel, setAdLevel] = useState<AdLevel>("standard");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Determine ad level based on user subscription
  useEffect(() => {
    if (isLoading) return;
    
    if (!user || !user.isAuthenticated) {
      setAdLevel("standard");
    } else if (user.subscriptionTier === "premium") {
      setAdLevel("none");
    } else {
      setAdLevel("minimal");
    }
    
    setInitialLoadComplete(true);
  }, [user, isLoading]);

  // This indicates if ads should be displayed at all
  const showAds = adLevel !== "none";

  return (
    <AdContext.Provider value={{ adLevel, showAds, initialLoadComplete }}>
      {children}
    </AdContext.Provider>
  );
}