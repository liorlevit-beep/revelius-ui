export interface Merchant {
  id: string;
  name: string;
  domain: string;
  status: 'Active' | 'Review' | 'Restricted';
  riskScore: number;
  riskDelta: number;
  lastScan: Date;
  topTriggers: string[];
  volume: number; // GMV in USD
  approvalRate: number;
  estUplift: number;
  category: 'Adult' | 'Gambling' | 'Supplements' | 'Subscriptions' | 'Marketplaces' | 'General';
  geo: 'US' | 'EU' | 'UK' | 'IL' | 'Global';
  currentRoute?: string;
  recommendedRoute?: string;
}

export interface MerchantDetails {
  merchant: Merchant;
  kpis: {
    approvalRate: number;
    chargebackRate: number;
    gmv: number;
    estUplift: number;
  };
  declared: {
    category: string;
    products: string[];
  };
  observed: {
    category: string;
    products: string[];
  };
  riskBreakdown: {
    content: number;
    product: number;
    licensing: number;
    ugc: number;
  };
}

export interface Scan {
  id: string;
  merchantId: string;
  timestamp: Date;
  type: 'Full' | 'Quick' | 'Targeted';
  status: 'Completed' | 'Running' | 'Failed';
  pagesScanned: number;
  riskScore: number;
  delta: number;
}

export interface Finding {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  surface: 'Homepage' | 'Product Page' | 'Checkout' | 'Terms' | 'UGC';
  policy: string;
  confidence: number;
  evidenceLinks: string[];
}

export interface Transaction {
  id: string;
  merchantId: string;
  timestamp: Date;
  amount: number;
  currentRoute: string;
  currentOutcome: 'Approved' | 'Declined';
  suggestedRoute: string;
  expectedOutcome: 'Approved' | 'Declined';
  whyReasons: string[];
}

export interface UpliftSeries {
  date: string;
  baseline: number;
  optimized: number;
}

