import SHA256 from 'crypto-js/sha256';

/**
 * Generate signed headers for API authentication
 * 
 * Algorithm:
 * 1. Create headers object with Access-Key, Timestamp, and optional Session-Id
 * 2. Sort headers alphabetically by key
 * 3. Format as "key=encodedValue&key=encodedValue..."
 * 4. Base64 encode the sorted string + secret key
 * 5. SHA256 hash the base64 string
 * 6. Return headers with Signature added
 */
export function getSignedHeaders(
  accessKey: string,
  secretKey: string,
  sessionId?: string
): Record<string, string> {
  // Current timestamp in unix seconds
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Build base headers
  const headers: Record<string, string> = {
    "Access-Key": accessKey,
    "Timestamp": timestamp,
  };

  // Add Session-Id if provided
  if (sessionId) {
    headers["Session-Id"] = sessionId;
  }

  // Sort headers alphabetically and format as query string
  const sorted = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  // Base64 encode the sorted string + secret key
  const base64String = btoa(sorted + secretKey);

  // Generate SHA256 signature
  const signature = SHA256(base64String).toString();

  // Return complete signed headers
  return {
    ...headers,
    "Signature": signature,
  };
}
