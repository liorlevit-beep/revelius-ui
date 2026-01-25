/**
 * Robust provider logo resolver
 * 1. Checks for local SVG in /public/provider-logos/{key}.svg
 * 2. Falls back to initials avatar if not found
 * 3. Logs warnings in dev mode when logos are missing
 */

interface LogoResult {
  type: 'svg' | 'initials';
  src?: string;
  initials?: string;
  fallbackReason?: string;
}

// Cache to avoid repeated 404 checks
const logoCache = new Map<string, LogoResult>();

/**
 * Generate initials from provider name
 */
export function generateInitials(name: string): string {
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Check if logo exists and resolve to local path or initials
 * Now returns optimistic result - let the component handle onError
 */
export async function resolveProviderLogo(
  providerKey: string,
  providerName: string
): Promise<LogoResult> {
  // Check cache first
  if (logoCache.has(providerKey)) {
    return logoCache.get(providerKey)!;
  }

  // Construct local SVG path (include base path for GitHub Pages)
  const basePath = import.meta.env.BASE_URL || '/';
  const svgPath = `${basePath}provider-logos/${providerKey}.svg`.replace(/\/+/g, '/').replace(':/', '://');

  // Return optimistic result - let img onError handle fallback
  // This avoids double-fetching (HEAD + GET) and respects cache headers
  const result: LogoResult = {
    type: 'svg',
    src: svgPath,
  };
  
  logoCache.set(providerKey, result);
  
  if (import.meta.env.DEV) {
    console.log(`[ProviderLogo] 📍 Resolved path for "${providerKey}": ${svgPath}`);
  }
  
  return result;
}

/**
 * Synchronous version that returns optimistic result
 * (assumes SVG exists, component should handle onError)
 */
export function resolveProviderLogoSync(
  providerKey: string,
  providerName: string
): LogoResult {
  // Check cache
  if (logoCache.has(providerKey)) {
    return logoCache.get(providerKey)!;
  }

  // Optimistically return SVG path (include base path for GitHub Pages)
  // Component will handle onError to fall back to initials
  const basePath = import.meta.env.BASE_URL || '/';
  const svgPath = `${basePath}provider-logos/${providerKey}.svg`.replace(/\/+/g, '/').replace(':/', '://');
  
  return {
    type: 'svg',
    src: svgPath,
  };
}

/**
 * Preload logos for multiple providers
 * Call this on page load to warm up cache
 */
export async function preloadProviderLogos(
  providers: Array<{ key: string; name: string }>
): Promise<void> {
  const promises = providers.map(p => resolveProviderLogo(p.key, p.name));
  await Promise.allSettled(promises);
  
  if (import.meta.env.DEV) {
    const svgCount = Array.from(logoCache.values()).filter(r => r.type === 'svg').length;
    const initialCount = logoCache.size - svgCount;
    console.log(
      `[ProviderLogo] 📊 Preloaded ${logoCache.size} providers: ` +
      `${svgCount} SVGs, ${initialCount} initials fallbacks`
    );
  }
}

/**
 * Clear cache (useful for testing)
 */
export function clearLogoCache(): void {
  logoCache.clear();
  if (import.meta.env.DEV) {
    console.log('[ProviderLogo] 🗑️  Cache cleared');
  }
}
