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
    
    // Google Analytics tag is already loaded in index.html
    // No need to dynamically add the script

    // Log initialization
    console.log('Google Analytics code initialized');
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
  
  // New tracking methods for enhanced user behavior analytics
  
  trackFormSubmission(formName: string, success: boolean, errorType?: string): void {
    this.trackEvent({
      action: 'form_submission',
      category: 'Forms',
      label: `${formName} | ${success ? 'Success' : 'Error' + (errorType ? ': ' + errorType : '')}`
    });
  }
  
  trackFormFieldInteraction(formName: string, fieldName: string, interactionType: 'focus' | 'blur' | 'change'): void {
    this.trackEvent({
      action: 'form_field_interaction',
      category: 'Forms',
      label: `${formName} | ${fieldName} | ${interactionType}`
    });
  }
  
  trackDropdownSelection(dropdownName: string, selectedValue: string, location: string): void {
    this.trackEvent({
      action: 'dropdown_selection',
      category: 'UI Interaction',
      label: `${dropdownName} | Selected: ${selectedValue} | ${location}`
    });
  }
  
  trackTabChange(tabGroup: string, selectedTab: string): void {
    this.trackEvent({
      action: 'tab_change',
      category: 'UI Interaction',
      label: `${tabGroup} | Selected: ${selectedTab}`
    });
  }
  
  trackModalOpen(modalName: string, trigger: string): void {
    this.trackEvent({
      action: 'modal_open',
      category: 'UI Interaction',
      label: `${modalName} | Triggered by: ${trigger}`
    });
  }
  
  trackModalClose(modalName: string, method: 'button' | 'overlay' | 'escape' | 'auto'): void {
    this.trackEvent({
      action: 'modal_close',
      category: 'UI Interaction',
      label: `${modalName} | Closed by: ${method}`
    });
  }
  
  trackScrollDepth(page: string, depth: number): void {
    this.trackEvent({
      action: 'scroll_depth',
      category: 'User Engagement',
      label: `${page} | ${depth}%`,
      value: depth
    });
  }
  
  trackTimeOnPage(page: string, seconds: number): void {
    this.trackEvent({
      action: 'time_on_page',
      category: 'User Engagement',
      label: page,
      value: seconds
    });
  }
  
  trackOutboundLink(url: string, linkText: string): void {
    this.trackEvent({
      action: 'outbound_link',
      category: 'Navigation',
      label: `${url} | ${linkText}`
    });
  }
  
  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent({
      action: 'download',
      category: 'Content',
      label: `${fileName} (${fileType})`
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

// Export new enhanced analytics functions
export const trackFormSubmission = (formName: string, success: boolean, errorType?: string) =>
  analyticsService.trackFormSubmission(formName, success, errorType);

export const trackFormFieldInteraction = (formName: string, fieldName: string, interactionType: 'focus' | 'blur' | 'change') =>
  analyticsService.trackFormFieldInteraction(formName, fieldName, interactionType);
  
export const trackDropdownSelection = (dropdownName: string, selectedValue: string, location: string) =>
  analyticsService.trackDropdownSelection(dropdownName, selectedValue, location);
  
export const trackTabChange = (tabGroup: string, selectedTab: string) =>
  analyticsService.trackTabChange(tabGroup, selectedTab);
  
export const trackModalOpen = (modalName: string, trigger: string) =>
  analyticsService.trackModalOpen(modalName, trigger);
  
export const trackModalClose = (modalName: string, method: 'button' | 'overlay' | 'escape' | 'auto') =>
  analyticsService.trackModalClose(modalName, method);
  
export const trackScrollDepth = (page: string, depth: number) =>
  analyticsService.trackScrollDepth(page, depth);
  
export const trackTimeOnPage = (page: string, seconds: number) =>
  analyticsService.trackTimeOnPage(page, seconds);
  
export const trackOutboundLink = (url: string, linkText: string) =>
  analyticsService.trackOutboundLink(url, linkText);
  
export const trackDownload = (fileName: string, fileType: string) =>
  analyticsService.trackDownload(fileName, fileType);

// Export the service for advanced usage
export { analyticsService };

// Define window.gtag type for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
