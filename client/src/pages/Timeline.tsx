import { useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { Card, CardContent } from "@/components/ui/card";
import { BASELINE_TARIFF_DATE, RECIPROCAL_TARIFF_DATE, RETAIL_PRICE_CHANGE_PERIOD } from "@/lib/constants";
import { pageView } from "@/lib/analytics";

export default function Timeline() {
  useEffect(() => {
    pageView("/timeline");
  }, []);

  return (
    <>
      <main className="flex-1">
        <div className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
              Tariff Implementation Timeline
            </h1>
            <p className="mt-4 text-lg text-neutral-100 max-w-3xl mx-auto">
              Understand when tariffs will go into effect and how they might impact retail prices.
            </p>
          </div>
        </div>
        
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Card className="mb-12">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Key Implementation Dates</h2>
                  
                  <div className="relative">
                    {/* Main vertical line - improved with gradient and shadow */}
                    <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 via-secondary/60 to-warning/60 h-full rounded-full shadow-md"></div>
                    
                    <div className="relative pl-12 mb-12">
                      {/* Circle marker - updated with shadow and glow effect */}
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-white z-10 shadow-[0_0_10px_rgba(0,0,0,0.2)] ring-2 ring-primary/30"></div>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{BASELINE_TARIFF_DATE}</h3>
                      <p className="text-neutral-600 mb-4">Baseline 10% tariff on all imports begins</p>
                      <div className="bg-neutral-50 p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>All imported goods regardless of origin will see a 10% tariff</li>
                          <li>Initial price impact may be minimal as retailers absorb costs</li>
                          <li>Some retailers may begin marking up prices in anticipation</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="relative pl-12 mb-12">
                      {/* Circle marker - updated with brighter color and shadow */}
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-indigo-500 border-4 border-white z-10 shadow-[0_0_10px_rgba(0,0,0,0.2)] ring-2 ring-indigo-300"></div>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{RECIPROCAL_TARIFF_DATE}</h3>
                      <p className="text-neutral-600 mb-4">Country-specific "reciprocal" tariffs (10-54%) go into effect</p>
                      <div className="bg-neutral-50 p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>Different countries face different tariff rates based on their existing policies</li>
                          <li>Supply chains may begin to shift to lower-tariff countries</li>
                          <li>Price impacts will vary significantly by product category and origin</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="relative pl-12">
                      {/* Circle marker - updated with brighter color and shadow */}
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-500 border-4 border-white z-10 shadow-[0_0_10px_rgba(0,0,0,0.2)] ring-2 ring-amber-300"></div>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{RETAIL_PRICE_CHANGE_PERIOD}</h3>
                      <p className="text-neutral-600 mb-4">Expected retail price changes appear in stores</p>
                      <div className="bg-neutral-50 p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>Full price impact will become visible to consumers</li>
                          <li>Retailers sell through existing inventory at older prices first</li>
                          <li>Some products may see shortages as companies adjust supply chains</li>
                          <li>Price increases will likely persist as long as tariffs remain in effect</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">How to Prepare</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">Before April 5th, 2025</h3>
                    <ul className="list-disc list-inside text-neutral-600 pl-4 space-y-1">
                      <li>Consider purchasing high-value imported items you were already planning to buy</li>
                      <li>Stock up on non-perishable imported goods you regularly use</li>
                      <li>Review your budget to identify areas that might be affected by price increases</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">April - May 2025</h3>
                    <ul className="list-disc list-inside text-neutral-600 pl-4 space-y-1">
                      <li>Compare prices across retailers as they may implement increases at different rates</li>
                      <li>Look for alternatives to heavily-tariffed products</li>
                      <li>Consider domestic products which won't be affected by the tariffs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">Beyond May 2025</h3>
                    <ul className="list-disc list-inside text-neutral-600 pl-4 space-y-1">
                      <li>Monitor for policy changes that might reduce or remove tariffs</li>
                      <li>Adjust your household budget to accommodate the new price landscape</li>
                      <li>Consider longer-term substitutions for products that remain significantly more expensive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <SignupCTA />
      </main>
      <Footer />
    </>
  );
}
