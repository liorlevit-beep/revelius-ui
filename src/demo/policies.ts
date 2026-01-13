// Demo data for Policies (Pillar)

export interface PolicyPack {
  id: string;
  name: string;
  description: string;
  regions: string[];
  primaryGoal: string;
  status: 'Active' | 'Draft';
  lastUpdated: Date;
  rulesCount: number;
  optimizesFor: string[];
  highLevelGates: string[];
  thresholds: {
    autoApprove: number;
    review: number;
    reject: number;
  };
  appliesTo: {
    categories: string[];
    regions: string[];
    methods: string[];
  };
  rules: PolicyRule[];
  routingPreferences: RoutingPreference[];
  triggers: PolicyTrigger[];
}

export interface PolicyRule {
  id: string;
  name: string;
  naturalLanguage: string;
  conditions: RuleCondition[];
  action: 'approve' | 'review' | 'reject' | 'route_to' | 'flag';
  actionParams?: string;
  priority: number;
  enabled: boolean;
  lastTriggered?: Date;
  triggersLast30d: number;
  impactApprovalDelta: number; // in percentage points
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: string | number | string[];
  logic?: 'AND' | 'OR';
}

export interface RoutingPreference {
  id: string;
  condition: string;
  preferredRoutes: Array<{
    routeId: string;
    routeName: string;
    priority: number;
    reason: string;
  }>;
  enabled: boolean;
}

export interface PolicyTrigger {
  id: string;
  ruleId: string;
  ruleName: string;
  merchantId: string;
  merchantName: string;
  transactionId: string;
  timestamp: Date;
  action: string;
  reason: string;
}

