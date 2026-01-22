import { getEnvConfig } from '../config/env';
import { getSignedHeaders } from './signer';

/**
 * Custom API error with status code and optional details
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  sessionId?: string;
  signal?: AbortSignal;
  responseType?: 'json' | 'blob' | 'text';
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

  // Get signed headers
  const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey, sessionId);

  // Build request headers
  const headers: Record<string, string> = {
    ...signedHeaders,
  };

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
