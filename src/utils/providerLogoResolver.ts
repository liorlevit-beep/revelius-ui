/**
 * Provider logo resolver using logo.dev API
 * 1. Tries logo.dev/name/{companyName} first (using pk_McRnKQqUS2C-RKXK44iXwQ)
 * 2. Falls back to local SVG in /public/provider-logos/{key}.svg
 * 3. Falls back to initials avatar if all else fails
 */

interface LogoResult {
  type: 'logo-dev' | 'local' | 'initials';
  src?: string;
  initials?: string;
  fallbackReason?: string;
}

// Logo.dev publishable key (provided by user)
const LOGO_DEV_TOKEN = 'pk_McRnKQqUS2C-RKXK44iXwQ';

// Map provider keys to their brand names for logo.dev
const PROVIDER_BRAND_NAMES: Record<string, string> = {
  '2c2p': '2C2P',
  'adyen': 'Adyen',
  'adyen_eu': 'Adyen',
  'airwallex': 'Airwallex',
  'alipay': 'Alipay',
  'authorizenet': 'Authorize.Net',
  'bluesnap': 'BlueSnap',
  'braintree': 'Braintree',
  'chasepaymentech': 'Chase',
  'checkoutcom': 'Checkout.com',
  'checkoutcom_uk': 'Checkout.com',
  'cielo': 'Cielo',
  'dlocal': 'DLocal',
  'ebanx': 'EBANX',
  'elavon': 'Elavon',
  'fis': 'FIS',
  'fiserv': 'Fiserv',
  'flutterwave': 'Flutterwave',
  'globalpayments': 'Global Payments',
  'gocardless': 'GoCardless',
  'hyp': 'HyperPay',
  'hyperpay': 'HyperPay',
  'isracard': 'Isracard',
  'klarna': 'Klarna',
  'mercadopago': 'Mercado Pago',
  'mollie': 'Mollie',
  'mpesa': 'M-Pesa',
  'networkinternational': 'Network International',
  'nexi': 'Nexi',
  'nuvei': 'Nuvei',
  'pagseguro': 'PagSeguro',
  'paymob': 'Paymob',
  'paypal': 'PayPal',
  'paypal_us': 'PayPal',
  'payplus': 'PayPlus',
  'paystack': 'Paystack',
  'paytm': 'Paytm',
  'payu': 'PayU',
  'payu_latam': 'PayU',
  'payu_uk': 'PayU',
  'rapyd': 'Rapyd',
  'razorpay': 'Razorpay',
  'square': 'Square',
  'stripe': 'Stripe',
  'stripe_uk': 'Stripe',
  'stripe_us': 'Stripe',
  'tranzila': 'Tranzila',
  'truelayer': 'TrueLayer',
  'trustly': 'Trustly',
  'vivawallet': 'Viva Wallet',
  'wechatpay': 'WeChat Pay',
  'worldline': 'Worldline',
  'worldpay': 'Worldpay',
  'worldpay_uk': 'Worldpay',
  'xendit': 'Xendit',
  'zcredit': 'ZCredit',
};

// Providers that use domain-based logo.dev endpoint instead of name-based
const PROVIDER_DOMAINS: Record<string, string> = {
  'dlocal': 'dlocal-sbox.com',
};

// Providers that should skip logo.dev and use local assets directly
const LOCAL_ONLY_PROVIDERS = new Set<string>([
  'isracard',
  'tranzila',
  'zcredit',
  'payplus',
]);

// Cache of failed providers (don't retry logo.dev for these)
const failedProviders = new Set<string>();

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
 * Get logo URL from logo.dev
 * Uses domain endpoint if available, otherwise uses name endpoint
 */
function getLogoDevUrl(providerKey: string): string | null {
  // Check if provider has a specific domain mapping
  const domain = PROVIDER_DOMAINS[providerKey];
  if (domain) {
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;
  }
  
  // Fall back to name-based endpoint
  const brandName = PROVIDER_BRAND_NAMES[providerKey];
  if (!brandName) return null;
  
  return `https://img.logo.dev/name/${encodeURIComponent(brandName)}?token=${LOGO_DEV_TOKEN}`;
}

/**
 * Get local fallback path
 */
function getLocalPath(providerKey: string): string {
  const basePath = import.meta.env.BASE_URL || '/';
  return `${basePath}provider-logos/${providerKey}.svg`.replace(/\/+/g, '/').replace(':/', '://');
}

/**
 * Resolve provider logo URL (returns optimistic result, component handles onError)
 */
export async function resolveProviderLogo(
  providerKey: string,
  providerName: string
): Promise<LogoResult> {
  // If provider is in local-only list, skip logo.dev entirely
  if (LOCAL_ONLY_PROVIDERS.has(providerKey)) {
    if (import.meta.env.DEV) {
      console.log(`[ProviderLogo] 📁 Using local asset for "${providerKey}" (local-only)`);
    }
    return {
      type: 'local',
      src: getLocalPath(providerKey),
      fallbackReason: 'local-only provider',
    };
  }

  // If already failed, go straight to local fallback
  if (failedProviders.has(providerKey)) {
    return {
      type: 'local',
      src: getLocalPath(providerKey),
      fallbackReason: 'logo.dev previously failed',
    };
  }

  // Try logo.dev first
  const logoDevUrl = getLogoDevUrl(providerKey);
  if (logoDevUrl) {
    if (import.meta.env.DEV) {
      console.log(`[ProviderLogo] 🌐 Trying logo.dev for "${providerKey}": ${logoDevUrl}`);
    }
    return {
      type: 'logo-dev',
      src: logoDevUrl,
    };
  }

  // Fallback to local
  return {
    type: 'local',
    src: getLocalPath(providerKey),
  };
}

/**
 * Mark provider as failed (don't retry logo.dev for this provider)
 */
export function markProviderLogoFailed(providerKey: string): void {
  failedProviders.add(providerKey);
  if (import.meta.env.DEV) {
    console.warn(`[ProviderLogo] ❌ Marked "${providerKey}" as failed, will use local fallback`);
  }
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
