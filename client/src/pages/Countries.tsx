import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Country } from "@/lib/types";
import { Footer } from "@/components/layout/Footer";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { PreFooterAd } from "@/components/ads/PreFooterAd";
import { CountryBrowser } from "@/components/countries/CountryBrowser";
import { pageView } from "@/lib/analytics";

export default function Countries() {
  useEffect(() => {
    pageView("/countries");
  }, []);

  const { data, isLoading, error } = useQuery<{ countries: Country[] }>({
    queryKey: ["/api/countries"],
  });

  return (
    <>
      <main className="flex-1">
        <section className="container px-4 py-12 md:py-16 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Country Tariff Rates</h1>
            <p className="text-lg text-muted-foreground">
              Browse and compare tariff rates by country to understand how reciprocal tariffs
              will affect imported goods from different regions.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-lg text-red-500">
                There was an error loading country data. Please try again later.
              </p>
            </div>
          ) : (
            <CountryBrowser countries={data?.countries || []} />
          )}
        </section>

        <SignupCTA />
        <PreFooterAd />
      </main>
      <Footer />
    </>
  );
}