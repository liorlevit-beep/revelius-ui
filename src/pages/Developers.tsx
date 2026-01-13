import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, Copy, Eye, EyeOff, ExternalLink, Download, Zap, Lock, GitBranch, Code, FileJson } from 'lucide-react';
import { Card } from '../components/Card';
import { ScannerAPI, ApiError } from '../api';
import { getEnvConfig } from '../config/env';

export function Developers() {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revelius API Documentation</h1>
        <p className="text-gray-600">
          Complete API reference for integrating with the Revelius compliance platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Connection Status */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Connection Status</h2>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base URL:</span>
              <span className="font-mono text-xs">{env.baseUrl}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mock Mode:</span>
              <span className={`font-semibold ${env.mock ? 'text-amber-600' : 'text-emerald-600'}`}>
                {env.mock ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {connectionStatus !== 'idle' && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${
              connectionStatus === 'testing' ? 'bg-blue-50 text-blue-700' :
              connectionStatus === 'success' ? 'bg-emerald-50 text-emerald-700' :
              'bg-red-50 text-red-700'
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
            <Lock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">API Keys</h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Demo Only:</strong> Never expose secret keys in production client-side code. 
                Use a secure backend proxy for authentication.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Key</label>
              <div className="flex gap-2">
                <input
                  type={showAccessKey ? 'text' : 'password'}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="demo_access_key"
                />
                <button
                  onClick={() => setShowAccessKey(!showAccessKey)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {showAccessKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(accessKey, 'access')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <div className="flex gap-2">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="demo_secret_key"
                />
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(secretKey, 'secret')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
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
          <Lock className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Authentication</h2>
        </div>

        <p className="text-gray-600 mb-4">
          All API requests use signed header authentication with HMAC-SHA256. Each request must include:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 mb-1">Access-Key</div>
            <div className="text-sm font-semibold">Your API key</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 mb-1">Timestamp</div>
            <div className="text-sm font-semibold">Unix seconds</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 mb-1">Signature</div>
            <div className="text-sm font-semibold">SHA256 hash</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-mono text-xs text-gray-500 mb-1">Session-Id</div>
            <div className="text-sm font-semibold">Optional</div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">TypeScript Signer Implementation</h3>
            <button
              onClick={() => copyToClipboard(signerSnippet, 'signer')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
          <GitBranch className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">Scan Lifecycle</h2>
        </div>

        <p className="text-gray-600 mb-4">
          Website scanning follows a session-based workflow. Each scan creates a unique <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">session_id</code> that tracks the scan through completion.
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

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Include the <code className="px-1 bg-blue-100 rounded">Session-Id</code> header 
            in status and report requests to authenticate session-scoped operations.
          </p>
        </div>
      </Card>

      {/* Endpoints */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">API Endpoints</h2>
        </div>

        <div className="space-y-6">
          {endpoints.map((group) => (
            <div key={group.group}>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{group.group}</span>
              </h3>
              <div className="space-y-2">
                {group.items.map((endpoint, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {endpoint.method}
                    </span>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                      <p className="text-xs text-gray-600 mt-1">{endpoint.description}</p>
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
            <h2 className="text-lg font-bold text-gray-900">cURL Example</h2>
            <button
              onClick={() => copyToClipboard(curlExample, 'curl')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copiedSnippet === 'curl' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
            <code>{curlExample}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">TypeScript SDK</h2>
            <button
              onClick={() => copyToClipboard(tsExample, 'ts')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copiedSnippet === 'ts' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
            <code>{tsExample}</code>
          </pre>
        </Card>
      </div>

      {/* Webhooks */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-bold text-gray-900">Webhooks (Preview)</h2>
        </div>

        <p className="text-gray-600 mb-4">
          Receive real-time notifications when scans complete, compliance events occur, or products are routed.
          Use the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">/operations/webhook_handler</code> endpoint 
          with an <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">Internal-Identifier</code> header.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Sample Payload</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              <code>{webhookPayload}</code>
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Test Webhook</h3>
            <p className="text-sm text-gray-600 mb-3">
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
          <FileJson className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-bold text-gray-900">Postman Collection</h2>
        </div>

        <p className="text-gray-600 mb-4">
          Import the official Revelius API collection into Postman for quick testing and exploration.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Collection Variables</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 font-mono">baseURL</span>
              <span className="font-mono text-xs">https://api.revelius.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-mono">accessKey</span>
              <span className="text-gray-500 text-xs">Your access key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-mono">secretKey</span>
              <span className="text-gray-500 text-xs">Your secret key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-mono">sessionId</span>
              <span className="text-gray-500 text-xs">Set after scanning</span>
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
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </Card>
    </div>
  );
}
