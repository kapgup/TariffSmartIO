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
          <div className="bg-neutral-100 rounded-lg p-6">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Baseline Tariff</h3>
            <p className="text-neutral-600">A 10% tariff will apply to all imported goods starting April 5th, 2025, regardless of origin country.</p>
          </div>

          <div className="bg-neutral-100 rounded-lg p-6">
            <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Country-Specific Tariffs</h3>
            <p className="text-neutral-600">Additional "reciprocal" tariffs ranging from 10% to 54% will apply to specific countries starting April 9th, 2025.</p>
          </div>

          <div className="bg-neutral-100 rounded-lg p-6">
            <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Implementation Timeline</h3>
            <p className="text-neutral-600">Tariffs begin April 5-9, 2025, but retail price changes may occur gradually as inventories are replaced.</p>
          </div>
        </div>

        <Card className="mt-12 overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-neutral-200">
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
