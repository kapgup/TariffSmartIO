import { GA_TRACKING_ID } from "./constants";

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
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
    window.gtag('config', GA_TRACKING_ID);
  }
};

// Track page views
export const pageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track calculations
export const trackCalculation = (totalSpending: number, totalIncrease: string) => {
  event({
    action: 'calculate_tariff_impact',
    category: 'Calculator',
    label: `Spending: $${totalSpending} | Increase: $${totalIncrease}`,
    value: parseFloat(totalIncrease)
  });
};

// Track product views
export const trackProductView = (productName: string, category: string) => {
  event({
    action: 'view_product',
    category: 'Products',
    label: `${productName} (${category})`
  });
};

// Track filter usage
export const trackFilterUsage = (filterType: string, value: string) => {
  event({
    action: 'use_filter',
    category: 'Products',
    label: `${filterType}: ${value}`
  });
};

// Track signup attempts
export const trackSignupAttempt = (success: boolean) => {
  event({
    action: 'signup_attempt',
    category: 'User',
    label: success ? 'Success' : 'Failure'
  });
};

// Define window.gtag type for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
