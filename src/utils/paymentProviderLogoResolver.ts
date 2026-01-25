/**
 * Payment provider logo resolver
 * Fetches logos from logo.dev with local fallbacks
 */

// Map provider keys to their canonical domains
const PROVIDER_DOMAINS: Record<string, string> = {
  '2c2p': '2c2p.com',
  'adyen': 'adyen.com',
  'adyen_eu': 'adyen.com',
  'airwallex': 'airwallex.com',
  'alipay': 'alipay.com',
  'authorizenet': 'authorize.net',
  'bluesnap': 'bluesnap.com',
  'braintree': 'braintreepayments.com',
  'chasepaymentech': 'chase.com',
  'checkoutcom': 'checkout.com',
  'checkoutcom_uk': 'checkout.com',
  'cielo': 'cielo.com.br',
  'dlocal': 'dlocal.com',
  'ebanx': 'ebanx.com',
  'elavon': 'elavon.com',
  'fis': 'fisglobal.com',
  'fiserv': 'fiserv.com',
  'flutterwave': 'flutterwave.com',
  'globalpayments': 'globalpayments.com',
  'gocardless': 'gocardless.com',
  'hyp': 'hyperpay.com',
  'hyperpay': 'hyperpay.com',
  'isracard': 'isracard.co.il',
  'klarna': 'klarna.com',
  'mercadopago': 'mercadopago.com',
  'mollie': 'mollie.com',
  'mpesa': 'safaricom.co.ke',
  'networkinternational': 'networkinternational.com',
  'nexi': 'nexi.it',
  'nuvei': 'nuvei.com',
  'pagseguro': 'pagseguro.uol.com.br',
  'paymob': 'paymob.com',
  'paypal': 'paypal.com',
  'paypal_us': 'paypal.com',
  'payplus': 'payplus.co.il',
  'paystack': 'paystack.com',
  'paytm': 'paytm.com',
  'payu': 'payu.com',
  'payu_latam': 'payu.com',
  'payu_uk': 'payu.com',
  'rapyd': 'rapyd.net',
  'razorpay': 'razorpay.com',
  'square': 'squareup.com',
  'stripe': 'stripe.com',
  'stripe_uk': 'stripe.com',
  'stripe_us': 'stripe.com',
  'tranzila': 'tranzila.com',
  'truelayer': 'truelayer.com',
  'trustly': 'trustly.com',
  'vivawallet': 'vivawallet.com',
  'wechatpay': 'wechat.com',
  'worldline': 'worldline.com',
  'worldpay': 'worldpay.com',
  'worldpay_uk': 'worldpay.com',
  'xendit': 'xendit.co',
  'zcredit': 'zcredit.co.il',
};

// Manual overrides (local assets that should be used instead of logo.dev)
const LOCAL_OVERRIDES: Record<string, string> = {
  // Add any manual overrides here, e.g.:
  // 'stripe': '/provider-logos/stripe-custom.svg',
};

// Cache of failed domains (never retry)
const failedDomains = new Set<string>();

export interface PaymentProvider {
  key: string;
  name: string;
}

export function getProviderDomain(providerKey: string): string | null {
  return PROVIDER_DOMAINS[providerKey] || null;
}

export function resolveProviderLogoUrl(provider: PaymentProvider): string {
  const { key } = provider;

  // 1. Check manual overrides first
  if (LOCAL_OVERRIDES[key]) {
    const basePath = import.meta.env.BASE_URL || '/';
    return `${basePath}${LOCAL_OVERRIDES[key]}`.replace(/\/+/g, '/').replace(':/', '://');
  }

  // 2. Check if domain previously failed
  const domain = getProviderDomain(key);
  if (!domain || failedDomains.has(domain)) {
    return getLocalFallbackPath(key);
  }

  // 3. Use logo.dev API
  const token = import.meta.env.VITE_LOGO_DEV_TOKEN;
  if (token) {
    return `https://img.logo.dev/${domain}?token=${token}`;
  }

  // 4. Fallback to local placeholder
  return getLocalFallbackPath(key);
}

export function getLocalFallbackPath(providerKey: string): string {
  const basePath = import.meta.env.BASE_URL || '/';
  return `${basePath}provider-logos/${providerKey}.svg`.replace(/\/+/g, '/').replace(':/', '://');
}

export function markDomainAsFailed(providerKey: string): void {
  const domain = getProviderDomain(providerKey);
  if (domain) {
    failedDomains.add(domain);
  }
}

export function clearFailedDomainsCache(): void {
  failedDomains.clear();
}
