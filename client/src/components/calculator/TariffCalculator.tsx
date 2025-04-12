import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  trackCalculation, 
  trackFormSubmission, 
  trackFormFieldInteraction, 
  trackDropdownSelection, 
  trackButtonClick 
} from "@/lib/analytics";
import { useFeatureFlag } from "@/lib/featureFlags";
import { CalculationSummary, Country } from "@/lib/types";
import { Link } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Form validation schema
const calculatorSchema = z.object({
  items: z.array(z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.coerce.number().min(0, "Amount must be 0 or greater"),
    country: z.string().min(1, "Country is required"),
  })).min(1, "Add at least one item"),
});

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

export function TariffCalculator() {
  const { toast } = useToast();
  const [results, setResults] = useState<CalculationSummary | null>(null);
  const emailAlertsEnabled = useFeatureFlag('emailAlerts', false);
  
  // Fetch countries for the dropdown
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery<{ countries: Country[] }>({
    queryKey: ['/api/countries'],
  });

  // Setup form
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      items: [
        { category: "Electronics", amount: 0, country: "China" },
        { category: "Clothing & Apparel", amount: 0, country: "Vietnam" },
        { category: "Furniture & Home Goods", amount: 0, country: "China" },
        { category: "Imported Food & Beverages", amount: 0, country: "Mexico" },
        { category: "Automotive & Parts", amount: 0, country: "Japan" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Calculate tariff impact mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CalculatorFormValues) => {
      // apiRequest already returns the parsed JSON data
      return await apiRequest("POST", "/api/calculate-tariff-impact", data);
    },
    onSuccess: (data: CalculationSummary) => {
      setResults(data);
      trackCalculation(data.totalSpending, data.totalIncrease);
    },
    onError: (error) => {
      toast({
        title: "Calculation Error",
        description: error.message || "Failed to calculate tariff impact",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: CalculatorFormValues) => {
    // Filter out zero amount items
    const filteredItems = data.items.filter(item => item.amount > 0);
    
    if (filteredItems.length === 0) {
      toast({
        title: "No items entered",
        description: "Please enter at least one item with an amount greater than zero",
        variant: "destructive",
      });
      
      // Track unsuccessful form submission
      trackFormSubmission('TariffCalculator', false, 'NoItemsEntered');
      return;
    }
    
    // Track successful form submission
    trackFormSubmission('TariffCalculator', true);
    mutate({ items: filteredItems });
  };

  // Prepare chart data
  const getChartData = () => {
    if (!results) return [];
    
    return results.calculations.map(calc => ({
      name: calc.category.split(" ")[0], // Just take the first word to keep labels short
      amount: parseFloat(calc.increase),
    }));
  };

  // Get calculator feature flag
  const calculatorEnabled = useFeatureFlag('calculator', true);

  return (
    <section id="calculator" className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-900">
            Calculate Your Tariff Impact
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            Enter your typical monthly purchases to see how the new tariffs might affect your household budget.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 max-w-3xl mx-auto">
            <p><strong>Disclaimer:</strong> Calculations are illustrative and do not take into account category-specific tariffs, product exclusions, or 'de minimis' requirements. Tariff rates are changing frequently. Please check authoritative sources before making any decisions involving the tariff rates shown here.</p>
            <p className="mt-2"><strong>Exempt Products:</strong> Smartphones, computers, chips, solar cells, flat-panel TV displays, flash drives, memory cards, and solid-state drives are exempt from reciprocal tariffs.</p>
          </div>
        </div>

        {calculatorEnabled ? (
          <Card className="overflow-hidden shadow-md">
            <div className="md:grid md:grid-cols-2">
              <div className="p-6 bg-primary text-white md:rounded-l-lg">
                <h3 className="text-xl font-semibold mb-6">Input Your Purchases</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="space-y-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">{field.value}</FormLabel>
                              <div className="flex items-center space-x-3">
                                <div className="flex-grow">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="Monthly spend ($)"
                                      className="w-full py-2 px-3 border border-primary-light rounded-md bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60"
                                      {...form.register(`items.${index}.amount`, { 
                                        valueAsNumber: true,
                                        onChange: (e) => {
                                          trackFormFieldInteraction('TariffCalculator', `${field.value}Amount`, 'change');
                                        }
                                      })}
                                      onFocus={() => trackFormFieldInteraction('TariffCalculator', `${field.value}Amount`, 'focus')}
                                      onBlur={() => trackFormFieldInteraction('TariffCalculator', `${field.value}Amount`, 'blur')}
                                    />
                                  </FormControl>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`items.${index}.country`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select 
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          trackDropdownSelection('CountrySelect', value, 'TariffCalculator');
                                        }} 
                                        defaultValue={field.value}
                                        disabled={isLoadingCountries}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="py-2 px-3 border border-primary-light rounded-md bg-white bg-opacity-10 text-white min-w-[120px]">
                                            <SelectValue placeholder="Select a country" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {isLoadingCountries ? (
                                            <SelectItem value="loading">Loading...</SelectItem>
                                          ) : (
                                            countriesData?.countries
                                              .sort((a, b) => a.name.localeCompare(b.name))
                                              .map((country) => (
                                                <SelectItem key={country.id} value={country.name}>
                                                  {country.name}
                                                </SelectItem>
                                              ))
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormMessage className="text-white text-opacity-80" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    <div className="mt-6">
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-primary py-2 px-4 rounded-md font-medium hover:bg-neutral-100" 
                        disabled={isPending}
                        onClick={() => trackButtonClick('CalculateImpact', 'TariffCalculator')}
                      >
                        {isPending ? "Calculating..." : "Calculate Impact"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">Your Tariff Impact</h3>
                
                {isPending ? (
                  <div className="space-y-6">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : results ? (
                  <div>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-600">Estimated Monthly Increase</span>
                        <span className="text-lg font-bold text-primary">${results.totalIncrease}</span>
                      </div>
                      <Progress value={parseFloat(results.percentageIncrease)} className="h-2.5 bg-neutral-200" />
                      <p className="mt-2 text-sm text-neutral-500">
                        Based on your monthly imports spending of ${results.totalSpending.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-neutral-900 mb-3">Breakdown by Category</h4>
                      <div className="space-y-3">
                        {results.calculations.map((calc, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-neutral-600">{calc.category} ({calc.country})</span>
                            <span className="font-medium text-neutral-800">+${calc.increase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-64 w-full">
                      <h4 className="font-medium text-neutral-700 mb-2">Impact by Category</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getChartData()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => `$${value}`} />
                          <Bar dataKey="amount" fill="var(--chart-1)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <Link href="/products">
                        <Button 
                          className="w-full bg-secondary text-white py-2 px-4 rounded-md font-medium hover:bg-secondary-dark"
                          onClick={() => trackButtonClick('FindAlternativeProducts', 'TariffCalculator')}
                        >
                          Find Alternative Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-neutral-600">Enter your purchase information and click "Calculate Impact" to see your personalized tariff impact analysis.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-xl font-medium text-neutral-900 mb-4">Calculator Coming Soon</h3>
            <p className="text-neutral-600">We're working on building our tariff impact calculator. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