export const policyPacks: PolicyPack[] = [
  {
    id: 'balanced',
    name: 'Balanced (Default)',
    description: 'Optimizes for high approval rates while maintaining acceptable risk and compliance.',
    regions: ['US', 'EU', 'UK', 'IL'],
    primaryGoal: 'Max approvals',
    status: 'Active',
    lastUpdated: new Date('2025-01-05'),
    rulesCount: 47,
    optimizesFor: [
      'Maximize approval rate',
      'Maintain <0.65% chargeback rate',
      'Auto-route based on merchant risk profile',
      'Balance cost and performance',
    ],
    highLevelGates: [
      'Prohibited categories (child content, weapons) → reject',
      'High-risk without licensing → review',
      'Gambling/adult with proper licensing → route to specialized acquirer',
      'Geo-restricted categories → check region licensing',
    ],
    thresholds: {
      autoApprove: 30,
      review: 60,
      reject: 80,
    },
    appliesTo: {
      categories: ['All'],
      regions: ['US', 'EU', 'UK', 'IL', 'CA', 'AU'],
      methods: ['Card', 'APM', 'Wallet', 'Bank transfer'],
    },
    rules: [
      {
        id: 'rule-1',
        name: 'Gambling without license → Reject',
        naturalLanguage: 'If merchant content indicates gambling OR sports betting OR casino\nAND no valid gambling license detected\nTHEN reject transaction',
        conditions: [
          { field: 'category', operator: 'in', value: ['Gambling', 'Sports betting', 'Casino'], logic: 'OR' },
          { field: 'license.gambling', operator: 'equals', value: false, logic: 'AND' },
        ],
        action: 'reject',
        priority: 1,
        enabled: true,
        lastTriggered: new Date('2025-01-06T14:32:00'),
        triggersLast30d: 342,
        impactApprovalDelta: -2.1,
      },
      {
        id: 'rule-2',
        name: 'Adult content → Route to specialized acquirer',
        naturalLanguage: 'If merchant category is Adult\nAND merchant has age verification\nAND risk score < 70\nTHEN route to Local Acquirer',
        conditions: [
          { field: 'category', operator: 'equals', value: 'Adult', logic: 'AND' },
          { field: 'ageVerification', operator: 'equals', value: true, logic: 'AND' },
          { field: 'riskScore', operator: 'less_than', value: 70, logic: 'AND' },
        ],
        action: 'route_to',
        actionParams: 'Local Acquirer',
        priority: 2,
        enabled: true,
        lastTriggered: new Date('2025-01-07T09:15:00'),
        triggersLast30d: 1247,
        impactApprovalDelta: 4.3,
      },
      {
        id: 'rule-3',
        name: 'High dispute rate → Review',
        naturalLanguage: 'If merchant chargeback rate > 1.2%\nOR dispute history shows pattern\nTHEN flag for manual review',
        conditions: [
          { field: 'chargebackRate', operator: 'greater_than', value: 1.2, logic: 'OR' },
          { field: 'disputePattern', operator: 'equals', value: true, logic: 'OR' },
        ],
        action: 'review',
        priority: 3,
        enabled: true,
        lastTriggered: new Date('2025-01-07T11:22:00'),
        triggersLast30d: 89,
        impactApprovalDelta: -0.8,
      },
      {
        id: 'rule-4',
        name: 'EU transaction → Check GDPR compliance',
        naturalLanguage: 'If transaction country in EU\nAND merchant data sharing detected\nTHEN verify GDPR compliance\nELSE route to PSP A',
        conditions: [
          { field: 'country', operator: 'in', value: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE'], logic: 'AND' },
          { field: 'dataSharing', operator: 'equals', value: true, logic: 'AND' },
        ],
        action: 'flag',
        priority: 4,
        enabled: true,
        lastTriggered: new Date('2025-01-07T10:45:00'),
        triggersLast30d: 567,
        impactApprovalDelta: 0.2,
      },
      {
        id: 'rule-5',
        name: 'Subscription with high refund rate → Alt Rail',
        naturalLanguage: 'If merchant business model is Subscription\nAND refund rate > 8%\nTHEN route to Alt Rail for better retry logic',
        conditions: [
          { field: 'businessModel', operator: 'equals', value: 'Subscription', logic: 'AND' },
          { field: 'refundRate', operator: 'greater_than', value: 8, logic: 'AND' },
        ],
        action: 'route_to',
        actionParams: 'Alt Rail',
        priority: 5,
        enabled: true,
        lastTriggered: new Date('2025-01-07T08:30:00'),
        triggersLast30d: 234,
        impactApprovalDelta: 2.7,
      },
    ],
    routingPreferences: [
      {
        id: 'pref-1',
        condition: 'Merchant risk score < 30 AND no compliance flags',
        preferredRoutes: [
          { routeId: 'psp-a', routeName: 'PSP A', priority: 1, reason: 'Lowest cost, high approval rate' },
          { routeId: 'psp-b', routeName: 'PSP B', priority: 2, reason: 'Fallback with similar performance' },
        ],
        enabled: true,
      },
      {
        id: 'pref-2',
        condition: 'Merchant category in [Adult, Gambling, Supplements]',
        preferredRoutes: [
          { routeId: 'local-acq', routeName: 'Local Acquirer', priority: 1, reason: 'Specialized in high-risk verticals' },
          { routeId: 'alt-rail', routeName: 'Alt Rail', priority: 2, reason: 'Alternative for restricted categories' },
        ],
        enabled: true,
      },
      {
        id: 'pref-3',
        condition: 'Transaction country in EU AND GDPR compliance required',
        preferredRoutes: [
          { routeId: 'psp-b', routeName: 'PSP B', priority: 1, reason: 'EU data residency, GDPR compliant' },
          { routeId: 'local-acq', routeName: 'Local Acquirer', priority: 2, reason: 'Regional acquirer' },
        ],
        enabled: true,
      },
    ],
    triggers: generateTriggers('balanced', 50),
  },
  {
    id: 'scheme-strict',
    name: 'Scheme Strict',
    description: 'Prioritizes compliance with card scheme rules (Visa/Mastercard) over approval rate.',
    regions: ['US', 'UK'],
    primaryGoal: 'Min disputes',
    status: 'Active',
    lastUpdated: new Date('2025-01-03'),
    rulesCount: 62,
    optimizesFor: [
      'Minimize chargebacks',
      'Full compliance with Visa/MC rules',
      'Conservative risk tolerance',
      'Protect scheme standing',
    ],
    highLevelGates: [
      'Prohibited categories → immediate reject',
      'Risk score > 50 → manual review',
      'Any compliance flag → review',
      'Strict MCC validation',
    ],
    thresholds: {
      autoApprove: 20,
      review: 50,
      reject: 70,
    },
    appliesTo: {
      categories: ['All'],
      regions: ['US', 'UK'],
      methods: ['Card'],
    },
    rules: [],
    routingPreferences: [],
    triggers: generateTriggers('scheme-strict', 30),
  },
  {
    id: 'high-risk-tolerant',
    name: 'High-Risk Tolerant',
    description: 'Maximizes approval rate for growth merchants with elevated risk appetite.',
    regions: ['US'],
    primaryGoal: 'Max approvals',
    status: 'Draft',
    lastUpdated: new Date('2025-01-07'),
    rulesCount: 34,
    optimizesFor: [
      'Maximum approval rate',
      'Accept higher risk for growth',
      'Fast onboarding',
      'Minimal manual review',
    ],
    highLevelGates: [
      'Only prohibited categories → reject',
      'High-risk categories → specialized routing',
      'Auto-approve up to risk score 80',
      'Aggressive retry logic',
    ],
    thresholds: {
      autoApprove: 80,
      review: 90,
      reject: 95,
    },
    appliesTo: {
      categories: ['Adult', 'Gambling', 'Supplements', 'Nutraceuticals', 'Subscriptions'],
      regions: ['US'],
      methods: ['All'],
    },
    rules: [],
    routingPreferences: [],
    triggers: generateTriggers('high-risk-tolerant', 15),
  },
  {
    id: 'eu-licensing',
    name: 'EU Licensing Strict',
    description: 'Enforces strict European regulatory compliance and licensing requirements.',
    regions: ['EU'],
    primaryGoal: 'Max compliance',
    status: 'Active',
    lastUpdated: new Date('2024-12-28'),
    rulesCount: 51,
    optimizesFor: [
      'Full EU regulatory compliance',
      'GDPR data protection',
      'Regional licensing validation',
      'Consumer protection rules',
    ],
    highLevelGates: [
      'GDPR compliance required',
      'EU country-specific licensing',
      'Consumer protection validation',
      'Data residency requirements',
    ],
    thresholds: {
      autoApprove: 25,
      review: 55,
      reject: 75,
    },
    appliesTo: {
      categories: ['All'],
      regions: ['EU'],
      methods: ['All'],
    },
    rules: [],
    routingPreferences: [],
    triggers: generateTriggers('eu-licensing', 40),
  },
];

function generateTriggers(packId: string, count: number): PolicyTrigger[] {
  const triggers: PolicyTrigger[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 720); // Last 30 days
    triggers.push({
      id: `trigger-${packId}-${i}`,
      ruleId: `rule-${Math.floor(Math.random() * 5) + 1}`,
      ruleName: ['Gambling check', 'Adult routing', 'Dispute review', 'GDPR compliance', 'Subscription routing'][Math.floor(Math.random() * 5)],
      merchantId: `merch-${Math.floor(Math.random() * 20) + 1}`,
      merchantName: ['BetWin Casino', 'AdultHub', 'NutriMax', 'StreamPro', 'GamblingKing'][Math.floor(Math.random() * 5)],
      transactionId: `txn-${Date.now()}-${i}`,
      timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
      action: ['Rejected', 'Routed to Local Acquirer', 'Flagged for review', 'Routed to Alt Rail'][Math.floor(Math.random() * 4)],
      reason: 'Policy rule triggered based on merchant profile and transaction context',
    });
  }
  
  return triggers.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getPolicyPackById(id: string): PolicyPack | undefined {
  return policyPacks.find((pack) => pack.id === id);
}

export const ruleOperators = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'does not equal' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
  { value: 'in', label: 'is one of' },
  { value: 'not_in', label: 'is not one of' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
];

export const ruleFields = [
  { value: 'category', label: 'Merchant Category', type: 'select' },
  { value: 'riskScore', label: 'Risk Score', type: 'number' },
  { value: 'chargebackRate', label: 'Chargeback Rate', type: 'number' },
  { value: 'country', label: 'Transaction Country', type: 'select' },
  { value: 'businessModel', label: 'Business Model', type: 'select' },
  { value: 'license.gambling', label: 'Gambling License', type: 'boolean' },
  { value: 'ageVerification', label: 'Age Verification', type: 'boolean' },
  { value: 'dataSharing', label: 'Data Sharing', type: 'boolean' },
  { value: 'disputePattern', label: 'Dispute Pattern', type: 'boolean' },
  { value: 'refundRate', label: 'Refund Rate', type: 'number' },
];


