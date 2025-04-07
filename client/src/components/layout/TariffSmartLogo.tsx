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
      
      {/* Globe outline */}
      <circle 
        cx="16" 
        cy="16" 
        r="9" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      
      {/* Horizontal meridian */}
      <path 
        d="M7 16H25" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      {/* Vertical meridian */}
      <path 
        d="M16 7V25" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      {/* Diagonal line (tariff/price arrow) */}
      <path 
        d="M11 11L21 21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      
      {/* Dollar sign on the arrow */}
      <path
        d="M15 14.5V13.5M15 14.5C15 15.3284 15.6716 16 16.5 16C17.3284 16 18 16.6716 18 17.5C18 18.3284 17.3284 19 16.5 19M15 14.5C15 13.6716 15.6716 13 16.5 13C17.3284 13 18 12.3284 18 11.5C18 10.6716 17.3284 10 16.5 10M15 19H18M16.5 19V20.5M16.5 10V8.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}