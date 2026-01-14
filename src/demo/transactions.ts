export interface Route {
  id: string;
  name: string;
  costBps: number; // basis points (e.g., 250 = 2.5%)
  approvalBase: number; // base approval rate %
  notes: string;
}

export interface RouteCandidate {
  routeId: string;
  displayName: string;
  logoText: string;
  eligibility: 'eligible' | 'ineligible' | 'warning';
  approvalProb: number; // 0-1
  costBps: number;
  complianceFit: 'good' | 'ok' | 'bad';
  decision: 'selected' | 'rejected' | 'baseline';
  reasons: string[];
}

export interface LineItem {
  sku: string;
  name: string;
  categoryId: string;
  quantity: number;
  price: number;
}

export interface SKU {
  sku_id: string;
  title: string;
  quantity: number;
  price: number;
  product_url: string;
  evidence_items: EvidenceItem[];
  category_id?: string;
}

export interface EvidenceItem {
  url: string;
  url_referrer: string;
  content_type: string;
  status: string;
  blocked_reason?: string;
  confidence?: number;
}

export interface EvidenceSummary {
  total_scanned_items: number;
  total_failed_items: number;
  passed_percentage: number;
  failed_percentage: number;
  review_required_count: number;
}

export interface Transaction {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  country: string;
  method: 'Card' | 'APM' | 'Wallet' | 'Bank transfer';
  createdAt: Date;
  currentRoute: string;
  currentOutcome: 'Approved' | 'Declined';
  riskSignals: string[];
  baselineApprovalProb: number;
  suggestedRoute: string;
  suggestedApprovalProb: number;
  lineItems?: LineItem[];
  evidence_session_id?: string;
  status?: string;
  cart?: SKU[];
  evidence_summary?: EvidenceSummary;
  explanation: {
    signalsUsed: string[];
    whyCurrent: string[];
    whySuggested: string[];
    complianceNotes: string[];
  };
  routing: {
    baselineRoute: string;
    suggestedRoute: string;
    candidates: RouteCandidate[];
  };
}

export interface UpliftTimeSeries {
  date: string;
  baseline: number;
  optimized: number;
}

export interface UpliftBreakdown {
  label: string;
  baseline: number;
  optimized: number;
  uplift: number;
  volume: number;
}

// Helper to get provider display name (Title Case)
function toTitleCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Generate routes from provider list
export function generateRoutesFromProviders(providers: string[]): Route[] {
  if (!providers || providers.length === 0) {
    // Fallback to default providers
    providers = ['stripe', 'adyen', 'rapyd', 'checkout', 'braintree'];
  }
  
  return providers.map((provider, index) => ({
    id: provider,
    name: toTitleCase(provider),
    costBps: 250 + (index * 10), // Vary cost slightly
    approvalBase: 80 + Math.min(index * 2, 10), // Vary approval rate
    notes: `Provider ${index + 1}`,
  }));
}

// Default routes (for backwards compatibility)
export const routes: Route[] = generateRoutesFromProviders(['stripe', 'adyen', 'rapyd', 'checkout', 'braintree']);

