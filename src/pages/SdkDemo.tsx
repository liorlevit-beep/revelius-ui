import { useState, useEffect } from 'react';
import { ReveliusClient } from '../lib/revelius-sdk';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ApiKeysModal } from '../components/ApiKeysModal';

const API_KEYS_STORAGE = 'revelius_api_keys';

export default function SdkDemo() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'operations' | 'products'>('scanner');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showKeysModal, setShowKeysModal] = useState(false);
  const [sdk, setSdk] = useState<ReveliusClient | null>(null);

  // Scanner state
  const [scanUrl, setScanUrl] = useState('https://www.buypipetobacco.com');
  const [sessionId, setSessionId] = useState('');

  // Operations state
  const [promoName, setPromoName] = useState('Demo PayPay (WHT)');
  const [promoEmail, setPromoEmail] = useState('sagiit@gmail.com');
  const [webhookStatus, setWebhookStatus] = useState('error');

  // Products state
  const [products, setProducts] = useState('R Pipe Tobacco, Nike Air Jorden Sport class A, CBD Tobacco 10oz');
  const [defaultPsp, setDefaultPsp] = useState('rapyd');
  const [routingSessionId, setRoutingSessionId] = useState('pBYLQJECtkguwDSybjFOnzZR');

  useEffect(() => {
    initializeSdk();
  }, []);

  const initializeSdk = () => {
    const stored = localStorage.getItem(API_KEYS_STORAGE);
    if (stored) {
      const { accessKey, secretKey } = JSON.parse(stored);
      setSdk(new ReveliusClient({ accessKey, secretKey }));
    }
  };

  const checkKeys = (): boolean => {
    if (!sdk) {
      setShowKeysModal(true);
      setResult('⚠️ Please configure your API keys first');
      return false;
    }
    return true;
  };

  const handleKeysConfigured = () => {
    initializeSdk();
    setShowKeysModal(false);
  };

  const executeRequest = async (name: string, fn: () => Promise<any>) => {
    if (!checkKeys()) return null;
    setLoading(true);
    setResult(`Executing ${name}...\n\nPlease wait...`);
    try {
      const response = await fn();
      if (response.success) {
        setResult(JSON.stringify(response.data, null, 2));
        return response;
      } else {
        const errorDetails = {
          error: response.error,
          message: response.message,
          data: response.data,
          timestamp: new Date().toISOString(),
        };
        setResult(
          `❌ API Error\n\n${JSON.stringify(errorDetails, null, 2)}\n\n` +
          `💡 Common Issues:\n` +
          `- CORS: API must allow browser requests from localhost\n` +
          `- Auth: Check that your access/secret keys are valid\n` +
          `- Network: Verify the API endpoint exists and is reachable`
        );
        return null;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setResult(
        `❌ Exception Caught\n\n` +
        `Error: ${errorMsg}\n\n` +
        `💡 This usually indicates:\n` +
        `- Network connection failure\n` +
        `- CORS blocking the request\n` +
        `- Invalid URL or endpoint`
      );
      console.error('SDK Error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revelius API Testing</h1>
            <p className="text-sm text-gray-600 mt-1">
              Test all 11 endpoints from your Postman collection
            </p>
          </div>
          <button
            onClick={() => setShowKeysModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
          >
            Configure API Keys
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'scanner'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Scanner (5)
          </button>
          <button
            onClick={() => setActiveTab('operations')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'operations'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Operations (2)
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Products (4)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">
              {activeTab === 'scanner' && 'Scanner Endpoints'}
              {activeTab === 'operations' && 'Operations Endpoints'}
              {activeTab === 'products' && 'Products Endpoints'}
            </h3>

            {/* SCANNER */}
            {activeTab === 'scanner' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                    <code className="text-xs">/scanner/categories</code>
                  </div>
                  <button
                    onClick={() => executeRequest('Get Categories', () => sdk!.getScannerCategories())}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Get Categories
                  </button>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                    <code className="text-xs">/scanner/scan</code>
                  </div>
                  <input
                    type="text"
                    value={scanUrl}
                    onChange={(e) => setScanUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                  />
                  <button
                    onClick={async () => {
                      const response = await executeRequest('Scan Website', () => 
                        sdk!.scanWebsite({ url: scanUrl })
                      );
                      if (response && response.data?.session_id) {
                        setSessionId(response.data.session_id);
                      }
                    }}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Scan Website
                  </button>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                    <code className="text-xs">/scanner/session/status</code>
                  </div>
                  <input
                    type="text"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    placeholder="Session ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                  />
                  <button
                    onClick={() => executeRequest('Get Session Status', () => 
                      sdk!.getSessionStatus(sessionId)
                    )}
                    disabled={loading || !sessionId}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Check Status
                  </button>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                    <code className="text-xs">/scanner/report/pdf</code>
                  </div>
                  <button
                    onClick={() => executeRequest('Get PDF Report', () => 
                      sdk!.getPdfReport(sessionId)
                    )}
                    disabled={loading || !sessionId}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Get PDF
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                    <code className="text-xs">/scanner/report/json</code>
                  </div>
                  <button
                    onClick={() => executeRequest('Get JSON Report', () => 
                      sdk!.getJsonReport(sessionId)
                    )}
                    disabled={loading || !sessionId}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Get JSON Report
                  </button>
                </div>
              </div>
            )}

            {/* OPERATIONS */}
            {activeTab === 'operations' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                    <code className="text-xs">/operations/create_promo</code>
                  </div>
                  <input
                    type="text"
                    value={promoName}
                    onChange={(e) => setPromoName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                  />
                  <input
                    type="email"
                    value={promoEmail}
                    onChange={(e) => setPromoEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                  />
                  <button
                    onClick={() => executeRequest('Create Promo Customer', () => 
                      sdk!.createPromoCustomer({ name: promoName, email: promoEmail })
                    )}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Create Customer
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                    <code className="text-xs">/operations/webhook_handler</code>
                  </div>
                  <select
                    value={webhookStatus}
                    onChange={(e) => setWebhookStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                  >
                    <option value="error">error</option>
                    <option value="success">success</option>
                    <option value="pending">pending</option>
                  </select>
                  <button
                    onClick={() => executeRequest('Webhook Handler', () => 
                      sdk!.webhookHandler({ status: webhookStatus })
                    )}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Send Webhook
                  </button>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                    <code className="text-xs">/products/categories</code>
                  </div>
                  <button
                    onClick={() => executeRequest('Get Product Categories', () => 
                      sdk!.getProductCategories()
                    )}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Get Categories
                  </button>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                    <code className="text-xs">/products/routing_table</code>
                  </div>
                  <button
                    onClick={() => executeRequest('Get Routing Table', () => 
                      sdk!.getRoutingTable()
                    )}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Get Routing Table
                  </button>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                    <code className="text-xs">/products/routing_table</code>
                  </div>
                  <input
                    type="text"
                    value={defaultPsp}
                    onChange={(e) => setDefaultPsp(e.target.value)}
                    placeholder="Default PSP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                  />
                  <button
                    onClick={() => executeRequest('Update Routing Table', () => 
                      sdk!.updateRoutingTable({
                        default_psp: defaultPsp,
                        mapping: {
                          stripe: ['68a18ad49d3b5972248ca507', '68a18ad49d3b5972248ca509'],
                          adyen: ['68a18ad49d3b5972248ca50b', '68a18ad49d3b5972248ca50c'],
                        }
                      })
                    )}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Update Table
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                    <code className="text-xs">/products/router</code>
                  </div>
                  <textarea
                    value={products}
                    onChange={(e) => setProducts(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                  />
                  <input
                    type="text"
                    value={routingSessionId}
                    onChange={(e) => setRoutingSessionId(e.target.value)}
                    placeholder="Session ID (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                  />
                  <button
                    onClick={() => executeRequest('Route Products', () => 
                      sdk!.routeProducts(
                        { products: products.split(',').map(p => p.trim()) },
                        routingSessionId || undefined
                      )
                    )}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Route Products
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Response */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Response</h3>
              {loading && (
                <Badge className="bg-blue-100 text-blue-800">Loading...</Badge>
              )}
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto" style={{ maxHeight: '70vh' }}>
              <pre className="whitespace-pre-wrap">{result || 'Click an endpoint to test the API'}</pre>
            </div>
          </Card>
        </div>
      </div>

      {/* API Keys Modal */}
      {showKeysModal && (
        <ApiKeysModal
          onClose={() => setShowKeysModal(false)}
          onKeysConfigured={handleKeysConfigured}
        />
      )}
    </div>
  );
}
