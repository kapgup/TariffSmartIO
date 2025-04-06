import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASELINE_TARIFF_DATE, RECIPROCAL_TARIFF_DATE, RETAIL_PRICE_CHANGE_PERIOD } from "@/lib/constants";

export function Hero() {
  return (
    <section className="bg-primary py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
              Understand How New Tariffs Will Impact Your Budget
            </h1>
            <p className="mt-4 text-lg text-neutral-100">
              TariffSmart helps you navigate the upcoming US reciprocal tariffs and understand how they'll affect product prices and your purchasing power.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:gap-4">
              <Link href="/calculator">
                <Button className="mb-4 sm:mb-0 w-full sm:w-auto bg-white text-primary hover:bg-neutral-100">
                  Calculate Impact
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="mb-4 sm:mb-0 w-full sm:w-auto border-white text-white hover:bg-primary-dark hover:text-primary">
                  Browse Products
                </Button>
              </Link>
              <Link href="/countries">
                <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-primary-dark hover:text-primary">
                  View Countries
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <Card className="bg-white rounded-lg shadow-lg overflow-hidden">
              <CardContent className="px-6 py-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-neutral-900">Tariff Implementation Timeline</h3>
                  <span className="text-sm font-medium text-secondary">April 2025</span>
                </div>
                
                <div className="mt-6 relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
                  <div className="relative pl-8">
                    <div className="mb-8">
                      <div className="absolute left-4 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-4 border-white"></div>
                      <h4 className="text-base font-medium text-neutral-900">{BASELINE_TARIFF_DATE}</h4>
                      <p className="mt-1 text-sm text-neutral-600">Baseline 10% tariff on all imports begins</p>
                    </div>
                    
                    <div className="mb-8">
                      <div className="absolute left-4 -translate-x-1/2 w-3 h-3 rounded-full bg-secondary border-4 border-white"></div>
                      <h4 className="text-base font-medium text-neutral-900">{RECIPROCAL_TARIFF_DATE}</h4>
                      <p className="mt-1 text-sm text-neutral-600">Country-specific reciprocal tariffs (10-54%) go into effect</p>
                    </div>
                    
                    <div>
                      <div className="absolute left-4 -translate-x-1/2 w-3 h-3 rounded-full bg-warning border-4 border-white"></div>
                      <h4 className="text-base font-medium text-neutral-900">{RETAIL_PRICE_CHANGE_PERIOD}</h4>
                      <p className="mt-1 text-sm text-neutral-600">Expected retail price changes appear in stores</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
