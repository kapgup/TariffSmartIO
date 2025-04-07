import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TariffOverview } from "@/components/home/TariffOverview";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { useEffect } from "react";
import { pageView } from "@/lib/analytics";
import { ResponsiveAd } from "@/components/ads";

export default function Home() {
  useEffect(() => {
    pageView("/");
  }, []);

  return (
    <>
      <main className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TariffOverview />
          <div className="mt-6 mb-10" style={{ height: "125px" }}> {/* Reduced height by 50% */}
            <ResponsiveAd slot="homepage-content-ad" />
          </div>
          <SignupCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