// Mock merchants data
export const merchants: Merchant[] = [
  {
    id: 'M-1847',
    name: 'TechGadgets Plus',
    domain: 'techgadgets.io',
    status: 'Review',
    riskScore: 87,
    riskDelta: 5,
    lastScan: new Date('2025-01-07T10:00:00'),
    topTriggers: ['High CB rate', 'Disputed claims', 'Geo mismatch', 'Content flag'],
    volume: 1200000,
    approvalRate: 78.5,
    estUplift: 4.2,
    category: 'General',
    geo: 'US',
    currentRoute: 'PSP A',
    recommendedRoute: 'Local Acquirer',
  },
  {
    id: 'M-2103',
    name: 'FashionHub EU',
    domain: 'fashionhub.eu',
    status: 'Active',
    riskScore: 82,
    riskDelta: 3,
    lastScan: new Date('2025-01-07T08:00:00'),
    topTriggers: ['Policy change', 'UGC risk'],
    volume: 2500000,
    approvalRate: 82.1,
    estUplift: 3.8,
    category: 'Marketplaces',
    geo: 'EU',
    currentRoute: 'PSP B',
    recommendedRoute: 'Alt Rail',
  },
  {
    id: 'M-1652',
    name: 'GlobalMart Inc',
    domain: 'globalmart.com',
    status: 'Active',
    riskScore: 76,
    riskDelta: 0,
    lastScan: new Date('2025-01-07T12:00:00'),
    topTriggers: ['Checkout issues', 'High decline'],
    volume: 5400000,
    approvalRate: 85.2,
    estUplift: 2.9,
    category: 'Marketplaces',
    geo: 'Global',
    currentRoute: 'PSP A',
    recommendedRoute: 'PSP B',
  },
  {
    id: 'M-2891',
    name: 'HomeEssentials',
    domain: 'home-essentials.com',
    status: 'Active',
    riskScore: 74,
    riskDelta: -2,
    lastScan: new Date('2025-01-07T06:00:00'),
    topTriggers: ['Content flag', 'License check'],
    volume: 890000,
    approvalRate: 80.5,
    estUplift: 2.5,
    category: 'General',
    geo: 'US',
    currentRoute: 'PSP B',
    recommendedRoute: 'Local Acquirer',
  },
  {
    id: 'M-3047',
    name: 'SportZone Direct',
    domain: 'sportzone.shop',
    status: 'Active',
    riskScore: 71,
    riskDelta: 4,
    lastScan: new Date('2025-01-06T18:00:00'),
    topTriggers: ['Region block', 'High CB rate'],
    volume: 1800000,
    approvalRate: 79.8,
    estUplift: 3.1,
    category: 'General',
    geo: 'EU',
    currentRoute: 'PSP A',
    recommendedRoute: 'Alt Rail',
  },
  {
    id: 'M-1928',
    name: 'BeautyBox Online',
    domain: 'beautybox.co',
    status: 'Active',
    riskScore: 68,
    riskDelta: 0,
    lastScan: new Date('2025-01-07T11:00:00'),
    topTriggers: ['Policy update', 'Claims risk'],
    volume: 670000,
    approvalRate: 83.2,
    estUplift: 1.8,
    category: 'Subscriptions',
    geo: 'UK',
    currentRoute: 'PSP B',
    recommendedRoute: 'PSP A',
  },
  {
    id: 'M-2456',
    name: 'ElectroShop Pro',
    domain: 'electroshop.pro',
    status: 'Active',
    riskScore: 65,
    riskDelta: -3,
    lastScan: new Date('2025-01-06T20:00:00'),
    topTriggers: ['Checkout flow', 'Geo licensing'],
    volume: 3200000,
    approvalRate: 86.5,
    estUplift: 2.2,
    category: 'General',
    geo: 'Global',
    currentRoute: 'Local Acquirer',
    recommendedRoute: 'PSP A',
  },
  {
    id: 'M-3182',
    name: 'PetSupplies Co',
    domain: 'petsupplies.store',
    status: 'Active',
    riskScore: 62,
    riskDelta: -1,
    lastScan: new Date('2025-01-07T09:00:00'),
    topTriggers: ['Content scan', 'Low approval'],
    volume: 1100000,
    approvalRate: 84.8,
    estUplift: 1.5,
    category: 'General',
    geo: 'US',
    currentRoute: 'PSP A',
    recommendedRoute: 'PSP B',
  },
  {
    id: 'M-4521',
    name: 'VitaHealth Supplements',
    domain: 'vitahealth.co',
    status: 'Restricted',
    riskScore: 91,
    riskDelta: 8,
    lastScan: new Date('2025-01-07T07:00:00'),
    topTriggers: ['Health claims', 'Regulatory', 'High CB', 'Disputed'],
    volume: 450000,
    approvalRate: 72.3,
    estUplift: 5.8,
    category: 'Supplements',
    geo: 'US',
    currentRoute: 'PSP A',
    recommendedRoute: 'Restricted',
  },
  {
    id: 'M-5103',
    name: 'Lucky Casino Games',
    domain: 'luckycasino.bet',
    status: 'Review',
    riskScore: 88,
    riskDelta: 2,
    lastScan: new Date('2025-01-07T05:00:00'),
    topTriggers: ['Gambling', 'License check', 'Geo restrictions'],
    volume: 2100000,
    approvalRate: 76.2,
    estUplift: 4.5,
    category: 'Gambling',
    geo: 'EU',
    currentRoute: 'Alt Rail',
    recommendedRoute: 'Local Acquirer',
  },
  // Add more merchants to reach 20-30
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `M-${6000 + i}`,
    name: `Test Merchant ${i + 1}`,
    domain: `merchant${i + 1}.example.com`,
    status: (['Active', 'Review', 'Restricted'] as const)[i % 3],
    riskScore: Math.floor(Math.random() * 40) + 40,
    riskDelta: Math.floor(Math.random() * 11) - 5,
    lastScan: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    topTriggers: ['Test trigger 1', 'Test trigger 2'],
    volume: Math.floor(Math.random() * 5000000) + 100000,
    approvalRate: Math.floor(Math.random() * 20) + 70,
    estUplift: Math.floor(Math.random() * 50) / 10,
    category: (['General', 'Marketplaces', 'Subscriptions'] as const)[i % 3],
    geo: (['US', 'EU', 'UK', 'Global'] as const)[i % 4],
    currentRoute: 'PSP A',
    recommendedRoute: 'PSP B',
  })),
];

export const merchantDetailsById: Record<string, MerchantDetails> = {
  'M-1847': {
    merchant: merchants[0],
    kpis: {
      approvalRate: 78.5,
      chargebackRate: 1.2,
      gmv: 1200000,
      estUplift: 4.2,
    },
    declared: {
      category: 'Consumer Electronics',
      products: ['Smartphones', 'Tablets', 'Accessories'],
    },
    observed: {
      category: 'Consumer Electronics + Questionable Health Devices',
      products: ['Smartphones', 'Tablets', 'Accessories', 'EMF Blockers', 'Health Monitors'],
    },
    riskBreakdown: {
      content: 35,
      product: 40,
      licensing: 15,
      ugc: 10,
    },
  },
  // Add more as needed
};

