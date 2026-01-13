// Enhanced mock data for Merchant 360 tabs
import type { ScanSummary, Finding, MerchantOverview, Evidence } from '../components/merchant360/types';

// Generate risk trend series for last 30 days
function generateRiskTrend(baseScore: number): MerchantOverview['riskTrendSeries'] {
  const series: MerchantOverview['riskTrendSeries'] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 10;
    const score = Math.max(0, Math.min(100, baseScore + variation));
    
    let event: string | undefined;
    if (i === 7) event = 'Last scan';
    if (i === 14) event = 'Policy pack changed';
    
    series.push({ date, riskScore: score, event });
  }
  
  return series;
}

// Mock Merchant Overviews
export const merchantOverviewByMerchantId: Record<string, MerchantOverview> = {
  'M-1847': {
    declared: {
      category: 'Consumer Electronics',
      products: ['Smartphones', 'Tablets', 'Accessories'],
    },
    observed: {
      category: 'Consumer Electronics + Health Devices',
      products: ['Smartphones', 'Tablets', 'Accessories', 'EMF Blockers', 'Health Monitors', 'Smart Watches'],
      patterns: ['Subscription model', 'Affiliate funnels', 'Health claims'],
      narrative: 'Observed subscription + affiliate funnel behavior with health-adjacent product claims on landing pages. Some products make unsubstantiated health benefit claims.',
    },
    riskBreakdown: {
      content: { value: 35, severity: 'medium' },
      product: { value: 40, severity: 'high' },
      licensing: { value: 15, severity: 'low' },
      ugc: { value: 10, severity: 'low' },
    },
    riskTrendSeries: generateRiskTrend(87),
    monitoring: {
      enabled: true,
      cadence: 'daily',
      lastScan: new Date('2025-01-07T10:00:00'),
      driftDetected: true,
    },
  },
  'M-2103': {
    declared: {
      category: 'Fashion & Apparel',
      products: ['Clothing', 'Shoes', 'Accessories'],
    },
    observed: {
      category: 'Fashion Marketplace',
      products: ['Clothing', 'Shoes', 'Accessories', 'Designer Items', 'Vintage'],
      patterns: ['UGC content', 'Third-party sellers', 'Counterfeit risk'],
      narrative: 'Marketplace model with user-generated content and third-party sellers. Some listings may contain counterfeit designer items.',
    },
    riskBreakdown: {
      content: { value: 20, severity: 'low' },
      product: { value: 35, severity: 'medium' },
      licensing: { value: 25, severity: 'medium' },
      ugc: { value: 20, severity: 'medium' },
    },
    riskTrendSeries: generateRiskTrend(82),
    monitoring: {
      enabled: true,
      cadence: 'weekly',
      lastScan: new Date('2025-01-07T08:00:00'),
      driftDetected: false,
    },
  },
  // Add default data for all other merchants
  ...Object.fromEntries(
    ['M-1652', 'M-2891', 'M-3047', 'M-1928', 'M-2456', 'M-3182', 'M-4521', 'M-5103'].map(id => [
      id,
      {
        declared: {
          category: 'General Commerce',
          products: ['Various Products'],
        },
        observed: {
          category: 'General Commerce',
          products: ['Various Products', 'Digital Goods'],
          patterns: ['E-commerce', 'Standard checkout'],
          narrative: 'Standard e-commerce merchant with typical business patterns and moderate risk profile.',
        },
        riskBreakdown: {
          content: { value: 25, severity: 'low' as const },
          product: { value: 30, severity: 'medium' as const },
          licensing: { value: 20, severity: 'low' as const },
          ugc: { value: 15, severity: 'low' as const },
        },
        riskTrendSeries: generateRiskTrend(70),
        monitoring: {
          enabled: true,
          cadence: 'weekly' as const,
          lastScan: new Date('2025-01-07T08:00:00'),
          driftDetected: false,
        },
      }
    ])
  ),
};