// Helper function to generate mock transactions
function generateTransaction(
  id: string,
  merchantId: string,
  merchantName: string,
  merchantCategory: string,
  index: number,
  availableProviders?: string[]
): Transaction {
  const providerRoutes = availableProviders && availableProviders.length > 0
    ? generateRoutesFromProviders(availableProviders)
    : routes;
  const countries = ['US', 'UK', 'DE', 'FR', 'ES', 'IT', 'CA', 'AU'];
  const methods: Array<'Card' | 'APM' | 'Wallet' | 'Bank transfer'> = ['Card', 'APM', 'Wallet', 'Bank transfer'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  
  const country = countries[index % countries.length];
  const method = methods[index % methods.length];
  const amount = Math.floor(Math.random() * 500) + 20;
  const currency = country === 'US' || country === 'CA' ? 'USD' : country === 'UK' ? 'GBP' : country === 'AU' ? 'AUD' : 'EUR';
  
  // Determine routing based on category and signals
  const isHighRisk = ['Adult', 'Gambling', 'Supplements'].includes(merchantCategory);
  const currentRoute = providerRoutes[index % providerRoutes.length].name;
  
  // Risk signals
  const allSignals = [
    'High velocity',
    'New card',
    'Geo mismatch',
    'Low AVS score',
    'High ticket',
    'Cross-border',
    'Multiple attempts',
    'VPN detected',
  ];
  const riskSignals = allSignals.filter(() => Math.random() > 0.7).slice(0, 3);
  
  // Baseline probability
  const baseRoute = providerRoutes.find(r => r.name === currentRoute);
  let baselineApprovalProb = baseRoute ? baseRoute.approvalBase : 80;
  if (riskSignals.length > 2) baselineApprovalProb -= 10;
  if (isHighRisk) baselineApprovalProb -= 5;
  
  // Determine outcome
  const currentOutcome: 'Approved' | 'Declined' = Math.random() * 100 < baselineApprovalProb ? 'Approved' : 'Declined';
  
  // Suggested route (30% of time suggest different route)
  let suggestedRoute = currentRoute;
  let suggestedApprovalProb = baselineApprovalProb;
  
  if (Math.random() < 0.3 || currentOutcome === 'Declined') {
    // Suggest optimization - pick a different provider
    const otherRoutes = providerRoutes.filter(r => r.name !== currentRoute);
    if (otherRoutes.length > 0) {
      // Pick the provider with highest approval rate
      const bestRoute = otherRoutes.reduce((best, current) => 
        current.approvalBase > best.approvalBase ? current : best
      );
      suggestedRoute = bestRoute.name;
      suggestedApprovalProb = bestRoute.approvalBase - (riskSignals.length * 2);
    }
  }
  
  // Ensure suggested is better
  if (suggestedRoute !== currentRoute) {
    suggestedApprovalProb = Math.max(suggestedApprovalProb, baselineApprovalProb + 5);
  }
  
  // Generate explanations
  const signalsUsed = [
    'Merchant risk profile',
    'Card BIN country',
    'Transaction amount',
    'Historical approval patterns',
  ];
  
  if (riskSignals.length > 0) {
    signalsUsed.push(...riskSignals.slice(0, 2));
  }
  
  const whyCurrent: string[] = [];
  if (currentOutcome === 'Declined') {
    whyCurrent.push(`${currentRoute} has ${baselineApprovalProb}% approval rate for this profile`);
    if (riskSignals.length > 0) {
      whyCurrent.push(`Risk signals (${riskSignals.join(', ')}) triggered stricter rules`);
    }
    if (isHighRisk) {
      whyCurrent.push(`Merchant category flagged as high-risk for standard processors`);
    }
  }
  
  const whySuggested: string[] = [];
  if (suggestedRoute !== currentRoute) {
    const uplift = suggestedApprovalProb - baselineApprovalProb;
    whySuggested.push(`${suggestedRoute} has +${uplift.toFixed(1)}pp higher approval for this transaction type`);
    whySuggested.push('Historical data shows better performance for similar transactions');
    whySuggested.push('Lower fraud score threshold for this merchant segment');
    
    if (isHighRisk) {
      whySuggested.push('Better suited for high-risk merchant categories');
    }
    if (country !== 'US') {
      whySuggested.push('Optimized for cross-border transactions in this region');
    }
  }
  
  const complianceNotes: string[] = [];
  if (isHighRisk) {
    complianceNotes.push('High-risk merchant category requires enhanced monitoring');
  }
  if (country !== 'US') {
    complianceNotes.push('Cross-border transaction - regional licensing verified');
  }
  
  // Generate routing candidates from available providers
  const candidates: RouteCandidate[] = providerRoutes.map((routeData) => {
    const routeName = routeData.name;
    const isBaseline = routeName === currentRoute;
    const isSuggested = routeName === suggestedRoute;
    
    let eligibility: 'eligible' | 'ineligible' | 'warning' = 'eligible';
    let approvalProb = (routeData?.approvalBase || 80) / 100;
    let complianceFit: 'good' | 'ok' | 'bad' = 'good';
    let reasons: string[] = [];
    
    // Adjust based on risk and merchant category
    const providerIndex = providerRoutes.indexOf(routeData);
    if (isHighRisk && providerIndex === 0) {
      eligibility = 'warning';
      approvalProb -= 0.15;
      complianceFit = 'ok';
      reasons.push('High-risk category may face stricter rules');
      reasons.push('Historical approval rate lower for this merchant type');
    } else if (isHighRisk && providerIndex > 1) {
      complianceFit = 'good';
      reasons.push('Better suited for high-risk merchant categories');
      reasons.push('Strong compliance framework for regulated industries');
    }
    
    // Cross-border considerations
    if (country !== 'US') {
      if (Math.random() > 0.7 && providerIndex === 1) {
        eligibility = 'warning';
        approvalProb -= 0.1;
        reasons.push('Limited cross-border support for this region');
      } else {
        reasons.push('Supports cross-border transactions');
        approvalProb += 0.02;
      }
    }
    
    // High velocity considerations
    if (riskSignals.includes('High velocity')) {
      approvalProb -= 0.05;
      reasons.push('Velocity monitoring active');
    }
    
    // Set decision
    let decision: 'selected' | 'rejected' | 'baseline' = 'rejected';
    if (isSuggested) {
      decision = 'selected';
      approvalProb = suggestedApprovalProb / 100;
      reasons.unshift('Highest approval probability for this profile');
      if (complianceFit === 'good') {
        reasons.push('Optimal compliance fit');
      }
    } else if (isBaseline) {
      decision = 'baseline';
      approvalProb = baselineApprovalProb / 100;
    }
    
    if (eligibility === 'ineligible') {
      decision = 'rejected';
    } else if (decision === 'rejected' && eligibility === 'eligible') {
      reasons.push('Lower approval probability than selected route');
      reasons.push('Not optimal for this transaction profile');
    }
    
    return {
      routeId: routeData.id,
      displayName: routeName,
      logoText: routeName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase(),
      eligibility,
      approvalProb: Math.max(0, Math.min(1, approvalProb)),
      costBps: routeData.costBps,
      complianceFit,
      decision,
      reasons,
    };
  });
  
  // Generate line items with category IDs
  const possibleCategories = [
    { id: 'tobacco', name: 'Tobacco Products' },
    { id: 'cbd', name: 'CBD Products' },
    { id: 'adult', name: 'Adult Content' },
    { id: 'supplements', name: 'Dietary Supplements' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'jewelry', name: 'Jewelry' },
    { id: 'software', name: 'Software' },
  ];
  
  const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
  const lineItems: LineItem[] = [];
  for (let i = 0; i < itemCount; i++) {
    const category = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
    const itemPrice = Math.floor((amount / itemCount) * (0.8 + Math.random() * 0.4));
    lineItems.push({
      sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      name: `${category.name} Item ${i + 1}`,
      categoryId: category.id,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: itemPrice,
    });
  }
  
  return {
    id,
    merchantId,
    merchantName,
    amount,
    currency,
    country,
    method,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    currentRoute,
    currentOutcome,
    riskSignals,
    baselineApprovalProb,
    suggestedRoute,
    suggestedApprovalProb,
    lineItems,
    explanation: {
      signalsUsed,
      whyCurrent,
      whySuggested,
      complianceNotes,
    },
    routing: {
      baselineRoute: currentRoute,
      suggestedRoute: suggestedRoute,
      candidates,
    },
  };
}

// Generate mock transactions from merchants
import { merchants } from './merchants';

// Generate transactions with dynamic providers
export function generateTransactions(availableProviders?: string[]): Transaction[] {
  const txns: Transaction[] = [];
  merchants.slice(0, 10).forEach((merchant, mIdx) => {
    const txnCount = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < txnCount; i++) {
      txns.push(
        generateTransaction(
          `T-${(mIdx * 100 + i).toString().padStart(5, '0')}`,
          merchant.id,
          merchant.name,
          merchant.category,
          mIdx * 10 + i,
          availableProviders
        )
      );
    }
  });
  
  // Sort by date descending
  txns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return txns;
}

