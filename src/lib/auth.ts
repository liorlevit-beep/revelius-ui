/**
 * Revelius Authentication Service - Popup-based OAuth
 * 
 * How it works:
 * 1. User clicks "Sign in with Google" -> opens popup to /auth/login
 * 2. Popup redirects to Google OAuth -> user authenticates
 * 3. Google redirects back to /auth/callback in popup
 * 4. Popup closes and sends token via postMessage to parent window
 * 5. Parent window stores token and navigates to dashboard
 * 6. All API requests include Authorization: Bearer <token>
 * 7. On 401/403, we attempt /auth/refresh once
 * 8. If refresh fails, clear token (no redirect since we're not using route protection)
 * 
 * FOR TESTING: Set token manually via browser console:
 * window.setReveliusToken('your-token-here')
 */

import { env } from '../config/env';

const TOKEN_KEY = 'revelius_auth_token';
const EXPIRES_KEY = 'revelius_auth_expires_at';

// TEMPORARY: Hardcoded JWT token for testing
const HARDCODED_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1NDRkMGZmMDU5MGYwMjUzMDE2NDNmMzI3NWJmNjg3NzY3NjU4MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA1Njc4Mjc1MTcyODU2Mzc0NDIiLCJoZCI6InJldmVsaXVzLmNvbSIsImVtYWlsIjoibGlvckByZXZlbGl1cy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImI1dHlyaTdvaEVFeXpkZlFUVUZuNGciLCJuYW1lIjoiTGlvciBMZXZpdCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLRjNnZm5ONlJoelh5LWdGeUo1ZjBlbUhNbkhVQlVWOFExQlI0TFpZSm5LempMZWc9czk2LWMiLCJnaXZlbl9uYW1lIjoiTGlvciIsImZhbWlseV9uYW1lIjoiTGV2aXQiLCJpYXQiOjE3NjkwODE5ODUsImV4cCI6MTc2OTA4NTU4NX0.Kyxxjcdzs7IDbYoUkP-4W32s8NC62FlYydrHpMUonx8Joxnq4Dl8YPR-ANx3TiSUwizcMp5Jiddv_8TXNQvmcOGVy2AKdRI_ElglgX6iT3LCIvu1W_WH1D7JsjHpuWLn88msGu1ufYCSMpQP95MvCVdkmLzoilXnv36VY4OMQxMM-SV0G-d8IYy8dGipUtnML4q3OoYehvwGG7DaUgtiaDz-MeZp47Lq4TWMcRu8qAojRFd98nWbGqono3lGr8sVpyps8T5hydFff8lA0u_qxWqZ2NqsYBRqQ4n0C1jBcmI8S62HSC5PuKU9G1iLPh8ATqg-r6gqLitktg4UW6ugXQ';

// ============================================================================
// Token Storage
// ============================================================================

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, expiresIn?: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  
  if (expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(EXPIRES_KEY, expiresAt.toString());
  }
  
  console.log('[Auth] Token stored successfully');
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(EXPIRES_KEY);
  if (!expiresAt) return false;
  return Date.now() > parseInt(expiresAt, 10);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired()) return false;
  return true;
}

// ============================================================================
// Popup OAuth Flow
// ============================================================================

interface OAuthPopupOptions {
  width?: number;
  height?: number;
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
}

/**
 * Open Google OAuth in a popup window
 * Returns a promise that resolves with the token
 */
