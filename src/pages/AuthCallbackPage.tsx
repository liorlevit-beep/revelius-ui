import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTokenFromUrl, setToken } from '../lib/auth';

/**
 * OAuth Callback Handler
 * 
 * Handles redirect from Google OAuth with token in URL
 * Supports: ?token=..., ?access_token=..., #token=..., #access_token=...
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      // Extract token from URL
      const { token, expiresIn } = extractTokenFromUrl();

      if (!token) {
        throw new Error('No token found in callback URL');
      }

      console.log('[AuthCallback] Token received, storing...');
      
      // Store token
      setToken(token, expiresIn || undefined);

      setStatus('success');

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('[AuthCallback] Callback handling failed:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');

      // Redirect to auth page after delay
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl text-center">
          {status === 'processing' && (
            <>
              <div className="mb-6">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Completing sign in...
              </h2>
              <p className="text-gray-400">
                Please wait while we verify your credentials
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign in successful!
              </h2>
              <p className="text-gray-400">
                Redirecting to dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Authentication failed
              </h2>
              <p className="text-gray-400 mb-4">
                {errorMessage || 'Unable to complete sign in'}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
