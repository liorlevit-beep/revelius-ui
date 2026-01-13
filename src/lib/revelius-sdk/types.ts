// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ReveliusConfig {
  accessKey: string;
  secretKey: string;
  baseUrl?: string;
}

export interface SignedHeaders {
  'Access-Key': string;
  'Timestamp': string;
  'Signature': string;
  'Session-Id'?: string;
}

// ============================================================================
// SCANNER ENDPOINTS
// ============================================================================

export interface ScannerCategory {
  id: string;
  name: string;
  description?: string;
}

export interface ScanWebsiteRequest {
  url: string;
}

export interface ScanWebsiteResponse {
  session_id: string;
  status: string;
  message?: string;
}

export interface SessionStatusResponse {
  session_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
}

export interface ScanReport {
  session_id: string;
  url: string;
  scan_date: string;
  findings: any[];
  risk_score: number;
  categories: string[];
}

// ============================================================================
// OPERATIONS ENDPOINTS
// ============================================================================

export interface CreatePromoRequest {
  name: string;
  email: string;
}

export interface CreatePromoResponse {
  customer_id: string;
  name: string;
  email: string;
  status: string;
}

export interface WebhookHandlerRequest {
  status: string;
  [key: string]: any;
}

export interface WebhookHandlerResponse {
  success: boolean;
  message?: string;
}

// ============================================================================
// PRODUCTS ENDPOINTS
// ============================================================================

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

export interface RoutingTableMapping {
  [psp: string]: string[];
}

export interface RoutingTable {
  default_psp: string;
  mapping: RoutingTableMapping;
}

export interface RouteProductsRequest {
  products: string[];
}

export interface RouteProductsResponse {
  routes: {
    product: string;
    psp: string;
    category?: string;
  }[];
}
