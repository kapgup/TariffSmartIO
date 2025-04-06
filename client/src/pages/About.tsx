import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SignupCTA } from "@/components/shared/SignupCTA";
import { Card, CardContent } from "@/components/ui/card";
import { pageView } from "@/lib/analytics";

export default function About() {
  useEffect(() => {
    pageView("/about");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
              About TariffSmart
            </h1>
            <p className="mt-4 text-lg text-neutral-100 max-w-3xl mx-auto">
              Helping consumers navigate the impact of new tariffs on their purchasing power.
            </p>
          </div>
        </div>
        
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <h2 id="about">Our Mission</h2>
                <p>
                  TariffSmart was created to empower consumers with clear, actionable information about how the 2025 US 
                  reciprocal tariffs will affect their household budgets and purchasing decisions.
                </p>
                <p>
                  Our team of economists, data analysts, and consumer advocates work together to translate complex 
                  trade policies into practical insights that help everyday people make informed financial choices.
                </p>
                
                <h2 id="data-sources">Our Data Sources</h2>
                <p>
                  We gather information from multiple authoritative sources to provide accurate estimates of tariff impacts:
                </p>
                <ul>
                  <li>US International Trade Commission's Harmonized Tariff Schedule</li>
                  <li>United States Trade Representative (USTR) published tariff lists</li>
                  <li>Bureau of Labor Statistics Consumer Price Index (CPI) data</li>
                  <li>Industry association reports and economic research publications</li>
                  <li>Commercial price tracking across major retailers</li>
                </ul>
                <p>
                  Our data is updated regularly to reflect the most current tariff policies and market conditions.
                </p>
                
                <h2 id="help">Help Center</h2>
                <div className="not-prose">
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">What are reciprocal tariffs?</h4>
                          <p className="text-neutral-600 text-sm mt-1">
                            Reciprocal tariffs are import taxes designed to match those imposed by other countries on US goods. 
                            The goal is to create trade parity by implementing similar barriers that US exporters face abroad.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">How accurate are your price increase estimates?</h4>
                          <p className="text-neutral-600 text-sm mt-1">
                            Our estimates are based on economic models that factor in the full tariff rate, historical 
                            price elasticity, and supply chain alternatives. Actual increases may vary as retailers, 
                            manufacturers, and distributors may absorb some costs or find alternative suppliers.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">Will all products in a category be affected equally?</h4>
                          <p className="text-neutral-600 text-sm mt-1">
                            No. Products within the same category may see different price impacts based on their specific 
                            country of origin, the complexity of their supply chain, and the availability of alternative 
                            manufacturing locations.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">How can I find alternatives to affected products?</h4>
                          <p className="text-neutral-600 text-sm mt-1">
                            Our product database includes information on comparable products with lower expected price 
                            increases, including domestically manufactured alternatives where available.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <h2 id="contact">Contact Us</h2>
                <p>
                  Have questions, feedback, or need personalized assistance? Our team is here to help:
                </p>
                <ul>
                  <li>Email: support@tariffsmart.com</li>
                  <li>Phone: (555) 123-4567</li>
                  <li>Business Hours: Monday-Friday, 9am-5pm ET</li>
                </ul>
                
                <h2 id="privacy">Privacy Policy</h2>
                <p>
                  TariffSmart is committed to protecting your privacy. We collect minimal personal information and use it 
                  only to provide and improve our services. We never sell your data to third parties.
                </p>
                <p>
                  Our complete privacy policy details what information we collect, how we use it, and your rights regarding your data.
                </p>
                
                <h2 id="terms">Terms of Service</h2>
                <p>
                  By using TariffSmart, you agree to our Terms of Service, which outline the rules, guidelines, and 
                  limitations of your use of our platform. These terms are designed to ensure a positive, helpful 
                  experience for all users while protecting our intellectual property and services.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <SignupCTA />
      </main>
      <Footer />
    </div>
  );
}
