import type { ProviderKey, ProviderRegion } from '../types/paymentProviders';

/**
 * Provider region mappings
 * Maps provider keys to their supported regions
 */
export const providerRegionByKey: Record<ProviderKey, ProviderRegion[]> = {
  // Global providers
  stripe: ['Global'],
  stripe_us: ['North America'],
  stripe_uk: ['United Kingdom'],
  stripe_eu: ['Europe'],
  adyen: ['Global'],
  adyen_eu: ['Europe'],
  adyen_us: ['North America'],
  checkoutcom: ['Global'],
  worldpay: ['Global'],
  fis: ['Global'],
  fiserv: ['Global'],
  globalpayments: ['Global'],
  nuvei: ['Global'],
  rapyd: ['Global'],
  paypal: ['Global'],
  airwallex: ['Global'],
  dlocal: ['Global'],

  // North America
  square: ['North America'],
  braintree: ['North America'],
  authorizenet: ['North America'],
  chasepaymentech: ['North America'],
  elavon: ['North America'],
  bluesnap: ['North America'],

  // Europe
  mollie: ['Europe'],
  worldline: ['Europe'],
  nexi: ['Europe'],
  klarna: ['Europe'],
  trustly: ['Europe'],
  vivawallet: ['Europe'],

  // United Kingdom
  truelayer: ['United Kingdom'],
  gocardless: ['United Kingdom'],

  // Israel
  tranzila: ['Israel'],
  payplus: ['Israel'],
  zcredit: ['Israel'],
  hyp: ['Israel'],
  isracard: ['Israel'],

  // LATAM
  mercadopago: ['LATAM'],
  ebanx: ['LATAM'],
  pagseguro: ['LATAM'],
  cielo: ['LATAM'],
  payu_latam: ['LATAM'],

  // APAC
  paytm: ['APAC'],
  razorpay: ['APAC'],
  xendit: ['APAC'],
  '2c2p': ['APAC'],
  alipay: ['APAC'],
  wechatpay: ['APAC'],

  // Africa & Middle East
  paystack: ['Africa & Middle East'],
  flutterwave: ['Africa & Middle East'],
  mpesa: ['Africa & Middle East'],
  networkinternational: ['Africa & Middle East'],
  paymob: ['Africa & Middle East'],
  hyperpay: ['Africa & Middle East'],
};

/**
 * Provider display names and metadata
 */
