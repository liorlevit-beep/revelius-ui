// Raw scan report format (simulating API response)
export interface RawScanReport {
  scan_id: string;
  merchant_id?: string;
  url: string;
  timestamp: string;
  status: 'success' | 'partial' | 'failed';
  type: 'onboarding' | 'scheduled' | 'manual';
  config: {
    profile: string;
    crawl_depth: number;
    region: string;
  };
  overall_risk_score: number;
  risk_explanation: string;
  categories_detected: Array<{
    category: string;
    confidence: number;
  }>;
  risk_breakdown: {
    content: number;
    product: number;
    licensing: number;
    ugc: number;
  };
  findings: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
    surface: 'website' | 'app' | 'ugc' | 'checkout';
    policy_tags: string[];
    why_snippet: string;
    evidence_ids: string[];
    source_urls: string[];
    suggested_action: string;
    timestamp: string;
  }>;
  evidence: Array<{
    id: string;
    type: 'screenshot' | 'text' | 'html' | 'video';
    url: string;
    snippet: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
  coverage: {
    pages_crawled: number;
    products_parsed: number;
    media_items: number;
    ugc_samples: number;
    forms_detected: number;
    urls_crawled: string[];
  };
}

export interface ScanIndexItem {
  id: string;
  merchantId?: string;
  merchantName?: string;
  domain: string;
  url: string;
  timestamp: Date;
  status: 'success' | 'partial' | 'failed';
  type: 'onboarding' | 'scheduled' | 'manual';
  pagesScanned: number;
  riskScore: number;
  topTriggers: string[];
  category?: string;
}

