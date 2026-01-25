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

// Provider brand colors (official brand colors for each payment provider)
const PROVIDER_BRAND_COLORS: Record<string, string> = {
  '2c2p': '#00A4E0',
  'adyen': '#0ABF53',
  'adyen_eu': '#0ABF53',
  'airwallex': '#6366F1',
  'alipay': '#1677FF',
  'authorizenet': '#0085CA',
  'bluesnap': '#00A0DF',
  'braintree': '#00AA6C',
  'chasepaymentech': '#117ACA',
  'checkoutcom': '#6C5CE7',
  'checkoutcom_uk': '#6C5CE7',
  'cielo': '#00AEEF',
  'dlocal': '#FF6B00',
  'ebanx': '#FF6900',
  'elavon': '#00A3E0',
  'fis': '#FF6600',
  'fiserv': '#FF6600',
  'flutterwave': '#F5A623',
  'globalpayments': '#00A3E0',
  'gocardless': '#27AE60',
  'hyp': '#8E44AD',
  'hyperpay': '#8E44AD',
  'isracard': '#0066CC',
  'klarna': '#FFB3C7',
  'mercadopago': '#00B1EA',
  'mollie': '#0A7EE8',
  'mpesa': '#00A65E',
  'networkinternational': '#003DA5',
  'nexi': '#EA1C2C',
  'nuvei': '#0070C0',
  'pagseguro': '#FF8A00',
  'paymob': '#2ECC71',
  'paypal': '#003087',
  'paypal_us': '#003087',
  'payplus': '#6C5CE7',
  'paystack': '#00C3F7',
  'paytm': '#00BAF2',
  'payu': '#95C11F',
  'payu_latam': '#95C11F',
  'payu_uk': '#95C11F',
  'rapyd': '#00C48C',
  'razorpay': '#3395FF',
  'square': '#000000',
  'stripe': '#635BFF',
  'stripe_uk': '#635BFF',
  'stripe_us': '#635BFF',
  'tranzila': '#0066CC',
  'truelayer': '#00D4FF',
  'trustly': '#1ED760',
  'vivawallet': '#E94B3C',
  'wechatpay': '#09BB07',
  'worldline': '#00A3E0',
  'worldpay': '#D62828',
  'worldpay_uk': '#D62828',
  'xendit': '#01D5B6',
  'zcredit': '#6C5CE7',
};

// Fallback color palette for providers not in the brand colors map
const FALLBACK_COLORS = [
  '#635BFF', '#0ABF53', '#FF6600', '#6C5CE7', '#D62828',
  '#00C48C', '#00AA6C', '#000000', '#003087', '#0085CA',
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
];

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
 * Get the brand color for a payment provider
 * Returns the official brand color or a fallback color based on provider index
 */
export function getProviderBrandColor(providerKey: string, fallbackIndex: number = 0): string {
  const lowerKey = providerKey.toLowerCase();
  
  // Check if we have a brand color for this provider
  if (PROVIDER_BRAND_COLORS[lowerKey]) {
    return PROVIDER_BRAND_COLORS[lowerKey];
  }
  
  // Use fallback color palette
  const colorIndex = fallbackIndex % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[colorIndex];
}

