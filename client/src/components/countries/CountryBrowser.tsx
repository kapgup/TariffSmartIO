import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle tariff range filter change
  const handleTariffRangeChange = (value: string) => {
    setTariffRange(value);
    trackFilterUsage("tariffRange", value);
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

  // Filter countries based on search and tariff range
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
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
  }, [countries, searchQuery, tariffRange]);

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

  // Get impact level based on tariff increase
  const getImpactLevel = (percentage: number) => {
    if (percentage < 25) return "low";
    if (percentage < 75) return "medium";
    return "high";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-64">
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
                const impactLevel = getImpactLevel(parseFloat(percentage));
                
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