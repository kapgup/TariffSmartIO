import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Country } from "@/lib/types";

export function TariffOverview() {
  const { data, isLoading, error } = useQuery<{ countries: Country[] }>({
    queryKey: ['/api/countries'],
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-900">
            Understanding the New Tariffs
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            The new US reciprocal tariffs will affect product prices differently based on country of origin and product category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Baseline Tariff Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mb-4">
              {/* Dollar Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="6" x2="12" y2="12"></line>
                <path d="M16 12H8"></path>
                <path d="M12 16v2"></path>
                <path d="M16 8h-1.5a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5H8"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Baseline Tariff</h3>
            <p className="text-neutral-600">A 10% tariff will apply to all imported goods starting April 5th, 2025, regardless of origin country.</p>
          </div>

          {/* Country-Specific Tariffs Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="w-14 h-14 bg-secondary/15 rounded-full flex items-center justify-center mb-4">
              {/* Flag Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Country-Specific Tariffs</h3>
            <p className="text-neutral-600">Additional "reciprocal" tariffs ranging from 10% to 54% will apply to specific countries starting April 9th, 2025.</p>
          </div>

          {/* Implementation Timeline Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="w-14 h-14 bg-yellow-500/15 rounded-full flex items-center justify-center mb-4">
              {/* Clock Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Implementation Timeline</h3>
            <p className="text-neutral-600">Tariffs begin April 5-9, 2025, but retail price changes may occur gradually as inventories are replaced.</p>
          </div>
        </div>

        <Card className="mt-12 overflow-hidden shadow">
          <CardHeader className="px-6 py-5 border-b border-neutral-200 bg-neutral-50">
            <h3 className="text-lg font-semibold text-neutral-900">Country-Specific Tariff Rates</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Country</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Base Tariff</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Reciprocal Tariff</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Total Rate</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Effective Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-12" /></td>
                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-12" /></td>
                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-12" /></td>
                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-28" /></td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-red-500">Error loading country data</td>
                    </tr>
                  ) : (
                    data?.countries.map((country) => (
                      <tr key={country.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                          {country.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {country.baseTariff}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {country.reciprocalTariff}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 font-medium">
                          {Number(country.baseTariff) + Number(country.reciprocalTariff)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {country.effectiveDate}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
