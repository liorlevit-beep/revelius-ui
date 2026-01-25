/**
 * Fetch provider logos from various sources
 * This script attempts to download SVG logos for all payment providers
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of all providers from the routing table
const providers = [
  '2c2p',
  'adyen',
  'adyen_eu',
  'airwallex',
  'alipay',
  'authorizenet',
  'bluesnap',
  'braintree',
  'chasepaymentech',
  'checkoutcom',
  'checkoutcom_uk',
  'cielo',
  'dlocal',
  'ebanx',
  'elavon',
  'fis',
  'fiserv',
  'flutterwave',
  'globalpayments',
  'gocardless',
  'hyp',
  'hyperpay',
  'isracard',
  'klarna',
  'mercadopago',
  'mollie',
  'mpesa',
  'networkinternational',
  'nexi',
  'nuvei',
  'pagseguro',
  'paymob',
  'paypal',
  'paypal_us',
  'payplus',
  'paystack',
  'paytm',
  'payu',
  'payu_latam',
  'payu_uk',
  'rapyd',
  'razorpay',
  'square',
  'stripe',
  'stripe_uk',
  'stripe_us',
  'tranzila',
  'truelayer',
  'trustly',
  'vivawallet',
  'wechatpay',
  'worldline',
  'worldpay',
  'worldpay_uk',
  'xendit',
  'zcredit',
];

// Map provider keys to their official domains for Clearbit API
const providerDomains = {
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

const outputDir = path.join(__dirname, '..', 'public', 'provider-logos');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a placeholder SVG logo
function generatePlaceholderSVG(providerKey, providerName) {
  // Generate initials
  const words = providerName.split(/[\s_-]+/);
  let initials;
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else {
    initials = providerName.substring(0, 2).toUpperCase();
  }

  // Generate color based on provider name
  const colors = [
    ['#10b981', '#059669'], // emerald
    ['#3b82f6', '#2563eb'], // blue
    ['#a855f7', '#9333ea'], // purple
    ['#ec4899', '#db2777'], // pink
    ['#f97316', '#ea580c'], // orange
    ['#06b6d4', '#0891b2'], // cyan
    ['#6366f1', '#4f46e5'], // indigo
    ['#14b8a6', '#0d9488'], // teal
  ];
  const index = providerName.charCodeAt(0) % colors.length;
  const [color1, color2] = colors[index];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad-${providerKey}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#grad-${providerKey})" rx="20"/>
  <text x="100" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="white" text-anchor="middle">${initials}</text>
</svg>`;
}

// Convert provider key to display name
function getProviderDisplayName(key) {
  const specialCases = {
    '2c2p': '2C2P',
    'adyen': 'Adyen',
    'adyen_eu': 'Adyen EU',
    'airwallex': 'Airwallex',
    'alipay': 'Alipay',
    'authorizenet': 'Authorize.Net',
    'bluesnap': 'BlueSnap',
    'braintree': 'Braintree',
    'chasepaymentech': 'Chase Paymentech',
    'checkoutcom': 'Checkout.com',
    'checkoutcom_uk': 'Checkout.com UK',
    'cielo': 'Cielo',
    'dlocal': 'dLocal',
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
    'paypal_us': 'PayPal US',
    'payplus': 'PayPlus',
    'paystack': 'Paystack',
    'paytm': 'Paytm',
    'payu': 'PayU',
    'payu_latam': 'PayU LATAM',
    'payu_uk': 'PayU UK',
    'rapyd': 'Rapyd',
    'razorpay': 'Razorpay',
    'square': 'Square',
    'stripe': 'Stripe',
    'stripe_uk': 'Stripe UK',
    'stripe_us': 'Stripe US',
    'tranzila': 'Tranzila',
    'truelayer': 'TrueLayer',
    'trustly': 'Trustly',
    'vivawallet': 'Viva Wallet',
    'wechatpay': 'WeChat Pay',
    'worldline': 'Worldline',
    'worldpay': 'Worldpay',
    'worldpay_uk': 'Worldpay UK',
    'xendit': 'Xendit',
    'zcredit': 'ZCredit',
  };
  return specialCases[key] || key;
}

// Download logo from Clearbit API
function downloadLogo(providerKey, domain) {
  return new Promise((resolve, reject) => {
    const url = `https://logo.clearbit.com/${domain}`;
    console.log(`Trying to fetch logo for ${providerKey} from ${url}`);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const outputPath = path.join(outputDir, `${providerKey}.png`);
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded logo for ${providerKey}`);
          resolve(true);
        });
      } else {
        console.log(`⚠️  No logo found for ${providerKey} (${response.statusCode})`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`❌ Error fetching ${providerKey}: ${err.message}`);
      resolve(false);
    });
  });
}

// Main function
async function fetchAllLogos() {
  console.log('🚀 Starting logo fetch for', providers.length, 'providers');
  console.log('📁 Output directory:', outputDir);
  console.log('');

  let downloaded = 0;
  let placeholders = 0;

  for (const providerKey of providers) {
    const outputPath = path.join(outputDir, `${providerKey}.svg`);
    
    // Skip if SVG already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${providerKey} (already exists)`);
      continue;
    }

    // Try to download from Clearbit
    const domain = providerDomains[providerKey];
    let success = false;

    if (domain) {
      success = await downloadLogo(providerKey, domain);
      if (success) {
        downloaded++;
      }
    }

    // If download failed or no domain, create placeholder
    if (!success) {
      const providerName = getProviderDisplayName(providerKey);
      const svg = generatePlaceholderSVG(providerKey, providerName);
      fs.writeFileSync(outputPath, svg, 'utf8');
      console.log(`📝 Created placeholder for ${providerKey}`);
      placeholders++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('');
  console.log('✅ Done!');
  console.log(`📊 Downloaded: ${downloaded} | Placeholders: ${placeholders}`);
}

fetchAllLogos().catch(console.error);
