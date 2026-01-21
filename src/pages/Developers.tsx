import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, Copy, Eye, EyeOff, ExternalLink, Download, Zap, Lock, GitBranch, Code, FileJson, Terminal, Book } from 'lucide-react';
import { Card } from '../components/Card';
import { ScannerAPI, ProductsAPI, OperationsAPI, ApiError } from '../api';
import { getEnvConfig } from '../config/env';
import { GenerateFromScanModal } from '../components/products/GenerateFromScanModal';

type ActiveTab = 'documentation' | 'debug';

export function Developers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('documentation');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  
  // Debug tab state
  const [debugResponse, setDebugResponse] = useState<string>('');
  const [debugError, setDebugError] = useState<string>('');
  const [debugLoading, setDebugLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('');
  const [debugSessionId, setDebugSessionId] = useState('');
  const [debugWebsiteUrl, setDebugWebsiteUrl] = useState('https://example.com');
  const [debugRoutingTable, setDebugRoutingTable] = useState(JSON.stringify({ default_psp: 'stripe', mapping: {} }, null, 2));
  const [debugProducts, setDebugProducts] = useState('product1\nproduct2');
  const [debugPromoName, setDebugPromoName] = useState('John Doe');
  const [debugPromoEmail, setDebugPromoEmail] = useState('john@example.com');
  const [debugWebhookIdentifier, setDebugWebhookIdentifier] = useState('webhook_123');
  const [debugWebhookPayload, setDebugWebhookPayload] = useState(JSON.stringify({ event: 'test', data: {} }, null, 2));
  
  // Modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    // Load keys from localStorage
    const storedAccess = localStorage.getItem('revelius_access_key') || '';
    const storedSecret = localStorage.getItem('revelius_secret_key') || '';
    setAccessKey(storedAccess);
    setSecretKey(storedSecret);
  }, []);

  const handleSaveKeys = () => {
    localStorage.setItem('revelius_access_key', accessKey);
    localStorage.setItem('revelius_secret_key', secretKey);
    alert('API keys saved to localStorage (demo only)');
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionMessage('Testing connection...');
    
    try {
      const result = await ScannerAPI.getCategories();
      setConnectionStatus('success');
      setConnectionMessage(`✓ Connected successfully. Found ${result.data.length} categories.`);
    } catch (error) {
      setConnectionStatus('error');
      if (error instanceof ApiError) {
        setConnectionMessage(`✗ Connection failed: ${error.message} (Status: ${error.status})`);
      } else if (error instanceof Error) {
        setConnectionMessage(`✗ Connection failed: ${error.message}`);
      } else {
        setConnectionMessage('✗ Connection failed: Unknown error');
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const executeDebugEndpoint = async (endpointId?: string) => {
    const endpoint = endpointId || selectedEndpoint;
    if (!endpoint) {
      setDebugError('Please select an endpoint');
      return;
    }

    setSelectedEndpoint(endpoint);
    setDebugLoading(true);
    setDebugError('');
    setDebugResponse('');

    try {
      let result;
      
      switch (endpoint) {
        case 'scanner/categories':
          result = await ScannerAPI.getCategories();
          break;
        case 'scanner/scan':
          result = await ScannerAPI.scanWebsite(debugWebsiteUrl);
          if (result.data?.session_id) {
            setDebugSessionId(result.data.session_id);
            localStorage.setItem('revelius:lastSessionId', result.data.session_id);
          }
          break;
        case 'scanner/session/status':
          if (!debugSessionId) {
            throw new Error('Session ID required');
          }
          result = await ScannerAPI.getSessionStatus(debugSessionId);
          break;
        case 'scanner/session/all':
          result = await ScannerAPI.getAllSessions();
          break;
        case 'scanner/report/json':
          if (!debugSessionId) {
            throw new Error('Session ID required');
          }
          result = await ScannerAPI.getJsonReport(debugSessionId);
          break;
        case 'products/categories':
          result = await ProductsAPI.getCategories();
          break;
        case 'products/all':
          result = await ProductsAPI.getAllProducts(debugSessionId || undefined);
          break;
        case 'products/routing_table':
          result = await ProductsAPI.getRoutingTable();
          break;
        case 'products/routing_table/update':
          try {
            const tableData = JSON.parse(debugRoutingTable);
            result = await ProductsAPI.upsertRoutingTable(tableData);
          } catch (e) {
            throw new Error('Invalid routing table JSON');
          }
          break;
        case 'products/router':
          if (!debugSessionId) {
            throw new Error('Session ID required for routing');
          }
          const products = debugProducts.split('\n').filter(p => p.trim());
          result = await ProductsAPI.routeProducts(debugSessionId, products);
          break;
        case 'operations/create_promo':
          result = await OperationsAPI.createPromoCustomer(debugPromoName, debugPromoEmail);
          break;
        case 'operations/webhook_handler':
          try {
            const webhookData = JSON.parse(debugWebhookPayload);
            result = await OperationsAPI.webhookHandler(debugWebhookIdentifier, webhookData);
          } catch (e) {
            throw new Error('Invalid webhook payload JSON');
          }
          break;
        default:
          throw new Error('Unknown endpoint');
      }

      setDebugResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      if (error instanceof ApiError) {
        setDebugError(`API Error: ${error.message} (Status: ${error.status})`);
      } else if (error instanceof Error) {
        setDebugError(`Error: ${error.message}`);
      } else {
        setDebugError('Unknown error occurred');
      }
    } finally {
      setDebugLoading(false);
    }
  };

  const env = getEnvConfig();

  // Code snippets
  const signerSnippet = `import SHA256 from 'crypto-js/sha256';

export function getSignedHeaders(
  accessKey: string,
  secretKey: string,
  sessionId?: string
): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  
  const headers: Record<string, string> = {
    "Access-Key": accessKey,
    "Timestamp": timestamp,
  };
  
  if (sessionId) {
    headers["Session-Id"] = sessionId;
  }
  
  // Sort and format as query string
  const sorted = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => \`\${key}=\${encodeURIComponent(value)}\`)
    .join('&');
  
  // Base64 encode + SHA256
  const base64String = btoa(sorted + secretKey);
  const signature = SHA256(base64String).toString();
  
  return { ...headers, "Signature": signature };
}`;

  const curlExample = `curl -X POST https://api.revelius.com/scanner/scan \\
  -H "Access-Key: your_access_key" \\
  -H "Timestamp: 1642598400" \\
  -H "Signature: abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`;

  const tsExample = `import { ScannerAPI } from './api';

// Scan a website
const scan = await ScannerAPI.scanWebsite('https://example.com');
const sessionId = scan.data.session_id;

// Check status
const status = await ScannerAPI.getSessionStatus(sessionId);

// Get report
const report = await ScannerAPI.getJsonReport(sessionId);`;

  const webhookPayload = `{
  "event": "scan.completed",
  "session_id": "sess_abc123",
  "timestamp": "2026-01-12T10:30:00Z",
  "data": {
    "url": "https://example.com",
    "risk_score": 42,
    "status": "completed"
  }
}`;

  const endpoints = [
    {
      group: 'Scanner',
      items: [
        { method: 'GET', path: '/scanner/categories', description: 'List all scanner categories' },
        { method: 'POST', path: '/scanner/scan', description: 'Scan a website, returns session_id' },
        { method: 'GET', path: '/scanner/session/status', description: 'Check scan status (requires Session-Id header)' },
        { method: 'GET', path: '/scanner/report/json', description: 'Get JSON report (requires Session-Id header)' },
        { method: 'GET', path: '/scanner/report/pdf', description: 'Download PDF report (requires Session-Id header)' },
      ],
    },
    {
      group: 'Products',
      items: [
        { method: 'GET', path: '/products/categories', description: 'List product categories' },
        { method: 'GET', path: '/products/all', description: 'Get all products' },
        { method: 'GET', path: '/products/routing_table', description: 'Get routing configuration' },
        { method: 'POST', path: '/products/routing_table', description: 'Update routing configuration' },
        { method: 'POST', path: '/products/router', description: 'Route products (requires Session-Id header)' },
      ],
    },
    {
      group: 'Operations',
      items: [
        { method: 'POST', path: '/operations/create_promo', description: 'Create promotional customer' },
        { method: 'POST', path: '/operations/webhook_handler', description: 'Handle webhook (requires Internal-Identifier header)' },
      ],
    },
  ];

  const debugEndpoints = [
    { group: 'Scanner', endpoints: [
      { id: 'scanner/categories', label: 'GET /scanner/categories', requiresSession: false },
      { id: 'scanner/scan', label: 'POST /scanner/scan', requiresSession: false },
      { id: 'scanner/session/status', label: 'GET /scanner/session/status', requiresSession: true },
      { id: 'scanner/session/all', label: 'GET /scanner/session/all', requiresSession: false },
      { id: 'scanner/report/json', label: 'GET /scanner/report/json', requiresSession: true },
    ]},
    { group: 'Products', endpoints: [
      { id: 'products/categories', label: 'GET /products/categories', requiresSession: false },
      { id: 'products/all', label: 'GET /products/all (optional Session-Id)', requiresSession: false },
      { id: 'products/routing_table', label: 'GET /products/routing_table', requiresSession: false },
      { id: 'products/routing_table/update', label: 'POST /products/routing_table', requiresSession: false },
      { id: 'products/router', label: 'POST /products/router', requiresSession: true },
    ]},
    { group: 'Operations', endpoints: [
      { id: 'operations/create_promo', label: 'POST /operations/create_promo', requiresSession: false },
      { id: 'operations/webhook_handler', label: 'POST /operations/webhook_handler', requiresSession: false },
    ]},
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Revelius API</h1>
        <p className="text-gray-600 dark:text-gray-400">
          API documentation and interactive debug console
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-white/10">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('documentation')}
            className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'documentation'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Book className="w-4 h-4" />
            Documentation
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'debug'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Debug Console
          </button>
        </nav>
      </div>

      {activeTab === 'documentation' && (
        <div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Connection Status */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Connection Status</h2>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Base URL:</span>
              <span className="font-mono text-xs text-gray-900 dark:text-gray-300">{env.baseUrl}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Mock Mode:</span>
              <span className={`font-semibold ${env.mock ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {env.mock ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {connectionStatus !== 'idle' && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${
              connectionStatus === 'testing' ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' :
              connectionStatus === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
              'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300'
            }`}>
              {connectionMessage}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={() => navigate('/api-playground')}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open API Playground
            </button>
          </div>
        </Card>

        {/* API Keys */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">API Keys</h2>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 mb-4">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Demo Only:</strong> Never expose secret keys in production client-side code. 
                Use a secure backend proxy for authentication.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Access Key</label>
              <div className="flex gap-2">
                <input
                  type={showAccessKey ? 'text' : 'password'}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white"
                  placeholder="demo_access_key"
                />
                <button
                  onClick={() => setShowAccessKey(!showAccessKey)}
                  className="px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  {showAccessKey ? <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                </button>
                <button
                  onClick={() => copyToClipboard(accessKey, 'access')}
                  className="px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secret Key</label>
              <div className="flex gap-2">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white"
                  placeholder="demo_secret_key"
                />
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                </button>
                <button
                  onClick={() => copyToClipboard(secretKey, 'secret')}
                  className="px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveKeys}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Keys (Demo Only)
            </button>
          </div>
        </Card>
      </div>

      {/* Authentication */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Authentication</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          All API requests use signed header authentication with HMAC-SHA256. Each request must include:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-1">Access-Key</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Your API key</div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-1">Timestamp</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Unix seconds</div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-1">Signature</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">SHA256 hash</div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-1">Session-Id</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Optional</div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">TypeScript Signer Implementation</h3>
            <button
              onClick={() => copyToClipboard(signerSnippet, 'signer')}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copiedSnippet === 'signer' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
            <code>{signerSnippet}</code>
          </pre>
        </div>
      </Card>

      {/* Scan Lifecycle */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Scan Lifecycle</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Website scanning follows a session-based workflow. Each scan creates a unique <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-sm font-mono text-gray-900 dark:text-white">session_id</code> that tracks the scan through completion.
        </p>

        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg">
          <div className="flex-1">
            <div className="text-center mb-2">
              <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border-2 border-emerald-500">
                <div className="text-xs text-gray-500 mb-1">POST /scanner/scan</div>
                <div className="font-semibold text-emerald-600">Initiate Scan</div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 text-gray-400">→</div>
          
          <div className="flex-1">
            <div className="text-center mb-2">
              <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border-2 border-blue-500">
                <div className="text-xs text-gray-500 mb-1">GET /session/status</div>
                <div className="font-semibold text-blue-600">Check Progress</div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 text-gray-400">→</div>
          
          <div className="flex-1">
            <div className="text-center mb-2">
              <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border-2 border-purple-500">
                <div className="text-xs text-gray-500 mb-1">GET /report/json</div>
                <div className="font-semibold text-purple-600">Get Results</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> Include the <code className="px-1 bg-blue-100 dark:bg-blue-400/30 rounded text-gray-900 dark:text-white">Session-Id</code> header 
            in status and report requests to authenticate session-scoped operations.
          </p>
        </div>
      </Card>

      {/* Endpoints */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">API Endpoints</h2>
        </div>

        <div className="space-y-6">
          {endpoints.map((group) => (
            <div key={group.group}>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs text-gray-700 dark:text-gray-300">{group.group}</span>
              </h3>
              <div className="space-y-2">
                {group.items.map((endpoint, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'GET' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-gray-900 dark:text-white">{endpoint.path}</code>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{endpoint.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* SDK & Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">cURL Example</h2>
            <button
              onClick={() => copyToClipboard(curlExample, 'curl')}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copiedSnippet === 'curl' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
            <code>{curlExample}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">TypeScript SDK</h2>
            <button
              onClick={() => copyToClipboard(tsExample, 'ts')}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copiedSnippet === 'ts' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
            <code>{tsExample}</code>
          </pre>
        </Card>
      </div>

      {/* Webhooks */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Webhooks (Preview)</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Receive real-time notifications when scans complete, compliance events occur, or products are routed.
          Use the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-sm font-mono text-gray-900 dark:text-white">/operations/webhook_handler</code> endpoint 
          with an <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-sm font-mono text-gray-900 dark:text-white">Internal-Identifier</code> header.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Sample Payload</h3>
            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              <code>{webhookPayload}</code>
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Test Webhook</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Use the API Playground to send test webhook payloads and verify your endpoint configuration.
            </p>
            <button
              onClick={() => navigate('/api-playground')}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Send Test Webhook
            </button>
          </div>
        </div>
      </Card>

      {/* Postman Collection */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileJson className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Postman Collection</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Import the official Revelius API collection into Postman for quick testing and exploration.
        </p>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Collection Variables</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-mono">baseURL</span>
              <span className="font-mono text-xs text-gray-900 dark:text-gray-300">https://api.revelius.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-mono">accessKey</span>
              <span className="text-gray-500 dark:text-gray-500 text-xs">Your access key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-mono">secretKey</span>
              <span className="text-gray-500 dark:text-gray-500 text-xs">Your secret key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-mono">sessionId</span>
              <span className="text-gray-500 dark:text-gray-500 text-xs">Set after scanning</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://www.postman.com/revelius/workspace/revelius-api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Postman
          </a>
          <button
            onClick={() => alert('Download Postman collection from repository')}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </Card>
        </div>
      )}

      {activeTab === 'debug' && (
        <div className="space-y-6">
          {/* Debug Console Header */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">API Debug Console</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Test API endpoints directly from your browser. Results are displayed in real-time.
            </p>

            {/* Session ID Input */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session ID (for session-scoped operations)
              </label>
              <input
                type="text"
                value={debugSessionId}
                onChange={(e) => setDebugSessionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white"
                placeholder="sess_abc123..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Session ID is auto-populated when you create a scan
              </p>
            </div>
          </Card>

          {/* Endpoint Groups */}
          {debugEndpoints.map((group) => (
            <Card key={group.group} className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{group.group} Endpoints</h3>
              <div className="space-y-4">
                {group.endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <code className="text-sm font-mono text-gray-900 dark:text-white">{endpoint.label}</code>
                        {endpoint.requiresSession && (
                          <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded">
                            Requires Session ID
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => executeDebugEndpoint(endpoint.id)}
                        disabled={debugLoading}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        {debugLoading && selectedEndpoint === endpoint.id ? 'Executing...' : 'Execute'}
                      </button>
                    </div>

                    {/* Input Fields */}
                    {endpoint.id === 'scanner/scan' && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                        <input
                          type="text"
                          value={debugWebsiteUrl}
                          onChange={(e) => setDebugWebsiteUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg font-mono text-sm text-gray-900 dark:text-white"
                          placeholder="https://example.com"
                        />
                      </div>
                    )}

                    {endpoint.id === 'products/routing_table/update' && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Routing Table JSON</label>
                        <textarea
                          value={debugRoutingTable}
                          onChange={(e) => setDebugRoutingTable(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg font-mono text-xs text-gray-900 dark:text-white"
                          rows={4}
                        />
                      </div>
                    )}

                    {endpoint.id === 'products/router' && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Products (one per line)</label>
                        <textarea
                          value={debugProducts}
                          onChange={(e) => setDebugProducts(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg font-mono text-sm text-gray-900 dark:text-white"
                          rows={3}
                        />
                      </div>
                    )}

                    {endpoint.id === 'operations/create_promo' && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                          <input
                            type="text"
                            value={debugPromoName}
                            onChange={(e) => setDebugPromoName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            value={debugPromoEmail}
                            onChange={(e) => setDebugPromoEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    {endpoint.id === 'operations/webhook_handler' && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Webhook Identifier</label>
                          <input
                            type="text"
                            value={debugWebhookIdentifier}
                            onChange={(e) => setDebugWebhookIdentifier(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg font-mono text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payload JSON</label>
                          <textarea
                            value={debugWebhookPayload}
                            onChange={(e) => setDebugWebhookPayload(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg font-mono text-xs text-gray-900 dark:text-white"
                            rows={4}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Response/Error Display */}
          {(debugResponse || debugError) && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {debugError ? 'Error' : 'Response'}
                </h3>
                {debugResponse && (
                  <button
                    onClick={() => copyToClipboard(debugResponse, 'debug-response')}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedSnippet === 'debug-response' ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              {debugError ? (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400 text-sm font-mono">{debugError}</p>
                </div>
              ) : (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{debugResponse}</code>
                </pre>
              )}
            </Card>
          )}

          {/* Test Modal Button */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Test UI Components
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session ID for Generate From Scan Modal
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={debugSessionId}
                    onChange={(e) => setDebugSessionId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white"
                    placeholder="Enter session ID"
                  />
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    disabled={!debugSessionId}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Open Generate Modal
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Generate From Scan Modal */}
      {debugSessionId && (
        <GenerateFromScanModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          sessionId={debugSessionId}
        />
      )}
    </div>
  );
}
