/**
 * Authentication Service
 * Handles Google ID token exchange, session token storage, refresh, and logout
 */

import { env } from '../config/env';

const TOKEN_KEY = 'revelius_auth_token';
const EXPIRES_AT_KEY = 'revelius_auth_expires_at';

// Token storage
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, expiresIn?: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  
  if (expiresIn) {
    const expiresAt = Date.now() + (expiresIn * 1000);
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
  }
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  if (!expiresAt) return false; // No expiry set, assume valid
  
  return Date.now() > parseInt(expiresAt, 10);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token && !isTokenExpired();
}

// Exchange Google ID token for app session token
export async function exchangeGoogleToken(idToken: string): Promise<{ token: string; expiresIn?: number }> {
  console.log('[exchangeGoogleToken] Exchanging Google ID token for session token');
  
  const response = await fetch(`${env.baseUrl}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[exchangeGoogleToken] Exchange failed:', errorText);
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Handle different response formats
  const token = data.token || data.access_token || data.data?.session_token;
  const expiresIn = data.expires_in || data.expiresIn;
  
  if (!token) {
    throw new Error('No token in response');
  }

  return { token, expiresIn };
}

// Check token status
export async function checkAuthStatus(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${env.baseUrl}/auth/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('[checkAuthStatus] Status check failed:', error);
    return false;
  }
}

// Refresh token
export async function refreshToken(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;

  console.log('[refreshToken] Attempting to refresh token');

  try {
    const response = await fetch(`${env.baseUrl}/auth/refresh`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('[refreshToken] Refresh failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    const newToken = data.token || data.access_token || data.data?.session_token;
    const expiresIn = data.expires_in || data.expiresIn;

    if (newToken) {
      setToken(newToken, expiresIn);
      console.log('[refreshToken] Token refreshed successfully');
      return newToken;
    }

    return null;
  } catch (error) {
    console.error('[refreshToken] Refresh error:', error);
    return null;
  }
}

// Logout
export async function logout(): Promise<void> {
  const token = getToken();
  
  console.log('[logout] Logging out');

  // Call backend logout if token exists
  if (token) {
    try {
      await fetch(`${env.baseUrl}/auth/logout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('[logout] Logout request failed:', error);
    }
  }

  // Always clear local token
  clearToken();
}

// Expose for console testing
if (typeof window !== 'undefined') {
  (window as any).setReveliusToken = setToken;
  (window as any).clearReveliusToken = clearToken;
  (window as any).getReveliusToken = getToken;
}
