import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DarkGradientBackground } from '../components/ui/DarkGradientBackground';
import { ensureGoogleLoaded, requestGoogleIdToken } from '../auth/googleIdentity';
import { exchangeGoogleIdToken, status } from '../auth/auth';
import styles from './AuthPage.module.css';

// Declare particlesJS on window
declare global {
  interface Window {
    particlesJS: any;
  }
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for session expiry reason
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'expired') {
      setError('Your session expired. Please log in again.');
    }
  }, [searchParams]);

  // Ensure dark mode is active for the animated background
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains('dark');
    
    // Add dark class for the auth page
    html.classList.add('dark');

    // Cleanup: restore previous state
    return () => {
      if (!wasDark) {
        html.classList.remove('dark');
      }
    };
  }, []);

  // Initialize particles.js
  useEffect(() => {
    // Load particles.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      // Initialize particles
      if (window.particlesJS) {
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: '#ffffff'
            },
            shape: {
              type: 'circle',
              stroke: {
                width: 0,
                color: '#000000'
              }
            },
            opacity: {
              value: 0.3,
              random: true,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#ffffff',
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'grab'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1
                }
              },
              push: {
                particles_nb: 4
              }
            }
          },
          retina_detect: true
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /**
   * Handle Google Sign-In button click
   * Developer note: Requires VITE_GOOGLE_CLIENT_ID in .env.local
   * Example: VITE_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
   */
  async function handleGoogleSignIn() {
    setError(null);
    setIsLoading(true);

    try {
      // Check for client ID
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setError('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID.');
        setIsLoading(false);
        return;
      }

      // Ensure Google Identity Services is loaded
      await ensureGoogleLoaded();

      // Request Google ID token (shows Google sign-in prompt)
      const idToken = await requestGoogleIdToken(clientId);

      // Exchange with backend for Revelius session token
      await exchangeGoogleIdToken(idToken);

      // Optional: Verify session status
      const isAuthenticated = await status();
      if (!isAuthenticated) {
        throw new Error('Authentication verification failed');
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setError(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Gradient Background (from dashboard) */}
      <DarkGradientBackground enabled={true} intensity="strong" />

      {/* Particles Layer - above gradient, needs pointer events for interactivity */}
      <div id="particles-js" className="fixed inset-0 z-[5]"></div>

      {/* Auth Modal Card - above particles */}
      <div className="w-full max-w-md relative z-[10]">
        <div 
          className="rounded-3xl p-10 relative"
          style={{
            background: `
              linear-gradient(to bottom, 
                rgba(20, 20, 30, 0.65),
                rgba(25, 20, 35, 0.70) 33%,
                rgba(18, 18, 28, 0.68)
              )
            `,
            backdropFilter: 'blur(20px) saturate(1.3) contrast(1.1)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.3) contrast(1.1)',
            boxShadow: `
              0 0 0 0.5px rgba(168, 85, 247, 0.4),
              inset -0.35em -0.35em 0.25em -0.25em hsl(257, 70%, 96%, 0.05),
              inset -0.33em -1em 0.75em -0.75em hsl(240, 65%, 94%, 0.05),
              rgba(168, 85, 247, 0.2) 0px 0.3em 0.8em 0px,
              rgba(147, 100, 247, 0.15) 0px 0.18em 0.5em 0px,
              rgba(120, 130, 247, 0.12) 0px 0.05em 0.2em 0px
            `
          }}
        >
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Welcome to Revelius
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              Sign in to access your payment routing dashboard and fraud prevention tools.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full disabled:cursor-not-allowed disabled:opacity-50 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden ${styles.googleButton}`}
            style={isLoading ? {} : {
              color: '#0a0a0a',
              background: `
                linear-gradient(to bottom, 
                  hsl(257, 70%, 94%),
                  hsl(257, 75%, 90%, 0.9) 33%,
                  hsl(257, 65%, 97%, 0.9)) padding-box,
                linear-gradient(165deg, 
                  hsl(257, 80%, 93%, 0.95) 25%,
                  hsl(240, 70%, 94%, 0.9)) border-box
              `,
              backdropFilter: 'blur(12px) saturate(1.5) contrast(1.1)',
              WebkitBackdropFilter: 'blur(12px) saturate(1.5) contrast(1.1)',
              border: '1px solid transparent',
              boxShadow: `
                inset 0 0 0 0 hsl(257, 50%, 100%, 0),
                inset -0.35em -0.35em 0.25em -0.25em hsl(257, 70%, 96%),
                inset -0.33em -1em 0.75em -0.75em hsl(240, 65%, 94%),
                rgba(168, 85, 247, 0.22) 0px 0.3em 0.3em 0px,
                rgba(147, 100, 247, 0.18) 0px 0.18em 0.18em 0px,
                rgba(120, 130, 247, 0.15) 0px 0.05em 0.05em 0px
              `
            }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-900">Connecting...</span>
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
            By continuing, you acknowledge that you have read and agree to our{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
