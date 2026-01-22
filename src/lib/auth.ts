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
export function openGoogleSignInPopup(options: OAuthPopupOptions = {}): Promise<string> {
  const {
    width = 500,
    height = 600,
    onSuccess,
    onError,
  } = options;

  return new Promise((resolve, reject) => {
    // Center the popup
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // Open popup
    const popup = window.open(
      `${env.baseUrl}/auth/login`,
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
