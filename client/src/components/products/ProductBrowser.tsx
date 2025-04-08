import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trackFilterUsage, trackProductView } from "@/lib/analytics";
import { useFeatureFlag } from "@/lib/featureFlags";
import { ProductCategory, Product, Country } from "@/lib/types";
import { PRODUCT_CATEGORIES, COUNTRIES, TARIFF_RANGES } from "@/lib/constants";
import { Search } from "lucide-react";

interface ProductCardProps {
  product: Product;
  categories: ProductCategory[];
}

const ProductCard = ({ product, categories }: ProductCardProps) => {
  const category = categories.find(c => c.id === product.categoryId);
  const categoryName = category?.name || "Unknown Category";
  
  const getImpactBadgeStyles = (impactLevel: string) => {
    switch (impactLevel.toLowerCase()) {
      case 'high': 
        return 'bg-red-100 text-red-600';
      case 'medium': 
        return 'bg-amber-100 text-amber-600';
      case 'low': 
        return 'bg-green-100 text-green-600';
      default: 
        return 'bg-blue-100 text-blue-600';
    }
  };

  const handleViewDetails = () => {
    trackProductView(product.name, categoryName);
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-neutral-900">{product.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactBadgeStyles(product.impactLevel)}`}>
            {product.impactLevel.charAt(0).toUpperCase() + product.impactLevel.slice(1)} Impact
          </span>
        </div>
        <p className="text-sm text-neutral-600 mb-4">{product.description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Primarily from:</span>
            <span className="text-sm font-medium">{product.originCountry}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Current Avg Price:</span>
            <span className="text-sm font-medium">
              {product.currentPrice ? `$${Number(product.currentPrice).toFixed(0)}` : "Varies"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Est. New Price:</span>
            <span className="text-sm font-medium text-red-600">
              {product.currentPrice ? 
                `$${(Number(product.currentPrice) * (1 + Number(product.estimatedIncrease) / 100)).toFixed(0)} (+${product.estimatedIncrease}%)` : 
                `+${product.estimatedIncrease}%`
              }
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 w-full py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export function ProductBrowser() {
  const isFilteringEnabled = useFeatureFlag('productFiltering', true);
  const [category, setCategory] = useState("All Categories");
  const [country, setCountry] = useState("All Countries");
  const [tariffRange, setTariffRange] = useState("All Tariff Rates");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Changed from 6 to 12 to show all products on a single page

  // Fetch all products
  const { data: productsData, isLoading: isLoadingProducts } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products'],
  });

  // Fetch all categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<{ categories: ProductCategory[] }>({
    queryKey: ['/api/categories'],
  });

  // Fetch all countries
  const { data: countriesData } = useQuery<{ countries: Country[] }>({
    queryKey: ['/api/countries'],
  });

  // Apply filters to products
  const filteredProducts = productsData?.products.filter(product => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (category !== "All Categories") {
      const productCategory = categoriesData?.categories.find(c => c.id === product.categoryId);
      if (productCategory?.name !== category) {
        return false;
      }
    }
    
    // Filter by country
    if (country !== "All Countries" && product.originCountry !== country) {
      return false;
    }
    
    // Filter by tariff range
    if (tariffRange !== "All Tariff Rates") {
      const productCountry = countriesData?.countries.find(c => c.name === product.originCountry);
      if (productCountry) {
        const totalTariff = Number(productCountry.baseTariff) + Number(productCountry.reciprocalTariff);
        
        // Parse range values
        const rangeParts = tariffRange.replace('%', '').split('-');
        const min = parseInt(rangeParts[0]);
        const max = rangeParts.length > 1 ? parseInt(rangeParts[1]) : 100;
        
        if (totalTariff < min || totalTariff > max) {
          return false;
        }
      }
    }
    
    return true;
  }) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle filter changes
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
    trackFilterUsage("Category", value);
  };
  
  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCurrentPage(1);
    trackFilterUsage("Country", value);
  };
  
  const handleTariffRangeChange = (value: string) => {
    setTariffRange(value);
    setCurrentPage(1);
    trackFilterUsage("Tariff Range", value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    if (e.target.value) {
      trackFilterUsage("Search", e.target.value);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <section id="products" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-900">
            Browse Products by Category
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            Explore how different product categories will be affected by the new tariffs.
          </p>
        </div>

        {/* Filters */}
        {isFilteringEnabled && (
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">Filter by:</span>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="py-2 px-3 border border-neutral-300 rounded-md text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger className="py-2 px-3 border border-neutral-300 rounded-md text-sm">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <div className="px-3 py-2">
                    <Input
                      placeholder="Search countries..."
                      className="h-8 w-full"
                      onChange={e => {
                        // This is just for filtering the dropdown - not the actual filtering functionality
                        const list = document.querySelector('[cmdk-list]');
                        if (list) {
                          list.setAttribute('data-filter', e.target.value);
                        }
                      }}
                    />
                  </div>
                  <SelectItem value="All Countries">All Countries</SelectItem>
                  {countriesData?.countries
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((country) => (
                      <SelectItem key={country.id} value={country.name}>
                        {country.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={tariffRange} onValueChange={handleTariffRangeChange}>
                <SelectTrigger className="py-2 px-3 border border-neutral-300 rounded-md text-sm">
                  <SelectValue placeholder="All Tariff Rates" />
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
            
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="py-2 pl-10 pr-3 border border-neutral-300 rounded-md text-sm w-full md:w-64"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Product Grid */}
        {isLoadingProducts || isLoadingCategories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(12).fill(0).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-12 w-full mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-600">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                categories={categoriesData?.categories || []} 
              />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                
                // Adjust page numbers for larger page sets
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  
                  // Don't go past the last page
                  if (pageNum > totalPages) {
                    pageNum = totalPages - (4 - i);
                  }
                }
                
                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === pageNum 
                        ? 'bg-primary text-white border-primary' 
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700">
                    ...
                  </span>
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
