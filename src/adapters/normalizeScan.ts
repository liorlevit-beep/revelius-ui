import type { RawScanReport } from '../demo/scans';

export interface NormalizedFinding {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  surface: string;
  policyTags: string[];
  whySnippet: string;
  evidenceIds: string[];
  sourceUrls: string[];
  suggestedAction: string;
  timestamp: Date;
}

export interface NormalizedEvidence {
  id: string;
  type: 'screenshot' | 'text' | 'html' | 'video';
  url: string;
  snippet: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface NormalizedScan {
  scanId: string;
  merchantId?: string;
  url: string;
  timestamp: Date;
  status: 'success' | 'partial' | 'failed';
  type: 'onboarding' | 'scheduled' | 'manual';
  config: {
    profile: string;
    crawlDepth: number;
    region: string;
  };
  overallRiskScore: number;
  riskExplanation: string;
  categoriesDetected: Array<{
    category: string;
    confidence: number;
  }>;
  riskBreakdown: {
    content: number;
    product: number;
    licensing: number;
    ugc: number;
  };
  findings: NormalizedFinding[];
  evidence: NormalizedEvidence[];
  coverageStats: {
    pagesCrawled: number;
    productsParsed: number;
    mediaItems: number;
    ugcSamples: number;
    formsDetected: number;
    urlsCrawled: string[];
  };
}

/**
 * Normalize raw scan report from API into stable UI model
 * This adapter isolates the UI from API format changes
 */
export function normalizeScan(raw: RawScanReport): NormalizedScan {
  return {
    scanId: raw.scan_id,
    merchantId: raw.merchant_id,
    url: raw.url,
    timestamp: new Date(raw.timestamp),
    status: raw.status,
    type: raw.type,
    config: {
      profile: raw.config.profile,
      crawlDepth: raw.config.crawl_depth,
      region: raw.config.region,
    },
    overallRiskScore: raw.overall_risk_score,
    riskExplanation: raw.risk_explanation,
    categoriesDetected: raw.categories_detected.map((c) => ({
      category: c.category,
      confidence: c.confidence,
    })),
    riskBreakdown: {
      content: raw.risk_breakdown.content,
      product: raw.risk_breakdown.product,
      licensing: raw.risk_breakdown.licensing,
      ugc: raw.risk_breakdown.ugc,
    },
    findings: raw.findings.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      severity: f.severity,
      confidence: f.confidence,
      surface: f.surface,
      policyTags: f.policy_tags,
      whySnippet: f.why_snippet,
      evidenceIds: f.evidence_ids,
      sourceUrls: f.source_urls,
      suggestedAction: f.suggested_action,
      timestamp: new Date(f.timestamp),
    })),
    evidence: raw.evidence.map((e) => ({
      id: e.id,
      type: e.type,
      url: e.url,
      snippet: e.snippet,
      timestamp: new Date(e.timestamp),
      metadata: e.metadata,
    })),
    coverageStats: {
      pagesCrawled: raw.coverage.pages_crawled,
      productsParsed: raw.coverage.products_parsed,
      mediaItems: raw.coverage.media_items,
      ugcSamples: raw.coverage.ugc_samples,
      formsDetected: raw.coverage.forms_detected,
      urlsCrawled: raw.coverage.urls_crawled,
    },
  };
}

/**
 * Determine decision recommendation based on risk score
 */
export function getDecisionRecommendation(riskScore: number): {
  decision: 'approve' | 'approve_with_conditions' | 'reject';
  label: string;
  color: string;
  description: string;
} {
  if (riskScore >= 85) {
    return {
      decision: 'reject',
      label: 'Reject',
      color: 'red',
      description: 'Critical risk factors detected. Recommend declining or requiring significant changes before approval.',
    };
  }
  if (riskScore >= 65) {
    return {
      decision: 'approve_with_conditions',
      label: 'Approve with Conditions',
      color: 'amber',
      description: 'Moderate risk detected. Recommend approval with monitoring, restrictions, or required policy updates.',
    };
  }
  return {
    decision: 'approve',
    label: 'Approve',
    color: 'emerald',
    description: 'Low risk profile. Merchant can be approved with standard terms.',
  };
}


