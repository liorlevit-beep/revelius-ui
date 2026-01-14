/**
 * Region inference utilities based on domain TLDs
 */

/**
 * Infer region from URL based on domain TLD
 * Returns a human-readable region label
 */
export function inferRegionFromUrl(url: string): string {
  if (!url || url === '-') {
    return 'Global';
  }

  try {
    // Try to parse as URL
    let hostname: string;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url);
      hostname = urlObj.hostname.toLowerCase();
    } else {
      // Assume it's a domain without protocol
      hostname = url.toLowerCase();
    }

    // Remove 'www.' prefix if present
    hostname = hostname.replace(/^www\./, '');

    // Check TLD patterns in order of specificity
    // More specific TLDs first (e.g., .co.il before .il)
    
    if (hostname.endsWith('.co.il') || hostname.endsWith('.il')) {
      return 'Israel';
    }
    
    if (hostname.endsWith('.co.uk')) {
      return 'United Kingdom';
    }
    
    if (hostname.endsWith('.com.au')) {
      return 'Australia';
    }
    
    if (hostname.endsWith('.ca')) {
      return 'Canada';
    }
    
    if (hostname.endsWith('.de')) {
      return 'Germany';
    }
    
    if (hostname.endsWith('.fr')) {
      return 'France';
    }
    
    if (hostname.endsWith('.es')) {
      return 'Spain';
    }
    
    if (hostname.endsWith('.it')) {
      return 'Italy';
    }
    
    if (hostname.endsWith('.nl')) {
      return 'Netherlands';
    }
    
    if (hostname.endsWith('.com')) {
      return 'Global';
    }
    
    // Default for unknown TLDs
    return 'Global';
  } catch (error) {
    // Malformed URL or parsing error
    return 'Global';
  }
}

/**
 * Determine which region to display: API-provided or inferred
 * 
 * Logic:
 * - If API region is a specific country, keep it
 * - If API region is "Global" or empty, but we can infer a specific country, use inferred
 * - Otherwise use inferred region (defaults to "Global")
 */
export function resolveRegion(apiRegion: string | undefined, url: string): {
  region: string;
  isInferred: boolean;
} {
  const inferredRegion = inferRegionFromUrl(url);
  
  // If API region is missing or empty, use inferred
  if (!apiRegion || apiRegion === '-' || apiRegion.trim() === '') {
    return {
      region: inferredRegion,
      isInferred: true,
    };
  }
  
  // If API region is "Global" but we inferred a specific country, use inferred
  const normalizedApiRegion = apiRegion.toLowerCase();
  if (
    (normalizedApiRegion === 'global' || normalizedApiRegion === 'worldwide') &&
    inferredRegion !== 'Global'
  ) {
    return {
      region: inferredRegion,
      isInferred: true,
    };
  }
  
  // Otherwise, prefer API region (it's authoritative)
  return {
    region: apiRegion,
    isInferred: false,
  };
}

/**
 * Get list of known specific countries (not "Global")
 * Used for filtering and validation
 */
export function getKnownCountries(): string[] {
  return [
    'Israel',
    'United Kingdom',
    'Australia',
    'Canada',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
  ];
}

/**
 * Check if a region is a specific country (not "Global")
 */
export function isSpecificCountry(region: string): boolean {
  if (!region || region === '-') return false;
  
  const normalizedRegion = region.toLowerCase();
  if (normalizedRegion === 'global' || normalizedRegion === 'worldwide') {
    return false;
  }
  
  return getKnownCountries().some(
    country => country.toLowerCase() === normalizedRegion
  );
}
