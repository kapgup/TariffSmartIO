import { useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { PreFooterAd } from "@/components/ads/PreFooterAd";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BASELINE_TARIFF_DATE, 
  CHINA_TARIFF_DATE, 
  OTHER_COUNTRIES_TARIFF_DATE,
  CHINA_RETAIL_PRICE_CHANGE_PERIOD,
  OTHER_COUNTRIES_RETAIL_PRICE_CHANGE_PERIOD
} from "@/lib/constants";
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
                    <div className="absolute left-5 top-0 bottom-0 w-1.5 bg-primary/30 rounded-full"></div>
                    
                    <div className="relative pl-12 mb-12">
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-2 border-white shadow-lg z-10"></div>
                      <div className="absolute left-5 top-1 h-[calc(100%+3rem)] w-1.5 bg-primary/30 rounded-full z-0"></div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{BASELINE_TARIFF_DATE}</h3>
                      <p className="text-neutral-600 mb-4">Baseline 10% tariff on all imports begins</p>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>All imported goods regardless of origin will see a 10% tariff</li>
                          <li>Initial price impact may be minimal as retailers absorb costs</li>
                          <li>Some retailers may begin marking up prices in anticipation</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="relative pl-12 mb-12">
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-indigo-600 border-2 border-white shadow-lg z-10"></div>
                      <div className="absolute left-5 top-1 h-[calc(100%+3rem)] w-1.5 bg-primary/30 rounded-full z-0"></div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{CHINA_TARIFF_DATE}</h3>
                      <p className="text-neutral-600 mb-4">China-specific reciprocal tariffs (up to 125%) go into effect</p>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>Products from China will see significant price increases</li>
                          <li>Tech products like smartphones, computers, and memory storage are exempt</li>
                          <li>Supply chains may begin to shift to lower-tariff countries</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="relative pl-12 mb-12">
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg z-10"></div>
                      <div className="absolute left-5 top-1 h-[calc(100%+3rem)] w-1.5 bg-primary/30 rounded-full z-0"></div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{OTHER_COUNTRIES_TARIFF_DATE}</h3>
                      <p className="text-neutral-600 mb-4">Reciprocal tariffs for all other countries go into effect</p>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>Different countries face different tariff rates based on their existing policies</li>
                          <li>Three-month delay from original implementation timeline</li>
                          <li>Price impacts will vary significantly by product category and origin</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="relative pl-12 mb-12">
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-600 border-2 border-white shadow-lg z-10"></div>
                      <div className="absolute left-5 top-1 h-[calc(100%+3rem)] w-1.5 bg-primary/30 rounded-full z-0"></div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{CHINA_RETAIL_PRICE_CHANGE_PERIOD}</h3>
                      <p className="text-neutral-600 mb-4">Expected retail price changes for Chinese products appear in stores</p>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>Full price impact of China tariffs will become visible to consumers</li>
                          <li>Retailers sell through existing inventory at older prices first</li>
                          <li>Some products may see shortages as companies adjust supply chains</li>
                          <li>Price increases will likely persist as long as tariffs remain in effect</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="relative pl-12">
                      <div className="absolute left-4 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-green-600 border-2 border-white shadow-lg z-10"></div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">{OTHER_COUNTRIES_RETAIL_PRICE_CHANGE_PERIOD}</h3>
                      <p className="text-neutral-600 mb-4">Expected retail price changes for products from other countries appear in stores</p>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-2">What This Means:</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                          <li>Price increases for non-Chinese products will be visible 90 days after tariffs begin</li>
                          <li>Holiday shopping season may be affected by these price changes</li>
                          <li>Retailers may offer promotions to offset some increases during peak shopping times</li>
                          <li>Supply chains will have had more time to adjust compared to Chinese goods</li>
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
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">Before April 2025</h3>
                    <ul className="list-disc list-inside text-neutral-600 pl-4 space-y-1">
                      <li>Consider purchasing high-value imported items from China you were already planning to buy</li>
                      <li>Stock up on non-perishable Chinese-made goods you regularly use</li>
                      <li>Remember that tech products like smartphones and computers are exempt from reciprocal tariffs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">April - June 2025</h3>
                    <ul className="list-disc list-inside text-neutral-600 pl-4 space-y-1">
                      <li>Expect price increases on Chinese products to begin appearing in stores</li>
                      <li>Consider purchasing products from other countries before July 8th tariff implementation</li>
                      <li>Look for alternatives to heavily-tariffed Chinese products</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">July - September 2025</h3>
                    <ul className="list-disc list-inside text-neutral-600 pl-4 space-y-1">
                      <li>Reciprocal tariffs for non-Chinese products go into effect on July 8th</li>
                      <li>Price impacts from these tariffs won't be immediately visible in stores</li>
                      <li>Good time to stock up on products from countries other than China</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">October 2025 and Beyond</h3>
                    <ul className="list-disc list-inside text-neutral-600 pl-4 space-y-1">
                      <li>Price increases for non-Chinese products will become visible in retail stores</li>
                      <li>Holiday shopping season may be affected by these price changes</li>
                      <li>Adjust your household budget for the long-term price landscape</li>
                      <li>Consider domestic products which won't be affected by the tariffs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <SignupCTA />
        <PreFooterAd />
      </main>
      <Footer />
    </>
  );
}
