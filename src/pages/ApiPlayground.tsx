import { useState, useEffect } from 'react';
import { ScannerAPI, ProductsAPI, OperationsAPI, ApiError } from '../api';
import { getEnvConfig } from '../config/env';
import { Card } from '../components/Card';
import { ApiKeysModal } from '../components/ApiKeysModal';
import type { RoutingTable } from '../types/products';

export default function ApiPlayground() {
  const [keysConfigured, setKeysConfigured] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Check mock mode
    const mockFlag = import.meta.env.VITE_REVELIUS_MOCK || "0";
    setIsMockMode(mockFlag === "1");
    
    // Check if keys are configured
    const checkKeys = () => {
      // Check localStorage directly
      const accessKey = localStorage.getItem('revelius_access_key');
      const secretKey = localStorage.getItem('revelius_secret_key');
      const configured = !!(accessKey && secretKey);
      
      setKeysConfigured(configured);
      
      // Open modal if keys are not configured
      if (!configured) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };
    
    checkKeys();
    
    // Listen for storage changes (when keys are set in modal)
    const handleStorageChange = () => checkKeys();
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case keys were set in same window
    const interval = setInterval(checkKeys, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  // State for inputs
  const [websiteUrl, setWebsiteUrl] = useState('https://example.com');
  const [sessionId, setSessionId] = useState('');
  const [routingTableJson, setRoutingTableJson] = useState(
    JSON.stringify({ default_psp: 'stripe', mapping: { adyen: ['cat1'] } }, null, 2)
  );
  const [productsInput, setProductsInput] = useState('product1, product2, product3');
  const [promoName, setPromoName] = useState('John Doe');
  const [promoEmail, setPromoEmail] = useState('john@example.com');
  const [webhookIdentifier, setWebhookIdentifier] = useState('webhook_123');
  const [webhookPayload, setWebhookPayload] = useState(
    JSON.stringify({ event: 'test', data: {} }, null, 2)
  );

  // State for results
  const [lastResponse, setLastResponse] = useState<string>('');
  const [lastError, setLastError] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  
  // State for developer console
  const [requestDetails, setRequestDetails] = useState<{
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
    timestamp: string;
  } | null>(null);
  const [responseDetails, setResponseDetails] = useState<{
    status: number;
    statusText: string;
    duration: number;
    body: string;
  } | null>(null);

  const handleApiCall = async (
    name: string,
    apiCall: () => Promise<unknown>,
    method: string = 'GET',
    endpoint: string = '',
    requestBody?: unknown
  ) => {
    setLoading(name);
    setLastError('');
    setLastResponse('');
    
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const env = getEnvConfig();
    
    // Set request details for developer console
    setRequestDetails({
      method,
      url: `${env.baseUrl}${endpoint}`,
      headers: {
        'Access-Key': env.accessKey.substring(0, 8) + '...',
        'Timestamp': Math.floor(Date.now() / 1000).toString(),
        'Signature': '[SHA256 signature]',
        'Content-Type': 'application/json'
      },
      body: requestBody ? JSON.stringify(requestBody, null, 2) : undefined,
      timestamp
    });

    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;
      
      setLastResponse(JSON.stringify(result, null, 2));
      setResponseDetails({
        status: 200,
        statusText: 'OK',
        duration,
        body: JSON.stringify(result, null, 2)
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (error instanceof ApiError) {
        const errorMsg = `${error.message} (Status: ${error.status})\n${JSON.stringify(error.details, null, 2)}`;
        setLastError(errorMsg);
        setResponseDetails({
          status: error.status,
          statusText: error.message,
          duration,
          body: JSON.stringify(error.details, null, 2)
        });
      } else if (error instanceof Error) {
        setLastError(error.message);
        setResponseDetails({
          status: 500,
          statusText: 'Error',
          duration,
          body: error.message
        });
      } else {
        setLastError('Unknown error occurred');
        setResponseDetails({
          status: 500,
          statusText: 'Unknown Error',
          duration,
          body: 'Unknown error occurred'
        });
      }
    } finally {
      setLoading('');
    }
  };

  const handleScanWebsite = async () => {
    await handleApiCall(
      'scanWebsite',
      async () => {
        const result = await ScannerAPI.scanWebsite(websiteUrl);
        // Auto-fill session ID from response
        if (result.data?.session_id) {
          setSessionId(result.data.session_id);
        }
        return result;
      },
      'POST',
      '/scanner/scan',
      { url: websiteUrl }
    );
  };

  const handleDownloadPdf = async () => {
    setLoading('downloadPdf');
    setLastError('');
    setLastResponse('');

    try {
      const blob = await ScannerAPI.getPdfReport(sessionId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLastResponse('PDF downloaded successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        setLastError(`${error.message} (Status: ${error.status})`);
      } else if (error instanceof Error) {
        setLastError(error.message);
      } else {
        setLastError('Unknown error occurred');
      }
    } finally {
      setLoading('');
    }
  };

  const handleUpsertRoutingTable = async () => {
    const payload: RoutingTable = JSON.parse(routingTableJson);
    await handleApiCall(
      'upsertRoutingTable',
      async () => ProductsAPI.upsertRoutingTable(payload),
      'POST',
      '/products/routing_table',
      payload
    );
  };

  const handleRouteProducts = async () => {
    await handleApiCall('routeProducts', async () => {
      const products = productsInput.split(',').map(p => p.trim()).filter(Boolean);
      return ProductsAPI.routeProducts(sessionId, products);
    });
  };

  const handleWebhookHandler = async () => {
    await handleApiCall('webhookHandler', async () => {
      const payload = JSON.parse(webhookPayload);
      return OperationsAPI.webhookHandler(webhookIdentifier, payload);
    });
  };

  const handleKeysConfigured = () => {
    // Re-check keys from localStorage
    const accessKey = localStorage.getItem('revelius_access_key');
    const secretKey = localStorage.getItem('revelius_secret_key');
    const configured = !!(accessKey && secretKey);
    
    setKeysConfigured(configured);
    setShowModal(!configured); // Close modal if configured, keep open if not
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Playground</h1>
        <p className="text-gray-600">Test Revelius API endpoints with live requests</p>
        
        {/* Status Indicators */}
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {/* Mode Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            isMockMode
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span className="text-base">{isMockMode ? '🎭' : '🚀'}</span>
            <span className="font-bold">{isMockMode ? 'DEMO MODE' : 'OPERATIONAL MODE'}</span>
          </div>
          
          {/* API Keys Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            keysConfigured 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${keysConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {keysConfigured ? 'API Keys Configured' : 'API Keys Not Configured'}
          </div>
          
          {!isMockMode && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-emerald-600">✓</span>
              Making real API calls to production
            </div>
          )}
          
          {isMockMode && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <span>ℹ️</span>
              Using mock data - no real API calls
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner API Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-emerald-600">📡</span> Scanner API
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => handleApiCall('getCategories', ScannerAPI.getCategories, 'GET', '/scanner/categories')}
              disabled={loading === 'getCategories'}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'getCategories' ? 'Loading...' : 'Get Scanner Categories'}
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://example.com"
              />
              <button
                onClick={handleScanWebsite}
                disabled={loading === 'scanWebsite'}
                className="w-full mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {loading === 'scanWebsite' ? 'Scanning...' : 'Scan Website'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session ID
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter session ID"
              />
            </div>

            <button
              onClick={() => handleApiCall('getSessionStatus', () => ScannerAPI.getSessionStatus(sessionId))}
              disabled={loading === 'getSessionStatus' || !sessionId}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'getSessionStatus' ? 'Loading...' : 'Get Session Status'}
            </button>

            <button
              onClick={() => handleApiCall('getJsonReport', () => ScannerAPI.getJsonReport(sessionId))}
              disabled={loading === 'getJsonReport' || !sessionId}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'getJsonReport' ? 'Loading...' : 'Get JSON Report'}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={loading === 'downloadPdf' || !sessionId}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'downloadPdf' ? 'Downloading...' : 'Download PDF Report'}
            </button>
          </div>
        </Card>

        {/* Products API Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-600">📦</span> Products API
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => handleApiCall('getProductCategories', ProductsAPI.getCategories, 'GET', '/products/categories')}
              disabled={loading === 'getProductCategories'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'getProductCategories' ? 'Loading...' : 'Get Product Categories'}
            </button>

            <button
              onClick={() => handleApiCall('getAllProducts', ProductsAPI.getAllProducts, 'GET', '/products/all')}
              disabled={loading === 'getAllProducts'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'getAllProducts' ? 'Loading...' : 'Get All Products'}
            </button>

            <button
              onClick={() => handleApiCall('getRoutingTable', ProductsAPI.getRoutingTable, 'GET', '/products/routing_table')}
              disabled={loading === 'getRoutingTable'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'getRoutingTable' ? 'Loading...' : 'Get Routing Table'}
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Table JSON
              </label>
              <textarea
                value={routingTableJson}
                onChange={(e) => setRoutingTableJson(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <button
                onClick={handleUpsertRoutingTable}
                disabled={loading === 'upsertRoutingTable'}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading === 'upsertRoutingTable' ? 'Updating...' : 'Upsert Routing Table'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products (comma-separated)
              </label>
              <input
                type="text"
                value={productsInput}
                onChange={(e) => setProductsInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="product1, product2, product3"
              />
              <button
                onClick={handleRouteProducts}
                disabled={loading === 'routeProducts' || !sessionId}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading === 'routeProducts' ? 'Routing...' : 'Route Products'}
              </button>
              {!sessionId && (
                <p className="text-xs text-gray-500 mt-1">Requires Session ID</p>
              )}
            </div>
          </div>
        </Card>

        {/* Operations API Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-purple-600">⚙️</span> Operations API
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Customer Name
              </label>
              <input
                type="text"
                value={promoName}
                onChange={(e) => setPromoName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Customer Email
              </label>
              <input
                type="email"
                value={promoEmail}
                onChange={(e) => setPromoEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => handleApiCall('createPromo', () => OperationsAPI.createPromoCustomer(promoName, promoEmail))}
              disabled={loading === 'createPromo'}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'createPromo' ? 'Creating...' : 'Create Promo Customer'}
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Internal Identifier
              </label>
              <input
                type="text"
                value={webhookIdentifier}
                onChange={(e) => setWebhookIdentifier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Payload JSON
              </label>
              <textarea
                value={webhookPayload}
                onChange={(e) => setWebhookPayload(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <button
              onClick={handleWebhookHandler}
              disabled={loading === 'webhookHandler'}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'webhookHandler' ? 'Sending...' : 'Send Webhook'}
            </button>
          </div>
        </Card>

        {/* Developer Console */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-slate-600">🔧</span> Developer Console
          </h2>
          
          {requestDetails || responseDetails ? (
            <div className="space-y-4">
              {/* Request Section */}
              {requestDetails && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                      <span className="text-blue-600">→</span> Request
                    </h3>
                  </div>
                  <div className="p-4 bg-white space-y-3">
                    <div>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-bold rounded mr-2">
                        {requestDetails.method}
                      </span>
                      <span className="text-sm font-mono text-gray-700">
                        {requestDetails.url}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Headers:</p>
                      <pre className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded">
                        {JSON.stringify(requestDetails.headers, null, 2)}
                      </pre>
                    </div>
                    {requestDetails.body && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Body:</p>
                        <pre className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                          {requestDetails.body}
                        </pre>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {requestDetails.timestamp}
                    </div>
                  </div>
                </div>
              )}

              {/* Response Section */}
              {responseDetails && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className={`px-4 py-2 border-b ${
                    responseDetails.status >= 200 && responseDetails.status < 300
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                      responseDetails.status >= 200 && responseDetails.status < 300
                        ? 'text-emerald-900'
                        : 'text-red-900'
                    }`}>
                      <span className={responseDetails.status >= 200 && responseDetails.status < 300 ? 'text-emerald-600' : 'text-red-600'}>
                        ←
                      </span>
                      Response
                    </h3>
                  </div>
                  <div className="p-4 bg-white space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block px-2 py-1 text-xs font-mono font-bold rounded ${
                        responseDetails.status >= 200 && responseDetails.status < 300
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {responseDetails.status} {responseDetails.statusText}
                      </span>
                      <span className="text-xs text-gray-500">
                        {responseDetails.duration}ms
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Response Body:</p>
                      <pre className={`text-xs font-mono p-3 rounded max-h-96 overflow-y-auto ${
                        responseDetails.status >= 200 && responseDetails.status < 300
                          ? 'bg-emerald-50 text-emerald-900'
                          : 'bg-red-50 text-red-900'
                      }`}>
                        {responseDetails.body}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔌</span>
              </div>
              <p className="text-gray-500 text-sm italic">
                Click any API button to see request/response details...
              </p>
            </div>
          )}
        </Card>
      </div>
      
      {/* API Keys Modal */}
      <ApiKeysModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onKeysConfigured={handleKeysConfigured}
      />
    </div>
  );
}
