import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TariffOverview } from "@/components/home/TariffOverview";
import { TariffCalculator } from "@/components/calculator/TariffCalculator";
import { ProductBrowser } from "@/components/products/ProductBrowser";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { useEffect } from "react";
import { pageView } from "@/lib/analytics";

export default function Home() {
  useEffect(() => {
    pageView("/");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <TariffOverview />
        <TariffCalculator />
        <ProductBrowser />
        <SignupCTA />
      </main>
      <Footer />
    </div>
  );
}
