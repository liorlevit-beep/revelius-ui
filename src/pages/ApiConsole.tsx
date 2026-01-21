import { useState, useEffect, useRef } from 'react';
import { ScannerAPI, ProductsAPI, OperationsAPI, ApiError } from '../api';
import { getEnvConfig } from '../config/env';
import { Card } from '../components/Card';
import { ApiKeysModal } from '../components/ApiKeysModal';
import type { RoutingTable } from '../types/products';

type TabType = 'scanner' | 'products' | 'operations' | 'raw';

interface RequestLog {
  method: string;
  path: string;
  timestamp: string;
  duration: number;
  status: number;
  statusText: string;
}

export default function ApiConsole() {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [keysConfigured, setKeysConfigured] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [lastRequest, setLastRequest] = useState<RequestLog | null>(null);
  const [loading, setLoading] = useState(false);

  // Scanner state
  const [websiteUrl, setWebsiteUrl] = useState('https://example.com');
  const [sessionId, setSessionId] = useState('');
  const [polling, setPolling] = useState(false);
  const pollingIntervalRef = useRef<number | null>(null);
  const pollingTimeoutRef = useRef<number | null>(null);

  // Products state
  const [routingTableJson, setRoutingTableJson] = useState(
    JSON.stringify({ default_psp: 'stripe', mapping: { adyen: ['cat1'] } }, null, 2)
  );
  const [routingJsonError, setRoutingJsonError] = useState('');
  const [productsInput, setProductsInput] = useState('product1\nproduct2\nproduct3');
  const [productsSessionId, setProductsSessionId] = useState('');

  // Operations state
  const [promoName, setPromoName] = useState('John Doe');
  const [promoEmail, setPromoEmail] = useState('john@example.com');
  const [webhookIdentifier, setWebhookIdentifier] = useState('webhook_123');
  const [webhookPayload, setWebhookPayload] = useState(
    JSON.stringify({ event: 'test', data: {} }, null, 2)
  );

  // Raw request state
  const [rawMethod, setRawMethod] = useState<'GET' | 'POST'>('GET');
  const [rawPath, setRawPath] = useState('/scanner/categories');
  const [rawSessionId, setRawSessionId] = useState('');
  const [rawBody, setRawBody] = useState('');

  // Response state
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    // Check mock mode
    const mockFlag = import.meta.env.VITE_REVELIUS_MOCK || "0";
    setIsMockMode(mockFlag === "1");

    // Get base URL
    try {
      const env = getEnvConfig();
      setBaseUrl(env.baseUrl);
    } catch {
      setBaseUrl('https://api.revelius.com');
    }

    // Check if keys are configured
    const checkKeys = () => {
      const accessKey = localStorage.getItem('revelius_access_key');
      const secretKey = localStorage.getItem('revelius_secret_key');
      const configured = !!(accessKey && secretKey);
      
      setKeysConfigured(configured);
      
      if (!configured) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };
    
    checkKeys();
    
    // Load last session ID
    const lastSession = localStorage.getItem('revelius:lastSessionId');
    if (lastSession) {
      setSessionId(lastSession);
      setProductsSessionId(lastSession);
      setRawSessionId(lastSession);
    }
    
    const interval = setInterval(checkKeys, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  const handleKeysConfigured = () => {
    const accessKey = localStorage.getItem('revelius_access_key');
    const secretKey = localStorage.getItem('revelius_secret_key');
    const configured = !!(accessKey && secretKey);
    
    setKeysConfigured(configured);
    setShowModal(!configured);
  };

  const executeRequest = async <T,>(
    name: string,
    method: string,
    path: string,
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError('');
    setResponse('');
    setPdfBlob(null);

    const startTime = performance.now();

    // Log request
    console.group(`🔵 API Request: ${method} ${path}`);
    console.log('Action:', name);
    console.log('Timestamp:', new Date().toISOString());

    try {
      const result = await apiCall();
      const duration = Math.round(performance.now() - startTime);

      // Log successful response
      console.log('✅ Status: 200 OK');
      console.log(`⏱️ Duration: ${duration}ms`);
      console.log('📦 Response:', result);
      console.groupEnd();

      setLastRequest({
        method,
        path,
        timestamp: new Date().toISOString(),
        duration,
        status: 200,
        statusText: 'OK'
      });

      return result;
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);

      // Log error
      console.log('❌ Error occurred');
      console.log(`⏱️ Duration: ${duration}ms`);
      console.error('Error details:', err);
      console.groupEnd();

      if (err instanceof ApiError) {
        setError(`${err.message} (Status: ${err.status})\n${JSON.stringify(err.details, null, 2)}`);
        setLastRequest({
          method,
          path,
          timestamp: new Date().toISOString(),
          duration,
          status: err.status,
          statusText: err.message
        });
      } else if (err instanceof Error) {
        setError(err.message);
        setLastRequest({
          method,
          path,
          timestamp: new Date().toISOString(),
          duration,
          status: 500,
          statusText: 'Error'
        });
      } else {
        setError('Unknown error occurred');
        setLastRequest({
          method,
          path,
          timestamp: new Date().toISOString(),
          duration,
          status: 500,
          statusText: 'Unknown Error'
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Scanner actions
  const handleGetCategories = async () => {
    console.clear();
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 GET SCANNER CATEGORIES');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Endpoint:', `${baseUrl}/scanner/categories`);
    console.log('-----------------------------------------------------------');
    
    const result = await executeRequest('getCategories', 'GET', '/scanner/categories', ScannerAPI.getCategories);
    
    if (result) {
      console.log('═══════════════════════════════════════════════════════');
      console.log('📦 EXACT API RESPONSE:');
      console.log('═══════════════════════════════════════════════════════');
      console.log(JSON.stringify(result, null, 2));
      console.log('-----------------------------------------------------------');
      console.log('Response Object:', result);
      console.log('═══════════════════════════════════════════════════════');
      
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const handleGetAllSessions = async () => {
    const result = await executeRequest('getAllSessions', 'GET', '/scanner/session/all', ScannerAPI.getAllSessions);
    if (result) {
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const handleScanWebsite = async () => {
    const result = await executeRequest('scanWebsite', 'POST', '/scanner/scan', () => ScannerAPI.scanWebsite(websiteUrl));
    if (result && typeof result === 'object' && 'data' in result) {
      const data = result.data as { session_id?: string };
      if (data.session_id) {
        setSessionId(data.session_id);
        setProductsSessionId(data.session_id);
        setRawSessionId(data.session_id);
        localStorage.setItem('revelius:lastSessionId', data.session_id);
      }
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const handleGetStatus = async () => {
    const result = await executeRequest('getStatus', 'GET', '/scanner/session/status', () => ScannerAPI.getSessionStatus(sessionId));
    if (result) {
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const startPolling = () => {
    if (polling || !sessionId) return;
    
    setPolling(true);
    let pollCount = 0;
    const maxPolls = 30; // 60 seconds / 2 seconds

    const poll = async () => {
      if (pollCount >= maxPolls) {
        stopPolling();
        setError('Polling timeout after 60 seconds');
        return;
      }

      const result = await executeRequest('pollStatus', 'GET', '/scanner/session/status', () => ScannerAPI.getSessionStatus(sessionId));
      if (result) {
        setResponse(JSON.stringify(result, null, 2));
        
        // Check if completed or failed
        if (typeof result === 'object' && result !== null && 'status' in result) {
          const status = (result as { status: string }).status;
          if (status === 'completed' || status === 'failed') {
            stopPolling();
          }
        }
      }
      
      pollCount++;
    };

    // Initial poll
    poll();

    // Set up interval
    pollingIntervalRef.current = window.setInterval(poll, 2000);

    // Set up timeout
    pollingTimeoutRef.current = window.setTimeout(() => {
      stopPolling();
    }, 60000);
  };

  const stopPolling = () => {
    setPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  };

  const handleGetReport = async () => {
    const result = await executeRequest('getReport', 'GET', '/scanner/report/json', () => ScannerAPI.getJsonReport(sessionId));
    if (result) {
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const handleGetPdf = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    setPdfBlob(null);

    const startTime = performance.now();

    try {
      const blob = await ScannerAPI.getPdfReport(sessionId);
      const duration = Math.round(performance.now() - startTime);

      setPdfBlob(blob);
      setResponse('PDF ready for download');
      setLastRequest({
        method: 'GET',
        path: '/scanner/report/pdf',
        timestamp: new Date().toISOString(),
        duration,
        status: 200,
        statusText: 'OK'
      });
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      if (err instanceof ApiError) {
        setError(`${err.message} (Status: ${err.status})`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
      setLastRequest({
        method: 'GET',
        path: '/scanner/report/pdf',
        timestamp: new Date().toISOString(),
        duration,
        status: 500,
        statusText: 'Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${sessionId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Products actions
  const handleGetProductCategories = async () => {
    const result = await executeRequest('getProductCategories', 'GET', '/products/categories', ProductsAPI.getCategories);
    if (result) {
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const handleGetAllProducts = async () => {
    const result = await executeRequest('getAllProducts', 'GET', '/products/all', () => ProductsAPI.getAllProducts(productsSessionId || undefined));
    if (result) {
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const handleGetRoutingTable = async () => {
    const result = await executeRequest('getRoutingTable', 'GET', '/products/routing_table', ProductsAPI.getRoutingTable);
    if (result) {
      const json = JSON.stringify(result, null, 2);
      setResponse(json);
      setRoutingTableJson(json);
    }
  };

  const handlePostRoutingTable = async () => {
    try {
      const payload: RoutingTable = JSON.parse(routingTableJson);
      setRoutingJsonError('');
      const result = await executeRequest('postRoutingTable', 'POST', '/products/routing_table', () => ProductsAPI.upsertRoutingTable(payload));
      if (result) {
        setResponse(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setRoutingJsonError('Invalid JSON: ' + err.message);
      } else {
        setRoutingJsonError('Error: ' + String(err));
      }
    }
  };

  const handleRouteProducts = async () => {
    const products = productsInput.split(/[\n,]/).map(p => p.trim()).filter(Boolean);
    const result = await executeRequest('routeProducts', 'POST', '/products/router', () => ProductsAPI.routeProducts(productsSessionId, products));
    if (result) {
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  // Operations actions
  const handleCreatePromo = async () => {
    const result = await executeRequest('createPromo', 'POST', '/operations/create_promo', () => OperationsAPI.createPromoCustomer(promoName, promoEmail));
    if (result) {
      setResponse(JSON.stringify(result, null, 2));
    }
  };

  const handleWebhook = async () => {
    try {
      const payload = JSON.parse(webhookPayload);
      const result = await executeRequest('webhookHandler', 'POST', '/operations/webhook_handler', () => OperationsAPI.webhookHandler(webhookIdentifier, payload));
      if (result) {
        setResponse(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      setError('Invalid JSON payload: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Raw request
  const handleRawRequest = async () => {
    setError('Not yet implemented - use specific tabs');
  };

  const handleConnectionTest = async () => {
    await handleGetCategories();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Console</h1>
        <p className="text-gray-600">Test Revelius API endpoints with live requests</p>
        
        {/* Status Bar */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mode Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
              isMockMode
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <span className="text-base">{isMockMode ? '🎭' : '🚀'}</span>
              <span className="font-bold">{isMockMode ? 'DEMO MODE' : 'OPERATIONAL'}</span>
            </div>
            
            {/* API Keys Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
              keysConfigured 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${keysConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              {keysConfigured ? 'Keys Configured' : 'Keys Required'}
            </div>

            {/* Base URL */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xs font-mono text-gray-600">{baseUrl}</span>
            </div>

            {/* Connection Test */}
            <button
              onClick={handleConnectionTest}
              disabled={loading || !keysConfigured}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Test Connection
            </button>
          </div>

          {/* Last Request Status */}
          {lastRequest && (
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-2 py-1 rounded font-mono text-xs ${
                lastRequest.status >= 200 && lastRequest.status < 300
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {lastRequest.status}
              </span>
              <span className="text-gray-600">{lastRequest.method} {lastRequest.path}</span>
              <span className="text-gray-500">{lastRequest.duration}ms</span>
              <span className="text-gray-400 text-xs">{new Date(lastRequest.timestamp).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1">
          {[
            { id: 'scanner', label: '📡 Scanner', disabled: false },
            { id: 'products', label: '📦 Products', disabled: false },
            { id: 'operations', label: '⚙️ Operations', disabled: false },
            { id: 'raw', label: '🔧 Raw Request', disabled: true }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id as TabType)}
              disabled={tab.disabled}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Actions */}
        <div className="space-y-4">
          {activeTab === 'scanner' && (
            <>
              {/* Categories */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Get Categories</h3>
                <button
                  onClick={handleGetCategories}
                  disabled={loading || !keysConfigured}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  GET /scanner/categories
                </button>
                {!keysConfigured && (
                  <p className="text-xs text-amber-600 mt-2">⚠️ API keys required</p>
                )}
              </Card>

              {/* All Sessions */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Get All Sessions</h3>
                <button
                  onClick={handleGetAllSessions}
                  disabled={loading || !keysConfigured}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  GET /scanner/session/all
                </button>
                {!keysConfigured && (
                  <p className="text-xs text-amber-600 mt-2">⚠️ API keys required</p>
                )}
              </Card>

              {/* Scan Website */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Scan Website</h3>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <button
                  onClick={handleScanWebsite}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  POST /scanner/scan
                </button>
              </Card>

              {/* Session Status */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Session Status</h3>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Session ID"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={handleGetStatus}
                    disabled={loading || !sessionId}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    GET Status
                  </button>
                  <button
                    onClick={polling ? stopPolling : startPolling}
                    disabled={loading || !sessionId}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      polling
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50`}
                  >
                    {polling ? 'Stop Poll' : 'Start Poll'}
                  </button>
                </div>
                {polling && (
                  <p className="text-xs text-blue-600">Polling every 2s (max 60s)</p>
                )}
              </Card>

              {/* Report JSON */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Get Report (JSON)</h3>
                <button
                  onClick={handleGetReport}
                  disabled={loading || !sessionId}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  GET /scanner/report/json
                </button>
              </Card>

              {/* Report PDF */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Get Report (PDF)</h3>
                <button
                  onClick={handleGetPdf}
                  disabled={loading || !sessionId}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 mb-2"
                >
                  GET /scanner/report/pdf
                </button>
                {pdfBlob && (
                  <button
                    onClick={downloadPdf}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    📥 Download PDF
                  </button>
                )}
              </Card>
            </>
          )}

          {activeTab === 'products' && (
            <>
              {/* Categories */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Get Categories</h3>
                <button
                  onClick={handleGetProductCategories}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  GET /products/categories
                </button>
              </Card>

              {/* All Products */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Get All Products</h3>
                <input
                  type="text"
                  value={productsSessionId}
                  onChange={(e) => setProductsSessionId(e.target.value)}
                  placeholder="Session ID (optional)"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <button
                  onClick={handleGetAllProducts}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  GET /products/all
                </button>
              </Card>

              {/* Routing Table GET */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Get Routing Table</h3>
                <button
                  onClick={handleGetRoutingTable}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  GET /products/routing_table
                </button>
              </Card>

              {/* Routing Table POST */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Update Routing Table</h3>
                <textarea
                  value={routingTableJson}
                  onChange={(e) => {
                    setRoutingTableJson(e.target.value);
                    setRoutingJsonError('');
                  }}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs mb-2"
                />
                {routingJsonError && (
                  <p className="text-xs text-red-600 mb-2">{routingJsonError}</p>
                )}
                <button
                  onClick={handlePostRoutingTable}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  POST /products/routing_table
                </button>
              </Card>

              {/* Router */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Route Products</h3>
                <input
                  type="text"
                  value={productsSessionId}
                  onChange={(e) => setProductsSessionId(e.target.value)}
                  placeholder="Session ID"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <textarea
                  value={productsInput}
                  onChange={(e) => setProductsInput(e.target.value)}
                  rows={3}
                  placeholder="product1&#10;product2&#10;product3"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <button
                  onClick={handleRouteProducts}
                  disabled={loading || !productsSessionId}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  POST /products/router
                </button>
              </Card>
            </>
          )}

          {activeTab === 'operations' && (
            <>
              <Card className="p-4 bg-amber-50 border-amber-200">
                <p className="text-sm text-amber-800">⚠️ Internal / dev only</p>
              </Card>

              {/* Create Promo */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Create Promo Customer</h3>
                <input
                  type="text"
                  value={promoName}
                  onChange={(e) => setPromoName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <input
                  type="email"
                  value={promoEmail}
                  onChange={(e) => setPromoEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <button
                  onClick={handleCreatePromo}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  POST /operations/create_promo
                </button>
              </Card>

              {/* Webhook Handler */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Webhook Handler</h3>
                <input
                  type="text"
                  value={webhookIdentifier}
                  onChange={(e) => setWebhookIdentifier(e.target.value)}
                  placeholder="Internal-Identifier"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <textarea
                  value={webhookPayload}
                  onChange={(e) => setWebhookPayload(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs mb-2"
                />
                <button
                  onClick={handleWebhook}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  POST /operations/webhook_handler
                </button>
              </Card>
            </>
          )}

          {activeTab === 'raw' && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Raw Request Builder</h3>
              <select
                value={rawMethod}
                onChange={(e) => setRawMethod(e.target.value as 'GET' | 'POST')}
                className="w-full px-3 py-2 border rounded-lg mb-2"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                type="text"
                value={rawPath}
                onChange={(e) => setRawPath(e.target.value)}
                placeholder="/scanner/categories"
                className="w-full px-3 py-2 border rounded-lg mb-2"
              />
              <input
                type="text"
                value={rawSessionId}
                onChange={(e) => setRawSessionId(e.target.value)}
                placeholder="Session ID (optional)"
                className="w-full px-3 py-2 border rounded-lg mb-2"
              />
              {rawMethod === 'POST' && (
                <textarea
                  value={rawBody}
                  onChange={(e) => setRawBody(e.target.value)}
                  rows={4}
                  placeholder='{"key": "value"}'
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs mb-2"
                />
              )}
              <button
                onClick={handleRawRequest}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                Execute Request
              </button>
            </Card>
          )}
        </div>

        {/* Right Column - Response */}
        <div>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Response</h3>
              {response && (
                <button
                  onClick={() => navigator.clipboard.writeText(response)}
                  className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Copy
                </button>
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm font-semibold text-red-800 mb-2">Error:</p>
                <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-x-auto max-h-[700px] overflow-y-auto">
                  {error}
                </pre>
              </div>
            )}

            {response && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-100 border-b border-gray-200">
                  <span className="text-xs font-mono text-gray-600">
                    {response.length} characters | {response.split('\n').length} lines
                  </span>
                </div>
                <div className="p-4 bg-gray-50 max-h-[800px] overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto font-mono">
                    {response}
                  </pre>
                </div>
              </div>
            )}

            {!error && !response && (
              <div className="text-center py-12 text-gray-500 text-sm">
                Execute a request to see the response...
              </div>
            )}
          </Card>
        </div>
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