export async function openGoogleSignInPopup(options: OAuthPopupOptions = {}): Promise<string> {
  console.log('[openGoogleSignInPopup] 🚀 Starting OAuth popup flow');
  
  const {
    width = 500,
    height = 600,
    onSuccess,
    onError,
  } = options;

  // Step 1: Call /auth/login API
  console.log('[openGoogleSignInPopup] Step 1: Calling startLogin() API...');
  let loginResponse: LoginResponse;
  
  try {
    loginResponse = await startLogin();
    console.log('[openGoogleSignInPopup] ✅ Login response received:', loginResponse);
  } catch (error) {
    console.error('[openGoogleSignInPopup] ❌ Failed to call /auth/login:', error);
    onError?.(error instanceof Error ? error.message : 'Authentication failed');
    throw error;
  }
  
  // Check if backend directly authenticated us (returned tokens instead of OAuth URL)
  const sessionToken = loginResponse.data?.session_token || loginResponse.session_token || loginResponse.token || loginResponse.access_token;
  const refreshToken = loginResponse.data?.refresh_token || loginResponse.refresh_token;
  
  if (sessionToken) {
    console.log('[openGoogleSignInPopup] ✅ Backend directly authenticated! Got session token.');
    console.log('[openGoogleSignInPopup] Session token:', sessionToken);
    console.log('[openGoogleSignInPopup] Refresh token:', refreshToken || 'none');
    
    // Store the session token
    setToken(sessionToken);
    
    // Store refresh token if provided
    if (refreshToken) {
      localStorage.setItem('revelius_refresh_token', refreshToken);
    }
    
    onSuccess?.(sessionToken);
    return sessionToken;
  }
  
  // If no token, we need an OAuth URL to continue
  if (!loginResponse.url) {
    const error = 'Backend returned neither tokens nor OAuth URL';
    console.error('[openGoogleSignInPopup]', error);
    onError?.(error);
    throw new Error(error);
  }
  
  // Step 2: Open OAuth popup (only if we didn't get tokens directly)
  const oauthUrl = loginResponse.url;

  return new Promise((resolve, reject) => {
    // Center the popup
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    console.log('[openGoogleSignInPopup] Step 2: Opening popup window with URL:', oauthUrl);
    
    // Open popup with OAuth URL
    const popup = window.open(
      oauthUrl,
      'google-signin',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0`
    );

    if (!popup) {
      const error = 'Failed to open popup. Please allow popups for this site.';
      onError?.(error);
      reject(new Error(error));
      return;
    }

    // Poll to check if popup is closed
    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer);
        window.removeEventListener('message', messageHandler);
        const error = 'Sign-in popup was closed';
        onError?.(error);
        reject(new Error(error));
      }
    }, 500);

    // Listen for messages from popup
    const messageHandler = (event: MessageEvent) => {
      // Security check: verify origin matches our backend
      const allowedOrigins = [
        env.baseUrl,
        window.location.origin,
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn('[Auth] Message from unknown origin:', event.origin);
        return;
      }

      // Check for auth success message
      if (event.data?.type === 'REVELIUS_AUTH_SUCCESS' && event.data?.token) {
        clearInterval(pollTimer);
        window.removeEventListener('message', messageHandler);
        
        const token = event.data.token;
        const expiresIn = event.data.expires_in;

        // Store token
        setToken(token, expiresIn);

        // Close popup
        if (!popup.closed) {
          popup.close();
        }

        onSuccess?.(token);
        resolve(token);
      }

      // Check for auth error message
      if (event.data?.type === 'REVELIUS_AUTH_ERROR') {
        clearInterval(pollTimer);
        window.removeEventListener('message', messageHandler);

        const error = event.data.error || 'Authentication failed';

        // Close popup
        if (!popup.closed) {
          popup.close();
        }

        onError?.(error);
        reject(new Error(error));
      }
    };

    window.addEventListener('message', messageHandler);
  });
}

// ============================================================================
// Auth API Calls
// ============================================================================

interface LoginResponse {
  url?: string;
  token?: string;
  access_token?: string;
  session_token?: string;
  refresh_token?: string;
  expires_in?: number;
  data?: {
    session_token?: string;
    refresh_token?: string;
    email?: string;
    name?: string;
  };
}

interface StatusResponse {
  authenticated?: boolean;
  valid?: boolean;
  user?: any;
}

interface RefreshResponse {
  token?: string;
  access_token?: string;
  expires_in?: number;
}

/**
 * Start OAuth login - calls /auth/login to get redirect URL
 */
async function startLogin(): Promise<LoginResponse> {
  // TEMPORARY: Use real JWT token for testing
  const token = getToken() || HARDCODED_TOKEN;
  
  console.log('[startLogin] 🔐 Calling /auth/login with Authorization header');
  console.log('[startLogin] Token being used:', token);
  console.log('[startLogin] URL:', `${env.baseUrl}/auth/login`);
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  
  console.log('[startLogin] Headers:', headers);
  
  const response = await fetch(`${env.baseUrl}/auth/login`, {
    method: 'GET',
    headers,
  });

  console.log('[startLogin] Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[startLogin] ❌ Login API failed:', errorText);
    throw new Error(`Login API failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('[startLogin] ✅ Login API success:', data);
  return data;
}

/**
 * Check if current token is valid
 */
export async function checkAuthStatus(): Promise<StatusResponse> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${env.baseUrl}/auth/status`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return { authenticated: false, valid: false };
    }
    throw new Error(`Status check failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refresh the current token
 */
export async function refreshToken(): Promise<RefreshResponse> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${env.baseUrl}/auth/refresh`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    await fetch(`${env.baseUrl}/auth/logout`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
  } catch (error) {
    console.warn('Logout request failed, but clearing local token anyway:', error);
  }
  
  clearToken();
}

// ============================================================================
// Helper for OAuth Callback Page (runs in popup)
// ============================================================================

/**
 * Extract token from URL and send to parent window
 * Call this in the OAuth callback page that opens in the popup
 */
export function sendTokenToParent(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  
  const token = 
    urlParams.get('token') ||
    urlParams.get('access_token') ||
    hashParams.get('token') ||
    hashParams.get('access_token');
  
  const expiresInStr = 
    urlParams.get('expires_in') ||
    hashParams.get('expires_in');
  
  const expiresIn = expiresInStr ? parseInt(expiresInStr, 10) : undefined;

  if (token) {
    // Send success message to parent window
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'REVELIUS_AUTH_SUCCESS',
          token,
          expires_in: expiresIn,
        },
        window.location.origin
      );
    }
    
    // Close popup after short delay
    setTimeout(() => {
      window.close();
    }, 500);
  } else {
    // Send error message
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'REVELIUS_AUTH_ERROR',
          error: 'No token found in callback URL',
        },
        window.location.origin
      );
    }
    
    setTimeout(() => {
      window.close();
    }, 1000);
  }
}

// ============================================================================
// Development Helper (exposed globally for testing)
// ============================================================================

/**
 * Expose token setter globally for easy testing via console
 * Usage: window.setReveliusToken('your-token-here')
 */
if (typeof window !== 'undefined') {
  (window as any).setReveliusToken = (token: string, expiresIn?: number) => {
    setToken(token, expiresIn);
    console.log('✅ Revelius token set! API requests will now include Authorization header.');
    console.log('Token preview:', token.substring(0, 20) + '...');
  };
  
  (window as any).clearReveliusToken = () => {
    clearToken();
    console.log('✅ Revelius token cleared!');
  };
  
  (window as any).getReveliusToken = () => {
    const token = getToken();
    if (token) {
      console.log('Current token:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.log('No token set');
      return null;
    }
  };
}
