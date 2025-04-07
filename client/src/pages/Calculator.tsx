import { useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { TariffCalculator } from "@/components/calculator/TariffCalculator";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { pageView } from "@/lib/analytics";

export default function Calculator() {
  useEffect(() => {
    pageView("/calculator");
  }, []);

  return (
    <>
      <main className="flex-1">
        <div className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
              Calculate Your Tariff Impact
            </h1>
            <p className="mt-4 text-lg text-neutral-100 max-w-3xl mx-auto">
              Understand how the new US reciprocal tariffs will affect your budget and shopping habits.
            </p>
          </div>
        </div>
        
        <TariffCalculator />
        <SignupCTA />
      </main>
      <Footer />
    </>
  );
}
