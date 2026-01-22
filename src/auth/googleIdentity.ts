/**
 * Google Identity Services (GIS) helper
 * Loads GIS and requests Google ID tokens for SSO
 * 
 * Developer note: Set VITE_GOOGLE_CLIENT_ID in .env.local
 * Example: VITE_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
 * Requires Vite restart after changing .env
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          prompt: (listener?: (notification: PromptMomentNotification) => void) => void;
        };
      };
    };
  }
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface CredentialResponse {
  credential: string;
  select_by?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
  getMomentType: () => string;
}

/**
 * Ensure Google Identity Services is loaded
 * Waits up to 5 seconds for script to load
 */
export function ensureGoogleLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    // Wait for script to load (max 5 seconds)
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > 5000) {
        clearInterval(checkInterval);
        reject(new Error('Google Identity Services failed to load. Please refresh the page.'));
      }
    }, 100);
  });
}

/**
 * Request Google ID token via GIS
 * Shows Google sign-in prompt/popup
 * 
 * @param clientId - Google OAuth2 client ID from VITE_GOOGLE_CLIENT_ID
 * @returns Promise resolving to JWT ID token
 */
export function requestGoogleIdToken(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    let resolved = false;

    // Initialize GIS with callback
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: CredentialResponse) => {
        if (resolved) return;
        resolved = true;

        if (!response.credential) {
          reject(new Error('Google sign-in did not return a token'));
          return;
        }

        // Log only in dev mode (length + first 10 chars, never full token)
        if (import.meta.env.DEV) {
          console.log(
            `[Auth] Google ID token received: ${response.credential.substring(0, 10)}... (${response.credential.length} chars)`
          );
        }

        resolve(response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Trigger the sign-in prompt
    window.google.accounts.id.prompt((notification) => {
      if (resolved) return;

      // Check if prompt was not displayed
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const reason = notification.getNotDisplayedReason?.() || notification.getSkippedReason?.() || 'unknown';
        
        if (reason === 'suppressed_by_user' || reason === 'tap_outside') {
          reject(new Error('Sign-in was cancelled'));
        } else if (reason === 'browser_not_supported') {
          reject(new Error('Your browser does not support Google Sign-In'));
        } else {
          reject(new Error('Google Sign-In popup was blocked or not displayed. Please allow popups for this site.'));
        }
        resolved = true;
      }

      // Check if dismissed
      if (notification.isDismissedMoment()) {
        reject(new Error('Sign-in was dismissed'));
        resolved = true;
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error('Sign-in timeout. Please try again.'));
      }
    }, 60000);
  });
}
