import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TariffOverview } from "@/components/home/TariffOverview";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { useEffect } from "react";
import { pageView } from "@/lib/analytics";
import { ContentWithAds } from "@/components/layout/ContentWithAds";
import { InContentAd, ResponsiveAd } from "@/components/ads";

export default function Home() {
  useEffect(() => {
    pageView("/");
  }, []);

  return (
    <>
      <main className="flex-1">
        <Hero />
        <ContentWithAds>
          <TariffOverview />
          <InContentAd className="my-8" />
          <div className="mt-6 mb-10">
            <ResponsiveAd slot="homepage-content-ad" />
          </div>
          <SignupCTA />
        </ContentWithAds>
      </main>
      <Footer />
    </>
  );
}