// Mock Scan Summaries
export const merchantScansByMerchantId: Record<string, ScanSummary[]> = {
  'M-1847': [
    {
      id: 'scan-001',
      merchantId: 'M-1847',
      timestamp: new Date('2025-01-07T10:00:00'),
      type: 'scheduled',
      status: 'success',
      pagesScanned: 247,
      riskScore: 87,
      riskDelta: 5,
      deltaSummary: '+2 high findings, -1 resolved',
      findingIds: ['f-001', 'f-002', 'f-003', 'f-004', 'f-005'],
      url: 'https://techgadgets.io',
    },
    {
      id: 'scan-002',
      merchantId: 'M-1847',
      timestamp: new Date('2025-01-06T10:00:00'),
      type: 'scheduled',
      status: 'success',
      pagesScanned: 245,
      riskScore: 82,
      riskDelta: -3,
      deltaSummary: '+1 medium finding',
      findingIds: ['f-006', 'f-007'],
      url: 'https://techgadgets.io',
    },
    {
      id: 'scan-003',
      merchantId: 'M-1847',
      timestamp: new Date('2025-01-05T10:00:00'),
      type: 'manual',
      status: 'success',
      pagesScanned: 250,
      riskScore: 85,
      riskDelta: 0,
      deltaSummary: 'No change',
      findingIds: ['f-008'],
      url: 'https://techgadgets.io/new-products',
    },
    {
      id: 'scan-004',
      merchantId: 'M-1847',
      timestamp: new Date('2025-01-04T10:00:00'),
      type: 'scheduled',
      status: 'partial',
      pagesScanned: 180,
      riskScore: 85,
      riskDelta: 2,
      deltaSummary: '+1 critical finding',
      findingIds: ['f-009'],
      url: 'https://techgadgets.io',
    },
  ],
  'M-2103': [
    {
      id: 'scan-101',
      merchantId: 'M-2103',
      timestamp: new Date('2025-01-07T08:00:00'),
      type: 'scheduled',
      status: 'success',
      pagesScanned: 412,
      riskScore: 82,
      riskDelta: 3,
      deltaSummary: '+3 medium findings',
      findingIds: ['f-101', 'f-102', 'f-103'],
      url: 'https://fashionhub.eu',
    },
    {
      id: 'scan-102',
      merchantId: 'M-2103',
      timestamp: new Date('2024-12-31T08:00:00'),
      type: 'scheduled',
      status: 'success',
      pagesScanned: 408,
      riskScore: 79,
      riskDelta: 0,
      deltaSummary: 'No change',
      findingIds: ['f-104'],
      url: 'https://fashionhub.eu',
    },
  ],
  // Add default scans for other merchants
  ...Object.fromEntries(
    ['M-1652', 'M-2891', 'M-3047', 'M-1928', 'M-2456', 'M-3182', 'M-4521', 'M-5103'].map(id => [
      id,
      [
        {
          id: `scan-${id}-001`,
          merchantId: id,
          timestamp: new Date('2025-01-07T10:00:00'),
          type: 'scheduled' as const,
          status: 'success' as const,
          pagesScanned: Math.floor(Math.random() * 200) + 100,
          riskScore: Math.floor(Math.random() * 40) + 40,
          riskDelta: Math.floor(Math.random() * 11) - 5,
          deltaSummary: '+1 medium finding',
          findingIds: [`f-${id}-001`],
          url: `https://merchant-${id}.com`,
        },
      ]
    ])
  ),
};

