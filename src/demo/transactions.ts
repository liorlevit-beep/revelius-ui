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

export const routes: Route[] = [
  {
    id: 'psp-a',
    name: 'PSP A',
    costBps: 280,
    approvalBase: 82,
    notes: 'Primary global processor, good for general commerce',
  },
  {
    id: 'psp-b',
    name: 'PSP B',
    costBps: 250,
    approvalBase: 80,
    notes: 'Secondary processor, lower cost but slightly lower approval',
  },
  {
    id: 'local-acquirer',
    name: 'Local Acquirer',
    costBps: 320,
    approvalBase: 88,
    notes: 'Regional specialists, better for high-risk categories',
  },
  {
    id: 'alt-rail',
    name: 'Alt Rail',
    costBps: 300,
    approvalBase: 85,
    notes: 'Alternative payment rail, good for specific verticals',
  },
];

// Helper function to generate mock transactions
function generateTransaction(
  id: string,
  merchantId: string,
  merchantName: string,
  merchantCategory: string,
  index: number
): Transaction {
  const countries = ['US', 'UK', 'DE', 'FR', 'ES', 'IT', 'CA', 'AU'];
  const methods: Array<'Card' | 'APM' | 'Wallet' | 'Bank transfer'> = ['Card', 'APM', 'Wallet', 'Bank transfer'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  
  const country = countries[index % countries.length];
  const method = methods[index % methods.length];
  const amount = Math.floor(Math.random() * 500) + 20;
  const currency = country === 'US' || country === 'CA' ? 'USD' : country === 'UK' ? 'GBP' : country === 'AU' ? 'AUD' : 'EUR';
  
  // Determine routing based on category and signals
  const isHighRisk = ['Adult', 'Gambling', 'Supplements'].includes(merchantCategory);
  const currentRoute = ['PSP A', 'PSP B', 'PSP A', 'Local Acquirer'][index % 4];
  
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
  const baseRoute = routes.find(r => r.name === currentRoute);
  let baselineApprovalProb = baseRoute ? baseRoute.approvalBase : 80;
  if (riskSignals.length > 2) baselineApprovalProb -= 10;
  if (isHighRisk) baselineApprovalProb -= 5;
  
  // Determine outcome
  const currentOutcome: 'Approved' | 'Declined' = Math.random() * 100 < baselineApprovalProb ? 'Approved' : 'Declined';
  
  // Suggested route (30% of time suggest different route)
  let suggestedRoute = currentRoute;
  let suggestedApprovalProb = baselineApprovalProb;
  
  if (Math.random() < 0.3 || currentOutcome === 'Declined') {
    // Suggest optimization
    if (isHighRisk) {
      suggestedRoute = 'Local Acquirer';
      suggestedApprovalProb = 88 - (riskSignals.length * 2);
    } else if (country === 'US' || country === 'UK') {
      suggestedRoute = 'PSP A';
      suggestedApprovalProb = 85 - (riskSignals.length * 2);
    } else {
      suggestedRoute = 'Alt Rail';
      suggestedApprovalProb = 85 - (riskSignals.length * 2);
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
    
    if (suggestedRoute === 'Local Acquirer') {
      whySuggested.push('Local acquirer has better relationships with issuing banks in this region');
      whySuggested.push('Specialized in high-risk merchant categories');
    } else if (suggestedRoute === 'Alt Rail') {
      whySuggested.push('Alternative rail optimized for cross-border transactions');
      whySuggested.push('Lower false positive rate for this card BIN');
    } else {
      whySuggested.push('Historical data shows better performance for similar transactions');
      whySuggested.push('Lower fraud score threshold for this merchant segment');
    }
  }
  
  const complianceNotes: string[] = [];
  if (isHighRisk) {
    complianceNotes.push('High-risk merchant category requires enhanced monitoring');
  }
  if (country !== 'US') {
    complianceNotes.push('Cross-border transaction - regional licensing verified');
  }
  
  // Generate routing candidates
  const allRoutes = ['PSP A', 'PSP B', 'Local Acquirer', 'Alt Rail'];
  const candidates: RouteCandidate[] = allRoutes.map((routeName) => {
    const routeData = routes.find(r => r.name === routeName);
    const isBaseline = routeName === currentRoute;
    const isSuggested = routeName === suggestedRoute;
    
    let eligibility: 'eligible' | 'ineligible' | 'warning' = 'eligible';
    let approvalProb = (routeData?.approvalBase || 80) / 100;
    let complianceFit: 'good' | 'ok' | 'bad' = 'good';
    let reasons: string[] = [];
    
    // Adjust based on risk and merchant category
    if (isHighRisk && routeName === 'PSP A') {
      eligibility = 'warning';
      approvalProb -= 0.15;
      complianceFit = 'ok';
      reasons.push('High-risk category may face stricter rules');
      reasons.push('Historical approval rate lower for this merchant type');
    } else if (isHighRisk && routeName === 'Local Acquirer') {
      complianceFit = 'good';
      reasons.push('Specialized in high-risk merchant categories');
      reasons.push('Better compliance framework for regulated industries');
    }
    
    // Cross-border considerations
    if (country !== 'US' && routeName === 'PSP B') {
      eligibility = 'ineligible';
      approvalProb = 0;
      complianceFit = 'bad';
      reasons.push('No cross-border support for this region');
      reasons.push('Licensing restrictions prevent processing');
    } else if (country !== 'US' && routeName === 'Alt Rail') {
      complianceFit = 'good';
      reasons.push('Optimized for cross-border transactions');
      reasons.push('Regional compliance verified');
    }
    
    // High velocity considerations
    if (riskSignals.includes('High velocity') && routeName === 'PSP A') {
      eligibility = 'warning';
      approvalProb -= 0.05;
      reasons.push('Velocity limits may apply');
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
      routeId: routeData?.id || routeName.toLowerCase().replace(' ', '-'),
      displayName: routeName,
      logoText: routeName.split(' ').map(w => w[0]).join(''),
      eligibility,
      approvalProb: Math.max(0, Math.min(1, approvalProb)),
      costBps: routeData?.costBps || 250,
      complianceFit,
      decision,
      reasons,
    };
  });
  
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

export const transactions: Transaction[] = [];
merchants.slice(0, 10).forEach((merchant, mIdx) => {
  const txnCount = Math.floor(Math.random() * 10) + 5;
  for (let i = 0; i < txnCount; i++) {
    transactions.push(
      generateTransaction(
        `T-${(mIdx * 100 + i).toString().padStart(5, '0')}`,
        merchant.id,
        merchant.name,
        merchant.category,
        mIdx * 10 + i
      )
    );
  }
});

// Sort by date descending
transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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

export const upliftBreakdownByRoute: UpliftBreakdown[] = [
  { label: 'PSP A', baseline: 82, optimized: 86, uplift: 4.0, volume: 2145 },
  { label: 'PSP B', baseline: 80, optimized: 85, uplift: 5.0, volume: 1432 },
  { label: 'Local Acquirer', baseline: 88, optimized: 90, uplift: 2.0, volume: 892 },
  { label: 'Alt Rail', baseline: 85, optimized: 88, uplift: 3.0, volume: 578 },
];

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

