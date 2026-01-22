import { useState } from 'react';
import { getEnvConfig } from '../config/env';
import { getSignedHeaders } from '../api/signer';

export default function Auth2() {
  const [googleToken, setGoogleToken] = useState('');
  const [request, setRequest] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnectGoogle() {
    setIsLoading(true);
    setError(null);
    
    try {
      // For testing, let's use a mock Google ID token
      // In real implementation, this would come from Google Identity Services
      const mockGoogleToken = prompt('Paste your Google ID token here (from https://jwt.io or Google OAuth):');
      
      if (!mockGoogleToken) {
        setError('No token provided');
        setIsLoading(false);
        return;
      }

      setGoogleToken(mockGoogleToken);

      // Get config and prepare request
      const env = getEnvConfig();
      const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
      
      const url = `${env.baseUrl}/auth/login`;
      const headers = {
        ...signedHeaders,
        'Authorization': `Bearer ${mockGoogleToken}`,
      };

      // Show what we're sending
      setRequest({
        url,
        method: 'GET',
        headers,
        note: 'Google ID token in Authorization header',
      });

      // Make the request
      const res = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await res.json();

      // Show what we got back
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: data,
      });

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Auth Debug Page</h1>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Left side - Connect button */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Test Connection</h2>
              
              <button
                onClick={handleConnectGoogle}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                    </svg>
                    <span>Connect with Google</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {googleToken && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Google ID Token (first 50 chars):</h3>
                  <code className="block p-3 bg-gray-900 rounded text-xs text-green-400 break-all">
                    {googleToken.substring(0, 50)}...
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Request/Response */}
          <div className="space-y-6">
            {/* Request box */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">📤 Request Sent</h2>
              {request ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">URL:</h3>
                    <code className="block p-2 bg-gray-900 rounded text-xs text-blue-400 break-all">
                      {request.method} {request.url}
                    </code>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">Headers:</h3>
                    <pre className="p-2 bg-gray-900 rounded text-xs text-gray-400 overflow-auto max-h-48">
                      {JSON.stringify(request.headers, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 italic">{request.note}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No request sent yet. Click "Connect with Google" to test.</p>
              )}
            </div>

            {/* Response box */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">📥 Response Received</h2>
              {response ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">Status:</h3>
                    <code className={`block p-2 bg-gray-900 rounded text-xs font-bold ${
                      response.status === 200 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {response.status} {response.statusText}
                    </code>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">Response Headers:</h3>
                    <pre className="p-2 bg-gray-900 rounded text-xs text-gray-400 overflow-auto max-h-32">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">Response Body:</h3>
                    <pre className="p-2 bg-gray-900 rounded text-xs text-yellow-400 overflow-auto max-h-64">
                      {JSON.stringify(response.body, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No response yet. Click "Connect with Google" to test.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
