import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TariffOverview } from "@/components/home/TariffOverview";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { PreFooterAd } from "@/components/ads/PreFooterAd";
import { useEffect } from "react";
import { pageView } from "@/lib/analytics";

export default function Home() {
  useEffect(() => {
    pageView("/");
  }, []);

  return (
    <>
      <main className="flex-1">
        <Hero />
        <TariffOverview />
        <div className="container mx-auto my-8 p-6 bg-blue-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Try Our New Education Platform</h2>
          <p className="mb-4">Discover our comprehensive educational resources on international trade and tariffs.</p>
          <a href="/v2" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Visit Education Platform (v2)
          </a>
        </div>
        <SignupCTA />
        <PreFooterAd />
      </main>
      <Footer />
    </>
  );
}
