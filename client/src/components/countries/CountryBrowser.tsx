import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country } from "@/lib/types";
import { TARIFF_RANGES } from "@/lib/constants";
import { trackFilterUsage } from "@/lib/analytics";

interface CountryBrowserProps {
  countries: Country[];
}

export function CountryBrowser({ countries }: CountryBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tariffRange, setTariffRange] = useState("All Tariff Rates");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "baseTariff" | "reciprocalTariff">("name");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle tariff range filter change
  const handleTariffRangeChange = (value: string) => {
    setTariffRange(value);
    trackFilterUsage("tariffRange", value);
  };

  // Handle impact level filter change
  const handleImpactFilterChange = (value: string) => {
    setImpactFilter(value);
    trackFilterUsage("impactLevel", value);
  };

  // Handle sort toggle
  const handleSort = (column: "name" | "baseTariff" | "reciprocalTariff") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Get tariff percentage increase
  const getTariffIncrease = (base: number, reciprocal: number) => {
    const increase = reciprocal - base;
    const percentage = base > 0 ? (increase / base) * 100 : 0;
    return {
      increase,
      percentage: percentage.toFixed(0)
    };
  };

  // Organize countries by impact level
  const countriesByImpact = useMemo(() => {
    const result = {
      high: [] as Country[],
      medium: [] as Country[],
      low: [] as Country[]
    };
    
    countries.forEach(country => {
      const impactLevel = country.impactLevel?.toLowerCase() || 'medium';
      if (impactLevel in result) {
        result[impactLevel as keyof typeof result].push(country);
      }
    });
    
    return result;
  }, [countries]);

  // Count number of countries in each impact level
  const impactCounts = useMemo(() => {
    return {
      high: countriesByImpact.high.length,
      medium: countriesByImpact.medium.length,
      low: countriesByImpact.low.length,
      all: countries.length
    };
  }, [countriesByImpact, countries]);

  // Filter countries based on search, tariff range and impact level
  const filteredCountries = useMemo(() => {
    // First filter by impact level if not "all"
    const impactFiltered = impactFilter === "all" 
      ? countries 
      : countriesByImpact[impactFilter as keyof typeof countriesByImpact] || [];
    
    return impactFiltered.filter(country => {
      // Search filter
      const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tariff range filter
      let matchesTariffRange = true;
      if (tariffRange !== "All Tariff Rates") {
        const [min, max] = tariffRange
          .replace("%", "")
          .split("-")
          .map(val => parseInt(val.trim()));
        
        if (max) {
          matchesTariffRange = country.reciprocalTariff >= min && country.reciprocalTariff <= max;
        } else {
          // For the "41%+" range
          matchesTariffRange = country.reciprocalTariff >= min;
        }
      }
      
      return matchesSearch && matchesTariffRange;
    });
  }, [countries, countriesByImpact, impactFilter, searchQuery, tariffRange]);

  // Sort countries
  const sortedCountries = useMemo(() => {
    return [...filteredCountries].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        return sortOrder === "asc" 
          ? aValue - bValue 
          : bValue - aValue;
      }
    });
  }, [filteredCountries, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Impact level filter */}
        <div className="w-full">
          <Select value={impactFilter} onValueChange={handleImpactFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by impact level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Impact Levels ({impactCounts.all})
              </SelectItem>
              <SelectItem value="high">
                High Impact ({impactCounts.high})
              </SelectItem>
              <SelectItem value="medium">
                Medium Impact ({impactCounts.medium})
              </SelectItem>
              <SelectItem value="low">
                Low Impact ({impactCounts.low})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        {/* Tariff range filter */}
        <div className="w-full">
          <Select value={tariffRange} onValueChange={handleTariffRangeChange}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by tariff range" />
            </SelectTrigger>
            <SelectContent>
              {TARIFF_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedCountries.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg text-muted-foreground">No countries match your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px] cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center space-x-1">
                    <span>Country</span>
                    {sortBy === "name" && (
                      <ArrowUpDown className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("baseTariff")}>
                  <div className="flex items-center space-x-1">
                    <span>Base Tariff</span>
                    {sortBy === "baseTariff" && (
                      <ArrowUpDown className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("reciprocalTariff")}>
                  <div className="flex items-center space-x-1">
                    <span>Reciprocal Tariff</span>
                    {sortBy === "reciprocalTariff" && (
                      <ArrowUpDown className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Increase</TableHead>
                <TableHead>Impact Level</TableHead>
                <TableHead>Effective Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCountries.map((country) => {
                const { increase, percentage } = getTariffIncrease(
                  country.baseTariff, 
                  country.reciprocalTariff
                );
                
                // Use the stored impact level or calculate if not available
                const impactLevel = country.impactLevel?.toLowerCase() || 
                  (parseFloat(percentage) < 50 ? "low" : parseFloat(percentage) < 150 ? "medium" : "high");
                
                return (
                  <TableRow key={country.id}>
                    <TableCell className="font-medium">{country.name}</TableCell>
                    <TableCell>{country.baseTariff}%</TableCell>
                    <TableCell>{country.reciprocalTariff}%</TableCell>
                    <TableCell>
                      +{increase}% 
                      <span className="text-muted-foreground text-sm ml-1">
                        ({percentage}% increase)
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          impactLevel === "low" 
                            ? "outline" 
                            : impactLevel === "medium" 
                              ? "secondary" 
                              : "destructive"
                        }
                      >
                        {impactLevel.charAt(0).toUpperCase() + impactLevel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{country.effectiveDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground mt-4">
        Showing {sortedCountries.length} of {countries.length} countries
      </div>
    </div>
  );
}