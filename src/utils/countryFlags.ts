// Country name to flag emoji mapping
const countryFlags: Record<string, string> = {
  // North America
  'USA': '🇺🇸',
  'United States': '🇺🇸',
  'US': '🇺🇸',
  'Canada': '🇨🇦',
  'CA': '🇨🇦',
  'Mexico': '🇲🇽',
  'MX': '🇲🇽',
  
  // Europe
  'UK': '🇬🇧',
  'United Kingdom': '🇬🇧',
  'GB': '🇬🇧',
  'Germany': '🇩🇪',
  'DE': '🇩🇪',
  'France': '🇫🇷',
  'FR': '🇫🇷',
  'Italy': '🇮🇹',
  'IT': '🇮🇹',
  'Spain': '🇪🇸',
  'ES': '🇪🇸',
  'Netherlands': '🇳🇱',
  'NL': '🇳🇱',
  'Belgium': '🇧🇪',
  'BE': '🇧🇪',
  'Switzerland': '🇨🇭',
  'CH': '🇨🇭',
  'Austria': '🇦🇹',
  'AT': '🇦🇹',
  'Sweden': '🇸🇪',
  'SE': '🇸🇪',
  'Norway': '🇳🇴',
  'NO': '🇳🇴',
  'Denmark': '🇩🇰',
  'DK': '🇩🇰',
  'Finland': '🇫🇮',
  'FI': '🇫🇮',
  'Poland': '🇵🇱',
  'PL': '🇵🇱',
  'Ireland': '🇮🇪',
  'IE': '🇮🇪',
  'Portugal': '🇵🇹',
  'PT': '🇵🇹',
  'Greece': '🇬🇷',
  'GR': '🇬🇷',
  'Czech Republic': '🇨🇿',
  'CZ': '🇨🇿',
  'Romania': '🇷🇴',
  'RO': '🇷🇴',
  'Hungary': '🇭🇺',
  'HU': '🇭🇺',
  
  // Asia
  'China': '🇨🇳',
  'CN': '🇨🇳',
  'Japan': '🇯🇵',
  'JP': '🇯🇵',
  'South Korea': '🇰🇷',
  'Korea': '🇰🇷',
  'KR': '🇰🇷',
  'India': '🇮🇳',
  'IN': '🇮🇳',
  'Singapore': '🇸🇬',
  'SG': '🇸🇬',
  'Thailand': '🇹🇭',
  'TH': '🇹🇭',
  'Malaysia': '🇲🇾',
  'MY': '🇲🇾',
  'Indonesia': '🇮🇩',
  'ID': '🇮🇩',
  'Philippines': '🇵🇭',
  'PH': '🇵🇭',
  'Vietnam': '🇻🇳',
  'VN': '🇻🇳',
  'Hong Kong': '🇭🇰',
  'HK': '🇭🇰',
  'Taiwan': '🇹🇼',
  'TW': '🇹🇼',
  
  // Middle East
  'UAE': '🇦🇪',
  'United Arab Emirates': '🇦🇪',
  'AE': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'SA': '🇸🇦',
  'Israel': '🇮🇱',
  'IL': '🇮🇱',
  'Turkey': '🇹🇷',
  'TR': '🇹🇷',
  
  // Oceania
  'Australia': '🇦🇺',
  'AU': '🇦🇺',
  'New Zealand': '🇳🇿',
  'NZ': '🇳🇿',
  
  // South America
  'Brazil': '🇧🇷',
  'BR': '🇧🇷',
  'Argentina': '🇦🇷',
  'AR': '🇦🇷',
  'Chile': '🇨🇱',
  'CL': '🇨🇱',
  'Colombia': '🇨🇴',
  'CO': '🇨🇴',
  'Peru': '🇵🇪',
  'PE': '🇵🇪',
  
  // Africa
  'South Africa': '🇿🇦',
  'ZA': '🇿🇦',
  'Egypt': '🇪🇬',
  'EG': '🇪🇬',
  'Nigeria': '🇳🇬',
  'NG': '🇳🇬',
  'Kenya': '🇰🇪',
  'KE': '🇰🇪',
};

/**
 * Get flag emoji for a country name
 */
export function getCountryFlag(country: string): string {
  return countryFlags[country] || '🏳️';
}

/**
 * Check if a country has a flag
 */
export function hasCountryFlag(country: string): boolean {
  return country in countryFlags;
}
