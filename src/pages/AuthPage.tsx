import { useState } from 'react';
import { openGoogleSignInPopup } from '../lib/auth';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);

    try {
      const token = await openGoogleSignInPopup({
        onSuccess: (token) => {
          console.log('[Auth] Successfully authenticated, token stored');
          // Redirect to dashboard or reload page
          window.location.href = '/dashboard';
        },
        onError: (err) => {
          console.error('[Auth] Authentication failed:', err);
          setError(err);
          setIsLoading(false);
        },
      });

      console.log('[Auth] Token received:', token.substring(0, 20) + '...');
    } catch (err) {
      console.error('[Auth] Sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900/30 flex items-center justify-center p-4">
      {/* Auth Modal Card */}
      <div className="w-full max-w-md">
        <div className="bg-[#2a2a2a] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Close button (top right) */}
          <div className="flex justify-end p-4">
            <button 
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-8 pb-8">
            {/* Toggle Tabs */}
            <div className="flex gap-2 mb-8 bg-black/20 rounded-full p-1">
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign up
              </button>
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
                  mode === 'signin'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign in
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-8">
              {mode === 'signup' ? 'Create an account' : 'Welcome back'}
            </h2>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Form Fields (placeholder - we'll use Google SSO) */}
            {mode === 'signup' && (
              <div className="space-y-4 mb-6 opacity-50 pointer-events-none">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500"
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500"
                    disabled
                  />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500"
                  disabled
                />
                <button
                  disabled
                  className="w-full bg-purple-600 text-white font-semibold py-4 rounded-xl opacity-50"
                >
                  Create an account
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#2a2a2a] text-gray-500 uppercase text-xs tracking-wider">
                  {mode === 'signup' ? 'Or sign up with' : 'Sign in with'}
                </span>
              </div>
            </div>

            {/* Social Sign-in Buttons */}
            <div className="space-y-3">
              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/10 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google</span>
                  </>
                )}
              </button>

              {/* Apple Button (disabled for now) */}
              <button
                disabled
                className="w-full bg-white/5 border border-white/10 text-white/30 font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Footer Terms */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                Terms & Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
