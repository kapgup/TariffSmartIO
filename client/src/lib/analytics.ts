import { GA_TRACKING_ID } from "./constants";

// Analytics provider interface
interface AnalyticsProvider {
  initialize(): void;
  trackPageView(url: string): void;
  trackEvent(params: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }): void;
  trackUserIdentify(userId: string, traits?: Record<string, any>): void;
}

// Google Analytics implementation
class GoogleAnalyticsProvider implements AnalyticsProvider {
  initialize(): void {
    if (typeof window === 'undefined') return;
    
    // Add Google Analytics script to the page
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize the dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      send_page_view: false // We'll handle page views manually
    });

    console.log('Google Analytics initialized');
  }

  trackPageView(url: string): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }

  trackEvent({ action, category, label, value }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  trackUserIdentify(userId: string, traits?: Record<string, any>): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('set', 'user_properties', {
      user_id: userId,
      ...traits
    });

    // Also set the user ID for Google Analytics
    window.gtag('config', GA_TRACKING_ID, {
      user_id: userId
    });
  }
}

// Analytics service that abstracts the provider implementation
class AnalyticsService {
  private provider: AnalyticsProvider;
  
  constructor(provider: AnalyticsProvider) {
    this.provider = provider;
  }

  // Method to change provider if needed
  setProvider(provider: AnalyticsProvider): void {
    this.provider = provider;
    this.provider.initialize();
  }

  initialize(): void {
    this.provider.initialize();
  }

  trackPageView(url: string): void {
    this.provider.trackPageView(url);
  }

  trackEvent(params: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }): void {
    this.provider.trackEvent(params);
  }

  trackUserIdentify(userId: string, traits?: Record<string, any>): void {
    this.provider.trackUserIdentify(userId, traits);
  }

  // Application-specific tracking methods
  trackCalculation(totalSpending: number, totalIncrease: string): void {
    this.trackEvent({
      action: 'calculate_tariff_impact',
      category: 'Calculator',
      label: `Spending: $${totalSpending} | Increase: $${totalIncrease}`,
      value: parseFloat(totalIncrease)
    });
  }

  trackProductView(productName: string, category: string): void {
    this.trackEvent({
      action: 'view_product',
      category: 'Products',
      label: `${productName} (${category})`
    });
  }

  trackFilterUsage(filterType: string, value: string): void {
    this.trackEvent({
      action: 'use_filter',
      category: 'Products',
      label: `${filterType}: ${value}`
    });
  }

  trackSignupAttempt(success: boolean): void {
    this.trackEvent({
      action: 'signup_attempt',
      category: 'User',
      label: success ? 'Success' : 'Failure'
    });
  }

  trackButtonClick(buttonName: string, location: string): void {
    this.trackEvent({
      action: 'button_click',
      category: 'UI Interaction',
      label: `${buttonName} (${location})`
    });
  }

  trackCountryView(countryName: string): void {
    this.trackEvent({
      action: 'view_country',
      category: 'Countries',
      label: countryName
    });
  }

  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent({
      action: 'search',
      category: 'Search',
      label: query,
      value: resultsCount
    });
  }
}

// Create and export the analytics service with Google Analytics provider
const analyticsService = new AnalyticsService(new GoogleAnalyticsProvider());

// Export facade functions for backward compatibility
export const initGA = () => analyticsService.initialize();
export const pageView = (url: string) => analyticsService.trackPageView(url);
export const event = (params: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => analyticsService.trackEvent(params);

export const trackCalculation = (totalSpending: number, totalIncrease: string) => 
  analyticsService.trackCalculation(totalSpending, totalIncrease);

export const trackProductView = (productName: string, category: string) => 
  analyticsService.trackProductView(productName, category);

export const trackFilterUsage = (filterType: string, value: string) => 
  analyticsService.trackFilterUsage(filterType, value);

export const trackSignupAttempt = (success: boolean) => 
  analyticsService.trackSignupAttempt(success);

export const trackButtonClick = (buttonName: string, location: string) => 
  analyticsService.trackButtonClick(buttonName, location);

export const trackCountryView = (countryName: string) => 
  analyticsService.trackCountryView(countryName);

export const trackSearch = (query: string, resultsCount: number) => 
  analyticsService.trackSearch(query, resultsCount);

// Export the service for advanced usage
export { analyticsService };

// Define window.gtag type for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
