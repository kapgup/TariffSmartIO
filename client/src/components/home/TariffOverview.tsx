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
              {/* Simple Dollar Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                <path d="M11.25 7.847C11.25 9.066 10.2425 10.0625 9 10.0625C7.7575 10.0625 6.75 9.066 6.75 7.847C6.75 6.629 7.7575 5.625 9 5.625C10.2425 5.625 11.25 6.629 11.25 7.847Z" />
                <path d="M15 13.0595C15 14.278 16.0075 15.282 17.25 15.282C18.4925 15.282 19.5 14.278 19.5 13.0595C19.5 11.841 18.4925 10.845 17.25 10.845C16.0075 10.845 15 11.841 15 13.0595Z" />
                <path d="M22.5 12.75C22.5 18.2775 17.9925 22.5 12.75 22.5C7.5075 22.5 3 18.2775 3 12.75C3 7.2225 7.5075 3 12.75 3C17.9925 3 22.5 7.2225 22.5 12.75ZM13.5 7.875C13.5 7.05 12.825 6.375 12 6.375H8.25C7.425 6.375 6.75 7.05 6.75 7.875C6.75 8.7 7.425 9.375 8.25 9.375H12C12.825 9.375 13.5 8.7 13.5 7.875ZM12 12.375H15.75C16.575 12.375 17.25 13.05 17.25 13.875C17.25 14.7 16.575 15.375 15.75 15.375H12C11.175 15.375 10.5 14.7 10.5 13.875C10.5 13.05 11.175 12.375 12 12.375ZM6 13.875C6 14.7 5.325 15.375 4.5 15.375C3.675 15.375 3 14.7 3 13.875C3 13.05 3.675 12.375 4.5 12.375C5.325 12.375 6 13.05 6 13.875ZM21 7.875C21 8.7 20.325 9.375 19.5 9.375C18.675 9.375 18 8.7 18 7.875C18 7.05 18.675 6.375 19.5 6.375C20.325 6.375 21 7.05 21 7.875Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Baseline Tariff</h3>
            <p className="text-neutral-600">A 10% tariff will apply to all imported goods starting April 5th, 2025, regardless of origin country.</p>
          </div>

          {/* Country-Specific Tariffs Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="w-14 h-14 bg-secondary/15 rounded-full flex items-center justify-center mb-4">
              {/* World Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-secondary">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Country-Specific Tariffs</h3>
            <p className="text-neutral-600">Additional "reciprocal" tariffs ranging from 10% to 54% will apply to specific countries starting April 9th, 2025.</p>
          </div>

          {/* Implementation Timeline Card */}
          <div className="bg-neutral-100 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
            <div className="w-14 h-14 bg-yellow-500/15 rounded-full flex items-center justify-center mb-4">
              {/* Calendar Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-600">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />
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
