import { Globe } from 'lucide-react';
import { getCountryFlag } from '../utils/countryFlags';

interface CountryFlagProps {
  country: string;
  className?: string;
}

export function CountryFlag({ country, className = '' }: CountryFlagProps) {
  // Show globe icon for "Global" region
  if (country === 'Global' || country === 'global' || country === 'GLOBAL') {
    return (
      <span 
        className={`inline-flex items-center justify-center ${className}`}
        title={country}
        style={{ cursor: 'help' }}
      >
        <Globe className="w-5 h-5 text-blue-600" />
      </span>
    );
  }
  
  const flag = getCountryFlag(country);
  
  return (
    <span 
      className={`inline-block text-2xl leading-none ${className}`}
      title={country}
      style={{ cursor: 'help' }}
    >
      {flag}
    </span>
  );
}
