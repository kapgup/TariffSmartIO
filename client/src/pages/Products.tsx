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
