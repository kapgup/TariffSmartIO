import { useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { ProductBrowser } from "@/components/products/ProductBrowser";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { PreFooterAd } from "@/components/ads/PreFooterAd";
import { pageView } from "@/lib/analytics";

export default function Products() {
  useEffect(() => {
    pageView("/products");
  }, []);

  return (
    <>
      <main className="flex-1">
        <div className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
              Browse Products by Category
            </h1>
            <p className="mt-4 text-lg text-neutral-100 max-w-3xl mx-auto">
              Explore how different products will be affected by the new tariffs and find alternative options.
            </p>
            <div className="mt-5 bg-white/10 p-4 rounded-md text-left max-w-3xl mx-auto">
              <h3 className="text-white text-lg font-medium mb-2">Exempt Products</h3>
              <p className="text-neutral-100 mb-2">The following tech products are exempt from reciprocal tariffs:</p>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 list-disc list-inside text-neutral-100">
                <li>Smartphones</li>
                <li>Computers</li>
                <li>Chips</li>
                <li>Solar cells</li>
                <li>TV displays</li>
                <li>Flash drives</li>
                <li>Memory cards</li>
                <li>Solid-state drives</li>
              </ul>
              <p className="mt-3 text-sm text-neutral-200 italic">Rates and exemptions are changing frequently. Check authoritative sources before making decisions based on this information.</p>
            </div>
          </div>
        </div>
        
        <ProductBrowser />
        <SignupCTA />
        <PreFooterAd />
      </main>
      <Footer />
    </>
  );
}
