import { useEffect, useState } from 'react';
import { sendTokenToParent } from '../lib/auth';

/**
 * OAuth Callback Handler (runs in popup)
 * 
 * This page opens in the popup window after Google OAuth completes.
 * It extracts the token from the URL and sends it to the parent window via postMessage.
 */
export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    handleCallback();
  }, []);

  function handleCallback() {
    try {
      // Extract token and send to parent window
      sendTokenToParent();
      setStatus('success');
    } catch (error) {
      console.error('[AuthCallback] Failed to send token:', error);
      setStatus('error');
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
                This window will close automatically
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
                Closing window...
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
                Please close this window and try again
              </p>
              <button
                onClick={() => window.close()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