// Default transactions (for backwards compatibility)
export const transactions: Transaction[] = generateTransactions();

// Uplift time series for different ranges
export const upliftSeries = {
  24: Array.from({ length: 24 }, (_, i) => ({
    date: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
    baseline: 82 + Math.random() * 2,
    optimized: 86 + Math.random() * 2,
  })),
  7: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    baseline: 82 + Math.random() * 2,
    optimized: 86 + Math.random() * 2,
  })),
  30: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    baseline: 81 + Math.random() * 3,
    optimized: 85 + Math.random() * 3,
  })),
};

// Uplift breakdowns
export const upliftBreakdownByCountry: UpliftBreakdown[] = [
  { label: 'US', baseline: 84, optimized: 88, uplift: 4.0, volume: 1245 },
  { label: 'UK', baseline: 83, optimized: 87, uplift: 4.0, volume: 892 },
  { label: 'DE', baseline: 81, optimized: 86, uplift: 5.0, volume: 654 },
  { label: 'FR', baseline: 82, optimized: 87, uplift: 5.0, volume: 523 },
  { label: 'CA', baseline: 83, optimized: 86, uplift: 3.0, volume: 412 },
  { label: 'AU', baseline: 84, optimized: 88, uplift: 4.0, volume: 321 },
];

// Generate uplift breakdown by route dynamically
export function generateUpliftByRoute(availableProviders?: string[]): UpliftBreakdown[] {
  const providerRoutes = availableProviders && availableProviders.length > 0
    ? generateRoutesFromProviders(availableProviders)
    : routes;
  
  return providerRoutes.map((route, index) => ({
    label: route.name,
    baseline: route.approvalBase,
    optimized: route.approvalBase + 3 + Math.random() * 2,
    uplift: 3 + Math.random() * 2,
    volume: Math.floor(2000 - (index * 300) + Math.random() * 200),
  }));
}