// Mock Findings
export const merchantFindingsByMerchantId: Record<string, Finding[]> = {
  'M-1847': [
    {
      id: 'f-001',
      scanId: 'scan-001',
      merchantId: 'M-1847',
      title: 'Unsubstantiated health claims on product pages',
      description: 'Multiple product listings contain health benefit claims that are not supported by scientific evidence or regulatory approval.',
      severity: 'high',
      surface: 'website',
      policyTags: ['Health claims', 'Regulatory', 'Misleading'],
      confidence: 92,
      whySnippet: 'Detected phrases like "blocks harmful EMF radiation" and "improves blood circulation" without FDA disclaimers or scientific backing.',
      suggestedAction: 'review',
      remediationBullets: [
        'Add FDA disclaimers to all health-related product claims',
        'Remove or substantiate claims about EMF protection',
        'Update product descriptions to comply with FTC guidelines',
      ],
      evidence: [
        {
          id: 'e-001',
          type: 'screenshot',
          url: 'https://techgadgets.io/emf-blocker',
          timestamp: new Date('2025-01-07T10:05:00'),
          snippet: 'Product page for "EMF Shield Pro"',
          highlightedText: 'Blocks 99% of harmful EMF radiation and improves your health',
        },
        {
          id: 'e-002',
          type: 'text',
          url: 'https://techgadgets.io/smart-watch-health',
          timestamp: new Date('2025-01-07T10:08:00'),
          snippet: 'Product description contains: "Clinically proven to improve blood circulation and reduce stress"',
        },
        {
          id: 'e-003',
          type: 'screenshot',
          url: 'https://techgadgets.io/health-monitor',
          timestamp: new Date('2025-01-07T10:12:00'),
          snippet: 'Health monitor product page with unverified medical claims',
        },
      ],
      isNew: true,
    },
    {
      id: 'f-002',
      scanId: 'scan-001',
      merchantId: 'M-1847',
      title: 'Missing license information for medical devices',
      description: 'Products classified as medical devices lack required licensing and certification information.',
      severity: 'high',
      surface: 'website',
      policyTags: ['Licensing', 'Medical devices', 'Compliance'],
      confidence: 88,
      whySnippet: 'Products marketed as health monitors and diagnostic tools do not display FDA clearance or CE marking.',
      suggestedAction: 'review',
      remediationBullets: [
        'Verify FDA clearance for medical devices',
        'Display required certifications prominently',
        'Update product categories to reflect medical device classification',
      ],
      evidence: [
        {
          id: 'e-004',
          type: 'screenshot',
          url: 'https://techgadgets.io/blood-pressure-monitor',
          timestamp: new Date('2025-01-07T10:15:00'),
          snippet: 'Blood pressure monitor without FDA clearance information',
        },
        {
          id: 'e-005',
          type: 'text',
          url: 'https://techgadgets.io/about-certifications',
          timestamp: new Date('2025-01-07T10:20:00'),
          snippet: 'Certifications page does not mention FDA or CE marking',
        },
      ],
      isNew: true,
    },
    {
      id: 'f-003',
      scanId: 'scan-001',
      merchantId: 'M-1847',
      title: 'Subscription terms not clearly disclosed',
      description: 'Automatic renewal and subscription terms are not prominently displayed during checkout.',
      severity: 'medium',
      surface: 'checkout',
      policyTags: ['Subscription', 'Disclosure', 'Consumer protection'],
      confidence: 85,
      whySnippet: 'Checkout flow does not clearly indicate that purchase includes automatic monthly renewal.',
      suggestedAction: 'review',
      remediationBullets: [
        'Add clear subscription disclosure on checkout page',
        'Require explicit consent for automatic renewals',
        'Provide easy cancellation mechanism',
      ],
      evidence: [
        {
          id: 'e-006',
          type: 'screenshot',
          url: 'https://techgadgets.io/checkout',
          timestamp: new Date('2025-01-07T10:25:00'),
          snippet: 'Checkout page with small subscription fine print',
        },
      ],
    },
    {
      id: 'f-004',
      scanId: 'scan-001',
      merchantId: 'M-1847',
      title: 'Affiliate disclosure missing on review pages',
      description: 'Product reviews and comparisons do not disclose affiliate relationships.',
      severity: 'medium',
      surface: 'website',
      policyTags: ['Affiliate', 'Disclosure', 'FTC compliance'],
      confidence: 78,
      whySnippet: 'Review content contains affiliate links without FTC-required disclosure.',
      suggestedAction: 'approve',
      remediationBullets: [
        'Add affiliate disclosure to all review pages',
        'Comply with FTC endorsement guidelines',
      ],
      evidence: [
        {
          id: 'e-007',
          type: 'text',
          url: 'https://techgadgets.io/reviews/best-tablets-2025',
          timestamp: new Date('2025-01-07T10:30:00'),
          snippet: 'Review page with affiliate links but no disclosure',
        },
      ],
    },
    {
      id: 'f-005',
      scanId: 'scan-001',
      merchantId: 'M-1847',
      title: 'High chargeback rate correlation with EMF products',
      description: 'Products in the EMF protection category show elevated chargeback rates.',
      severity: 'low',
      surface: 'website',
      policyTags: ['Chargeback', 'Product quality'],
      confidence: 65,
      whySnippet: 'Chargeback data shows 3.2% rate for EMF protection products vs 0.8% overall.',
      suggestedAction: 'approve',
      remediationBullets: [
        'Review product descriptions for accuracy',
        'Improve customer expectations management',
      ],
      evidence: [],
    },
  ],
  'M-2103': [
    {
      id: 'f-101',
      scanId: 'scan-101',
      merchantId: 'M-2103',
      title: 'Potential counterfeit designer items detected',
      description: 'Multiple listings for designer items at significantly below-market prices suggest potential counterfeits.',
      severity: 'critical',
      surface: 'website',
      policyTags: ['Counterfeit', 'Trademark', 'Copyright'],
      confidence: 94,
      whySnippet: 'Listings for luxury brand items at 70-90% below retail prices without authentication.',
      suggestedAction: 'reject',
      remediationBullets: [
        'Implement authentication process for designer items',
        'Remove unverified luxury brand listings',
        'Add seller verification requirements',
      ],
      evidence: [
        {
          id: 'e-101',
          type: 'screenshot',
          url: 'https://fashionhub.eu/listing/designer-bag-123',
          timestamp: new Date('2025-01-07T08:10:00'),
          snippet: 'Designer bag listed at $200 (retail $2000)',
        },
        {
          id: 'e-102',
          type: 'screenshot',
          url: 'https://fashionhub.eu/listing/luxury-watch-456',
          timestamp: new Date('2025-01-07T08:15:00'),
          snippet: 'Luxury watch with suspicious pricing',
        },
      ],
      isNew: true,
    },
    {
      id: 'f-102',
      scanId: 'scan-101',
      merchantId: 'M-2103',
      title: 'User-generated content moderation gaps',
      description: 'Seller profiles and product descriptions contain inappropriate or misleading content.',
      severity: 'medium',
      surface: 'ugc',
      policyTags: ['UGC', 'Moderation', 'Content policy'],
      confidence: 82,
      whySnippet: 'Detected unmoderated user content with external links and inappropriate language.',
      suggestedAction: 'review',
      remediationBullets: [
        'Implement automated content moderation',
        'Review and approve seller profiles before activation',
        'Block external links in product descriptions',
      ],
      evidence: [
        {
          id: 'e-103',
          type: 'text',
          url: 'https://fashionhub.eu/seller/store123',
          timestamp: new Date('2025-01-07T08:20:00'),
          snippet: 'Seller profile with external payment links',
        },
      ],
    },
    {
      id: 'f-103',
      scanId: 'scan-101',
      merchantId: 'M-2103',
      title: 'Missing return policy information',
      description: 'Some product listings do not clearly state return and refund policies.',
      severity: 'low',
      surface: 'website',
      policyTags: ['Consumer protection', 'Policy disclosure'],
      confidence: 75,
      whySnippet: 'Return policy link missing or unclear on 15% of product pages.',
      suggestedAction: 'approve',
      remediationBullets: [
        'Add return policy link to all product pages',
        'Ensure policy is clear and accessible',
      ],
      evidence: [],
    },
  ],
  // Add default findings for other merchants
  ...Object.fromEntries(
    ['M-1652', 'M-2891', 'M-3047', 'M-1928', 'M-2456', 'M-3182', 'M-4521', 'M-5103'].map(id => [
      id,
      [
        {
          id: `f-${id}-001`,
          scanId: `scan-${id}-001`,
          merchantId: id,
          title: 'Standard compliance check',
          description: 'Routine compliance verification completed successfully with minor observations.',
          severity: 'low' as const,
          surface: 'website' as const,
          policyTags: ['Compliance', 'Standard check'],
          confidence: 75,
          whySnippet: 'Standard merchant operations detected with typical business patterns.',
          suggestedAction: 'approve' as const,
          remediationBullets: ['Continue monitoring'],
          evidence: [],
        },
      ]
    ])
  ),
};

// Helper to get all findings for a merchant
export function getMerchantFindings(merchantId: string): Finding[] {
  return merchantFindingsByMerchantId[merchantId] || [];
}

// Helper to get top N findings by severity
export function getTopFindings(merchantId: string, limit: number = 5): Finding[] {
  const findings = getMerchantFindings(merchantId);
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  
  return findings
    .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])
    .slice(0, limit);
}

// Helper to get scans for a merchant
export function getMerchantScans(merchantId: string): ScanSummary[] {
  return merchantScansByMerchantId[merchantId] || [];
}

// Helper to get merchant overview
export function getMerchantOverview(merchantId: string): MerchantOverview | null {
  return merchantOverviewByMerchantId[merchantId] || null;
}