export const merchantScansByMerchantId: Record<string, Scan[]> = {
  'M-1847': [
    {
      id: 'S-8471',
      merchantId: 'M-1847',
      timestamp: new Date('2025-01-07T10:00:00'),
      type: 'Full',
      status: 'Completed',
      pagesScanned: 245,
      riskScore: 87,
      delta: 5,
    },
    {
      id: 'S-8234',
      merchantId: 'M-1847',
      timestamp: new Date('2025-01-05T14:30:00'),
      type: 'Quick',
      status: 'Completed',
      pagesScanned: 48,
      riskScore: 82,
      delta: 0,
    },
    {
      id: 'S-7982',
      merchantId: 'M-1847',
      timestamp: new Date('2025-01-03T09:15:00'),
      type: 'Full',
      status: 'Completed',
      pagesScanned: 238,
      riskScore: 82,
      delta: -3,
    },
  ],
};

export const merchantFindingsByMerchantId: Record<string, Finding[]> = {
  'M-1847': [
    {
      id: 'F-1001',
      merchantId: 'M-1847',
      title: 'Unsubstantiated health claims on product pages',
      description: 'Multiple product listings contain health benefit claims without FDA approval or scientific backing.',
      severity: 'Critical',
      surface: 'Product Page',
      policy: 'FDA Health Claims',
      confidence: 95,
      evidenceLinks: ['/products/emf-blocker', '/products/health-monitor-pro'],
    },
    {
      id: 'F-1002',
      merchantId: 'M-1847',
      title: 'Misleading geographic shipping information',
      description: 'Site claims worldwide shipping but checkout restricts certain regions without disclosure.',
      severity: 'High',
      surface: 'Checkout',
      policy: 'Geographic Restrictions',
      confidence: 88,
      evidenceLinks: ['/checkout', '/shipping-policy'],
    },
    {
      id: 'F-1003',
      merchantId: 'M-1847',
      title: 'User reviews contain suspicious patterns',
      description: 'High volume of 5-star reviews posted within 24h of product launch, potential manipulation.',
      severity: 'Medium',
      surface: 'UGC',
      policy: 'Review Authenticity',
      confidence: 72,
      evidenceLinks: ['/products/tablet-pro/reviews'],
    },
    {
      id: 'F-1004',
      merchantId: 'M-1847',
      title: 'Incomplete return policy disclosure',
      description: 'Return policy buried in footer, contradicts checkout messaging.',
      severity: 'Medium',
      surface: 'Terms',
      policy: 'Consumer Protection',
      confidence: 90,
      evidenceLinks: ['/terms', '/returns'],
    },
    {
      id: 'F-1005',
      merchantId: 'M-1847',
      title: 'Aggressive upsell tactics at checkout',
      description: 'Pre-checked boxes for premium shipping and warranty violate FTC guidelines.',
      severity: 'High',
      surface: 'Checkout',
      policy: 'FTC Fair Practices',
      confidence: 98,
      evidenceLinks: ['/checkout/step-2'],
    },
  ],
};

export const merchantTransactionsByMerchantId: Record<string, Transaction[]> = {
  'M-1847': Array.from({ length: 20 }, (_, i) => ({
    id: `T-${10000 + i}`,
    merchantId: 'M-1847',
    timestamp: new Date(Date.now() - i * 3600000),
    amount: Math.floor(Math.random() * 500) + 50,
    currentRoute: ['PSP A', 'PSP B'][i % 2],
    currentOutcome: (Math.random() > 0.3 ? 'Approved' : 'Declined') as 'Approved' | 'Declined',
    suggestedRoute: ['Local Acquirer', 'Alt Rail'][i % 2],
    expectedOutcome: 'Approved' as 'Approved' | 'Declined',
    whyReasons: [
      'Higher approval rate for this card BIN on suggested route',
      'Lower fraud score on alternative processor',
      'Better geo-match with issuer bank',
    ],
  })),
};

export const merchantUpliftSeriesByMerchantId: Record<string, UpliftSeries[]> = {
  'M-1847': [
    { date: '2024-12-31', baseline: 74.5, optimized: 74.5 },
    { date: '2025-01-01', baseline: 74.8, optimized: 74.8 },
    { date: '2025-01-02', baseline: 74.2, optimized: 76.1 },
    { date: '2025-01-03', baseline: 74.6, optimized: 77.5 },
    { date: '2025-01-04', baseline: 74.9, optimized: 78.2 },
    { date: '2025-01-05', baseline: 74.3, optimized: 78.8 },
    { date: '2025-01-06', baseline: 74.7, optimized: 79.1 },
    { date: '2025-01-07', baseline: 74.5, optimized: 78.5 },
  ],
};