export const providerDisplayByKey: Record<ProviderKey, { name: string; website?: string; logoKey?: string; domain?: string }> = {
  // Global
  stripe: { name: 'Stripe', website: 'https://stripe.com', domain: 'stripe.com' },
  stripe_us: { name: 'Stripe (US)', website: 'https://stripe.com', domain: 'stripe.com' },
  stripe_uk: { name: 'Stripe (UK)', website: 'https://stripe.com', domain: 'stripe.com' },
  stripe_eu: { name: 'Stripe (EU)', website: 'https://stripe.com', domain: 'stripe.com' },
  adyen: { name: 'Adyen', website: 'https://adyen.com', domain: 'adyen.com' },
  adyen_eu: { name: 'Adyen (EU)', website: 'https://adyen.com', domain: 'adyen.com' },
  adyen_us: { name: 'Adyen (US)', website: 'https://adyen.com', domain: 'adyen.com' },
  checkoutcom: { name: 'Checkout.com', website: 'https://checkout.com', domain: 'checkout.com' },
  worldpay: { name: 'Worldpay', website: 'https://worldpay.com', domain: 'worldpay.com' },
  fis: { name: 'FIS', website: 'https://fisglobal.com', domain: 'fisglobal.com' },
  fiserv: { name: 'Fiserv', website: 'https://fiserv.com', domain: 'fiserv.com' },
  globalpayments: { name: 'Global Payments', website: 'https://globalpayments.com', domain: 'globalpayments.com' },
  nuvei: { name: 'Nuvei', website: 'https://nuvei.com', domain: 'nuvei.com' },
  rapyd: { name: 'Rapyd', website: 'https://rapyd.net', domain: 'rapyd.net' },
  paypal: { name: 'PayPal', website: 'https://paypal.com', domain: 'paypal.com' },
  airwallex: { name: 'Airwallex', website: 'https://airwallex.com', domain: 'airwallex.com' },
  dlocal: { name: 'dLocal', website: 'https://dlocal.com', domain: 'dlocal.com' },

  // North America
  square: { name: 'Square', website: 'https://squareup.com', domain: 'squareup.com' },
  braintree: { name: 'Braintree', website: 'https://braintreepayments.com', domain: 'braintreepayments.com' },
  authorizenet: { name: 'Authorize.Net', website: 'https://authorize.net', domain: 'authorize.net' },
  chasepaymentech: { name: 'Chase Paymentech', website: 'https://chasepaymentech.com', domain: 'chase.com' },
  elavon: { name: 'Elavon', website: 'https://elavon.com', domain: 'elavon.com' },
  bluesnap: { name: 'BlueSnap', website: 'https://bluesnap.com', domain: 'bluesnap.com' },

  // Europe
  mollie: { name: 'Mollie', website: 'https://mollie.com', domain: 'mollie.com' },
  worldline: { name: 'Worldline', website: 'https://worldline.com', domain: 'worldline.com' },
  nexi: { name: 'Nexi', website: 'https://nexi.it', domain: 'nexi.it' },
  klarna: { name: 'Klarna', website: 'https://klarna.com', domain: 'klarna.com' },
  trustly: { name: 'Trustly', website: 'https://trustly.com', domain: 'trustly.com' },
  vivawallet: { name: 'Viva Wallet', website: 'https://vivawallet.com', domain: 'vivawallet.com' },

  // United Kingdom
  truelayer: { name: 'TrueLayer', website: 'https://truelayer.com', domain: 'truelayer.com' },
  gocardless: { name: 'GoCardless', website: 'https://gocardless.com', domain: 'gocardless.com' },

  // Israel
  tranzila: { name: 'Tranzila', website: 'https://tranzila.com', domain: 'tranzila.com' },
  payplus: { name: 'PayPlus', website: 'https://payplus.co.il', domain: 'payplus.co.il' },
  zcredit: { name: 'Z-Credit', website: 'https://zcredit.co.il', domain: 'zcredit.co.il' },
  hyp: { name: 'HYP', website: 'https://hyp.co.il', domain: 'hyp.co.il' },
  isracard: { name: 'Isracard', website: 'https://isracard.co.il', domain: 'isracard.co.il' },

  // LATAM
  mercadopago: { name: 'Mercado Pago', website: 'https://mercadopago.com', domain: 'mercadopago.com' },
  ebanx: { name: 'EBANX', website: 'https://ebanx.com', domain: 'ebanx.com' },
  pagseguro: { name: 'PagSeguro', website: 'https://pagseguro.uol.com.br', domain: 'pagseguro.uol.com.br' },
  cielo: { name: 'Cielo', website: 'https://cielo.com.br', domain: 'cielo.com.br' },
  payu_latam: { name: 'PayU LATAM', website: 'https://payu.com', domain: 'payu.com' },
  payu: { name: 'PayU', website: 'https://payu.com', domain: 'payu.com' },
  payu_uk: { name: 'PayU (UK)', website: 'https://payu.com', domain: 'payu.com' },
  paypal_us: { name: 'PayPal (US)', website: 'https://paypal.com', domain: 'paypal.com' },

  // APAC
  paytm: { name: 'Paytm', website: 'https://paytm.com', domain: 'paytm.com' },
  razorpay: { name: 'Razorpay', website: 'https://razorpay.com', domain: 'razorpay.com' },
  xendit: { name: 'Xendit', website: 'https://xendit.co', domain: 'xendit.co' },
  '2c2p': { name: '2C2P', website: 'https://2c2p.com', domain: '2c2p.com' },
  alipay: { name: 'Alipay', website: 'https://alipay.com', domain: 'alipay.com' },
  wechatpay: { name: 'WeChat Pay', website: 'https://pay.weixin.qq.com', domain: 'wechat.com' },

  // Africa & Middle East
  paystack: { name: 'Paystack', website: 'https://paystack.com', domain: 'paystack.com' },
  flutterwave: { name: 'Flutterwave', website: 'https://flutterwave.com', domain: 'flutterwave.com' },
  mpesa: { name: 'M-Pesa', website: 'https://mpesa.com', domain: 'safaricom.co.ke' },
  networkinternational: { name: 'Network International', website: 'https://networkinternational.com', domain: 'networkinternational.com' },
  paymob: { name: 'Paymob', website: 'https://paymob.com', domain: 'paymob.com' },
  hyperpay: { name: 'HyperPay', website: 'https://hyperpay.com', domain: 'hyperpay.com' },
  
  // Additional providers
  checkoutcom_uk: { name: 'Checkout.com (UK)', website: 'https://checkout.com', domain: 'checkout.com' },
  worldpay_uk: { name: 'Worldpay (UK)', website: 'https://worldpay.com', domain: 'worldpay.com' },
};

/**
 * Helper to get regions for a provider key
 * Returns ["Global"] as fallback if not found
 */
export function getProviderRegions(providerKey: ProviderKey): ProviderRegion[] {
  return providerRegionByKey[providerKey] ?? ['Global'];
}

/**
 * Helper to get display name for a provider key
 * Returns formatted key as fallback if not found
 */
export function getProviderDisplayName(providerKey: ProviderKey): string {
  const display = providerDisplayByKey[providerKey];
  if (display) return display.name;

  // Fallback: capitalize and format the key
  return providerKey
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper to get domain for logo fetching
 * Returns domain from provider metadata or derives from key
 */
export function getProviderDomain(providerKey: ProviderKey): string | null {
  const display = providerDisplayByKey[providerKey];
  if (display?.domain) return display.domain;

  // Try to derive domain from key (fallback)
  const baseKey = providerKey.replace(/_(us|uk|eu|latam)$/i, '');
  const fallbackDisplay = providerDisplayByKey[baseKey];
  if (fallbackDisplay?.domain) return fallbackDisplay.domain;

  return null;
}
