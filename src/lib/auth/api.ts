/**
 * Authentication API calls
 * Uses existing Web Authentication endpoints from Postman collection
 */

import { getEnvConfig } from '../../config/env';
import { getSignedHeaders } from '../../api/signer';
import { getSessionToken, storeTokens, clearTokens } from './storage';
import { authLogger } from './logger';

interface LoginResponse {
  data: {
    session_token: string;
    refresh_token?: string;
    email?: string;
    name?: string;
    expires_in?: number;
  } | null;
  error: string | null;
  status_code: number;
  success: boolean;
}

interface StatusResponse {
  data: {
    authenticated: boolean;
    email?: string;
    user_id?: string;
  } | null;
  error: string | null;
  status_code: number;
  success: boolean;
}

interface RefreshResponse {
  data: {
    session_token: string;
    refresh_token?: string;
    expires_in?: number;
  } | null;
  error: string | null;
  status_code: number;
  success: boolean;
}

/**
 * Exchange Google ID token for backend session
 * POST /auth/google (or similar endpoint for token exchange)
 */
export async function exchangeGoogleToken(
  googleIdToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    authLogger.exchangingToken();
    
    const env = getEnvConfig();
    const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
    
    const response = await fetch(`${env.baseUrl}/auth/login`, {
      method: 'GET',
      headers: {
        ...signedHeaders,
        'Authorization': `Bearer ${googleIdToken}`,
      },
      credentials: 'include', // Include cookies if backend uses them
    });

    const data: LoginResponse = await response.json();
    
    const hasToken = !!data.data?.session_token;
    const hasCookie = response.headers.get('set-cookie') !== null;
    
    authLogger.exchangeSuccess(response.status, hasToken, hasCookie);

    if (!response.ok || !data.success) {
      authLogger.exchangeFailed(response.status, data.error || 'Unknown error');
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }

    // Store tokens if provided
    if (data.data?.session_token) {
      storeTokens(
        data.data.session_token,
        data.data.refresh_token,
        data.data.expires_in
      );
      authLogger.storedToken(data.data.session_token);
    } else {
      // Backend is using cookie-only session
      authLogger.cookieSession();
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    authLogger.exchangeFailed(0, message);
    return { success: false, error: message };
  }
}

/**
 * Check authentication status
 * GET /auth/status
 */
export async function checkAuthStatus(): Promise<{
  authenticated: boolean;
  error?: string;
}> {
  try {
    const env = getEnvConfig();
    const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
    const sessionToken = getSessionToken();

    const headers: Record<string, string> = {
      ...signedHeaders,
    };

    // Add Authorization header if we have a token
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    const response = await fetch(`${env.baseUrl}/auth/status`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data: StatusResponse = await response.json();

    if (!response.ok || !data.success || !data.data?.authenticated) {
      authLogger.authStatusFailed(data.error || 'Not authenticated');
      return { authenticated: false, error: data.error || 'Not authenticated' };
    }

    authLogger.authStatusOk();
    return { authenticated: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    authLogger.authStatusFailed(message);
    return { authenticated: false, error: message };
  }
}

/**
 * Refresh authentication token
 * GET /auth/refresh
 */
export async function refreshAuthToken(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    authLogger.refreshing();
    
    const env = getEnvConfig();
    const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
    const sessionToken = getSessionToken();

    const headers: Record<string, string> = {
      ...signedHeaders,
    };

    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    const response = await fetch(`${env.baseUrl}/auth/refresh`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data: RefreshResponse = await response.json();

    if (!response.ok || !data.success) {
      authLogger.refreshFailed(data.error || 'Unknown error');
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }

    // Update stored tokens if provided
    if (data.data?.session_token) {
      storeTokens(
        data.data.session_token,
        data.data.refresh_token,
        data.data.expires_in
      );
      authLogger.storedToken(data.data.session_token);
    }

    authLogger.refreshSuccess();
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    authLogger.refreshFailed(message);
    return { success: false, error: message };
  }
}

/**
 * Logout
 * GET /auth/logout
 */
export async function logout(): Promise<void> {
  try {
    const env = getEnvConfig();
    const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
    const sessionToken = getSessionToken();

    const headers: Record<string, string> = {
      ...signedHeaders,
    };

    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    await fetch(`${env.baseUrl}/auth/logout`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
  } catch (error) {
    console.error('[Auth] Logout error:', error);
  } finally {
    // Always clear local tokens
    clearTokens();
  }
}

/**
 * Verify auth status with automatic refresh fallback
 * Returns true if authenticated (after refresh if needed)
 */
export async function verifyAuthWithRefresh(): Promise<boolean> {
  // First check status
  const statusResult = await checkAuthStatus();
  
  if (statusResult.authenticated) {
    return true;
  }

  // If not authenticated, try refresh once
  const refreshResult = await refreshAuthToken();
  
  if (!refreshResult.success) {
    return false;
  }

  // Check status again after refresh
  const statusAfterRefresh = await checkAuthStatus();
  return statusAfterRefresh.authenticated;
}
