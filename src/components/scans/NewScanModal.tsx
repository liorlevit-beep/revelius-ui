import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { ScannerAPI } from '../../api';
import { scanJobsStore } from '../../lib/scans/scanJobsStore';

interface NewScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (sessionId: string) => void;
}

export function NewScanModal({ isOpen, onClose, onSuccess }: NewScanModalProps) {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setError(null);
      setIsSubmitting(false);
      setCompletedSessionId(null);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const validateAndFormatUrl = (urlString: string): string | null => {
    let formatted = urlString.trim();
    
    // Auto-prefix https:// if missing
    if (formatted && !formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }

    try {
      const parsed = new URL(formatted);
      return parsed.href;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedUrl = validateAndFormatUrl(url);
    if (!formattedUrl) {
      setError('Please enter a valid website URL');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await ScannerAPI.scanWebsite(formattedUrl);
      
      // Extract session_id from response
      const sessionId = response?.data?.session_id;
      
      if (!sessionId) {
        throw new Error('No session ID returned from scan');
      }

      // Add to scan jobs store for tracking
      scanJobsStore.addJob({
        session_id: sessionId,
        url: formattedUrl,
        started_at: new Date().toISOString(),
        last_status: 'pending',
      });

      // Show confirmation state
      setCompletedSessionId(sessionId);
      setShowConfirmation(true);

      // Auto-close after 1.5 seconds and trigger success callback
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess(sessionId);
        }
      }, 1500);
    } catch (err: any) {
      console.error('Scan failed:', err);
      setError(err.message || 'Failed to start scan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start a Scan</h2>
            <p className="text-sm text-gray-600 max-w-lg">
              Generate an evidence-grade snapshot of a website's products, claims, and media.
            </p>
          </div>

          {/* Decorative Flow Visual */}
          <div className="px-8 py-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-center gap-6">
              {/* Website Node */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center transition-transform hover:scale-105">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Website</span>
              </div>

              {/* Connection Line 1 with animated dot */}
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-emerald-200 relative">
                <div className="absolute top-1/2 left-0 w-2 h-2 -mt-1 bg-blue-500 rounded-full shadow-lg animate-flow-dot" />
              </div>

              {/* Revelius Node */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-300 flex items-center justify-center relative transition-transform hover:scale-105">
                  <div className="absolute inset-0 rounded-xl bg-emerald-400/20 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700 relative z-10">R</span>
                </div>
                <span className="text-xs font-medium text-gray-600">Revelius</span>
              </div>

              {/* Connection Line 2 with animated dot */}
              <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-200 via-purple-200 to-purple-200 relative">
                <div className="absolute top-1/2 left-0 w-2 h-2 -mt-1 bg-emerald-500 rounded-full shadow-lg animate-flow-dot" style={{ animationDelay: '1.5s' }} />
              </div>

              {/* Evidence Node */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-purple-100 border-2 border-purple-200 flex items-center justify-center transition-transform hover:scale-105">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Evidence</span>
              </div>
            </div>
          </div>

          {/* Form or Confirmation */}
          {!showConfirmation ? (
            <form onSubmit={handleSubmit} className="px-8 py-6">
              <div className="space-y-4">
                {/* URL Input */}
                <div>
                  <label htmlFor="scan-url" className="block text-sm font-semibold text-gray-900 mb-2">
                    Website URL
                  </label>
                  <input
                    id="scan-url"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                    }}
                    placeholder="https://example.com"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:shadow-emerald-100 focus:shadow-lg focus:border-transparent focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    We'll crawl key pages and media assets and attach the results to future transactions.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !url.trim()}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    'Start Scan'
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation State */
            <div className="px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scan Started!</h3>
                
                {/* Session ID */}
                {completedSessionId && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg mb-3">
                    <span className="text-xs text-gray-500">Session:</span>
                    <code className="text-xs font-mono font-semibold text-gray-900">{completedSessionId}</code>
                  </div>
                )}

                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                  We'll notify you here when it's ready.
                </p>

                {/* View Scan Button */}
                <button
                  onClick={() => {
                    if (completedSessionId) {
                      navigate(`/scans/${completedSessionId}`);
                      onClose();
                    }
                  }}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                >
                  View Scan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes flow-dot {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
        
        .animate-flow-dot {
          animation: flow-dot 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-flow-dot {
            animation: none;
            opacity: 0.3;
            left: 50%;
          }
        }
      `}</style>
    </>
  );
}
