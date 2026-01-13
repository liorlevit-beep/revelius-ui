import { getSignedHeaders } from './auth';
import type {
  ApiResponse,
  ReveliusConfig,
  ScannerCategory,
  ScanWebsiteRequest,
  ScanWebsiteResponse,
  SessionStatusResponse,
  ScanReport,
  CreatePromoRequest,
  CreatePromoResponse,
  WebhookHandlerRequest,
  WebhookHandlerResponse,
  ProductCategory,
  RoutingTable,
  RouteProductsRequest,
  RouteProductsResponse,
} from './types';

export class ReveliusClient {
  private accessKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(config: ReveliusConfig) {
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
    // The Postman collection has baseURL as https://api.revelius.com/scanner
    // but that causes duplicate /scanner paths. The correct baseURL is:
    this.baseUrl = config.baseUrl || 'https://api.revelius.com';
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any,
    sessionId?: string
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await getSignedHeaders(
        this.accessKey,
        this.secretKey,
        sessionId
      );

      // Debug logging
      console.log(`[Revelius SDK] ${method} ${url}`);
      console.log('[Revelius SDK] Headers:', headers);
      if (body) console.log('[Revelius SDK] Body:', body);

      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      console.log(`[Revelius SDK] Response Status: ${response.status}`);
      console.log('[Revelius SDK] Response Data:', data);

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}: Request failed`,
          data,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('[Revelius SDK] Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============================================================================
  // SCANNER METHODS
  // ============================================================================

  /**
   * Get all scanner categories
   * GET /scanner/categories
   */
  async getScannerCategories(): Promise<ApiResponse<ScannerCategory[]>> {
    return this.request<ScannerCategory[]>('GET', '/scanner/categories');
  }

  /**
   * Scan a website
   * POST /scanner/scan
   * Returns a session_id for tracking the scan progress
   */
  async scanWebsite(request: ScanWebsiteRequest): Promise<ApiResponse<ScanWebsiteResponse>> {
    return this.request<ScanWebsiteResponse>('POST', '/scanner/scan', request);
  }

  /**
   * Get session status
   * GET /scanner/session/status
   * Requires Session-Id header
   */
  async getSessionStatus(sessionId: string): Promise<ApiResponse<SessionStatusResponse>> {
    return this.request<SessionStatusResponse>('GET', '/scanner/session/status', undefined, sessionId);
  }

  /**
   * Get PDF report
   * GET /scanner/report/pdf
   * Requires Session-Id header
   */
  async getPdfReport(sessionId: string): Promise<ApiResponse<Blob>> {
    return this.request<Blob>('GET', '/scanner/report/pdf', undefined, sessionId);
  }

  /**
   * Get JSON report
   * GET /scanner/report/json
   * Requires Session-Id header
   */
  async getJsonReport(sessionId: string): Promise<ApiResponse<ScanReport>> {
    return this.request<ScanReport>('GET', '/scanner/report/json', undefined, sessionId);
  }

  // ============================================================================
  // OPERATIONS METHODS
  // ============================================================================

  /**
   * Create a promo customer
   * POST /operations/create_promo
   */
  async createPromoCustomer(request: CreatePromoRequest): Promise<ApiResponse<CreatePromoResponse>> {
    return this.request<CreatePromoResponse>('POST', '/operations/create_promo', request);
  }

  /**
   * Webhook handler
   * POST /operations/webhook_handler
   * Note: This endpoint requires Access-Key and Internal-Identifier headers
   */
  async webhookHandler(request: WebhookHandlerRequest, internalIdentifier?: string): Promise<ApiResponse<WebhookHandlerResponse>> {
    // Note: This endpoint uses different headers (Access-Key + Internal-Identifier)
    // The standard auth signature is not used for this endpoint
    return this.request<WebhookHandlerResponse>('POST', '/operations/webhook_handler', request);
  }

  // ============================================================================
  // PRODUCTS METHODS
  // ============================================================================

  /**
   * Get all supported product categories
   * GET /products/categories
   */
  async getProductCategories(): Promise<ApiResponse<ProductCategory[]>> {
    return this.request<ProductCategory[]>('GET', '/products/categories');
  }

  /**
   * Get customer routing table
   * GET /products/routing_table
   */
  async getRoutingTable(): Promise<ApiResponse<RoutingTable>> {
    return this.request<RoutingTable>('GET', '/products/routing_table');
  }

  /**
   * Create or update routing table
   * POST /products/routing_table
   */
  async updateRoutingTable(routingTable: RoutingTable): Promise<ApiResponse<RoutingTable>> {
    return this.request<RoutingTable>('POST', '/products/routing_table', routingTable);
  }

  /**
   * Route products to PSPs
   * POST /products/router
   * Requires Session-Id header
   */
  async routeProducts(request: RouteProductsRequest, sessionId?: string): Promise<ApiResponse<RouteProductsResponse>> {
    return this.request<RouteProductsResponse>('POST', '/products/router', request, sessionId);
  }
}
