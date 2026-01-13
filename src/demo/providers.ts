// Demo data for Payment Providers

export interface Provider {
  id: string;
  name: string;
  logoText: string;
  status: 'connected' | 'degraded' | 'disconnected';
  regions: string[];
  methods: string[];
  lastSync?: Date;
  connectedAt: Date;
  stats: {
    volumeSharePct: number;
    approvalRatePct: number;
    declineRatePct: number;
    avgCostBps: number;
    chargebackRatePct: number;
  };
  series30d: Array<{
    date: Date;
    approvalRatePct: number;
    volumeSharePct: number;
  }>;
  topMerchants: Array<{
    merchantId: string;
    merchantName: string;
    domain: string;
    volume: string;
    approvalRatePct: number;
  }>;
  constraints: {
    countries: string[];
    restrictedCategories: string[];
    notes: string[];
  };
  routingWeight: number; // 0-100
  declineReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

export interface AvailableProvider {
  id: string;
  name: string;
  logoText: string;
  description: string;
  regions: string[];
  methods: string[];
  specialties: string[];
}

// Generate time series for last 30 days
function generateSeries30d(baseApproval: number, baseVolume: number): Provider['series30d'] {
  const series: Provider['series30d'] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    series.push({
      date,
      approvalRatePct: baseApproval + (Math.random() - 0.5) * 5,
      volumeSharePct: baseVolume + (Math.random() - 0.5) * 3,
    });
  }
  
  return series;
}

export const providers: Provider[] = [
  {
    id: 'psp-a',
    name: 'PSP A',
    logoText: 'PSP A',
    status: 'connected',
    regions: ['US', 'CA', 'UK'],
    methods: ['Card', 'Wallet'],
    lastSync: new Date(),
    connectedAt: new Date('2024-06-15'),
    stats: {
      volumeSharePct: 42.3,
      approvalRatePct: 87.2,
      declineRatePct: 12.8,
      avgCostBps: 285,
      chargebackRatePct: 0.54,
    },
    series30d: generateSeries30d(87.2, 42.3),
    topMerchants: [
      { merchantId: 'merch-1', merchantName: 'StreamPro', domain: 'streampro.com', volume: '$2.4M', approvalRatePct: 89.2 },
      { merchantId: 'merch-2', merchantName: 'BetWin Casino', domain: 'betwin.com', volume: '$1.8M', approvalRatePct: 84.1 },
      { merchantId: 'merch-3', merchantName: 'NutriMax', domain: 'nutrimax.com', volume: '$1.2M', approvalRatePct: 91.3 },
      { merchantId: 'merch-4', merchantName: 'FashionHub', domain: 'fashionhub.com', volume: '$980K', approvalRatePct: 88.7 },
      { merchantId: 'merch-5', merchantName: 'TechGear', domain: 'techgear.com', volume: '$850K', approvalRatePct: 86.5 },
    ],
    constraints: {
      countries: ['US', 'CA', 'UK', 'AU', 'NZ'],
      restrictedCategories: ['Adult', 'Gambling'],
      notes: [
        'No high-risk categories without pre-approval',
        'Daily settlement for standard merchants',
        'Enhanced due diligence required for subscription models',
      ],
    },
    routingWeight: 75,
    declineReasons: [
      { reason: 'Insufficient funds', count: 1247, percentage: 38.2 },
      { reason: 'Suspected fraud', count: 823, percentage: 25.2 },
      { reason: 'Card expired', count: 654, percentage: 20.0 },
      { reason: 'Card blocked', count: 312, percentage: 9.6 },
      { reason: 'Other', count: 228, percentage: 7.0 },
    ],
  },
  {
    id: 'psp-b',
    name: 'PSP B',
    logoText: 'PSP B',
    status: 'connected',
    regions: ['EU', 'UK'],
    methods: ['Card', 'APM', 'Bank transfer'],
    lastSync: new Date(Date.now() - 3600000), // 1 hour ago
    connectedAt: new Date('2024-08-22'),
    stats: {
      volumeSharePct: 28.7,
      approvalRatePct: 84.6,
      declineRatePct: 15.4,
      avgCostBps: 310,
      chargebackRatePct: 0.62,
    },
    series30d: generateSeries30d(84.6, 28.7),
    topMerchants: [
      { merchantId: 'merch-6', merchantName: 'EuroShop', domain: 'euroshop.eu', volume: '$1.9M', approvalRatePct: 86.3 },
      { merchantId: 'merch-7', merchantName: 'TravelEU', domain: 'traveleu.com', volume: '$1.5M', approvalRatePct: 82.8 },
      { merchantId: 'merch-8', merchantName: 'DigitalGoods', domain: 'digitalgoods.net', volume: '$1.1M', approvalRatePct: 88.1 },
    ],
    constraints: {
      countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'UK', 'IE', 'AT', 'PT'],
      restrictedCategories: [],
      notes: [
        'GDPR compliant data handling',
        'Strong Customer Authentication (SCA) required for EU transactions',
        'Supports SEPA direct debit',
      ],
    },
    routingWeight: 60,
    declineReasons: [
      { reason: 'Authentication failed', count: 945, percentage: 42.1 },
      { reason: 'Insufficient funds', count: 678, percentage: 30.2 },
      { reason: 'Card expired', count: 412, percentage: 18.4 },
      { reason: 'Other', count: 210, percentage: 9.3 },
    ],
  },
  {
    id: 'local-acq',
    name: 'Local Acquirer',
    logoText: 'Local Acq',
    status: 'connected',
    regions: ['US', 'IL'],
    methods: ['Card', 'APM'],
    lastSync: new Date(Date.now() - 7200000), // 2 hours ago
    connectedAt: new Date('2024-07-10'),
    stats: {
      volumeSharePct: 18.4,
      approvalRatePct: 91.3,
      declineRatePct: 8.7,
      avgCostBps: 425,
      chargebackRatePct: 0.48,
    },
    series30d: generateSeries30d(91.3, 18.4),
    topMerchants: [
      { merchantId: 'merch-9', merchantName: 'AdultHub', domain: 'adulthub.com', volume: '$980K', approvalRatePct: 93.2 },
      { merchantId: 'merch-10', merchantName: 'GamblingKing', domain: 'gamblingking.com', volume: '$750K', approvalRatePct: 89.7 },
      { merchantId: 'merch-11', merchantName: 'SupplementsPro', domain: 'supplementspro.com', volume: '$620K', approvalRatePct: 92.1 },
    ],
    constraints: {
      countries: ['US', 'IL'],
      restrictedCategories: [],
      notes: [
        'Specializes in high-risk verticals (adult, gambling, supplements)',
        'Enhanced fraud prevention',
        'Higher processing fees but better approval rates for restricted categories',
      ],
    },
    routingWeight: 85,
    declineReasons: [
      { reason: 'Insufficient funds', count: 234, percentage: 45.2 },
      { reason: 'Suspected fraud', count: 145, percentage: 28.0 },
      { reason: 'Other', count: 139, percentage: 26.8 },
    ],
  },
  {
    id: 'alt-rail',
    name: 'Alt Rail',
    logoText: 'Alt Rail',
    status: 'degraded',
    regions: ['US', 'EU'],
    methods: ['Card', 'Wallet', 'Bank transfer'],
    lastSync: new Date(Date.now() - 14400000), // 4 hours ago
    connectedAt: new Date('2024-09-05'),
    stats: {
      volumeSharePct: 10.6,
      approvalRatePct: 88.9,
      declineRatePct: 11.1,
      avgCostBps: 350,
      chargebackRatePct: 0.71,
    },
    series30d: generateSeries30d(88.9, 10.6),
    topMerchants: [
      { merchantId: 'merch-12', merchantName: 'SubscriptionBox', domain: 'subbox.com', volume: '$720K', approvalRatePct: 90.4 },
      { merchantId: 'merch-13', merchantName: 'CoachingPro', domain: 'coachingpro.com', volume: '$540K', approvalRatePct: 87.8 },
    ],
    constraints: {
      countries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR'],
      restrictedCategories: ['Tobacco', 'Weapons'],
      notes: [
        'Alternative payment rail with advanced retry logic',
        'Good for subscription businesses',
        'Currently experiencing elevated latency (degraded status)',
      ],
    },
    routingWeight: 45,
    declineReasons: [
      { reason: 'Insufficient funds', count: 412, percentage: 40.1 },
      { reason: 'Timeout', count: 289, percentage: 28.1 },
      { reason: 'Card expired', count: 198, percentage: 19.3 },
      { reason: 'Other', count: 128, percentage: 12.5 },
    ],
  },
];

