import type { SignedHeaders } from './types';

/**
 * Generate signed headers for API authentication
 * Matches the Postman collection's authentication scheme exactly
 */
export async function getSignedHeaders(
  accessKey: string,
  secretKey: string,
  sessionId?: string
): Promise<SignedHeaders> {
  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  
  // Build headers object
  const baseHeaders: Record<string, string> = {
    'Access-Key': accessKey,
    'Timestamp': timestamp,
  };
  
  if (sessionId) {
    baseHeaders['Session-Id'] = sessionId;
  }

  // Sort headers alphabetically and create query string format
  const sorted = Object.entries(baseHeaders)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  // Base64 encode the sorted string + secret key
  const base64String = btoa(sorted + secretKey);

  // SHA256 hash of the base64 string
  const signature = await sha256(base64String);

  // Return complete signed headers
  const result: SignedHeaders = {
    'Access-Key': accessKey,
    'Timestamp': timestamp,
    'Signature': signature,
  };

  if (sessionId) {
    result['Session-Id'] = sessionId;
  }

  return result;
}

/**
 * SHA256 hash function using Web Crypto API
 */
async function sha256(message: string): Promise<string> {
  // Use Web Crypto API (available in modern browsers)
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
