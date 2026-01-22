/**
 * Environment configuration with runtime validation
 * Priority: localStorage → environment variables → error
 */

interface EnvConfig {
  baseUrl: string;
  accessKey: string;
  secretKey: string;
  mock: boolean;
  googleClientId?: string;
}

function getEnv(): EnvConfig {
  // Try to get keys from localStorage first (set by ApiKeysModal)
  const localAccessKey = typeof window !== 'undefined' ? localStorage.getItem('revelius_access_key') : null;
  const localSecretKey = typeof window !== 'undefined' ? localStorage.getItem('revelius_secret_key') : null;

  // Fall back to environment variables
  const baseUrl = import.meta.env.VITE_REVELIUS_API_BASE_URL;
  const envAccessKey = import.meta.env.VITE_REVELIUS_ACCESS_KEY;
  const envSecretKey = import.meta.env.VITE_REVELIUS_SECRET_KEY;
  const mockFlag = import.meta.env.VITE_REVELIUS_MOCK || "0";
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Use localStorage keys if available, otherwise env vars
  const accessKey = localAccessKey || envAccessKey;
  const secretKey = localSecretKey || envSecretKey;

  // Validate required values
  if (!baseUrl) {
    throw new Error("VITE_REVELIUS_API_BASE_URL is required in environment configuration");
  }
  if (!accessKey) {
    throw new Error("Access key is required. Please configure it via the API Keys modal or environment variables.");
  }
  if (!secretKey) {
    throw new Error("Secret key is required. Please configure it via the API Keys modal or environment variables.");
  }

  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return {
    baseUrl: cleanBaseUrl,
    accessKey,
    secretKey,
    mock: mockFlag === "1",
    googleClientId,
  };
}

/**
 * Get current environment config
 * Call this when you need fresh config (e.g., after keys are updated)
 */
export function getEnvConfig(): EnvConfig {
  return getEnv();
}

/**
 * Initial environment config
 * Note: This may throw if keys are not configured
 */
export let env: EnvConfig;

try {
  env = getEnv();
} catch (error) {
  // If keys are missing, set a placeholder config
  // The API will fail gracefully and the modal will prompt for keys
  env = {
    baseUrl: import.meta.env.VITE_REVELIUS_API_BASE_URL || 'http://api.revelius.com',
    accessKey: '',
    secretKey: '',
    mock: (import.meta.env.VITE_REVELIUS_MOCK || "0") === "1",
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  };
  console.warn('API keys not configured. Please use the API Keys modal to configure.');
}