export const upliftBreakdownByRoute: UpliftBreakdown[] = generateUpliftByRoute();

// Helper to get transactions for a specific merchant
export function getTransactionsForMerchant(merchantId: string): Transaction[] {
  return transactions.filter(t => t.merchantId === merchantId);
}

// Helper to get uplift metrics
export function getUpliftMetrics(txns: Transaction[] = transactions) {
  const totalTxns = txns.length;
  const approvedBaseline = txns.filter(t => t.currentOutcome === 'Approved').length;
  const baselineRate = (approvedBaseline / totalTxns) * 100;
  
  // Calculate optimized assuming all suggestions were followed
  const optimizedApprovals = txns.reduce((acc, t) => {
    if (t.currentOutcome === 'Approved') return acc + 1;
    if (t.suggestedRoute !== t.currentRoute && Math.random() * 100 < t.suggestedApprovalProb) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const optimizedRate = (optimizedApprovals / totalTxns) * 100;
  
  const incrementalApprovals = optimizedApprovals - approvedBaseline;
  const avgAmount = txns.reduce((sum, t) => sum + t.amount, 0) / txns.length;
  const incrementalVolume = incrementalApprovals * avgAmount;
  const revenueUplift = incrementalVolume * 0.03; // Assume 3% margin
  
  return {
    baselineRate,
    optimizedRate,
    uplift: optimizedRate - baselineRate,
    incrementalApprovals,
    incrementalVolume,
    revenueUplift,
  };
}

