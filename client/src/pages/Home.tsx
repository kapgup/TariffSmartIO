import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TariffOverview } from "@/components/home/TariffOverview";
import { SignupCTA } from "@/components/shared/SignupCTA";
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
        <SignupCTA />
      </main>
      <Footer />
    </>
  );
}
