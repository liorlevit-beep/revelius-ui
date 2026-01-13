// Additional types for Merchant 360 tabs

export interface ScanSummary {
  id: string;
  merchantId: string;
  timestamp: Date;
  type: 'onboarding' | 'scheduled' | 'manual';
  status: 'success' | 'partial' | 'failed';
  pagesScanned: number;
  riskScore: number;
  riskDelta: number;
  deltaSummary: string;
  findingIds: string[];
  url: string;
}

export interface Finding {
  id: string;
  scanId: string;
  merchantId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  surface: 'website' | 'app' | 'ugc' | 'checkout';
  policyTags: string[];
  confidence: number;
  whySnippet: string;
  suggestedAction: 'approve' | 'review' | 'reject';
  remediationBullets: string[];
  evidence: Evidence[];
  isNew?: boolean;
}

export interface Evidence {
  id: string;
  type: 'screenshot' | 'text' | 'html' | 'video';
  url: string;
  timestamp: Date;
  snippet: string;
  highlightedText?: string;
}

export interface MerchantOverview {
  declared: {
    category: string;
    products: string[];
  };
  observed: {
    category: string;
    products: string[];
    patterns: string[];
    narrative: string;
  };
  riskBreakdown: {
    content: { value: number; severity: 'low' | 'medium' | 'high' };
    product: { value: number; severity: 'low' | 'medium' | 'high' };
    licensing: { value: number; severity: 'low' | 'medium' | 'high' };
    ugc: { value: number; severity: 'low' | 'medium' | 'high' };
  };
  riskTrendSeries: Array<{
    date: Date;
    riskScore: number;
    event?: string;
  }>;
  monitoring: {
    enabled: boolean;
    cadence: 'daily' | 'weekly' | 'monthly';
    lastScan: Date;
    driftDetected: boolean;
  };
}


