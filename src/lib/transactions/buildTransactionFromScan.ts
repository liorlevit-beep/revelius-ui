import { ScannerAPI } from '../../api';
import type { Transaction } from '../../demo/transactions';

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

/**
 * Simple seeded hash function for deterministic random values
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate deterministic random number based on seed
 */
function seededRandom(seed: string, min: number, max: number): number {
  const hash = simpleHash(seed);
  const normalized = (hash % 1000) / 1000; // 0-1
  return Math.floor(normalized * (max - min + 1)) + min;
}

/**
 * Extract title from URL slug
 */
function extractTitle(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Try to find product-like segment
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i] === 'product' || pathParts[i] === 'products') {
        if (pathParts[i + 1]) {
          return pathParts[i + 1]
            .replace(/[-_]/g, ' ')
            .replace(/\.(html|php|aspx?)$/i, '')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ')
            .slice(0, 50);
        }
      }
    }
    
    // Fallback to last meaningful path segment
    const lastSegment = pathParts[pathParts.length - 1] || 'product';
    return lastSegment
      .replace(/[-_]/g, ' ')
      .replace(/\.(html|php|aspx?)$/i, '')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
      .slice(0, 50);
  } catch {
    return 'Product Item';
  }
}

/**
 * Check if URL is product-like
 */
function isProductUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes('?product=') ||
    lowerUrl.includes('/product/') ||
    lowerUrl.includes('/products/') ||
    lowerUrl.includes('product_cat') ||
    lowerUrl.includes('?product_cat=') ||
    lowerUrl.includes('/shop/') ||
    lowerUrl.includes('/item/')
  );
}

/**
 * Extract all items from report
 */
function extractAllItems(report: any): any[] {
  const items: any[] = [];
  
  // Try different possible structures
  if (report.items && Array.isArray(report.items)) {
    items.push(...report.items);
  }
  if (report.data?.items && Array.isArray(report.data.items)) {
    items.push(...report.data.items);
  }
  if (report.passed_items && Array.isArray(report.passed_items)) {
    items.push(...report.passed_items);
  }
  if (report.failed_items && Array.isArray(report.failed_items)) {
    items.push(...report.failed_items);
  }
  if (report.scanned_items && Array.isArray(report.scanned_items)) {
    items.push(...report.scanned_items);
  }
  
  return items;
}

/**
 * Extract evidence summary from report
 */
function extractEvidenceSummary(report: any): EvidenceSummary {
  const summary = report.summary || report.data?.summary || {};
  
  const totalScanned = summary.total_scanned_items || summary.total_items || 0;
  const totalFailed = summary.total_failed_items || summary.failed_count || 0;
  const passedPercentage = summary.passed_percentage || (totalScanned > 0 ? ((totalScanned - totalFailed) / totalScanned * 100) : 0);
  const failedPercentage = summary.failed_percentage || (totalScanned > 0 ? (totalFailed / totalScanned * 100) : 0);
  const reviewRequired = summary.review_required_count || summary.review_required || 0;
  
  return {
    total_scanned_items: totalScanned,
    total_failed_items: totalFailed,
    passed_percentage: Math.round(passedPercentage * 10) / 10,
    failed_percentage: Math.round(failedPercentage * 10) / 10,
    review_required_count: reviewRequired,
  };
}

/**
 * Build transaction from scan session
 */
export async function buildTransactionFromSession(sessionId: string): Promise<Partial<Transaction>> {
  // Fetch scan report
  const response = await ScannerAPI.getJsonReport(sessionId);
  const report = response.data || response;
  
  // Extract all items
  const allItems = extractAllItems(report);
  
  // Extract product URLs
  const productUrls = allItems
    .filter((item: any) => item.url && isProductUrl(item.url))
    .map((item: any) => item.url);
  
  // Get unique product URLs
  const uniqueProductUrls = [...new Set(productUrls)];
  
  // If no product URLs found, use top 3 unique text URLs
  let selectedUrls = uniqueProductUrls.slice(0, 5);
  if (selectedUrls.length === 0) {
    const textUrls = allItems
      .filter((item: any) => 
        item.url && 
        item.content_type !== 'image' &&
        !item.url.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/i)
      )
      .map((item: any) => item.url);
    
    selectedUrls = [...new Set(textUrls)].slice(0, 3);
  }
  
  // Ensure we have 2-5 SKUs
  const numSkus = Math.min(Math.max(selectedUrls.length, 2), 5);
  selectedUrls = selectedUrls.slice(0, numSkus);
  
  // If still not enough, pad with generic entries
  while (selectedUrls.length < 2) {
    selectedUrls.push(`https://example.com/product/${selectedUrls.length + 1}`);
  }
  
  // Build SKUs
  const skus: SKU[] = selectedUrls.map((productUrl, index) => {
    const skuId = `SKU-${simpleHash(productUrl).toString().slice(0, 6)}`;
    const title = extractTitle(productUrl);
    const quantity = seededRandom(productUrl, 1, 3);
    const price = seededRandom(productUrl + 'price', 10, 500);
    
    // Find evidence items related to this product
    const evidenceItems: EvidenceItem[] = allItems
      .filter((item: any) => 
        item.url === productUrl || 
        item.url_referrer === productUrl
      )
      .map((item: any) => ({
        url: item.url || '',
        url_referrer: item.url_referrer || item.referrer || '',
        content_type: item.content_type || 'unknown',
        status: item.status || (item.blocked_reason ? 'failed' : 'passed'),
        blocked_reason: item.blocked_reason,
        confidence: item.confidence,
      }));
    
    return {
      sku_id: skuId,
      title,
      quantity,
      price,
      product_url: productUrl,
      evidence_items: evidenceItems,
    };
  });
  
  // Extract evidence summary
  const evidenceSummary = extractEvidenceSummary(report);
  
  // Extract merchant domain from report
  let merchantDomain = 'Unknown Merchant';
  const reportData = report as any;
  const rootUrl = reportData.root_website_url || reportData.data?.root_website_url || reportData.url || reportData.data?.url;
  if (rootUrl) {
    try {
      const urlObj = new URL(rootUrl.startsWith('http') ? rootUrl : `https://${rootUrl}`);
      merchantDomain = urlObj.hostname;
    } catch {
      merchantDomain = rootUrl;
    }
  }
  
  // Calculate total amount
  const totalAmount = skus.reduce((sum, sku) => sum + (sku.price * sku.quantity), 0);
  
  return {
    merchantName: merchantDomain,
    amount: totalAmount,
    cart: skus,
    evidence_summary: evidenceSummary,
  };
}
