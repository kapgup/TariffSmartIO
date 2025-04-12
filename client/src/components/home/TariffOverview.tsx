import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Country } from "@/lib/types";

export function TariffOverview() {
  const { data, isLoading, error } = useQuery<{ countries: Country[] }>({
    queryKey: ['/api/countries'],
  });
  
  // Sort countries alphabetically by name and ensure we show all of them
  const sortedCountries = data?.countries ? [...data.countries].sort((a, b) => 
    a.name.localeCompare(b.name)
  ) : [];
  
  // For debugging
  console.log(`Total countries in database: ${sortedCountries.length}`);

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
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 max-w-3xl mx-auto">
            <p><strong>Disclaimer:</strong> Tariff rates are changing frequently. Please check authoritative sources before making any decisions involving the tariff rates shown here.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Baseline Tariff Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💵</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Baseline Tariff</h3>
            <p className="text-neutral-600">A 10% tariff will apply to all imported goods starting April 5th, 2025, regardless of origin country.</p>
          </div>

          {/* Country-Specific Tariffs Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-indigo-300/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌎</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Country-Specific Tariffs</h3>
            <p className="text-neutral-600">Additional "reciprocal" tariffs ranging from 10% to 125% will apply to specific countries. Most updated to start July 8, 2025.</p>
          </div>

          {/* Implementation Timeline Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Implementation Timeline</h3>
            <p className="text-neutral-600">China tariffs start April 9th, 2025. All other countries now start July 8th, 2025. Retail price changes may occur gradually.</p>
          </div>
          
          {/* Exempt Products Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Exempt Products</h3>
            <p className="text-neutral-600">Certain tech products are exempt from reciprocal tariffs: smartphones, computers, chips, solar cells, displays, and storage devices.</p>
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
                    sortedCountries.map((country) => (
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
