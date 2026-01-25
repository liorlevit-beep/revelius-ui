import { getEnvConfig } from '../config/env';
import { getSignedHeaders } from './signer';

/**
 * Custom API error with status code and optional details
 */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Track if we're currently refreshing to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  sessionId?: string;
  signal?: AbortSignal;
  responseType?: 'json' | 'blob' | 'text';
  _isRetry?: boolean; // Internal flag to prevent infinite retry loops
}

/**
 * Attempt to refresh the authentication token
 * Returns true if successful, false otherwise
 */
async function refreshAuthToken(): Promise<boolean> {
  // If already refreshing, wait for that to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.log('[refreshAuthToken] Attempting to refresh token...');
      const env = getEnvConfig();
      const currentToken = localStorage.getItem('revelius_auth_token');
      
      if (!currentToken) {
        console.log('[refreshAuthToken] No token to refresh');
        return false;
      }

      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('revelius_refresh_token');
      
      const requestUrl = `${env.baseUrl}/auth/refresh`;
      const requestHeaders = {
        'Authorization': `Bearer ${refreshToken || currentToken}`,
        'Content-Type': 'application/json',
      };
      const requestBody = {
        refresh_token: refreshToken || currentToken,
      };
      
      console.log('[refreshAuthToken] ========================================');
      console.log('[refreshAuthToken] 📤 SENDING REFRESH REQUEST');
      console.log('[refreshAuthToken] URL:', requestUrl);
      console.log('[refreshAuthToken] Method: POST');
      console.log('[refreshAuthToken] Has refresh_token in localStorage:', !!refreshToken);
      console.log('[refreshAuthToken] Using token (first 20 chars):', (refreshToken || currentToken).substring(0, 20) + '...');
      console.log('[refreshAuthToken] Headers:', {
        'Authorization': 'Bearer ' + (refreshToken || currentToken).substring(0, 20) + '...',
        'Content-Type': 'application/json',
      });
      console.log('[refreshAuthToken] Body:', {
        refresh_token: (refreshToken || currentToken).substring(0, 20) + '...'
      });
      console.log('[refreshAuthToken] ========================================');
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      console.log('[refreshAuthToken] ========================================');
      console.log('[refreshAuthToken] Response status:', response.status);
      console.log('[refreshAuthToken] Response statusText:', response.statusText);
      console.log('[refreshAuthToken] Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('[refreshAuthToken] ========================================');

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('[refreshAuthToken] ========================================');
        console.error('[refreshAuthToken] ❌ REFRESH FAILED');
        console.error('[refreshAuthToken] Status:', response.status, response.statusText);
        console.error('[refreshAuthToken] Error response body:', errorText);
        console.error('[refreshAuthToken] ========================================');
        return false;
      }

      const rawText = await response.text();
      console.log('[refreshAuthToken] ========================================');
      console.log('[refreshAuthToken] ✅ REFRESH SUCCESS');
      console.log('[refreshAuthToken] Raw response body:', rawText);
      console.log('[refreshAuthToken] Response length:', rawText.length, 'bytes');
      console.log('[refreshAuthToken] ========================================');
      
      const data = JSON.parse(rawText);
      console.log('[refreshAuthToken] Parsed response:', data);
      const newToken = data.session_token || data.token || data.data?.session_token || data.data?.token;
      const newRefreshToken = data.refresh_token || data.data?.refresh_token;
      
      if (!newToken) {
        console.log('[refreshAuthToken] No token in refresh response');
        return false;
      }

      // Update stored tokens
      localStorage.setItem('revelius_auth_token', newToken);
      
      if (newRefreshToken) {
        localStorage.setItem('revelius_refresh_token', newRefreshToken);
        console.log('[refreshAuthToken] New refresh token stored');
      }
      
      const expiresAt = data.expires_at || data.data?.expires_at;
      const expiresIn = data.expires_in || data.data?.expires_in;
      
      if (expiresAt) {
        localStorage.setItem('revelius_auth_expires_at', expiresAt);
      } else if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem('revelius_auth_expires_at', expiryTime.toString());
      }

      console.log('[refreshAuthToken] Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('[refreshAuthToken] Error:', error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Clear auth and redirect to login page
 */
function handleAuthFailure(reason: string = 'expired') {
  console.log('[handleAuthFailure] Clearing auth and redirecting to /auth');
  localStorage.removeItem('revelius_auth_token');
  localStorage.removeItem('revelius_refresh_token');
  localStorage.removeItem('revelius_auth_expires_at');
  window.location.assign(`/auth?reason=${reason}`);
}

/**
 * Centralized HTTP client with signed authentication
 */
export async function apiFetch<T>(
  path: string,
  opts: ApiFetchOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    sessionId,
    signal,
    responseType = 'json',
  } = opts;

  // Get fresh config (in case keys were just set via modal)
  const env = getEnvConfig();

  // Build full URL
  const url = `${env.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  // Log the actual request method we're sending (GET or POST only)
  // Note: Browser may send OPTIONS preflight automatically for CORS - that's not from our code
  console.log(`[apiFetch] Making ${method} request to ${path}`);

  // Build request headers
  const headers: Record<string, string> = {};

  // Check for session token from OAuth (preferred method)
  const sessionToken = localStorage.getItem('revelius_auth_token');
  
  if (sessionToken) {
    // Use Bearer token authentication
    headers['Authorization'] = `Bearer ${sessionToken}`;
    console.log(`[apiFetch] Using Bearer token authentication`);
  } else {
    // Fallback to signature-based authentication
    const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey, sessionId);
    Object.assign(headers, signedHeaders);
    console.log(`[apiFetch] Using signature-based authentication`);
  }

  // Add session ID header if provided (for scanner endpoints)
  if (sessionId) {
    headers['Session-Id'] = sessionId;
    console.log(`[apiFetch] Adding Session-Id header: ${sessionId}`);
  }

  // Add Content-Type for JSON requests
  if (body && responseType !== 'blob') {
    headers['Content-Type'] = 'application/json';
  }

  // Create abort controller for timeout if no signal provided
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
  const effectiveSignal = signal || controller.signal;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: effectiveSignal,
    });

    clearTimeout(timeoutId);
    
    // Log response headers to debug truncation
    console.log(`[${method} ${path}] Response Headers:`);
    console.log(`  Content-Length:`, response.headers.get('content-length'));
    console.log(`  Content-Type:`, response.headers.get('content-type'));
    console.log(`  Transfer-Encoding:`, response.headers.get('transfer-encoding'));
    console.log(`  Content-Encoding:`, response.headers.get('content-encoding'));

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: unknown;

      try {
        const errorData = await response.json();
        console.log(`[${method} ${path}] Error Response:`, errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
      } catch {
        try {
          const errorText = await response.text();
          console.log(`[${method} ${path}] Error Response (text):`, errorText);
          if (errorText) {
            errorMessage = errorText;
          }
        } catch {
          // Use default error message
        }
      }

      // Handle 401/403 - attempt token refresh once
      const sessionToken = localStorage.getItem('revelius_auth_token');
      if ((response.status === 401 || response.status === 403) && sessionToken && !opts._isRetry) {
        console.log(`[${method} ${path}] Auth error, attempting token refresh...`);
        
        const refreshed = await refreshAuthToken();
        
        if (refreshed) {
          console.log(`[${method} ${path}] Retrying request with new token...`);
          // Retry the request once with the new token
          return apiFetch<T>(path, { ...opts, _isRetry: true });
        } else {
          console.log(`[${method} ${path}] ⚠️  Refresh failed, NOT redirecting - throwing error instead`);
          // Just throw the error, let the calling code handle it
          throw new ApiError('Session expired. Please sign in again.', 401);
        }
      }

      throw new ApiError(errorMessage, response.status, errorDetails);
    }

    // Handle different response types
    if (responseType === 'blob') {
      return (await response.blob()) as T;
    }

    if (responseType === 'text') {
      return (await response.text()) as T;
    }

    // Default: JSON
    // Get raw text first to help debug JSON parsing errors
    const rawText = await response.text();
    
    console.log(`[${method} ${path}] ⚠️  Response length: ${rawText.length} bytes`);
    console.log(`[${method} ${path}] ⚠️  Last 200 chars:`, rawText.substring(Math.max(0, rawText.length - 200)));
    
    try {
      const jsonData = JSON.parse(rawText) as T;
      console.log(`[${method} ${path}] ✅ Response parsed successfully:`, jsonData);
      return jsonData;
    } catch (parseError) {
      console.error(`[${method} ${path}] ❌ JSON Parse Error:`, parseError);
      console.error(`[${method} ${path}] Response length: ${rawText.length} bytes`);
      console.error(`[${method} ${path}] Last 100 chars:`, rawText.slice(-100));
      console.error(`[${method} ${path}] First 500 chars:`, rawText.substring(0, 500));
      console.error(`[${method} ${path}] ⚠️  LIKELY CAUSE: Backend using Transfer-Encoding: chunked without Content-Length`);
      console.error(`[${method} ${path}] ⚠️  Backend must either:`);
      console.error(`[${method} ${path}]     1) Add Content-Length header (recommended), OR`);
      console.error(`[${method} ${path}]     2) Properly terminate chunked response with 0\\r\\n\\r\\n`);
      throw new ApiError(
        `Server sent incomplete JSON (${rawText.length} bytes, truncated). Backend issue: chunked encoding not properly terminated. Works in Postman because Postman is more forgiving.`,
        0
      );
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      console.log(`[${method} ${path}] Exception:`, error.message);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout after 20 seconds', 408);
      }
      throw new ApiError(error.message, 0);
    }

    throw new ApiError('Unknown error occurred', 0);
  }
}
