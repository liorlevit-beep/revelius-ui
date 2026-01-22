/**
 * Dev-only authentication logger
 * Only logs when in development mode
 */

const PREFIX = '[Auth]';
const IS_DEV = import.meta.env.DEV;

export const authLogger = {
  gisLoaded: () => {
    if (IS_DEV) console.log(`${PREFIX} ✅ GIS loaded (window.google.accounts.id exists)`);
  },

  buttonClicked: () => {
    if (IS_DEV) console.log(`${PREFIX} 🔘 Login button clicked`);
  },

  credentialReceived: (credential: string) => {
    if (IS_DEV) {
      const preview = credential.substring(0, 16);
      const length = credential.length;
      console.log(`${PREFIX} 🎫 Google credential received: ${preview}... (${length} chars)`);
    }
  },

  decodedToken: (payload: any) => {
    if (IS_DEV) {
      console.log(`${PREFIX} 🔍 Decoded JWT payload:`, {
        aud: payload.aud,
        exp: payload.exp,
        iss: payload.iss,
        email: payload.email || '(not present)',
      });
    }
  },

  clientIdMismatch: (expected: string, actual: string) => {
    if (IS_DEV) {
      console.error(
        `${PREFIX} ❌ Client ID mismatch!\n  Expected: ${expected}\n  Token aud: ${actual}`
      );
    }
  },

  exchangingToken: () => {
    if (IS_DEV) console.log(`${PREFIX} 🔄 Exchanging token with backend...`);
  },

  exchangeSuccess: (statusCode: number, hasToken: boolean, hasCookie: boolean) => {
    if (IS_DEV) {
      const mode = hasToken ? 'token mode' : hasCookie ? 'cookie mode' : 'unknown mode';
      console.log(`${PREFIX} ✅ Backend exchange success (${statusCode}) - ${mode}`);
    }
  },

  exchangeFailed: (statusCode: number, error: string) => {
    if (IS_DEV) {
      console.error(`${PREFIX} ❌ Backend exchange failed (${statusCode}): ${error}`);
    }
  },

  storedToken: (token: string) => {
    if (IS_DEV) {
      const preview = token.substring(0, 10);
      console.log(`${PREFIX} 💾 Stored app token: ${preview}...`);
    }
  },

  cookieSession: () => {
    if (IS_DEV) console.log(`${PREFIX} 🍪 Cookie session mode`);
  },

  authStatusOk: () => {
    if (IS_DEV) console.log(`${PREFIX} ✅ Auth status ok`);
  },

  authStatusFailed: (reason: string) => {
    if (IS_DEV) console.error(`${PREFIX} ❌ Auth status failed: ${reason}`);
  },

  redirecting: (to: string) => {
    if (IS_DEV) console.log(`${PREFIX} 🚀 Redirecting to ${to}`);
  },

  refreshing: () => {
    if (IS_DEV) console.log(`${PREFIX} 🔄 Attempting token refresh...`);
  },

  refreshSuccess: () => {
    if (IS_DEV) console.log(`${PREFIX} ✅ Token refresh successful`);
  },

  refreshFailed: (reason: string) => {
    if (IS_DEV) console.error(`${PREFIX} ❌ Token refresh failed: ${reason}`);
  },

  gisNotLoaded: () => {
    if (IS_DEV) console.error(`${PREFIX} ❌ GIS not loaded (window.google is undefined)`);
  },

  popupBlocked: () => {
    if (IS_DEV) console.error(`${PREFIX} ❌ Popup blocked by browser`);
  },

  noCredential: () => {
    if (IS_DEV) console.error(`${PREFIX} ❌ No credential returned from Google`);
  },
};