// Mock raw scan reports
export const rawScanReportsById: Record<string, RawScanReport> = {
  'S-8471': {
    scan_id: 'S-8471',
    merchant_id: 'M-1847',
    url: 'https://techgadgets.io',
    timestamp: '2026-01-07T10:00:00Z',
    status: 'success',
    type: 'manual',
    config: {
      profile: 'Balanced',
      crawl_depth: 2,
      region: 'US',
    },
    overall_risk_score: 87,
    risk_explanation: 'High risk due to unsubstantiated health claims and misleading product information. Multiple FDA violations detected.',
    categories_detected: [
      { category: 'Consumer Electronics', confidence: 95 },
      { category: 'Health & Wellness', confidence: 78 },
      { category: 'Questionable Medical Devices', confidence: 65 },
    ],
    risk_breakdown: {
      content: 35,
      product: 40,
      licensing: 15,
      ugc: 10,
    },
    findings: [
      {
        id: 'F-8471-001',
        title: 'Unsubstantiated health claims on product pages',
        description: 'Multiple product listings contain health benefit claims ("blocks 99% of harmful EMF radiation", "clinically proven to improve sleep") without FDA approval or scientific backing. These claims violate FDA regulations for medical device marketing.',
        severity: 'critical',
        confidence: 95,
        surface: 'website',
        policy_tags: ['FDA Health Claims', 'Medical Device', 'False Advertising'],
        why_snippet: 'Products marketed with medical claims require FDA clearance',
        evidence_ids: ['E-001', 'E-002', 'E-003'],
        source_urls: ['https://techgadgets.io/products/emf-blocker', 'https://techgadgets.io/products/sleep-tracker-pro'],
        suggested_action: 'Require merchant to remove health claims or provide FDA clearance documentation. Consider restricting until compliance.',
        timestamp: '2026-01-07T10:15:23Z',
      },
      {
        id: 'F-8471-002',
        title: 'Misleading geographic shipping restrictions',
        description: 'Site homepage and product pages claim "worldwide shipping available" but checkout flow restricts deliveries to certain countries without prior disclosure. This constitutes deceptive advertising.',
        severity: 'high',
        confidence: 88,
        surface: 'checkout',
        policy_tags: ['Geographic Restrictions', 'Deceptive Practices', 'Consumer Protection'],
        why_snippet: 'Material shipping restrictions must be disclosed upfront',
        evidence_ids: ['E-004', 'E-005'],
        source_urls: ['https://techgadgets.io/shipping-policy', 'https://techgadgets.io/checkout'],
        suggested_action: 'Require upfront disclosure of shipping restrictions on product pages',
        timestamp: '2026-01-07T10:18:45Z',
      },
      {
        id: 'F-8471-003',
        title: 'Suspicious user review patterns',
        description: 'Detected 47 five-star reviews posted within 24 hours of product launch for "Tablet Pro X". Review text shows high similarity (87% avg) suggesting automated generation or coordinated posting.',
        severity: 'high',
        confidence: 82,
        surface: 'ugc',
        policy_tags: ['Review Manipulation', 'Fake Reviews', 'Consumer Trust'],
        why_snippet: 'Artificial review inflation violates platform policies',
        evidence_ids: ['E-006', 'E-007'],
        source_urls: ['https://techgadgets.io/products/tablet-pro-x/reviews'],
        suggested_action: 'Flag for manual review; consider requiring review moderation',
        timestamp: '2026-01-07T10:22:11Z',
      },
      {
        id: 'F-8471-004',
        title: 'Pre-checked upsell boxes at checkout',
        description: 'Checkout flow includes pre-checked boxes for premium shipping ($19.99) and extended warranty ($49.99). FTC guidelines require opt-in consent for additional charges.',
        severity: 'high',
        confidence: 98,
        surface: 'checkout',
        policy_tags: ['FTC Fair Practices', 'Deceptive Charges', 'Consent'],
        why_snippet: 'Pre-selected add-ons violate FTC consent requirements',
        evidence_ids: ['E-008'],
        source_urls: ['https://techgadgets.io/checkout/step-2'],
        suggested_action: 'Require opt-in checkboxes (unchecked by default)',
        timestamp: '2026-01-07T10:25:33Z',
      },
      {
        id: 'F-8471-005',
        title: 'Incomplete return policy disclosure',
        description: 'Return policy contradicts checkout messaging. Checkout says "30-day money back guarantee" but footer policy indicates "store credit only, no refunds". Policy buried in fine print.',
        severity: 'medium',
        confidence: 90,
        surface: 'website',
        policy_tags: ['Return Policy', 'Consumer Protection', 'Disclosure'],
        why_snippet: 'Inconsistent refund terms create consumer confusion',
        evidence_ids: ['E-009', 'E-010'],
        source_urls: ['https://techgadgets.io/returns', 'https://techgadgets.io/checkout'],
        suggested_action: 'Require prominent, consistent return policy disclosure',
        timestamp: '2026-01-07T10:28:15Z',
      },
      {
        id: 'F-8471-006',
        title: 'Missing privacy policy link in data collection form',
        description: 'Email signup form collects personal data without privacy policy link. GDPR/CCPA require privacy notice at point of collection.',
        severity: 'medium',
        confidence: 100,
        surface: 'website',
        policy_tags: ['GDPR', 'CCPA', 'Privacy', 'Data Collection'],
        why_snippet: 'Data collection requires privacy policy disclosure',
        evidence_ids: ['E-011'],
        source_urls: ['https://techgadgets.io/newsletter'],
        suggested_action: 'Add privacy policy link to all data collection forms',
        timestamp: '2026-01-07T10:30:42Z',
      },
    ],
    evidence: [
      {
        id: 'E-001',
        type: 'screenshot',
        url: 'https://techgadgets.io/products/emf-blocker',
        snippet: 'Product description: "Scientifically proven to block 99% of harmful EMF radiation. Clinically tested by independent labs. Improves sleep quality and reduces headaches."',
        timestamp: '2026-01-07T10:15:23Z',
      },
      {
        id: 'E-002',
        type: 'text',
        url: 'https://techgadgets.io/products/sleep-tracker-pro',
        snippet: 'Featured claim: "FDA-approved technology" - No FDA clearance found in FDA database search.',
        timestamp: '2026-01-07T10:15:45Z',
      },
      {
        id: 'E-003',
        type: 'html',
        url: 'https://techgadgets.io/products/emf-blocker',
        snippet: '<div class="health-claims"><h3>Health Benefits</h3><ul><li>Reduces EMF exposure by 99%</li><li>Improves sleep quality</li><li>Reduces migraine frequency</li></ul></div>',
        timestamp: '2026-01-07T10:16:12Z',
      },
      {
        id: 'E-004',
        type: 'screenshot',
        url: 'https://techgadgets.io/shipping-policy',
        snippet: 'Homepage banner: "FREE WORLDWIDE SHIPPING ON ALL ORDERS"',
        timestamp: '2026-01-07T10:18:45Z',
      },
      {
        id: 'E-005',
        type: 'screenshot',
        url: 'https://techgadgets.io/checkout',
        snippet: 'Checkout error: "Sorry, we do not ship to your selected country (Germany)"',
        timestamp: '2026-01-07T10:19:02Z',
      },
      {
        id: 'E-006',
        type: 'text',
        url: 'https://techgadgets.io/products/tablet-pro-x/reviews',
        snippet: 'Review analysis: 47 reviews posted 2026-01-06 14:00-23:59. Average text similarity: 87%. Common phrases: "amazing product", "exceeded expectations", "fast shipping".',
        timestamp: '2026-01-07T10:22:11Z',
      },
      {
        id: 'E-007',
        type: 'text',
        url: 'https://techgadgets.io/products/tablet-pro-x/reviews',
        snippet: 'Sample review 1: "Amazing product! Exceeded all my expectations. Fast shipping too!"\nSample review 2: "This product is amazing! It exceeded my expectations and shipping was fast!"',
        timestamp: '2026-01-07T10:22:33Z',
      },
      {
        id: 'E-008',
        type: 'html',
        url: 'https://techgadgets.io/checkout/step-2',
        snippet: '<input type="checkbox" id="premium-shipping" checked> Premium Shipping (+$19.99)\n<input type="checkbox" id="warranty" checked> Extended Warranty (+$49.99)',
        timestamp: '2026-01-07T10:25:33Z',
      },
      {
        id: 'E-009',
        type: 'screenshot',
        url: 'https://techgadgets.io/checkout',
        snippet: 'Checkout page: "30-day money back guarantee - shop with confidence!"',
        timestamp: '2026-01-07T10:28:15Z',
      },
      {
        id: 'E-010',
        type: 'text',
        url: 'https://techgadgets.io/returns',
        snippet: 'Returns policy (footer): "All returns are for store credit only. No cash refunds. Return shipping costs are deducted from credit."',
        timestamp: '2026-01-07T10:28:42Z',
      },
      {
        id: 'E-011',
        type: 'screenshot',
        url: 'https://techgadgets.io/newsletter',
        snippet: 'Newsletter signup form with email input field. No privacy policy link visible.',
        timestamp: '2026-01-07T10:30:42Z',
      },
    ],
    coverage: {
      pages_crawled: 245,
      products_parsed: 127,
      media_items: 892,
      ugc_samples: 1543,
      forms_detected: 8,
      urls_crawled: [
        'https://techgadgets.io/',
        'https://techgadgets.io/products',
        'https://techgadgets.io/products/emf-blocker',
        'https://techgadgets.io/products/tablet-pro-x',
        'https://techgadgets.io/products/sleep-tracker-pro',
        'https://techgadgets.io/checkout',
        'https://techgadgets.io/shipping-policy',
        'https://techgadgets.io/returns',
        // ... more URLs
      ],
    },
  },
  'S-9001': {
    scan_id: 'S-9001',
    merchant_id: 'M-2103',
    url: 'https://fashionhub.eu',
    timestamp: '2026-01-07T08:00:00Z',
    status: 'success',
    type: 'scheduled',
    config: {
      profile: 'Balanced',
      crawl_depth: 3,
      region: 'EU',
    },
    overall_risk_score: 82,
    risk_explanation: 'Moderate-high risk due to marketplace model with insufficient UGC moderation and policy updates.',
    categories_detected: [
      { category: 'Fashion & Apparel', confidence: 98 },
      { category: 'Marketplace', confidence: 95 },
    ],
    risk_breakdown: {
      content: 20,
      product: 25,
      licensing: 10,
      ugc: 45,
    },
    findings: [
      {
        id: 'F-9001-001',
        title: 'Counterfeit product listings detected',
        description: 'Found 12 listings for luxury brand items at significantly below-market prices with suspicious imagery.',
        severity: 'critical',
        confidence: 87,
        surface: 'website',
        policy_tags: ['Counterfeit', 'Intellectual Property', 'Marketplace'],
        why_snippet: 'Counterfeit goods violate IP rights and platform policies',
        evidence_ids: ['E-101', 'E-102'],
        source_urls: ['https://fashionhub.eu/seller/fastdeals/products'],
        suggested_action: 'Remove listings and review seller verification process',
        timestamp: '2026-01-07T08:12:15Z',
      },
      {
        id: 'F-9001-002',
        title: 'Inadequate UGC moderation',
        description: 'User-generated reviews contain inappropriate content and spam. No visible moderation policy.',
        severity: 'medium',
        confidence: 75,
        surface: 'ugc',
        policy_tags: ['UGC Moderation', 'Content Policy'],
        why_snippet: 'Unmoderated UGC creates liability and trust issues',
        evidence_ids: ['E-103'],
        source_urls: ['https://fashionhub.eu/reviews'],
        suggested_action: 'Implement automated content filters and review queue',
        timestamp: '2026-01-07T08:15:30Z',
      },
    ],
    evidence: [
      {
        id: 'E-101',
        type: 'screenshot',
        url: 'https://fashionhub.eu/seller/fastdeals/products',
        snippet: 'Luxury handbag listed at $89 (retail: $2,500). Stock photo quality low.',
        timestamp: '2026-01-07T08:12:15Z',
      },
      {
        id: 'E-102',
        type: 'text',
        url: 'https://fashionhub.eu/seller/fastdeals',
        snippet: 'Seller joined: 2026-01-02. Total sales: 3. Reviews: 0. Verification: None.',
        timestamp: '2026-01-07T08:12:45Z',
      },
      {
        id: 'E-103',
        type: 'text',
        url: 'https://fashionhub.eu/reviews',
        snippet: 'Recent review contains spam URLs and promotional content. Posted 2 hours ago, still visible.',
        timestamp: '2026-01-07T08:15:30Z',
      },
    ],
    coverage: {
      pages_crawled: 512,
      products_parsed: 3421,
      media_items: 12453,
      ugc_samples: 8932,
      forms_detected: 15,
      urls_crawled: [
        'https://fashionhub.eu/',
        'https://fashionhub.eu/products',
        'https://fashionhub.eu/seller/fastdeals',
        // ... more URLs
      ],
    },
  },
  'S-7213': {
    scan_id: 'S-7213',
    merchant_id: 'M-3401',
    url: 'https://fitmax-supplements.com',
    timestamp: '2026-01-06T14:30:00Z',
    status: 'success',
    type: 'onboarding',
    config: {
      profile: 'Strict',
      crawl_depth: 3,
      region: 'US',
    },
    overall_risk_score: 92,
    risk_explanation: 'Critical risk due to illegal drug claims, banned substances, and severe regulatory violations. Multiple Schedule III substances advertised without prescription requirements.',
    categories_detected: [
      { category: 'Supplements', confidence: 98 },
      { category: 'Pharmaceuticals (unlicensed)', confidence: 85 },
      { category: 'Adult Performance Enhancement', confidence: 72 },
    ],
    risk_breakdown: {
      content: 45,
      product: 40,
      licensing: 10,
      ugc: 5,
    },
    findings: [
      {
        id: 'F-7213-001',
        title: 'Sale of prescription-only substances without license',
        description: 'Site offers substances classified as Schedule III controlled substances (anabolic steroids) without requiring prescription or medical authorization. This constitutes illegal drug distribution.',
        severity: 'critical',
        confidence: 98,
        surface: 'website',
        policy_tags: ['Controlled Substances', 'DEA Violation', 'Illegal Pharmaceuticals'],
        why_snippet: 'Schedule III substances require DEA registration and prescriptions',
        evidence_ids: ['E-7213-001', 'E-7213-002', 'E-7213-003'],
        source_urls: ['https://fitmax-supplements.com/products/muscle-max-pro', 'https://fitmax-supplements.com/products/ultra-andro'],
        suggested_action: 'Immediate suspension. Report to regulatory authorities.',
        timestamp: '2026-01-06T14:35:00Z',
      },
      {
        id: 'F-7213-002',
        title: 'FDA unapproved drug claims',
        description: 'Products claim to "cure erectile dysfunction", "increase testosterone by 400%", and "build muscle mass 3x faster" - all claims requiring FDA approval for drug marketing.',
        severity: 'critical',
        confidence: 96,
        surface: 'website',
        policy_tags: ['FDA Drug Claims', 'Unapproved New Drugs', 'Medical Claims'],
        why_snippet: 'Products making drug claims must be FDA-approved',
        evidence_ids: ['E-7213-004', 'E-7213-005'],
        source_urls: ['https://fitmax-supplements.com/products/test-boost-xtreme'],
        suggested_action: 'Immediate suspension. Require FDA compliance.',
        timestamp: '2026-01-06T14:40:00Z',
      },
      {
        id: 'F-7213-003',
        title: 'False celebrity endorsements',
        description: 'Site displays images of professional athletes with fake testimonials. Image reverse search confirms these are stock photos and copyrighted images used without permission.',
        severity: 'high',
        confidence: 94,
        surface: 'website',
        policy_tags: ['False Endorsement', 'Copyright Infringement', 'Deceptive Marketing'],
        why_snippet: 'Fake celebrity endorsements violate FTC guidelines',
        evidence_ids: ['E-7213-006', 'E-7213-007'],
        source_urls: ['https://fitmax-supplements.com/testimonials'],
        suggested_action: 'Require removal of all fake testimonials',
        timestamp: '2026-01-06T14:45:00Z',
      },
      {
        id: 'F-7213-004',
        title: 'Missing FDA disclaimer on supplements',
        description: 'Dietary supplements lack required FDA disclaimer: "These statements have not been evaluated by the FDA." This disclaimer is mandatory under DSHEA.',
        severity: 'high',
        confidence: 100,
        surface: 'website',
        policy_tags: ['FDA Compliance', 'Supplement Regulations', 'Required Disclosures'],
        why_snippet: 'Supplement marketing requires FDA disclaimer',
        evidence_ids: ['E-7213-008'],
        source_urls: ['https://fitmax-supplements.com/products/protein-ultra'],
        suggested_action: 'Require FDA disclaimer on all supplement products',
        timestamp: '2026-01-06T14:50:00Z',
      },
      {
        id: 'F-7213-005',
        title: 'Banned substance ingredients detected',
        description: 'Product ingredient lists include DMAA (dimethylamylamine), a substance banned by the FDA since 2013. Continued sale after ban constitutes adulteration.',
        severity: 'critical',
        confidence: 90,
        surface: 'website',
        policy_tags: ['Banned Substances', 'FDA Adulteration', 'Public Health'],
        why_snippet: 'Sale of FDA-banned substances is illegal',
        evidence_ids: ['E-7213-009'],
        source_urls: ['https://fitmax-supplements.com/products/pre-workout-extreme'],
        suggested_action: 'Immediate suspension. Report to FDA.',
        timestamp: '2026-01-06T14:55:00Z',
      },
    ],
    evidence: [
      {
        id: 'E-7213-001',
        type: 'screenshot',
        url: 'https://fitmax-supplements.com/products/muscle-max-pro',
        snippet: 'Product page for "Muscle Max Pro" - contains testosterone cypionate (Schedule III controlled substance)',
        timestamp: '2026-01-06T14:35:00Z',
        metadata: { substance: 'testosterone cypionate', dea_schedule: 'III' },
      },
      {
        id: 'E-7213-002',
        type: 'text',
        url: 'https://fitmax-supplements.com/products/ultra-andro',
        snippet: 'Product description: "Contains pharmaceutical-grade anabolic compounds. No prescription needed. Discreet shipping."',
        timestamp: '2026-01-06T14:36:00Z',
      },
      {
        id: 'E-7213-003',
        type: 'html',
        url: 'https://fitmax-supplements.com/products/muscle-max-pro',
        snippet: '<div class="ingredients"><h4>Active Ingredients</h4><ul><li>Testosterone Cypionate 200mg</li><li>Nandrolone Decanoate 100mg</li></ul></div>',
        timestamp: '2026-01-06T14:37:00Z',
      },
      {
        id: 'E-7213-004',
        type: 'screenshot',
        url: 'https://fitmax-supplements.com/products/test-boost-xtreme',
        snippet: 'Product claim: "Clinically proven to increase testosterone levels by 400% in 30 days. Cures low T and ED."',
        timestamp: '2026-01-06T14:40:00Z',
      },
      {
        id: 'E-7213-005',
        type: 'text',
        url: 'https://fitmax-supplements.com/products/test-boost-xtreme',
        snippet: 'Marketing text: "Build muscle 3x faster. Guaranteed results. Replaces prescription TRT."',
        timestamp: '2026-01-06T14:41:00Z',
      },
      {
        id: 'E-7213-006',
        type: 'screenshot',
        url: 'https://fitmax-supplements.com/testimonials',
        snippet: 'Page shows images of 3 professional athletes with testimonials. Reverse image search confirms stock photos.',
        timestamp: '2026-01-06T14:45:00Z',
        metadata: { stock_photo_source: 'Getty Images' },
      },
      {
        id: 'E-7213-007',
        type: 'text',
        url: 'https://fitmax-supplements.com/testimonials',
        snippet: 'Testimonial attributed to "Pro Athlete John D." - Image confirmed as stock photo model, not athlete.',
        timestamp: '2026-01-06T14:46:00Z',
      },
      {
        id: 'E-7213-008',
        type: 'screenshot',
        url: 'https://fitmax-supplements.com/products/protein-ultra',
        snippet: 'Product page lacks required FDA disclaimer for dietary supplements.',
        timestamp: '2026-01-06T14:50:00Z',
      },
      {
        id: 'E-7213-009',
        type: 'html',
        url: 'https://fitmax-supplements.com/products/pre-workout-extreme',
        snippet: '<div class="supplement-facts"><tr><td>1,3-Dimethylamylamine (DMAA)</td><td>75mg</td></tr></div>',
        timestamp: '2026-01-06T14:55:00Z',
        metadata: { banned_substance: 'DMAA', fda_ban_date: '2013-04-11' },
      },
    ],
    coverage: {
      pages_crawled: 187,
      products_parsed: 94,
      media_items: 432,
      ugc_samples: 156,
      forms_detected: 5,
      urls_crawled: [
        'https://fitmax-supplements.com/',
        'https://fitmax-supplements.com/products',
        'https://fitmax-supplements.com/products/muscle-max-pro',
        'https://fitmax-supplements.com/products/ultra-andro',
        'https://fitmax-supplements.com/products/test-boost-xtreme',
        'https://fitmax-supplements.com/testimonials',
        'https://fitmax-supplements.com/about',
        'https://fitmax-supplements.com/shipping',
      ],
    },
  },
  'S-6891': {
    scan_id: 'S-6891',
    merchant_id: 'M-2847',
    url: 'https://lucky-slots-online.io',
    timestamp: '2026-01-05T18:00:00Z',
    status: 'success',
    type: 'manual',
    config: {
      profile: 'Strict',
      crawl_depth: 2,
      region: 'US',
    },
    overall_risk_score: 95,
    risk_explanation: 'Critical risk: unlicensed gambling operation targeting restricted jurisdictions. No gaming license, age verification, or responsible gambling controls. Multiple AML red flags.',
    categories_detected: [
      { category: 'Online Gambling', confidence: 99 },
      { category: 'Cryptocurrency Payment', confidence: 88 },
      { category: 'Offshore Operation', confidence: 82 },
    ],
    risk_breakdown: {
      content: 30,
      product: 20,
      licensing: 45,
      ugc: 5,
    },
    findings: [
      {
        id: 'F-6891-001',
        title: 'Unlicensed gambling operation in restricted jurisdiction',
        description: 'Site operates online casino and sports betting without valid gaming license. Accepts US customers from states where online gambling is illegal. No license from any recognized gaming authority.',
        severity: 'critical',
        confidence: 99,
        surface: 'website',
        policy_tags: ['Unlicensed Gambling', 'Illegal Gaming', 'Jurisdiction Violation'],
        why_snippet: 'Online gambling requires valid gaming license and geo-restrictions',
        evidence_ids: ['E-6891-001', 'E-6891-002'],
        source_urls: ['https://lucky-slots-online.io/', 'https://lucky-slots-online.io/about-us'],
        suggested_action: 'Immediate suspension. Report to gaming authorities.',
        timestamp: '2026-01-05T18:05:00Z',
      },
      {
        id: 'F-6891-002',
        title: 'No age verification mechanism',
        description: 'Site lacks mandatory age verification. Users can create accounts and deposit funds without any age check. Terms claim "18+" but no technical controls enforce this.',
        severity: 'critical',
        confidence: 100,
        surface: 'website',
        policy_tags: ['Age Verification', 'Underage Gambling', 'Regulatory Compliance'],
        why_snippet: 'Gambling sites must implement robust age verification',
        evidence_ids: ['E-6891-003', 'E-6891-004'],
        source_urls: ['https://lucky-slots-online.io/signup'],
        suggested_action: 'Immediate suspension until age verification implemented',
        timestamp: '2026-01-05T18:10:00Z',
      },
      {
        id: 'F-6891-003',
        title: 'Missing responsible gambling controls',
        description: 'No deposit limits, self-exclusion tools, or responsible gambling resources. Site actively encourages high-risk behavior with "Double or Nothing" features.',
        severity: 'critical',
        confidence: 95,
        surface: 'website',
        policy_tags: ['Responsible Gambling', 'Player Protection', 'Regulatory Requirements'],
        why_snippet: 'Licensed gambling operators must provide player protection tools',
        evidence_ids: ['E-6891-005'],
        source_urls: ['https://lucky-slots-online.io/account'],
        suggested_action: 'Require responsible gambling controls',
        timestamp: '2026-01-05T18:15:00Z',
      },
      {
        id: 'F-6891-004',
        title: 'Cryptocurrency-only payments to avoid AML',
        description: 'Site only accepts cryptocurrency payments and explicitly advertises "anonymous deposits" and "no ID required". This structure is designed to avoid AML/KYC regulations.',
        severity: 'critical',
        confidence: 92,
        surface: 'website',
        policy_tags: ['AML Evasion', 'KYC Violation', 'Anonymous Transactions'],
        why_snippet: 'Gambling operators must implement AML/KYC controls',
        evidence_ids: ['E-6891-006', 'E-6891-007'],
        source_urls: ['https://lucky-slots-online.io/deposit'],
        suggested_action: 'Immediate suspension. Report to FinCEN.',
        timestamp: '2026-01-05T18:20:00Z',
      },
      {
        id: 'F-6891-005',
        title: 'False licensing claims',
        description: 'Site displays a fake "Curacao Gaming License" badge. License number verification shows no such license exists in Curacao Gaming Control Board database.',
        severity: 'critical',
        confidence: 97,
        surface: 'website',
        policy_tags: ['False Licensing', 'Fraud', 'Deceptive Practices'],
        why_snippet: 'Displaying fake gambling licenses is fraud',
        evidence_ids: ['E-6891-008'],
        source_urls: ['https://lucky-slots-online.io/'],
        suggested_action: 'Report for fraud investigation',
        timestamp: '2026-01-05T18:25:00Z',
      },
    ],
    evidence: [
      {
        id: 'E-6891-001',
        type: 'screenshot',
        url: 'https://lucky-slots-online.io/',
        snippet: 'Homepage shows casino games, slots, and sports betting. No license information visible.',
        timestamp: '2026-01-05T18:05:00Z',
      },
      {
        id: 'E-6891-002',
        type: 'text',
        url: 'https://lucky-slots-online.io/about-us',
        snippet: 'About page: "Based in Malta" - No Malta Gaming Authority license found. Registered in Seychelles (offshore tax haven).',
        timestamp: '2026-01-05T18:06:00Z',
        metadata: { claimed_jurisdiction: 'Malta', actual_registration: 'Seychelles' },
      },
      {
        id: 'E-6891-003',
        type: 'screenshot',
        url: 'https://lucky-slots-online.io/signup',
        snippet: 'Signup form asks only for email and password. No age verification, ID upload, or birthdate check.',
        timestamp: '2026-01-05T18:10:00Z',
      },
      {
        id: 'E-6891-004',
        type: 'html',
        url: 'https://lucky-slots-online.io/signup',
        snippet: '<form><input type="email" required><input type="password" required><button>Join Now</button></form>',
        timestamp: '2026-01-05T18:11:00Z',
      },
      {
        id: 'E-6891-005',
        type: 'screenshot',
        url: 'https://lucky-slots-online.io/account',
        snippet: 'Account settings page has no options for deposit limits, time limits, or self-exclusion.',
        timestamp: '2026-01-05T18:15:00Z',
      },
      {
        id: 'E-6891-006',
        type: 'text',
        url: 'https://lucky-slots-online.io/deposit',
        snippet: 'Payment methods: Bitcoin, Ethereum, USDT only. Text: "Anonymous deposits. No ID verification required. Start playing in minutes."',
        timestamp: '2026-01-05T18:20:00Z',
      },
      {
        id: 'E-6891-007',
        type: 'screenshot',
        url: 'https://lucky-slots-online.io/deposit',
        snippet: 'Deposit page prominently displays: "100% Anonymous. No KYC. Instant Withdrawals."',
        timestamp: '2026-01-05T18:21:00Z',
      },
      {
        id: 'E-6891-008',
        type: 'screenshot',
        url: 'https://lucky-slots-online.io/',
        snippet: 'Footer shows "Licensed by Curacao Gaming Control Board - License #8048/JAZ". Verification shows this license number does not exist.',
        timestamp: '2026-01-05T18:25:00Z',
        metadata: { displayed_license: '8048/JAZ', verification_status: 'invalid' },
      },
    ],
    coverage: {
      pages_crawled: 94,
      products_parsed: 0,
      media_items: 234,
      ugc_samples: 12,
      forms_detected: 4,
      urls_crawled: [
        'https://lucky-slots-online.io/',
        'https://lucky-slots-online.io/slots',
        'https://lucky-slots-online.io/sports-betting',
        'https://lucky-slots-online.io/signup',
        'https://lucky-slots-online.io/deposit',
        'https://lucky-slots-online.io/about-us',
        'https://lucky-slots-online.io/terms',
      ],
    },
  },
  'S-5412': {
    scan_id: 'S-5412',
    merchant_id: 'M-1203',
    url: 'https://cleanbeauty-subscription.com',
    timestamp: '2026-01-04T11:00:00Z',
    status: 'success',
    type: 'scheduled',
    config: {
      profile: 'Balanced',
      crawl_depth: 2,
      region: 'US',
    },
    overall_risk_score: 48,
    risk_explanation: 'Moderate risk from subscription cancellation friction and unclear billing terms. Good product compliance but checkout flow needs improvement.',
    categories_detected: [
      { category: 'Beauty & Cosmetics', confidence: 96 },
      { category: 'Subscription Service', confidence: 94 },
      { category: 'Clean Beauty', confidence: 88 },
    ],
    risk_breakdown: {
      content: 10,
      product: 15,
      licensing: 5,
      ugc: 18,
    },
    findings: [
      {
        id: 'F-5412-001',
        title: 'Difficult subscription cancellation process',
        description: 'Subscription cancellation requires calling customer service during business hours. FTC Negative Option Rule requires online cancellation to be as easy as signup.',
        severity: 'high',
        confidence: 100,
        surface: 'website',
        policy_tags: ['Subscription Compliance', 'FTC Negative Option', 'Consumer Protection'],
        why_snippet: 'Online subscriptions must offer online cancellation',
        evidence_ids: ['E-5412-001', 'E-5412-002'],
        source_urls: ['https://cleanbeauty-subscription.com/account/cancel'],
        suggested_action: 'Implement online cancellation flow',
        timestamp: '2026-01-04T11:10:00Z',
      },
      {
        id: 'F-5412-002',
        title: 'Unclear auto-renewal terms at checkout',
        description: 'Subscription auto-renewal terms are displayed in 8pt font below fold. FTC requires clear, conspicuous disclosure of recurring charges before purchase.',
        severity: 'medium',
        confidence: 92,
        surface: 'checkout',
        policy_tags: ['Auto-Renewal Disclosure', 'FTC Compliance', 'Billing Transparency'],
        why_snippet: 'Auto-renewal terms must be clear and conspicuous',
        evidence_ids: ['E-5412-003'],
        source_urls: ['https://cleanbeauty-subscription.com/checkout'],
        suggested_action: 'Make auto-renewal terms prominent at checkout',
        timestamp: '2026-01-04T11:15:00Z',
      },
      {
        id: 'F-5412-003',
        title: 'Inconsistent product ingredient disclosures',
        description: '23% of products lack complete ingredient lists. While not illegal for cosmetics, this limits consumer informed choice.',
        severity: 'low',
        confidence: 78,
        surface: 'website',
        policy_tags: ['Ingredient Transparency', 'Product Disclosure'],
        why_snippet: 'Complete ingredient disclosure is best practice',
        evidence_ids: ['E-5412-004'],
        source_urls: ['https://cleanbeauty-subscription.com/products'],
        suggested_action: 'Require full ingredient lists for all products',
        timestamp: '2026-01-04T11:20:00Z',
      },
      {
        id: 'F-5412-004',
        title: 'User reviews contain unmoderated medical claims',
        description: 'Customer reviews make medical claims ("cured my eczema", "eliminated hormonal acne") without disclaimer. While user-generated, site should moderate health claims.',
        severity: 'medium',
        confidence: 85,
        surface: 'ugc',
        policy_tags: ['UGC Moderation', 'Health Claims', 'Review Management'],
        why_snippet: 'UGC health claims should be flagged or disclaimed',
        evidence_ids: ['E-5412-005', 'E-5412-006'],
        source_urls: ['https://cleanbeauty-subscription.com/products/face-serum-pro/reviews'],
        suggested_action: 'Moderate or add disclaimers to medical claims in reviews',
        timestamp: '2026-01-04T11:25:00Z',
      },
    ],
    evidence: [
      {
        id: 'E-5412-001',
        type: 'screenshot',
        url: 'https://cleanbeauty-subscription.com/account/cancel',
        snippet: 'Cancellation page shows: "To cancel your subscription, please call our customer care team at 1-800-XXX-XXXX (Mon-Fri 9am-5pm EST)"',
        timestamp: '2026-01-04T11:10:00Z',
      },
      {
        id: 'E-5412-002',
        type: 'text',
        url: 'https://cleanbeauty-subscription.com/faq',
        snippet: 'FAQ: "Can I cancel online? No, for security reasons we require phone cancellation."',
        timestamp: '2026-01-04T11:11:00Z',
      },
      {
        id: 'E-5412-003',
        type: 'screenshot',
        url: 'https://cleanbeauty-subscription.com/checkout',
        snippet: 'Checkout page shows auto-renewal terms in 8pt gray text below payment button: "By subscribing you agree to monthly charges until cancelled"',
        timestamp: '2026-01-04T11:15:00Z',
        metadata: { font_size: '8pt', color: '#999999', position: 'below_fold' },
      },
      {
        id: 'E-5412-004',
        type: 'html',
        url: 'https://cleanbeauty-subscription.com/products/moisturizer-deluxe',
        snippet: 'Product page HTML shows <div class="ingredients">See box for ingredients</div> - no detailed list',
        timestamp: '2026-01-04T11:20:00Z',
      },
      {
        id: 'E-5412-005',
        type: 'text',
        url: 'https://cleanbeauty-subscription.com/products/face-serum-pro/reviews',
        snippet: 'Review by Sarah M.: "This serum completely cured my eczema! My dermatologist was shocked. No more prescription creams needed!"',
        timestamp: '2026-01-04T11:25:00Z',
      },
      {
        id: 'E-5412-006',
        type: 'text',
        url: 'https://cleanbeauty-subscription.com/products/face-serum-pro/reviews',
        snippet: 'Review by Jennifer L.: "Eliminated my hormonal acne in 2 weeks. Better than antibiotics my doctor prescribed."',
        timestamp: '2026-01-04T11:26:00Z',
      },
    ],
    coverage: {
      pages_crawled: 156,
      products_parsed: 87,
      media_items: 421,
      ugc_samples: 1247,
      forms_detected: 7,
      urls_crawled: [
        'https://cleanbeauty-subscription.com/',
        'https://cleanbeauty-subscription.com/how-it-works',
        'https://cleanbeauty-subscription.com/products',
        'https://cleanbeauty-subscription.com/checkout',
        'https://cleanbeauty-subscription.com/account',
        'https://cleanbeauty-subscription.com/account/cancel',
        'https://cleanbeauty-subscription.com/faq',
        'https://cleanbeauty-subscription.com/reviews',
      ],
    },
  },
};

