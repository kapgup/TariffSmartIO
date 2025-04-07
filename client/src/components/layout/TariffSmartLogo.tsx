export function TariffSmartLogo() {
  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="currentColor" fillOpacity="0.1" />
      
      {/* "T" shape for Tariff */}
      <path 
        d="M8 8H24M16 8V24" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* "$" dollar sign */}
      <path 
        d="M24 14V12M24 14C24 15.1046 23.1046 16 22 16C20.8954 16 20 16.8954 20 18C20 19.1046 20.8954 20 22 20M24 14C24 12.8954 23.1046 12 22 12C20.8954 12 20 11.1046 20 10C20 8.89543 20.8954 8 22 8M20 20H24M22 20V22M22 8V6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}