export const availableProvidersCatalog: AvailableProvider[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    logoText: 'Stripe',
    description: 'Global payment processing for internet businesses',
    regions: ['US', 'EU', 'UK', 'CA', 'AU', 'JP', 'SG'],
    methods: ['Card', 'Wallet', 'APM', 'Bank transfer'],
    specialties: ['SaaS', 'E-commerce', 'Marketplaces'],
  },
  {
    id: 'adyen',
    name: 'Adyen',
    logoText: 'Adyen',
    description: 'End-to-end payments, data, and financial management platform',
    regions: ['Global'],
    methods: ['Card', 'Wallet', 'APM', 'Bank transfer'],
    specialties: ['Enterprise', 'Omnichannel', 'High-volume'],
  },
  {
    id: 'braintree',
    name: 'Braintree',
    logoText: 'Braintree',
    description: 'A PayPal service for online and mobile payment processing',
    regions: ['US', 'EU', 'UK', 'AU'],
    methods: ['Card', 'Wallet', 'PayPal'],
    specialties: ['Subscriptions', 'Marketplace', 'Mobile apps'],
  },
  {
    id: 'checkout',
    name: 'Checkout.com',
    logoText: 'Checkout',
    description: 'Cloud-based payment gateway for global commerce',
    regions: ['US', 'EU', 'UK', 'APAC'],
    methods: ['Card', 'Wallet', 'APM'],
    specialties: ['Gaming', 'Crypto', 'High-risk'],
  },
  {
    id: 'worldpay',
    name: 'Worldpay',
    logoText: 'Worldpay',
    description: 'Global payment processing and merchant services',
    regions: ['US', 'EU', 'UK', 'Global'],
    methods: ['Card', 'APM', 'Bank transfer'],
    specialties: ['Enterprise', 'Retail', 'Hospitality'],
  },
  {
    id: 'authorize-net',
    name: 'Authorize.Net',
    logoText: 'Auth.Net',
    description: 'Payment gateway service provider for merchants in the US',
    regions: ['US', 'CA', 'UK', 'EU'],
    methods: ['Card', 'eCheck'],
    specialties: ['SMB', 'Retail', 'E-commerce'],
  },
];

export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function getProviderByName(name: string): Provider | undefined {
  return providers.find((p) => p.name === name);
}


