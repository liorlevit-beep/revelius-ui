/**
 * Google Identity Services (GIS) authentication logic
 * Handles Google Sign-In button and credential callback
 */

import { authLogger } from './logger';
import { exchangeGoogleToken } from './api';

// Google Identity Services types are declared in AuthPage.tsx to avoid conflicts

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

/**
 * Decode JWT payload without verification
 * (Verification happens on backend)
 */
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[Auth] Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if Google Identity Services is loaded
 */
export function isGISLoaded(): boolean {
  const loaded = !!window.google?.accounts?.id;
  if (loaded) {
    authLogger.gisLoaded();
  } else {
    authLogger.gisNotLoaded();
  }
  return loaded;
}

/**
 * Load Google Identity Services script
 */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.accounts?.id) {
      authLogger.gisLoaded();
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => {
        authLogger.gisLoaded();
        resolve();
      });
      existing.addEventListener('error', reject);
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      authLogger.gisLoaded();
      resolve();
    };
    script.onerror = () => {
      authLogger.gisNotLoaded();
      reject(new Error('Failed to load Google Identity Services'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Initialize Google Sign-In with credential callback
 */
export function initializeGoogleSignIn(
  clientId: string,
  onSuccess: () => void,
  onError: (error: string) => void
): void {
  if (!window.google?.accounts?.id) {
    authLogger.gisNotLoaded();
    onError('Google Identity Services not loaded');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: async (response: GoogleCredentialResponse) => {
      await handleGoogleCredential(response, clientId, onSuccess, onError);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });
}

/**
 * Handle Google credential callback with validation and exchange
 */
async function handleGoogleCredential(
  response: GoogleCredentialResponse,
  expectedClientId: string,
  onSuccess: () => void,
  onError: (error: string) => void
): Promise<void> {
  // Guard: Check if credential exists
  if (!response.credential) {
    authLogger.noCredential();
    onError('Google sign-in did not return a token.');
    return;
  }

  const credential = response.credential;
  authLogger.credentialReceived(credential);

  // Decode and validate JWT payload
  const payload = decodeJWT(credential);
  if (!payload) {
    onError('Failed to decode Google credential');
    return;
  }

  authLogger.decodedToken(payload);

  // Validate audience (aud) matches our client ID
  if (payload.aud !== expectedClientId) {
    authLogger.clientIdMismatch(expectedClientId, payload.aud);
    onError('Client ID mismatch: token audience does not match this app.');
    return;
  }

  // Exchange token with backend
  const result = await exchangeGoogleToken(credential);

  if (!result.success) {
    onError(result.error || 'Backend authentication failed');
    return;
  }

  // Success!
  onSuccess();
}

/**
 * Trigger Google One Tap prompt
 */
export function showGoogleOneTap(): void {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.prompt();
  }
}

/**
 * Render Google Sign-In button
 */
export function renderGoogleButton(
  parentElement: HTMLElement,
  options?: Partial<GoogleButtonConfiguration>
): void {
  if (!window.google?.accounts?.id) {
    authLogger.gisNotLoaded();
    return;
  }

  const defaultOptions: GoogleButtonConfiguration = {
    type: 'standard',
    theme: 'filled_blue',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    width: parentElement.offsetWidth.toString(),
  };

  window.google.accounts.id.renderButton(
    parentElement,
    { ...defaultOptions, ...options }
  );
}