// Scan index for table display
export const scanIndex: ScanIndexItem[] = [
  {
    id: 'S-8471',
    merchantId: 'M-1847',
    merchantName: 'TechGadgets Plus',
    domain: 'techgadgets.io',
    url: 'https://techgadgets.io',
    timestamp: new Date('2026-01-07T10:00:00Z'),
    status: 'success',
    type: 'manual',
    pagesScanned: 245,
    riskScore: 87,
    topTriggers: ['Health claims', 'Deceptive practices', 'Review manipulation'],
    category: 'General',
  },
  {
    id: 'S-9001',
    merchantId: 'M-2103',
    merchantName: 'FashionHub EU',
    domain: 'fashionhub.eu',
    url: 'https://fashionhub.eu',
    timestamp: new Date('2026-01-07T08:00:00Z'),
    status: 'success',
    type: 'scheduled',
    pagesScanned: 512,
    riskScore: 82,
    topTriggers: ['Counterfeit', 'UGC moderation'],
    category: 'Marketplaces',
  },
  {
    id: 'S-7213',
    merchantId: 'M-3401',
    merchantName: 'FitMax Supplements',
    domain: 'fitmax-supplements.com',
    url: 'https://fitmax-supplements.com',
    timestamp: new Date('2026-01-06T14:30:00Z'),
    status: 'success',
    type: 'onboarding',
    pagesScanned: 187,
    riskScore: 92,
    topTriggers: ['Controlled substances', 'FDA violations', 'Illegal pharmaceuticals'],
    category: 'Supplements',
  },
  {
    id: 'S-6891',
    merchantId: 'M-2847',
    merchantName: 'Lucky Slots Online',
    domain: 'lucky-slots-online.io',
    url: 'https://lucky-slots-online.io',
    timestamp: new Date('2026-01-05T18:00:00Z'),
    status: 'success',
    type: 'manual',
    pagesScanned: 94,
    riskScore: 95,
    topTriggers: ['Unlicensed gambling', 'No age verification', 'AML evasion'],
    category: 'Gambling',
  },
  {
    id: 'S-5412',
    merchantId: 'M-1203',
    merchantName: 'CleanBeauty Subscription',
    domain: 'cleanbeauty-subscription.com',
    url: 'https://cleanbeauty-subscription.com',
    timestamp: new Date('2026-01-04T11:00:00Z'),
    status: 'success',
    type: 'scheduled',
    pagesScanned: 156,
    riskScore: 48,
    topTriggers: ['Subscription compliance', 'UGC moderation'],
    category: 'Subscriptions',
  },
];

// In-memory store for new scans (simulating state management)
export class ScanStore {
  private static scans: ScanIndexItem[] = [...scanIndex];
  private static reports: Record<string, RawScanReport> = { ...rawScanReportsById };

  static getAllScans(): ScanIndexItem[] {
    return this.scans;
  }

  static getScanReport(scanId: string): RawScanReport | undefined {
    return this.reports[scanId];
  }

  static addScan(scan: ScanIndexItem, report: RawScanReport) {
    this.scans.unshift(scan);
    this.reports[scan.id] = report;
  }
}

